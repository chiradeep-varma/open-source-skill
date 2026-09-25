# Research playbook

Where to look for each dossier lens, how much to trust each source, and techniques that turn raw material into understanding. Use it in Phase 3.

## Contents
1. Order of work and depth by mode
2. Source reliability
3. Sources by lens
4. Techniques
5. Tools and access etiquette
6. Recording findings

---

## 1. Order of work and depth by mode

Start from the product's own words, then its users', then its engineers', then the market's. That order builds a correct concept model early, and later sources refine it rather than replace it.

1. **Official site → docs → pricing → changelog.** This gives you what it is, what it does, what it costs, and where it's heading.
2. **API reference and export format.** This gives you a draft domain model.
3. **Reviews, forums and communities.** This tells you what people love, hate and need in order to switch.
4. **Engineering sources.** This gives you architecture and the hard problems.
5. **Market and competitive field**, proprietary and open. This gives you the category, the competitors and the gaps your version can fill.
6. **Fill the gaps** until you meet the sufficiency test in SKILL.md, then stop.

| Mode | Depth |
|---|---|
| Brief | All lenses at moderate depth. The dossier is the deliverable, so polish it. |
| Prototype | Concept, users, product and technology in depth. Market and business model briefly. |
| Project | All lenses, with a thorough review-mining pass (it shapes the parity matrix). |
| Venture | All lenses, and market and business model with numbers: sizing, pricing and competitors' traction. |

## 2. Source reliability

| Tier | Sources | How to use |
|---|---|---|
| 1. Primary or observed | Official docs, API references, changelogs, pricing pages, regulatory filings, incident post-mortems, what you or the user directly observe | Treat as the truth about *what exists*, but check dates: docs lag and marketing overstates. |
| 2. First-person accounts | Engineering blog posts, conference talks, founder interviews, podcasts | Strong on *why* and *how*, but may be aspirational or years out of date. Note the date. |
| 3. User reports | Reviews, forums, Reddit, Hacker News, app-store reviews, social posts | Strong on *experience*. Trust patterns across many reports over any single claim. Watch for incentivized reviews and outrage spikes. |
| 4. Third-party summaries | News, analyst summaries, directories, "top 10 alternatives" listicles | Leads to follow, not facts. Many "alternatives" articles are SEO filler or AI-generated. Verify against tier 1. |
| Your memory | What you already know | Tag it `memory` and verify anything that matters. Products change faster than training data. |

When sources disagree, prefer the more recent tier-1 source. Record the conflict in the dossier; it often reveals a change such as a repricing, a pivot or a deprecated feature.

## 3. Sources by lens

### 1. Identity and history
- The company's About, press and investor pages.
- Wikipedia, used only as a map of events to verify elsewhere.
- Regulatory filings for public companies. Annual reports and IPO prospectuses such as the US 10-K and S-1 are exceptionally candid on business model, customer counts, segments and risks. Also check national company registries.
- Funding and acquisition news.
- The Wayback Machine (`web.archive.org`). The homepage headline over the years shows positioning pivots in minutes.

### 2. Concept and vision
- **The launch post.** This includes the original announcement, the "Show HN" or Product Hunt launch, and the founder's first blog post. It is the purest statement of the concept, before the product sprawled.
- Founder essays, "why we built this" posts, manifestos and mission pages.
- Keynotes and product-announcement events, which show where the company says it's going.
- Getting-started docs and the glossary. The product's vocabulary *is* its concept model: its nouns are your entities and its verbs are your workflows.
- Investor memos that some venture firms publish about their portfolio companies.

### 3. Market and industry
- Category pages on review platforms, which show segments and who competes with whom.
- Analyst reports. Usually only summaries are public, so treat any number as a claim to triangulate.
- **Market sizing** (Venture mode). Prefer a bottom-up estimate: number of potential customers × realistic price. Compare it with any published figures and show your arithmetic.
- **Open competitors.** These are projects that already chase the same users. Find them through GitHub topic and keyword search, curated lists such as `awesome-selfhosted`, alternative-software directories (AlternativeTo, openalternative.co), and the "alternative to X" threads on r/selfhosted and r/opensource.
  - Study them as competitors: their positioning, what users praise, and what users complain about in their issues and threads. Their weaknesses often point straight at your better-thesis.
  - This is research for differentiation. Never present them to the user as a substitute for building.
  - Don't read their code unless you plan to reuse it under its license. If your license will differ, the independent-creation discipline applies to them too.
