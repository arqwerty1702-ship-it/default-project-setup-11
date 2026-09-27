import json
import os
import re
import hmac
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}

STATUSES = {'new', 'in_work', 'done', 'spam'}
SMTP_LOGIN = 'legal-dome@mail.ru'


def resp(status: int, data) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def q(value) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def check_password(password: str, stored: str) -> bool:
    try:
        _, iterations, salt, digest = stored.split('$')
    except ValueError:
        return False
    calc = hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), int(iterations)).hex()
    return hmac.compare_digest(calc, digest)


def get_smtp_password(cur, schema: str) -> str:
    cur.execute(f"SELECT value FROM {schema}.private_settings WHERE key = 'smtp_password'")
    row = cur.fetchone()
    return (row[0] if row else '').strip()


def send_email(to_addr: str, lead: dict, password: str) -> bool:
    if not password or not to_addr:
        return False
    text = (
        f"Новая заявка с сайта Legal Dome\n\n"
        f"Имя: {lead['name']}\n"
        f"Телефон: {lead['phone']}\n"
        f"Тема: {lead['topic'] or '—'}\n\n"
        f"Ситуация:\n{lead['message']}\n\n"
        f"Все заявки: https://leg-dom.ru/admin"
    )
    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header(f"Заявка с сайта: {lead['name']}, {lead['phone']}", 'utf-8')
    msg['From'] = formataddr((str(Header('Сайт Legal Dome', 'utf-8')), SMTP_LOGIN))
    msg['To'] = to_addr
    with smtplib.SMTP_SSL('smtp.mail.ru', 465, timeout=8) as server:
        server.login(SMTP_LOGIN, password)
        server.sendmail(SMTP_LOGIN, [a.strip() for a in to_addr.split(',') if a.strip()], msg.as_string())
    return True


def handler(event: dict, context) -> dict:
    """Заявки с сайта: приём с формы, отправка на почту и управление из админ-панели."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    schema = '"' + os.environ['MAIN_DB_SCHEMA'] + '"'
    body = json.loads(event.get('body') or '{}')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()

    if method == 'POST' and not body.get('action'):
        name = str(body.get('name') or '').strip()[:200]
        phone = str(body.get('phone') or '').strip()[:50]
        topic = str(body.get('topic') or '').strip()[:100]
        message = str(body.get('message') or '').strip()[:5000]
        digits = re.sub(r'\D', '', phone)
        if len(name) < 2 or not (10 <= len(digits) <= 12):
            conn.close()
            return resp(400, {'error': 'Проверьте имя и телефон'})
        if body.get('website'):
            conn.close()
            return resp(200, {'ok': True})
        ip = ((event.get('requestContext') or {}).get('identity') or {}).get('sourceIp', '')
        cur.execute(
            f"SELECT count(*) FROM {schema}.leads WHERE ip = {q(ip)} AND created_at > NOW() - INTERVAL '10 minutes'"
        )
        if cur.fetchone()[0] >= 5:
            conn.close()
            return resp(429, {'error': 'Слишком много заявок. Попробуйте позже или позвоните нам'})
        cur.execute(
            f"INSERT INTO {schema}.leads (name, phone, topic, message, ip) "
            f"VALUES ({q(name)}, {q(phone)}, {q(topic)}, {q(message)}, {q(ip)}) RETURNING id"
        )
        lead_id = cur.fetchone()[0]
        cur.execute(f"SELECT value FROM {schema}.site_settings WHERE key = 'leads_email'")
        row = cur.fetchone()
        to_addr = (row[0] if row else '') or SMTP_LOGIN
        sent = False
        try:
            sent = send_email(
                to_addr, {'name': name, 'phone': phone, 'topic': topic, 'message': message}, get_smtp_password(cur, schema)
            )
        except Exception as e:
            print(f"email error: {e}")
        if sent:
            cur.execute(f"UPDATE {schema}.leads SET email_sent = TRUE WHERE id = {int(lead_id)}")
        conn.close()
        return resp(200, {'ok': True})

    cur.execute(f"SELECT password_hash FROM {schema}.admin_auth WHERE id = 1")
    row = cur.fetchone()
    given = str(body.get('password') or '').strip()
    if not given or not row or not check_password(given, row[0]):
        conn.close()
        return resp(401, {'error': 'Неверный пароль'})

    if body.get('action') == 'set_smtp':
        new_pw = re.sub(r'\s', '', str(body.get('smtp_password') or ''))
        if new_pw:
            try:
                with smtplib.SMTP_SSL('smtp.mail.ru', 465, timeout=8) as server:
                    server.login(SMTP_LOGIN, new_pw)
            except smtplib.SMTPAuthenticationError:
                conn.close()
                return resp(400, {'error': 'Mail.ru не принял пароль. Нужен именно пароль для внешних приложений'})
            except Exception as e:
                print(f"smtp check error: {e}")
                conn.close()
                return resp(400, {'error': 'Не удалось проверить пароль, попробуйте ещё раз'})
        cur.execute(
            f"INSERT INTO {schema}.private_settings (key, value) VALUES ('smtp_password', {q(new_pw)}) "
            f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()"
        )
    elif body.get('action') == 'test_email':
        cur.execute(f"SELECT value FROM {schema}.site_settings WHERE key = 'leads_email'")
        row = cur.fetchone()
        to_addr = (row[0] if row else '') or SMTP_LOGIN
        try:
            ok = send_email(
                to_addr,
                {'name': 'Тестовая заявка', 'phone': '+7 900 000-00-00', 'topic': 'Проверка',
                 'message': 'Это проверочное письмо из админ-панели. Уведомления работают.'},
                get_smtp_password(cur, schema),
            )
        except Exception as e:
            print(f"test email error: {e}")
            ok = False
        if not ok:
            conn.close()
            return resp(400, {'error': 'Письмо не отправилось. Проверьте пароль почты'})

    if method == 'PUT':
        lead_id = int(body.get('id') or 0)
        sets = []
        if body.get('status') in STATUSES:
            sets.append(f"status = {q(body['status'])}")
        if 'note' in body:
            sets.append(f"note = {q(str(body['note'])[:5000])}")
        if sets:
            cur.execute(f"UPDATE {schema}.leads SET {', '.join(sets)} WHERE id = {lead_id}")
    elif method == 'DELETE':
        cur.execute(f"DELETE FROM {schema}.leads WHERE id = {int(body.get('id') or 0)}")

    cols = ['id', 'name', 'phone', 'topic', 'message', 'status', 'note', 'email_sent', 'created_at']
    cur.execute(f"SELECT {', '.join(cols)} FROM {schema}.leads ORDER BY created_at DESC LIMIT 500")
    leads = [dict(zip(cols, r)) for r in cur.fetchall()]
    configured = bool(get_smtp_password(cur, schema))
    conn.close()
    return resp(200, {'leads': leads, 'email_configured': configured})
