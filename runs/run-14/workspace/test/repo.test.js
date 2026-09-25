import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createRepo } from '../src/repo.js';

// Reuses the same schema as src/db.js without touching disk.
const SCHEMA = `
CREATE TABLE polls (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '', timezone TEXT NOT NULL, admin_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'finalized')),
  finalized_option_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE options (
  id TEXT PRIMARY KEY, poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL, duration_minutes INTEGER NOT NULL, sort_order INTEGER NOT NULL
);
CREATE TABLE participants (
  id TEXT PRIMARY KEY, poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  name TEXT NOT NULL, edit_token TEXT NOT NULL, created_at TEXT NOT NULL,
  UNIQUE(poll_id, edit_token)
);
CREATE TABLE responses (
  participant_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  value TEXT NOT NULL CHECK (value IN ('yes', 'if_need_be', 'no')),
  PRIMARY KEY (participant_id, option_id)
);
`;

function freshRepo() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return { db, repo: createRepo(db) };
}

describe('createPoll + submitVote', () => {
  test('creates a poll with options and an admin token', () => {
    const { repo } = freshRepo();
    const { id, adminToken } = repo.createPoll({
      title: 'Team sync',
      description: '',
      location: '',
      timezone: 'UTC',
      options: [{ startsAt: '2026-10-01T10:00:00.000Z', durationMinutes: 60 }],
    });
    assert.ok(id);
    assert.ok(adminToken);
    assert.equal(repo.getOptions(id).length, 1);
    assert.equal(repo.getPollByAdminToken(id, adminToken).status, 'open');
    assert.equal(repo.getPollByAdminToken(id, 'wrong-token'), null);
  });

  test('a repeat vote with the same edit token updates in place instead of duplicating', () => {
    const { repo } = freshRepo();
    const { id } = repo.createPoll({
      title: 'Team sync',
      timezone: 'UTC',
      options: [{ startsAt: '2026-10-01T10:00:00.000Z', durationMinutes: 60 }],
    });
    const [option] = repo.getOptions(id);

    const first = repo.submitVote({ pollId: id, editToken: null, name: 'Ada', responses: { [option.id]: 'yes' } });
    const second = repo.submitVote({
      pollId: id,
      editToken: first.editToken,
      name: 'Ada',
      responses: { [option.id]: 'if_need_be' },
    });

    assert.equal(first.participantId, second.participantId);
    assert.equal(repo.getParticipants(id).length, 1);
    const responses = repo.getResponses(id);
    assert.equal(responses.length, 1);
    assert.equal(responses[0].value, 'if_need_be');
  });

  test('duplicate votes for the same participant+option never produce more than one row (ADR 0003)', () => {
    const { repo } = freshRepo();
    const { id } = repo.createPoll({
      title: 'Team sync',
      timezone: 'UTC',
      options: [{ startsAt: '2026-10-01T10:00:00.000Z', durationMinutes: 60 }],
    });
    const [option] = repo.getOptions(id);

    const first = repo.submitVote({ pollId: id, editToken: null, name: 'Ada', responses: { [option.id]: 'yes' } });
    // Simulate a double-submit / two tabs racing with the same edit token.
    for (let i = 0; i < 5; i++) {
      repo.submitVote({ pollId: id, editToken: first.editToken, name: 'Ada', responses: { [option.id]: 'yes' } });
    }

    assert.equal(repo.getParticipants(id).length, 1);
    assert.equal(repo.getResponses(id).length, 1);
  });

  test('different browsers (no edit token) become distinct participants', () => {
    const { repo } = freshRepo();
    const { id } = repo.createPoll({
      title: 'Team sync',
      timezone: 'UTC',
      options: [{ startsAt: '2026-10-01T10:00:00.000Z', durationMinutes: 60 }],
    });
    const [option] = repo.getOptions(id);
    repo.submitVote({ pollId: id, editToken: null, name: 'Ada', responses: { [option.id]: 'yes' } });
    repo.submitVote({ pollId: id, editToken: null, name: 'Bea', responses: { [option.id]: 'no' } });
    assert.equal(repo.getParticipants(id).length, 2);
  });
});

describe('finalize', () => {
  test('finalizing sets status and the chosen option, reopen clears it', () => {
    const { repo } = freshRepo();
    const { id } = repo.createPoll({
      title: 'Team sync',
      timezone: 'UTC',
      options: [{ startsAt: '2026-10-01T10:00:00.000Z', durationMinutes: 60 }],
    });
    const [option] = repo.getOptions(id);
    repo.finalizePoll(id, option.id);
    let poll = repo.getPoll(id);
    assert.equal(poll.status, 'finalized');
    assert.equal(poll.finalizedOptionId, option.id);

    repo.reopenPoll(id);
    poll = repo.getPoll(id);
    assert.equal(poll.status, 'open');
    assert.equal(poll.finalizedOptionId, null);
  });
});
