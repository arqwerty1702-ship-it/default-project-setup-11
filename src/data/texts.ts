import { useContent } from "@/data/articles"

export type TextField = { key: string; label: string; def: string; rows?: number; hint?: string }
export type TextGroup = { title: string; fields: TextField[] }

const ACCENT_HINT = "Слово в *звёздочках* выделяется цветом и курсивом"
const LINES_HINT = "Новая строка в поле — перенос строки на сайте"

export const TEXT_GROUPS: TextGroup[] = [
  {
    title: "Шапка и меню",
    fields: [
      { key: "brand_name", label: "Название", def: "Legal Dome" },
      { key: "brand_tagline", label: "Подпись под названием", def: "юридическое бюро" },
      { key: "nav_home", label: "Меню: главная", def: "Главная" },
      { key: "nav_services", label: "Меню: услуги", def: "Услуги" },
      { key: "nav_articles", label: "Меню: статьи", def: "Статьи" },
      { key: "nav_contacts", label: "Меню: контакты", def: "Контакты" },
      { key: "nav_tools", label: "Меню: сервисы", def: "Сервисы" },
      { key: "nav_faq", label: "Меню: база знаний", def: "База знаний" },
      { key: "nav_cta", label: "Кнопка в шапке", def: "Консультация" },
    ],
  },
  {
    title: "Главный экран",
    fields: [
      { key: "hero_badge", label: "Надпись над заголовком", def: "Юридическое бюро · недвижимость" },
      {
        key: "hero_title",
        label: "Заголовок",
        def: "Юридический фундамент *вашей* недвижимости",
        rows: 2,
        hint: ACCENT_HINT,
      },
      {
        key: "hero_text",
        label: "Текст под заголовком",
        def: "Проверяем квартиры и участки, сопровождаем сделки, защищаем дольщиков и собственников в суде. Говорим простым языком и отвечаем за результат.",
        rows: 3,
      },
      { key: "hero_btn_primary", label: "Главная кнопка", def: "Получить консультацию" },
      { key: "hero_btn_secondary", label: "Вторая кнопка", def: "Услуги и цены" },
      { key: "hero_scroll_hint", label: "Подсказка внизу", def: "Листайте вправо" },
    ],
  },
  {
    title: "Услуги",
    fields: [
      { key: "services_title", label: "Заголовок", def: "Услуги" },
      { key: "services_subtitle", label: "Подзаголовок", def: "/ Всё, что связано с недвижимостью" },
    ],
  },
  {
    title: "Статьи и практика",
    fields: [
      { key: "articles_title", label: "Заголовок", def: "Статьи и практика" },
      { key: "articles_tab_articles", label: "Вкладка статей", def: "Статьи" },
      { key: "articles_tab_cases", label: "Вкладка практики", def: "Практика" },
      { key: "articles_subtitle", label: "Подзаголовок статей", def: "/ Разбираем актуальные вопросы" },
      { key: "cases_subtitle", label: "Подзаголовок практики", def: "/ Дела, которые мы выиграли" },
      { key: "articles_filter_all", label: "Фильтр «все темы»", def: "Все" },
      { key: "articles_read", label: "Ссылка на статью", def: "Читать" },
      {
        key: "articles_cta",
        label: "Блок в конце статьи",
        def: "Остались вопросы по вашей ситуации? Оставьте заявку в разделе «Контакты» — первичная консультация бесплатна.",
        rows: 2,
      },
      {
        key: "cases_note",
        label: "Примечание под делами",
        def: "Имена клиентов не раскрываем — адвокатская тайна. Подробности дел готовы обсудить на консультации.",
        rows: 2,
      },
    ],
  },
  {
    title: "Контакты и форма заявки",
    fields: [
      { key: "contacts_tab_contacts", label: "Вкладка контактов", def: "Контакты" },
      { key: "contacts_tab_about", label: "Вкладка «О нас»", def: "О нас" },
      { key: "contacts_title", label: "Заголовок", def: "Расскажите\n*о ситуации*", rows: 2, hint: `${ACCENT_HINT}. ${LINES_HINT}` },
      { key: "contacts_subtitle", label: "Подзаголовок", def: "/ Первичная консультация — бесплатно" },
      { key: "label_phone", label: "Подпись телефона", def: "Телефон" },
      { key: "label_email", label: "Подпись почты", def: "Email" },
      { key: "label_office", label: "Подпись адреса", def: "Офис" },
      { key: "form_topic_label", label: "Форма: заголовок тем", def: "Вопрос" },
      { key: "form_topics", label: "Форма: темы", def: "Сделка, Застройщик, Земля, Суд", hint: "Через запятую" },
      { key: "form_name_label", label: "Форма: поле имени", def: "Имя" },
      { key: "form_name_placeholder", label: "Форма: подсказка в поле имени", def: "Как к вам обращаться" },
      { key: "form_phone_label", label: "Форма: поле телефона", def: "Телефон" },
      { key: "form_phone_placeholder", label: "Форма: подсказка в поле телефона", def: "+7 900 000-00-00" },
      { key: "form_message_label", label: "Форма: поле описания", def: "Коротко о ситуации" },
      {
        key: "form_message_placeholder",
        label: "Форма: подсказка в поле описания",
        def: "Например: покупаю квартиру, хочу проверить продавца",
      },
      { key: "form_submit", label: "Форма: кнопка", def: "Получить консультацию" },
      { key: "form_success", label: "Форма: после отправки", def: "Заявка принята. Юрист перезвонит в течение 30 минут." },
      { key: "form_consent", label: "Форма: согласие", def: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных" },
    ],
  },
  {
    title: "Сервисы",
    fields: [
      { key: "tools_title", label: "Заголовок", def: "Сервисы" },
      { key: "tools_tab_links", label: "Вкладка ссылок", def: "Полезные ссылки" },
      { key: "tools_tab_calc", label: "Вкладка калькуляторов", def: "Калькуляторы" },
      { key: "tools_links_subtitle", label: "Подзаголовок ссылок", def: "/ Официальные ресурсы, которыми пользуемся сами" },
      { key: "tools_calc_subtitle", label: "Подзаголовок калькуляторов", def: "/ Быстрый предварительный расчёт" },
      { key: "calc_penalty_title", label: "Калькулятор 1: название", def: "Неустойка по ДДУ" },
      {
        key: "calc_penalty_text",
        label: "Калькулятор 1: пояснение",
        def: "Сколько застройщик должен за просрочку передачи квартиры: 1/150 ключевой ставки за каждый день",
        rows: 2,
      },
      { key: "calc_key_rate", label: "Калькулятор 1: ключевая ставка, %", def: "7.5", hint: "Ставка ЦБ, которая применяется к расчёту" },
      { key: "calc_deduction_title", label: "Калькулятор 2: название", def: "Налоговый вычет за жильё" },
      {
        key: "calc_deduction_text",
        label: "Калькулятор 2: пояснение",
        def: "Сколько НДФЛ можно вернуть после покупки квартиры или дома и по процентам ипотеки",
        rows: 2,
      },
      {
        key: "calc_note",
        label: "Примечание под калькуляторами",
        def: "Расчёт предварительный. Точную сумму с учётом вашей ситуации посчитаем на бесплатной консультации.",
        rows: 2,
      },
    ],
  },
  {
    title: "База знаний",
    fields: [
      { key: "faq_title", label: "Заголовок", def: "База знаний" },
      { key: "faq_subtitle", label: "Подзаголовок", def: "/ Ответы на частые вопросы" },
      { key: "faq_filter_all", label: "Фильтр «все темы»", def: "Все" },
      { key: "faq_cta", label: "Текст внизу", def: "Не нашли ответ? Задайте вопрос юристу — первичная консультация бесплатна." },
      { key: "faq_cta_button", label: "Кнопка внизу", def: "Задать вопрос" },
    ],
  },
  {
    title: "О нас",
    fields: [
      { key: "about_title", label: "Заголовок", def: "Право на вашей *стороне*", hint: ACCENT_HINT },
      {
        key: "about_text",
        label: "Текст",
        def: "«Legal Dome» — команда юристов и адвокатов, которые более 11 лет работают только с недвижимостью: от покупки первой квартиры до многолетних земельных споров.\n\nМы честно оцениваем шансы до начала работы, фиксируем стоимость в договоре и держим клиента в курсе каждого шага.",
        rows: 6,
        hint: "Абзацы разделяйте пустой строкой",
      },
      { key: "about_button", label: "Кнопка", def: "Записаться на консультацию" },
      { key: "stat1_value", label: "Цифра 1", def: "1 200+" },
      { key: "stat1_label", label: "Цифра 1: подпись", def: "Сделок" },
      { key: "stat1_sub", label: "Цифра 1: пояснение", def: "Проверено и сопровождено" },
      { key: "stat2_value", label: "Цифра 2", def: "11" },
      { key: "stat2_label", label: "Цифра 2: подпись", def: "Лет" },
      { key: "stat2_sub", label: "Цифра 2: пояснение", def: "Практики в сфере недвижимости" },
      { key: "stat3_value", label: "Цифра 3", def: "87%" },
      { key: "stat3_label", label: "Цифра 3: подпись", def: "Выигранных дел" },
      { key: "stat3_sub", label: "Цифра 3: пояснение", def: "В судах общей юрисдикции и арбитраже" },
    ],
  },
]

export const TEXT_DEFAULTS: Record<string, string> = Object.fromEntries(
  TEXT_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.def])),
)

export function useTexts() {
  const { data } = useContent()
  const saved = (data?.settings ?? {}) as Record<string, string | undefined>
  return (key: string) => {
    const v = saved[key]
    return v && v.trim() ? v : TEXT_DEFAULTS[key] ?? ""
  }
}
