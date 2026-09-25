# Brief: an open alternative to Linear

**The product.** Fenline (proposed name) is an open-source, self-hostable issue tracker and project-management tool for small software engineering teams — the workflow model of Linear (Triage, Cycles, Projects), without the per-seat pricing, the SSO/guest-access paywalls, or the vendor lock-in.

**Why people use Linear.** It's fast (sub-50ms perceived navigation), keyboard-first, and deliberately opinionated — it removes the process-configuration burden that makes Jira exhausting for small teams. Engineers adopt it bottom-up because it's genuinely pleasant to use, then it spreads through the org.

**Where its value lives.** Almost entirely in software craft and workflow design, not in network effects, proprietary data, or regulated operations (dossier §8) — which is exactly the kind of moat an open, well-executed alternative can match or beat, rather than one it structurally can't reach.

**The field.** Plane (AGPL-3.0) is the closest existing open rival — a solid, larger Django+Node codebase, the closest match to Linear's workflow model. Huly (EPL-2.0) goes wide, aiming to replace Notion/Slack/calendar too, not just Linear. A smaller project, "It's a Plan," already validates that "open-source Linear with AI-agent awareness" is a live niche. None of them is built specifically to be the easiest possible single-VPS, one-command self-host for a small engineering team — that gap is this project's wedge.

**What we'll build.** For small engineering teams who feel Jira's configuration burden and Linear's per-seat pricing/paywalls, Fenline is an open-source, self-hosted issue tracker that keeps Linear's fast, opinionated workflow — unlike Linear, which gates SSO, guest access, and unlimited teams behind $16/seat-and-up tiers, and unlike Plane/Huly, which aren't built specifically for "one small team, one VPS, one command."
- Core loop: Triage → Cycle planning → work an issue (with git branch/PR linkage) → Project/Initiative rollup.
- Switch-blockers we'll cover: import from a Linear export, GitHub integration, public API/webhooks, and — as differentiators that double as switch-blockers — free SSO, free guest access, free unlimited teams.
- Differentiators: custom fields, a lightweight built-in docs/wiki (the #1 complaint we found about Linear), self-serve automation rules, an audit log, all free by default.

**What we won't build (for now).** Linear's proprietary AI-agent product surface (Linear Agent / Diffs / Code Intelligence) — a fast-moving target from a well-funded team, and a poor first wedge; we leave a pluggable bring-your-own-key AI hook instead. An all-in-one suite (docs+HR+calendar+chat) the way Huly is betting — staying focused on the engineering-team loop is the point.

**Hard parts and how we'll handle them.**
1. Real-time sync with low perceived latency → server-authoritative Postgres + WebSocket push + optimistic UI for v1, not a from-scratch local-first CRDT engine (ADR-0002). Simpler than Linear's own approach, appropriate for the charter's small-team scale.
2. Command-palette UX over a large object graph → client-side indexed search over the cached object graph, our own implementation.
3. Git/CI integration across multiple forges → one forge-agnostic webhook/OAuth abstraction (ADR-0004), GitHub first, GitLab and Gitea/Forgejo following on the same abstraction — important because self-hosting-minded users disproportionately self-host their forge too.

**Name and license (proposed).** Fenline — conflict check: no collision found in the project-management/issue-tracking category, on GitHub, or in the npm registry (four candidate names were checked and rejected first; see `docs/legal/provenance.md`). Formal trademark-register search still needed before public launch. **AGPL-3.0** with DCO, because this is a network-service alternative to a SaaS product and the charter leaves a future hosted offering open — AGPL keeps a closed hosted fork from out-competing the project with no contribution back, matching the category norm (Plane) (ADR-0003).

**Milestones.** M0 skeleton (auth, workspace, one-command self-host) → M1 core loop (issues, triage, cycles, views, command palette) → M2 switch-blockers (import, GitHub integration, search, API, and the free-by-default SSO/guest-access/unlimited-teams differentiators) → M3 differentiators (custom fields, docs, automation, audit log, initiatives).

**Risks and open questions.**
- This pass's research relied on WebSearch snippets for nearly everything about Linear itself, because linear.app, github.com, and g2.com were unreachable through this sandbox's egress proxy — pricing, feature-gating, and architecture claims are tagged `inferred`, not `confirmed`, and should be re-verified against linear.app directly before this plan is treated as final (see dossier's access note and Sources table).
- No Linear account or data export was available to design the importer against — it must be validated against a real export before it ships.
- Linear's Terms of Service were not reviewed (page unreachable) — read them before building any API-based (not just export-based) importer.
- "Fenline" needs a formal trademark-register check and domain/package-registry availability check before public launch.
- Whether to pursue a hosted-offering business model later (Venture mode) is still open.

**Decision needed:** confirm the name and license direction, confirm the M0–M3 sequencing, and decide whether to move into Prototype mode (a working core loop) next, or stay in planning and go deeper on a specific area (e.g. Venture-mode business modeling) first.
