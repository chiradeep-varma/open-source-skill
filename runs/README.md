# Evaluation runs

Every test of this skill is logged here in full: the prompt, the skill version, the raw output, a fact-check of what it claimed, the flaws found, and the changes those flaws caused. Runs happen one after another, and each run's fixes are applied before the next run starts, so the log shows how the skill improved and why.

## Method

- **Harness.** Claude Code runs headless (`claude -p`) with the skill installed as a plugin, via [`tools/run_eval.sh`](tools/run_eval.sh). Deep runs save the full event stream (`transcript.jsonl`), a trace summary (`trace.md`: skill files read, searches, fetches, files written, commands), the final reply (`final.md`) and the generated workspace.
- **Run types.**
  - *First-reply* runs stop at the skill's first reply, since the skill asks questions before building. They test identity, questioning and routing.
  - *Deep* runs pre-answer the checkpoints ("make the calls yourself") so the whole workflow runs: research, synthesis, guardrails, design, and, in Prototype mode, the build.
- **Checks per run.**
  1. **Behavior**: assertions from [`../evals/evals.json`](../evals/evals.json) plus run-specific checks.
  2. **Accuracy**: a sample of factual claims checked against primary or reputable sources, each with a verdict and a link.
  3. **Artifacts** (deep runs): are the charter, dossier, parity matrix, brief, provenance log, ADRs and README present and complete?
  4. **Build** (Prototype runs): does it install, do the tests pass, does the core workflow work when actually exercised?
  5. **Legal hygiene**: distinct name, non-affiliation line, no copied text or assets, provenance kept.
- **Fix policy.** Fixes generalize rather than patch a single prompt. Each change is recorded in the run's log.

## Summary

| Run | Skill | Type | Scale | Target(s) | Key flaws found | Accuracy (checked claims) |
|---|---|---|---|---|---|---|
| [01](run-01/) | v0.1 | First reply | n/a | Bolt, Notion (replica request) | Silently picked a namesake and called it "confirmed" | 3/3 checked |
| [02](run-02/) | v0.2 | First reply | n/a | Bolt ×2, Arc, Calendly | Identity skipped in 1 of 2 Bolt runs; license facts from memory were wrong | 3/5 |
| [02b](run-02b/) | v0.3 | First reply | n/a | Bolt ×3, own-project release | Fabricated user intent ("as you specified"); owner redirected the skill to build-only | not scored |
| [03](run-03/) | v0.4 | First reply | n/a | Bolt, Arc, Calendly | The model's "does it already exist?" habit survived the refocus; platform-history error | 4/6 |
| [04](run-04/) | v0.5 | First reply | n/a | Arc, Calendly, Nest | Evidence standard didn't reach chat replies; no device sub-scope; stale fact in the skill's own legal reference | 2/7 |
| [05](run-05/) | v0.6 | Deep | Small | Bitly-style link shortener (Prototype) | Research collapsed to 1 search under "just build it"; 0 reference files opened; name collided with a live shortener; the build itself fully worked | 3/6 (+2 misleading, 1 wrong) |
| [06](run-06/) | v0.7 | Deep | Small–medium | Calendly-style team scheduler (Prototype) | Reference files still never opened; `confirmed` stamped on unfetched snippets (2 wrong); name collision again; no non-affiliation line. Build: DST-correct, 8/8 tests | 3/8 (4 wrong, 1 unverified) |
| [07](run-07/) | v0.8 | Deep | Medium | Linear (Brief) | Best so far: 22 searches, 8 skill files, 12-search name check, honest process log. Minor tier-gating contradiction; research playbook still unopened; primary sources blocked by the sandbox (handled well) | 7/8 (1 partly wrong, 1 unverified) |
| [08](run-08/) | v0.9 | Deep | Big | Figma (Brief) | Research thorough and every checked fact correct, but 43 claims tagged `confirmed` with only 2/21 fetches succeeding (subagents); thesis anchored to a rival; "wedge" was most of the core | 8/8 (tags inflated) |
| [09](run-09/) | v1.0 | Deep | Hardware | Nest thermostat (Brief) | `reported` fix worked (10 confirmed all earned, 52 reported); generations and lifecycle handled; careful DMCA §1201 reasoning; no ADRs (Brief scope ambiguous) | 6/6 |
| [10](run-10/) | v1.1 | Deep (verification) | Small–medium | Typeform-style form builder (Prototype) | Run 05/06 fixes held (templates, name check, process log, honest tags); app works incl. path-aware branching; but no automated tests (broken `npm test`), log claimed floor "met" with 0 fetches, stale pricing, sound-alike name | 2/4 (1 stale, 1 name risk) |
| [11](run-11/) | v1.2 | Deep (confirmation) | Medium | Trello-style board (Prototype) | v1.2 fixes held (16/16 tests, refuses to start without a secret, honest tags, README lines); most complete build; common-word name "Corkboard" check incomplete; skill files unopened | 4/4 (+1 incomplete name check) |
| [12](run-12/) | v1.4 | Deep (re-run of 05) | Small | Bitly-style link shortener (Prototype) | Owner's v1.4 changes held: random codename, no tiers, UI research, a design direction, a screenshot review that fixed a real bug. But the review was too lenient (card kit, one-point chart, phone overflow, capitalized URLs), and the only run path was Docker | not scored (design and run-path check) |
| [13](run-13/) | v1.5 | Deep (launcher flow) | Small | Linktree-style page (Prototype) | The launcher flow worked end to end: projects folder, `osa setup`, valid `osa.json`, a pristine copy started with one command, 19/19 tests. But the hand-off skipped the launcher, and there was no written design review (`ui-design.md` unopened). LICENSE and CoC were typed from memory and wrong in substance (the AGPL lost a §13 sentence). Also a long-word overflow and a README claim the code contradicts | 3/4 (1 currency mix-up, +1 lookalike source) |

