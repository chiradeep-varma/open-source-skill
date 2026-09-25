# Target dossier: Figma

> Research notes for building an independent open alternative ("Vinca," working name). Contains facts, observations and analysis only — no copied code, assets or substantial copied text.
> Claim tags: `confirmed` (primary source or direct observation) · `inferred` (reasoned from signals) · `assumption` (unverified) · `memory` (from prior knowledge; verify).

_Research window: 2026-09-25 · Mode: Brief_

## Summary (written last)

- **What it is:** a browser-based, real-time multiplayer vector design tool for interface design, prototyping and dev handoff, with an adjacent whiteboarding product (FigJam).
- **Why people pay:** live multiplayer editing that replaced single-player design software, plus the network effect of design systems and plugin ecosystems built up inside it over a decade.
- **Where the value lives:** mostly software and workflow (a genuinely hard real-time canvas engine), with a growing network-effect/lock-in component (design-system libraries, plugins, organizational muscle memory) and a modest data-format lock-in component (the .fig format is undocumented).
- **What an open version can capture:** the core software value (multiplayer canvas, components, prototyping, dev handoff) using mature open building blocks (Yjs for sync) is realistic. The network effect (a decade of design-system libraries already built in Figma) cannot be captured directly — only offset with a good importer.
- **Three hardest problems:** 1. Collaborative consistency at low latency without reinventing OT/CRDT from scratch. 2. Undo/redo and version history that stay correct under concurrent multi-user edits. 3. Rendering/interaction performance on large, deeply nested vector documents inside a browser.

---

## 1. Identity and history

Figma, Inc. was founded in 2012 by Dylan Field and Evan Wallace (Brown University); Field left via a Thiel Fellowship to build it full time `[confirmed, S4]`. Index Ventures led a 2013 seed round; Greylock led a $14M Series A in 2015 `[confirmed, S4]`. The product publicly launched in September 2016 after ~4 years in stealth `[confirmed, S4]`.

In September 2022 Adobe agreed to acquire Figma for ~$20B; the deal drew EU/UK antitrust scrutiny and was mutually abandoned in December 2023, with Adobe paying Figma a **$1B reverse termination fee** `[confirmed, S1, S3]`. Figma IPO'd on the NYSE (ticker FIG) on **July 31, 2025** at $33/share, raising ~$1.2B; shares more than tripled on debut, implying a valuation approaching $68B `[confirmed, S2, S3]`.

**So what for the build:** Figma is now a large, independent public company with IPO-scale resources — a reminder that feature-parity chasing is a losing game (Principle 6, "start with a wedge"). Its near-miss with Adobe and subsequent IPO also mean there is no code to build on (it was never open source and never will be); everything must be original.

## 2. Concept and vision

Figma's founding bet was **browser-based, multiplayer-first design**, replacing offline single-player tools (Sketch, Photoshop). Dylan Field's essay "Meet us in the browser" frames the original decision to move design into the browser as "heresy" at the time, motivated by the browser's collaboration, transparency and access properties `[confirmed, S5]`. At Config 2025, the stated current vision reframes design as "the process itself, not just a step in it" and leans heavily into AI-assisted product creation (Figma Make, Sites, Buzz, Draw) `[confirmed, S6]`.

**Core primitive:** the **multiplayer canvas** — every other primitive (frames, components, comments, prototypes) sits on top of a single shared, live-updating document.

**So what for the build:** the multiplayer canvas, not any individual feature, is Figma's actual concept. This confirms the wedge should be the live collaborative canvas itself, not a features checklist.

## 3. Market and industry

- **Adobe XD**: discontinued as a purchasable standalone product in June 2023, in maintenance mode since `[confirmed, S11]`.
- **InVision**: shut down its core product Dec 31, 2024 (Freehand sold to Miro in 2023) `[confirmed, S12]`.
- **Sketch**: still active as a Mac-native tool `[memory — not independently re-verified this session]`.
- **Canva**, **Framer**: adjacent competitors — Canva for non-designer/templated use, Framer for prototype-to-live-site workflows `[inferred, aggregated third-party comparisons]`.

