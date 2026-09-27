CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Scale',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT INTO services (title, description, price, icon, sort_order) VALUES
('Проверка объекта и сделки', 'Юридическая экспертиза квартиры, дома или участка, проверка продавца, подготовка договора и безопасных расчётов.', 'от 15 000 ₽', 'FileSearch', 4),
('Споры с застройщиками', 'Неустойка за просрочку, недостатки отделки, расторжение ДДУ и возврат средств дольщикам.', 'от 25 000 ₽', 'Building2', 3),
('Земельное право', 'Межевые споры, изменение вида разрешённого использования, оформление и узаконивание построек.', 'от 20 000 ₽', 'Trees', 2),
('Судебная защита', 'Раздел имущества, наследство, выселение, оспаривание сделок — представительство во всех инстанциях.', 'от 40 000 ₽', 'Scale', 1);

INSERT INTO site_settings (key, value) VALUES
('phone', '+7 (495) 000-00-00'),
('email', 'help@legaldome.ru'),
('address', 'Москва, Пречистенская наб., 17'),
('hours', 'Пн–Пт 9:00–20:00, Сб по записи'),
('telegram', ''),
('whatsapp', ''),
('vk', '');