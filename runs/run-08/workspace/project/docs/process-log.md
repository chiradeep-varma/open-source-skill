# Process log

> What was actually done in each phase: fetches, checks, tests. Kept so the plan's work is auditable.

## Phase 1: Identify

- Searched prior knowledge for namesake collisions on "Figma": none found. Figma is a single, unambiguous product (figma.com, Figma Inc.), no other prominent active product shares the name. Treated as a **one clear match** per the disambiguation protocol — no user question needed.
- Fingerprint recorded in `docs/charter.md`.

## Phase 2: Charter

- User invoked in "brief mode... make the calls yourself" — no interactive checkpoint used. All charter fields recorded as explicit assumptions in `docs/charter.md`, open to revision.

## Phase 3: Research

- Dispatched three parallel research agents (background), each using live web search/fetch against primary sources:
  1. Identity/history, business model (pricing), market & competitors (proprietary + open, especially Penpot), legal surface.
  2. Concept/vision, product feature inventory, core loop, domain model, extension points, review mining (users/jobs).
  3. Technology/architecture (Figma's own engineering disclosures only — no client code, bundles, or decompiled material accessed), hard problems, file format, relevant open building blocks.
- Findings to be compiled into `docs/research/dossier.md` with source URLs and access dates once agents report back.

- Three agents completed (2026-09-25), each using WebSearch (WebFetch was blocked by the sandbox proxy for figma.com and several other domains this session — all findings are sourced via WebSearch's indexed results, which reflect real fetched pages with URLs, rather than direct full-page WebFetch reads; flagged throughout the dossier where this matters). Combined: ~35 sources across Figma's own blog/docs/help-center/developer docs, review platforms (G2, Capterra), Hacker News, Figma's community forum, Penpot's site/forum, third-party pricing trackers, and USPTO. Compiled into `docs/research/dossier.md`.
- Sufficiency test met: can explain why people pay for Figma (multiplayer canvas + accumulated network effect), sketch its core loop and domain model (File → Node tree; dossier §6), name its three hardest technical problems (collaborative consistency, undo-under-concurrency, large-file rendering performance; dossier §7), and the research surfaced a fork in the road that changes the plan (Penpot already exists as a mature open alternative — this became the central input to the better-thesis).

## Phase 4: Synthesize

- Wrote `docs/product/parity-matrix.md` (27 rows) and `docs/brief.md`, grounding the better-thesis directly in the Penpot gap found in research (performance on large files, plugin ecosystem maturity) rather than a generic "open Figma" pitch.

## Phase 5: Guardrails

- Name check performed for "Vinca" (four real searches: general web, GitHub, npm, "open source design collaborative") — no collision found in the design-tool/software category. Logged in `docs/legal/provenance.md` with each query and result.
- License recommendation (AGPL-3.0) reasoned through in `docs/adr/0004-license.md`, referencing the skill's licensing guide and Penpot's contrasting MPL-2.0 choice.
- `docs/legal/provenance.md` completed: sources that informed the work, what was deliberately never accessed (Figma's client code, the reverse-engineered `.fig` binary spec, Penpot's source code), and the ToS review note (Figma's ToS prohibits reverse engineering/scraping; only public docs were used, no account, no scraping).

## Phase 6: Design

- Five ADRs written (`docs/adr/0001`–`0005`): real-time sync engine (Yjs over a bespoke protocol), canvas rendering (TS/WebGL2 over C++/WASM at v1), file format & import strategy (official REST API, never the `.fig` binary), license (AGPL-3.0), and self-host deployment architecture (single Docker Compose stack).
- `ROADMAP.md` written: M0 skeleton → M1 core loop → M2 switch-blockers → M3 differentiators → Later/Won't, tied to the parity matrix.

## Phases 7–8: not started

Brief mode — research and plan only, no code this session, per the user's explicit request.
