# Target dossier: Typeform

> Research notes for building an independent open alternative. Contains facts, observations and analysis only. No copied code, assets or substantial copied text.
> Claim tags: `confirmed` · `reported` · `inferred` · `assumption` · `memory`.
> **Access note:** outbound page fetches (WebFetch) were blocked in this session by organizational egress policy — confirmed by a 403 on the CONNECT tunnel to multiple unrelated test hosts, not just Typeform's. No primary Typeform pages could be opened directly. All claims below therefore come from web-search result snippets (which themselves quote/summarize primary pages) and are tagged `reported`, never `confirmed`. This is disclosed per the research playbook's rule for unreachable primary sources.

_Research window: 2026-09-25 · Mode: Prototype_

## Summary (write last)

- **What it is:** A web app for building "conversational," one-question-at-a-time online forms and surveys, and collecting the responses.
- **Why people pay:** Design quality and a smooth respondent experience (higher completion rates than static forms), plus logic branching, integrations and analytics — but per-response metering makes it get expensive fast for anyone whose response volume grows. [S2][S3]
- **Where the value lives:** Mostly software/UX polish and brand trust, not network effects or proprietary data — nothing here that a small self-hosted app can't functionally replicate for a nonprofit's use case.
- **What an open version can capture:** The core loop (build → publish → collect → export) and the conversational one-question UI. It cannot capture Typeform's integration marketplace, AI features or design-template library at v1 scale, and doesn't need to for a nonprofit running a few forms.
- **Three hardest problems:** 1. A public form-filling UI that feels good on mobile without a heavy JS framework or build step (ops-simplicity constraint). 2. Branching/skip logic that's simple enough for a non-developer to configure from an admin UI. 3. Keeping the whole thing operable by one volunteer on a $5/mo VPS (no managed DB, no message queue, automatic backups).

---

## 1. Identity and history
- Founded 2012 in Barcelona by Robert Muñoz and David Okuniev; public launch February 2014. Raised ~€550K seed, $15M Series A (2015), $35M Series B, $135M Series C (2022, led by Sofina) — over $187M total raised. [S8] `reported`
- Estimated 2024 ARR ~$141M, valuation ~$935M. [S8] `reported`

**So what for the build:** Typeform is a mature, well-funded company optimizing for growth-team ACV, not for small nonprofits — that gap is exactly the wedge.

## 2. Concept and vision
- Core insight: replace the dense, intimidating "wall of fields" static form with one question shown at a time, styled and animated like a conversation, to raise completion rates.
- **Core primitive(s):** a *Form* (aka "typeform") made of ordered *Questions/Fields* of various types, with optional *Logic* (branching based on prior answers or hidden fields) connecting them; a *Response* is one respondent's full run through the form, made of *Answers*.
- Became possible when browsers could do smooth full-screen transitions/animations cheaply (mobile-first web, CSS3 transitions) — no exotic tech, just good product design applied early.

**So what for the build:** The primitive set (Form → Question → Logic → Response → Answer) is a small, clean domain model — genuinely reusable as *ideas*, not code, and worth honoring in our schema.

## 3. Market and industry
- Category: online form/survey builders, a crowded space spanning free (Google Forms), freemium/self-serve (Tally, JotForm) and enterprise (Qualtrics, SurveyMonkey/Momentive).
- **Open competitors:** Formbricks (open-source, AGPL/EE split, positions itself explicitly as an "open-source Typeform alternative") — exists and is a legitimate option for anyone who wants to adopt existing software, but per this skill's charter we build our own rather than recommend adopting theirs; noted here only as a market signal that self-hosted demand exists. [S4] `reported`
- **Proprietary rivals:**
  - Google Forms: free, no response limit, ~12 field types, basic logic, no design polish. [S9] `reported`
  - Tally: free tier is very generous (unlimited forms/responses, conditional logic, payments, signatures included free). [S9] `reported`
  - JotForm: free tier capped at 5 forms / 100 submissions/month, but strong on templates, e-signatures, HIPAA. [S9] `reported`
- Regulation: none specific to Typeform's core product; e-signature/HIPAA/payment features (which we exclude from v1) carry compliance weight elsewhere.

**So what for the build:** Free/open rivals already out-compete Typeform on price; our differentiator vs. *them* is "your VPS, your data, your domain" rather than "free tier of someone else's SaaS" — full self-hosting, not just a generous free plan.

