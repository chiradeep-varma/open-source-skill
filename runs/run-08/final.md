The research-and-plan is complete, all in `./project`. Here's the shape of it:

**The core call: where to start.** Figma isn't a greenfield opportunity — Penpot (MPL-2.0) is already a mature, funded open-source Figma alternative. So the plan isn't "build an open Figma," it's sharper: match Penpot on the basics but beat it where its own users report it struggling — **large-file rendering performance** and a **thin plugin ecosystem** — while adding a real Figma importer and free SSO (no seat-tax).

**The wedge (M1):** the real-time multiplayer canvas itself — frames, shapes, components/instances, styles, Auto Layout, basic prototyping, comments — built on **Yjs** (mature MIT CRDT library) instead of reinventing Figma's own bespoke sync protocol, with a TypeScript/WebGL2 renderer rather than attempting to match Figma's years-deep C++/WASM engine on day one.

**What's in `./project`:**
- `docs/charter.md` — assumptions made on your behalf (motive, audience, license leaning), flagged for your correction
- `docs/research/dossier.md` — the 8-lens dossier, ~35 sourced claims, tagged confirmed/inferred/memory
- `docs/brief.md` — the one-page plan
- `docs/product/parity-matrix.md` — 27 features tiered Core/Switch/Diff/Later/Won't
- `docs/legal/provenance.md` — name-check results for "Vinca" (no collisions found) and what was deliberately never accessed (Figma's client code, the reverse-engineered `.fig` format)
- `docs/adr/0001`–`0005` — sync engine, rendering, import strategy, license (AGPL-3.0), deployment
- `ROADMAP.md` — M0 → M1 → M2 → M3
- `docs/process-log.md` — what was actually fetched/checked, for audit

Two caveats worth your attention: figma.com/pricing couldn't be fetched directly this session (numbers are cross-confirmed from third-party trackers, not primary-source), and the whole better-thesis leans on Penpot's *current* weaknesses — worth a hands-on spot-check before committing real engineering time. Biggest open decision: confirm motive/audience/commercial intent in the charter, since that's what the AGPL-3.0 recommendation hinges on.
