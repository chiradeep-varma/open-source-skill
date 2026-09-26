const express = require('express');
const db = require('../db');
const { computeVisitedPath } = require('../logic');
const { QUESTION_TYPES } = require('../questionTypes');

const router = express.Router();

function getPublishedForm(slug) {
  return db.prepare("SELECT * FROM forms WHERE slug = ? AND status = 'published'").get(slug);
}

function getQuestions(formId) {
  return db
    .prepare('SELECT * FROM questions WHERE form_id = ? ORDER BY position ASC')
    .all(formId)
    .map((q) => ({ ...q, options: JSON.parse(q.options_json || '[]') }));
}

function getRulesByQuestion(formId) {
  const rows = db
    .prepare(
      `SELECT lr.* FROM logic_rules lr JOIN questions q ON lr.question_id = q.id WHERE q.form_id = ?
       ORDER BY lr.position ASC`
    )
    .all(formId);
  const byQuestion = {};
  for (const r of rows) {
    (byQuestion[r.question_id] ||= []).push(r);
  }
  return byQuestion;
}

router.get('/:slug', (req, res) => {
  const form = getPublishedForm(req.params.slug);
  if (!form) return res.status(404).render('public/not-found');
  const questions = getQuestions(form.id);
  const rulesByQuestion = getRulesByQuestion(form.id);
  res.render('public/form', { form, questions, rulesByQuestion, questionTypes: QUESTION_TYPES });
});

router.get('/:slug/thanks', (req, res) => {
  const form = getPublishedForm(req.params.slug);
  if (!form) return res.status(404).render('public/not-found');
  res.render('public/thanks', { form });
});

function isValidAnswer(question, rawValue) {
  const value = (rawValue ?? '').toString().trim();
  if (question.required && !value) return false;
  if (!value) return true;
  if (question.type === 'email' && value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  if (question.type === 'number' && value) {
    return !Number.isNaN(Number(value));
  }
  if (question.type === 'rating' && value) {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 5;
  }
  if (question.type === 'single_choice' || question.type === 'yes_no') {
    const allowed = question.type === 'yes_no' ? ['yes', 'no'] : question.options;
    return allowed.includes(value);
  }
  return true;
}

router.post('/:slug/submit', async (req, res) => {
  const form = getPublishedForm(req.params.slug);
  if (!form) return res.status(404).render('public/not-found');

  // Honeypot: a hidden field real respondents never fill in.
  if (req.body._hp) {
    return res.redirect(`/f/${form.slug}/thanks`);
  }

  const questions = getQuestions(form.id);
  const rulesByQuestion = getRulesByQuestion(form.id);

  const rawAnswers = {};
  for (const q of questions) {
    const field = req.body[`q_${q.id}`];
    rawAnswers[q.id] = Array.isArray(field) ? field.join(', ') : field ?? '';
  }

  const visited = computeVisitedPath(questions, rulesByQuestion, rawAnswers);

  for (const q of visited) {
    if (!isValidAnswer(q, rawAnswers[q.id])) {
      return res.status(400).render('public/form', {
        form,
        questions,
        rulesByQuestion,
        questionTypes: QUESTION_TYPES,
        error: `Please check your answer to "${q.title}" and try again.`,
        prefill: rawAnswers,
      });
    }
  }

  const tx = db.transaction(() => {
    const info = db.prepare('INSERT INTO responses (form_id) VALUES (?)').run(form.id);
    const insertAnswer = db.prepare('INSERT INTO answers (response_id, question_id, value) VALUES (?, ?, ?)');
    for (const q of visited) {
      insertAnswer.run(info.lastInsertRowid, q.id, String(rawAnswers[q.id] ?? ''));
    }
    return info.lastInsertRowid;
  });
  const responseId = tx();

  if (form.webhook_url) {
    const payload = {
      form: { id: form.id, title: form.title, slug: form.slug },
      response_id: responseId,
      submitted_at: new Date().toISOString(),
      answers: visited.map((q) => ({ question_id: q.id, question: q.title, value: rawAnswers[q.id] ?? '' })),
    };
    fetch(form.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error(`[formstead] webhook delivery failed for form ${form.slug}:`, err.message);
    });
  }

  res.redirect(`/f/${form.slug}/thanks`);
});

module.exports = router;
