import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './src/db.js';
import { createRepo } from './src/repo.js';
import { computeResults, validatePollInput, isValidVoteValue, toCsv } from './src/scheduling.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'data', 'rustic-fjord.db');
const PORT = Number(process.env.PORT) || 3300;

const db = openDb(DATA_PATH);
const repo = createRepo(db);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

function buildPollView(pollId, { editToken } = {}) {
  const poll = repo.getPoll(pollId);
  if (!poll) return null;
  const options = repo.getOptions(pollId);
  const participants = repo.getParticipants(pollId);
  const responses = repo.getResponses(pollId);
  const { totals, bestOptionId } = computeResults(options, responses);

  const responsesByParticipant = new Map();
  for (const r of responses) {
    if (!responsesByParticipant.has(r.participantId)) responsesByParticipant.set(r.participantId, new Map());
    responsesByParticipant.get(r.participantId).set(r.optionId, r.value);
  }

  const you = editToken ? repo.findParticipantByEditToken(pollId, editToken) : null;

  return { poll, options, participants, totals, bestOptionId, responsesByParticipant, you };
}

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/polls', (req, res) => {
  const title = req.body.title || '';
  const description = req.body.description || '';
  const location = req.body.location || '';
  const timezone = req.body.timezone || 'UTC';
  const startsAt = [].concat(req.body.startsAt || []);
  const durationMinutes = [].concat(req.body.durationMinutes || []);
  const options = startsAt
    .map((s, i) => ({ startsAt: s, durationMinutes: durationMinutes[i] || 60 }))
    .filter((o) => o.startsAt);

  const errors = validatePollInput({ title, options });
  if (errors.length) {
    return res.status(400).render('home', { errors, formValues: req.body });
  }

  const { id, adminToken } = repo.createPoll({ title, description, location, timezone, options });
  res.redirect(`/a/${id}/${adminToken}?created=1`);
});

app.get('/p/:pollId', (req, res) => {
  const view = buildPollView(req.params.pollId, { editToken: req.query.t });
  if (!view) return res.status(404).render('not-found');
  res.render('poll', { ...view, isAdmin: false, adminToken: null, created: false });
});

app.post('/api/polls/:pollId/vote', (req, res) => {
  const poll = repo.getPoll(req.params.pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found.' });
  if (poll.status === 'finalized') {
    return res.status(409).json({ error: 'This poll has already been finalized.' });
  }

  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Name is required.' });

  const responses = req.body.responses || {};
  const options = repo.getOptions(poll.id);
  const optionIds = new Set(options.map((o) => o.id));
  for (const [optionId, value] of Object.entries(responses)) {
    if (!optionIds.has(optionId)) return res.status(400).json({ error: 'Unknown option.' });
    if (!isValidVoteValue(value)) return res.status(400).json({ error: 'Invalid vote value.' });
  }

  const result = repo.submitVote({
    pollId: poll.id,
    editToken: req.body.editToken || null,
    name,
    responses,
  });

  res.json({ ok: true, editToken: result.editToken });
});

app.get('/a/:pollId/:adminToken', (req, res) => {
  const poll = repo.getPollByAdminToken(req.params.pollId, req.params.adminToken);
  if (!poll) return res.status(404).render('not-found');
  const view = buildPollView(req.params.pollId, {});
  res.render('poll', {
    ...view,
    isAdmin: true,
    adminToken: req.params.adminToken,
    created: req.query.created === '1',
  });
});

app.post('/a/:pollId/:adminToken/finalize', (req, res) => {
  const poll = repo.getPollByAdminToken(req.params.pollId, req.params.adminToken);
  if (!poll) return res.status(404).render('not-found');
  const options = repo.getOptions(poll.id);
  if (!options.some((o) => o.id === req.body.optionId)) {
    return res.status(400).send('Unknown option.');
  }
  repo.finalizePoll(poll.id, req.body.optionId);
  res.redirect(`/a/${poll.id}/${poll.adminToken}`);
});

app.post('/a/:pollId/:adminToken/reopen', (req, res) => {
  const poll = repo.getPollByAdminToken(req.params.pollId, req.params.adminToken);
  if (!poll) return res.status(404).render('not-found');
  repo.reopenPoll(poll.id);
  res.redirect(`/a/${poll.id}/${poll.adminToken}`);
});

app.get('/a/:pollId/:adminToken/export.csv', (req, res) => {
  const poll = repo.getPollByAdminToken(req.params.pollId, req.params.adminToken);
  if (!poll) return res.status(404).render('not-found');
  const options = repo.getOptions(poll.id);
  const participants = repo.getParticipants(poll.id);
  const responses = repo.getResponses(poll.id);
  const responsesByParticipant = new Map();
  for (const r of responses) {
    if (!responsesByParticipant.has(r.participantId)) responsesByParticipant.set(r.participantId, new Map());
    responsesByParticipant.get(r.participantId).set(r.optionId, r.value);
  }
  const csv = toCsv(poll, options, participants, responsesByParticipant);
  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', `attachment; filename="${poll.id}.csv"`);
  res.send(csv);
});

app.use((req, res) => {
  res.status(404).render('not-found');
});

app.listen(PORT, () => {
  console.log(`rustic-fjord listening on http://localhost:${PORT}`);
});
