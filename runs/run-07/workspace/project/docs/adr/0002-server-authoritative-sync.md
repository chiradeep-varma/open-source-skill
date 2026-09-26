# ADR-0002: Server-authoritative sync for v1, not a local-first CRDT engine

_Status: proposed · Date: 2026-09-25_

## Context

Linear's most-cited technical differentiator is its local-first sync engine: optimistic client-side writes against an IndexedDB cache, sub-50ms perceived navigation, offline capability (dossier §7). Its actual implementation is not observable to us (see architecture-inference.md §1 — never read implementation) and, per the dossier, appears to use centralized operation-ordering rather than full peer-to-peer CRDTs, with CRDTs reportedly used narrowly for rich-text fields only. Building an equivalent sync engine from scratch is one of the three hardest problems identified in the dossier (§7) and a multi-month investment even for a well-resourced team.

## Decision

Ship v1 with a **server-authoritative** model: the backend is the single source of truth, the client uses optimistic UI updates (apply the change locally, roll back on server rejection) plus WebSocket push for live updates from other clients, and per-field last-writer-wins conflict resolution (adequate at small-team concurrency levels — a handful of people editing the same issue at once, not thousands). No client-side durable object cache, no offline-first editing, no CRDT merge logic in v1.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Full local-first sync engine (IndexedDB cache + CRDTs), matching Linear's apparent approach | Matches the incumbent's headline UX differentiator; offline-capable | Very high implementation cost; one of the hardest problems in the category; delays the core loop (M1) by months | Wrong first investment — the charter's wedge is the workflow model and openness, not out-competing Linear on sync-engine sophistication on day one |
| CRDT library (Yjs/Automerge) for the whole object graph | Proven open building blocks (architecture-inference.md catalog); real offline support | Designed mainly for collaborative document editing, not a large relational object graph with server-side business rules (workflow transitions, permissions); would still be a large lift | Overkill for issue-tracker-style structured data at small-team scale; better suited to a future rich-text/docs feature (M3) than to issues themselves |
| Plain request/response, no live push at all | Simplest possible implementation | Feels stale immediately — multiple people watching a cycle board in real time is a Core expectation set by the whole category, not just Linear | Fails the "job fails without it" bar for Core in a multiplayer tool |

## Consequences

- What becomes easier: v1 ships faster; no exotic client-side storage layer to build, test, and keep consistent; debugging is simpler (server is always right).
- What becomes harder, and what we accept: no offline editing in v1 (Later milestone if demand appears); perceived latency will be good but not Linear's signature "instant" feel — acceptable, since it's not what a small team switching for openness/pricing/ownership is optimizing for first.
- Operational impact on self-hosters: one WebSocket-capable app process; no additional service.
- License and dependency implications: none beyond the app framework's own WebSocket support.
- How we would reverse this: the client's optimistic-update pattern is a reasonable stepping stone toward a real local-first cache later; revisit as its own ADR if offline support becomes a stated Diff-tier goal.
