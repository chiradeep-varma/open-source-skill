# Architecture

## Overview

A single Node.js process: Express for routing, server-rendered EJS views, and one SQLite database file via `better-sqlite3`. No build step, no background workers, no second service.

```
Browser ── HTTP ──▶ Express app (src/app.js)
                       ├─ middleware: security headers, static files,
                       │   body parsing, cookie session, loadUser, CSRF
                       ├─ routes/auth.js       (signup, login, logout)
                       ├─ routes/dashboard.js  (profile + link management)
                       └─ routes/public.js     (public profile page, /l/:id redirect, QR)
                             │
                             ▼
                       models/{users,links}.js ── SQL ──▶ SQLite file (data/west-larch.db)
```

## Data model

- **users**: one row per account — username (unique, case-insensitive), password hash, profile fields (display name, bio, avatar URL, theme), a running page-view counter.
- **links**: one row per link — belongs to a user, has a title, a URL, a `position` (for ordering), an `is_active` flag (hide without deleting), and a running click counter.

See `src/db.js` for the exact schema.

## Where to start reading

1. `src/app.js` — how the process wires together and starts.
2. `src/models/` — the only place that touches SQL; both models take a `db` handle as their first argument, which is how the test suite swaps in an in-memory database.
3. `src/routes/` — one file per area (auth, dashboard, public); thin, delegating validation to `src/lib/validate.js` and persistence to the models.
4. `src/views/` — EJS templates; `partials/head.ejs` and `partials/nav.ejs` are shared chrome.

## Key design choices (see `docs/adr/` for the full reasoning)

- **SQLite, not Postgres** (ADR-0001): the target scale is one self-hoster, not multi-tenant SaaS.
- **Click counting is atomic** (`UPDATE links SET clicks = clicks + 1 WHERE id = ?`), not read-modify-write, so concurrent visitors can't clobber each other's counts.
- **Username uniqueness is a database constraint** (`UNIQUE INDEX ... COLLATE NOCASE`), not just an application-level check, for the same reason.
- **No client-side JavaScript framework.** Reordering links uses plain form-submitted up/down buttons; this keeps the public page free of any script and keeps the whole app dependency-light.
- **Cookie-based sessions** (`cookie-session`), not a server-side session store, so there's no extra table or service to manage; the trade-off is a session that can't be revoked server-side before it expires (30 days).

## Running the tests

```bash
npm test
```

Uses Node's built-in test runner (`node:test`) against an in-memory SQLite database for the model-level tests, and a real (ephemeral-port) HTTP server for the integration test in `test/app.test.js`. No external services required.
