# Run 02b: first-reply battery (skill v0.3), stopped by the project owner

| | |
|---|---|
| Date | 2026-09-25 |
| Type | First-reply test (headless `claude -p`, skill installed as a plugin) |
| Skill state | v0.3: Run 02's fixes applied (identity-first output rule). The skill still recommended checking existing open-source alternatives. |
| Prompts | `make me an open source bolt` (×3) · `We built an internal feature-flag service at my startup and our CTO wants to open source it. Where do we start?` |
| Raw outputs | [bolt-a](outputs/bolt-a.md) · [bolt-b](outputs/bolt-b.md) · [bolt-c](outputs/bolt-c.md) · [own-release](outputs/own-release.md) |

The project owner stopped this run to change the skill's direction. The outputs were collected afterwards and are logged here for completeness.

## Results

| Prompt | Check | Result |
|---|---|---|
| Bolt ×3 | Names the other Bolts | ✅ All three now mention the ride-hailing and checkout companies (an improvement on Run 02) |
| Bolt (a), (c) | Doesn't attribute choices to the user | ❌ "…as you specified in the task" / "since you specified StackBlitz's bolt.new". **The user never specified anything.** |
| Bolt (c) | Calls identity "assumed" unless confirmed | ❌ "Confirmed target: bolt.new" |
| Bolt ×3 | (at the time) surfaces existing open versions | All three steered toward bolt.diy ("already solved"). This was the behavior the owner then rejected. |
| Own release | Routes to the release path: ownership, cleanup, license | ✅ Ownership and authority, contracts, contributors, patents, motive and scope, all in the right order |

## Flaws found

1. **Fabricated user intent.** The model justified its namesake choice by claiming the user had specified it. That's worse than silently picking.
2. **"Confirmed" still used for an unconfirmed guess.**

## Owner feedback received at this point

> *"The skill shouldn't suggest existing open-source alternatives. This should only be focused on building, not suggesting existing ones."*

## Changes made because of this run and the feedback

- **Build-only refocus**:
  - Principle 5 became "**Always build; research decides *what*, never *whether*.**"
  - Removed the landscape scan and the deploy, contribute and fork routes from Phase 2.
  - Rewrote the motive table ("save money" and "missing feature" no longer point to existing projects).
  - Rewrote the "already open source" route: still a build, and the target's license decides whether its code can be reused.
  - Reframed open projects as *competitors studied for differentiation* in the research playbook, the dossier template and the brief ("The field").
  - Rewrote the worked examples (Bolt, Arc, Signal, Google) and the product-type sections (networks, enterprise suites, targets too big to replicate whole).
- The fabricated-intent flaw was fixed after Run 04: "Never attribute a choice to the user that they didn't make."
