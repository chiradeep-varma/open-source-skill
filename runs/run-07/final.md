The plan is done, all in `./project`. Here's the shape of it:

**The pick:** Linear (linear.app) — clear, no identity ambiguity.

**The wedge:** small engineering teams get Linear's fast, opinionated workflow (Triage → Cycles → Projects) without the things reviews and pricing data say actually push people to leave — SSO and guest access paywalled at $16/seat+, no custom fields, no self-hosting. Those become free, default differentiators rather than upsells.

**The field:** Plane (AGPL-3.0) is the closest open rival but heavier; Huly goes wide into an all-in-one suite; a small project called "It's a Plan" already validates the niche. None is built specifically to be the easiest single-VPS, one-command self-host for a small team — that's the gap.

**Key calls made for you:**
- Name: **Fenline** (4 other candidates rejected for collisions — see `docs/legal/provenance.md`)
- License: **AGPL-3.0** + DCO (matches category norm, protects a future hosted offering without ruling it out)
- Architecture: monolith, TypeScript + Postgres, server-authoritative sync (not a from-scratch local-first CRDT engine — that's a later bet, not the wedge)
- Explicit **Won't**: cloning Linear's 2026 AI-agent product (Linear Agent/Diffs/Code Intelligence) — fast-moving, deeply proprietary, bad first target
- Roadmap: M0 skeleton → M1 core loop → M2 switch-blockers (import, GitHub integration, free SSO/guest access) → M3 differentiators (custom fields, native docs, automation, audit log)

**One honest caveat:** the sandbox's egress proxy blocked linear.app, github.com, and g2.com directly, so most Linear-specific claims (pricing, changelog, sync-engine details) rest on search-engine snippets rather than pages I fetched myself. I've tagged all of those `inferred` rather than `confirmed` throughout, flagged it in `docs/research/dossier.md`'s access note and `docs/process-log.md`, and recommended a 5-minute re-check against linear.app directly before treating the pricing/feature numbers as final.

Full doc set: `README.md`, `ROADMAP.md`, `docs/charter.md`, `docs/brief.md` (the one-pager), `docs/research/dossier.md`, `docs/product/parity-matrix.md` (32 tiered rows), `docs/legal/provenance.md`, `docs/adr/0001–0004`, `docs/process-log.md`.

Next step when you're ready: move into Prototype mode to get the core loop running, or go deeper on a business model (Venture mode) first.
