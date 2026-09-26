# Target dossier: Bitly

> Research notes for building an independent open alternative. Contains facts, observations and analysis only — no copied code, assets or substantial copied text.
> Claim tags: `confirmed` · `reported` · `inferred` · `assumption` · `memory`.
> **Note on method:** direct page fetches (`WebFetch`) were blocked by this environment's outbound proxy for every target tried (bitly.com, yourls.org). All findings below come from `WebSearch`, which returns synthesized snippets over primary and secondary pages with source URLs but without Claude opening the page directly. Per the skill's evidence standard, that caps every claim at `reported` rather than `confirmed`. This is recorded here and in `docs/process-log.md` rather than silently upgraded.

_Research window: 2026-09-25 · Mode: Prototype_

## Summary

- **What it is:** A SaaS link-management platform — shorten URLs, generate QR codes, track clicks, and report analytics by referrer, device and geography. `reported` [S1][S3]
- **Why people pay:** Branded/custom domains for trust and click-through, and click analytics for marketing attribution — both are the features gated behind paid tiers. `reported` [S4][S6]
- **Where the value lives:** Mostly software/workflow and brand trust (the bit.ly domain is widely recognized), not network effects or proprietary data. `inferred`
- **What an open version can capture:** The whole core loop (shorten, redirect, track) and most of the analytics breadth, since none of it depends on Bitly's infrastructure scale for a single-operator install. `inferred`
- **Three hardest problems:** 1. Redirect latency at scale (not a concern at our target scale). 2. Click-fraud/bot filtering in analytics. 3. Accurate device/browser/referrer parsing from raw request headers.

---

## 1. Identity and history
- Bitly, Inc., founded 2008, one of the original URL shorteners; still independent and active as of 2026. `memory`, `reported` [S4][S6]

**So what for the build:** Long-lived, proven category — no need to validate demand.

## 2. Concept and vision
- Core primitive: a **Link** (long URL → short code), enriched with **Clicks** (visit events) and optionally a **QR Code** (an alternate entry point to the same link). `inferred` from product behavior [S1][S8]
- Bitly increasingly frames itself as a "Connections Platform" — short links, QR codes and link-in-bio pages unified as three ways to point at one destination, all reportable in one analytics view. `reported` [S8]

**So what for the build:** Keep the same primitive (Link → Clicks), but scope the prototype to short links + QR, leaving link-in-bio for Later — it's a distinct content-hosting feature, not core to "short links with click stats."

## 3. Market and industry
- Category is mature and stable (link management / attribution).
- Open competitors: **YOURLS** (PHP, GPL-2.0, self-hosted, the long-standing open-source incumbent in this space — minimal UI, plugin-based) `reported` [S5]; **Dub.co** (Next.js/TypeScript, AGPL-3.0 core + commercial `/ee` add-ons, open-core, positions itself as a "link attribution platform" for marketing teams) `reported` [S7].
- Proprietary competitors: Rebrandly, TinyURL, Short.io (not deep-dived here; Bitly is the named target).

**So what for the build:** YOURLS proves the category works self-hosted but its UI is dated and its data model is link-centric with weak analytics depth. Dub is closer to feature-rich but is optimized for marketing teams (campaigns, partners, deep-linking) and its open core is a large Next.js/Vercel-shaped monorepo — heavier operationally than a single side-project deployment needs. The gap: a small, boring, one-binary-feeling self-hosted shortener with *good* analytics out of the box, sized for one person's side projects rather than a marketing team or a SaaS vendor's product.

## 4. Business model
- Five tiers as of Sept 2026: Free ($0), Core (~$10/mo), Growth (~$29–35/mo), Premium ($199/mo), Enterprise (custom). `reported` [S2]
- **Feature × tier gating:**
  - Free: 5 links/month, 2 QR codes, bit.ly domain only, **ad interstitial shown before every redirect**, minimal analytics history. `reported` [S2][S9]
  - Core: 1 custom domain, 100 links/month, 90 days of analytics.
  - Growth: adds a second custom domain, bulk link creation, UTM builder, link-in-bio, 500 links/month, 50 QR codes.
  - Premium: full 1-year analytics retention, country/city/device/referrer breakdowns; below Premium, retention drops to as little as 4 months.
  - Full API access is effectively a paid-tier feature in practice. `reported` [S2][S9]
- Pricing rose entering 2026 (Core $6→$8, Growth $29→$35) and the free tier's link allowance was cut from 10/month to 5/month. `reported` [S2]

**So what for the build:** The gating pattern is exactly: *branded domain, analytics retention, and API access are what's held back.* None of these should be paywalled or capped in the open version — that's the license-cost argument for self-hosting in the first place.

