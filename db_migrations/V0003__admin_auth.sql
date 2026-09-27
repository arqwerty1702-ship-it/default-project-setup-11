CREATE TABLE admin_auth (
  id INTEGER PRIMARY KEY,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO admin_auth (id, password_hash) VALUES
(1, 'pbkdf2$200000$85f46d63bcc2be767c50f5f73e525caa$4b7b9a9a08979dcf57326a184983078e68bde262f3cbe46d2d13977bdb1bdf00');