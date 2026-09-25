## Identity

**Arc** = the desktop browser by **The Browser Company** (arc.net). Confirmed target — no real name collision here given your context (other "Arc"s — the ISO programming language, Arc XP, Arc'teryx — clearly aren't what you mean).

Important context that changes what "sick of it" probably means: Atlassian acquired The Browser Company for $610M (deal closed Oct 21, 2025), and the team's focus shifted entirely to a new AI-first browser called **Dia**. Arc itself has been in **maintenance mode since 2025** — it still runs and gets security patches, but no new features and no roadmap. ([SupaSidebar](https://supasidebar.com/blog/arc-browser-status-tracker), [SigmaBrowser](https://www.sigmabrowser.com/blog/dia-vs-arc-browser-in-2026-ai-workspaces-switching))

One more thing worth knowing before we build: there's already a mature open-source Arc-alike called **Zen Browser** — a Firefox/Gecko fork, MPL-2.0, 41k+ GitHub stars, shipping every 2–4 weeks, recreating sidebar/Spaces/Split View/Mods. There's also **Helium** (Chromium-based, more minimal, no full Spaces model). ([openalternative.co](https://openalternative.co/alternatives/arc), [SupaSidebar](https://supasidebar.com/blog/open-source-arc-browser))

That matters for scope: I'm not going to steer you to use Zen instead — but I also shouldn't just re-build what Zen already does well. Arc itself is built on **Chromium** (open source) with a proprietary shell. The honest wedge for a new open-source project is: a **Chromium-based** shell (most Chrome extensions work, unlike Zen's Gecko base) with Arc's actual UX loop — sidebar, Spaces, Split View, Cmd+T command bar, tab auto-archiving — owned by no company that can flip it into maintenance mode.

## Proposed charter (tell me if any of this is wrong)

| | Recommendation | Why |
|---|---|---|
| **Motive** | Arc's stagnation/uncertain future + no open Chromium-based option | matches "sick of it" |
| **Mode** | **Prototype→Project** — get a real working core loop first (sidebar, spaces, tabs, split view, command bar), then harden into a repo with docs/CI if it feels good | full parity is a multi-year effort even for Arc's own team; a wedge that actually runs beats a spec |
| **Stack** | Electron + TypeScript/React, real Chromium under the hood | matches Arc's own architecture, keeps Chrome extension compatibility, cross-platform (Mac/Win/Linux — Arc dropped Windows support in 2024, so Linux/Windows parity is itself a differentiator) |
| **Platform** | Mac, Windows, Linux | |
| **Must-haves (v1 core loop)** | Sidebar tabs, Spaces, tab auto-archive, Split View, Cmd+T command bar/palette | this is what people actually miss when they leave Arc |
| **Later / stretch** | Boosts (custom CSS/JS per site), Easels, sync | |
| **Won't build** | Arc's AI features, Arc's cloud sync backend, pixel-identical UI | legally risky to copy visuals; sync needs infra decisions later |
| **License** | MIT | permissive, matches Electron/Chromium ecosystem norms |
| **Name** | needs to be distinct — not "Arc" or confusingly similar (trademark). I'll propose a shortlist in the brief. | |

Quick questions — just reply with corrections, or say "go" to accept defaults and let me start:

1. **Mode**: fast working prototype first, or do you want the full public-repo treatment (tests/CI/docs) from the start?
2. **Anything you specifically miss from Arc** that must be in v1 — e.g. is Split View or Boosts more important to you than the rest?
3. Any name ideas, or should I propose some?

I'll start the research dossier and one-page brief now regardless — that part doesn't need your input to begin.
