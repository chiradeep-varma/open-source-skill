# Roadmap: Vinca (working name)

> Milestones follow the parity matrix (`docs/product/parity-matrix.md`). No code has been written yet — this is the Brief-mode plan. Effort is qualitative (S/M/L), not time-boxed, since team size/pace is unknown.

## M0 — Skeleton

- Docker Compose stack boots (app + Postgres + object storage) per ADR-0005.
- Auth: email/password + session, one team, one project, empty file.
- CI: lint, typecheck, a placeholder test suite.
- Nothing collaborative yet — this milestone just proves the self-hosting story works.

## M1 — Core loop (the wedge)

The actual product bet: a real-time multiplayer vector canvas.

- Yjs-backed document sync (ADR-0001): open a file, see live cursors, edits merge instantly for 2+ simultaneous editors.
- Canvas primitives: frames, shapes (rect/ellipse/line/text), grouping, selection, pan/zoom (ADR-0002, WebGL2 renderer).
- Components and instances (linked, synced copies).
- Named styles (color/text/effect), Auto Layout (responsive frame stacking).
- Basic prototyping: hotspot → connection → click-through preview.
- Dev-handoff basics: inspect panel, copy CSS values, export selection as SVG/PNG/PDF.
- Threaded comments pinned to canvas objects.
- Org/team roles + file/folder permissions (view / edit / restricted).

**Demo at this milestone:** two browser tabs, same file, live multiplayer editing, a component reused as a synced instance, a two-screen click-through prototype, a comment thread, permission-gated sharing. This is the point at which the product does its actual job.

## M2 — Switch-blockers

What stops someone from leaving Figma for this.

- **Figma importer** via the official REST API, user's own token (ADR-0003) — reconstructs files/frames/components/styles into Vinca's native format; documents known fidelity gaps (e.g. Enterprise-scoped Variables) honestly.
- Publish/consume a shared component library across files within a team.
- Version history / checkpoints.
- **SSO (OIDC/SAML), free in every tier** — the "SSO tax" differentiator (ADR-0004's better-thesis), built once, not paywalled.
- Vinca's own documented, open native file format finalized and versioned.
- Large-file performance pass: this is where the "beat Penpot on performance" differentiator gets tested against real documents, not just small demo files.

**Demo at this milestone:** import a real (user-owned) Figma file end to end; a team's shared library used across three files; SSO login working against a real identity provider; a genuinely large/complex document (hundreds of nested components) still pans and zooms smoothly.

## M3 — Differentiators and depth

- Plugin API (sandboxed, without Figma's tiered rate-limit pain — dossier §5).
- Variables/Collections/Modes (design tokens) — made free across all tiers, unlike Figma's Enterprise-only gating.
- Variants (grouped component states).
- Branching (fork a file, merge back).
- Widget API (persistent multiplayer canvas objects).

## Later (post-M3, not yet scoped in detail)

- FigJam-style whiteboarding as a genuinely separate product surface (different core loop — would deserve its own wedge analysis, not bolted onto this one).
- Enterprise-style admin: SCIM, audit logs, guest-access controls, centralized billing.
- AI-assisted generation features (Figma Make/Sites-equivalent) — explicitly out of scope until the core product is solid; huge scope on its own.
- Native mobile viewer apps.
- A Community-style template/plugin marketplace (cold-start problem; needs real usage first).

## Won't (out of scope, with reasons)

- Reverse-engineering the `.fig` binary format — legally avoided by design (ADR-0003).
- True offline collaborative editing — Figma itself doesn't solve this either (dossier §7); not a competitive requirement.
- Matching Figma's absolute rendering performance ceiling via a custom C++/WASM engine — wrong-sized investment for the target scale (ADR-0002); revisit only if real usage proves TS/WebGL insufficient.
