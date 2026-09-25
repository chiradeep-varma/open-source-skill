// Branching logic: a small per-question rule list, evaluated in order.
// The first matching rule decides what comes next; no match falls through
// to the next question by position. This is our own design, inspired by
// (not copied from) the "logic jump" concept described in Typeform's docs.

function matchRule(rule, answerValue) {
  const val = String(answerValue ?? '').toLowerCase();
  const target = String(rule.value ?? '').toLowerCase();
  if (rule.operator === 'equals') return val === target;
  if (rule.operator === 'not_equals') return val !== target;
  if (rule.operator === 'contains') return val.includes(target);
  return false;
}

// questions: array sorted by position. rulesByQuestion: { [questionId]: rule[] }.
// answers: { [questionId]: string }. Returns the ordered list of questions
// actually visited given those answers (branching evaluated as you go).
function computeVisitedPath(questions, rulesByQuestion, answers) {
  if (questions.length === 0) return [];
  const byId = new Map(questions.map((q) => [q.id, q]));
  const visited = [];
  const seen = new Set();
  let current = questions[0];

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    visited.push(current);

    const rules = rulesByQuestion[current.id] || [];
    const answerValue = answers[current.id];
    let matchedRule = null;
    for (const rule of rules) {
      if (matchRule(rule, answerValue)) {
        matchedRule = rule;
        break;
      }
    }

    if (matchedRule) {
      if (matchedRule.target_is_end) break;
      current = byId.get(matchedRule.target_question_id) || null;
      continue;
    }

    const idx = questions.findIndex((q) => q.id === current.id);
    current = questions[idx + 1] || null;
  }

  return visited;
}

module.exports = { matchRule, computeVisitedPath };
