# Project Charter

## Target
**Bitly** (bitly.com) — the URL shortener and click-analytics SaaS. Identity is unambiguous: no other active product shares this name in this category.

## Mode
**Prototype**, set explicitly by the user ("Make the calls yourself and just build it"). Scope: the core loop running locally with light docs, in one session. No interactive charter Q&A was run — the assumptions below were made by the builder and are open to revision.

## Motive
Self-hosting for personal side projects: own the link data, avoid Bitly's per-link/per-domain pricing gates on basic click analytics, and run it on infrastructure the user already controls.

## Audience
Just the user, for their own side projects. Not designed (yet) for teams, multi-tenant SaaS resale, or public sign-up.

## Better-thesis seed
For an indie developer running side projects, who doesn't want to pay $10–35/month to see referrer and device breakdowns on their own links, [the project] is a self-hosted link shortener that ships click analytics — location, referrer, device, browser — in the free, open-source core, unlike Bitly, which gates analytics depth and custom domains behind paid tiers.

## Must-have workflows (core loop)
1. Create a short link (auto slug or custom slug) for a long URL.
2. Visiting the short link redirects instantly and records a click.
3. View per-link stats: total clicks, clicks over time, top referrers, browsers, OS, device type, country.
4. List/manage all links from a simple dashboard, gated by a single admin password.

## Explicit non-goals (this session)
- Multi-user teams, roles, org billing.
- Link-in-bio pages.
- Dynamic/editable QR codes with scan analytics (a *static* QR image per link is included since it's nearly free to add).
- Custom domains beyond one configurable base domain.
- A/B split testing, UTM builder, browser extension, mobile apps.

## Constraints
- Should run with a single `docker compose up` — one server, no managed cloud dependency required.
- Small footprint: SQLite, not Postgres/Redis, for a side-project scale (thousands, not billions, of clicks).
- Stack: Node.js/Express — widely known, easy for a solo maintainer or contributor to pick up.

## Assets
None supplied by the user (no Bitly account export). Built entirely from public research below.

## Openness
- License: MIT (see `docs/legal/provenance.md` for reasoning).
- Name: **Trimly** — distinct from "Bitly," no shared root word, low trademark-collision risk for a hobbyist self-hosted tool. Not exhaustively trademark-cleared; recommend a proper search before any commercial use.
- Public repository intent: left to the user to decide when to publish (Phase 8 is out of scope for this session).
