# Run 07: deep run, medium target (Linear, Brief mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: research and plan only (no code), headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh) |
| Skill state | v0.8 (commit `39ca348`): Run 06's fixes applied (process-log gate, stricter `confirmed`, one search per name-check location, required README lines) |
| Prompt | `I think I could build a better, open-source Linear for small engineering teams. Brief mode: do the research and give me the plan, no code yet. Make the calls yourself. Put everything in ./project.` |
| Stats | 9.1 min · 62 turns · 60 tool calls · $1.98 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated plan](workspace/project/): [brief](workspace/project/docs/brief.md), [dossier](workspace/project/docs/research/dossier.md), [process log](workspace/project/docs/process-log.md) |

## Outcome in one line

**The best run so far.** A deep, honest dossier with a real domain model, value decomposition and an evidence-based better-thesis; a careful name check; four ADRs; and a process log that openly says the research floor was only partly met because this sandbox blocked the primary sources.

## What changed since Run 06

| Signal | Run 05 | Run 06 | Run 07 |
|---|---|---|---|
| Web searches | 1 | 5 | **22** |
| Pages fetched | 0 | 0 | **8** attempted (7 blocked by the sandbox's egress proxy; see below) |
| Skill files opened | 0 | 0 | **8** (6 templates, the architecture and legal references) |
| Name check | none | 1 combined query | **12 separate searches**, 4 names rejected for collisions, 1 cleared |
| Process log | n/a | n/a | ✅ With an honest self-assessment against the research floor |
| `confirmed` used only for fetched pages | n/a | ❌ | ✅ Downgraded everything unreachable to `inferred`, with an access note |

The process-log requirement did what process instructions alone couldn't: it made the agent check its own work against the floor and disclose the shortfall.

## Environment note

This sandbox's egress proxy refused linear.app, g2.com, github.com and web.archive.org. The agent detected this (it even queried the proxy's status endpoint) and switched to search snippets and `raw.githubusercontent.com`. It tagged every affected claim `inferred` and added a "re-verify before treating as final" list to the brief. That's the correct behavior. The skill didn't prescribe it, though, so this run codifies it.

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Founded 2019 by Karri Saarinen, Tuomas Artman, Jori Lallo | ✅ | Public record; [TechCrunch](https://techcrunch.com/2025/06/10/atlassian-rival-linear-raises-82m-at-1-25b-valuation/) |
| $82M Series C at a $1.25B valuation, June 2025 | ✅ | [TechCrunch](https://techcrunch.com/2025/06/10/atlassian-rival-linear-raises-82m-at-1-25b-valuation/) |
| Free: unlimited members, 2 teams, 250 issues; Basic $10 and Business $16 per user per month, billed annually; Enterprise custom with SAML and SCIM | ✅ | [Quackback](https://quackback.io/blog/linear-pricing), [ONES](https://ones.com/blog/solution-guide/linear-pricing-2026-plans-alternatives/) |
| Linear Agent public beta in March 2026 | ✅ (24 Mar 2026) | [Linear changelog](https://linear.app/changelog/2026-03-24-introducing-linear-agent) |
| Code Intelligence in May 2026; Diffs in May 2026 | ✅ (14 May, 27 May) | [changelog](https://linear.app/changelog/2026-05-14-code-intelligence), [changelog](https://linear.app/changelog/2026-05-27-linear-diffs) |
| Linear Agent gated to the Business tier | ⚠️ **Partly wrong.** Linear Agent is on *all* plans during beta; Code Intelligence is the Business+ feature. | [changelog](https://linear.app/changelog/2026-03-24-introducing-linear-agent) |
| Plane is AGPL-3.0 | ✅ Community Edition (a commercial edition also exists, which the dossier doesn't mention) | [Plane: open source](https://plane.so/open-source) |
| Plane offers managed hosting "through Zenith" | ⚪ Present in the fetched README summary; not independently verified | |
| "Fenline" is free to use in the category | ✅ No product found | search |

**Accuracy: 7 of 8 checkable claims correct, 1 partly wrong, 1 unverified.** A clear improvement on Runs 05 and 06 (3 of 6 and 3 of 8).

## Quality notes (qualitative review)

- The **better-thesis** is grounded in evidence: pricing gates (SSO, guest access and private teams behind $16/seat and up) plus review pain themes (no docs space, no custom fields) map directly to Differentiator rows. It isn't invented.
- The **scope judgment** is good. It explicitly won't chase Linear's 2026 AI-agent surface and leaves a bring-your-own-model hook instead. It also chose server-authoritative sync over rebuilding Linear's local-first engine, with a matching ADR.
- The **competitive field** is positioning, not recommendation: "Build in this field deliberately, not against it — Plane and Huly aren't things to recommend instead."
- The **legal surface** is honest: the terms of service couldn't be fetched, so it tells the user to read them before any API-based importer, and it defaults to a user-triggered export.

## Flaws found

1. **`references/research-playbook.md` still wasn't opened.** The templates were opened this time, which is partial compliance. The research floor in SKILL.md carried the depth instead.
2. **A tier-gating contradiction between sources wasn't caught** (Linear Agent). Aggregator snippets and the changelog disagreed.
3. **No codified behavior for blocked primary sources.** The agent improvised well, but the next run might not.

## Changes made because of this run

- **SKILL.md, evidence standard:** added what to do when a primary source is unreachable:
  1. Try an archived copy (the Wayback Machine) where reachable, or ask the user to paste the page.
  2. Otherwise tag the claim `inferred`, disclose the gap in the dossier, and add a "verify before building" list to the brief.
- **SKILL.md, evidence standard:** for tier and pricing claims, prefer the vendor's own changelog or pricing page over aggregators when they disagree, and record the disagreement.
