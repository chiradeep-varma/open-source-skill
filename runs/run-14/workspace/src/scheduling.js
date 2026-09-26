// Pure, dependency-free scheduling logic — kept separate from Express/SQLite so it's easy to test.

export const VOTE_VALUES = new Set(['yes', 'if_need_be', 'no']);

export function isValidVoteValue(value) {
  return VOTE_VALUES.has(value);
}

/**
 * @param {{id: string, startsAt: string}[]} options
 * @param {{participantId: string, optionId: string, value: string}[]} responses
 * @returns {{
 *   totals: Record<string, {yes: number, ifNeedBe: number, no: number, score: number}>,
 *   bestOptionId: string | null
 * }}
 */
export function computeResults(options, responses) {
  const totals = {};
  for (const option of options) {
    totals[option.id] = { yes: 0, ifNeedBe: 0, no: 0, score: 0 };
  }

  for (const response of responses) {
    const bucket = totals[response.optionId];
    if (!bucket) continue;
    if (response.value === 'yes') bucket.yes += 1;
    else if (response.value === 'if_need_be') bucket.ifNeedBe += 1;
    else if (response.value === 'no') bucket.no += 1;
  }

  for (const bucket of Object.values(totals)) {
    bucket.score = bucket.yes + bucket.ifNeedBe * 0.5;
  }

  let bestOptionId = null;
  let bestScore = -Infinity;
  const sorted = [...options].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  for (const option of sorted) {
    const score = totals[option.id].score;
    if (score > bestScore && score > 0) {
      bestScore = score;
      bestOptionId = option.id;
    }
  }

  return { totals, bestOptionId };
}

export function validatePollInput({ title, options }) {
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required.');
  if (!Array.isArray(options) || options.length < 1) {
    errors.push('At least one time option is required.');
  } else {
    for (const option of options) {
      if (!option.startsAt || Number.isNaN(new Date(option.startsAt).getTime())) {
        errors.push(`Invalid date/time: ${option.startsAt}`);
      }
      const duration = Number(option.durationMinutes);
      if (!Number.isFinite(duration) || duration <= 0) {
        errors.push('Duration must be a positive number of minutes.');
      }
    }
  }
  return errors;
}

export function toCsv(poll, options, participants, responsesByParticipant) {
  const sortedOptions = [...options].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  const header = ['Participant', ...sortedOptions.map((o) => o.startsAt)];
  const rows = [header];
  for (const participant of participants) {
    const row = [participant.name];
    const byOption = responsesByParticipant.get(participant.id) ?? new Map();
    for (const option of sortedOptions) {
      row.push(byOption.get(option.id) ?? '');
    }
    rows.push(row);
  }
  return rows
    .map((row) => row.map(csvEscape).join(','))
    .join('\r\n');
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
