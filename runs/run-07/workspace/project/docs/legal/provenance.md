# Provenance log

> This log is evidence that Fenline was created independently of Linear. It records what informed the work and what was deliberately never accessed. Keep it current: add an entry whenever a new kind of source is used, or a decision is made about access.

## Statement

Fenline is an independent implementation. It was designed from publicly available information about Linear's features, pricing and behavior (gathered via web search and a small number of directly fetched pages — see below), from general prior art common across the whole issue-tracking category (Jira, GitHub Issues, Plane, and others), and from original design work. No source code, decompiled or de-minified code, internal documents, or copyrighted assets or text of Linear were used or accessed. Fenline is not affiliated with or endorsed by Linear. "Linear" is a trademark of Linear (the company); it's used here only to identify the product this project offers an open-source alternative to.

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| 2026-09-25 | Web search (aggregator/press snippets, not Linear's own pages) | [S1]–[S8], [S10] in dossier | Pricing tiers, feature gating, 2026 product direction, funding history, user pain themes, sync-engine speculation |
| 2026-09-25 | Directly fetched public README | [S9] in dossier — raw.githubusercontent.com/makeplane/plane/master/README.md | Competitive-field understanding of Plane (an open rival, not Linear) — license, stack, feature set |
| 2026-09-25 | General domain knowledge of issue-tracker prior art (Jira, GitHub Issues, Bugzilla-style workflow models) | this pass's own reasoning | Domain model (§6 of dossier) — states/cycles/labels/relations are standard shapes across the entire category, not Linear-specific expression |

## Deliberately not accessed

- Linear's client-side source code, bundles, or source maps
- Any decompiled or disassembled Linear binary or app package
- Leaked, internal, or NDA material of any kind
- Linear's own account/dashboard (none was available in this pass, and none was used)
- Bulk-scraped content or user data from linear.app, G2, or any other source

## Name check

| Date | Search (where / query) | Result |
|---|---|---|
| 2026-09-25 | Web: "Cyclus" app software github | Collides with an active nuclear-fuel-cycle simulator project and org (`cyclus/cyclus`) — rejected |
| 2026-09-25 | Web: "Waypost" app software github | Collides with multiple active projects in adjacent spaces, including AI-agent project-tracking tools — rejected |
| 2026-09-25 | Web: "Forgeboard" project management github npm | Multiple active, direct project-management-tool collisions on GitHub — rejected |
| 2026-09-25 | Web: "Tallyfire" (general) | No exact collision, but phonetically/visually close to "Tallyfy," an active workflow/BPM software company with its own GitHub org — rejected as confusingly similar |
| 2026-09-25 | Web: "Fenline" app software github (name + category) | No software/PM product named Fenline; only unrelated "Fen"-prefixed projects (Kodi addon, IPFS demo app) |
| 2026-09-25 | Web: "Fenline" (bare name) | Unrelated: a UK railway line ("Fen Line"), an agricultural boot brand, a surname — no category overlap, low confusion risk |
| 2026-09-25 | Web: "Fenline" npm package OR trademark | No npm package or trademark registration found for "Fenline" |
| 2026-09-25 | GitHub search (via web search, "site:github.com" style queries) | No "Fenline" repository or org found in the project-management/issue-tracking space |

**"Fenline" is the proposed name.** These are general web, GitHub, and npm-registry searches only — not a formal trademark register search. **Before any public launch, also search USPTO, EUIPO/TMview, and WIPO Global Brand Database** (software classes 9 and 42) per `legal-and-licensing.md` §5, and confirm the domain and package-registry names are actually registrable.

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| — | Linear's Terms of Service — **not reviewed**; linear.app was unreachable through this sandbox's egress proxy in this pass | unknown | Do not build any scripted/automated interaction with a real Linear account (including API-based import) until Linear's ToS has actually been read. The safest importer path until then is the user's own manually-triggered data export, not live API polling. |

## Third-party material we *do* use

| Item | Source | License | Where used |
|---|---|---|---|
| None yet | — | — | This is a plan; no code, icons, or assets have been selected or incorporated yet. Building blocks proposed in the ADRs (Postgres, a job-queue library, etc.) are dependencies to evaluate at build time, per `architecture-inference.md` §6, not material copied into the project. |

## Human direction

| Date | Decision | Made or approved by |
|---|---|---|
| 2026-09-25 | Scope: build an open-source, self-hostable Linear alternative for small engineering teams, Brief mode (plan only) | User (bhaskar), via initial request |
| 2026-09-25 | "Make the calls yourself" — all charter assumptions, name, license, and design decisions made autonomously within this pass, pending user review | User (bhaskar) |

## Incidents

None. No implementation-level material of Linear was ever loaded into context during this research pass.
