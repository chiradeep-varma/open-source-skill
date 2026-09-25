# One-page brief — rustic-fjord

**What it is**: a free, self-hosted group-scheduling poll tool — propose a handful of candidate meeting times, share one link, everyone marks Yes / If-need-be / No against each option with no account required, and the organizer finalizes a winning time.

**Why people use the category**: coordinating a time across more than two or three people by email/chat is slow and error-prone; a shared poll turns N people's availability into one visual grid that converges on an answer fast. Doodle proved this loop works at scale (10M+ users since 2007).

**Better-thesis**: for people organizing a group meetup who are tired of ad-cluttered, account-gated polls, `rustic-fjord` is a free, self-hosted scheduling poll that gives every organizer and participant the full workflow — unlimited polls, no ads, no login to vote — unlike Doodle, which shows ads and paywalls branding/admin controls behind paid tiers and requires an organizer account.

**What we'll build (this prototype)**: the core loop end to end — create poll → share link → vote (with edit-your-own-vote) → live results grid → finalize → CSV export. Server-rendered pages, SQLite storage, zero external services, two-command install.

**What we won't build (non-goals, this round)**: accounts/login, email notifications, calendar-provider sync, 1:1 booking pages, payments, native apps, admin console. These are legitimate later milestones, not omissions from carelessness — see `ROADMAP.md`.

**Hard parts**:
1. Timezone correctness when participants aren't all in the organizer's timezone — options are stored as UTC instants and rendered in each viewer's local timezone in the browser.
2. Letting people vote with no account while still letting them safely edit only *their own* vote later — a per-participant edit token stored in `localStorage`, not a login.
3. Avoiding duplicate/racy vote rows when the same participant double-submits — enforced with a unique constraint at the database layer, not just a UI check.

**Codename**: `rustic-fjord` (random, avoids the incumbent's name; rename freely).

**License**: MIT — see `docs/legal/provenance.md` and `references/legal-and-licensing.md` reasoning: a small utility like this benefits most from maximum reuse, and there's no strong copyleft motive in the charter.

**Milestones**: see `ROADMAP.md`. This session targets M0 + M1 (skeleton and the full core loop), which is the definition of "done" for Prototype mode.
