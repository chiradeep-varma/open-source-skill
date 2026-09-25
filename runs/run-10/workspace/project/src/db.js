const path = require('node:path');
const fs = require('node:fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'formstead.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    thank_you_message TEXT NOT NULL DEFAULT 'Thanks — your response has been recorded.',
    webhook_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    required INTEGER NOT NULL DEFAULT 0,
    options_json TEXT NOT NULL DEFAULT '[]',
    settings_json TEXT NOT NULL DEFAULT '{}',
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS logic_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    operator TEXT NOT NULL CHECK (operator IN ('equals', 'not_equals', 'contains')),
    value TEXT NOT NULL DEFAULT '',
    target_question_id INTEGER REFERENCES questions(id) ON DELETE SET NULL,
    target_is_end INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    response_id INTEGER NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    value TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_questions_form ON questions(form_id, position);
  CREATE INDEX IF NOT EXISTS idx_logic_rules_question ON logic_rules(question_id, position);
  CREATE INDEX IF NOT EXISTS idx_responses_form ON responses(form_id, submitted_at);
  CREATE INDEX IF NOT EXISTS idx_answers_response ON answers(response_id);
`);

function seedAdminFromEnv() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const existing = db.prepare('SELECT COUNT(*) AS n FROM users').get();
  if (existing.n > 0) return;
  if (!email || !password) {
    console.warn(
      '[formstead] No admin account exists yet and ADMIN_EMAIL/ADMIN_PASSWORD are not set. ' +
        'Set them in .env and restart to create the first admin login.'
    );
    return;
  }
  const hash = bcrypt.hashSync(password, 12);
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email.toLowerCase().trim(), hash);
  console.log(`[formstead] Created admin account for ${email}`);
}

seedAdminFromEnv();

module.exports = db;
