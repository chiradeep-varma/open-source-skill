# Run 10: verification run, fresh target (Typeform-style form builder, Prototype mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: full workflow, headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh). This is the same scenario where Runs 05 and 06 skipped research ("just build it", Prototype), used here to verify the fixes on a target the skill hasn't seen. |
| Skill state | v1.1 (commit `bcc8900`) |
| Prompt | `Our volunteer nonprofit pays for Typeform just to run signup forms and a couple of surveys. Build us an open-source version we can self-host on a cheap VPS. Make the calls yourself and just build it (Prototype mode). Put the project in ./project.` |
| Stats | 11.2 min · 87 turns · 85 tool calls · $2.90 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated project](workspace/project/) |

## Outcome in one line

**The Run 05/06 fixes hold: templates opened, a real name check, a process log, honest `reported` tags, and all the README lines. The app ("Formstead") works end to end, including path-aware branching. New flaws: no automated tests (and a `npm test` script that fails), a process log that claims the research floor was "met" when every fetch was blocked, stale pricing from old snippets, and a name check that missed a sound-alike in the category.**

## Did earlier fixes hold? (Prototype mode, same scenario as Runs 05 and 06)

| Fix | Run 05 | Run 06 | Run 10 |
|---|---|---|---|
| Skill files opened | 0 | 0 | ✅ 6 (all templates) |
| Research before building | 1 search | 5 searches, 0 fetches | 9 searches, 5 fetch attempts (all blocked by the sandbox) |
| Honest tags | honest, sparse | `confirmed` misused | ✅ all claims `reported`, with an access note |
| Name check as separate searches | ❌ | ❌ one OR query | ✅ 3 separate searches (but see below) |
| Non-affiliation line and README lines | ✅ | ❌ | ✅ |
| Process log | n/a | n/a | ✅ present, but with a wrong self-assessment (see below) |
| License file | ✅ MIT | ✅ MIT | ✅ AGPL-3.0-or-later |

## Build verification (re-run independently)

| Check | Result |
|---|---|
| `npm test` | ❌ **Fails: "Could not find 'test/'".** The script exists; the tests don't. |
| Admin login; admin pages without a session | ✅ 302 → `/admin`; 302 → `/admin/login` |
| Create a form, add 4 questions (short text, yes/no, long text), add a branching rule, publish | ✅ |
| Public form renders | ✅ 200 |
| Submit as a driver (all questions) | ✅ Redirects to the thanks page |
| Submit as a non-driver: the branching rule skips a *required* question | ✅ Accepted. Validation follows the visited path, which is correct. |
| Missing required answer; invalid yes/no value | ✅ Both 400 |
| Honeypot-filled bot submission | ✅ Silently dropped (not in the CSV) |
| CSV export | ✅ 2 rows, correct columns, skipped answer left blank |
| Draft forms not public | ✅ 404 |
| Session cookie | ✅ `httpOnly`, `sameSite: lax` (mitigates the missing CSRF tokens on admin POSTs) |
| Secrets | ⚠️ `SESSION_SECRET` falls back to a hardcoded `'dev-secret-change-me'` if unset. (`ADMIN_PASSWORD` correctly has no default.) |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Founded 2012 in Barcelona by Robert Muñoz and David Okuniev; $135M Series C in 2022 | ✅ | [Formbricks: Typeform pricing and history](https://formbricks.com/blog/typeform-pricing) |
| Free plan cut to 10 responses a month | ✅ (Feb 2026) | [PricePulse](https://www.getpricepulse.com/companies/typeform-pricing.html), [Formbricks](https://formbricks.com/blog/typeform-pricing) |
| Basic $25, Plus $50, Business $83 per month, billed annually | ❌ **Stale.** 2026 sources show $28, $56 and $91 billed annually. The old figures came from older snippets. (Honestly tagged `reported`.) | [FormNX](https://formnx.com/typeform-pricing), [Koji](https://www.koji.so/blog/typeform-pricing-2026) |
| "Formstead" has no collision | ⚠️ No exact match, but it sounds close to **Formstack**, a major form builder in the same category | [formstack.com](https://www.formstack.com/) |

**Accuracy: 2 correct, 1 stale, 1 name risk.**

## Flaws found

1. **No automated tests, and a broken test script.** Runs 05 and 06 wrote tests; this one verified by hand with curl only. The quality bar in SKILL.md says "tests on core logic", but nothing checks it.
2. **The process log overstated compliance.** It says "Floor met for Prototype mode (6 searches…)" when the floor requires fetched pages and every fetch was blocked. Run 07, in the same situation, correctly wrote "partially met".
3. **Stale pricing from snippets.** When facts come from search snippets, older articles win unless the source date is considered.
4. **The name check missed sound-alikes of major brands in the category.** The legal reference covers sound-alikes, but the SKILL.md procedure didn't.
5. **An insecure fallback for a required secret.**

## Changes made because of this run

- **Phase 7:** "Write automated tests for the core logic (the rules that make the product work, such as branching, validation and slot computation); walking through by hand doesn't replace them." The process log must also record the test command and its result, and Phase 7 isn't done until it passes.
- **Process log:** "If any floor item wasn't met, including because the environment blocked it, say 'not met' and why. Never 'met'."
- **Evidence standard:** for facts that change often (prices, limits, licenses), prefer sources dated this year and record each source's date.
- **Naming:** also compare the name with the category's major brands for sound-alikes (the example given is "Formstead" vs. "Formstack").
- **Safe defaults (Phase 6):** refuse to start without required secrets instead of falling back to a hardcoded value.
