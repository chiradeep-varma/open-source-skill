# Parity matrix: Fenline vs. Linear

> One row per notable capability, grouped by concept-model primitive. Described in our own words from the dossier's domain model — not copied from Linear's UI text or docs.
> **Tier:** `Core` (the job fails without it) · `Switch` (people can't leave Linear without it) · `Diff` (our better-thesis) · `Later` · `Won't`.
> **Status:** all rows are `planned` — this is a Brief-mode plan, no code has been written yet.

_Last updated: 2026-09-25_

| Primitive / area | Capability | Linear's tier | Our tier | Effort (S/M/L) | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Issue | Create/edit/delete, title+description, assignee, priority, estimate | Free | Core | M | M1 | planned | dossier §6 | |
| Issue | Sub-issues (parent/child) | Free | Core | S | M1 | planned | dossier §6 | |
| Issue | Relations (blocks, blocked-by, related, duplicate) | Free | Core | S | M1 | planned | dossier §6 | |
| Issue | Comments + activity history | Free | Core | M | M1 | planned | dossier §6 | |
| Workflow | Custom named states within backlog/unstarted/started/completed/canceled categories | Free | Core | M | M1 | planned | dossier §6 | |
| Triage | Inbox for new issues before they enter backlog | Free | Core | M | M1 | planned | dossier §2, §6 (core loop) | |
| Cycles | Time-boxed cycles with automatic rollover of incomplete issues | Free | Core | M | M1 | planned | dossier §2, §7 | |
| Projects | Cross-team projects with status updates | Free | Core | M | M2 | planned | dossier §6 | |
| Initiatives | Group projects into a roadmap rollup | Free | Later | M | M3 | planned | dossier §6, §2 (2026 direction) | Lower priority than the core loop |
| Views | Saved, shareable filtered issue lists | Free | Core | S | M1 | planned | dossier §6 | |
| Navigation | Global command palette (keyboard-first) | Free | Core | M | M1 | planned | dossier §6 (UX conventions) | Our own shortcut scheme, not copied |
| Labels | Team-scoped labels, multi-select on issues | Free | Core | S | M1 | planned | dossier §6 | |
| Search | Full-text search across issues/comments/projects | Free | Core | M | M2 | planned | architecture-inference catalog | Postgres FTS first; pluggable engine later (ADR pending) |
| Git integration | Branch naming + PR auto-linking + status sync | Free | Switch | L | M2 | planned | dossier §6, §7 | GitHub first; abstracted for GitLab/Gitea |
| CI/deploy tracking | Attach deploy/release status to an issue | Free (2026 feature "Releases") | Later | M | M3 | planned | dossier §2 | Generic webhook-driven, not CI-vendor-specific |
| Import | Import a Linear workspace export (issues, cycles, labels, states) | n/a | Switch | M | M2 | planned | pain theme: lock-in (dossier §5) | Must be validated against a real Linear export before ship |
| API | Public GraphQL or REST API with API keys | Free | Switch | M | M2 | planned | dossier §6 | Own schema/docs, not copied from Linear's |
| Webhooks | Outbound webhooks on issue/comment/project/cycle events | Free | Switch | M | M2 | planned | dossier §6 | |
| Notifications | In-app + email notifications | Free | Core | M | M2 | planned | dossier §6 | |
| Guest access | Non-member users can view/comment on specific issues | **Business ($16/seat)** | **Diff** | S | M2 | planned | pricing gate (dossier §4) | Free in our version — direct better-thesis row |
| Private teams | Restrict a team's visibility | **Business ($16/seat)** | **Diff** | S | M2 | planned | pricing gate (dossier §4) | Free in our version |
| SSO | OIDC/SAML single sign-on | **Enterprise (custom)** | **Diff** | M | M2 | planned | pricing gate (dossier §4) | OIDC free for everyone; SAML if demand appears |
| Custom fields | Arbitrary per-team custom fields on issues | Not offered | **Diff** | M | M3 | planned | pain theme: "missing feature," (dossier §5) | Named gap in reviews; no Linear equivalent to match, just build it |
| Docs/wiki | Lightweight docs linked to issues/projects, no separate tool needed | Partial (Documents feature) | **Diff** | M | M3 | planned | pain theme: "no native docs" (dossier §5) | The most-cited Linear complaint we found |
| Automation rules | Self-serve "when X, do Y" automation | Limited without paid Agent tier | **Diff** | M | M3 | planned | pain theme: "lack of automation" (dossier §5) | Not an AI agent — plain rule engine |
| Audit log | Workspace activity audit trail | Enterprise only | **Diff** | S | M3 | planned | dossier §4 (gating pattern) | Cheap to build, strong open differentiator per architecture-inference catalog |
| Data export | Full data export in an open format | Available | Core | S | M1 | planned | openness-by-design principle | Should exist from day one, not bolted on |
| AI assist (bring-your-own-key) | Optional pluggable summarization/triage-assist hook | Linear Agent (Business+, proprietary) | Later | L | M3+ | planned | dossier §2 (2026 direction) | Pluggable provider, not a proprietary agent platform — see Won't |
| Linear Agent / Diffs / Code Intelligence parity | AI agents writing code, reviewing diffs, codebase-aware reasoning | Business+ / proprietary | **Won't** | — | — | n/a | dossier §2 | Fast-moving, deeply proprietary surface from a well-funded team — a bad wedge target; better served by integrating with existing coding agents via the API/webhooks than by cloning this |
| Mobile apps | Native iOS/Android clients | Free | Later | L | Later | planned | charter non-goals | Web-first; revisit after core loop lands |
| Time tracking | Native time tracking on issues | Not offered by Linear either | Later | S | Later | planned | — | Gap in both Linear and this plan; low priority |
| HR/CRM/calendar/chat | All-in-one suite beyond issue tracking | Not offered by Linear | **Won't** | — | — | n/a | dossier §3 (Huly comparison) | That's Huly's bet; staying focused on the engineering-team loop is the point of this wedge |

## Summary

- Core: 14 · Switch: 5 · Diff: 7 · Later: 6 · Won't: 3
- Current milestone: none started — this is a Brief-mode plan (research + design only).
- Honest status line for the future README: "Fenline is a design-stage, not-yet-built open-source alternative to Linear. Nothing here has shipped yet — see ROADMAP.md."
