import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { computeResults, validatePollInput, isValidVoteValue, toCsv } from '../src/scheduling.js';

describe('computeResults', () => {
  test('scores yes as 1 and if_need_be as half, no as zero', () => {
    const options = [{ id: 'a', startsAt: '2026-10-01T10:00:00.000Z' }];
    const responses = [
      { participantId: 'p1', optionId: 'a', value: 'yes' },
      { participantId: 'p2', optionId: 'a', value: 'if_need_be' },
      { participantId: 'p3', optionId: 'a', value: 'no' },
    ];
    const { totals } = computeResults(options, responses);
    assert.equal(totals.a.yes, 1);
    assert.equal(totals.a.ifNeedBe, 1);
    assert.equal(totals.a.no, 1);
    assert.equal(totals.a.score, 1.5);
  });

  test('picks the option with the highest score as best', () => {
    const options = [
      { id: 'a', startsAt: '2026-10-01T10:00:00.000Z' },
      { id: 'b', startsAt: '2026-10-02T10:00:00.000Z' },
    ];
    const responses = [
      { participantId: 'p1', optionId: 'a', value: 'yes' },
      { participantId: 'p1', optionId: 'b', value: 'yes' },
      { participantId: 'p2', optionId: 'b', value: 'yes' },
    ];
    const { bestOptionId } = computeResults(options, responses);
    assert.equal(bestOptionId, 'b');
  });

  test('breaks ties by earliest option', () => {
    const options = [
      { id: 'later', startsAt: '2026-10-05T10:00:00.000Z' },
      { id: 'earlier', startsAt: '2026-10-01T10:00:00.000Z' },
    ];
    const responses = [
      { participantId: 'p1', optionId: 'later', value: 'yes' },
      { participantId: 'p1', optionId: 'earlier', value: 'yes' },
    ];
    const { bestOptionId } = computeResults(options, responses);
    assert.equal(bestOptionId, 'earlier');
  });

  test('returns no best option when nobody has voted', () => {
    const options = [{ id: 'a', startsAt: '2026-10-01T10:00:00.000Z' }];
    const { bestOptionId, totals } = computeResults(options, []);
    assert.equal(bestOptionId, null);
    assert.equal(totals.a.score, 0);
  });
});

describe('validatePollInput', () => {
  test('requires a title', () => {
    const errors = validatePollInput({ title: '  ', options: [{ startsAt: '2026-10-01T10:00', durationMinutes: 60 }] });
    assert.ok(errors.some((e) => /title/i.test(e)));
  });

  test('requires at least one option', () => {
    const errors = validatePollInput({ title: 'Team sync', options: [] });
    assert.ok(errors.some((e) => /time option/i.test(e)));
  });

  test('rejects an invalid date', () => {
    const errors = validatePollInput({ title: 'x', options: [{ startsAt: 'not-a-date', durationMinutes: 60 }] });
    assert.ok(errors.some((e) => /invalid date/i.test(e)));
  });

  test('rejects a non-positive duration', () => {
    const errors = validatePollInput({ title: 'x', options: [{ startsAt: '2026-10-01T10:00', durationMinutes: 0 }] });
    assert.ok(errors.some((e) => /duration/i.test(e)));
  });

  test('accepts valid input', () => {
    const errors = validatePollInput({
      title: 'Team sync',
      options: [{ startsAt: '2026-10-01T10:00', durationMinutes: 60 }],
    });
    assert.deepEqual(errors, []);
  });
});

describe('isValidVoteValue', () => {
  test('accepts the three known values and rejects everything else', () => {
    assert.ok(isValidVoteValue('yes'));
    assert.ok(isValidVoteValue('if_need_be'));
    assert.ok(isValidVoteValue('no'));
    assert.ok(!isValidVoteValue('maybe'));
    assert.ok(!isValidVoteValue(''));
  });
});

describe('toCsv', () => {
  test('renders a header row of option times and one row per participant', () => {
    const options = [
      { id: 'a', startsAt: '2026-10-01T10:00:00.000Z' },
      { id: 'b', startsAt: '2026-10-02T10:00:00.000Z' },
    ];
    const participants = [{ id: 'p1', name: 'Ada' }];
    const responsesByParticipant = new Map([['p1', new Map([['a', 'yes']])]]);
    const csv = toCsv({}, options, participants, responsesByParticipant);
    const lines = csv.split('\r\n');
    assert.equal(lines.length, 2);
    assert.match(lines[0], /^Participant,/);
    assert.match(lines[1], /^Ada,yes,$/);
  });

  test('escapes commas and quotes in names', () => {
    const options = [{ id: 'a', startsAt: '2026-10-01T10:00:00.000Z' }];
    const participants = [{ id: 'p1', name: 'Smith, "Ace"' }];
    const csv = toCsv({}, options, participants, new Map());
    assert.match(csv, /"Smith, ""Ace"""/);
  });
});
