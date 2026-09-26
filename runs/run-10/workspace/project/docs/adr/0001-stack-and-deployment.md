# ADR-0001: Single-service Node.js + SQLite stack, server-rendered UI

_Status: accepted · Date: 2026-09-25_

## Context

The charter's operator is a volunteer nonprofit with no dedicated ops team, deploying to a single cheap VPS (~$5-6/mo class). The dossier's technology lens found nothing about Typeform's actual scale problems that applies at this size — the hard part here is operability, not scale. The skill's design principles call for the fewest services that do the job, config in env vars, automatic migrations, and one-command deploy.

## Decision

Build one Node.js/Express process serving both a JSON API and server-rendered HTML (EJS templates), backed by a single SQLite database file (via `better-sqlite3`). No separate frontend build step: the public form-filling page and the admin builder are enhanced with small vanilla-JS modules loaded directly, no bundler, no SPA framework. Ship as one Docker image via Docker Compose with a bind-mounted volume for the SQLite file.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Postgres + separate DB container | More headroom for concurrent writes, familiar to many devs | A second container to patch/back up/monitor on a volunteer-run box | SQLite comfortably handles a nonprofit's response volume; fewer moving parts wins per the operability principle |
| React/Next.js SPA | Rich interactive builder UX | Build step, larger bundle, more JS to maintain, worse "view source and understand it" story for a volunteer contributor | Server-rendered HTML + small JS is faster to ship, easier to self-host, and the form-filling UX doesn't need SPA-level interactivity |
| Serverless functions (e.g. Cloudflare Workers) | No server to patch | Doesn't fit "cheap VPS" constraint from the charter; adds a platform dependency | Charter explicitly says VPS, not a managed platform |

## Consequences

- What becomes easier: deploy is `docker compose up -d`; backup is "copy one file"; a volunteer with basic Node knowledge can read the whole codebase.
- What becomes harder, and what we accept: SQLite has write-concurrency limits under heavy simultaneous load — acceptable for the charter's expected scale (a handful of forms, not a viral campaign); if the nonprofit ever outgrows this, migrating to Postgres later is a contained change behind the existing query layer.
- Operational impact: one container, one volume, no external services required. SMTP is optional and off by default.
- License/dependency implications: all chosen dependencies are MIT/ISC/BSD-licensed, compatible with shipping the whole project under AGPL-3.0-or-later.
- Reversal: swapping SQLite for Postgres later only touches the data-access module; the HTTP/template layer is unaffected.