## What the runs taught

The skill's biggest problems weren't missing knowledge. They were **process instructions that the model skipped when told to "just build it"**. What fixed them was turning each process step into something **visible in the output**.

| Problem | Instruction that didn't work | Change that did |
|---|---|---|
| Namesakes silently picked ("Bolt") | "Search for collisions" (a process step) | "**Your first reply opens with identity**" (an output rule), plus "never call it confirmed unless…" (Runs 01–03) |
| Research skipped under "just build it" | A research-depth table in a reference file | A research floor inside SKILL.md, plus a **process log** that must show the floor was met (Runs 05–07) |
| Search snippets tagged `confirmed` | A definition of `confirmed` | A new, honest **`reported`** tag. The model needed a truthful label for "seen in search results, not opened" (Runs 06, 08 → fixed in 09) |
| Research subagents inflating tags | (none) | Pass the tag rules to subagents and **audit tags against actual fetches before merging** (Run 08) |
| "Does it already exist?" habit | Removing the instruction | An explicit contrary instruction: don't open with alternatives, don't justify the build against others, anchor the thesis in the incumbent's users (Runs 03, 08) |
| Wrong facts in chat (Arc "dropped Linux", Nest "can't be reflashed") | The evidence standard, dossier only | The evidence standard now applies to **what you tell the user** (Run 04) |
| Names colliding (Trimly, SlotPilot, Corkboard) | "Check the name" | Separate searches per location, a sound-alike check, and prefer coined names (Runs 05, 06, 10, 11). **Superseded in v1.4 by an owner decision:** no name research at all. Projects get a random codename (`scripts/codename.py`), because what users call it later is up to them. |
| No tests in a working prototype | "Tests on core logic" in the quality bar | The **passing test command must appear in the process log** before Phase 7 counts as done (Run 10 → held in 11 and 13) |
| A lenient UI self-review | "Review the screenshots against the slop list" | A **written review from a template**: three weaknesses per screen first, a mechanical overflow check, four data sets including long values, and a claims check (Runs 12, 13) |
| A requirement that lived only in a reference file (the written review) | "Open `ui-design.md` now" | Put what a run must produce **in SKILL.md and a template**. Runs read the templates every time; they open reference files inconsistently (Run 13 read all eight templates and skipped `ui-design.md`). |
| Legal texts typed from memory when fetches were blocked | "Fetch the official text rather than writing it from memory" | A bundled **`fetch_text.py`** that works where WebFetch doesn't, with a placeholder as the only fallback. The from-memory AGPL had lost a sentence from §13 (Run 13). |
| The launcher hand-off skipped | Hand-off bullets at the end of Phase 8 ("Release") | Its own section with a **message shape that leads with the launcher**, required for every mode that builds (Run 13) |

**Self-audit.** The fact-checks also caught a stale fact in the skill's *own* legal reference. Cal.com was listed as an AGPL example, but it went proprietary in April 2026. It's fixed, and license examples now carry an "as of" date.

## Accuracy trend (deep runs)

| Run | Checked claims correct | Main source of error |
|---|---|---|
| 05 | 3/6 | Memory, pricing basis, name |
| 06 | 3/8 | Snippets tagged `confirmed`, a stale license, name |
| 07 | 7/8 | One tier-gating contradiction |
| 08 | 8/8 | Content correct, but tags inflated |
| 09 | 6/6 | None |
| 10 | 2/4 | Stale pricing snippets, sound-alike name |
| 11 | 4/4 | Incomplete name check |
| 13 | 3/4 | A funding figure in the wrong currency; a lookalike domain cited as the incumbent |

## Known limitations of this evaluation

- **This sandbox blocked most primary sites** (vendor sites, GitHub pages, G2, web.archive.org). Most research ran on search snippets. The skill handled that honestly from Run 07 on, but the `confirmed` path was rarely exercised. Runs with open web access should show more `confirmed` evidence.
- **Headless runs can't answer questions**, so the checkpoints and the grilling after the first reply were tested only through "make the calls yourself". Runs 01–04 test the first reply itself.
- **Docker, OAuth and real hardware couldn't be exercised** here. Those parts were verified only by the agents' own reasoning and file checks.
- **Reference files are opened inconsistently** (Runs 07–10 and 12 yes; 05, 06, 11 and 13 no, or only some). SKILL.md and the templates therefore carry every requirement a run must meet; the reference files add depth.
- **The launcher's macOS and Windows paths** (`.command`, `.cmd`, `open`, `taskkill`) haven't been exercised; every launcher run so far was on Linux.
- Each deep run is a single sample, so a behavior that passed once may still vary.
