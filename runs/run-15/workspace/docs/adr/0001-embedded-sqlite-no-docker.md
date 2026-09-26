# ADR-0001: Embedded SQLite, no Docker required

_Status: accepted · Date: 2026-09-25_

## Context

The charter's target user is a solo operator self-hosting one status page for a side project, on a small VPS, a homelab box, or a laptop — not a team with an ops platform. Statuspage itself runs a multi-tenant architecture with a metrics/notification pipeline, which is the wrong shape to copy here (dossier §7).

## Decision

Use Node.js + Express with `better-sqlite3` as the only datastore, and no required external services (no Postgres, Redis, queue or Docker). The app creates its SQLite file and runs its own migrations on first boot.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| PostgreSQL | Handles higher concurrency, richer types | Requires a separate service to install/run/back up | Wrong scale for one operator; adds an install step the skill's design principles explicitly avoid |
| Docker Compose as the primary path | Consistent environment | Many self-hosters don't have/want Docker | Kept as an optional extra only, never the only path |
| A hosted DB (Turso, etc.) | No local file management | Reintroduces a third-party dependency and network cost — the exact thing this project exists to avoid | Contradicts the privacy/cost motive in the charter |

## Consequences

- What becomes easier: `npm install && npm start` is the entire setup; backup is "copy one file."
- What becomes harder: no built-in horizontal scaling — acceptable, a status page is low-write, read-heavy, and one operator's traffic is small.
- Operational impact on self-hosters: one process, one file, no ops burden.
- License and dependency implications: `better-sqlite3` is MIT-licensed.
- How we'd reverse this: the data access layer is isolated in `src/db.js`; swapping to Postgres later would touch one module.
