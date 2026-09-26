# Process log

## Phase 1 — Identify (2026-09-25)

- Target: Linear (linear.app), issue tracking/PM for software teams. Judged a clear match from the request's own wording ("open-source Linear for small teams") — no meaningful namesake collision for "Linear" in this context (checked implicitly via the pricing/changelog/method searches below, which all resolved unambiguously to linear.app).
- Route: build independently (Linear is closed-source SaaS).
- No user checkpoint taken — mode is Brief with "make the calls yourself."

## Phase 2 — Charter (2026-09-25)

- Wrote `docs/charter.md` with all fields marked `assumed` except mode (user-specified: Brief) and target (user-specified: Linear, small engineering teams).
- No clarifying questions asked, per "make the calls yourself."

## Phase 3 — Research (2026-09-25)

**Access issue encountered and handled:** WebFetch failed with "proxy refused the connection" for linear.app (all pages tried: /pricing, /features, /method) and g2.com (reviews page); a direct curl through the agent proxy confirmed `connect_rejected — organization policy` for linear.app:443. WebFetch also returned HTTP 403 for github.com/makeplane/plane directly, and `gh` CLI was not installed in this environment. `curl` to api.github.com returned a harness-level message that GitHub API access wasn't enabled for this session. **Response:** switched to WebSearch (which was reachable and returned synthesized snippets from third-party/aggregator pages) for everything Linear-specific, and to `raw.githubusercontent.com` (unblocked) for Plane's README, which fetched successfully and is the one `confirmed` source in this pass. This is disclosed in the dossier's access note and every affected claim is tagged `inferred` rather than `confirmed`.

Searches run (via WebSearch):
1. "Linear app pricing plans 2026" → dossier [S5]
2. "Linear app changelog 2026 new features" → dossier [S1]
3. "Linear vs Jira reviews complaints reddit" → dossier [S3]
4. "open source Linear alternative Plane Huly self-hosted issue tracker" → dossier [S4]
5. `"Linear" issue tracker reddit "wish it had" OR "biggest complaint" OR "missing feature"` → dossier [S3]
6. "Linear API GraphQL webhooks developers documentation" → dossier [S6]
7. "Linear method engineering team workflow cycles triage philosophy" → dossier [S7]
8. "Linear sync engine local-first architecture blog engineering" → dossier [S8]
9. "Linear funding valuation Series C investors 2025 2026" → dossier [S2]
10. "Vikunja OpenProject Taiga Focalboard self-hosted comparison 2026" → dossier [S10]

Pages fetched:
- `https://raw.githubusercontent.com/makeplane/plane/master/README.md` — succeeded, `confirmed`, → dossier [S9]
- `https://linear.app/pricing`, `/features`, `/method` — all failed (proxy refused)
- `https://github.com/makeplane/plane` — failed (403)
- `https://www.g2.com/products/linear/reviews` — failed (proxy refused)
- `https://itsaplan.dev/linear-alternative` — failed (proxy refused)
- `https://raw.githubusercontent.com/hcengineering/huly/main/README.md` — failed (404; branch/path likely wrong, not retried given time budget — Huly's feature claims stayed `inferred` from search snippets)

**Research floor check (Brief/Project minimum per skill: official site+docs, pricing page noting billing basis, ≥1 user-voice source, 2–3 rivals, name check, ≥5 fetched pages most of them primary):** Partially met, with a disclosed gap — pricing and changelog content was reached only via search snippets (not fetched primary pages) because the primary site was unreachable through this sandbox; only 1 primary page (Plane's README) was actually fetched. This is a known limitation of this pass, called out in the dossier and brief, with an explicit re-verification instruction before the plan is treated as final. Rivals (Plane, Huly, Vikunja, OpenProject, Taiga, It's a Plan) and user-voice pain themes were both covered.

**Sufficiency test:** met — can explain why people pay for Linear (dossier summary), sketch its core loop and domain model (dossier §6), name its three hardest technical problems (dossier §7), and reason about how it'd behave in an unresearched situation (e.g., predicting that guest access would be gated the same way private teams are, based on the observed Business-tier pattern).

## Phase 4 — Synthesize (2026-09-25)

- Wrote `docs/product/parity-matrix.md` (32 rows, tiered) and `docs/brief.md` from the dossier.
- Better-thesis grounded directly in dossier §4 (pricing gates) and §5 (review pain themes), not invented.

## Phase 5 — Guardrails (2026-09-25)

- Name check: 4 candidates tried and rejected (Cyclus, Waypost, Forgeboard, Tallyfire — see `docs/legal/provenance.md` for each rejection reason), 1 candidate cleared (Fenline) across web/category, bare-name, GitHub, and npm-registry searches (8 searches total, logged in the provenance log's Name check table).
- License: AGPL-3.0 + DCO, decided via `legal-and-licensing.md` §10's decision guide — see ADR-0003 for the full reasoning.
- Wrote `docs/legal/provenance.md`.

## Phase 6 — Design (2026-09-25)

- Wrote 4 ADRs (`docs/adr/0001`–`0004`): stack/architecture, sync strategy, license, integration abstraction.
- Wrote `ROADMAP.md` (M0–M3, Later, Won't).

## Phases 7–8 — not run

Mode is Brief: research and plan only, no code. No scaffold, no build, no release checklist run in this pass.
