# Architecture inference and hard problems

How to work out how a product works from the outside, and how to solve its hard problems with proven open building blocks. Use it in Phase 3 (the technology lens) and Phase 6 (design).

## Contents
1. The line: observe behavior, never read implementation
2. Signals and what they reveal
3. Inference patterns: from behavior to mechanism
4. Writing the inferred architecture
5. Hard-problem catalog with open building blocks
6. Choosing building blocks

---

## 1. The line: observe behavior, never read implementation

You may study **what the product does and how it talks**:
- the features and behavior you can see;
- documented APIs;
- protocols on the wire in your own session;
- timing, limits and errors;
- what its engineers have said publicly.

You may not study **how it's written**:
- client source code, including minified or de-minified bundles and source maps;
- decompiled binaries;
- leaked repositories;
- private documents.

Knowing that a web app uses WebSockets and sends JSON patches is observation. Reading its bundle to see how it merges those patches is reading implementation, and it contaminates everything you write afterwards. `legal-and-licensing.md` explains why.

If you catch yourself wanting to "just check how they did it", design your own solution from first principles and the public literature instead. For almost every hard problem there is published research and at least one mature open implementation to learn from.

## 2. Signals and what they reveal

| Signal | Where | What it reveals |
|---|---|---|
| Engineering blog posts, talks, papers | Company blog, conference video archives, academic venues | Core architecture, data stores, scaling history and why decisions were made. Note the dates, because stacks change. |
| Job postings | Careers page, job boards | Languages, frameworks, data stores, infrastructure and the problems currently being hired for ("scaling our real-time sync engine"). |
| Company open-source repositories | Their GitHub or GitLab organization | Internal tooling, frameworks they built on, and dependencies they rely on. |
| Open-source acknowledgments and third-party notices | "About", "Licenses" or "Acknowledgements" screens in apps; notice files shipped with installers | The open base the product is built on (Chromium, Electron, an open editor core, open databases or models). You can often start from the same base. |
| Subprocessor list | Trust, privacy or DPA pages | Cloud provider, email, payments, analytics, support and AI vendors. |
| DNS and HTTP headers | Public DNS lookups, response headers | CDN, hosting, email provider (MX and SPF records), edge platform. |
| Status page components and incident post-mortems | status.<domain> | How they carve up services ("API", "Realtime", "Search", "Webhooks"), dependencies, failure modes. Post-mortems often name databases, queues and regions. |
| Public API design | API reference | REST, GraphQL or RPC; pagination style; idempotency keys; consistency model ("changes may take up to 30s to appear"). |
| Client network behavior in your own session | Browser developer tools | Transport (WebSocket, SSE, long-poll), sync granularity (whole document vs. operations), request timing, where rendering happens. |
| Limits and quotas | Docs, error messages | Partitioning boundaries, cost drivers and data-structure choices (see §3). |
| Offline and latency behavior | Hands-on use, reviews | Local-first vs. server-authoritative; optimistic updates; conflict handling. |
| Export formats | Export docs, user's export | The internal data model's shape and what's first-class vs. derived. |
| Mobile app listings | App stores | Permissions, size, platform frameworks, offline claims. |
| Patents | Patent databases | Mechanisms as claimed. See the legal reference before reading them. |

## 3. Inference patterns: from behavior to mechanism

Treat each inference as a hypothesis, tag it `inferred`, and look for a second signal before relying on it.

| You observe | Likely mechanism |
|---|---|
| Other people's cursors and edits appear instantly and merge cleanly | WebSocket or similar channel, an operation log, CRDT or OT or a server-authoritative merge, a presence service |
| Works offline, then syncs | Local database on the client plus a sync engine; conflict rules (CRDT, last-writer-wins per field, or manual resolution) |
| Search results lag a few seconds behind edits | Asynchronous indexing into a separate search engine, fed by a queue or change-data-capture |
| "Up to N rows/items per workspace" | Per-tenant partitioning, or an in-memory working set per workspace or document |
| Large uploads, resumable, with direct-download links | Object storage with pre-signed URLs; chunked or multipart upload |
| Region choice or data residency | Regional deployments ("cells"), tenant pinned to a region |
| Rate limits per workspace rather than per user | Tenant-level quotas, often protecting a shared backend |
| Webhooks with retries and signatures | Outbox pattern or queue, delivery workers, HMAC signing |
| "Changes may take up to X to appear" in API docs | Eventual consistency, caches or read replicas |
| Undo history, version history, "restore to any point" | Append-only operation log or snapshot + delta storage |
| Instant load of huge documents | Lazy loading, virtualization, server-side precomputation or tiling |
| Formulas, rollups and cross-references update live | Dependency graph and incremental recomputation |
| Feeds and recommendations that improve with use | Event collection pipeline, feature store, ranking models. The *data* is the moat. |
| Audit logs and SSO only on enterprise plans | These exist as separable modules. Often cheap to build and a strong open differentiator. |

