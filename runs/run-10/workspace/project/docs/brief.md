# Brief: an open alternative to Typeform

**The product.** Formstead is a self-hosted, conversational form and survey builder — build a form, publish a link, collect responses one question at a time, export the results. Used by a volunteer nonprofit for signup forms and short surveys.

**Why people use it.** The conversational one-question-per-screen format gets more people to actually finish a form than a dense static one. People love the polish; per G2-style review themes, the recurring complaint is price-to-value — response limits (as low as 10/month on the free plan as of Feb 2026) that make it expensive fast for anyone whose volume grows.

**Where its value lives.** Almost entirely in software/UX polish and brand trust — no network effects, no proprietary data. That's exactly the kind of value a small, well-designed self-hosted app can capture at nonprofit scale.

**The field.** Google Forms is free but visually plain; Tally has a generous free tier but is still someone else's server holding your data; JotForm caps free usage tightly. Formbricks already exists as an open-source option in this space. None of that changes what to build — it sharpens the pitch: full ownership (your VPS, your domain, your database file) with no response metering at all, not just a bigger free tier of someone else's SaaS.

**What we'll build.**
For a volunteer nonprofit that is paying monthly just to avoid a form's response cap, Formstead is a self-hosted form/survey builder that gives unlimited responses and full data ownership on a $5/mo VPS, unlike Typeform, which meters every plan by monthly response count.
- Core loop: build a form (multiple question types + branching logic) → publish a public link → respondent fills it one question at a time → admin views/export responses.
- Switch-blockers covered: none built this pass (no Typeform export sample available) — flagged as an M2 gap.
- Differentiators: unlimited responses, no branding lock, honeypot anti-spam free by default, webhook extension point, one-command self-hosted deploy.

**What we won't build (for now).** Payments/checkout, file uploads, AI question generation, an integration marketplace, team roles/SSO — all *Won't* or *Later* in the parity matrix; none of them are needed for signup forms and short surveys, and each adds real operational or legal surface (storage quotas, payment compliance) disproportionate to a Prototype build.

**Hard parts and how we'll handle them.**
1. A public form UI that's pleasant on mobile with zero build step → server-rendered HTML + a small vanilla-JS enhancement layer, no SPA framework.
2. Branching logic simple enough for a non-developer → a small rule list per question ("if answer equals/contains X, jump to question Y") edited in a plain admin form, not a visual flowchart.
3. Staying operable by one volunteer → SQLite (single file, no separate DB server), Docker Compose with one service, automatic migrations on boot, documented backup = copy one file.

**Name and license (proposed).** Formstead (conflict check: no active form-builder or software project found under this name; one unrelated crypto-trading review site coincidentally used the phrase "Lyse Formstead" — different category, not a collision) · AGPL-3.0-or-later, because it's a self-hosted web app with no proprietary tier planned, and AGPL keeps any hosted fork of it open too (see ADR-0002).

**Milestones.** M0 skeleton (repo, Docker Compose, empty app boots) → M1 core loop (build/publish/collect/export, done this session) → M2 switch-blockers (Typeform CSV/JSON import once a sample export is available) → M3 differentiators (custom domain, file uploads, richer theming).

**Risks and open questions.** WebFetch was blocked by org policy this session, so every Typeform-specific fact here is `reported` (from search snippets), not `confirmed` from a primary page — worth a quick manual check of typeform.com/pricing before quoting these numbers publicly. No Typeform account/export was available to build or test a real importer. Legal risk is low: no code, assets or text were reused, and the name check found no conflict, but a proper trademark-register search is still worth doing before any public launch (see provenance log).

**Decision needed:** None to build the prototype — proceeding per "just build it." The user should decide later: (1) when/whether to publish the repo publicly, (2) whether to pursue the Typeform importer once they have an export to test against, (3) SMTP settings if they want email notifications on new responses.
