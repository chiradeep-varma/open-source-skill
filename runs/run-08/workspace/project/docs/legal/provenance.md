# Provenance log

> Evidence that Vinca was created independently of Figma. Records what informed the work and what was deliberately never accessed.

## Statement

Vinca is an independent implementation of a real-time collaborative interface-design tool. It was built from publicly available information about Figma's features and behavior (help center, developer docs, engineering blog, status page, job postings) and from original design work. No source code, decompiled or de-minified code, internal documents, or copyrighted assets or text of Figma were used. Vinca is not affiliated with or endorsed by Figma, Inc. "Figma" is a trademark of Figma, Inc., used here only to identify the product we offer an alternative to.

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| 2026-09-25 | Public help center docs | dossier.md §6, S21–S35 | Feature inventory, core primitives (Frame/Component/Instance/Variant/Style/Variable/Auto Layout/Library/Branch), core-loop and workflow descriptions |
| 2026-09-25 | Public developer/API docs | dossier.md §6, S37–S41 | Domain model (File → Node tree, Projects/Teams, scoped tokens, webhooks), plugin/widget extension model |
| 2026-09-25 | Public engineering blog posts | dossier.md §7, S43–S49 | Understanding of the multiplayer sync approach (server-authoritative, fractional indexing, rejected OT/full CRDT) and performance work — used to inform our own, independently designed architecture (see ADRs), not copied |
| 2026-09-25 | Public pricing/help articles, third-party pricing trackers | dossier.md §4, S13 | Business-model gating pattern (SSO/audit-log tax), informing the license/pricing better-thesis |
| 2026-09-25 | Review platforms (G2, Capterra), Figma's own community forum, Hacker News threads | dossier.md §5, S17–S20 | Love/pain themes, switching blockers, parity-matrix tier decisions |
| 2026-09-25 | Penpot's public site, GitHub repo description, community forum, third-party review | dossier.md §3, S8–S10 | Competitive positioning and the better-thesis (performance + plugin ecosystem as our differentiators) |

## Deliberately not accessed

- Figma's client-side source code, JS bundles or source maps
- Decompiled or disassembled Figma binaries
- The community-reverse-engineered `.fig` binary format specification (OpenFig-org and similar projects exist publicly, but were not consulted beyond noting they exist — see dossier §6). Our own import path uses Figma's **official, documented REST API** instead of the undocumented binary format.
- Any leaked, internal or NDA Figma material
- Penpot's source code (MPL-2.0; not read or reused this session — Vinca is being designed independently, not as a Penpot fork)
- Bulk-scraped content or user data from any site

## Name check

| Date | Search (where / query) | Result |
|---|---|---|
| 2026-09-25 | Web: `"Vinca" app design tool software` | No design/software product named Vinca found; only an unrelated CAD app ("VinaCAD") and generic design-tool listicles |
| 2026-09-25 | Web: `"Vinca" github` | Only small, unrelated repos (a ROS conda-recipe generator, a VS Code theme, a caliper-reader tool) — no design-tool or collaboration-software collision |
| 2026-09-25 | npm: `"vinca" npmjs.com package` | No package literally named `vinca`; only an unrelated `tea-vinca` package |
| 2026-09-25 | Web: `"vinca" open source design collaborative` | No collision; returned unrelated results (Vinta Software, generic "open source design" community pages) |

**Not yet done, recommended before public launch:** USPTO/EUIPO/WIPO trademark register searches (Nice classes 9 and 42), a check of the exact npm/PyPI/crates.io/Docker Hub scope the project will actually publish under, and a domain/social-handle availability check. "Vinca" should be treated as a strong working name, not a fully cleared one.

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| 2026-09-25 | Figma ToS/AUP (via search snippet only — direct fetch was blocked this session) | Prohibits reverse engineering and prohibits scraping/bulk data mining or unauthorized programmatic access | Research used only public docs/blog/help-center pages; no Figma account was used, nothing was scraped or bulk-collected. A future importer will use Figma's own official REST API under the user's own credentials and consent, reading only that user's own files — not scraping. Recommend a direct verbatim re-read of the ToS/AUP before finalizing importer design or any public claims quoting these terms. |

## Third-party material we *do* use

| Item | Source | License | Where used |
|---|---|---|---|
| Yjs (proposed) | github.com/yjs/yjs | MIT | Real-time collaborative sync engine (proposed, ADR-0001) |
| Excalidraw (reference only, not code reuse) | github.com/excalidraw | MIT | Studied as a pattern reference for canvas/whiteboard architecture, not incorporated as a dependency in this plan |

## Human direction

| Date | Decision | Made or approved by |
|---|---|---|
| 2026-09-25 | Mode = Brief (research + plan, no code); output location = ./project; target = Figma | User, in the original request |
| 2026-09-25 | All charter fields (motive, audience, scope, license leaning, non-goals) | Assumed by the agent per "make the calls yourself"; recorded as assumptions in charter.md, open to revision |
| 2026-09-25 | Working name "Vinca," proposed license AGPL-3.0 | Assumed by the agent, pending user confirmation |

## Incidents

None. No implementation material of Figma or Penpot was accessed at any point.
