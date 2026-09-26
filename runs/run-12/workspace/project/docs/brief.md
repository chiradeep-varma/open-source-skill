# Brief: an open alternative to Bitly

**The product.** A self-hosted link shortener: turn long URLs into short, trackable links with a click-analytics dashboard and QR codes — for a developer running their own side projects.

**Why people use it.** Bitly's users love how fast it is to create a trackable link and see who clicked, from where, and on what device. They dislike the pricing cliffs between tiers, capped analytics retention below the top plan, and the ad interstitial shown before every free-tier redirect.

**Where its value lives.** Mostly software/workflow, not network effects or proprietary data — an open version can match the whole core loop. Bitly's brand recognition (the bit.ly domain) isn't something to chase; a self-hoster's own domain is the substitute.

**The field.** YOURLS proved self-hosted URL shortening works but its UI and analytics are dated. Dub.co is a richer open-core competitor built for marketing teams, with an AGPL core plus a commercial `/ee` layer — heavier than one person needs for side projects. The gap is a small, boring, single-process shortener with genuinely good analytics, sized for one operator.

**What we'll build.** *For indie developers running side projects, sunny-thicket is a self-hosted link shortener with unlimited click history and a full API on every install — unlike Bitly, which caps free links at 5/month, gates custom domains behind a $29+/month tier, and drops analytics retention to a few months below its top plan.*
- Core loop: create a short link → share it → redirects get logged → view per-link stats (clicks over time, referrers, device/browser breakdown).
- Switch-blockers we'll cover: CSV importer for Bitly's link export format; an unrestricted REST API.
- Differentiators: no click/retention caps, no ad interstitial ever, QR codes and API on every install, privacy-by-design click logging (hashed IPs, not raw).

**What we won't build (for now).** Link-in-bio pages, UTM campaign builder UI, multi-user/team roles, branded-domain onboarding wizard, country/city GeoIP analytics, bulk CSV bulk-create — all `Later`, cut to keep M1 a real one-evening wedge rather than a Bitly clone. No seat limits, quotas or billing tiers of our own — those are Bitly's business model, not ours (`Won't`).

**Hard parts and how we'll handle them.**
1. Redirect performance under concurrent writes → SQLite with WAL mode and an index on the short code; click logging happens on the same request without blocking the redirect response.
2. Honest device/browser/referrer parsing → `ua-parser-js` for user-agent parsing instead of hand-rolled regex.
3. Privacy-respecting click logs → hash the visitor IP (salted) instead of storing it raw; never surface raw IPs in the UI.

**Codename and license (proposed).** `sunny-thicket` (random, rename any time) · MIT, because this is a personal self-hosted tool meant to be forked freely into other side projects, not a defense against a cloud vendor re-hosting it commercially (see ADR-0002).

**Design direction.** Quiet, precise, durable · a plain infrastructure-tool look (near-black/warm-white surfaces, a single muted teal accent, monospace for short codes) — deliberately not Bitly's orange marketing-SaaS look, and not a default component-kit theme.

**Milestones.** M0 skeleton → M1 core loop (create link, redirect, click logging, stats dashboard, QR codes) → M2 switch-blockers (Bitly CSV import, full API, auth) → M3 differentiators polish (data export, disable/expire links) → Later (multi-user, GeoIP, link-in-bio) held for a future session.

**Risks and open questions.** Pricing figures cited are `reported`, not `confirmed` (page fetches were blocked in this environment) — fine for context since no pricing is being replicated. The CSV importer is built against Bitly's documented export shape, not a real export file, since none was available; worth testing against a real export before relying on it.

**Decision needed:** none — proceeding to build per "just build it."
