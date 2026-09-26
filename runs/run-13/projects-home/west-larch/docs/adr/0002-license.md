# ADR-0002: AGPL-3.0 license

_Status: accepted · Date: 2026-09-25_

## Context

The project is a self-hostable network service (a link-in-bio page builder) — the same shape as Immich and Plausible, both of which use AGPL to keep hosted forks open. The skill's licensing guide recommends AGPL-3.0 by default for this shape when the user wants hosted forks to stay open, versus Apache-2.0 when adoption/embedding matters more.

## Decision

License the project AGPL-3.0. Anyone can self-host it freely; anyone who modifies it and offers it as a network service to others must offer the modified source to those users too.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| MIT/Apache-2.0 | Maximum adoption, easy to embed | A host could take it, add plan gates, and never contribute back — recreating exactly the lock-in this project is a reaction to | Doesn't match the "no closed hosted forks" motive |
| Source-available (BSL etc.) | Can restrict competing hosted use | Not actually open source | User asked for open source |

## Consequences

- What becomes easier: hosted variants of this project stay open, matching the charter's privacy/ownership motive.
- What becomes harder: some companies avoid AGPL internally; accepted trade-off since this isn't aimed at corporate embedding.
- Operational impact: none for a self-hoster running it for themselves.
- License/dependency implications: all direct dependencies chosen are MIT-licensed, compatible with AGPL distribution.
- How to reverse: relicensing later would need consent from all contributors (currently just this session's work), so straightforward now, harder as contributors join.
