# Provenance log

## Statement

Formstead is an independent implementation. It was built from publicly available marketing, pricing and review-page information about Typeform's features and behavior (accessed only via search-result summaries, since direct page fetches were blocked by network policy this session — see dossier), and from original design work. No source code, decompiled or de-minified code, internal documents, or copyrighted assets or text of Typeform were used. Formstead is not affiliated with or endorsed by Typeform S.L. "Typeform" is a trademark of its owner, used here only to identify the product we offer an alternative to.

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| 2026-09-25 | Web search result snippets (pricing/review pages) | [S1]-[S3], [S9] in dossier | Pricing/response-limit model, pain themes, competitive field |
| 2026-09-25 | Web search result snippets (Typeform docs/help pages) | [S6][S7] in dossier | Concept of logic-jump branching (own implementation, not copied) |
| 2026-09-25 | Web search result snippets (company history) | [S8] in dossier | Identity/history section only, not product design |
| 2026-09-25 | Original design | — | Domain model, schema, UI layout, admin builder UX — all designed fresh, not observed |

## Deliberately not accessed

- Client-side source code, bundles or source maps of Typeform
- Decompiled or disassembled binaries
- Leaked, internal or NDA material
- Any Typeform account (none was created or used)
- Bulk-scraped content or user data

## Name check

| Date | Search (where / query) | Result |
|---|---|---|
| 2026-09-25 | web: "Formstead" app software | Only unrelated hit: a crypto-trading review site using the coincidental phrase "Lyse Formstead" — different category, no collision |
| 2026-09-25 | web: Formstead github | No matching org/repo named "Formstead"; unrelated "Formstation"/"formstate" projects are different names |
| 2026-09-25 | web: Formstead npm package | No npm package named "formstead" found |

Trademark register search not yet performed — recommended before any public launch (see `references/legal-and-licensing.md` §5 in the skill).

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| 2026-09-25 | Not reviewed directly (WebFetch blocked) | n/a | No Typeform account was created or used; research relied solely on public search-result summaries of marketing/help pages, so no ToS acceptance was involved |

## Third-party material we *do* use

| Item | Source | License | Where used |
|---|---|---|---|
| Node.js runtime and npm dependencies (express, better-sqlite3, express-session, bcryptjs, etc.) | npm registry | Various OSS licenses (MIT/ISC/BSD, see package.json) | Backend runtime |
| System font stack (no bundled font files) | Operating system | n/a | Frontend styling |

## Human direction

| Date | Decision | Made or approved by |
|---|---|---|
| 2026-09-25 | Scope: signup + survey forms only, no payments/files/AI in v1 | User (via request) + builder assumption, recorded in charter |
| 2026-09-25 | Stack: Node.js + Express + SQLite + Docker Compose, no SPA framework | Builder (Prototype mode, "just build it") |
| 2026-09-25 | Name: Formstead | Builder, pending user confirmation |
| 2026-09-25 | License: AGPL-3.0-or-later | Builder, pending user confirmation |

## Incidents

None.
