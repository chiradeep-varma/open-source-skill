# ADR-0002: Start with a TypeScript/WebGL canvas renderer, not a C++/WebAssembly engine

_Status: proposed · Date: 2026-09-25_

## Context

Figma's canvas renderer is a C++ engine compiled to WebAssembly, rendering through WebGL and (since 2023) WebGPU for compute-shader offload (dossier §7). This is the product of years of dedicated engineering and is Figma's own hardest, most differentiated technical asset. The parity matrix (M2–M3, "Performance" row) identifies large-file rendering performance as our best differentiation opportunity *relative to Penpot* (whose SVG-based rendering reportedly struggles on large/complex files — dossier §3), but that doesn't mean we should try to out-build Figma's own renderer on day one.

The charter targets a wedge (M1: the core multiplayer loop) achievable within a realistic open-source project timeline, not a multi-year rendering-engine effort.

## Decision

Build the initial canvas renderer in **TypeScript, using WebGL2** (via a thin abstraction, not a full 3D engine) for shape/text rendering, with a retained-mode scene graph and dirty-rectangle invalidation for performance. Treat WebAssembly as an **optimization path for specific hot paths** (e.g. hit-testing on very large node trees, geometry boolean operations) to be added later if real self-hosted usage shows it's needed — not a day-one requirement.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| C++/WebAssembly renderer from day one (Figma-style) | Best possible performance ceiling | Multi-year engineering investment; wrong-sized for a self-hosted project's contributor base (skill principle: "contributor-friendly," mainstream stack) | Too large a scope for the wedge; revisit only if TS/WebGL proves insufficient at real target scale |
| Plain SVG DOM rendering (Penpot's reported approach) | Simple, inspectable, good interop with export formats | Penpot's own users report exactly this as a weak point on large/complex files (dossier §3) — the thing we're trying to differentiate on | Directly conflicts with our stated differentiator |
| Canvas2D (no WebGL) | Simpler API, no shader code | Weaker performance ceiling for pan/zoom on large documents with many shapes | WebGL2 with a thin abstraction is not much more complex to start and leaves more headroom |

## Consequences

- What becomes easier: a mainstream TypeScript contributor can work on the renderer without C++/Wasm toolchain expertise; faster initial development.
- What becomes harder, and what we accept: we won't match Figma's absolute performance ceiling on very large files at first; we accept this because our target scale (charter: self-hosted teams, not Figma's full customer base) doesn't require it, and because beating *Penpot*, not Figma, is the near-term differentiation bar.
- Operational impact on self-hosters: none — this is a client-side, in-browser concern, no extra services to run.
- License and dependency implications: none beyond standard MIT/Apache-licensed TypeScript tooling.
- How we would reverse this: the renderer sits behind an internal drawing-API boundary so hot paths can be reimplemented in Rust/WASM later without a rewrite of the surrounding app.
