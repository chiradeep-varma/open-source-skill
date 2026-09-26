# Run 05: deep run, small target (link shortener, Prototype mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: the full workflow, headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh) |
| Skill state | v0.6 (commit `fe8fe04`) |
| Prompt | `I want an open-source Bitly I can self-host for my side projects: short links with click stats. Make the calls yourself and just build it (Prototype mode). Put the project in ./project.` |
| Stats | 9.2 min · 92 turns · 90 tool calls · $2.51 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated project](workspace/project/) |

## Outcome in one line

**It built a working, well-documented prototype ("Trimly"), but the research phase collapsed to a single web search, and the name it picked is already used by a live URL shortener.**

## Build verification (re-run independently after the run)

| Check | Result |
|---|---|
| `npm test` | ✅ 12/12 pass |
| Log in (correct password / wrong password) | ✅ 302 / 401 |
| Create a link via the API, including a custom slug | ✅ |
| Short link redirects | ✅ 302 to the target |
| Unknown slug | ✅ 404 |
| Click recorded with referrer, OS and device | ✅ `top_referrers: news.ycombinator.com`, `top_os: iOS`, `top_devices: mobile` |
| API without a session | ✅ 401 |
| `javascript:` URL rejected | ✅ "long_url must use http or https" |
| Reserved and duplicate slugs rejected | ✅ |
| QR code at the documented `/qr/:slug.png` | ✅ 320×320 PNG |
| CSV export | ✅ |
| Dashboard and stats pages | ✅ 200 |
| Docker Compose | ⚪ Not testable here (no Docker daemon). The run said so honestly in its README. |
| `package.json` `engines: node >=24` vs. reality | ⚠️ Inconsistent: everything runs and passes on Node 22 |

## Artifacts ([`../tools/check_artifacts.py`](../tools/check_artifacts.py))

| Check | Result | Detail |
|---|---|---|
| Charter, dossier, parity matrix, provenance, roadmap, README, LICENSE | ✅ | All present |
| ADRs | ✅ | 1 |
| Dossier: evidence tags | ✅ | confirmed 2, inferred 5, memory 3. Honestly tagged. |
| Dossier: sources | ❌ | 3 URLs, no source list |
| Dossier: 8 lenses | ✅ | Headings present, but market and competitors were collapsed into pricing |
| Name avoids the incumbent's mark; non-affiliation line | ✅ | "Not affiliated with Bitly, Inc." |

## Process (from the trace)

| Expected by the skill | What happened |
|---|---|
| Open the research playbook and templates when their phase arrives | ❌ **0 skill reference files read.** The docs were written from SKILL.md alone. |
| Research through eight lenses with primary sources, review mining and the competitive field | ❌ **1 web search, 0 pages fetched.** Identity and concept came from memory (honestly tagged). User pain was "inferred", not researched. No competitive field. |
| Name check: trademarks, domains, packages | ❌ Skipped. The provenance log itself admits "Not exhaustively trademark-cleared". |
| "Just build it" → decide yourself and record assumptions | ✅ The charter lists every assumption and labels the user as not consulted |
| Verify by running the workflow | ✅ Ran the app, walked the flow with curl, and fixed two real bugs it found |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Bitly founded 2008 | ✅ | Public record |
| Free plan: about 5–10 links a month, 2 QR codes, 30-day analytics | ✅ | [Bitly: free plan](https://bitly.com/blog/bitly-free-plan/) |
| Core about $10 a month | ✅ | [SaaSworthy](https://www.saasworthy.com/product/bitly/pricing) |
| Growth "about $35 a month" | ⚠️ True only for monthly billing ($29 billed annually). The billing basis wasn't stated. | [U2L](https://u2l.ai/blog/bitly-pricing-breakdown), [RedirHub](https://www.redirhub.com/blog/bitly-pricing-2026) |
| Premium "about $249 a month" | ⚠️ Not supported by the sources checked ($199 billed annually) | same |
| Enterprise "about $1,500+ a month" | ⚪ Unverified | |
| "Trimly" is a distinct name | ❌ **Wrong.** "Trimly" is a live URL shortener with analytics (trimmly.xyz), an Android app, and several GitHub URL-shortener projects, all in the same category. | [search results](https://www.trimmly.xyz/) |

**Accuracy: 3 of 6 checkable claims fully correct, 2 misleading, 1 wrong** (the name).

## Flaws found

1. **"Just build it" was read as "skip research".** The skill says it removes *checkpoints*, but nothing said the *phases* stay mandatory, and the research depth guidance lived only in a reference file that was never opened.
2. **Reference files are never opened when SKILL.md merely points to them.** A table saying "read it when its phase arrives" wasn't enough.
3. **The name check was skipped.** One search would have shown a direct collision.
4. **Pricing claims didn't state their billing basis**, which makes true numbers look wrong.
5. The parity matrix had no evidence column, so its tier decisions couldn't be traced back to research. That follows from flaw 2: the template was never read.

## Changes made because of this run

- **SKILL.md, workflow:** "**'Just build it' removes checkpoints, never phases.**"
- **SKILL.md, Phase 3:** a **research floor** table inside SKILL.md: minimum sources per mode, including user voice, the competitive field and the name check, so depth doesn't depend on opening the playbook.
- **SKILL.md:** every phase now starts with an explicit "Open …" instruction naming the reference file and template it needs.
- **SKILL.md, Phase 5:** the name check became a concrete procedure: search the name with the category, on GitHub, and in the primary package registry, change the name on a same-category collision, and record the searches in the provenance log.
- **`research-playbook.md`:** pricing claims record the billing basis (monthly or annual), currency and date.
- **Harness:** the fallback copy now excludes dependency folders (the first copy included 135 MB of `node_modules`), and transcripts are gzipped.