## 4. Writing the inferred architecture

In the dossier's technology lens:
1. **Component sketch.** Clients → edge → services → data stores → async pipeline → third parties. A Mermaid diagram works well. Tag every box `confirmed` or `inferred`.
2. **Data flow for the core loop.** Trace one key workflow end to end through the components.
3. **The three hardest problems,** each with evidence of why it's hard for this product specifically.
4. **Scale context.** Their scale vs. the charter's target scale. The gap between the two is where your architecture should be simpler.
5. **"So what for the build."** What to replicate conceptually, what to simplify, and what to skip.

The inferred architecture is for *understanding*. The design in Phase 6 is your own, shaped by self-hosting and contributors rather than by their constraints.

## 5. Hard-problem catalog with open building blocks

These are starting points, not endorsements. Licenses and maintenance status change: MinIO's community edition was archived in 2026, and several popular "open" SDKs are source-available or need production license keys. Verify each dependency's current license and activity before adopting it (see §6).

| Problem | Why it's hard | Open building blocks (license at time of writing) | Notes |
|---|---|---|---|
| Real-time collaborative editing | Concurrent edits, merge correctness, presence, offline | Yjs (MIT), Automerge (MIT); Hocuspocus (MIT) as a Yjs server | CRDTs suit text and trees. A server-authoritative model is simpler when a server always exists. |
| Rich text and block editors | Selection, schema, paste handling, collaboration | ProseMirror (MIT), Tiptap core (MIT), Lexical (MIT) | Pick one whose collaboration binding matches your sync choice. |
| Whiteboard, canvas or vector | Hit-testing, rendering performance, infinite canvas, collaboration | Excalidraw (MIT) | Some well-known canvas SDKs are source-available and need license keys for production. Check before depending on one. |
| Full-text search | Relevance, typo tolerance, facets, incremental indexing | Postgres full-text search, SQLite FTS5, Meilisearch (MIT community edition), Typesense (GPL-3.0), OpenSearch (Apache-2.0), Tantivy (MIT) | Start with the database's built-in search, and add an engine only when relevance or scale requires it. |
| Semantic or vector search | Embeddings, approximate nearest-neighbor indexes, hybrid ranking | pgvector (PostgreSQL License), Qdrant (Apache-2.0) | Keep the embedding provider pluggable, including local models. |
| Product analytics and events at scale | High-volume ingest, aggregations | ClickHouse (Apache-2.0), DuckDB (MIT) | Heavy components should be optional for small self-hosters. |
| Background jobs and workflows | Retries, idempotency, scheduling, durability | Postgres-backed queues (pg-boss, Graphile Worker, River, Oban), Temporal (MIT) | A Postgres queue avoids a separate broker at small and medium scale. |
| Identity, SSO, fine-grained permissions | Security-critical, standards-heavy | Keycloak (Apache-2.0), Ory Kratos (Apache-2.0); OpenFGA (Apache-2.0), SpiceDB (Apache-2.0) for relationship-based authorization | Never write your own crypto or password storage. Use your framework's mature auth library, or delegate to one of these. |
| Voice and video calls | NAT traversal, bandwidth adaptation, many participants | WebRTC with LiveKit (Apache-2.0), mediasoup (ISC) or Jitsi (Apache-2.0) | Self-hosters need TURN servers. Document it. |
| Email sending | Deliverability is reputation and operations, not code | SMTP to a provider of the user's choice; Stalwart (AGPL-3.0) for a full mail server | Let deployers plug in their own provider rather than promising inbox placement. |
| Object and file storage | Durability, large files, access control | The S3 API as the interface; Garage (AGPL-3.0), SeaweedFS (Apache-2.0), Ceph; or the local filesystem for single-node installs | Code against the S3 API so deployers can choose a backend. |
| Maps, geocoding, routing | Data licensing, tile serving, routing graphs | OpenStreetMap data (ODbL share-alike on databases), MapLibre GL (BSD-3), PMTiles, OSRM (BSD-2), Valhalla (MIT), GraphHopper (Apache-2.0), Nominatim (GPL-2.0) | ODbL obligations apply to derived databases. Read them. |
| Payments and billing | Card acquiring requires licensed processors | Integrate processors; Lago (AGPL-3.0) and Kill Bill (Apache-2.0) for billing logic | Software can be open, but money movement can't be self-hosted away. |
| Push notifications | Mobile push runs through platform gatekeepers | APNs and FCM for mainstream apps; UnifiedPush and ntfy (Apache-2.0/GPL-2.0) for open alternatives | Plan for the gatekeepers' requirements early. |
| End-to-end encryption | Key management, multi-device, group membership | libsodium (ISC), OpenMLS (MIT) for the MLS group protocol (RFC 9420); libsignal (AGPL-3.0) | Use vetted protocols and libraries, and get an external review before claiming security properties. |
| Local-first sync | Conflict semantics, partial replication, schema migration | Client database (SQLite, IndexedDB) plus CRDTs or a sync engine | Sync engines evolve quickly and some are source-available. Evaluate current options. |
| AI features (generation, extraction, agents) | Model quality, cost, privacy, evaluation | llama.cpp (MIT), vLLM (Apache-2.0), Ollama (MIT) for local inference; a provider-agnostic client for hosted APIs | Let users bring their own model or key. Check model-weight licenses; many "open" models have use restrictions. |
| Feeds, ranking, recommendations | The moat is behavioral data at scale | Transparent heuristics (recency, follows, simple collaborative filtering) first | Open alternatives often win by letting users choose or inspect the algorithm, rather than matching its opacity. |
| Media processing | Codecs, performance, patents | FFmpeg (LGPL/GPL depending on build), libvips (LGPL-2.1+) | Prefer royalty-free codecs (AV1, VP9, Opus). Know which FFmpeg build flags pull in GPL code. |
| Office and document formats | Huge, quirky specifications; fidelity | LibreOffice headless (MPL-2.0), pandoc (GPL-2.0+), PDF.js (Apache-2.0) | Aim for good-enough import and a clean native format, not perfect round-trips. |
| Spreadsheet or formula engines | Dependency graphs, compatibility with existing functions | Existing engines, some GPL or dual-licensed; check license fit | Function *names and behavior* are functional. Write your own documentation. |
| Calendars and scheduling | Time zones, recurrence rules, invitations | iCalendar (RFC 5545), CalDAV (RFC 4791), the IANA time-zone database | Recurrence and time zones are where bugs live. Use standard libraries and test around DST transitions. |
| Plugins and extensibility | Isolation, stable APIs, versioning | WebAssembly (Extism, BSD-3), webhooks, scripting sandboxes | Offer a small, stable extension API rather than exposing internals. |
| Running untrusted code | Isolation and resource limits | Containers with gVisor (Apache-2.0) or Firecracker (Apache-2.0), WebAssembly | Isolation is a security boundary. Document the threat model. |
| Federation and decentralization | Identity, moderation, consistency across servers | ActivityPub (W3C), Matrix, AT Protocol, XMPP | Implementing an existing protocol beats inventing one, because your users can reach everyone already on it. |

## 6. Choosing building blocks

Check each candidate dependency before adopting it:

- **License fit.** Is it OSI-approved and compatible with the project's license? (See the compatibility notes in `legal-and-licensing.md`.) Is it source-available with a production restriction, or does it need a license key?
- **Health.** Releases in the last six months? Responsive maintainers? A bus factor above one? Who funds it?
- **Relicensing risk.** A single company controlling it, with a CLA that allows relicensing, has been the pattern behind past license changes. Prefer foundation-governed projects or ones with many contributors for load-bearing dependencies.
- **Operational weight.** What does a self-hoster have to run? Every extra service is a reason someone gives up on installing.
- **Replaceability.** Put an interface of your own around load-bearing dependencies (storage, search, AI providers, email) so the project can survive losing one.

Record the significant choices as decision records in `docs/adr/`.
