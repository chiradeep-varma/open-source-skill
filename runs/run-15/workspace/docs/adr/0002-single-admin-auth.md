# ADR-0002: Single-admin session auth, no multi-user/SSO

_Status: accepted · Date: 2026-09-25_

## Context

Statuspage supports role-based team members and SSO, gated by tier (dossier §4, §6). Our target user is one person running their own side project's status page — a permissions model built for teams would be pure overhead here.

## Decision

Ship one admin account, configured via an `ADMIN_PASSWORD` environment variable (bcrypt-hashed at boot), authenticated with a server-side session cookie. No signup flow, no roles.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Multi-user with roles | Matches incumbent, scales to a team later | Real complexity (invites, roles, permission checks) for a use case the charter says is one operator | Deferred to Later (parity matrix) |
| No auth at all (admin routes open) | Simplest possible | Anyone who finds `/admin` can post fake incidents on a public page | Unacceptable even for a prototype — a status page's entire value is trustworthiness |
| OAuth/SSO | Matches incumbent's Enterprise tier | Requires an external identity provider — reintroduces a dependency | Deferred to Later; wrong scale |

## Consequences

- What becomes easier: zero user-management UI to build or secure.
- What becomes harder, and what we accept: no audit trail of "who posted this" beyond a single operator — acceptable since there's only one.
- Operational impact: the launcher generates `ADMIN_PASSWORD` and `SESSION_SECRET` automatically; the app refuses to start if either is missing, rather than falling back to a default.
- License/dependency implications: `bcryptjs` (MIT), `express-session` (MIT), plus a SQLite-backed session store.
- How we'd reverse this: the `users` table already has a `role` column reserved for this; adding real multi-user auth later doesn't require a data migration of existing incidents/components.
