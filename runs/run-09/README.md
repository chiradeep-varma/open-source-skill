# Run 09: deep run, hardware target (Nest thermostat, Brief mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: research and plan only (no code or hardware), headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh) |
| Skill state | v1.0 (commit `94cd81e`): Run 08's fixes applied (`reported` tag, subagent tag audit, thesis anchoring, wedge test) |
| Prompt | `open source the nest thermostat, I want local control without google. Brief mode: research and plan, no code or hardware yet. Make the calls yourself. Put everything in ./project.` |
| Stats | 9.1 min · 47 turns · 45 tool calls · $1.65 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated plan](workspace/project/): [brief](workspace/project/docs/brief.md), [dossier](workspace/project/docs/research/dossier.md) |

## Outcome in one line

**The evidence fix worked, and the device-specific judgment was excellent.** It used honest tags and got the generations right: 1st/2nd gen are orphaned but reflashable, and 4th gen has an official local Matter channel. It also produced careful DMCA reasoning. The only miss is that no ADRs were written, because the skill never said which phases Brief mode includes.

## Did the Run 04 and Run 08 fixes hold?

| Fix | Evidence in this run |
|---|---|
| Pin the device generation (from Run 04) | ✅ The plan is organized around generations: Gen 1/2 (support ended 25 Oct 2025), Gen 4 (Matter), and budget models flagged as not verified |
| Check the device lifecycle first (from Run 04) | ✅ The first searches were "end of support October 25 2025" and "Device Access… local API". `product-types.md` was opened. |
| Evidence stated in chat carries a source (from Run 04) | ✅ The final reply names the blocked domains and says claims are `reported` |
| `reported` tag (from Run 08) | ✅ **confirmed 10, reported 52**. All 10 `confirmed` tags trace to the one page that actually loaded (the NoLongerEvil README), and all other fetches were blocked. |
| Name check (from Runs 05 and 06) | ✅ Seven separate searches for "Homestat" and "Hearthly" |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Google ended support for 1st/2nd-gen Nest Learning Thermostats on 25 Oct 2025 | ✅ | [Google Nest Help](https://support.google.com/googlenest/answer/16233096) |
| NoLongerEvil-Thermostat revives Gen 1/2 via the OMAP DFU exploit and is MIT-licensed | ✅ The dossier hedged "MIT-ish"; it is MIT | [codykociemba/NoLongerEvil-Thermostat](https://github.com/codykociemba/NoLongerEvil-Thermostat), [Hackaday](https://hackaday.com/2025/11/11/nest-thermostat-now-100-less-evil/) |
| The 4th-gen Learning Thermostat is Matter-certified and controllable locally from Home Assistant | ✅ | [Google Store](https://store.google.com/product/nest_learning_thermostat_4th_gen?hl=en-US), [home-assistant/core#130231](https://github.com/home-assistant/core/issues/130231) |
| Initial setup appears to require the Google Home app (flagged as the key open question) | ✅ Correctly identified and correctly left open | [Leios guide](https://www.leios.consulting/guides/nest-thermostat-home-assistant/) |
| "Works with Nest" shut down in 2019 | ✅ | [Home Assistant blog](https://www.home-assistant.io/blog/2019/05/08/nest-data-bye-bye/) |
| "Homestat" is free in the category | ✅ No collision found | search |

**Accuracy: 6 of 6 checked claims correct**, with the uncertain one correctly marked as uncertain.

## Quality review

- ✅ **Legal judgment.** It calls the Gen 1/2 exploit path "a technical-protection-measure circumvention under US DMCA §1201 in the strict sense" and notes that a thermostat-specific exemption was "not verified this session". It recommends a lawyer before wide distribution and doesn't re-derive the exploit, keeping any integration optional and dependent on the existing public project. It rates the Matter path as "materially lower legal risk".
- ✅ **Architecture.** A local-first "thermostat brain" over three interchangeable backends (Matter for Gen 4, reflashed Gen 1/2, ESP32 DIY) instead of a single-hardware hack.
- ✅ **Honest open questions.** Whether Gen 4 commissioning can skip the Google Home app entirely is flagged as needing a hands-on test.
- ❌ **No ADRs.** Runs 07 and 08 (also Brief) wrote 4 and 5. SKILL.md defines Brief as "research and a plan only" without saying that the plan includes Phase 6 design artifacts.

## Flaws found

1. **Brief mode's scope was ambiguous**, so design decisions (backend abstraction, license) were only recorded in the brief, not as ADRs.

## Changes made because of this run

- **SKILL.md, Modes:** Brief now reads "Phases 1–6: research, the plan, guardrails and design (decision records and roadmap), with no code."
