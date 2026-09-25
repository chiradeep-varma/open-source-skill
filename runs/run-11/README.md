# Run 11: confirmation run, fresh target (Trello-style board, Prototype mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: full workflow, headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh). The final confirmation of the v1.2 fixes on a target the skill hasn't seen. |
| Skill state | v1.2 (commit `4809705`): Run 10's fixes applied (required core-logic tests, honest floor reporting, dated sources, sound-alike name check, no hardcoded secrets) |
| Prompt | `Build me an open-source Trello for my 8-person team that we can self-host. Make the calls yourself and just build it (Prototype mode). Put the project in ./project.` |
| Stats | 27.0 min · 206 turns · 203 tool calls · $7.56 (a larger build: Next.js, Prisma, Postgres, auth, drag-and-drop, importer) |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated project](workspace/project/) |

## Outcome in one line

**Every v1.2 fix held: 16 passing tests, refuses to start without a secret, honest tags, all README lines present. It's also the most complete build of any run, with a Trello importer, headless-browser verification that caught a real race bug, CI and community files. The remaining weakness is naming: "Corkboard" is a common word, and the 2-search check missed existing board apps that use it.**

## Did the v1.2 fixes hold?

| Fix (from Run 10) | Evidence |
|---|---|
| Automated tests for core logic; the test command must pass | ✅ `npm test` → **16/16 pass** (Vitest: ordering math and the Trello importer). Re-run independently. |
| Refuse to start without required secrets | ✅ `src/auth.ts`: "AUTH_SECRET is not set. Refusing to start without a session secret" |
| Never write "met" for an unmet floor item | ⚠️ Mostly. The log names the blocked fetches and says no archive lookup was tried, then concludes "Floor met given the environment constraint above". That's hedged, not a flat "met". |
| Dated sources for volatile facts | ✅ Pricing and license facts are current (see the fact-check) |
| Sound-alike and category name check | ⚠️ 2 searches instead of the 4 listed. It missed same-category uses of "Corkboard" (see below). |

## Build verification

| Check | Result |
|---|---|
| `npm test` | ✅ 16/16 (re-run independently) |
| Lint, typecheck, `next build` | ✅ Reported by the run and recorded in its process log |
| Browser end-to-end (login → board → lists → cards → drag-and-drop → reload persists → card detail) | ✅ Run by the agent with Playwright, screenshots taken. It found and fixed a stale-closure race in label creation. |
| Trello JSON import (closed lists and cards skipped; labels, checklists and due dates kept) | ✅ Tested by the agent with a sample export; wrapped in a DB transaction |
| Secrets | ✅ Refuses to start without `AUTH_SECRET` |
| Docker | ⚪ No daemon in the sandbox. The agent checked the standalone build layout against the Dockerfile instead, and said so. |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Free plan: 10 collaborators, 250 automation runs a month, capped boards; Standard about $5 and Premium about $10 per user per month | ✅ | [Costbench](https://costbench.com/software/project-management/trello/), [tech.co](https://tech.co/project-management-software/trello-review) |
| Trello originated at Fog Creek Software (later Glitch) | ✅ | Public record |
| Planka relicensed MIT → AGPL-3.0 → a proprietary "Community License" with 2.0, so it's no longer OSI-approved | ✅ | [Planka Community License](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20Community%20License%20DE.md), [ProHoster](https://prohoster.info/en/blog/novosti-interneta/proekt-planka-perehodit-na-nesvobodnuyu-liczenziyu) |
| Wekan is MIT, built on Meteor and MongoDB | ✅ | Public record |
| "Corkboard" has only generic, metaphorical uses | ⚠️ **Incomplete.** corkboard.me was a personal Kanban board product, and "Cork – Virtual Corkboards" is an App Store app with Kanban templates. | [corkboard.me review](https://associationforsoftwaretesting.org/2010/12/02/corkboard-me-your-personal-kanbangtdscrumwhatever-board/), [App Store: Cork](https://apps.apple.com/us/app/cork-virtual-corkboards/id6791820387?mt=12) |

**Accuracy: 4 of 4 factual claims correct**, plus one incomplete name check.

## Flaws found

1. **Common-word names keep colliding.** Across all deep runs, every common-word name hit an existing product: "Trimly" (Run 05), "SlotPilot" (Run 06), "Corkboard" (Run 11). The coined names came back clean: "Fenline" (07), "Vinca" (08), "Homestat" (09). "Formstead" (10) was clean but sounded like a category leader.
2. **Skill files weren't opened in this run**, although Runs 07–10 opened them. The artifacts were still complete, because SKILL.md now carries the essential requirements itself.

## Changes made because of this run

- **Naming (SKILL.md, Phase 5):** "Prefer coined names over common words. In these runs, every common-word name (Trimly, SlotPilot, Corkboard) already belonged to a product in the same category, while coined names came back clean."
