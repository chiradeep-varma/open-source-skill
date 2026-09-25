# Target Dossier — Doodle (doodle.com)

**Research floor note**: this session's `WebFetch` tool is blocked by the sandbox's egress policy (every direct fetch, including to doodle.com, Wikipedia, and review sites, returned "proxy refused the connection" / a 403 on the CONNECT tunnel — confirmed by direct `curl` too). Per the skill's fallback rule, all claims below come from `WebSearch` result summaries rather than an opened primary page, and are tagged **`reported`** rather than `confirmed`. Nothing here is tagged `confirmed`. Anything load-bearing for the build is cross-checked against more than one search and against first-hand knowledge of how Doodle's poll flow behaves (tagged `memory` where that's the only source). See "Verify before building" at the end.

## 1. Identity and history
- Founded 2007 by Michael Näf and Paul E. Sevinç, ETH Zürich students; Näf's original motivation was coordinating a dinner with friends. `reported` — [The History of Doodle](https://doodle.com/en/resources/blog/the-history-of-doodle/), [Wikipedia](https://en.wikipedia.org/wiki/Doodle_(website)), accessed 2026-09-25.
- Incorporated as Doodle AG (Switzerland) in 2008; first premium tier and calendar integrations launched 2009; passed 10M users by 2011; Booking Page product and Microsoft Teams integration launched 2021. `reported` — same sources.

## 2. Concept and vision
- Central idea: turn "which time works for everyone" from an email/chat back-and-forth into a single shared poll — organizer proposes several time options, each participant marks their availability per option, and the group's answers converge visually on a winner. `reported`/`memory`.
- Doodle has since expanded from pure group polls into 1:1 booking pages and AI-assisted scheduling, positioning itself as a broader "scheduling platform" rather than only a poll tool. `reported` — [itirupati.com listing](https://itirupati.com/doodle/), accessed 2026-09-25.

## 3. Market and industry
- Category: group/meeting scheduling tools. Two sub-approaches recur across the field:
  - **Poll-style** (propose specific candidate times, vote per option): Doodle, and the open-source **Rallly**.
  - **Availability-grid** (mark all free time on a shared grid, view the overlap as a heatmap): **When2meet** and the open-source **Crab Fit**.
  `reported` — [comparison roundup](https://www.usecarly.com/blog/group-scheduling-tools/), accessed 2026-09-25.
- Rallly is explicitly described as ad-free, account-optional, and self-hostable — the closest existing open-source relative of what this prototype builds, and useful as a design reference, never as code to read. `reported`.
- When2meet is praised for requiring no account/email at all and for pure simplicity, but "never notifies you" (no results summary, no finalize step). Crab Fit adds timezone auto-detection and calendar sync on top of the grid model. `reported`.

## 4. Business model (context only — not reproduced)
- Freemium: unlimited group polls are free; paid tiers unlock unlimited booking pages, custom branding/ad removal, response deadlines, admin controls, and deeper calendar integrations. `reported` — [pricing round-ups](https://www.usecarly.com/blog/doodle-pricing/), [tomba.io](https://tomba.io/blog/doodle-pricing-reviews-pros-and-cons), accessed 2026-09-25.
- Reported tiers (2026, via aggregators, not Doodle's own pricing page — treat price figures as indicative, not exact): Free (unlimited polls, 1 booking page, ads shown); Professional ≈ $15/mo or ≈ $11/mo annual; Team ≈ $19.95/user/mo (≈ $8.95/user/mo annual, 2-seat minimum); Enterprise (custom, SSO). `reported`.
- What the paywall tells us about user pain: **ads and branding on a page you're sending to other people** is the single most-cited free-tier annoyance, followed by the lack of admin/deadline controls. This directly shapes the better-thesis (no ads, ever, for anyone).

## 5. Users and jobs
- Job-to-be-done: "get a group of people, some of whom will never open an account for this, to converge on one meeting time with minimal back-and-forth."
- Loved: the poll UX itself — "no competitor has meaningfully beaten Doodle at 'find a time for nine people'"; calendar-sync reliability once connected. `reported` — search synthesis of Capterra/Trustpilot review themes, accessed 2026-09-25.
- Hated, most-cited first: the mobile app (sluggish, feature-incomplete); ad/clutter in the interface, especially on pages shared with outside participants; paid-only features gating basic organizer needs; unresponsive support, including reports of automated systems cancelling polls/appointments without user action. `reported` — [Capterra reviews](https://www.capterra.com/p/142620/Doodle/reviews/), [Trustpilot](https://www.trustpilot.com/review/www.doodle.com), accessed 2026-09-25.
- Switching trigger: the ad/paywall friction on a tool whose whole point is looking clean to external invitees.

## 6. Product — feature inventory and core loop
Reconstructed from Doodle's own help-center article descriptions and independent how-to guides (`reported`), consistent with prior first-hand knowledge of the product (`memory`):
- **Organizer flow**: sign in → create a poll with title, optional description/location, optional video-conferencing toggle → add time-slot options by clicking on a calendar (each option = a start time + duration) → share a single link (or let Doodle email it) → no account needed for anyone who receives the link.
- **Participant flow**: open the link → enter name (+ email, no account) → for each proposed option, click once for "Yes", again for "If need be", again to clear back to "No"/unset → submit. Can return via the same link to change their own vote.
- **Organizer results view**: a grid of participants × options with per-option Yes/If-need-be counts; the best option is visually surfaced.
- **Finalize**: organizer picks the winning option; Doodle sends calendar invites to everyone who responded (Premium: can also set a response deadline after which voting closes).
- Sources: [Doodle Help Center — create a poll](https://help.doodle.com/en/articles/9457353-how-do-i-create-a-group-poll), [Columbia Tech Hub guide](https://www.columbia.edu/~ey2252/posts/doodle-poll-guide/), [meetergo guide](https://meetergo.com/en/magazine/how-to-use-doodle), accessed 2026-09-25. `reported`.
- No public export/import API for group polls was found in search results (Doodle's public API is scoped to booking/calendar, gated); treated as `assumption` and listed under "verify before building."

## 7. Technology (inferred, `inferred`/`assumption` — no engineering sources surfaced)
- A conventional web SaaS: server-rendered/SPA frontend, relational store for polls/options/participants/responses, calendar-provider OAuth integrations bolted on. Nothing in search results points to an unusual scale problem — the hard parts are UX and reliability (timezone correctness, not losing votes, not double-booking), not infrastructure novelty.

## 8. Where the value lives
- Mostly in **software UX polish and integration breadth** (calendar sync, Teams/Slack, AI scheduling), not in network effects, proprietary data, or regulation. That means an open, self-hosted version can realistically match the *core* job (the poll loop) even though it won't match integration breadth on day one. Brand recognition and 10M+ existing users are the one thing it structurally can't capture — not a target for this build.

## Legal surface
- Trademarks: "Doodle" and the Doodle logo are marks of Doodle AG. This project never uses that name, logo, color system, or copy; see `docs/legal/provenance.md`.
- No terms-of-service text was fetched (WebFetch blocked); no scraping, login-gated content, or bulk data collection was performed — research relied solely on public search-engine summaries of public marketing/review pages, and no `robots.txt` or auth boundary was crossed because no page was fetched directly at all.
- No patent search was performed; the domain (scheduling polls) is old and heavily prior-arted (Doodle itself has been operating this exact model since 2007), so patent risk is treated as low for a from-scratch reimplementation, but this is not legal advice.

## Verify before building (things a live fetch would confirm, that this build treats as non-load-bearing)
- Exact current Doodle pricing figures — not reproduced in this build at all, so not load-bearing.
- Whether Doodle currently requires an account to create a poll (assumed yes, per recent guides) — doesn't affect this build either way, since the whole point is *not* requiring one.
- Doodle's exact vote states beyond Yes/If-need-be/No — this build implements exactly those three, which is the consistently reported set.
