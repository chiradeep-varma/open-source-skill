# Parity matrix: Vinca vs. Figma

> Tier: `Core` (job fails without it) · `Switch` (people can't leave Figma without it) · `Diff` (our better-thesis) · `Later` · `Won't`.
> Status: all rows are `planned` — this is a Brief-mode plan, no code has been written yet.

_Last updated: 2026-09-25_

| Primitive / area | Capability | Figma's tier | Our tier | Effort | Milestone | Status | Evidence |
|---|---|---|---|---|---|---|---|
| Canvas | Real-time multiplayer canvas editing (cursors, live shape edits) | Free+ | **Core** | L | M1 | planned | dossier §2, §6 core loop |
| Canvas | Frames, shapes, text, basic styling | Free+ | **Core** | M | M1 | planned | dossier §6 |
| Canvas | Pan/zoom, selection, grouping | Free+ | **Core** | M | M1 | planned | dossier §6 |
| Components | Components, instances (linked, synced copies) | Free+ | **Core** | L | M1 | planned | dossier §6 |
| Components | Variants (grouped component states) | Free+ | Later | M | M3 | planned | dossier §6 |
| Styles/Tokens | Named styles (color/text/effect) | Free+ | **Core** | S | M1 | planned | dossier §6 |
| Styles/Tokens | Variables/Collections/Modes (design tokens) | Enterprise (API scope) | Later | M | M3 | planned | dossier §4, §6 — Figma gates this to Enterprise in the API; free in ours eventually |
| Layout | Auto Layout (responsive stacking) | Free+ | **Core** | M | M1 | planned | dossier §6 |
| Libraries | Publish/consume a shared component library within a team | Free+ | Switch | M | M2 | planned | dossier §6, §5 pain theme (design-system lock-in) |
| Prototyping | Hotspot → connection → trigger/action click-through flows | Free+ | **Core** | M | M1 | planned | dossier §6 |
| Dev handoff | Inspect panel, copy CSS/values, asset export (SVG/PNG/PDF) | Free+ (view), paid Dev seat | **Core** | M | M1 | planned | dossier §6, §4 |
| Collaboration | Threaded, pinned comments | Free+ | **Core** | S | M1 | planned | dossier §6 |
| History | Version history / checkpoints | Free+ | Switch | M | M2 | planned | dossier §6 |
| History | Branching (fork a file, merge back) | Org+ | Later | L | M3 | planned | dossier §6 |
| Permissions | Org/team roles + file/folder share (view/edit/restricted) | Free+ (tiered) | **Core** | M | M1 | planned | dossier §6 |
| Permissions | SSO (SAML/OIDC) | Organization+ (paywalled) | **Diff** — free, self-hosted | M | M2 | planned | dossier §4 — classic "SSO tax"; architecture-inference.md flags this as a cheap open-source win |
| Permissions | Audit log / admin analytics | Enterprise only | Later | M | M3 | planned | dossier §4 |
| Import | Import a user's own Figma files via Figma's official REST API (using their own token) | n/a | **Switch** | L | M2 | planned | dossier §5 pain theme "lock-in"; §6 "legally clean import path" — never touches the undocumented .fig binary |
| Export | Export to SVG/PNG/PDF, and a documented, open native file format | Undocumented .fig | **Diff** | M | M1–M2 | planned | dossier §6, §8 ("Data" row — beat Figma here) |
| Extensibility | Plugin API (sandboxed JS/TS scripts) | Free+, rate-limited | **Diff** — no seat-tiered throttling | L | M3 | planned | dossier §5 pain theme "API rate limits"; §6 |
| Extensibility | Widget API (persistent multiplayer canvas objects) | Free+ | Later | M | M3 | planned | dossier §6 |
| Performance | Fast load/pan/zoom on large, deeply nested documents | Ongoing Figma investment (dossier §7) | **Diff** | L | M2–M3 | planned | dossier §3 — this is Penpot's reported weak point; our opening |
| Offline | Any offline editing | Not supported by Figma either | Won't (v1) | — | — | planned | dossier §7 — Figma itself doesn't solve this; not a switch-blocker |
| Whiteboarding | FigJam-style boards | Separate product | Won't (v1) | — | — | planned | charter non-goal — different core loop, different wedge |
| AI features | Figma Make / Sites / Buzz (prompt-to-app) | Newer product line | Won't (v1) | — | — | planned | charter non-goal; huge scope on its own |
| Enterprise compliance | SCIM, guest-access controls, centralized billing, SOC2-style controls | Enterprise only | Later | M | M3+ | planned | dossier §4, §8 |

## Summary

- Core: 10 · Switch: 3 · Diff: 4 · Later: 6 · Won't: 3
- Current milestone: none started (Brief mode — plan only).
- Honest status line for a future README: "Vinca implements the core multiplayer design-canvas loop and Figma import; it does not yet match Figma's design-token system, branching, plugin ecosystem size, or enterprise compliance features."
