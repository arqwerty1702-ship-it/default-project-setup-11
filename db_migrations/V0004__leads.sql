CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  note TEXT NOT NULL DEFAULT '',
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  ip TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_created_idx ON leads (created_at DESC);

INSERT INTO site_settings (key, value) VALUES ('leads_email', 'legal-dome@mail.ru')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;