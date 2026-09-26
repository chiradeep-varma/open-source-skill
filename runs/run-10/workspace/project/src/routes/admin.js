const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { slugify, toCsv } = require('../utils');
const { QUESTION_TYPES } = require('../questionTypes');

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  return res.redirect('/admin/login');
}

function getForm(id, userId) {
  return db.prepare('SELECT * FROM forms WHERE id = ? AND user_id = ?').get(id, userId);
}

function getQuestions(formId) {
  return db
    .prepare('SELECT * FROM questions WHERE form_id = ? ORDER BY position ASC')
    .all(formId)
    .map((q) => ({
      ...q,
      options: JSON.parse(q.options_json || '[]'),
      settings: JSON.parse(q.settings_json || '{}'),
    }));
}

function getRulesForQuestion(questionId) {
  return db
    .prepare('SELECT * FROM logic_rules WHERE question_id = ? ORDER BY position ASC')
    .all(questionId);
}

// ---- auth ----

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).render('admin/login', { error: 'Incorrect email or password.' });
  }
  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.userId = user.id;
    res.redirect('/admin');
  });
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.use(requireAuth);

// ---- dashboard ----

router.get('/', (req, res) => {
  const forms = db
    .prepare(
      `SELECT f.*, (SELECT COUNT(*) FROM responses r WHERE r.form_id = f.id) AS response_count
       FROM forms f WHERE f.user_id = ? ORDER BY f.updated_at DESC`
    )
    .all(req.session.userId);
  res.render('admin/dashboard', { forms });
});

router.post('/forms', (req, res) => {
  const title = String(req.body.title || 'Untitled form').trim() || 'Untitled form';
  let base = slugify(title) || 'form';
  let slug = base;
  let n = 1;
  while (db.prepare('SELECT 1 FROM forms WHERE slug = ?').get(slug)) {
    slug = `${base}-${++n}`;
  }
  const info = db
    .prepare('INSERT INTO forms (user_id, title, slug) VALUES (?, ?, ?)')
    .run(req.session.userId, title, slug);
  res.redirect(`/admin/forms/${info.lastInsertRowid}/edit`);
});

// ---- form builder ----

router.get('/forms/:id/edit', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  const questions = getQuestions(form.id);
  const questionsWithRules = questions.map((q) => ({ ...q, rules: getRulesForQuestion(q.id) }));
  res.render('admin/builder', {
    form,
    questions: questionsWithRules,
    questionTypes: QUESTION_TYPES,
    baseUrl: `${req.protocol}://${req.get('host')}`,
  });
});

router.post('/forms/:id', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  const { title, description, thank_you_message, webhook_url } = req.body;
  const status = req.body.status === 'published' ? 'published' : 'draft';
  db.prepare(
    `UPDATE forms SET title = ?, description = ?, thank_you_message = ?, webhook_url = ?, status = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    String(title || form.title).trim(),
    String(description || ''),
    String(thank_you_message || form.thank_you_message),
    String(webhook_url || ''),
    status,
    form.id
  );
  res.redirect(`/admin/forms/${form.id}/edit`);
});

router.post('/forms/:id/delete', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  db.prepare('DELETE FROM forms WHERE id = ?').run(form.id);
  res.redirect('/admin');
});

// ---- questions ----

function parseOptions(raw) {
  return String(raw || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

router.post('/forms/:id/questions', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  const type = QUESTION_TYPES[req.body.type] ? req.body.type : 'short_text';
  const maxPos = db
    .prepare('SELECT COALESCE(MAX(position), -1) AS m FROM questions WHERE form_id = ?')
    .get(form.id).m;
  const options = QUESTION_TYPES[type].hasOptions ? parseOptions(req.body.options) : [];
  db.prepare(
    `INSERT INTO questions (form_id, type, title, description, required, options_json, position)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    form.id,
    type,
    String(req.body.title || 'Untitled question').trim() || 'Untitled question',
    String(req.body.description || ''),
    req.body.required ? 1 : 0,
    JSON.stringify(options),
    maxPos + 1
  );
  db.prepare("UPDATE forms SET updated_at = datetime('now') WHERE id = ?").run(form.id);
  res.redirect(`/admin/forms/${form.id}/edit`);
});

function getQuestionOwned(formId, questionId, userId) {
  const form = getForm(formId, userId);
  if (!form) return {};
  const question = db
    .prepare('SELECT * FROM questions WHERE id = ? AND form_id = ?')
    .get(questionId, form.id);
  return { form, question };
}

router.post('/forms/:id/questions/:qid', (req, res) => {
  const { form, question } = getQuestionOwned(req.params.id, req.params.qid, req.session.userId);
  if (!form || !question) return res.status(404).send('Not found');
  const options = QUESTION_TYPES[question.type].hasOptions ? parseOptions(req.body.options) : [];
  db.prepare(
    `UPDATE questions SET title = ?, description = ?, required = ?, options_json = ? WHERE id = ?`
  ).run(
    String(req.body.title || question.title).trim(),
    String(req.body.description || ''),
    req.body.required ? 1 : 0,
    JSON.stringify(options),
    question.id
  );
  db.prepare("UPDATE forms SET updated_at = datetime('now') WHERE id = ?").run(form.id);
  res.redirect(`/admin/forms/${form.id}/edit`);
});

