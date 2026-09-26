# Run 06: deep run, small-to-medium target (team scheduler, Prototype mode)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | Deep run: the full workflow, headless, via [`../tools/run_eval.sh`](../tools/run_eval.sh) |
| Skill state | v0.7 (commit `f5d91e0`): Run 05's fixes applied (research floor in SKILL.md, "just build it removes checkpoints, never phases", explicit "open X now", name-check procedure) |
| Prompt | `I want an open-source Calendly for my 6-person consulting firm. I know some Python and we have a small VPS; we all use Google Calendar. Make the calls yourself and just build it (Prototype mode). Put the project in ./project.` |
| Stats | 11.6 min · 85 turns · 83 tool calls · $2.88 |
| Files | [final reply](final.md) · [trace summary](trace.md) · [full transcript](transcript.jsonl.gz) · [generated project](workspace/project/) |

## Outcome in one line

**A genuinely useful prototype ("SlotPilot"): correct time-zone and DST handling, Google Calendar free/busy, 4 ADRs. Research was deeper than Run 05, but it still skipped every reference file, stamped `confirmed` on unfetched search snippets (two of which were wrong), and picked a name that's already taken in the same category.**

## What improved since Run 05

| Signal | Run 05 | Run 06 |
|---|---|---|
| Web searches | 1 | 5, including review mining ("too expensive… per seat") and a name search |
| Pricing billing basis stated | ❌ | ✅ "$10/seat/mo annual ($12 monthly)" |
| Competitive field in the dossier | ❌ | ✅ Three rivals, positioned rather than recommended |
| Charter's "just build it" assumptions | ✅ | ✅ |
| ADRs | 1 | 4, including one written for a bug found in testing |

## Build verification (re-run independently)

| Check | Result |
|---|---|
| `pytest` | ✅ 8/8 pass |
| Slot engine across the US DST change (1 Nov 2026) | ✅ 09:00 EDT → 13:00Z before, 09:00 EST → 14:00Z after |
| Buffers: busy 10:00–10:30 with a 15-minute after-buffer excludes both overlapping slots | ✅ |
| Minimum notice and booking window | ✅ Covered by its tests |
| Re-check at booking time; 409 if the slot was taken | ✅ |
| Concurrent double-booking | ⚠️ A race window: two simultaneous requests can both pass the free/busy check before either writes. Low risk for 6 people, but no lock or unique constraint. |
| Google OAuth flow | ⚪ Needs real Google credentials, so not testable here. The README includes a setup walkthrough. |

## Artifacts ([`../tools/check_artifacts.py`](../tools/check_artifacts.py))

| Check | Result | Detail |
|---|---|---|
| Charter, dossier, parity matrix, provenance, roadmap, README, LICENSE | ✅ | All present |
| ADRs | ✅ | 4 |
| Dossier evidence tags | ✅ | confirmed 10, inferred 4, memory 1. See below: several `confirmed` tags aren't earned. |
| Dossier sources | ❌ | 5 URLs, no source list |
| Non-affiliation line in the README | ❌ Missing |  |
| Name avoids the incumbent's mark | ✅ | "SlotPilot" |

## Process (from the trace)

| Expected by the skill | What happened |
|---|---|
| Open `research-playbook.md` and the dossier template at Phase 3 (now an explicit "open … now" instruction) | ❌ **Still 0 skill reference files read.** The trace confirms v0.7 was loaded, so the instruction was seen and not followed. |
| Research floor: 10–20 searches *and fetches* | ⚠️ 5 searches, **0 pages fetched** |
| `confirmed` means checked against the source | ❌ Claims were tagged `confirmed` from search snippets without opening any page |
| Name check: separate searches for name + category, "<name> app", GitHub, registry | ❌ One combined query (`"slotpilot" OR "openbooker" OR … github open source`) covering only GitHub |
| Provenance accuracy | ⚠️ It says rival READMEs were "skimmed", but no page was fetched; only search snippets were seen |

## Fact-check

| Claim | Verdict | Source |
|---|---|---|
| Standard $10/seat/mo annual ($12 monthly); Teams $16 ($20) | ✅ | [Axis Consulting](https://axisconsulting.io/calendly-pricing-guide/), [Zeeg](https://zeeg.me/en/blog/post/calendly-pricing) |
| Enterprise from $15,000 a year | ✅ | [Orb](https://www.withorb.com/blog/calendly-pricing) |
| Deleting or declining the event in Google Calendar cancels it in Calendly (with automatic sync on) | ✅ | [Calendly Help: cancel a meeting](https://calendly.com/help/how-to-cancel-a-meeting) |
| "Calendly additionally writes buffer time as separate calendar blocks" | ❌ **Wrong.** Calendly doesn't place buffers on connected calendars; users work around it with manual busy blocks. | [Calendly community: buffer in calendar](https://community.calendly.com/how-do-i-40/buffer-in-calendar-191), [Calendly Help: buffers](https://calendly.com/help/how-to-use-buffers) |
| Cal.com is "open-source (AGPLv3 core)", tagged `confirmed` | ❌ **Stale.** Proprietary since April 2026. The cited URL points to a different project. | [It's FOSS](https://itsfoss.com/news/cal-com-goes-proprietary/) |
| "Calendly, Inc." | ❌ Minor: the entity is Calendly LLC | [Calendly: About](https://calendly.com/about) |
| "Ten reps costs $2,400/year" (review quote) | ⚪ The arithmetic matches Teams monthly pricing; the quote is unsourced | |
| "SlotPilot" is free to use | ❌ **Wrong.** At least two booking products already use it (newsletter slot booking at slotpilot.app, and an appointment-booking site) | [slotpilot.app](https://www.slotpilot.app/) |

**Accuracy: 3 correct, 4 wrong, 1 unverified.** The pricing numbers improved, but snippet-based `confirmed` tags hid two wrong claims.

## Flaws found

1. **Reference files are still never opened**, even with explicit "open … now" instructions. The model treats process instructions as optional when the user says "just build it".
2. **The `confirmed` tag is used for search snippets.** Nothing defined what earns `confirmed`, so a snippet counted, and two `confirmed` claims were wrong.
3. **The name check was collapsed into one OR query**, and it only looked on GitHub.
4. **No non-affiliation line.** That requirement lives in the README template and in Phase 5 prose, and neither was acted on.

## Changes made because of this run

- **Checkable process log.** Every run now keeps `docs/process-log.md`, one entry per phase recording sources fetched, skill files opened, the name-check queries with results, and the checks run. The build doesn't start until the log shows the research floor was met. Output requirements get followed where process instructions don't, and the log also gives users a transparent record.
- **`confirmed` is defined in SKILL.md**: "you opened the source page itself and it says this". A search snippet is a lead, not a confirmation. The research floor now requires fetched pages, not only searches.
- **Name check**: each location is a separate search (a combined OR query doesn't count), and the check includes a general web search for the name with the category.
- **Phase 7 quality bar** now lists the README's required lines: non-affiliation line, honest status, license.
