# Project Charter

## Target & scope
Building an open-source, self-hostable alternative to **Trello** (Atlassian), the
board/list/card kanban tool. Scope: the core boards→lists→cards workflow plus the
essentials teams actually use daily (labels, due dates, members, checklists,
comments). Not in scope: Power-Ups marketplace, Butler-style visual automation
builder, Enterprise SSO/SCIM, multi-workspace billing — these belong to a later
milestone, not the prototype.

## Mode
**Prototype**, user-selected, "just build it." Checkpoints are skipped; phases are
not. Assumptions made without asking are recorded below and can be revisited.

## Motive
Primary: **save money** (no per-seat fees for an 8-person team; Trello Standard/
Premium would run $40–80/mo for 8 seats forever) and **data ownership** (self-hosted,
own database, full export). Both point the same direction: a lean, single-tenant,
one-`docker compose up` app.

## Audience
The requesting user's own 8-person team. Not building for public multi-tenant SaaS
use (no billing, no plan tiers, no marketing site) — building for one org running
its own instance.

## Better-thesis seed
For a small team that outgrew sticky notes but doesn't want per-seat SaaS pricing or
their task data on someone else's servers, Corkboard is a self-hosted kanban board
that gives everyone full access on one flat install, unlike Trello, which meters
board count and automation runs on its free tier and charges per seat once you need
more than the basics.

## Must-have workflows (M1)
1. Team member signs in, sees the shared list of boards.
2. Create a board, add lists (columns), add cards to lists.
3. Drag cards between lists and reorder them; reorder lists.
4. Open a card: edit title/description, set due date, apply labels, assign members,
   add a checklist, comment.
5. Archive/delete cards, lists, and boards.

## Non-goals (this build)
- Power-Ups / third-party app marketplace
- Visual automation rule builder (Butler)
- Calendar/Timeline/Table/Map/Dashboard views
- Multi-workspace billing, plan tiers, seat metering
- SSO/SCIM, audit logs, enterprise admin console

## Constraints
- Runs on a single small VPS or homelab box for 8 users — trivial write volume.
- One-command self-host: `docker compose up`.
- Team is technical (the requester is a developer); still, defaults must be safe
  (no baked-in credentials, migrations run automatically).
- Time budget: one build session → Prototype depth, not full Project polish.

## Assets
None supplied by the user. No Trello export provided, so the Trello-JSON importer
(a switch-blocker feature) is stubbed with a documented format and a TODO rather
than tested against a real export.

## Openness
- License: MIT (see ADR 0002) — team wants to freely modify/fork with no copyleft
  obligation for a small internal tool; nothing here depends on staying compatible
  with a copyleft upstream.
- Public or private: user hasn't said; repo is built local-first, publishing is the
  user's call per Phase 8.
- Name: **Corkboard** — checked against web/GitHub search, no existing kanban
  product uses this name (see `docs/legal/provenance.md`).

## Assumptions made under "just build it"
- Postgres over SQLite: safer default for a shared team app even at small scale,
  and it's what Planka/most self-hosted competitors ship, so ops docs transfer.
- Single flat workspace (no multi-org/multi-tenant model) — matches an 8-person
  team, avoids a whole layer of unnecessary complexity.
- Auth: email + password (NextAuth credentials), no OAuth/SSO — simplest safe
  default for a private 8-person instance; env-configurable admin bootstrap.
- Real-time collaboration via polling/optimistic UI, not WebSockets — 8 users
  barely collide; a socket layer is not worth the operational complexity yet.
  Documented as a Later item.
