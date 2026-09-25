# ADR-0005: Single Docker Compose deployment — Postgres + S3-compatible storage + one app service

_Status: proposed · Date: 2026-09-25_

## Context

The skill's design principles (SKILL.md Phase 6) call for "operability first": one command to start, the fewest services that do the job, heavy components optional. Figma's own architecture (dossier §7) is a service-oriented system with separately-scaled components (real-time collaboration server, REST API, file storage, Dev Mode, search) built for hyperscale — appropriate for Figma's own operations team, not for a self-hoster running this on a VPS or homelab (charter: "where it runs").

## Decision

Ship a single **Docker Compose** stack for v1 self-hosting:
- **One application service** (Node/TypeScript) serving the REST API, the WebSocket sync endpoint (ADR-0001's Yjs/Hocuspocus server), and the web client.
- **Postgres** for durable state (documents' persisted Yjs updates, users, teams, comments, permissions).
- **An S3-compatible object store** (configurable — local MinIO for a single-node install, or any real S3-API-compatible provider for production) for exported assets and file thumbnails, coded against the S3 API per `architecture-inference.md` §6 so the backend is replaceable.
- No message broker, no separate search service, no Kubernetes requirement at v1 — all treated as later, optional additions if real usage demands them.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Mirror Figma's service-oriented architecture (separate real-time/API/storage/search services) | Matches how Figma itself scales | Far more operational weight than a self-hoster needs at target scale (tens of users); more services = more reasons to give up on installing (skill principle) | Wrong-sized for our actual target scale, which is orders of magnitude smaller than Figma's |
| SQLite instead of Postgres | Zero extra service for single-user/tiny installs | Real-time multi-user writes and future search/analytics needs fit Postgres's concurrency model better; Postgres is still a single container in Compose, so the operational cost difference is small | Postgres is the more scalable default without meaningfully increasing v1 operational burden |
| Require Kubernetes/Helm from the start | Matches "enterprise-grade" expectations | Actively hostile to the charter's stated self-host targets (laptop/VPS/homelab); most self-hosters start with Compose | Kubernetes manifests are a reasonable *later* addition, not a v1 requirement |

## Consequences

- What becomes easier: `docker compose up` is a realistic one-command start; migrations can run automatically on boot; backups are "back up two volumes" (Postgres data + object storage).
- What becomes harder, and what we accept: the single app service will eventually need to be split (e.g. a separate worker for the Figma-import job queue, ADR-0003) as usage grows — acceptable, deferred to a later ADR once M2 import work is underway.
- Operational impact on self-hosters: two services to run and back up (Postgres, object storage) plus the app itself; environment variables for config, no default credentials, telemetry off by default (skill principle: "safe defaults").
- License and dependency implications: Postgres (PostgreSQL License) and MinIO's self-hosted option should be re-checked for current license/edition status before adoption — `architecture-inference.md` explicitly flags that MinIO's community edition was archived in 2026, so the S3-compatible backend choice needs a fresh check at Phase 7, not assumed from this plan.
- How we would reverse this: services are containerized independently in Compose, so splitting the app service into multiple containers later is additive, not a rewrite.