- The regulatory landscape, from government and regulator sites, for regulated domains such as finance, health, education, telecom and children's data.

### 4. Business model
- **The pricing page and its plan-comparison table.** For each feature, note which tier it first appears in. Features gated to higher tiers mark what the company believes customers value most. The "SSO tax" (single sign-on only on enterprise plans) and audit-log gating are classic open-source opportunities.
- Pricing history through the Wayback Machine. Price increases often come with a wave of users looking for alternatives, which is your audience.
- Limits and quotas pages, which show the cost drivers.
- The enterprise and security pages: compliance certifications, SLAs, data residency.
- Partner programs, marketplace revenue share, affiliate terms.
- Revenue and traction estimates from third-party trackers (tier 4, and directional only) and filings for public companies (tier 1).

### 5. Users and jobs
- **Review mining** (see §4). B2B review platforms such as G2, Capterra and TrustRadius; app-store reviews for consumer apps.
- Hacker News. Search `hn.algolia.com` for the product name. Launch threads, pricing-change threads and "Ask HN: alternatives to X" are especially rich.
- Reddit: the product's own subreddit, plus r/selfhosted and category subreddits.
- **Public feature-request boards and community forums.** The most-upvoted open requests are demand the incumbent hasn't met.
- Case studies and customer logos, which describe the ideal customer in the company's own words.
- **Migration guides**, both "how to migrate from X" and "how to migrate to X". They list exactly what's hard to move, which is your importer's specification.
- Competitors' "X vs. us" pages. They are biased but itemized, which makes them useful as a checklist.
- Tutorials and screen recordings, which show real workflows and real friction.

### 6. Product
- **Docs and help center.** This is the single richest source. Walk the navigation tree: every page is a feature, a concept or a limit.
- **API reference and published API specs.** These are the domain model laid bare:
  - resources are your entities;
  - reference fields are your relationships;
  - enums are your states;
  - the webhook event list is the object lifecycle;
  - error codes are the business rules.
- **Official SDKs.** These are often open source under permissive licenses. They are fine to read for understanding how the API is used. Don't copy them into your core unless their license allows it and you keep attribution.
- **The changelog and release notes.** The last 12–24 months show strategy: where they invest, and what they deprecate.
- **Export documentation and sample exports.** The export format is a statement of what data exists. The user's own export is the best evidence of all.
- The integrations directory, which shows extension points and ecosystem.
- Keyboard-shortcut and power-user pages, which show the depth of the interaction model.
- Security and trust pages: auth methods, encryption, retention.
- The status page. Its component list maps how the company divides its system into services.
- Free tier or trial, observed within the terms of service (see the legal reference). Screenshots and recordings the user provides are equally good.

### 7. Technology
Start by asking what open components the product is built on. Look at open-source acknowledgment and license screens (often under "About" or "Licenses" in apps), third-party notices, "powered by" mentions, and engineering posts. If the incumbent is a proprietary layer over an open base (a Chromium browser, a fork of an open editor, an app on open models or an open database), your version can start from the same base. That can change the size of the project by orders of magnitude.

Most of these signals are covered in `architecture-inference.md`. In short, look at:
- engineering blog posts and conference talks;
- job postings, which list the stack;
- the company's own open-source repositories and their dependencies;
- subprocessor lists, which name infrastructure vendors;
- DNS records and HTTP headers, which show hosting and CDN;
- incident post-mortems;
- observable client behavior, such as protocols and sync patterns.

### 8. Where the value lives
You synthesize this from everything above. Ask what customers would lose if they got identical software without the company behind it. That might be the network of other users, the data, the content catalog, the integrations, the brand's trust, the licenses and certifications, or the humans doing operations. Whatever they would lose is value that software alone doesn't carry.

