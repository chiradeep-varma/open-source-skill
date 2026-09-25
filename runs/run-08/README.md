# Run 08: deep run, big target (Figma, Brief mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: research and plan only (no code), headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh) |
| Skill state | v0.9 (commit `a52c2e4`): Run 07's fixes applied (blocked-source fallback, vendor over aggregator) |
| Prompt | `I want to build an open-source Figma. It's a huge product, so figure out the right place to start. Brief mode: research and plan, no code yet. Make the calls yourself. Put everything in ./project.` |
| Stats | 5.6 min wall clock · 20 main-agent turns · 127 tool calls (incl. 3 research subagents) · $3.73 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated plan](workspace/project/): [brief](workspace/project/docs/brief.md), [dossier](workspace/project/docs/research/dossier.md), [roadmap](workspace/project/ROADMAP.md) |

## Outcome in one line

**The most thorough research so far, and accurate: every fact checked was correct. But 43 claims were tagged `confirmed` when only 2 of 21 page fetches succeeded; the plan was framed against Penpot rather than for Figma's users; and the "wedge" is most of Figma's core.**

## Process (from the trace)

| Signal | Result |
|---|---|
| Skill files opened | ✅ 10, the first run to open `research-playbook.md` and `disambiguation.md` |
| Research | ✅ 63 searches and 21 fetch attempts, split across **3 parallel research subagents** (identity/business/market, product/users, technology) |
| Access rules passed to subagents | ✅ "never read… client source code, minified/de-minified JS bundles, source maps" |
| Tag definitions passed to subagents | ✅ "confirmed (you read the actual page)". The rule was passed on, and then not followed. |
| Page fetches that succeeded | ❌ **2 of 21** (the Penpot repo, the tldraw license). figma.com, help.figma.com, Figma's engineering blog, Evan Wallace's mirror, Medium, Wikipedia and web.archive.org were all blocked by this sandbox. |
| Tags in the dossier | ❌ **43 `confirmed`**, 7 inferred, 7 memory. A closing "note on sourcing environment" admits nothing was fetched directly, but the tags weren't downgraded. Run 07 got this right. |
| `.fig` format | ✅ "Deliberately never attempted, for both legal and provenance reasons". Import goes through Figma's official REST API with the user's own token. |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Founded 2012 by Dylan Field and Evan Wallace (Brown); Field on a Thiel Fellowship | ✅ | [Wikipedia: Figma](https://en.wikipedia.org/wiki/Figma) |
| Greylock led a $14M Series A in 2015 | ✅ (Dec 2015) | [VentureBeat](https://venturebeat.com/entrepreneur/user-interface-design-app-figma-launches-with-14m-led-by-greylock-partners/) |
| Public launch in September 2016 | ✅ (27 Sep 2016) | [Figma blog: first year](https://www.figma.com/blog/reflecting-on-figmas-first-year/) |
| Adobe's ~$20B deal abandoned Dec 2023 with a $1B reverse termination fee | ✅ | [CNBC](https://www.cnbc.com/2023/12/18/adobe-and-figma-call-off-20-billion-merger.html) |
| IPO on 31 Jul 2025 on NYSE (FIG) at $33, raising about $1.2B; shares more than tripled | ✅ (closed at $115.50) | [CNBC](https://www.cnbc.com/2025/07/30/figma-prices-ipo-at-33-above-expected-range.html), [Bloomberg](https://www.bloomberg.com/news/articles/2025-07-31/figma-ipo-brings-value-near-20-billion-from-failed-adobe-deal) |
| 2025 seat model (Full, Dev, Collab) with prices from $3 to $90 per seat per month; effective 11 Mar 2025 | ✅ | [Figma blog: billing update](https://www.figma.com/blog/billing-experience-update-2025/), [UserJot](https://userjot.com/blog/figma-pricing-2025-plans-seats-costs-explained) |
| Penpot is MPL-2.0 and stores files as SVG; plugins arrived (beta) in 2024 | ✅ | [penpot/penpot](https://github.com/penpot/penpot) |
| "Vinca" is free in the design-software category | ✅ No collision found | search |

**Accuracy: 8 of 8 checked claims correct.** The content was right; the evidence labels were not.

## Quality review

- ✅ **Value decomposition is sharp.** It separates software value (the multiplayer canvas) from network lock-in (a decade of design-system libraries) and addresses the latter with an importer.
- ✅ **The hard parts are well chosen**: Yjs instead of reinventing Figma's protocol; WebGL2 first, with WASM as a later optimization.
- ⚠️ **The framing is anchored to a rival.** The reply opens: "Figma isn't a greenfield opportunity — Penpot… is already a mature… alternative". The better-thesis is "unlike Penpot, whose performance… still catching up". It doesn't *recommend* Penpot, but it defines the project by another open project instead of by Figma's users and the charter's motive. That is the "already exists" framing the owner asked to remove, only one step removed.
- ⚠️ **The wedge isn't a wedge.** M1 covers the multiplayer canvas, components and instances, styles, Auto Layout, prototyping, dev handoff, comments and permissions, which is most of Figma Design's core. The plan calls it "the wedge", but nothing in it is narrower than the product itself.

## Flaws found

1. **Tag inflation, again, despite an explicit definition.** The vocabulary had no honest label for "found in search results, primary page not opened", so the model reached for `confirmed`.
2. **Delegated research escaped the audit.** Subagents returned `confirmed` tags, and the main agent merged them without checking them against which fetches actually succeeded.
3. **The thesis was anchored to a rival project** rather than to the incumbent's users.
4. **No test for the size of the wedge**, so "the wedge" grew to cover nearly the whole core product.

## Changes made because of this run

- **New evidence tag, `reported`**: seen in search results or a secondary source; primary page not opened. `confirmed` stays reserved for pages actually read. Updated in SKILL.md, the research playbook, the dossier template and the artifact checker.
- **Delegation rule in SKILL.md.** When research is split across subagents, give each one the evidence standard, tag definitions and access rules, and require claim, tag and URL for every finding. Before merging, re-tag anything whose page wasn't actually fetched.
- **Principle 5** gained "Anchor the better-thesis in the incumbent's users and the charter's motive. Never call the idea 'not greenfield' or say a rival 'already occupies' the space."
- **Wedge test in Phase 4.** M1 must be shippable by the charter's team in weeks, not quarters, and must do one real job well enough that someone would choose it for that job today. If M1 lists most of the incumbent's core, cut it.