## 5. Users and jobs
- Job: "When I share a link (social post, campaign, side-project demo), I want a short, trackable URL, so I can see if anyone clicked and where they came from."
- **Love themes:** ease of use, fast link creation, QR codes, straightforward click/geo/referrer tracking. `reported` [S10]
- **Pain themes:** pricing jumps and tier gaps ("nearly 6x" Growth→Premium), analytics described as "cumbersome" with "limited reporting depth," free-tier caps, and the interstitial ad on free links. `reported` [S2][S9][S10]
- **Switching blockers:** existing short links already shared/printed (can't be moved without breaking them) and no easy bulk export/import path for people who do want to leave. `inferred`

**So what for the build:** An importer that reads Bitly's link export (CSV of long URL + short code) removes the main switching blocker. Uncapped analytics retention and no interstitial address the two loudest pain themes directly.

## 6. Product
- **Feature inventory:** short links (auto or custom slug), QR code generation, click analytics (time series, referrer, device, geo), UTM builder, link-in-bio pages, bulk CSV operations, team/brand accounts, API, browser extension. `reported` [S1][S8][S9]
- **Core loop:** paste a long URL → get a short link (and optionally a QR code) → share it → visits redirect and are logged → view the stats dashboard.
- **Domain model (ours, designed independently):** `User` (single admin for M1) → `Link` (code, destination, title, disabled flag, expiry) → `Click` (timestamp, referrer, parsed device/browser/OS, hashed IP for uniqueness without storing raw IP).
- **Permissions:** Bitly has org/team roles; out of scope for the prototype (single-admin only).
- **Integrations:** Bitly has a REST API gated by plan; ours ships a full REST API unconditionally, since API access is one of the identified paywall points.

**So what for the build:** This is the concept model the prototype implements — see `docs/product/parity-matrix.md`.

## 7. Technology
- **Inferred architecture:** standard multi-tenant SaaS — web app, redirect service (needs to be fast and horizontally scaled at Bitly's traffic), analytics pipeline (likely event stream → aggregation store), API layer. `inferred`, not `confirmed` — Bitly's internals aren't publicly documented in the sources checked.
- **Hard problems at Bitly's scale:** redirect latency under huge global QPS; bot/click-fraud filtering; analytics aggregation at billions of events. None of these bind at our target scale (one person's side projects).
- **Our target scale:** low thousands of links, light click volume — a single SQLite-backed process comfortably handles this with room to grow; Postgres is a drop-in upgrade path if needed later.

**So what for the build:** Deliberately do *not* build for Bitly's scale. One process, one embedded database, no queue/cache tier for the prototype — see ADR-0001.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | Medium | Match/beat | Core loop is a well-understood pattern (redirect + event logging); no special sauce. |
| Network effects | Low | n/a | Link shortening isn't network-effect driven; each install is independent. |
| Data | Low | Match | No proprietary dataset; click data belongs to whoever runs the instance. |
| Content | None | n/a | — |
| Operations and humans | Medium (global infra, abuse/spam ops) | Not reach, not needed | A self-host at side-project scale doesn't need Bitly's abuse-fighting infrastructure. |
| Hardware | None | n/a | — |
| Brand and trust | High (bit.ly is a recognized domain) | Substitute | Self-hoster uses their own domain, which is arguably *more* trustworthy for their audience. |
| Licenses/certifications | Low | n/a | — |

## Legal surface
- Trademarks to avoid: "Bitly," "bit.ly," the Bitly logo/orange branding, and the phrase "Connections Platform." The project uses the neutral codename **sunny-thicket** throughout, per the skill's guardrails.
- No terms-of-service clauses were opened directly (fetch blocked); treat any future direct study of bitly.com's ToS as unverified until read.
- No patent concerns identified for basic redirect+analytics functionality — this is decades-old, widely implemented prior art (YOURLS itself is from 2009).
- No regulated activity involved (URL shortening/click logging is not a regulated function), though click logs are personal-data-adjacent — see the privacy-by-design note in ADR-0003 (IP hashing, no raw IP retention).

## Contradictions and open questions
- Exact current Bitly pricing figures vary slightly across secondary sources (e.g., Growth listed as both $29 and $35/mo depending on billing cadence/source); treated as informational context only, since no pricing is being replicated.

## Sources

| # | Title | URL | Published | Accessed |
|---|---|---|---|---|
| S1 | Bitly homepage (via search synthesis) | https://bitly.com/ | n/a | 2026-09-25 |
| S2 | Bitly Pricing 2026 breakdown (RedirHub) | https://www.redirhub.com/blog/bitly-pricing-2026 | 2026 | 2026-09-25 |
| S3 | Bitly Pricing page reference | https://bitly.com/pages/pricing | n/a | 2026-09-25 |
| S4 | Bitly Reviews 2026 — G2 | https://www.g2.com/products/bitly/reviews | 2026 | 2026-09-25 |
| S5 | YOURLS project site | https://yourls.org/ | n/a | 2026-09-25 |
| S6 | Bitly Reviews 2026 — Capterra | https://www.capterra.com/p/172575/Bitly/reviews/ | 2026 | 2026-09-25 |
| S7 | Dub — open-source link attribution platform | https://dub.co/ ; https://dub.co/blog/introducing-dub | 2026 | 2026-09-25 |
| S8 | Bitly UTM/Connections platform docs | https://bitly.com/pages/features/utm-tracking ; https://support.bitly.com/hc/en-us/articles/230632067 | n/a | 2026-09-25 |
| S9 | Bitly Free Plan explainer | https://bitly.com/blog/bitly-free-plan/ | 2026 | 2026-09-25 |
| S10 | Bitly Pros and Cons — G2 | https://www.g2.com/products/bitly/reviews?qs=pros-and-cons | 2026 | 2026-09-25 |
