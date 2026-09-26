# Provenance log

## Statement

velvet-acorn is an independent implementation. It was built from publicly available marketing/docs pages and third-party review summaries about Statuspage's features and behavior, and from original design and engineering work. No source code, decompiled or de-minified code, internal documents, or copyrighted assets or text of Statuspage/Atlassian were used. velvet-acorn is not affiliated with or endorsed by Atlassian. "Statuspage" and "Atlassian" are trademarks of Atlassian, used here only to identify the product this project offers an alternative to.

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| 2026-09-25 | Search-engine synthesis of Atlassian's public pricing/marketing pages | [S1],[S2] in dossier | Feature list, pricing-tier gating pattern (used only to shape the better-thesis, not copied) |
| 2026-09-25 | Third-party blog/review comparisons (Hyperping, Better Stack, OpenStatus, Instatus, G2 summary) | [S3]–[S8] in dossier | Pain/love themes, competitive field, domain-model concepts (component vs. incident state) |

## Deliberately not accessed

- Client-side source code, bundles or source maps of statuspage.io
- Decompiled or disassembled binaries
- Leaked, internal or NDA material
- Any Atlassian proprietary or source-available code
- Bulk-scraped content or user data
- Statuspage's logo, color palette, typefaces, icon set, illustrations or UI copy — no account was created and no live app screens were viewed; all design decisions were made independently (see `docs/design/direction.md`)

## Codename

`velvet-acorn`, generated at random (`scripts/codename.py --avoid statuspage`) on 2026-09-25. It contains no part of "Statuspage" or Atlassian's marks. The user may rename the project at any time.

## UI inspiration sources

No screenshots of Statuspage's actual product UI were viewed (no account exists). The public-page layout convention (status banner + component list + incident history) is a genre convention shared across the whole category — also used by Cachet, OpenStatus and many companies' own hand-built status pages — not something distinctive to Statuspage's brand. The visual design itself (typography, color tokens, spacing) is original, documented in `docs/design/direction.md`.

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| 2026-09-25 | None — no Atlassian account was created | n/a | Used only public marketing pages and third-party review summaries |

## Third-party material we *do* use

| Item | Source | License | Where used |
|---|---|---|---|
| Inter font | Google Fonts | SIL OFL 1.1 | UI typography (self-hosted static file, no external request at runtime) |
| better-sqlite3, express, ejs, bcryptjs and other npm dependencies | npm | MIT/BSD/ISC (see package.json) | Application runtime |

## Human direction

| Date | Decision | Made or approved by |
|---|---|---|
| 2026-09-25 | Scope, stack, license, codename, design direction, and all charter answers | Agent, acting on the user's explicit "make the calls yourself, just build it" instruction (Prototype mode) |

## Incidents

None.
