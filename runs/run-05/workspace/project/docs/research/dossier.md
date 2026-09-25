# Target Dossier: Bitly

Light-mode dossier (Prototype scope) — enough to ground the build, not exhaustive. Claims are tagged `confirmed` (checked live, dated), `inferred`, or `memory` (from training knowledge, unverified this session).

## 1. Identity
Bitly is a URL shortening and link-management SaaS (bitly.com), founded 2008. `memory`.

## 2. Concept
Core insight: a long URL is hard to share, track, or brand; a short, memorized/branded link with a redirect layer lets you both simplify sharing and instrument every click. `memory`.

## 3. Market and business model
As of September 2026: free plan limited to roughly 5–10 short links/month, 2 static QR codes, 30 days of analytics retention. Paid tiers: Core ~$10/mo (adds click analytics, branded custom domains), Growth ~$35/mo (500 links, 200 dynamic QR codes, link-in-bio, 3 branded domains, deeper analytics), Premium ~$249/mo, Enterprise custom (~$1,500+/mo). `confirmed`, 2026-09-25 — [Bitly free plan](https://bitly.com/blog/bitly-free-plan/), [Bitly pricing breakdown](https://u2l.ai/blog/bitly-pricing-breakdown), [Linkly's Bitly review](https://linklyhq.com/review/bitly).

Key takeaway for the wedge: **basic click analytics is itself paywalled** on the free tier (30-day retention cap, no deeper breakdowns until Core/Growth). That's the exact gap a self-hosted, no-tier tool removes.

## 4. Users and jobs
Primary users: marketers and indie builders sharing links on social/email who want to know which channel drove clicks, plus branded/short vanity links. Pain points reported across review sites: paying monthly for something conceptually simple (a redirect + a counter), links tied to a vendor account (portability risk if you cancel), and quotas on link creation even on paid tiers. `inferred` from pricing-page structure and review-site framing.

## 5. Product / feature inventory (from pricing-tier breakdown above)
- Short link creation, custom back-halves.
- Click analytics: counts, and (paid) deeper breakdowns — implied to include referrer/device/geo given industry-standard practice for this category. `inferred`.
- Static and dynamic QR codes.
- Custom/branded domains.
- Link-in-bio pages.
- Team seats (Enterprise).

## 6. Technology (inferred)
Not independently verified this session (no source code, docs, or engineering blog reviewed). Standard architecture for this category: a redirect service in front of a key-value or relational store keyed by slug, an async event pipeline for click logging (so redirect latency isn't blocked by analytics writes), and a UA/geo enrichment step. `inferred`, not sourced — treat as a design hint, not a fact about Bitly's actual stack.

## 7. Where the value lives
For Bitly, brand recognition (the name is genericized, like "google it") and multi-tenant SaaS convenience. The underlying mechanism — hash a slug, store a redirect, log a click — is not proprietary technology; it's a well-understood pattern implementable from first principles. This is why a from-scratch open build is both legal and practical here: no source code or protected assets need to be referenced at all.

## 8. Legal surface
No source code, brand assets, UI copy, or trademarked visual identity were accessed or referenced. Only public pricing/feature summaries via third-party blogs and Bitly's own blog post on its free plan were read, for feature-tier structure only — no text, layout, or imagery was reused. Name "Trimly" was chosen to avoid confusion with "Bitly."
