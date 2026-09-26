# Run 04: first-reply battery (skill v0.5)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | First-reply test (headless `claude -p`, skill installed as a plugin) |
| Skill state | v0.5: Run 03's "don't open with a scan" guidance applied |
| Prompts | `yo build me an open source version of Arc, i'm sick of it` · the Calendly prompt · `open source the nest thermostat, I want local control without google` |
| Raw outputs | [arc](outputs/arc.md) · [calendly](outputs/calendly.md) · [nest](outputs/nest.md) |

## Results

| Prompt | Check | Result |
|---|---|---|
| Arc | States its assumption and names other Arcs | ✅ "I'm assuming you mean Arc, the desktop browser… not Paul Graham's Arc programming language, ArcGIS, or Arc.dev" |
| Arc | Build-focused; no upfront competitor notice | ✅ It opens with identity and questions. Existing browsers appear only as examples of *how* shells are built on engines. |
| Arc | Asks what "sick of it" means | ✅ Question 1, with a default guess |
| Calendly | Build-focused throughout | ✅ No mention of other projects. It moved straight to a plan. |
| Calendly | Questions with defaults; flags hard parts | ✅ Calls calendar sync "the single hardest technical part", and gives a Django rationale |
| Nest | Several build paths; DRM warning; Home Assistant, ESPHome, Matter | ✅ |
| Nest | Pins the sub-scope (which generation) | ❌ "No naming collision here — it's the one smart thermostat with that name." Nest has four Learning Thermostat generations plus other models, and **the generation decides what's possible** (see the fact-check). |

## Fact-check

| Claim in output | Verdict | Source |
|---|---|---|
| Arc maintenance mode since May 2025; Atlassian acquisition closed Oct 2025 | ✅ Correct | [Android Authority](https://www.androidauthority.com/arc-browser-development-ends-3561650/) |
| "Arc dropped Linux entirely" | ❌ **Wrong.** Arc never supported Linux. | [SupaSidebar status](https://supasidebar.com/blog/arc-browser-windows-linux-status-2026) |
| "macOS only (like Arc)" | ❌ **Wrong.** Arc has been on Windows since April 2024. | [TechCrunch](https://techcrunch.com/2024/04/30/the-browser-company-releases-arc-for-windows/) |
| Zen Browser listed among "Chromium-based shells" | ❌ **Wrong.** Zen is a Firefox fork. | [Wikipedia: Zen Browser](https://en.wikipedia.org/wiki/Zen_Browser) |
| Calendly at "~$10–12/user/month for the tiers a small firm would actually need" | ⚠️ **Misleading.** Standard is $10; the Teams plan a firm needs for shared scheduling is $16 per seat, billed annually. | [Zeeg pricing guide](https://zeeg.me/en/blog/post/calendly-pricing) |
| Nest "2nd-gen onward have a locked, signed bootloader… that door is closed" | ❌ **Wrong.** 1st and 2nd-gen units can be reflashed. The open-source NoLongerEvil project (Nov 2025) does exactly that, after Google ended support for those generations on **25 Oct 2025**. | [Google Nest Help](https://support.google.com/googlenest/answer/16233096), [Hackaday](https://hackaday.com/2025/11/11/nest-thermostat-now-100-less-evil/) |
| "Google shut off the old local API in 2019" | ❌ **Wrong.** What shut down (31 Aug 2019) was the *cloud* "Works with Nest" API, later replaced by the Device Access / SDM API. | [Home Assistant blog](https://www.home-assistant.io/blog/2019/05/08/nest-data-bye-bye/) |

**Accuracy: 2 of 7 checked claims correct.** Every error was a fact stated from memory in the first reply, with no source attached.

## Flaws found

1. **The evidence standard didn't reach chat replies.** The skill required sources and tags in the *dossier*, and the model treated the first reply as exempt. Confident platform, pricing and hardware facts were wrong, and they would have misdirected the charter.
2. **Missing sub-scope for devices.** The generation question was skipped, yet it is the single fact that decides which build path is open.
3. **Self-audit (carried from Run 02).** The skill's legal reference cited Cal.com as an AGPL project. That's stale since April 2026.

## Changes made because of this run

- **Principle 2** now covers chat: "State status, dates, prices, supported platforms, licenses and 'what it's built on' only from a source you just checked, and link it. Otherwise, say plainly that it comes from memory."
- **Phase 1, step 5**: for devices, also pin the generation or model.
- **Phase 1**: "Never attribute a choice to the user that they didn't make." (This fixes the Run 02b flaw.)
- **`product-types.md` (hardware)**: new "Check the lifecycle first" step. End-of-support events create both a motive and, often, a legitimate path to reflash hardware the user owns.
- **`legal-and-licensing.md`**: removed Cal.com from the AGPL examples, added a "(as of September 2026)" date, and added Cal.com's April 2026 move to a proprietary license to the relicensing history, with a reminder to re-verify licenses.
