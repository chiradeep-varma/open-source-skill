# Architecture

For contributors. See `docs/adr/` for the reasoning behind the big choices.

## Components

One Node.js/Express process, one embedded SQLite database (ADR-0001). No queue, cache, or separate analytics service — see ADR-0001 for why that's the right size for this project's target scale.

```
server/
  index.js            entrypoint: env checks, middleware, route mounting
  auth.js              credential check + requireAuth middleware (session or bearer token)
  db.js                SQLite connection + schema (created automatically on boot)
  models/links.js      all data-access queries (links, clicks, stats)
  lib/codes.js          short-code generation and slug validation
  lib/clickMeta.js      IP hashing + user-agent parsing for click records
  import/bitlyCsv.js    Bitly CSV import (see docs/importing.md)
  routes/
    auth.js             /login, /logout
    redirect.js          GET /:code — the public redirect + click-logging path
    dashboard.js          server-rendered HTML pages (requires auth)
    api.js                JSON REST API (requires auth)
  views/                EJS templates
  public/                static CSS/JS, no build step
```

## Data model

- **Link**: `code` (unique), `long_url`, `title`, `disabled`, `expires_at`, `created_at`.
- **Click**: `link_id` (FK, cascades on delete), `created_at`, `referrer`, `device_type`, `browser`, `os`, `ip_hash`.

Visitor IPs are never stored raw — only a salted SHA-256 hash (`server/lib/clickMeta.js`), just enough to compute a unique-visitor count without retaining anything that identifies a person.

## Request flow: a redirect

1. `GET /:code` hits `routes/redirect.js`.
2. Look up the link; if missing/disabled/expired, render the `gone` view with a 404.
3. Parse the `User-Agent` header (`ua-parser-js`) and hash the client IP.
4. Insert a `clicks` row.
5. `302` to `long_url`.

Click logging happens inline in the request, not via a queue — acceptable at this project's target scale (see ADR-0001); if that ever becomes a bottleneck, the insert is the one place to move off the request path.

## Auth

Single admin account, credentials from environment variables (no user table, no signup flow — see the charter's stated scope). Session cookies are signed (`cookie-session`, HMAC, no server-side session store). An optional `API_TOKEN` bearer token gives the same access for scripts, so the REST API works outside a browser session too.

## Running tests

```bash
npm test
```

Runs Node's built-in test runner (`node --test`) over `test/*.test.js`. Each test file points `DB_PATH` at a throwaway SQLite file in the OS temp directory, so tests never touch your real data.
