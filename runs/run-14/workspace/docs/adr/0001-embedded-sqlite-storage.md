# 1. Embedded SQLite storage, no external database

## Context
The charter requires the project to run with no Docker and nothing else to install, on a self-hoster's single machine, at the scale of one team/friend group's polls (dozens of polls, tens of participants each — not multi-tenant SaaS scale).

## Decision
Store all data in a single SQLite file (`data/rustic-fjord.db`) via Node's built-in `node:sqlite` module (no native-compile dependency). No Postgres, Redis, or queue.

## Alternatives considered
- **Postgres**: better at real concurrency and scale, but requires a second service to install and operate — directly against "nothing else to install" for a self-hoster with one evening.
- **Flat JSON files**: simpler still, but loses transactional guarantees exactly where they matter (concurrent votes on the same poll) — see ADR 0003.

## Consequences
- First start creates `data/` and runs migrations automatically; no separate provisioning step.
- A single file is trivial to back up, move, or inspect — matches "openness by design" (an operator can `sqlite3` in and look).
- If usage ever needs true multi-writer concurrency at scale, this is the one component to revisit (flagged in `ROADMAP.md`), but it comfortably covers the charter's expected scale.
