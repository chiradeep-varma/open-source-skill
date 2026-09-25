# Brief: an open alternative to Linktree

**The product.** A link-in-bio page: one stable URL that fans out to a stack of clickable links, used by creators and small businesses whose social bios only allow one link.

**Why people use it.** Their bio only fits one URL, and they have many things to point it at (new video, merch, tour dates, other socials). People like how fast it is to set up and how easy it is to reorder; they dislike being locked into `linktr.ee/username` with no custom domain, losing their page if billing lapses, and paying to remove the vendor's own branding or see analytics on their own clicks.

**Where its value lives.** Almost entirely in software/workflow, not in network effects, data or content — nothing about the core loop depends on Linktree's own infrastructure or scale.

**The field.** Proprietary rivals (Beacons, Milkshake, Campsite) largely repeat the same plan-gated model. Open rivals split into fully static generators with no accounts or analytics (LittleLink) and heavier Docker-first multi-service stacks (LinkStack). Neither is "one small process, own your data, two commands to start."

**What we'll build.** *For a creator who's tired of a landing page they don't own, west-larch is a self-hosted link-in-bio tool that gives you the same core loop with nothing gated behind a plan, unlike Linktree, which caps analytics and branding removal behind paid tiers and can take your page down if billing lapses.*
- Core loop: sign up → build your profile and link list → share your page → see clicks per link.
- Switch-blockers we'll cover: a QR code for the page (so it's as easy to share as Linktree's), reorderable links, hide-without-delete.
- Differentiators: nothing gated behind a plan (branding, analytics all included), your own domain and data, no seller fees, no de-platforming risk.

**What we won't build (for now).** Commerce/checkout and seller fees (enterprise sprawl, legally heavier — payments); Instagram/TikTok auto-post automation (needs third-party API keys, not core to the loop); an importer from Linktree (no public export format, and scraping a live competitor page isn't worth it for a handful of links a user can re-type in minutes); detailed geo/device/referrer analytics (needs a real events table — `Later`, once the click-count core is proven).

**Hard parts and how we'll handle them.**
1. Accurate click counts under concurrent visits → atomic `UPDATE ... SET clicks = clicks + 1` in SQLite, not read-then-write.
2. A page builder simple enough for non-technical users without a heavy JS framework → plain server-rendered forms, up/down reordering instead of drag-and-drop.
3. Themeable public pages that stay fast and don't leak visitor data to third parties → CSS custom properties per theme, system font stack, no external font/script calls on the public page.

**Codename and license (proposed).** `west-larch` (random, rename any time) · AGPL-3.0, because this is a self-hostable network service and AGPL keeps hosted forks open — the same choice made by comparable self-hosted alternatives (Immich, Plausible).

**Design direction.** Direct, calm, legible · plain system typography and rectangular cards instead of Linktree's rounded pill buttons and soft gradients, so it reads as its own thing rather than a reskin.

**Milestones.** M0 skeleton → M1 core loop (auth, profile, links, click tracking, themes, QR — done this session) → M2 switch-blockers (custom domain docs) → M3 differentiators (scheduling, embeds, deeper analytics).

**Risks and open questions.** All dossier facts are `reported`, not `confirmed` (the environment's proxy blocked direct fetches to linktr.ee) — treat pricing/feature-gate specifics as directional, not exact, if anything beyond this prototype depends on them. No legal risk identified for the scope actually built (no commerce, no scraped content, no copied assets).

**Decision needed:** none — proceeding per Prototype mode / "just build it."
