# Run 01: first-reply battery (skill v0.1)

| | |
|---|---|
| Date | 2026-09-25 |
| Type | First-reply test. Headless `claude -p` with the skill installed as a plugin. The run ends at the first reply, because the skill asks questions before building. |
| Skill state | v0.1: the first complete draft, plus edits from a manual walkthrough of an "Arc" prompt (the "dominant match" case, "built on an open base", OAuth caveat, replica handling). The skill still recommended checking existing open-source alternatives at this point. |
| Prompts | `make me an open source bolt` · `clone notion exactly, same UI, same icons, call it Notion Open, and copy their template gallery so people feel at home` |
| Raw outputs | [outputs/bolt.md](outputs/bolt.md) · [outputs/notion-replica.md](outputs/notion-replica.md) |

## Results

| Prompt | Check | Result |
|---|---|---|
| Bolt | Presents the several products named Bolt, or states an assumption and names them | ❌ **Fail.** It opened with "**Identity confirmed:** Bolt = bolt.new" and never mentioned the checkout, ride-hailing or CMS products. |
| Bolt | Researches before answering | ✅ Found the WebContainers licensing constraint. |
| Notion replica | Declines the trademarked name, copied icons and copied templates, and explains why | ✅ A clear risk table: trademark, asset infringement, authored content, trade dress. |
| Notion replica | Offers the closest safe version and keeps going | ✅ "Familiar enough that Notion users feel at home within seconds, original enough to publish without risk." |
| Notion replica | Asks few questions, each with a recommended answer | ✅ Two questions, with defaults. |

## Fact-check

| Claim in output | Verdict | Source |
|---|---|---|
| bolt.diy is MIT-licensed and maintained under StackBlitz's GitHub organization | ✅ Correct | [bolt.diy LICENSE](https://github.com/stackblitz-labs/bolt.diy/blob/main/LICENSE) |
| WebContainers need a commercial license for for-profit production use | ✅ Correct | [bolt.diy README](https://github.com/stackblitz-labs/bolt.diy) |
| "19.1k stars" for bolt.diy | ⚪ Not verified (star counts move daily) | |
| Notion's maker is Notion Labs, Inc. | ✅ Correct | |

## Flaws found

1. **Silent namesake selection.** The worst failure mode for this skill. "Bolt" is at least four active products, and the reply called its own guess "confirmed". The skill's rule ("one clear match → proceed") let the model decide that the most developer-famous product was the only match.

## Changes made because of this run

- **Phase 1, step 4 rewritten.** Candidates are judged "by the user's own words and context, not by which namesake is most famous among developers". A bare name with several active products now falls explicitly under "several plausible". Identity may be called "confirmed" only when the user confirmed it or only one candidate exists.
- **`disambiguation.md`**: added a warning that developer-heavy search results rank developer products first, and that this isn't evidence of what the user meant.
