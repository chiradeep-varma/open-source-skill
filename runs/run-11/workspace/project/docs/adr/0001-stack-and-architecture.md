# ADR 0001: Stack and architecture

## Context
Building a self-hosted kanban board for an 8-person team. Must be operable by one
person with `docker compose up`, use the fewest services that do the job, and be
approachable for a contributor with one evening free.

## Decision
- **Next.js 14 (App Router, TypeScript)** as a single deployable: server-rendered
  UI + API routes in one process. Avoids running a separate frontend/backend
  service pair.
- **PostgreSQL + Prisma ORM** for storage. Postgres over SQLite: multiple people
  write concurrently (drag-drop reordering) and this keeps the door open to a
  real replica/backup story later; Prisma gives typed queries and migrations.
- **NextAuth.js, credentials provider** (email + bcrypt-hashed password) for auth.
  No OAuth/SSO — unnecessary surface for a private 8-seat instance. First-run
  admin is created from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars; the app refuses
  to start without a session secret.
- **dnd-kit** for drag-and-drop of lists and cards (actively maintained,
  accessible, no jQuery-era baggage).
- **Tailwind CSS** for styling — fast to build a clean UI without a design system
  dependency.
- **Docker Compose** (app + postgres, two services) as the only supported deploy
  path for v1. Migrations run automatically on container start.

## Alternatives considered
- **Meteor + MongoDB** (Wekan's stack): rejected — heavier runtime, less common
  in the target team's stack, harder to reason about migrations.
- **Separate SPA + API server**: rejected for v1 — two deployables instead of one
  is unnecessary operational weight at this scale.
- **SQLite**: reconsidered if a future "single binary, zero services" mode is
  wanted; documented as a later option, not chosen now because Postgres is the
  safer concurrent-write default and matches what self-hosters of comparable
  tools (Planka) already expect to run.
- **Real-time sync via WebSockets/CRDTs**: deferred to Later (see charter) — 8
  users rarely collide; optimistic UI + revalidation is enough for v1.

## Consequences
- Two containers to run, not one — acceptable trade for write-safety and a
  migration story.
- No offline/local-first mode — the app assumes it can reach its own server.
- Real-time collaboration is "refresh to see others' changes" for v1, not
  live-cursor sync; documented as a known gap in the README status table.
