# Run 03: first-reply battery (skill v0.4, build-only)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | First-reply test (headless `claude -p`, skill installed as a plugin) |
| Skill state | v0.4: build-only refocus applied (see Run 02b) |
| Prompts | `make me an open source bolt` · `yo build me an open source version of Arc, i'm sick of it` · the Calendly prompt from Run 02 |
| Raw outputs | [bolt](outputs/bolt.md) · [arc](outputs/arc.md) · [calendly](outputs/calendly.md) |

## Results

| Prompt | Check | Result |
|---|---|---|
| Bolt | Opens with identity and names the other Bolts | ✅ "Other products named 'Bolt' exist (Bolt.eu ride-hailing, Bolt.com fraud/checkout fintech, Bolt CMS)… Say so now if you meant one of those instead." |
| Bolt | Build-focused; no substitutes suggested | ✅ Went straight to the build: three sandbox strategies to replace the proprietary runtime, a pluggable LLM, a wedge, stack, name and license |
| Bolt | Questions carry recommended answers | ✅ Seven questions, each with a default and "just reply 'go with your recommendations'" |
| Arc | Build-focused; no substitutes | ⚠️ **Partial.** It proposed a build, but led with "there's already a mature open-source Arc-alike called **Zen Browser**…" before planning. |
| Arc | Calls identity "assumed" unless confirmed | ❌ "Confirmed target" |
| Calendly | Build-focused | ⚠️ **Partial.** It ended by proposing a lean Python build, but opened with "Quick landscape check (so I don't rebuild something that already exists)" and justified the build against Cal.com. |

## Fact-check

| Claim in output | Verdict | Source |
|---|---|---|
| bolt.new launched Oct 2024 and runs apps client-side via WebContainers | ✅ Correct | [stackblitz/bolt.new](https://github.com/stackblitz/bolt.new) |
| WebContainers is proprietary | ✅ Correct in substance (commercial license needed for for-profit production) | [bolt.diy README](https://github.com/stackblitz-labs/bolt.diy) |
| "Arc dropped Windows support in 2024" | ❌ **Wrong.** Arc *launched* on Windows on 30 April 2024. | [TechCrunch](https://techcrunch.com/2024/04/30/the-browser-company-releases-arc-for-windows/) |
| Cal.diy is an MIT fork of Cal.com for personal, non-production use | ✅ Correct | [calcom/cal.diy](https://github.com/calcom/cal.diy) |
| Cal.com is AGPL-3.0 | ❌ **Stale.** Proprietary since April 2026. | [Slashdot](https://yro.slashdot.org/story/26/04/15/1913213/calcom-is-going-closed-source-because-of-ai) |
| Calendly Teams costs about $16–20 per seat per month | ✅ Correct ($16 billed annually, $20 monthly) | [Zeeg pricing guide](https://zeeg.me/en/blog/post/calendly-pricing) |

## Flaws found

1. **The model's habit of checking "does this already exist?" survived the refocus.** Removing the instruction wasn't enough, because it's the model's default behavior. It needed an explicit instruction pointing the other way.
2. **A factual error about platform history** (Arc on Windows), asserted without a source.

## Changes made because of this run

- Principle 5 gained explicit guidance:
  - Don't open with a scan of existing alternatives.
  - Don't frame research as checking whether something "already exists".
  - Don't justify the build against other projects.
  - Rivals belong in the dossier's market lens and the brief's positioning section.
