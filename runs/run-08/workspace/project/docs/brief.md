# Brief: an open alternative to Figma

**The product.** Figma is a browser-based, real-time multiplayer vector design tool for interface design, prototyping and developer handoff, used by product teams from solo freelancers to large enterprises.

**Why people use it.** Live multiplayer editing that replaced offline, single-player design software — plus, after a decade, the network effect of design-system libraries and plugin workflows teams have built up inside it. Users consistently praise its real-time collaboration, prototyping speed and Dev Mode handoff tooling (G2/Capterra review themes).

**Where its value lives.** Mostly software and workflow — the multiplayer canvas engine is a genuinely hard, well-engineered piece of technology. A growing share is network effect and mild data lock-in (an undocumented file format, years of libraries built inside it), not brand or content.

**The field.** Adobe XD is discontinued; InVision shut down at the end of 2024 — the proprietary field has consolidated hard around Figma, with Canva and Framer as adjacent rather than direct rivals. On the open side, **Penpot** (MPL-2.0) is already a mature, funded, real open-source Figma alternative, storing files as plain SVG. Its own community reports two consistent weak points: performance on large/complex documents, and a plugin ecosystem that only reached beta in 2024. That gap — not "Figma doesn't have an open alternative," which is false — is what a new project has to be sharper about to earn a reason to exist.

**What we'll build.** *For teams who want to own their design data and self-host their design tool without a per-seat "SSO tax," Vinca is a self-hosted, real-time multiplayer design tool that performs well on large documents and imports your existing Figma files — unlike Penpot, whose large-file performance and plugin ecosystem are still catching up.*
- Core loop: real-time multiplayer canvas editing — frames, shapes, components/instances, styles, Auto Layout, basic prototyping, comments, permissions (M1).
- Switch-blockers: import your own Figma files via Figma's official REST API (never the undocumented `.fig` format), shared component libraries, version history, free SSO (M2).
- Differentiators: large-file rendering performance (WebGL2, dirty-rect invalidation, WASM hot paths later if needed), a plugin API without Figma's tiered rate limits, no seat-based pricing tax anywhere (M2–M3).

**What we won't build (for now).** FigJam-style whiteboarding and AI app-generation features (Figma Make/Sites) — different core loops, each deserving its own wedge analysis, not bolted onto this one. Enterprise admin depth (SCIM, audit logs) and native mobile apps — deferred to "Later," not needed to prove the core loop works. Reverse-engineering the `.fig` binary format — deliberately never attempted, for both legal and provenance reasons (see `docs/legal/provenance.md`).

**Hard parts and how we'll handle them.**
1. Real-time collaborative consistency without reinventing Figma's bespoke protocol → Yjs (MIT CRDT library), not a custom server-authoritative sync engine (ADR-0001).
2. Rendering performance on large vector documents in-browser → start with TypeScript/WebGL2 and a retained-mode scene graph; treat WASM as a later optimization for specific hot paths, not a day-one requirement (ADR-0002).
3. Importing from Figma without touching its undocumented file format → use Figma's own official, documented REST API under the user's own credentials, never the reverse-engineered `.fig` binary schema (ADR-0003).

**Name and license (proposed).** **Vinca** (working name; web/GitHub/npm search found no collision in the design-tool or software category — see `docs/legal/provenance.md` for the searches run; USPTO/EUIPO trademark register checks still recommended before public launch) · **AGPL-3.0** for the app, because the better-thesis depends on hosted forks staying open, matching the pattern of comparable open SaaS alternatives (Plausible, Immich, Twenty) rather than Penpot's more permissive MPL-2.0 (ADR-0004).

**Milestones.** M0 skeleton (self-host boots) → M1 core loop (multiplayer canvas, components, prototyping, comments) → M2 switch-blockers (Figma import, libraries, version history, free SSO, large-file performance) → M3 differentiators (plugin API, design tokens, variants, branching).

**Risks and open questions.**
- Figma's exact current pricing figures were cross-confirmed from third-party trackers, not a direct fetch of figma.com/pricing this session (proxy blocked it) — re-verify before quoting numbers publicly.
- The better-thesis assumes Penpot's reported performance/plugin weaknesses still hold; worth a hands-on re-check against Penpot's *current* release before committing engineering time, since open-source projects move fast.
- AGPL-3.0 is a near-permanent choice once outside contributions arrive (no CLA planned) — confirm commercial intent before locking it in.
- The charter's motive, audience, and technical-comfort fields are all currently assumptions (see `docs/charter.md`), not confirmed answers — revisit before moving into Prototype/Project mode.

**Decision needed:** confirm (or correct) the charter's assumptions — especially motive/audience and commercial intent, which drive the license choice — and confirm the wedge (real-time multiplayer canvas, deferring FigJam and AI features) before any code gets written.
