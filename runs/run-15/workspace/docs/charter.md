# Project charter: velvet-acorn

> Phase 2 charter. Mode is Prototype with "just build it" — the user removed checkpoints, so every answer below is an **assumption** the agent made on the user's behalf, written down so it can be revisited later.

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Statuspage** (statuspage.io) · Atlassian · https://www.atlassian.com/software/statuspage · hosted incident-communication / status-page SaaS · one-line: lets a company show component-level system status and post incident updates to a public or private page with subscriber notifications · status: active, owned by Atlassian since 2016 |
| Sub-scope | The core public-facing product: components, incidents/updates, incident history, status computation. Not Atlassian's account/billing system, not JSM/Opsgenie integration, not the mobile apps. |
| Out of scope | Multi-tenant SaaS hosting for third parties, SMS/phone notifications, uptime monitoring/metrics ingestion (that's a different product category — monitoring, not status communication), audience-specific private pages, SSO/SCIM. |
| Route | Build independently. Statuspage is proprietary SaaS, not open source or source-available, so no code or assets from it are reused — only publicly observable behavior and docs informed the design. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Cost + privacy/data ownership. The user wants a status page for personal side projects; Statuspage's cheapest plan is $29/mo and per-subscriber, which is disproportionate for a side project, and it means putting incident history on a third party's infrastructure. | assumed, from the request ("my own", "side projects") |
| Audience | Just the user, self-hosted, public-facing page for their visitors. | assumed |
| Better-thesis seed | Free, self-hosted, no subscriber caps or CSS/branding paywalls, own your incident data — trades away hosted email/SMS delivery and enterprise SSO, which a side project doesn't need. | assumed, grounded in dossier §4/§5 |
| Must-have workflows | 1. Admin defines components/services. 2. Admin opens an incident, posts timestamped updates, resolves it. 3. Visitor sees overall + per-component status at a glance. 4. Visitor reads incident history (past incidents, most recent first). 5. Admin schedules maintenance that shows on the page. | assumed |
| Non-goals (this build) | Email/SMS subscriber notifications, uptime metrics/graphs (needs a monitoring integration, separate concern), multi-team/SSO, billing, audience-scoped private pages. | assumed |
| Mode | Prototype: working core loop locally, light docs, "just build it" — no checkpoints. | user |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Writes code / runs servers (side-project builder). | assumed |
| Languages/stack | No preference stated → chose Node.js/Express + SQLite: single runtime, no external services, trivial to self-host on a $5 VPS or a homelab box. | assumed |
| Where it runs | Small VPS, homelab, or a laptop for local use — single low-traffic public page. | assumed |
| Expected scale | One operator, a handful of components, a few incidents a month, low read traffic (status pages are read-heavy, write-light). | assumed |
| Time/budget | One session (Prototype). | user |

## Assets available

- No Statuspage account, export or screenshots were provided by the user; design is based solely on public marketing/docs pages and search-engine summaries of them (see dossier — several primary pages could not be fetched directly in this session's network environment, so those claims are tagged `reported`, not `confirmed`).

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | Permissive, MIT — lowest friction for a personal side-project tool others may fork. | assumed |
| Commercial intent | None. | assumed |
| Public from day one? | User's choice at hand-off; built to be publishable as-is. | assumed |

## Open questions

- Whether the user wants hosted-email notifications later (would add a mail dependency — kept as a Later item).
- Whether multiple admins/teams matter later (kept single-admin for the prototype).

## Change log

- 2026-09-25: created, Prototype mode, all answers assumed per user's "make the calls yourself" instruction.
