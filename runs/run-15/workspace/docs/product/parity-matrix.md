# Parity matrix: velvet-acorn vs. Statuspage

_Last updated: 2026-09-25_

| Primitive / area | Capability | Incumbent tier or plan | Our tier | Effort (S/M/L) | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Components | Create/edit/reorder/group components | Free (25 components) | Core | M | M1 | done | dossier §6 | No cap in our version |
| Components | Per-component status (operational…major outage) | Free | Core | S | M1 | done | dossier §2 | Drives the overall banner |
| Incidents | Create incident with impact + initial update | Free | Core | M | M1 | done | dossier §6 | |
| Incidents | Post timestamped follow-up updates | Free | Core | S | M1 | done | dossier §6 | |
| Incidents | Resolve incident | Free | Core | S | M1 | done | dossier §6 | |
| Incidents | Link incident to affected components | Free | Core | S | M1 | done | dossier §6 | |
| Public page | Overall status banner (worst-of) | Free | Core | S | M1 | done | dossier §6 (UX convention) | Pure, unit-tested function |
| Public page | Component list with live status | Free | Core | S | M1 | done | dossier §6 | |
| Public page | Incident history, grouped, paginated | Free | Core | M | M1 | done | dossier §5 (love theme) | |
| Maintenance | Scheduled maintenance windows shown on page | Free | Core | M | M2 | done | dossier §6 | Modeled as incident w/ impact=maintenance |
| Admin | Single-admin session auth | Team members (paid tiers) | Core (scoped down) | S | M1 | done | charter (scope cut) | Multi-admin is Later |
| Branding | Custom CSS/HTML, custom domain | Business tier ($399/mo) | Diff | S | M1 | done | dossier §4 (pricing gate) | Free by default, no gate, via env-set title/description |
| Subscribers | Unlimited "subscribers" (there are none to cap) | Capped per tier, priced | Diff | — | M1 | done | dossier §4 | No subscriber concept/limit exists in the code at all |
| Openness | JSON API (read) | REST API (all tiers) | Diff | S | M2 | done | dossier §6 | |
| Openness | RSS/Atom feed of incidents | Not offered | Diff | S | M2 | done | — | Cheap openness win |
| Notifications | Email/SMS/Slack/Teams subscriber alerts | Free–Enterprise | Later | L | M3+ | planned | charter non-goal | Needs a mail/SMS provider |
| Metrics | Uptime graphs from monitoring | Metrics add-on | Later/Won't | L | M3+ | won't (for now) | charter non-goal | Different product category |
| Admin | Multi-admin, roles, SSO | Paid tiers | Later | M | M3+ | planned | charter non-goal | Single admin is enough for one operator |
| Pages | Audience-specific private pages | $300+/mo | Won't | — | — | won't | charter non-goal | Out of scope for a public side-project page |

## Summary

- Core: 11 · Switch: 0 · Diff: 4 · Later: 3 · Won't: 2
- Current milestone: M2 done (components, incidents, maintenance, public page, JSON API, RSS all working).
- Honest status line for the README: "Core status-page loop works end to end (components, incidents, maintenance, history, JSON API, RSS). No email/SMS notifications, uptime metrics, or multi-admin yet — single admin only."
