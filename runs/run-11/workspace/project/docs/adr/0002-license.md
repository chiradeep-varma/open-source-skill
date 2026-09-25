# ADR 0002: License

## Context
The project needs an OSI-approved open-source license. The team wants to be free
to modify, fork, and redistribute without copyleft obligations, and isn't trying
to prevent a hosting company from reselling it (no venture/business motive here —
this is a personal/team tool being open-sourced).

## Decision
MIT License.

## Alternatives considered
- **AGPL-3.0**: would force any hosted fork to publish its source. Rejected —
  the charter's motive is "save money / own our data" for one team, not
  protecting against SaaS resellers; AGPL also depresses adoption by other
  self-hosters who just want a permissive drop-in.
- **A "fair use" source-available license** (what Planka moved to): rejected
  outright — the charter requires actual open source, and this style of license
  is exactly the gap Corkboard's positioning calls out relative to Planka.

## Consequences
Anyone can fork, relicense their fork, or build a commercial hosted version on
top of Corkboard without owing anything upstream. Acceptable — there's no
business model here to protect.
