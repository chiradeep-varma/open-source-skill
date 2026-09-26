# 3. Database-level uniqueness for votes, not just UI checks

## Context
The build-and-release guidance requires that anywhere two users can race for the same thing, it's enforced in the database, not only checked in the UI before the write. A participant double-clicking submit, or two browser tabs for the same edit token, could otherwise create duplicate response rows and corrupt the results grid's counts.

## Decision
`responses` has a `UNIQUE(participant_id, option_id)` constraint; writing a vote is an upsert (`INSERT ... ON CONFLICT (participant_id, option_id) DO UPDATE`) inside a single transaction that also validates the poll isn't finalized. Participants are keyed by `UNIQUE(poll_id, edit_token)` for the same reason.

## Consequences
- Duplicate submits are idempotent instead of corrupting counts, without needing a client-side debounce to be correct (though one is still added for UX).
- Verified by an automated test that fires concurrent duplicate votes and asserts exactly one response row survives (`test/scheduling.test.js`).