**Open competitors — the critical one is Penpot** (penpot.app, by Kaleidos): MPL-2.0 licensed (file-level copyleft; embedding doesn't trigger copyleft) `[confirmed, S8]`. Backed by Kaleidos with EU Horizon/NLnet grant funding `[inferred, third-party]`. Stores files as standard **SVG**, not a proprietary binary — a real differentiator versus Figma. Reported gaps from its own community forum and reviews: plugin system only reached beta in 2024 (small ecosystem vs. Figma's decade-old one), fewer third-party integrations, and **slow rendering / placeholder images when zooming on large files** `[confirmed, S9, S10]`.

Other adjacent open-source tools: **Excalidraw** (MIT, hand-drawn whiteboard, not a full design tool) and **tldraw** (whiteboard SDK; its license has shifted away from fully permissive — production use now needs a paid key past localhost/dev) `[confirmed, technology-lens sources]`. No other mature open-source Figma-equivalent was found beyond Penpot.

**So what for the build:** Penpot already occupies "open-source Figma alternative." A new project only has a reason to exist if it's sharper somewhere Penpot is reportedly weak: **performance on large/complex documents**, or the **plugin/extension story**, or a **cleaner self-host operational story**. This is the single most important finding for the better-thesis (see Phase 4).

## 4. Business model

Figma's pricing (cross-confirmed via multiple trackers; the live pricing page itself could not be directly fetched this session — flagged `inferred`, recommend a direct re-check before publishing numbers publicly):
- **Starter (free)**: capped at 3 Figma design files + 3 FigJam boards.
- **Professional**: seat-based — Full seat ~$16/mo (annual), Dev seat ~$12/mo, Collab seat ~$3–5/mo.
- **Organization**: Full ~$55/mo, Dev ~$25/mo — adds SSO, Code Connect.
- **Enterprise**: Full ~$90/mo — adds SAML/advanced security, SCIM, guest-access controls, design-system analytics, centralized billing.

`[inferred, cross-source: S13 + trackers]`. The classic "SSO/compliance tax" pattern holds: SSO/SCIM/audit-style controls are Organization+/Enterprise-only. A 2025 seat-model restructuring (Full/Dev/Collab/View) drew forum complaints about a ~22% effective price rise and accidental paid-editor invoices `[confirmed, forum.figma.com via product/users research]`.

**So what for the build:** no-seat-tax, self-hosted pricing (the whole deployment is free once self-hosted) is a clean, legitimate differentiator, and SSO should be free in our version — it's cheap to build and a classic open-source win (see `architecture-inference.md`).

## 5. Users and jobs

**Love themes** (G2/Capterra, consistent): real-time multiplayer collaboration, intuitive UI, fast prototyping, Dev Mode/inspect tooling, the plugin ecosystem `[confirmed, S17, S18]`.

