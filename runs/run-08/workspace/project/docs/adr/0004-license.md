# ADR-0004: License Vinca under AGPL-3.0

_Status: proposed · Date: 2026-09-25_

## Context

The charter (assumed, pending user confirmation) leans toward a public-good/community motive with the option of a hosted offering later. Research (dossier §3) shows Penpot, the existing open-source Figma alternative, uses **MPL-2.0** (file-level copyleft — a closed hosted fork is legally possible under MPL-2.0 as long as Penpot's own files stay open). The skill's licensing guide (`legal-and-licensing.md` §10) recommends AGPL-3.0 specifically for "a network service where you don't want closed hosted forks," citing Plausible, Immich, Twenty and Grafana as precedent, versus Apache-2.0/MPL-2.0 when embedding and maximum adoption matter more than preventing closed hosted forks.

Vinca is exactly this kind of network service (a real-time collaborative canvas with a server component), and the better-thesis (dossier §8, parity matrix) leans on "no seat tax, real self-hosting, own your data" — a thesis that a closed, relicensed hosted fork would directly undermine.

## Decision

License Vinca under **AGPL-3.0** for the application (server + client). Recommend **CC-BY-4.0** for documentation and the native file-format specification, and **DCO** (not a CLA) for contributions, per the skill's default recommendation (light, trusted, no relicensing ambiguity).

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| MPL-2.0 (Penpot's choice) | More permissive for embedding; lower barrier for some corporate adopters who ban AGPL internally | Permits a closed, hosted, relicensed-in-practice fork of the whole running service, since only file-level changes must stay open — weaker on the "no closed hosted forks" part of the better-thesis | Matching Penpot's license doesn't serve a differentiated thesis; AGPL is the closer fit to "we don't want a SaaS vendor taking this closed" |
| Apache-2.0 / MIT | Maximum adoption, easiest for others to embed or build commercial products on | Doesn't protect against a well-funded competitor standing up a closed hosted version with no obligation to contribute back | Adoption-maximizing licenses fit libraries/SDKs better than a full network service where openness of hosted forks is part of the pitch |
| Open core (AGPL core + proprietary paid modules) | Enables a sustainable hosted-business path later | Requires a CLA/copyright assignment now, which costs community trust (skill: every major CLA-enabled relicensing of the last decade triggered a community fork) | Premature for Brief mode with no confirmed commercial intent; revisit explicitly if/when the user confirms a business motive |

## Consequences

- What becomes easier: the project's "own your data, no closed forks" positioning is legally backed, not just marketing; matches the pattern of comparable open SaaS alternatives.
- What becomes harder, and what we accept: some companies ban AGPL dependencies internally, trading away a slice of potential corporate self-hosters — accepted, since the target audience (per charter) is teams choosing self-hosting specifically for openness/control.
- Operational impact on self-hosters: none directly — AGPL only obligates offering source to users of the *network service*, which self-hosters already have by definition (they run the code).
- License and dependency implications: all direct dependencies must be AGPL-compatible; MIT/Apache-2.0/BSD dependencies (Yjs, Hocuspocus, etc. — ADR-0001) are fine. Must avoid dependencies under licenses incompatible with AGPL/GPL-3.0-family combination (see `legal-and-licensing.md` §10 step 5) — to be checked per-dependency during Phase 7.
- How we would reverse this: license changes after real contributions exist require either unanimous contributor consent or a CLA established in advance; since no CLA is planned, treat this choice as effectively permanent once contributions arrive. This is why it's flagged for explicit user confirmation before Phase 7 begins.
