# ADR-0004: Forge-agnostic integration layer (webhooks + OAuth apps), not GitHub-only

_Status: proposed · Date: 2026-09-25_

## Context

Git/CI integration is one of the three hardest problems identified in the dossier (§7) and one of Linear's strongest "why people trust it" signals (dossier §6). Self-hosters in this project's target audience (small engineering teams choosing to self-host, per the charter) skew toward also self-hosting their forge — Gitea or Forgejo alongside GitHub or GitLab — more than a typical SaaS customer base would. Building git integration as a GitHub-only feature, the way many smaller OSS trackers do first, would leave exactly the self-hosting-minded users this project targets as second-class citizens.

## Decision

Build a single internal **Integration** abstraction (an inbound webhook receiver + an outbound webhook sender + an OAuth-app credential store) that the first three forge integrations (GitHub, GitLab, Gitea/Forgejo) implement against, rather than hardcoding GitHub-specific logic into the core issue model. Branch-naming convention, PR-status sync, and (later) deploy/release tracking are all expressed as events flowing through this one abstraction.

## Alternatives considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| GitHub-only integration (ship this first, add others "later") | Fastest to a demoable M2 milestone; GitHub is the largest single forge by user count | "Later" integrations rarely get built once the core abstraction was never designed for them; alienates the self-hosted-forge users who are disproportionately represented in this project's own target audience | Contradicts the charter's own audience (small teams choosing to self-host); the abstraction cost is small if paid up front |
| Generic webhook-only integration (no first-party OAuth apps, users wire up webhooks by hand) | Simplest to build; forge-agnostic by construction | Much worse day-one experience (manual webhook URL/secret configuration per repo); loses the "branch auto-created from an issue" workflow that's core to the git-integration value | Too weak a version of the Switch-tier capability in the parity matrix — "git integration" needs to feel automatic, not DIY |
| Deep, forge-specific integrations from day one for all of GitHub/GitLab/Gitea | Best possible experience per forge | Triples the integration work before M2 ships anything | Defer GitLab/Gitea's deeper features (e.g. GitLab CI status specifics) to Later; ship the shared abstraction plus GitHub first, prove the abstraction holds, then extend |

## Consequences

- What becomes easier: adding a fourth forge later (e.g. Bitbucket) is an incremental integration against an existing abstraction, not a rearchitecture; self-hosters running Gitea/Forgejo aren't stuck waiting indefinitely.
- What becomes harder, and what we accept: M2 takes slightly longer than a GitHub-only sprint would, because the abstraction has to be designed for at least two forges' shapes before it's trusted — accepted, since the parity matrix already schedules GitHub as the first concrete implementation, not the abstraction as the only implementation.
- Operational impact on self-hosters: one OAuth-app credential to configure per forge they connect; no additional running service.
- License and dependency implications: none beyond standard HTTP/OAuth client libraries.
- How we would reverse this: if the abstraction proves wrong once GitLab is implemented, it's an internal refactor, not a breaking change to the public API surface (webhooks in/out stay the external contract).
