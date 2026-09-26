# Target dossier: Linktree

> Research notes for building an independent open alternative. No copied code, assets or substantial text.
> Tags: `confirmed` · `reported` · `inferred` · `assumption` · `memory`.

_Research window: 2026-09-25 · Mode: Prototype_

**Note on access:** direct WebFetch to linktr.ee and linktr.ee/s/pricing was blocked by the environment's proxy (`proxy refused the connection`) both times it was tried. All claims below therefore come from search-result snippets and secondary sources, tagged `reported`, not `confirmed`. This meets the Prototype floor (site, pricing, review mining, rival scan) but every fact should be treated as needing a follow-up primary-source check before anything beyond a prototype is built on it.

## Summary

- **What it is:** a hosted "one link in bio" landing page: a profile with a stack of buttons, each pointing somewhere else, built for creators who get one clickable link (Instagram/TikTok bio) and many things to point it at.
- **Why people pay:** to remove Linktree's own branding, get scheduling/automation, and see deeper click analytics — the free tier is usable but capped.
- **Where the value lives:** mostly software/workflow and brand trust (creators recognize the format); minimal network effect beyond "everyone's bio has one."
- **What an open version can capture:** the entire core loop — profile, links, click tracking, themes — since none of it depends on Linktree's infrastructure, data, or scale.
- **Three hardest problems:** 1) making click tracking accurate and race-free under concurrent traffic, 2) a page editor that's simple for non-technical creators, 3) themeable public pages that stay fast and accessible without a heavy client bundle.

---

## 1. Identity and history
- Founded 23 March 2016 in Melbourne by Alex Zaccaria, Anthony Zaccaria and Nick Humphreys, who were running a music/entertainment marketing agency (Bolster) and built the first version in about six hours to solve their own artists' "one Instagram bio link" problem. [S2] `reported`
- Raised a $10.7M Series A (Oct 2020), $45M Series B (Mar 2021), then $152M at a $1.7B valuation in 2022; ~$167M raised total as of mid-2026. [S2] `reported`

**So what for the build:** it started as a scrappy single-purpose tool and grew into a VC-scale platform with plan gates — the opening for a self-hosted version is exactly the "plan gate" surface, not new functionality.

## 2. Concept and vision
- Core insight: social bios allow exactly one link, so sell people a single persistent URL that itself contains many destinations.
- **Core primitive:** one profile → many ordered, clickable link "buttons," each independently trackable and toggleable.
- Vision (as marketed): become the layer between social discovery and everything a creator/business points people to (commerce, scheduling, forms), not just a static list.

**So what for the build:** the primitive (profile → ordered link list) is simple and copies cleanly as a *concept*, not as code. The "commerce/marketing layer" expansion is exactly the enterprise sprawl this prototype should not chase.

## 3. Market and industry
- Category: "link in bio" tools. Proprietary rivals include Beacons, Milkshake, Campsite, Bio.fm, Koji-descendants.
- Open-source rivals found in this pass: **LinkStack** (PHP, Docker-first, very feature-rich), **LinkBreeze**, **LittleLink** (static, no backend/JS), **Singlelink**, **Kytelink**, **Linky**, plus a WordPress plugin (**BioLinks**). [S4] `reported`
- Gap this project targets: most open alternatives lean either fully static (LittleLink — no accounts, no click analytics) or heavier multi-service stacks aimed at Docker deployments (LinkStack). The wedge here is a single small Node process with an embedded database — no Docker, no second service — that still has accounts, per-link click analytics and reorderable links out of the box.

**So what for the build:** don't compete on breadth (LinkStack already has more features); compete on "two commands, one file, own your data," which is squarely in this skill's design principles anyway.

## 4. Business model
- Four tiers as of the pass: Free ($0), Starter (~$8/mo), Pro (~$15/mo), Premium (~$35/mo). [S1] `reported`
- **Feature × tier gating:** Free = unlimited links, core appearance, basic analytics. Starter adds more appearance control/icons + link scheduling. Pro adds branding removal, advanced analytics (CTR, unique clicks, locations, referrers, devices, 90-day history), Instagram automation, integrations. Premium adds full analytics, commerce, marketing integrations, priority support. [S1][S3] `reported`
- Seller fees on digital-product sales: 12% (Free) down to 0% (Premium). [S1] `reported`
- 14-day trial on paid tiers, auto-charges after.

**So what for the build:** the parity matrix below treats "remove vendor branding" and "see click analytics" as things that should simply not be gated at all in an open version — there's no vendor to brand for, and no reason to cap your own analytics on your own database.

