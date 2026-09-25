# Provenance log

> This log is evidence that <project> was created independently of <incumbent>. It records what informed the work and what was deliberately never accessed. Keep it current: add an entry whenever a new kind of source is used, or a decision is made about access.

## Statement

<project> is an independent implementation. It was built from publicly available information about <incumbent>'s features and behavior, from user-provided observations and data exports, and from original design work. No source code, decompiled or de-minified code, internal documents, or copyrighted assets or text of <incumbent> were used. <project> is not affiliated with or endorsed by <incumbent's owner>. "<Incumbent>" is a trademark of its owner, used here only to identify the product we interoperate with or offer an alternative to.

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| YYYY-MM-DD | Public docs | [S#] in dossier | Feature inventory, domain concepts |
| YYYY-MM-DD | User data export (own data) | description, not the data itself | Importer format, data model |
| YYYY-MM-DD | Public API reference | [S#] | Compatibility layer (docs rewritten independently) |

## Deliberately not accessed

- Client-side source code, bundles or source maps of <incumbent>
- Decompiled or disassembled binaries
- Leaked, internal or NDA material
- <incumbent>'s proprietary or source-available code (including any `ee/` directories)
- Bulk-scraped content or user data

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| | | | e.g. "Used public docs only; did not use an account" |

## Third-party material we *do* use

| Item | Source | License | Where used |
|---|---|---|---|
| e.g. icon set | | | |

## Human direction

Record the key decisions a human made or approved, such as scope, architecture, UX direction and naming. This documents human authorship alongside AI assistance.

| Date | Decision | Made or approved by |
|---|---|---|
| | | |

## Incidents

Note any accidental exposure to implementation material, what was exposed, which code could have been affected, and what was done about it (for example, "rewritten from spec by a different contributor").
