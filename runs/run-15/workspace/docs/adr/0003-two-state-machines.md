# ADR-0003: Keep component status and incident status as two separate state machines

_Status: accepted · Date: 2026-09-25_

## Context

Dossier §2/§6 identifies that Statuspage models a component's health (operational → degraded → partial outage → major outage, or under maintenance) separately from an incident's own lifecycle (investigating → identified → monitoring → resolved). Collapsing these into one status field is a tempting simplification but loses real information: an incident can stay "monitoring" while its component is already back to "operational."

## Decision

Model `Component.status` and `Incident.status` as independent enums, linked by an `incident_components` join table. The public page's overall banner is a pure function of the *worst current component status*, not of any incident's status directly. Maintenance windows are represented as an `Incident` with `impact = 'maintenance'` and a `scheduled_for`/`scheduled_until` window, reusing the same updates timeline mechanism rather than inventing a parallel maintenance model.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Single combined status per component | Simpler schema | Can't represent "incident resolved, component still degraded" or vice versa | Loses information the incumbent's users rely on |
| Separate `Maintenance` table/model | Conceptually distinct from incidents | Duplicates the entire updates-timeline logic | Reuse via `impact` keeps one code path, one UI, one test suite |

## Consequences

- What becomes easier: incident timeline rendering, JSON API, and RSS feed all share one code path for incidents and maintenance.
- What becomes harder: the "impact=maintenance" convention needs a one-line comment so it doesn't look accidental; documented here instead of in code, per the no-comments-that-restate-code rule.
- Operational impact: none beyond initial schema design.
- License/dependency implications: none.
- How we'd reverse this: maintenance could be split into its own table later without touching the component/incident split.