## 5. Users and jobs
- Segments: individual creators/influencers, small businesses, musicians, and increasingly anyone with a social bio.
- Job: "When I only get one link in my bio, I want one URL that fans out to everything I'm promoting, so I can update it without re-editing my bio."
- **Pain themes** (from review aggregators, `reported`): forced `linktr.ee/username` URL with no custom domain [S5]; design/branding feels restrictive without a paid plan [S5]; billing/cancellation and account-ban complaints, including a reported case where a Pro subscription lapsed mid-support-ticket and the public page disappeared entirely [S5]; not SEO-friendly [S5]; "you don't own your landing page or the infrastructure under it" [S5].
- **Switching blockers:** the public URL people already put in their bio (`linktr.ee/username`) — losing it means updating the bio everywhere. An open version can't reclaim that exact URL, but can make the *new* URL something the user actually owns (own domain).

**So what for the build:** "your page disappears if billing lapses" and "no custom domain" are the two clearest openings for a self-hosted version — you can't be de-platformed from your own server, and you can point your own domain at it.

## 6. Product
- **Feature inventory:** unlimited links, drag-and-drop reordering, ~9 built-in visual themes, QR code for the profile URL, embedded video (YouTube/TikTok/Vimeo), social icons (placeable at top or bottom), link thumbnails, basic click/view analytics (advanced tiers add location/referrer/device breakdowns and a 90-day window). [S1][S6] `reported`
- **Core loop:** creator edits their link list in a dashboard → public page at a stable URL renders the current list → visitor clicks a link → click is counted → creator checks analytics.
- **Domain model (inferred):** User (profile: display name, bio, avatar, theme) 1—* Link (title, destination URL, position, active flag, click count).
- **Permissions model:** single owner per page; no shared editing found in public docs.
- Platforms: web (responsive), iOS/Android apps (out of scope here).

**So what for the build:** this maps directly onto the domain model implemented below (users, links) — see `docs/product/parity-matrix.md`.

## 7. Technology
- No architecture disclosures were found in this pass (site fetch blocked); scale and stack details are `reported`/`inferred` at best and not load-bearing for this build, since the implementation here is original regardless.
- **Hard problems inferred from the product shape:** accurate click counting under concurrent traffic (solved here with an atomic SQL increment, not read-modify-write); a page-builder UX simple enough for non-technical creators (solved here with a plain form + up/down reordering rather than a drag-and-drop JS framework, to keep the stack dependency-light); theming that stays fast with no client-side framework (solved with server-rendered CSS custom properties per theme).

**So what for the build:** none of Linktree's actual infrastructure needs to be matched — the target scale here (one self-hoster, not global multi-tenant SaaS) makes SQLite and a single Node process entirely sufficient.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | Medium | Match/beat | The core loop is simple and fully reimplementable |
| Network effects | Low–Medium (format recognition) | Not applicable | An open version doesn't need Linktree's network, it needs its own URL |
| Data | Low | Beat | Self-hoster owns 100% of their data, no vendor lock-in |
| Content | None | n/a | No content library to replicate |
| Operations and humans | Low | Substitute | No support org; docs + community substitute |
| Hardware | n/a | n/a | |
| Brand and trust | High (creators recognize the format) | Not reach | Can't buy the recognition; wins on trust-through-ownership instead |
| Licenses/certifications | None known | n/a | |

## Legal surface
- Trademarks to avoid: "Linktree", "linktr.ee", and anything confusingly similar — the project is codenamed `west-larch`, unrelated to the mark.
- No Linktree terms of service were read or relied on; no account-based or scraped research was performed.
- No known domain-specific patent concerns for a link-list-with-click-tracking product.
- No regulated activity involved (no payments/commerce built in this prototype).

## Contradictions and open questions
- Exact current pricing/feature-gate boundaries vary slightly by source (some say Starter has "9% seller fee", others differ) — none of it is used as a spec here, only as directional evidence for what to leave ungated.

## Sources

| # | Title | URL | Published | Accessed |
|---|---|---|---|---|
| S1 | Linktree Pricing 2026 (aggregated) | https://www.elev8or.io/blog/bio/linktree-pricing | 2026 | 2026-09-25 |
| S2 | Linktree Company Information — Funding | https://seedtable.com/startups/linktr-ee | 2026 | 2026-09-25 |
| S3 | LinkTree Features | https://thelinktree.com/features | 2026 | 2026-09-25 |
| S4 | The 10 Self-Hosted Open-Source Linktree Alternatives (2026) | https://medium.com/@shelfy_19139/the-10-self-hosted-open-source-linktree-alternatives-actually-worth-deploying-in-2026-ranked-by-533cd0436633 | 2026-07 | 2026-09-25 |
| S5 | Linktree Reviews — Capterra / Trustpilot / G2 (aggregated via search) | https://www.trustpilot.com/review/linktr.ee , https://www.capterra.com/p/229171/Linktree/reviews/ | 2026 | 2026-09-25 |
| S6 | Linktree Creator Tool Review | https://influencermarketinghub.com/linktree/ | 2025 | 2026-09-25 |
