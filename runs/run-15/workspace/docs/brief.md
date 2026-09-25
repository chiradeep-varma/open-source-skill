# Brief: an open alternative to Statuspage

**The product.** Statuspage is a hosted service that lets a company publish a status page — per-component system health plus a timestamped incident log — and notify subscribers when things change.

**Why people use it.** It's the calm, authoritative page you point worried users to during an outage. People like that it's reliable and simple *during* an actual incident (S4). They dislike per-subscriber pricing for a communication-only tool, CSS/branding and private pages locked behind the $399/mo Business tier, and the mandatory Atlassian account (S3, S4).

**Where its value lives.** Almost entirely software/workflow plus brand trust; a side project doesn't need Atlassian's brand halo or its bulk email/SMS delivery infrastructure to earn a visitor's trust.

**The field.** Cachet and OpenStatus already prove the open-source status-page concept works; Instatus and Better Stack compete as polished hosted alternatives (S5–S8). None of them is purpose-built for "one solo operator, one side project, zero external services."

**What we'll build.** *For indie developers running side projects who don't want to pay a per-subscriber SaaS fee or hand their incident history to a third party, velvet-acorn is a self-hosted status page that gives you components, incidents and full history with no subscriber caps or CSS paywalls — unlike Statuspage, which gates custom branding and private pages behind its $399/mo tier and prices by subscriber count.*
- Core loop: manage components → open an incident → post updates → resolve → visitors see live status and history.
- Switch-blockers covered: none apply (side-project users have no real Statuspage lock-in) — instead we remove the *reason* to consider Statuspage at all (price, ownership).
- Differentiators: free and unlimited self-hosting, own your data (SQLite file), JSON API + RSS feed for automation, no subscriber/seat pricing anywhere in the code.

**What we won't build (for now).** Email/SMS subscriber notifications (needs a mail/SMS provider — heavy for a prototype; Later), uptime metrics/graphs (a monitoring concern, not status communication; Later/Won't), multi-admin/SSO (Later), audience-specific private pages (Won't — out of scope for a public side-project page).

**Hard parts and how we'll handle them.**
1. Overall-status aggregation from many components → a small pure function, worst-status-wins, unit tested.
2. Incident timeline that reads well live and months later → updates rendered oldest-to-newest within an incident, incidents newest-first, grouped by month in history.
3. Zero-service self-hosting → Node.js + Express + SQLite (via `better-sqlite3`), no Docker/Postgres/Redis required, migrations run automatically on boot.

**Codename and license (proposed).** `velvet-acorn` (random, rename any time) · MIT, because it's a personal side-project tool meant to be freely forked and re-skinned with no copyleft friction.

**Design direction.** Quiet, precise, reassuring · a calm neutral surface where color is spent only on status (green/amber/red), never decoration — deliberately plainer than Statuspage's product-marketing gloss.

**Milestones.** M0 skeleton → M1 components + incidents + public page (this session) → M2 maintenance windows + JSON API/RSS → M3 later: notifications, multi-admin.

**Risks and open questions.** Atlassian's pricing/feature-tier figures come from search-engine summaries, not a directly fetched page, so they're `reported` not `confirmed` — noted in the dossier; this didn't affect any legal or design decision.

**Decision needed:** none — user asked to build autonomously in Prototype mode.
