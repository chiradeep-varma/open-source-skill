# ADR-0003: License Fenline under AGPL-3.0, with DCO for contributions

_Status: proposed · Date: 2026-09-25_

## Context

The charter (docs/charter.md) commits to being open source and public from day one, with commercial intent left open ("none now, maybe later — a hosted offering"). `legal-and-licensing.md` §10 gives the standard guidance: for a network-service alternative to a SaaS product, default to AGPL-3.0 when the goal is to stop closed hosted forks, and to Apache-2.0 when maximizing adoption/embedding matters more. This is exactly the category (Plane, the closest open rival identified in the dossier, already uses AGPL-3.0 — dossier §3), and it's a self-hosted SaaS-shaped product where "someone takes the code, hosts it, and out-competes the original project with zero contribution back" is a real and common failure mode in this space.

## Decision

License Fenline under **AGPL-3.0**. Require a **DCO** (`Signed-off-by`) on contributions rather than a CLA, since there's no committed dual-licensing or relicensing plan — a CLA would cost community trust for no current benefit (legal-and-licensing.md §10, Step 4).

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Apache-2.0 | Maximizes adoption and embeddability; explicit patent grant; some companies ban AGPL internally, so this avoids that friction | A cloud provider could host a closed, unmodified fork and compete directly with any future hosted offering, with no obligation to contribute changes back | The charter leaves a future hosted offering open as an option; AGPL protects that option without foreclosing it now |
| MIT | Simplest, most familiar | Same hosted-fork risk as Apache-2.0, plus no explicit patent grant | Weaker than Apache-2.0 on the one axis that matters (patents) with none of AGPL's protection |
| Source-available (BSL/FSL) | Strongest protection against a competing hosted fork | Not actually open source (OSI-approved) — would misrepresent the project's core claim ("open-source Linear") and contradicts the charter's stated Openness intent | Rejected outright: the whole point of this project is to *be* open source, not source-available |
| CLA + dual licensing (AGPL + commercial) | Enables a later commercial open-core model cleanly | Requires a CLA, which costs trust and has caused forks in other projects (Elasticsearch→OpenSearch, Terraform→OpenTofu, Redis→Valkey — legal-and-licensing.md §10) | No committed business model yet; adopt this later, deliberately, if a hosted offering actually launches — not preemptively |

## Consequences

- What becomes easier: the project's core promise ("actually open source, self-hostable") is unambiguous and matches the category norm (Plane); a future hosted offering stays protected from a closed competing fork.
- What becomes harder, and what we accept: some companies' internal policies ban AGPL dependencies, which may cost some corporate self-hosters — accepted, since the charter's audience is small engineering teams and the open-source community, not enterprise procurement.
- Operational impact on self-hosters: none — AGPL's network-source obligation applies to anyone who modifies and hosts the software for others, not to a team simply running it internally, which is the primary charter use case.
- License and dependency implications: all dependencies must be AGPL-compatible (see legal-and-licensing.md §10, Step 5); scan in CI once code exists.
- How we would reverse this: relicensing later (e.g. to enable a CLA/dual-license model) would require either unanimous contributor consent or a CLA adopted going forward — flag this explicitly in CONTRIBUTING.md so contributors aren't surprised later.
