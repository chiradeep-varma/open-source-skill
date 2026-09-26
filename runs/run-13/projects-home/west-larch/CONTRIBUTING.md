# Contributing

## Dev setup

```
npm install
cp .env.example .env   # then edit SESSION_SECRET
npm run dev             # starts with auto-restart on file changes
```

Data lives in a single SQLite file at `data/west-larch.db` (path
configurable via `DB_PATH`). Delete it to start fresh.

## Running tests

```
npm test
```

Tests use Node's built-in test runner (`node:test`) against an in-memory
SQLite database — no extra services required.

## Coding conventions

- Plain Node.js/Express, server-rendered EJS views, no build step. Keep it
  that way — the point of this project is that `npm install && npm start`
  is the whole story.
- Business rules (validation, reordering, click counting) belong in
  `src/lib/` and `src/models/` so they're testable without spinning up the
  HTTP server.
- No new runtime dependencies without a good reason; this project
  deliberately stays small.

## Sign-off

Commits should include a `Signed-off-by` line (`git commit -s`), certifying
you wrote the change or otherwise have the right to submit it under the
project's license (the Developer Certificate of Origin).

## Proposing changes

Open an issue describing the problem before sending a large pull request —
small fixes and docs improvements can go straight to a PR.