## 4. Business model
- Tiers (billed annually, 2026): Basic $25/mo (100 responses), Plus $50/mo (1,000 responses), Business $83/mo (10,000 responses), Enterprise custom (~$1,000+/mo). Monthly billing runs higher (e.g. Basic $39/mo). Growth Essentials plan (marketing-team tier) starts at $199/mo. [S1] `reported`
- Free plan: 10 responses/month (cut down from 100/month as of February 2026) — described in reviews as "essentially unusable" for real data collection. [S1][S2] `reported`
- **Feature × tier gating:** file uploads, payments, CAPTCHA, and removing Typeform branding all sit behind paid tiers; response volume is the primary lever across all tiers. [S2] `reported`
- Nonprofits get a 30% discount on paid plans only — the free plan isn't extended, so a nonprofit with any meaningful response volume still pays. [S3] `reported`
- Distribution: self-serve signup with sales-assisted upsell at the Growth/Enterprise tiers.

**So what for the build:** The gate that most directly hurts our user (a nonprofit) is the **response-count metering itself**, not any single feature — so "unlimited responses because it's your own server" is the headline pitch, not a feature checkbox.

## 5. Users and jobs
- Segments: solo creators/small business (free/Basic), marketing and research teams (Plus/Business/Growth), enterprises (custom).
- Job to be done: "When I need people outside my org to give me information (sign up, apply, give feedback), I want a form that's pleasant enough that they actually finish it, so I can act on complete data."
- **Pain themes** (from review-mining via search): price-to-value complaints are the single most common G2 theme; response caps counting partial completions; conversational one-question-per-screen format hurting *long* forms where people want to see everything at once and skip around; weak analytics; fewer integrations than rivals; CAPTCHA gated behind paid tiers. [S2] `reported`
- **Switching blockers:** existing forms embedded on websites/newsletters (link rot if you switch), habit/familiarity, integrations already wired up (Zapier, Slack, Sheets).
- **Switching triggers:** a pricing change (like the Feb 2026 free-tier cut) or hitting the response cap mid-campaign.

**So what for the build:** For a nonprofit specifically, the pain is 100% the price/response-cap axis, not missing features — validates that "unlimited, free, self-hosted" is the whole better-thesis; no need to chase Typeform's AI or integration breadth.

## 6. Product
- **Feature inventory:** see parity matrix.
- **Core loop:** admin builds a form (add/reorder/configure questions) → publishes a public link → respondent opens the link and answers one question per screen, with a progress indicator → on submit, the response is stored → admin views responses in a table and can export/inspect individual submissions.
- **Key workflows:** (1) create form from scratch, (2) add question types (short text, long text, email, single/multi choice, number, rating, date, yes/no), (3) set branching logic ("if answer to Q2 = X, skip to Q5"), (4) publish/share the link, (5) view response list + CSV export, (6) (Typeform only, not v1 for us) integrate via webhook/Zapier.
- **Domain model:** `Form (1) —< Question (many)`, `Question —< LogicRule (optional)`, `Form (1) —< Response (many)`, `Response (1) —< Answer (many, one per Question)`, `User (admin) —< Form (many)`.
- Permissions model: Typeform has workspace/team roles; out of scope for v1 — a single admin account (or a few) is enough for a volunteer org.
- Integrations: Typeform has a large integration marketplace and a REST API/webhooks. We ship webhooks (open, simple) as the extension point, per the skill's "openness by design" principle, and defer a full integration marketplace.
- Notable UX convention: one question fills the screen; a subtle progress bar; "press Enter to continue" keyboard-first interaction; smooth transition animation between questions — this is the visual/interaction signature we should evoke *in our own design*, not copy pixel-for-pixel.

**So what for the build:** The Question type set (short text, long text, email, choice, number, rating/scale, date, yes/no) covers essentially every real-world signup form and short survey; that's our v1 field-type list.

## 7. Technology
- **Inferred architecture:** SPA frontend, REST/GraphQL API backend, relational store for form definitions, likely an events/analytics pipeline for completion-rate tracking, CDN-hosted embeds. `inferred`, not verified — Typeform's internals aren't publicly documented in the sources gathered.
- **Hard problems (for us, at our scale):** none of Typeform's hard problems (massive multi-tenant scale, a marketplace of 500+ integrations, enterprise SSO/compliance) apply to a single nonprofit's VPS. Our hard problems are the ones listed in the Summary above — they're about *simplicity* and *operability*, not scale.
- Known stack/scale signals: none reliably confirmed; not material to a self-hosted single-tenant rebuild.

