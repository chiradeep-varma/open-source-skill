# Project charter: Fenline (working name)

> Written in Phase 2, in "just build it" mode: the user asked for research + a plan with no stop-and-ask checkpoints. Every item below not explicitly stated by the user is marked **assumption**, made using the judgment calls the mode authorizes, and stays open to revision.

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Linear** · maker Linear (San Francisco, founded 2019 by Karri Saarinen, Tuomas Artman, Jori Lallo) · linear.app · category: issue tracking / project management for software teams · "The system for modern software development" — a fast, keyboard-first, opinionated issue tracker built around Cycles, Projects and Triage · status: active, well-funded, growing fast (see dossier §1) |
| Sub-scope | The web/desktop product's core: issue tracking, triage, cycles, projects, initiatives, views, git integration, API/webhooks. Excludes Linear's 2026 AI-agent surface (Linear Agent, Diffs, Releases, Code Intelligence) from parity scope — see Non-goals. |
| Out of scope | Linear Mobile app parity (Later), Linear Insights/analytics (Later), Linear's own AI agent product (Won't — see rationale below) |
| Route | Build independently. Linear is closed-source SaaS; no code, assets or text of theirs may be used. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Missing feature / customization (no self-hosting, no data ownership, no free SSO/custom fields, per-seat SaaS pricing) **and** cost, for a public open-source audience | assumed, from the user's framing ("open-source Linear for small teams") |
| Audience | Public — small engineering teams (roughly 2–50 engineers) who would self-host or run it themselves | assumed |
| Better-thesis seed | Keep Linear's opinionated speed and keyboard-first workflow, but remove the things small teams hit a wall on: per-seat pricing, SSO/guest-access paywalls, no custom fields, no self-hosting, and total dependence on a vendor's roadmap | assumed, grounded in dossier §5 pain themes |
| Must-have workflows (3–5) | 1. Triage inbox → issue creation & routing. 2. Cycle (sprint) planning and auto-rollover. 3. Projects/Initiatives roadmap rollup. 4. Keyboard-first command palette across all objects. 5. Git/PR integration (branch linking, auto status sync) | assumed, from dossier §6 core loop |
| Non-goals | Replicating Linear's proprietary AI-agent product (Linear Agent / Diffs / Code Intelligence) feature-for-feature; native video calls; HR/CRM/all-in-one suite (that's Huly's bet, not ours) | assumed — a fast-moving, deeply proprietary surface is a bad wedge target; see dossier §7 and ROADMAP "Won't" |
| Mode | **Brief** — research and plan only, no code | user-specified |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Assumed competent (writes code, can run a server/Docker) | assumed — user is scoping a build, not asking "what is Linear" |
| Languages and stacks the user can maintain | Not specified; design recommends a mainstream TypeScript stack (Node/Postgres/React) for the largest self-hoster and contributor pool | assumed, see ADR-0001 |
| Where it runs | Primary target: single VPS via Docker Compose. Secondary: Kubernetes for larger self-hosters. Not local-only/desktop-first. | assumed |
| Expected scale | Small teams: 2–50 users per workspace, low thousands of issues, single-region | assumed, matches "small engineering teams" in the request |
| Time and budget | Not specified; plan is scoped to a wedge (core loop) buildable incrementally, not a big-bang rewrite of Linear | assumed |
| Other | No stated compliance/offline/accessibility requirements; plan assumes standard GDPR-friendly defaults (export, deletion, telemetry off) since it's self-hosted software others will run | assumed |

## Assets available

- Accounts on the incumbent: none provided. No hands-on session with linear.app was performed in this research pass (see process log — linear.app was unreachable through the sandbox's egress proxy).
- Data exports: none provided. Importer design (parity matrix, "Import") is based on Linear's publicly documented export/API shapes and must be validated against a real export before it ships.
- Screenshots and recordings: none.
- Other material: none.

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | **AGPL-3.0** (recommended) — see ADR-0003 and provenance log | assumed, matches category norm (Plane) and keeps a future hosted offering from being forked into a closed competitor |
| Commercial intent | None committed now; keep the option open for a hosted offering later (Venture mode, not this pass) | assumed |
| Public from day one? | Yes — the point is an open-source project | assumed |
| Name ideas | **Fenline** (proposed, checked — see provenance log) | proposed by this pass |

## Open questions

- Does the user want a hosted-offering / business model explored (Venture mode) in a follow-up, or stay community-only?
- Confirm the target self-hosting profile: is "single VPS, Docker Compose" the right primary target, or is Kubernetes-from-day-one needed for the user's own use case?
- Confirm the name "Fenline" before it's used anywhere public (domain, GitHub org, package registry) — the checks run here were web/GitHub/npm search only, not a formal trademark register search (see provenance log).
- Should the importer prioritize Linear's CSV export, its GraphQL API, or both?

## Change log

- 2026-09-25: created, in Brief mode, no user checkpoints per "make the calls yourself" instruction.
