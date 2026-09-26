# ADR-0002: MIT license

_Status: accepted · Date: 2026-09-25_

## Context

The charter's motive is personal cost savings and data ownership for the user's own side projects, not building a business or defending against a cloud vendor re-hosting the project commercially (`docs/charter.md`). Bitly is proprietary; the project is an independent build, never derived from Bitly's code (`docs/legal/provenance.md`), so there is no copyleft obligation inherited from an upstream target.

## Decision

License the project MIT.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| AGPL-3.0 | Prevents a cloud vendor from hosting a modified version without releasing changes; common choice for "open alternative to a SaaS" projects (e.g. Dub.co's core) | Adds friction for the stated use case — a developer forking this into their own unrelated side project has to think about network-copyleft obligations | The charter's motive is personal use, not fending off a competing hosted offering |
| MIT (chosen) | Maximum freedom to fork/embed into other side projects, which is exactly how the user intends to use it; simplest for casual contributors | Someone could take it and build a closed hosted competitor | Acceptable: there's no business here to protect, and the skill's guidance is to avoid a license choice that only makes sense if defending a business model |

## Consequences

- Easier: the user (or anyone) can fork this straight into another side project without license analysis.
- Harder: no legal lever against a third party hosting a closed SaaS fork — accepted, since that's not a risk this project is trying to manage.
- Operational impact: none.
- Dependency implications: all chosen dependencies (`express`, `better-sqlite3`, `ua-parser-js`, `qrcode`, `bcrypt`, EJS) are MIT/ISC/BSD-licensed, so nothing conflicts.
- Reversal: relicensing later would require consent from all contributors by that point; low risk while the project is small.