**So what for the build:** We should not mirror an SPA-plus-microservices architecture. A single small server process, one embedded database file, and server-rendered HTML for the public-facing form (fast, no build step, works with JS disabled as a bonus) is the right-sized answer — see ADR-0001.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow | High | Match | The core loop (build/publish/collect/export) is straightforward CRUD + a public form renderer; well within a Prototype-mode build. |
| Network effects | Low | n/a | Typeform has none of note; forms aren't a marketplace. |
| Data | None | n/a | No proprietary dataset behind the product. |
| Content | Low (template gallery) | Substitute | A handful of starter templates (signup, feedback survey) cover the nonprofit's needs; not worth building a gallery business. |
| Operations and humans | Medium (uptime, support, abuse/spam handling) | Substitute | The nonprofit takes on its own ops in exchange for zero fee; honeypot + basic rate-limiting substitutes for Typeform's anti-spam/CAPTCHA tooling at this scale. |
| Hardware | None | n/a | Pure SaaS. |
| Brand and trust | High (design polish, "professional" feel) | Beat, narrowly | We can't out-brand Typeform, but for a nonprofit's own forms, a clean, on-brand, ad-free page they fully control beats a free-tier Typeform form with usage caps. |
| Licenses/certifications | None specific | n/a | No regulatory license gates the core product (HIPAA/e-sign are add-ons we exclude). |

## Legal surface
- Trademarks to avoid: "Typeform" name/logo, and anything confusingly similar; our project is named "Formstead" and described only as "an open-source alternative to Typeform," never as Typeform itself.
- Relevant terms-of-service clauses: not reviewed in depth (no Typeform account was used or needed — everything here is public marketing/review content); no scraping or account-based research was performed.
- No known patent concerns specific to "one question per screen" form UIs — this is a widely used, long-standing UI pattern (predates Typeform) not treated as proprietary IP in the industry (multiple open and closed competitors use it).
- No regulated activities in scope (payments/HIPAA/e-signature excluded from v1).

## Contradictions and open questions
- Free-tier response-limit figures vary slightly by source/date (10/month as of Feb 2026 vs. earlier 100/month) — used the most recent figure and flagged the change itself as the pain point, rather than depending on the exact number.
- Exact current question-type list and full integration count weren't found in a single authoritative fetched source (WebFetch blocked); the field-type list used for our parity matrix is drawn from converging mentions across multiple `reported` sources plus well-known long-standing Typeform functionality — flagged `assumption`/`reported`, not `confirmed`.

## Sources

| # | Title | URL | Published | Accessed |
|---|---|---|---|---|
| S1 | Typeform Pricing 2026: Plans, Response Limits, and Real Costs (TinyCommand) | https://tinycommand.com/blogs/typeform-pricing-explained | 2026 | 2026-09-25 (via search snippet) |
| S2 | 9 Best Typeform Alternatives in 2026 (TinyCommand) + review-theme search aggregate | https://tinycommand.com/blogs/typeform-alternatives-2025-faster-cheaper-workflow-ready | 2026 | 2026-09-25 (via search snippet) |
| S3 | Best Typeform Alternative for Nonprofits (2026) | https://typeformalternative.com/typeform-alternative-for-nonprofits | 2026 | 2026-09-25 (via search snippet) |
| S4 | Open Source Typeform Alternative (2026) — Formbricks | https://formbricks.com/typeform-alternative | 2026 | 2026-09-25 (via search snippet) |
| S5 | Tally, the best free Typeform alternative (in 2026) | https://tally.so/help/tally-a-free-typeform-alternative | 2026 | 2026-09-25 (via search snippet) |
| S6 | Typeform Developers — Logic Jumps | https://www.typeform.com/developers/create/logic-jumps/ | n/a | 2026-09-25 (via search snippet) |
| S7 | Typeform Help Center — Use Logic Jump to show relevant questions | https://help.typeform.com/hc/en-us/articles/360029257512 | n/a | 2026-09-25 (via search snippet) |
| S8 | Typeform (service) — Wikipedia; EU-Startups Series C coverage | https://en.wikipedia.org/wiki/Typeform_(service) ; https://www.eu-startups.com/2022/03/barcelona-based-typeform-picks-up-e123-million-for-its-conversational-interaction-platform/ | 2022–2026 | 2026-09-25 (via search snippet) |
| S9 | Google Forms vs Tally (Jotform Blog); Compare — Tally | https://www.jotform.com/google-forms/google-forms-vs-tally-forms/ ; https://tally.so/help/compare | 2026 | 2026-09-25 (via search snippet) |
