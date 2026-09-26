# Target dossier: Linear

> Research notes for building an independent open alternative. Contains facts, observations and analysis only. Contains no copied code, assets or substantial copied text.
> Claim tags: `confirmed` (I opened the source page itself) · `inferred` (reasoned from search-engine snippets or secondary sources, not a directly fetched primary page) · `assumption` (unverified) · `memory` (prior knowledge; unverified).
>
> **Access note:** linear.app, github.com, and g2.com all refused direct fetches through this sandbox's egress proxy (`connect_rejected` / 403 — organization policy, not a Linear-side block). Everything below sourced from those domains is therefore `inferred` from WebSearch result snippets (which themselves summarize primary pages), not `confirmed` by a direct read. The one exception is Plane's README, fetched directly via raw.githubusercontent.com. **Before publishing this dossier or building against it, re-verify the `inferred` pricing, feature and API claims against linear.app directly** — from an unrestricted network, this is a five-minute check.

_Research window: 2026-09-25 · Mode: Brief_

## Summary (write last)

- **What it is:** A fast, opinionated, keyboard-first issue-tracking and project-management tool built specifically for software teams, positioned against Jira's configurability-as-a-burden.
- **Why people pay:** Speed and craft (sub-50ms perceived navigation, offline-capable), an opinionated workflow that kills process bikeshedding (Cycles, Triage), and a product that engineers actually enjoy using — which drives bottom-up adoption inside companies that later buy seats.
- **Where the value lives:** Mostly in software and product craft (a genuinely hard local-first sync engine, UX polish), not in network effects, proprietary data, or regulated operations. That's good news for an open alternative — this is a category where the incumbent's moat is largely engineering execution, which is copiable in concept if not in code.
- **What an open version can capture:** The workflow model (Cycles, Triage, Projects/Initiatives, keyboard-first UX) is unprotected function, not expression, and is fully reimplementable. The specific sync-engine implementation is not accessible and must be redesigned from first principles; a server-authoritative, less exotic sync model is an acceptable simplification for the target scale (small teams, not Linear's own multi-tenant hyperscale).
- **Three hardest problems:** 1. Real-time sync with low perceived latency across clients. 2. A command-palette-driven UX over a large, richly related object graph, kept fast. 3. Deep, reliable git/CI integration (branch linking, PR status, deploy tracking) across multiple forges, not just GitHub.

---

## 1. Identity and history
- Linear was founded in 2019 by Karri Saarinen (ex-design lead at Airbnb and Coinbase), Tuomas Artman (ex-Uber), and Jori Lallo. `inferred` [S8]
- Funding: $13M Series A (Sequoia, Dec 2020) → $35M Series B (Accel, Sep 2023) → $82M Series C (Accel-led, with Sequoia, 01 Advisors, Seven Seven Six, Designer Fund, Index Ventures) at a **$1.25B valuation**, announced June 2025. Linear states it has been cashflow-positive since 2021 and holds more cash than it has raised in total. `inferred` [S2]
- Positioned explicitly as an "Atlassian rival" / Jira challenger in press coverage of the Series C. `inferred` [S2]

**So what for the build:** Linear is well-capitalized and moving fast (see the 2026 changelog below), not a sleepy incumbent to sneak past — the wedge has to be genuinely different (openness, self-hosting, pricing model), not a slower catch-up on the same feature list.

## 2. Concept and vision
- **Core insight:** most issue trackers (Jira above all) fail by being infinitely configurable, which pushes the cost of process design onto every team that adopts them. Linear's insight is that a good *opinionated* default workflow (states, cycles, triage) removes that tax entirely. `inferred` [S3][S7]
- **Core primitives and mental model:** Workspace → Teams → Issues, with Cycles (time-boxed work), Projects (longer-lived, cross-team initiatives), and Triage (a queue that intercepts new issues before they silently pile up in an ignored backlog) as the organizing verbs. `inferred` [S7]
- **Stated philosophy ("The Linear Method"):** an opinionated, minimal-process approach — 2-week cycles are described as the sweet spot for software teams, and Triage is framed as moving "which issues matter" out of an unreviewed backlog and into a queue someone actively works. `inferred` [S7]
- **Direction as of 2026:** Linear has been pushing hard into AI-native engineering workflow — "Linear Agent" (public beta, March 2026) lets AI agents work issues directly; "Code Intelligence" (May 2026) gives agents codebase awareness; "Diffs" (May 2026) brings code review into Linear; "Releases" (April 2026) ties issues to CI/CD deploy status; "Loops" (July 2026) are recurring agent workflows; "Team Initiatives" (August 2026) assigns ownership of initiatives to a team. `inferred` [S1]

**So what for the build:** The core primitives (Team/Issue/Cycle/Project/Triage) are freely reimplementable — they're function, not expression. Linear's 2026 direction (AI agents doing the engineering work, not just tracking it) is a fast-moving target built on a large, well-funded team; chasing it feature-for-feature is a losing wedge. The better play is to nail the human-facing core loop first and leave an **open, pluggable** hook for AI (bring-your-own-model/agent) rather than building a proprietary agent platform to compete head-on.

## 3. Market and industry
- **Category:** software-team issue tracking / project management, adjacent to general-purpose PM (Asana, Monday) and dev-specific tools (GitHub Issues, Jira, Shortcut).
- **Competitors (proprietary):** Jira (Atlassian) — the main incumbent Linear itself displaces; GitHub Issues/Projects (bundled, free, weaker workflow); Shortcut, Height.
- **Open competitors** (this is the field our project enters, not something to defer to):
  - **Plane** — `makeplane/plane`, **AGPL-3.0**, Django + Node/React stack, self-host via Docker Compose or Kubernetes, or managed "Zenith" cloud. Described as the closest spiritual successor to Linear's issue-tracker experience: work items, cycles, modules, views, an AI-assisted "Pages" feature, analytics. `confirmed` (README fetched directly) [S9]
  - **Huly** — `hcengineering/huly`, **EPL-2.0** (more permissive/weak-copyleft than AGPL), positions itself as an all-in-one replacement not just for Linear but for Notion, Slack and Google Calendar (issue tracking + docs + HR + calendar in one self-hosted platform). `inferred` [S4]
  - **It's a Plan** (`itsaplan.dev`) — a newer, small open-source project explicitly pitched as "open-source, self-hosted alternative to Linear and Plane," emphasizing AI agents working side-by-side with humans, self-hosted with your own DB and API keys, no per-seat fees. `inferred` [S4] — worth watching as a direct positioning peer, not a target to copy.
  - **Vikunja** — lighter-weight, task-management-leaning rather than sprint/cycle-based; ~5,374 GitHub stars; runs comfortably on a 2–4GB VPS; deploys in under 30 minutes via Docker Compose. `inferred` [S10]
  - **OpenProject** — much older (13 years) and heavier (recommends 8GB+ RAM, multi-container), ~15,148 stars; enterprise/PMO-oriented rather than engineering-team-oriented. `inferred` [S10]
  - **Taiga** — Agile/Scrum-focused, smaller community (~850 stars), heavier setup than Vikunja/Plane/Focalboard. `inferred` [S10]
  - **Focalboard** — Kanban-board-focused, quick to deploy, less structured around cycles/sprints. `inferred` [S10]
- **Where existing open alternatives fall short (the gap this project should target):** Plane is the closest match to Linear's actual workflow model but is a large Django+Node codebase (heavier to run and to contribute to than a focused small-team tool); Huly goes wide (all-in-one) rather than deep on the engineering-team issue-tracking loop; the smaller "It's a Plan" project is early and validates that "open-source Linear, AI-agent-aware" is a real, currently under-served niche rather than an empty one. None of them is optimized specifically for "small engineering team, single VPS, one command to run" the way this project's charter targets.
- **Structural trend:** the category is visibly bifurcating into "AI agents do the engineering work" (Linear's 2026 direction) versus "plain, fast, human-operated tracker" — small teams without budget for Linear's Business/Enterprise tiers, or who want data ownership, are the underserved segment on the open side.

**So what for the build:** Build in this field deliberately, not against it — Plane and Huly aren't things to recommend instead; they're evidence of what the workflow-primitive reimplementation looks like and where a smaller, single-purpose, small-team-first, easy-to-self-host project can differentiate on operability and openness of the parts Linear paywalls (SSO, guest access, custom fields).

## 4. Business model
- **Pricing (2026), per-seat, inferred from aggregator sites, not the primary pricing page:**

  | Tier | Price | Gated features (what forces upgrade) |
  |---|---|---|
  | Free | $0 | Unlimited members, but capped at 2 teams, 250 issues, 10MB uploads |
  | Basic | $10/user/mo (annual) | Unlimited issues, up to 5 teams |
  | Business | $16/user/mo (annual) | Unlimited teams, **private teams**, **guest access**, Linear Agent (AI triage/automation) |
  | Enterprise | custom, annual-only | SAML/SCIM SSO, granular admin controls, invoice/PO billing, migration support |

  `inferred` [S5]
- **Feature × tier gating (what hurts small teams specifically):** guest access and private teams sit behind Business ($16/seat); SSO/SAML sits behind Enterprise (custom pricing, typically requiring a sales conversation and a minimum seat count) — both are things a 10-person self-funded engineering team often wants on day one and can't get cheaply. `inferred` [S5]
- **Distribution model:** self-serve, bottom-up (engineers adopt it, then it spreads to the org) — consistent with its "engineers love it" reputation. `inferred`
- **Billing:** annual billing required for paid tiers (monthly available at a premium); a startup program gives up to 6 months free on Basic/Business, but only for non-paying companies under 50 employees affiliated with a Linear partner — i.e., not universally available. `inferred` [S5]

**So what for the build:** The clearest, most defensible "Diff" (differentiator) tier in the parity matrix is: give away for free, by default, what Linear paywalls specifically to punish small/growing teams — guest access, SSO (OIDC at minimum), and no artificial team/issue caps. That's a direct, evidence-backed better-thesis, not a guess.

## 5. Users and jobs
- **Segments:** primarily software engineering teams (ICP), with product managers as a strong secondary segment; non-technical stakeholders (execs, designers, ops) are a weaker fit. `inferred` [S3]
- **Job to be done:** "When a bug or feature request comes in, I want to triage, prioritize, and schedule it into a cycle without a process meeting, so the team ships predictably without babysitting a tracker."
- **Love themes:** speed and responsiveness ("loads most pages in <50ms" perception), keyboard-first workflow, an opinionated model that kills process debate, tight git integration. `inferred` [S3][S7]
- **Pain themes** (from G2-style review snippets, aggregated, not directly fetched):
  - No native documentation/wiki space — teams end up paying for Notion or Confluence alongside Linear, and juggling two tools for specs/RFCs next to tickets. `inferred` [S3]
  - Limited dashboards and reporting; no JQL-style custom filtering/views the way Jira offers. `inferred` [S3][S6]
  - No general-purpose custom fields — a recurring "missing feature" complaint. `inferred` [S6]
  - Weak fit for non-engineering stakeholders who want a simple high-level view without learning the tool's model. `inferred` [S3]
  - Perceived as "too minimal" for teams that lean on detailed analytics/complex workflows. `inferred` [S3]
- **Switching blockers:** the data itself (issue history, cycle history) and habituated keyboard muscle memory; also increasingly the AI-agent workflows once a team has built process around them (2026 direction).
- **Switching triggers:** hitting the Business-tier price wall for guest access/SSO; wanting custom fields or a native docs space; wanting to self-host for data ownership or compliance; wanting predictable non-per-seat cost as headcount grows.

**So what for the build:** The pain themes map directly onto Must-have/Diff rows in the parity matrix: native lightweight docs, custom fields, and free SSO/guest access are not nice-to-haves, they're the specific reasons people already say they'd leave.

## 6. Product
- **Feature inventory:** see `docs/product/parity-matrix.md`.
- **Core loop:** *New work enters* (manually, via email-in, Slack, API, or integrations like Sentry) → **Triage** (a team member accepts, routes, prioritizes, or declines it) → issue sits in the team's **Backlog** or is pulled into the active **Cycle** → **worked** (a git branch is created/linked, PR opens, status auto-updates as the PR moves through review/merge) → issue reaches a **Completed** workflow state → **Cycle** closes on schedule and any incomplete issues roll forward automatically → **Project**/**Initiative** views roll individual issues up into cross-team roadmap status for stakeholders. `inferred` [S7]
- **Key workflows:** (1) Triage an incoming issue. (2) Plan a cycle (pull backlog items in, set scope). (3) Work an issue end-to-end with git linkage. (4) Build and review a project/initiative roadmap. (5) Search/navigate via the command palette (all-keyboard). (6) Configure a team's workflow (custom states within Backlog/Unstarted/Started/Completed/Canceled categories).
- **Domain model** (entities and relationships, reimplementable — this is function, not Linear's expression):

  ```
  Workspace 1—* Team
  Team 1—* Member (via WorkspaceMember, role: admin/member/guest)
  Team 1—* Issue
  Team 1—* Cycle
  Team 1—* WorkflowState (category: backlog|unstarted|started|completed|canceled)
  Team 1—* Label
  Issue *—1 WorkflowState
  Issue *—1 Cycle (optional)
  Issue *—1 Project (optional)
  Issue *—* Label
  Issue 1—* Comment
  Issue 1—* SubIssue (self-referential parent/child)
  Issue *—* Issue (relation: blocks | blocked_by | related | duplicate_of)
  Issue 1—* Attachment (e.g. linked PR, external ref)
  Project *—* Team (cross-team)
  Project *—1 Initiative (optional)
  Initiative 1—* Project
  ```

- **Permissions model:** workspace-level roles (admin / member / guest), with team-level membership; guest access and private teams are commercially gated in the incumbent (see §4) — a natural place to be more open. `inferred` [S5]
- **Integrations and extension points:** a public GraphQL API (same API Linear's own client uses) with personal API keys scoped to read/write/admin/create-issue/create-comment; webhooks covering Issues, Comments, Attachments, Documents, Reactions, Projects, Project updates, Cycles, Labels, Users, Issue SLAs, delivered as HTTP(S) payloads shaped like the corresponding GraphQL entity. `inferred` [S6]
- **Platforms:** web, desktop (Electron-style), mobile apps; the web/desktop client is explicitly local-first/offline-capable. `inferred` [S8]
- **Notable UX conventions (described in our own words, not copied):** a single global command palette (typically bound to Cmd/Ctrl-K) as the primary navigation mechanism, rather than sidebar-click navigation; single-letter keyboard shortcuts for common actions; inline, no-modal issue creation.

**So what for the build:** This domain model is the spec to build from — general workflow-tracker structure (states, cycles, labels, relations) is standard prior art across the category (Jira, Plane, GitHub Issues all share the same shape), not Linear-specific expression. The specific GraphQL schema field names/docs text must not be copied verbatim; write an independent API design with the same *capabilities* (issue CRUD, webhooks on the same entity types) but original naming and documentation.

## 7. Technology
- **Inferred architecture (component sketch):**
  - `inferred` Client (web/desktop) ↔ local object cache (IndexedDB on web) — optimistic writes land locally first, then sync to server.
  - `inferred` Sync transport: GraphQL for mutations, WebSockets for push/sync of changes.
  - `inferred` Server holds authoritative order of operations — Linear's model is closer to centralized operational-transform-style ordering than to peer-to-peer CRDTs; CRDTs are reportedly used narrowly, for issue description rich text, not the whole object graph.
  - `inferred` Underlying store: not publicly confirmed in this pass; treat as unknown rather than guessing a specific database.
- **Data flow of the core loop:** client creates/edits an issue optimistically in its local cache → mutation sent to server → server assigns canonical order/version → change is broadcast over the sync channel to other connected clients → each client merges the incoming operation into its local object graph.
- **Hard problems, with why they're hard specifically here:**
  1. **Real-time sync with low perceived latency.** Multiple engineers editing/triaging concurrently, offline-capable clients, need for the UI to feel instant (sub-50ms) while staying correct — this is the product's signature differentiator, and getting it wrong either breaks correctness (lost updates) or breaks the "instant" feel that is the whole value proposition. `inferred` [S8]
  2. **Command-palette UX over a large, richly related object graph.** Fuzzy search, navigation, and bulk actions across thousands of issues/projects/labels need to stay fast client-side, which requires a well-designed local index, not just a network round-trip per keystroke.
  3. **Deep git/CI integration across forges.** Branch-naming conventions, PR status sync, and (in 2026) deploy/release tracking are core to why engineers trust the tool as "where the work actually lives," and reliably wiring this up (webhooks, OAuth apps, retries, idempotency) for GitHub alone is real engineering effort — doing it for GitLab and self-hosted Gitea/Forgejo too (which self-hosters will expect) multiplies the surface.
- **Their scale vs. our target scale:** Linear operates as multi-tenant SaaS at large scale (many thousands of workspaces). This project's charter targets small teams (2–50 users) on a single VPS. That gap is exactly where the architecture should be simplified — a single-node, server-authoritative Postgres-backed sync model is adequate; Linear's own exotic local-first sync engine is not a requirement, it's a possible *later* differentiator once the core loop works.

**So what for the build:** Replicate the *feel* (fast, keyboard-first, low-latency-feeling UI) without replicating the *mechanism* (Linear's specific sync engine, which is neither observable nor necessary at this scale). See ADR-0002.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | High — this is essentially the whole product | **Match/Beat** | The workflow model is unprotected function; execution quality (speed, polish) is a craft gap that's closable with focused engineering, not a legal or capital barrier |
| Network effects | Low — issue trackers aren't inherently multiplayer-viral across companies | **N/A** | Not a meaningful moat for this category |
| Data | Low — each workspace's data is its own, not aggregated across customers | **Beat** | Self-hosting means the team owns its data outright, which Linear's SaaS model structurally can't offer |
| Content | None | **N/A** | No content library moat in this category |
| Operations and humans | Low-medium — support quality, uptime SLAs for Enterprise | **Substitute** | Self-hosters trade "someone else runs it" for "we control it"; document operational burden honestly |
| Hardware | None | **N/A** | |
| Brand and trust | Medium — "Linear" is a known quality signal among engineers | **Substitute** | An open project earns trust differently (public code, audits, community) not by brand recognition |
| Licenses and certifications | Low for this category (no SOC2-gated core functionality) | **Match** | Nothing regulatory blocks an open version; Enterprise-tier compliance features (audit log, SSO) are buildable and are exactly where Linear gates hardest |

## Legal surface
- **Trademarks to avoid:** "Linear" as a name/mark, Linear's logo, any name containing "Linear" or a confusingly similar sound-alike (e.g. no "OpenLinear", "LinearOSS", "FreeLinear"). Refer to it only factually: "an open-source alternative to Linear," with a non-affiliation line.
- **Relevant terms-of-service clauses:** not reviewed in this pass — linear.app's Terms of Service page could not be fetched through this sandbox's proxy. **Before designing an API-based importer or automating any interaction with a real Linear account, fetch and review linear.app's Terms of Service for reverse-engineering, competitive-use, or automated-access clauses.** The safest importer path in the meantime is the user's own manually-triggered CSV/data export, not scripted API polling.
- **Known patent concerns:** none identified; issue-tracking workflow patterns are widely prior-arted across Jira, GitHub Issues, Trac, Bugzilla, etc. Not a patent-heavy domain.
- **Regulated activities:** none inherent to the product category. If the project later adds e-signature-style approvals or payment features, revisit.

## Contradictions and open questions
- Pricing figures ($10/$16 per seat, tier gates) came from multiple aggregator sites that agreed with each other, but none is Linear's own pricing page (which the proxy blocked) — re-verify directly before quoting these numbers publicly.
- Linear's actual database/infra choices are not confirmed anywhere in this pass; the "inferred architecture" in §7 should stay labeled speculative and never be presented as fact.
- Whether Linear's guest-access and custom-fields gaps still hold as of today should be spot-checked again close to build time, since the 2026 changelog shows the product is shipping quickly (AI-agent features especially).

## Sources

| # | Title | URL | Published | Accessed |
|---|---|---|---|---|
| S1 | Linear Changelog (multiple 2026 entries: Linear Agent, Diffs, Releases, Code Intelligence, Loops, Team Initiatives) | https://linear.app/changelog | 2026-03 to 2026-08 | 2026-09-25 (via search snippets only; page itself unreachable) |
| S2 | TechCrunch — "Atlassian rival Linear raises $82M at $1.25B valuation" and related coverage (Built In SF, The SaaS News, Silicon Valley Invest Club, Tracxn) | https://techcrunch.com/2025/06/10/atlassian-rival-linear-raises-82m-at-1-25b-valuation/ | 2025-06-10 | 2026-09-25 (via search snippets) |
| S3 | G2 Linear reviews (aggregated via search, incl. g2.com/products/linear/reviews) and comparison write-ups (ClickUp, ones.com "Linear vs Jira Reddit") | https://www.g2.com/products/linear/reviews | ongoing | 2026-09-25 (via search snippets; g2.com itself refused direct fetch) |
| S4 | Search results on open-source Linear alternatives: itsaplan.dev, openalternative.co/alternatives/linear, opensourcechoice.com, use-apify.com blog | multiple | 2026 | 2026-09-25 (via search snippets) |
| S5 | Linear pricing aggregators: JoinSecret, Vendr, Quackback, Costbench, Usecarly | https://www.vendr.com/marketplace/linear (representative) | 2026 | 2026-09-25 (via search snippets; linear.app/pricing itself refused direct fetch) |
| S6 | Linear Developers docs (API and Webhooks) — description only, via search snippet | https://linear.app/developers/webhooks | ongoing | 2026-09-25 (via search snippets; page itself unreachable) |
| S7 | "13 principles of the Linear Method" (prioritization.substack.com) and Linear Method site description, plus openhands.dev and issuelinker.com write-ups on cycles/triage | https://linear.app/method/introduction (unreachable directly) | ongoing | 2026-09-25 (via search snippets) |
| S8 | Sync-engine analysis: fujimon.com/blog/linear-sync-engine, bytemash.net, reverse-linear-sync-engine (GitHub, description only, not opened), techinterview.org | multiple | 2026 | 2026-09-25 (via search snippets; no implementation code was read) |
| S9 | Plane README | https://raw.githubusercontent.com/makeplane/plane/master/README.md | current | 2026-09-25 (fetched directly — `confirmed`) |
| S10 | OSS PM tool comparisons: openalternative.co (OpenProject vs Vikunja, Taiga vs Vikunja, Focalboard vs Vikunja), sanplex.com, forum.cloudron.io | multiple | 2026 | 2026-09-25 (via search snippets) |
