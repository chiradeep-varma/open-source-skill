# ADR-0001: Use Yjs (CRDT) for real-time multiplayer sync, not a custom protocol

_Status: proposed · Date: 2026-09-25_

## Context

The core loop (dossier §6, parity matrix M1) requires real-time multiplayer canvas editing: multiple users see each other's cursors and edits merge cleanly and near-instantly. Figma's own engineering blog (dossier §7) explains they evaluated and rejected both classic Operational Transformation ("overkill... incredibly difficult for a design tool") and full CRDTs (too much decentralization complexity for their single-server setup), landing on a **bespoke** server-authoritative model: a document tree, one authoritative server ordering and validating every edit, last-write-wins per property, and fractional indexing for sibling order.

That bespoke protocol represents years of Figma-specific engineering investment (dedicated teams, multiple follow-up posts on edge cases like undo correctness). Vinca's charter targets self-hosted, small-to-mid-scale deployments (tens of concurrent editors per file, not 500), built and maintained by a much smaller team or a self-hoster's one evening (skill principle: "operability first," "build it for strangers to run and fork").

## Decision

Use **Yjs** (MIT license, actively maintained, ~920K weekly downloads) as the sync engine for the canvas document, rather than designing a bespoke server-authoritative protocol from scratch. Yjs provides CRDT-based conflict-free merging, built-in undo/redo, and a presence/awareness protocol (for live cursors) out of the box.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Bespoke server-authoritative protocol (Figma-style) | Matches Figma's own proven approach; single source of truth simplifies some invariants | Years of edge-case engineering (undo-under-concurrency, cycle rejection, fractional-index rebalancing) that Figma itself needed multiple follow-up posts to get right; far too large a scope for a wedge milestone | Rebuilding a decade of bespoke protocol work is not a reasonable M1 scope |
| Automerge (Rust core, MIT) | Also mature, branching/merge history is first-class | Less mature JS ecosystem tooling for presence/awareness and editor bindings (e.g. Tiptap-style integrations) compared to Yjs at time of writing | Yjs's ecosystem and awareness protocol fit a canvas + comments + presence use case more directly |
| Operational Transformation library | Well-understood in text editors (e.g. ShareDB) | Figma's own team explicitly found OT "incredibly difficult for a design tool" — a canvas has 2D geometric structure, not a linear character stream | Same reasoning Figma itself gave; not worth re-deriving |

## Consequences

- What becomes easier: undo/redo, presence/cursors, and conflict merging come largely "for free" from Yjs rather than being built and debugged from scratch; a self-hoster runs one sync-capable server process rather than a bespoke ordering service.
- What becomes harder, and what we accept: Yjs's generic CRDT model needs a canvas-specific document schema (shapes, frames, components as Yjs types) designed by us — this is original design work, not reused from Figma or anyone else. Very large documents may need Yjs-specific performance tuning (e.g. subdocuments per page) as the project matures.
- Operational impact on self-hosters: one WebSocket-capable server process (e.g. via Hocuspocus, MIT, a Yjs server) plus Postgres for persistence; no separate message broker needed at target scale.
- License and dependency implications: MIT is permissive and compatible with any license we choose for Vinca itself (see ADR-0003).
- How we would reverse this: the sync layer is designed behind an internal interface so it could be swapped for Automerge or a custom protocol later without touching the rest of the app, if scale ever demands it.
