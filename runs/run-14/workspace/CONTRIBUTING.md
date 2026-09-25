# Contributing to rustic-fjord

Thanks for considering it. This is a small, deliberately simple project — please keep changes in that spirit.

## Getting set up
```bash
npm install
npm run migrate
npm start
```
Run the tests with `npm test` (Node's built-in test runner — no extra dependency to install).

## Ground rules
- **No Docker requirement.** The native `npm install && npm start` path must keep working.
- **No new required external services** (no Postgres/Redis/etc.) without discussing it in an issue first — see `docs/adr/0001-embedded-sqlite-storage.md` for why SQLite was chosen.
- **Never read or copy code from Doodle or any other incumbent scheduling product.** This project is built from public behavior and its own design only — see `docs/legal/provenance.md`. Implement features from a written spec or issue description, not from reading a competitor's source.
- **Tests for scheduling logic.** Changes to `src/scheduling.js` or `src/repo.js` (vote counting, best-option selection, concurrency handling) need a test in `test/`.
- **No ads, tiers, or usage limits.** Every feature here is available to every self-hoster.

## Reporting bugs / proposing features
Open an issue. For anything touching the vote-counting or finalize logic, include the input (options + responses) that produces the wrong result — that maps directly onto a test case.

## Code style
Plain modern JavaScript (ES modules), no build step, no framework beyond Express/EJS on the server and vanilla JS on the client. Keep it that way unless there's a strong reason to add a dependency.
