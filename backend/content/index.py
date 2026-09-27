import json
import os
import hmac
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}

FIELDS = {
    'articles': ['title', 'category', 'date_label', 'read_time', 'excerpt', 'body', 'sort_order'],
    'cases': ['title', 'category', 'year', 'sort_order'],
    'services': ['title', 'description', 'price', 'icon', 'sort_order'],
}

SETTINGS_KEYS = ['phone', 'email', 'address', 'hours', 'telegram', 'whatsapp', 'vk']


def resp(status: int, data) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def q(value) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def fetch(cur, schema: str, table: str) -> list:
    cols = ['id'] + FIELDS[table]
    cur.execute(f"SELECT {', '.join(cols)} FROM {schema}.{table} ORDER BY sort_order DESC, id DESC")
    return [dict(zip(cols, row)) for row in cur.fetchall()]


def fetch_all(cur, schema: str) -> dict:
    data = {t: fetch(cur, schema, t) for t in FIELDS}
    cur.execute(f"SELECT key, value FROM {schema}.site_settings")
    data['settings'] = {k: v for k, v in cur.fetchall()}
    return data


def handler(event: dict, context) -> dict:
    """Контент сайта (статьи, дела, услуги, контакты): публичное чтение и управление из админ-панели по паролю."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    schema = '"' + os.environ['MAIN_DB_SCHEMA'] + '"'
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()

    if method == 'GET':
        data = fetch_all(cur, schema)
        conn.close()
        return resp(200, data)

    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    expected = os.environ.get('ADMIN_PASSWORD', '')
    given = headers.get('x-admin-password', '')
    if not expected or not hmac.compare_digest(given, expected):
        conn.close()
        return resp(401, {'error': 'Неверный пароль'})

    body = json.loads(event.get('body') or '{}')
    table = body.get('type') or params.get('type')
    if table == 'settings' and method == 'PUT':
        values = body.get('settings') or {}
        for k in SETTINGS_KEYS:
            if k in values:
                cur.execute(
                    f"INSERT INTO {schema}.site_settings (key, value) VALUES ({q(k)}, {q(values[k])}) "
                    f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value"
                )
        data = fetch_all(cur, schema)
        conn.close()
        return resp(200, data)
    if table not in FIELDS:
        conn.close()
        return resp(400, {'error': 'Неизвестный тип'})

    if body.get('action') == 'check':
        conn.close()
        return resp(200, {'ok': True})

    item = body.get('item') or {}
    item_id = body.get('id') or item.get('id')

    if method == 'DELETE':
        cur.execute(f"DELETE FROM {schema}.{table} WHERE id = {int(item_id)}")
    elif method == 'POST':
        cols = [f for f in FIELDS[table] if f in item]
        if not str(item.get('title', '')).strip():
            conn.close()
            return resp(400, {'error': 'Заполните заголовок'})
        vals = [str(int(item[c] or 0)) if c == 'sort_order' else q(item[c]) for c in cols]
        cur.execute(f"INSERT INTO {schema}.{table} ({', '.join(cols)}) VALUES ({', '.join(vals)})")
    elif method == 'PUT':
        sets = [
            f"{c} = {int(item[c] or 0)}" if c == 'sort_order' else f"{c} = {q(item[c])}"
            for c in FIELDS[table] if c in item
        ]
        cur.execute(f"UPDATE {schema}.{table} SET {', '.join(sets)} WHERE id = {int(item_id)}")

    data = fetch_all(cur, schema)
    conn.close()
    return resp(200, data)
