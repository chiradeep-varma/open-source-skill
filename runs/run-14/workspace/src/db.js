import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  timezone TEXT NOT NULL,
  admin_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'finalized')),
  finalized_option_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_options_poll ON options(poll_id);

CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  edit_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(poll_id, edit_token)
);
CREATE INDEX IF NOT EXISTS idx_participants_poll ON participants(poll_id);

CREATE TABLE IF NOT EXISTS responses (
  participant_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  value TEXT NOT NULL CHECK (value IN ('yes', 'if_need_be', 'no')),
  PRIMARY KEY (participant_id, option_id)
);
`;

export function openDb(path) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return db;
}
