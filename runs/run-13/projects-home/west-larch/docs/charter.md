# Project charter: west-larch

> Phase 2. "Just build it" mode: the user asked for Prototype mode and said to make the calls. All items below marked assumed are mine; none were confirmed back to the user before building, per their instruction.

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Linktree** · Linktree Pty Ltd (Melbourne, founded 2016) · linktr.ee · link-in-bio page builder · a single hosted page of buttons that stands in for the one link slot in a social bio · active, VC-backed, private |
| Sub-scope | The core web product: profile page + link list + click tracking + themes. Not the commerce/checkout features, not the mobile app, not Instagram/TikTok automation integrations. |
| Out of scope | Linktree's paid tiers, seller-fee marketplace, enterprise SSO, mobile apps |
| Route | Build independently. Linktree is closed-source SaaS; nothing of its code or assets is reused. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Privacy / data ownership (run your own copy, own the data and the domain) + missing feature (no forced `linktr.ee/*` URL, no seller fees, no plan gates) | assumed, from the request ("run myself") |
| Audience | Just the user, to start; built so anyone can self-host it for themselves or their team | assumed |
| Better-thesis seed | A link-in-bio page you actually own: your server, your database, your domain, no plan that gates analytics or removing the vendor's branding | assumed, grounded in review pain themes (branding lock-in, no custom domain, paid analytics) |
| Must-have workflows | 1. Sign up and create a profile · 2. Add/edit/reorder/hide links · 3. Visitors view the public page and click through, with clicks counted · 4. See basic analytics per link · 5. Pick a visual theme | assumed |
| Non-goals (this build) | Commerce/checkout, Instagram auto-import, mobile apps, seller fees, A/B testing, email capture forms | assumed — enterprise sprawl outside the wedge |
| Mode | Prototype | user, explicit |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Assumed comfortable running `npm install && npm start`, or using the one-click launcher | assumed |
| Stack | Node.js + Express + SQLite (via better-sqlite3) + server-rendered EJS. No framework build step, no Docker requirement, no external services. | assumed, per skill's "runs without Docker / nothing else to install" rule |
| Where it runs | Laptop or a small VPS, single instance | assumed |
| Expected scale | One person or a handful of self-hosters, hundreds of visitors/day — not multi-tenant SaaS scale | assumed |
| Time/budget | One session (Prototype mode) | user |

## Assets available

- No Linktree account, export or screenshots were used. Everything below comes from public search results and pages (see dossier). No Linktree terms were used to justify anything beyond ordinary public-web research.

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | AGPL-3.0 — this is a self-hostable network service; the license keeps hosted forks open, matching self-hosted alternatives in this space (Immich, Plausible) | assumed, per skill's license guide |
| Commercial intent | None for now | assumed |
| Public from day one | User decides at release (Phase 8); not published by this session | assumed |

## Open questions

- Whether the user wants multi-user signup open to anyone, or locked to invite-only — shipped as open signup for the prototype, easy to gate later.
- Custom domain support per-user was identified as a strong differentiator but is `Later`, not in this prototype (needs reverse-proxy/DNS docs).

## Change log

- 2026-09-25: created; Prototype build proceeding same session.
