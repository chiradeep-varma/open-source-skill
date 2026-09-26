# Run 02: first-reply battery (skill v0.2)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | First-reply test (headless `claude -p`, skill installed as a plugin) |
| Skill state | v0.2: Run 01's identity fixes applied. The skill still recommended checking existing open-source alternatives. |
| Prompts | `make me an open source bolt` (×2) · `yo build me an open source version of Arc, i'm sick of it` · `I want an open-source Calendly for my 6-person consulting firm. I know some Python and we have a small VPS. Can you build it?` |
| Raw outputs | [bolt-a](outputs/bolt-a.md) · [bolt-b](outputs/bolt-b.md) · [arc](outputs/arc.md) · [calendly](outputs/calendly.md) |

## Results

| Prompt | Check | Result |
|---|---|---|
| Bolt (a) | Opens with identity; names the other Bolts | ❌ Went straight to bolt.new with no mention of the other products |
| Bolt (b) | Opens with identity; names the other Bolts | ✅ "I'm assuming you mean Bolt.new… If you actually meant Bolt the ride-hailing app or Bolt the checkout/fintech company, let me know" |
| Arc | States its assumption about which Arc | ✅ "Assuming you mean Arc Browser… Correct me if you meant something else" |
| Arc | Notes that Arc is built on Chromium | ✅ |
| Calendly | Identifies without needless questions | ✅ |
| Calendly | Asks few, high-leverage questions with defaults | ✅ Four questions, each with a recommendation |

## Fact-check

| Claim in output | Verdict | Source |
|---|---|---|
| Arc entered maintenance mode in May 2025 | ✅ Correct (announced 27 May 2025) | [gHacks](https://www.ghacks.net/2025/05/27/arc-browser-has-been-discontinued-but-the-companys-building-a-new-browser-dia/) |
| Atlassian acquired The Browser Company for $610M | ✅ Correct (announced 4 Sep 2025, closed 21 Oct 2025) | [CNBC](https://www.cnbc.com/2025/09/04/atlassian-the-browser-company-deal.html) |
| Zen Browser is Firefox-based and MPL-2.0 | ✅ Correct | [zen-browser/desktop LICENSE](https://github.com/zen-browser/desktop/blob/dev/LICENSE) |
| Easy!Appointments is AGPLv3 | ❌ **Wrong.** It's GPL-3.0. | [easyappointments](https://github.com/alextselegidis/easyappointments) |
| Cal.com is AGPLv3 | ❌ **Stale.** Cal.com moved to a proprietary license in April 2026. | [It's FOSS](https://itsfoss.com/news/cal-com-goes-proprietary/) |

## Flaws found

1. **Identity is still skipped half the time** (bolt-a). The rule was right, but it was a process step, and process steps get skipped when the model feels sure.
2. **License facts asserted from memory were wrong** (Easy!Appointments, Cal.com).
3. **Self-audit.** The skill's *own* `legal-and-licensing.md` also listed Cal.com as an AGPL example, the same stale fact. (Found during this fact-check and fixed after Run 04; see that log.)

## Changes made because of this run

- **Output requirement added**: "**Your first reply opens with identity.** Give the fingerprint of the product you're working on, marked as confirmed or assumed. If other active products share the name, add a line naming them."
- **Step 2**: "Do this even when you feel sure which product is meant, because that feeling is exactly what this step tests."
