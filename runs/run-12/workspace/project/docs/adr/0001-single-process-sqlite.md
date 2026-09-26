# ADR-0001: Single Node.js process with embedded SQLite

_Status: accepted · Date: 2026-09-25_

## Context

The charter's target operator is one developer self-hosting on a single VPS or homelab box for their own side projects — low thousands of links, light-to-moderate click volume (`docs/charter.md`). Bitly is built for multi-tenant SaaS scale, but that scale doesn't bind here (`docs/research/dossier.md` §7). The skill's operability principle calls for the fewest services that do the job.

## Decision

Build a single Node.js/Express process backed by an embedded SQLite database (via `better-sqlite3`, WAL mode). No separate cache, queue, or analytics-pipeline service. Runs with `npm start` or a single `docker compose up`.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Postgres + Redis + worker queue | Matches "real" SaaS architecture, scales further | Three services to run and back up for a single-operator tool | Over-built for the stated scale; violates operability-first principle |
| Serverless (edge functions + hosted DB) | No server to manage | Requires a cloud account/vendor, works against "self-host, own your data" motive | Contradicts the charter's motive (data ownership, cost control) |
| SQLite, single process (chosen) | One file to back up, one process to run, zero external dependencies | Not horizontally scalable, single-writer for the DB | Matches target scale exactly; upgrade path to Postgres exists if ever needed |

## Consequences

- Easier: a self-hoster copies one `.sqlite` file to back up everything; `docker compose up` is the entire install.
- Harder: won't scale past roughly one process's worth of write throughput — acceptable given the stated scale; documented as a known limit in the README.
- Operational impact: a named Docker volume holds the SQLite file; no other services to patch or monitor.
- License/dependency impact: `better-sqlite3` is MIT-licensed, compatible with the project's MIT license.
- Reversal: the data-access layer is isolated behind a small module (`server/db.js` + query modules), so swapping in Postgres later is a contained change, not a rewrite.
