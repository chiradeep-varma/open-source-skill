# ADR-0001: Node + Express + SQLite, no Docker requirement

_Status: accepted · Date: 2026-09-25_

## Context

Charter target: a single self-hoster running this on a laptop or small VPS, not multi-tenant SaaS scale. The skill's design principles call for running without Docker and without extra services (Postgres, Redis) unless scale truly needs them.

## Decision

Node.js (>=20) + Express, server-rendered EJS templates, and SQLite via `better-sqlite3` as the only datastore. `npm install && npm start` is the primary path; Docker is not provided in this prototype.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Postgres + a JS framework (Next.js) | More "production" feel, familiar to many devs | A second service to run and back up; build step | Overkill for the charter's scale; breaks the no-extra-services rule |
| Static generator (like LittleLink) | Zero backend | No accounts, no real click analytics — the actual job to be done | Core loop requires server-tracked clicks and per-user auth |

## Consequences

- What becomes easier: one process, one file (`data/west-larch.db`) to back up, trivial to run anywhere Node runs.
- What becomes harder: no built-in horizontal scaling; acceptable at the charter's scale, revisit if usage grows.
- Operational impact: a single SQLite file is the entire database; back it up by copying the file.
- License/dependency implications: `better-sqlite3` is MIT-licensed and ships prebuilt binaries for common platforms.
- How to reverse: swapping to Postgres later means changing the `src/db.js` module only; SQL is kept close to standard.
