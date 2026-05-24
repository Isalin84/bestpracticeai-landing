CREATE TABLE IF NOT EXISTS articles (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  excerpt    TEXT,
  content    TEXT NOT NULL DEFAULT '',
  cover_url  TEXT,
  published  INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  position   TEXT,
  company    TEXT,
  text       TEXT NOT NULL,
  photo_url  TEXT,
  published  INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name  TEXT NOT NULL,
  company    TEXT,
  phone      TEXT NOT NULL,
  message    TEXT,
  status     TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_videos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  service_slug TEXT NOT NULL,
  kinescope_id TEXT NOT NULL,
  title        TEXT,
  caption      TEXT,
  aspect_ratio TEXT DEFAULT '16:9',
  sort_order   INTEGER DEFAULT 0,
  published    INTEGER DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('hero_video_id', 'xmACts9kgZPMEWgLG5sfys');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notify_email', 'salinivan@mail.ru');
INSERT OR IGNORE INTO settings (key, value) VALUES ('yandex_metrika_id', '');
