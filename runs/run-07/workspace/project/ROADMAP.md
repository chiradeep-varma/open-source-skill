# Roadmap

Status: **planning stage** — nothing below has been built yet. This is the Brief-mode plan; see `docs/` for the research behind it.

## M0 — Skeleton
- Repo scaffold (TypeScript monorepo: API + web app), per ADR-0001.
- Docker Compose one-command self-host: app container + Postgres, automatic migrations.
- Auth: email/password + OIDC login, workspace and team creation.
- Empty issue list UI, no workflow logic yet.

## M1 — Core loop
- Issues: create/edit, title, description, assignee, priority, estimate, sub-issues, relations, comments.
- Workflow states (custom states within standard categories).
- Triage inbox.
- Cycles, with automatic rollover of incomplete issues.
- Labels, saved Views.
- Command palette + core keyboard shortcuts.
- Data export (from day one, not bolted on later).

**Demo at this milestone:** a team can triage an incoming issue, schedule it into a cycle, move it through states, and export their data — the full core loop, single-player.

## M2 — Switch-blockers
- Importer from a Linear workspace export (validate against a real export before shipping — see provenance log).
- Git integration: GitHub first, built on the forge-agnostic abstraction (ADR-0004); branch linking, PR status sync.
- Full-text search (Postgres FTS).
- Notifications (in-app + email).
- Public API + outbound webhooks.
- **Diff-tier capabilities that double as switch-blockers:** free guest access, free private teams, free OIDC SSO — everything Linear gates behind Business/Enterprise (dossier §4), given away by default here.

**Demo at this milestone:** a team can migrate a real Linear workspace, wire up GitHub, invite a guest reviewer, and log in via SSO — with nothing paywalled.

## M3 — Differentiators
- Custom fields per team.
- Lightweight docs/wiki linked to issues and projects (the most-cited Linear complaint in review mining — dossier §5).
- Self-serve automation rules ("when X, do Y" — not an AI agent).
- Audit log.
- Initiatives (roadmap rollup across projects).
- GitLab and Gitea/Forgejo integrations, extending the M2 abstraction.
- Pluggable, bring-your-own-key AI assist hook (optional; not a proprietary agent platform — see "Won't").

## Later
- Native mobile apps.
- Offline-first sync engine (revisit ADR-0002 if demand appears).
- Time tracking.
- Advanced analytics/insights.
- SAML SSO (beyond OIDC), if enterprise-ish self-hosters ask for it.

## Won't (for now)
- Cloning Linear's proprietary AI-agent product surface (Linear Agent, Diffs, Code Intelligence) feature-for-feature — a fast-moving, deeply proprietary target from a well-funded team; the pluggable AI hook in M3 is the honest substitute. See dossier §2 and parity matrix.
- An all-in-one suite (docs + HR + calendar + chat) the way Huly is betting on — staying focused on the engineering-team issue-tracking loop is the point of this project, not going wide.

## Not yet in this plan
- A hosted-offering / business model (Venture mode) — the charter leaves this as an open question for the user to decide on later.
