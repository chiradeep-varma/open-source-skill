# ADR-0001: Monolithic app on a mainstream TypeScript + Postgres stack

_Status: proposed · Date: 2026-09-25_

## Context

The charter targets a small engineering team (2–50 users) self-hosting on a single VPS via Docker Compose, maintained by contributors giving up an evening, not by Linear's own multi-tenant hyperscale infrastructure team (dossier §7). Linear's actual stack is not confirmed by any source in this pass (see dossier §7, "not publicly confirmed") and must not be guessed at or copied — this decision is our own, driven by the charter's operability constraint, not by imitating Linear's architecture.

## Decision

Build a single deployable application: a Node.js/TypeScript backend (GraphQL API, per ADR-0004's API shape) and a React frontend, backed by a single Postgres database. Use Postgres itself for the job queue (e.g. a Postgres-backed queue library) and for full-text search initially, rather than standing up Redis, a message broker, or a separate search engine as day-one requirements.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Microservices (separate API, sync, search, worker services) | Mirrors how a large SaaS like Linear likely scales internally | Multiple services for a self-hoster to run and upgrade; more failure modes; harder for a solo contributor to reason about | Wrong scale target — charter is 2–50 users on one VPS, not multi-tenant hyperscale |
| Django + Node/React (Plane's stack) | Proven at this exact category, large existing contributor pool from Plane's own community | Two backend languages/runtimes to maintain; doesn't reduce operational footprint over a single-language monolith | A single-language stack is simpler for a small contributor base to own end-to-end |
| Go backend | Fast, single static binary, very self-hoster-friendly | Smaller pool of contributors comfortable with rich-domain-model CRUD + GraphQL in Go compared to TypeScript; frontend/backend type-sharing is lost | TypeScript end-to-end lets the API schema and frontend types stay in sync, which matters for a UI this interaction-heavy |

## Consequences

- What becomes easier: one command to self-host (Docker Compose with two containers: app + Postgres); one language for contributors to learn; migrations run automatically against a single database.
- What becomes harder, and what we accept: won't horizontally scale the way Linear's own infrastructure does — explicitly acceptable, since the charter's target scale is small teams, not Linear's own customer base.
- Operational impact on self-hosters: minimal — Postgres plus one app container, no mandatory Redis/broker/search-engine dependency at launch.
- License and dependency implications: Postgres (PostgreSQL License, permissive) and the chosen job-queue library should be OSI-approved and compatible with AGPL-3.0 (ADR-0003) — verify each specific library's license at build time per `architecture-inference.md` §6.
- How we would reverse this: if scale needs outgrow a single Postgres instance (unlikely at the charter's target scale), search and job processing are the first candidates to split out, since they're already abstracted behind their own interfaces (see ADR pending on search).