### Legal surface
- **Trademarks.** Search the national registers where the project will be used: the USPTO trademark search, EUIPO or TMview for the EU, and the WIPO Global Brand Database for cross-border coverage.
- **Terms.** The target's terms of service, API terms and acceptable-use policy. Look for clauses on reverse engineering, competitive use, scraping and benchmarking.
- **Patents.** Note the domain's known patent landscape from public commentary. See the legal reference before searching patents directly.
- **Regulation.** List the licenses or certifications that *operating* such a service requires.

## 4. Techniques

**Feature inventory.** Walk the docs navigation and the pricing table together. Each distinct capability becomes one row: feature, short description, plan tier, source URL. Group rows by concept-model primitive. The inventory feeds the parity matrix directly.

**Domain model from the API.** List the resources. For each one, record its key fields, its references to other resources, its enums and its lifecycle events from the webhooks. Draw it as an entity list or a Mermaid ER diagram. Mark anything you inferred rather than read.

**Workflow reconstruction.** For each key job, write the steps the user takes: trigger → steps → outcome, with the objects touched and state changes. Use docs, tutorials and recordings. Note the friction points, because they are candidates for the better-thesis.

**Review mining.**
1. Gather 30–60 recent critical reviews (1–3 stars) and 20–30 positive ones from several sources and segments.
2. Cluster them into themes, and count each theme's frequency.
3. Pick one or two short representative quotes per theme.
4. Keep the themes' different meanings apart: pain themes feed the better-thesis, love themes define Core, and "can't leave because…" themes define Switch-blockers.
5. Note each review's date and the reviewer's segment where available.

**Pricing analysis.** Build a table of feature × tier and limit × tier, noting price per seat or per usage unit. Always record the **billing basis** (monthly or annual), the currency and the date. Many vendors show both monthly and annual prices, so a number without its basis reads as wrong even when it's right. Find the features that force upgrades; those are the pressure points an open alternative relieves.

**Changelog timeline.** Group the last 12–24 months of entries by theme. A theme that suddenly gets heavy investment shows the company's current bet.

**Positioning history.** Use the homepage headline and meta description from the Wayback Machine, sampled once a year. Pivots show which concept survived contact with the market.

**Hard-problem hunting.** Look for the places where users praise "it just works" or complain "it breaks when…". Examples include sync conflicts, search relevance, speed at scale, deliverability, and real-time collaboration. Cross-check them with the engineering sources.

## 5. Tools and access etiquette

- Use web search and fetch tools for most work. Use a browser automation tool for pages that render client-side.
- Useful public endpoints:
  - Hacker News search API: `https://hn.algolia.com/api/v1/search?query=<name>`.
  - Wayback Machine CDX index: `https://web.archive.org/cdx/search/cdx?url=<domain>&output=json&limit=…`. Fetch snapshots from `https://web.archive.org/web/<timestamp>/<url>`.
  - GitHub search, for repositories, topics, and the company's organization.
- Act like a careful human reader, not a crawler. Respect robots.txt and rate limits, don't log in to bulk-collect, and don't download content libraries or user data. You need understanding, not their content. See `legal-and-licensing.md` for the boundaries.
- **No web access?** Say so at the start. Ask the user to paste key pages or share links and screenshots. Proceed from memory, tagging those claims `memory` and listing what should be verified before a public release.

## 6. Recording findings

- Write into `docs/research/dossier.md` (from the template) as you go, not at the end.
- **Claim format:** the statement, then a tag, then the source reference, as in `[S12]`. The tags are `confirmed` (you opened the page), `reported` (search result or secondary source), `inferred`, `assumption` and `memory`. SKILL.md defines each one.
- **Sources:** a numbered list at the bottom, each with URL, title, publication date if known, and access date.
- Keep quotes short and attributed. The dossier is research notes, not a copy of their material.
- End each lens with **"So what for the build"**: one to three bullets on how the lens changes what gets built. Research that doesn't change a decision can be cut.
