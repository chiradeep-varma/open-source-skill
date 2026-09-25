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

Deep runs are added as they complete.