router.post('/forms/:id/questions/:qid/delete', (req, res) => {
  const { form, question } = getQuestionOwned(req.params.id, req.params.qid, req.session.userId);
  if (!form || !question) return res.status(404).send('Not found');
  db.prepare('DELETE FROM questions WHERE id = ?').run(question.id);
  res.redirect(`/admin/forms/${form.id}/edit`);
});

router.post('/forms/:id/questions/:qid/move', (req, res) => {
  const { form, question } = getQuestionOwned(req.params.id, req.params.qid, req.session.userId);
  if (!form || !question) return res.status(404).send('Not found');
  const dir = req.body.dir === 'up' ? -1 : 1;
  const neighbor = db
    .prepare(
      `SELECT * FROM questions WHERE form_id = ? AND position ${dir < 0 ? '<' : '>'} ?
       ORDER BY position ${dir < 0 ? 'DESC' : 'ASC'} LIMIT 1`
    )
    .get(form.id, question.position);
  if (neighbor) {
    const tx = db.transaction(() => {
      db.prepare('UPDATE questions SET position = ? WHERE id = ?').run(neighbor.position, question.id);
      db.prepare('UPDATE questions SET position = ? WHERE id = ?').run(question.position, neighbor.id);
    });
    tx();
  }
  res.redirect(`/admin/forms/${form.id}/edit`);
});

// ---- logic rules ----

router.post('/forms/:id/questions/:qid/logic', (req, res) => {
  const { form, question } = getQuestionOwned(req.params.id, req.params.qid, req.session.userId);
  if (!form || !question) return res.status(404).send('Not found');
  const targetIsEnd = req.body.target === 'end';
  const targetQuestionId = targetIsEnd ? null : Number(req.body.target) || null;
  const maxPos = db
    .prepare('SELECT COALESCE(MAX(position), -1) AS m FROM logic_rules WHERE question_id = ?')
    .get(question.id).m;
  db.prepare(
    `INSERT INTO logic_rules (question_id, position, operator, value, target_question_id, target_is_end)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    question.id,
    maxPos + 1,
    ['equals', 'not_equals', 'contains'].includes(req.body.operator) ? req.body.operator : 'equals',
    String(req.body.value || ''),
    targetQuestionId,
    targetIsEnd ? 1 : 0
  );
  res.redirect(`/admin/forms/${form.id}/edit`);
});

router.post('/forms/:id/questions/:qid/logic/:ruleId/delete', (req, res) => {
  const { form, question } = getQuestionOwned(req.params.id, req.params.qid, req.session.userId);
  if (!form || !question) return res.status(404).send('Not found');
  db.prepare('DELETE FROM logic_rules WHERE id = ? AND question_id = ?').run(req.params.ruleId, question.id);
  res.redirect(`/admin/forms/${form.id}/edit`);
});

// ---- responses ----

router.get('/forms/:id/responses', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  const questions = getQuestions(form.id);
  const responses = db
    .prepare('SELECT * FROM responses WHERE form_id = ? ORDER BY submitted_at DESC')
    .all(form.id);
  const answers = db
    .prepare(
      `SELECT a.* FROM answers a JOIN responses r ON a.response_id = r.id WHERE r.form_id = ?`
    )
    .all(form.id);
  const byResponse = new Map();
  for (const a of answers) {
    if (!byResponse.has(a.response_id)) byResponse.set(a.response_id, {});
    byResponse.get(a.response_id)[a.question_id] = a.value;
  }
  res.render('admin/responses', { form, questions, responses, byResponse });
});

router.get('/forms/:id/responses/export.csv', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  const questions = getQuestions(form.id);
  const responses = db
    .prepare('SELECT * FROM responses WHERE form_id = ? ORDER BY submitted_at ASC')
    .all(form.id);
  const answers = db
    .prepare(
      `SELECT a.* FROM answers a JOIN responses r ON a.response_id = r.id WHERE r.form_id = ?`
    )
    .all(form.id);
  const byResponse = new Map();
  for (const a of answers) {
    if (!byResponse.has(a.response_id)) byResponse.set(a.response_id, {});
    byResponse.get(a.response_id)[a.question_id] = a.value;
  }
  const header = ['Response ID', 'Submitted at', ...questions.map((q) => q.title)];
  const rows = [header];
  for (const r of responses) {
    const row = [r.id, r.submitted_at];
    for (const q of questions) row.push((byResponse.get(r.id) || {})[q.id] || '');
    rows.push(row);
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${form.slug}-responses.csv"`);
  res.send(toCsv(rows));
});

router.post('/forms/:id/responses/:rid/delete', (req, res) => {
  const form = getForm(req.params.id, req.session.userId);
  if (!form) return res.status(404).send('Form not found');
  db.prepare('DELETE FROM responses WHERE id = ? AND form_id = ?').run(req.params.rid, form.id);
  res.redirect(`/admin/forms/${form.id}/responses`);
});

module.exports = router;
