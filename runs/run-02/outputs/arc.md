Quick reality check before I start building: this is a case where the "just build it" instinct runs straight into Principle 5 of this playbook — **don't rebuild what the open world already has**. Let me lay out what I found.

## Identity
Assuming you mean **Arc Browser** by The Browser Company (arc.net) — the one with vertical tabs, Spaces, and Boosts. Correct me if you meant something else named Arc.

Also relevant to your "sick of it": Arc isn't hypothetically annoying you — it's actually dying. [Arc went into maintenance mode in May 2025](https://www.androidauthority.com/arc-browser-development-ends-3561650/) (no new features, bug fixes only), and [Atlassian acquired The Browser Company for $610M in October 2025](https://www.androidauthority.com/arc-browser-development-ends-3561650/), with the team's focus now on a different product called Dia. So "open source Arc" is a very live idea right now, not just you being cranky.

## The landscape scan says: it already exists

**[Zen Browser](https://github.com/zen-browser/desktop)** — Firefox/Gecko-based, MPL-2.0 licensed, actively developed as of 2026, and it's explicitly built as the open Arc replacement: vertical sidebar, Workspaces (=Spaces), Split View, Compact Mode, "Zen Glance," and a mods/theming system. It's not a toy — it's the credible one.

Other partial alternatives: **Sidekick**, **Wavebox**, **Floorp** (Firefox fork with similar tab UX), but Zen is the closest 1:1 match and the one people actually migrate to.

A ground-up "Arc" is also a different scale of project than it sounds like: Arc itself isn't a browser engine, it's a UI/UX layer over Chromium — the actual rendering engine, JS engine, sandboxing, extension APIs, etc. are Google's, and reimplementing *that* from scratch is a multi-hundred-engineer-year undertaking, not a session of building. Zen took the same shortcut (skin over Gecko) and it worked.

## So — which of these do you actually want?

1. **Just use Zen Browser.** Fastest path to "Arc but open," zero build time. I can help you get it set up and migrate your Arc data/tabs/spaces over.
2. **Contribute to Zen** if there's a specific gap you keep hitting — faster than building a whole browser.
3. **Build your own lightweight Arc-style shell** (Electron/Tauri wrapper over Chromium with vertical tabs + Spaces + Boosts-equivalent) — reasonable as a personal/learning project, not as a Firefox/Chromium-from-scratch competitor. This is a multi-week "Prototype/Project" scope, not a one-shot.
4. **Something more specific** — is there one particular Arc feature you're actually sick of losing (e.g. Boosts, Spaces, split view, the command bar), or is it the maintenance-mode/dying-product situation itself?

What's actually bugging you about Arc — is it "I want the UI on something actively maintained" (→ option 1) or "I want to build my own thing" (→ option 3)?