**Pain themes** (recurring across Figma's own forum, G2, Capterra, Hacker News):
1. **Performance degrades on large/complex files** (many components/variants/nested instances/effects) — the single most repeated complaint `[confirmed, S19]`.
2. **Pricing/seat complexity** — the 2025 Full/Dev/Collab/View restructuring, ~22% effective increase, per-client freelancer seat costs `[confirmed, S19, S13]`.
3. **No real offline mode** — desktop app doesn't work offline; help docs confirm only already-loaded pages stay editable, with no live collab, library search or version history offline `[confirmed, S15 tech-lens]`.
4. **Lock-in / no real export** — the .fig format is undocumented and proprietary; organizations with a decade of design-system libraries built in Figma can't easily leave `[inferred/community-sourced, HN + Penpot blog + Unsplash migration post]`.
5. **Plugin/API rate limits** — 429s, multi-day retry-after windows, tier-dependent plugin behavior `[confirmed, S19]`.

Hacker News threads (2022–2025) on "Figma alternatives" name Penpot most often as the open-source contender `[confirmed via HN item search, S20]`.

**So what for the build:** pain themes 1, 2 and 5 map directly onto Core/Diff tiers below. Pain theme 4 (lock-in) is the switch-blocker: an importer matters more than any single feature.

## 6. Product

**Core primitives** (from Figma's help center, in our own words): **Team/Organization → Project → File → Page → Frame** (nesting container with layout/constraints/auto-layout/prototyping) **→ shapes/Components**. A **Component** is a reusable master; an **Instance** is a linked, synced copy; **Variants** group related components (e.g. button states) into one switchable set. **Styles** are named visual presets; **Variables** are typed values in **Collections** with **Modes** (e.g. light/dark) that can alias each other (design tokens). **Auto Layout** gives a frame responsive stacking behavior. A **Library** is a file's published components/styles/variables shared to other files. **Branching** forks a file for parallel work, merged back later; **Version History** checkpoints changes. **Comments** are threaded, pinned canvas annotations `[confirmed, S21–S28]`.

**Core loop** (multiplayer editing): open a shared file → live WebSocket session renders every collaborator's cursor/edits in real time → shared state updates for all viewers instantly, no manual save/merge. Up to 500 collaborators per file, 200 editing simultaneously `[confirmed, S33]`.

**Other key workflows**: (b) publish a library of components/styles/variables, consumed as linked instances elsewhere with update notifications; (c) prototyping via hotspot → connection ("noodle") → trigger/action, producing a playable click-through; (d) Dev Mode — inspect panel + "copy as code" (CSS/iOS/Android) for handoff; (e) FigJam — stickies/shapes/connectors/stamps/voting for ideation (out of scope for our wedge; see charter) `[confirmed, S21–S32]`.

**Domain model**: REST API root is a **File** → recursive **Node** tree (every layer is a typed node) `[confirmed, S37]`. **Projects/Teams** contain files; **Components/Styles** separately enumerable; **Variables/Collections** are Enterprise-scoped in the API; **Comments** and **Webhooks** (FILE_UPDATE, FILE_COMMENT, LIBRARY_PUBLISH, etc.) are distinct entities `[confirmed, S38, S39]`. Access tokens use granular scopes, never exceeding the user's own file/team permission `[confirmed, S38]`. Permissions layer org-level (Admin/Member/Viewer) and file/folder-level (can edit/can view/view-restricted) `[confirmed, S34, S35]`.

**The .fig file format itself is undocumented by Figma.** Community reverse-engineering (OpenFig-org, not a Figma disclosure) describes it as a ZIP containing a binary `canvas.fig` in a Kiwi (protobuf-like) schema `[confirmed that no official spec exists; format details are third-party/community-sourced, not independently verified by us, and deliberately not consulted further — see provenance log]`.

**Extension points**: **Plugin API** (JS/TS, sandboxed to the open file; cannot reach un-imported team/org library assets per Figma's own forum) `[confirmed, S40]`; **Widget API** (JSX/TS, renders shared multiplayer canvas objects, own sandboxed state) `[confirmed, S41]`; REST API + webhooks (above); **Community** marketplace for files/templates/plugins/widgets/apps `[confirmed, S42]`.

**So what for the build:** the domain model (File → Node tree, Projects/Teams, Components/Styles/Variables, Comments, Webhooks, scoped tokens) is a solid, provably-working shape to adopt conceptually — it's functional/interoperable, not expressive content, so it's free to reimplement (see `legal-and-licensing.md` §1). We should **not** attempt to reverse-engineer the .fig binary format; instead, build an importer against Figma's own **documented, official REST API** (using a user's own access token, reading their own files) — this is the legally clean import path.

## 7. Technology

**Inferred architecture** (from Figma's own engineering blog only — no client code/bundles/decompiled material was read by any research agent this session):

```
Client (browser)
 ├─ UI chrome: TypeScript/React
 ├─ Canvas engine: C++ compiled to WebAssembly, rendering via WebGL/WebGPU  [confirmed]
 └─ Multiplayer client: connects via WebSocket to a real-time server

Server side (from job postings + status page, confirmed as separately-monitored services)
 ├─ Real-time collaboration server
 ├─ REST API (service-oriented; Ruby/Sinatra, Go, and Rust mentioned in a C++ job posting) [confirmed via job listing]
 ├─ File storage/versioning
 └─ Dev Mode, Plugins/Widgets, Search — separate status-page components [confirmed]
```

**Multiplayer sync**: Figma's own 2019 post explicitly says they evaluated and **rejected both classic OT and full CRDTs** — OT as "overkill," CRDTs as carrying decentralization complexity they don't need since a single authoritative server orders every edit. Their model: document = tree of objects, server validates and orders edits, **last-write-wins per property**, server rejects invalid states (e.g. reparenting cycles), sibling order via **fractional indexing** `[confirmed, S43, S44]`.

**Large-file performance**: a multi-year sequence of posts — Rust-based memory optimization (~20% faster deserialization, ~25% memory reduction), incremental/dynamic per-page loading (cut slowest 5% of load times ~33%), parallel decoding across CPU cores (one large doc: 29s → <8s) `[confirmed, S45–S48]`.

**Undo**: a stated design rule — undo N times then redo N times must return to the exact prior state even amid concurrent edits from others `[confirmed as a stated goal, S49]`.

**Three hardest problems** (see Summary): collaborative consistency at low latency; undo/redo correctness under concurrency; rendering/interaction performance on large documents in-browser. A fourth, deliberately unsolved by Figma itself: true offline collaboration (explicitly not supported) `[confirmed, S15]`.

**Scale vs. our target**: Figma runs 500-collaborator files, hyperscale infra, a decade of performance engineering (dedicated Rust/C++/Wasm teams). Our charter's target scale (tens of concurrent users per file, small self-hosted deployments) is orders of magnitude smaller — this is exactly where our architecture should simplify (see Phase 6).

**So what for the build:** don't attempt to replicate Figma's custom C++/Wasm/WebGPU renderer or bespoke server-authoritative sync protocol on day one — that is years of Figma's own engineering investment. Use a mature, off-the-shelf CRDT library (**Yjs**, MIT, active, built-in undo/redo and presence/awareness) for sync instead of reinventing Figma's protocol, and start with a simpler TypeScript/Canvas2D or WebGL renderer, optimizing hot paths with WebAssembly later only if real self-host scale demands it (see ADR-0001, ADR-0002).

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | High | **Match**, using Yjs + a from-scratch renderer for the core loop; realistic at our target scale | The core loop (multiplayer canvas) is well-understood conceptually and has mature open building blocks |
| Network effects (decade of org libraries, plugin ecosystem) | High | **Not reach directly; substitute via import** | Can't retroactively create ten years of other companies' design systems; an importer via Figma's REST API offsets some of this per-organization |
| Data | Low–Medium | **Beat** | Figma's .fig format is undocumented; an open, documented format is a genuine advantage |
| Content (templates, Community marketplace) | Medium | **Not reach initially; grow over time** | A marketplace is a cold-start problem; defer past the wedge |
| Operations and humans (uptime, support, hyperscale infra) | High for Figma's own SaaS | **Substitute**: self-hosting removes the need for Figma's ops, at self-hoster's own operational cost | Different value proposition (control) rather than matching Figma's uptime SLAs |
| Hardware | n/a | n/a | Not applicable |
| Brand and trust | High | **Not reach; not the goal** | A new open project has no brand yet; positioning is "own your data," not "as trusted as Figma" |
| Licenses and certifications (SOC2 etc.) | Medium (Enterprise tier) | **Substitute**: self-hosters own their own compliance posture | Certifications are per-deployment for self-hosted software, not centrally held |

## Legal surface

- **Trademarks**: "FIGMA" is a registered US trademark (Reg. #5110233, filed 2014, registered 2016) `[confirmed, S16]`. Never use "Figma" or a sound-alike in the project's name (see `legal-and-licensing.md` §5); our working name **Vinca** avoids this.
- **Terms of service**: Figma's ToS/AUP prohibit reverse engineering and prohibit scraping/bulk data mining or unauthorized programmatic access `[confirmed via search snippet; a direct verbatim re-read of figma.com/legal/tos and /legal/aup is recommended before any public claim quoting it]`. This project's research used only public docs/blog/help-center pages and did not use any Figma account or scrape any content.
- **Patents**: no specific Figma patent search was run (per `legal-and-licensing.md` §6, patent searches are avoided by default without counsel). No obviously patent-heavy sub-domain identified (this is vector graphics/UI, not codecs or wireless standards), so this is a low-priority flag, not a blocker.
- **Regulated activities**: none identified — this is a design tool, not a regulated domain.

## Contradictions and open questions

- Figma's exact current pricing page could not be directly fetched this session (proxy blocked direct WebFetch to figma.com); tier/price figures are cross-confirmed from third-party trackers and should be re-verified against figma.com/pricing directly before quoting numbers publicly.
- Sketch's current status (active/maintained) was not independently re-verified this session — flagged `memory`.
- The exact backend datastore technology (Postgres/other) was not found in any public source this session — left unconfirmed rather than guessed.

## Sources

| # | Title | URL | Accessed |
|---|---|---|---|
| S1 | Figma Blog — "Figma and Adobe are abandoning our proposed merger" | figma.com/blog/figma-adobe-abandon-proposed-merger/ | 2026-09-25 |
| S2 | Figma Blog — "Figma Announces Pricing of Initial Public Offering" | figma.com/blog/ipo-pricing/ | 2026-09-25 |
| S3 | CNBC — "Adobe and Figma call off $20 billion acquisition" | cnbc.com/2023/12/18/adobe-and-figma-call-off-20-billion-merger.html | 2026-09-25 |
| S4 | Index Ventures — "Figma Goes Public: Thirteen Unforgettable Years with Dylan Field" | indexventures.com/perspectives/figma-goes-public-thirteen-unforgettable-years-with-dylan-field/ | 2026-09-25 |
| S5 | Figma Blog — "Meet us in the browser" | figma.com/blog/meet-us-in-the-browser/ | 2026-09-25 |
| S6 | Figma Blog — "Config 2025 Launches Deepen Figma's Design Capabilities" | figma.com/blog/config-2025-press-release/ | 2026-09-25 |
| S8 | GitHub — penpot/penpot (license/description) | github.com/penpot/penpot | 2026-09-25 |
| S9 | Penpot Community — "Evaluation: Figma vs Penpot" | community.penpot.app/t/evaluation-figma-vs-penpot/10508 | 2026-09-25 |
| S10 | XDA Developers — "I stopped using Figma and switched to Penpot" | xda-developers.com/switched-from-figma-to-penpot/ | 2026-09-25 |
| S11 | InvGate / Mapsoft — Adobe XD end-of-life | invgate.com/itdb/adobe-xd, mapsoft.com/adobe-xd-end-of-life/ | 2026-09-25 |
| S12 | Fast Company — "InVision, former UX trailblazer, is shutting down" | fastcompany.com/91006037/invision-former-ux-trailblazer-ending-services-figma-adobe | 2026-09-25 |
| S13 | Figma Help Center — pricing/seats/billing update article | help.figma.com/hc/en-us/articles/27468498501527 | 2026-09-25 |
| S15 | Figma Help Center — "What can I do offline in Figma?" | help.figma.com/hc/en-us/articles/360040328553 | 2026-09-25 |
| S16 | USPTO Report — FIGMA trademark registration | uspto.report/TM/86354922 | 2026-09-25 |
| S17 | G2 — Figma reviews | g2.com/products/figma/reviews | 2026-09-25 |
| S18 | Capterra — Figma reviews | capterra.com/p/175027/Figma/reviews | 2026-09-25 |
| S19 | Figma Community Forum — multiple threads (performance, pricing, API rate limits) | forum.figma.com | 2026-09-25 |
| S20 | Hacker News — "Figma alternatives" threads | news.ycombinator.com/item?id=32854425, 32879443, 41860927, 37329718 | 2026-09-25 |
| S21–S32 | Figma Help Center — guides to auto layout, variables, teams, files/folders, branching, version history, libraries (2), prototyping, connect-prototype, Dev Mode, inspecting, FigJam, stickies | help.figma.com/hc/en-us/articles/… (see agent transcript for exact IDs) | 2026-09-25 |
| S33 | Figma Help Center — "How many people can be in a file at once?" | help.figma.com/hc/en-us/articles/1500006775761 | 2026-09-25 |
| S34–S35 | Figma Help Center — file/folder and team permissions | help.figma.com/hc/en-us/articles/35361119554711, 360039970673 | 2026-09-25 |
| S37 | Figma Developers — REST API overview | developers.figma.com/docs/rest-api | 2026-09-25 |
| S38 | Figma Developers — API token scopes | developers.figma.com/docs/rest-api/scopes | 2026-09-25 |
| S39 | Figma Developers — Webhooks | developers.figma.com/docs/rest-api/webhooks | 2026-09-25 |
| S40 | Figma Forum — Plugin API scope feedback | forum.figma.com | 2026-09-25 |
| S41 | Figma Developers — Widget API | developers.figma.com/docs/widgets | 2026-09-25 |
| S42 | Figma Help Center — "Guide to the Figma Community" | help.figma.com/hc/en-us/articles/360038510693 | 2026-09-25 |
| S43 | Figma Blog — "How Figma's multiplayer technology works" | figma.com/blog/how-figmas-multiplayer-technology-works/ | 2026-09-25 |
| S44 | Figma Blog — "Realtime editing of ordered sequences" | figma.com/blog/realtime-editing-of-ordered-sequences/ | 2026-09-25 |
| S45 | Figma Blog — "Supporting Faster File Load Times with Memory Optimizations in Rust" | figma.com/blog/supporting-faster-file-load-times-with-memory-optimizations-in-rust/ | 2026-09-25 |
| S46 | Figma Blog — "Speeding Up File Load Times, One Page at a Time" | figma.com/blog/speeding-up-file-load-times-one-page-at-a-time/ | 2026-09-25 |
| S47 | Figma Blog — "Improving Performance with Incremental Frame Loading" | figma.com/blog/incremental-frame-loading/ | 2026-09-25 |
| S48 | Figma Blog — "File loading, dragging & zooming is up to 3x faster" | figma.com/blog/figma-faster/ | 2026-09-25 |
| S49 | Figma Blog — multiplayer editing / undo design goal | figma.com/blog/multiplayer-editing-in-figma/ (title/summary level) | 2026-09-25 |
| — | Figma job posting — Software Engineer, C++ (stack signals) | job-boards.greenhouse.io/figma/jobs/5552530004 | 2026-09-25 |
| — | status.figma.com — service components | status.figma.com | 2026-09-25 |
| — | GitHub — yjs/yjs (CRDT building block) | github.com/yjs/yjs, yjs.dev | 2026-09-25 |
| — | GitHub — tldraw/tldraw (license note) | github.com/tldraw/tldraw | 2026-09-25 |
| — | GitHub — excalidraw (MIT, active) | github.com/excalidraw | 2026-09-25 |
| — | Forum — "Inquiry about the .fig file format" (no official spec exists) | forum.figma.com/t/inquiry-about-the-fig-file-format/6351 | 2026-09-25 |

**Note on sourcing environment:** direct WebFetch was blocked by the sandbox proxy for figma.com and several other domains this session; all findings above were gathered via WebSearch, whose results are drawn from and cite real indexed pages, but were not independently re-verified via a direct full-page fetch. Numbers and quotes flagged `inferred` above should be re-checked with a direct page fetch before public use (e.g., in marketing copy or a comparison page).
