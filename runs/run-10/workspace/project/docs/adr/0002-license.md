# ADR-0002: License as AGPL-3.0-or-later

_Status: accepted · Date: 2026-09-25_

## Context

The charter records no commercial intent and no plan for a proprietary "enterprise" tier — the whole point is a free, self-hostable tool for a nonprofit. The skill's guardrails require an OSI-approved license for anything called "open source," and recommend choosing based on what the project should protect.

## Decision

License Formstead under AGPL-3.0-or-later.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| MIT | Maximum adoption, simplest for contributors | Allows a third party to host a closed, modified SaaS version of Formstead and never share improvements back | The charter's motive (community/public-good byproduct of a cost-saving build) favors keeping improvements shared, not maximizing commercial reuse |
| Apache-2.0 | Adoption-friendly, explicit patent grant | Same closed-hosting gap as MIT | Same reasoning as MIT |
| AGPL-3.0-or-later | Closes the "run it as a hosted service without sharing changes" loophole that plain GPL leaves open — fitting for a web app | Some companies avoid AGPL dependencies; slightly smaller pool of potential contributors | Formstead is an end-user web application, not a library others will embed — the AGPL's network-use clause is exactly the SaaS scenario it's meant to cover, and adoption breadth matters less here than keeping it open |

## Consequences

- What becomes easier: any hosted fork (e.g. someone spinning up "Formstead-as-a-service") must share its source, keeping the ecosystem open.
- What becomes harder, and what we accept: a company wanting to embed Formstead in a closed commercial product can't, without a separate license from the project — acceptable since the charter has no commercial intent.
- Operational impact: none on self-hosters; the license only bites when someone else re-hosts a modified version for others.
- Dependency implications: all current dependencies are MIT/ISC/BSD, all compatible with AGPL.
- Reversal: the project owner (whoever holds copyright, here effectively the nonprofit) could relicense future versions, but can't retroactively relicense already-released AGPL code without contributor consent.
