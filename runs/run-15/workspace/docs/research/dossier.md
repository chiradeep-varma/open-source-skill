# Target dossier: Statuspage (statuspage.io, Atlassian)

> Research notes for building an independent open alternative. Contains facts, observations and analysis only — no copied code, assets or substantial copied text.
> Claim tags: `confirmed` (opened the primary page) · `reported` (seen via search-engine summary; primary page not directly opened this session — the environment's outbound fetch proxy refused direct connections to atlassian.com during this session) · `inferred` · `assumption` · `memory`.

_Research window: 2026-09-25 · Mode: Prototype_

## Summary

- **What it is:** a hosted status page: a public (or private) page showing per-component system status plus a timestamped incident log, with subscriber notifications.
- **Why people pay:** it's the trusted, official channel a company points anxious users to during an outage, without building that page themselves. `inferred`
- **Where the value lives:** mostly software/workflow + brand trust (Atlassian's name lends credibility); some network effect via subscriber delivery infrastructure (email/SMS/Slack/Teams sending).
- **What an open version can capture:** the whole core loop — components, incidents, updates, history, public page — since none of it depends on Atlassian's infrastructure. What it can't cheaply capture: bulk transactional email/SMS delivery at scale, and the "everyone already trusts Atlassian" brand halo.
- **Three hardest problems:** 1. Computing one overall page status from many component statuses without surprising the operator. 2. Presenting an incident timeline that reads clearly both live (mid-incident) and historically (resolved, months later). 3. Making self-hosting genuinely a two-command, no-Docker-required experience.

---

## 1. Identity and history
- Statuspage.io was an independent startup; Atlassian acquired it in 2016 and it's now sold as "Atlassian Statuspage." `memory`, consistent with `reported` search results referring to "Atlassian Statuspage" throughout.

**So what for the build:** no history to replicate; irrelevant to a personal side-project tool.

## 2. Concept and vision
- Core insight: separate "is it down" communication from the incident-response tooling itself, so users get a calm, authoritative single page instead of guessing from social media. `inferred`
- **Core primitives:** *Component* (a piece of the service with a status), *Incident* (a timestamped narrative made of *Updates*, each carrying its own status), *Maintenance* (a scheduled, non-incident event), *Subscriber* (someone notified of changes), *Page* (the public artifact aggregating all of the above).
- Mental model: components have states (operational → degraded → partial outage → major outage, plus "under maintenance"); an incident's own status (investigating → identified → monitoring → resolved) is separate from the component states it affects. `reported`/`memory`

**So what for the build:** our domain model keeps exactly these two parallel state machines (component status vs. incident status) — collapsing them into one would lose real information the incumbent's own users rely on.

## 3. Market and industry
- Category: incident-communication / status pages, adjacent to (but distinct from) uptime monitoring.
- Proprietary competitors: **Instatus** (hosted, not open source, from $20/mo, free tier without custom domain) `reported`; **Better Stack** (formerly Better Uptime — full observability suite: monitoring + status pages + on-call) `reported`; **Status.io** `reported`.
- Open competitors: **Cachet** (PHP, older, community-maintained, self-hosted, free) `reported`; **OpenStatus** (Next.js, self-hostable, status pages + synthetic monitoring) `reported`.
- Structural trend: every review source that ranks alternatives lists self-hosted/open-source as its own category, i.e. there is durable demand specifically for "not hosted by a vendor." `inferred` from repeated "open source status page" roundup articles.

**So what for the build:** the gap isn't "no open alternative exists" (Cachet and OpenStatus already do) — it's that this build is scoped and designed specifically for a solo side-project operator: zero external services, no Docker requirement, a two-command start. That's the wedge, not novelty of concept.

## 4. Business model
- Pricing (Atlassian's site, via search summary, `reported`, accessed 2026-09-25): Public pages — Free (100 subscribers, 25 components, 2 team members, 2 metrics), Hobby $29/mo (250 subscribers, 5 team members), Startup $99/mo (1,000 subscribers, 10 team members), Business $399/mo (5,000 subscribers, 25 team members, full CSS/HTML customization + private pages), Enterprise $1,499+/mo (25,000 subscribers, 50 team members). Private pages and audience-specific pages are priced separately, audience-specific starting at $300/mo.
- **Feature × tier gating:** custom domain and full CSS/HTML branding require the Business tier; private pages likewise require paid tiers; team-member and subscriber counts scale with price.
- Distribution: self-serve signup, upsell by usage (subscribers, team members).

**So what for the build:** the single clearest, most defensible better-thesis lever is "everything is free and unlimited when you run it yourself" — no subscriber cap, no CSS paywall, no team-seat pricing — because that's precisely what the incumbent gates.

## 5. Users and jobs
- Segments: companies of every size that run customer-facing services; our target user is a solo/side-project operator, at the small end of that range.
- Job: "When my side project has an outage, I want a place to say so and later show I fixed it, so users trust the project and stop emailing me."
- **Pain themes** (`reported`, from review-summary search): pricing that scales awkwardly with subscriber count for a communication-only tool; CSS/branding and private pages locked behind the $399/mo Business tier; the mandatory Atlassian-account sign-in; no built-in monitoring, forcing a second tool.
- **Love themes** (`reported`): reliable and simple to operate *during* an actual incident — that's the one moment it must not get in the way.
- **Switching blockers:** none of real weight for a side-project user (no team depends on Statuspage-specific integrations); the main friction is just price for a tool used a few times a year.

**So what for the build:** optimize the incident-posting flow (admin, mid-outage, stressed) to be as few clicks as the "reliable and simple" praise implies — this is the one workflow that must never be janky.

## 6. Product
- **Core loop:** operator sets up components once → status stays "operational" by default → when something breaks, operator opens an incident, posts updates as it progresses, marks resolved → visitors see current state and can scroll incident history.
- **Key workflows:** (1) manage components (create, edit, order, group); (2) create incident with initial update + impact; (3) post follow-up updates changing incident status; (4) resolve incident; (5) schedule maintenance window; (6) visitor views public page.
- **Domain model:** `Component {name, description, group, position, status}`, `Incident {title, impact, status, created_at, resolved_at}`, `IncidentUpdate {incident_id, body, status, created_at}`, `IncidentComponent {incident_id, component_id}` join so an incident can reference which components it affects, `Maintenance` modeled as an `Incident` with `impact = maintenance` and a scheduled window.
- Permissions: incumbent has role-based team members + SSO; our prototype uses a single admin account (see ADR-0002) as a deliberate scope cut, documented as a Later item, not silently dropped.
- Integrations: incumbent has a REST API, webhooks, chat/automation integrations, 150+ third-party "components" mirroring other vendors' status. Our version ships a read JSON API and an RSS/Atom feed for incident history as the openness-by-design equivalent, sized for what a side project actually needs.
- Notable UX convention: an overall-status banner at the top of the page, colored and worded from the *worst* current component status, with the incident list right below it. `inferred`/`memory`, consistent with the general status-page genre (also used by Cachet, OpenStatus, GitHub's own status page).

**So what for the build:** the domain model and both state machines above are implemented as designed; the public page keeps the banner + component list + incident history layout because it is a genre convention understood by any visitor, not something distinctive to Statuspage's brand.

## 7. Technology
- Inferred architecture: multi-tenant SaaS, a page-rendering layer, a notification-delivery subsystem (email/SMS/webhooks/Slack/Teams) and a metrics-ingestion subsystem for uptime graphs — well beyond a side-project's needs. `inferred`
- Hard problems (for *any* implementation, including ours): overall-status aggregation logic that doesn't flip-flop or hide a real outage; rendering an incident timeline that's legible live and months later; safe concurrent admin edits.
- Our target scale: one operator, single low-traffic public page, embedded SQLite is comfortably sufficient — no Postgres/Redis/queue needed (see ADR-0001).

**So what for the build:** deliberately do not build the notification-delivery or metrics-ingestion subsystems — they're the parts of Statuspage's architecture that exist for its scale, not for a side project's.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | Strong | Match | The core loop is well understood and not technically deep. |
| Network effects | Weak here | n/a | Not applicable to a single-tenant status page. |
| Data | Weak | Beat | Operator owns their own incident history outright — no vendor lock-in. |
| Content | None | n/a | — |
| Operations and humans | Statuspage runs email/SMS delivery infra | Not reach (by design, out of scope) | Not worth building for a side project; document as a gap. |
| Hardware | None | n/a | — |
| Brand and trust | Atlassian's name | Substitute | A clean, honest, well-designed page earns trust on its own for a side project's small audience. |
| Licenses/certifications | SOC2 etc. for enterprise buyers | Not reach | Irrelevant to the target audience. |

## Legal surface
- Trademarks to avoid: "Statuspage," "Atlassian," their logo/wordmark and color scheme. Never used in the project name, and mentioned only factually here and in the provenance log.
- No terms-of-service were agreed to or reviewed (no account was created); research relied only on public marketing pages and third-party review summaries, so no ToS clause applies.
- No known patent concerns for a status-page/incident-log CRUD app.
- No regulated activity involved.

## Contradictions and open questions
- Exact current feature list per tier could not be `confirmed` by opening atlassian.com directly in this session (outbound fetch to that host was refused by the environment's proxy); the figures above come from a search-engine synthesis of multiple secondary sources and are tagged `reported`, not `confirmed`. They are directional (pricing scale, tier gating pattern) and were not load-bearing for any legal or feature-parity decision beyond "communication-only SaaS charges per-subscriber," which is corroborated by every source found.

## Sources

| # | Title | URL | Published | Accessed |
|---|---|---|---|---|
| S1 | Statuspage Pricing: Find the Right Plan for You (via search synthesis) | https://www.atlassian.com/software/statuspage/pricing | n/d | 2026-09-25 (reported, direct fetch blocked) |
| S2 | Real-Time Incident Communication with Statuspage (via search synthesis) | https://www.atlassian.com/software/statuspage | n/d | 2026-09-25 (reported, direct fetch blocked) |
| S3 | Statuspage.io Pricing: Hidden Costs & Caveats Explained | https://hyperping.com/blog/statuspage-pricing | n/d | 2026-09-25 |
| S4 | Statuspage Reviews & Product Details (G2) | https://www.g2.com/products/statuspage/reviews | n/d | 2026-09-25 (via search synthesis) |
| S5 | Statuspage vs Instatus: A Complete Comparison for 2026 | https://betterstack.com/community/comparisons/statuspage-vs-instatus/ | 2026 | 2026-09-25 |
| S6 | 8 Best Free & Open Source Status Page Tools in 2026 | https://betterstack.com/community/comparisons/free-status-page-tools/ | 2026 | 2026-09-25 |
| S7 | Top Five Atlassian Statuspage Alternatives in 2026 (OpenStatus) | https://www.openstatus.dev/guides/top-five-atlassian-statuspage-alternatives | 2026 | 2026-09-25 |
| S8 | 14 Best Free & Open Source Status Page Tools (Instatus blog) | https://instatus.com/blog/best-open-source-status-page-services | n/d | 2026-09-25 |
