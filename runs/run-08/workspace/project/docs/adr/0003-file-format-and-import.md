# ADR-0003: Open native file format, and import via Figma's official REST API (never the .fig binary)

_Status: proposed · Date: 2026-09-25_

## Context

Figma's `.fig` format is undocumented by Figma itself; only third-party, community reverse-engineering exists (dossier §6). Reading or reverse-engineering that binary format ourselves would mean studying reconstructions of Figma's own internal data structures — a legally gray "reading implementation" move the skill's guardrails explicitly warn against (`legal-and-licensing.md` §3–4), and it would undermine Vinca's independent-creation record.

At the same time, the single biggest switch-blocker identified in research (dossier §5, "lock-in / no real export") is that organizations have years of design-system libraries trapped in Figma with no easy way out. An importer is the parity-matrix's top "Switch" item.

## Decision

1. Vinca's own native file format will be **documented and open** from the start (a JSON/structured document describing the node tree, components, styles — designed originally, not copied from Figma's or Penpot's internal schemas).
2. The Figma importer will work **only through Figma's own official, documented REST API**, using the *user's own* personal access token to read *their own* files' JSON node trees (dossier §6, §5) — never by parsing the `.fig` binary or any reverse-engineered schema.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Parse `.fig` binary via community reverse-engineering docs (e.g. OpenFig-org's Kiwi-schema notes) | Could work without the user needing an API token; potentially higher fidelity | Relies on someone else's reverse-engineering of Figma's proprietary internal format; legally and provenance-wise the riskiest option available | Explicitly avoided per `legal-and-licensing.md` — this is exactly the kind of "reading implementation" the guardrails warn against |
| No importer; require manual rebuild | Simplest to build; zero legal surface | Leaves the single biggest switch-blocker unaddressed; makes the project far less useful to anyone with an existing Figma workspace | Defeats the point of a "Switch" tier item |
| Adopt Penpot's SVG-based storage format wholesale | Reuse a working, already-open format | Would mean copying Penpot's design decisions closely rather than an independent implementation; also SVG alone doesn't capture Figma-equivalent concepts like components/instances/variables cleanly | Design our own format instead, informed by (not copied from) the REST API's documented node-tree shape, which is functional/interoperable and free to reimplement |

## Consequences

- What becomes easier: the import path is legally clean (Figma's REST API is public, documented, and used under the user's own credentials reading their own data — not scraping, not decompiling) and testable against real user data from day one.
- What becomes harder, and what we accept: import fidelity is capped by what the REST API exposes (e.g. Variables/Collections are Enterprise-scoped in Figma's own API per dossier §6 — a Starter/Professional-tier user's variables may not be fully importable). We accept this gap and will document it plainly rather than working around it via undocumented means.
- Operational impact on self-hosters: the importer is a background job hitting Figma's API with rate limits in mind (dossier §5 notes Figma's own users hit 429s); needs a simple job queue (see ADR planned for M2, not written this session).
- License and dependency implications: none beyond our own original format's documentation (recommend CC-BY-4.0 for the format spec itself, per `legal-and-licensing.md` §10).
- How we would reverse this: not applicable — this is a compliance-driven decision, not swapped for performance reasons.
