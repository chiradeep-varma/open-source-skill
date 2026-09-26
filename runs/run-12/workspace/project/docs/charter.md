# Project charter: sunny-thicket

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Bitly** · Bitly, Inc. · bitly.com · URL shortening / link-management SaaS · shortens URLs, generates QR codes, and reports click analytics (referrer, device, geography) · status: active, market leader, not open source |
| Sub-scope | Core product: link shortening + click analytics + QR codes. Excludes link-in-bio pages, UTM campaign builder UI, and enterprise/API-partner features. |
| Out of scope | Bitly's mobile SDKs, Salesforce/HubSpot integrations, white-label/reseller program. |
| Route | Build independently. Bitly is proprietary SaaS with no public source to build on; everything here is implemented fresh from public product behavior and docs. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Save money + data ownership/privacy (self-host for side projects instead of paying per-tier SaaS fees) | user |
| Audience | Just the user, for their own side projects (single-admin deployment); designed so it could grow to a small team later | assumed, from "self-host for my side projects" |
| Better-thesis seed | Full click history and a usable API on every install, no per-tier caps, no ad interstitial, self-hosted data | assumed from research (pricing pain, retention caps) |
| Must-have workflows | 1. Create a short link (auto or custom slug) for a long URL. 2. Visitor hits short link → redirected, click recorded. 3. View per-link stats: total clicks, clicks over time, referrers, device/browser breakdown. 4. Manage links: list, edit, disable, delete. 5. Generate a QR code for any link. | assumed |
| Non-goals (prototype) | Link-in-bio pages, UTM builder UI, bulk CSV import, multi-user roles/teams, branded-domain onboarding wizard, geo (country/city) analytics | assumed, to keep M1 a real wedge |
| Mode | Prototype: core loop running locally, light docs | user, explicit |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Developer — comfortable with a terminal, Docker, and editing a `.env` file | assumed from "side projects" framing |
| Languages/stacks | Node.js (broadly known, single-language stack keeps this easy to maintain solo) | assumed |
| Where it runs | A single VPS or homelab box, via Docker Compose or `npm start` | assumed |
| Expected scale | One person's side projects: hundreds to low thousands of links, light-to-moderate click volume (not enterprise traffic) | assumed |
| Time/budget | One session, prototype scope | user |
| Other | No compliance/offline requirements assumed | assumed |

## Assets available

- No Bitly account or data export was available in this session; the CSV importer is designed against Bitly's documented export format and marked as a Later item to be verified against a real export.
- No screenshots supplied; UI research is search-based (see `docs/design/ui-research.md`).

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | Permissive (MIT) — this is a personal-use self-hosted tool, not a defense against a cloud vendor repackaging it; MIT keeps it easiest to fork into other side projects | assumed, see ADR-0002 |
| Commercial intent | None | assumed |
| Public from day one? | User's choice at Phase 8; code is written as if it will be public | assumed |

## Open questions

- Whether the user wants multi-user/team support later (currently single-admin).
- Whether GeoIP (country-level analytics) is worth the extra dependency — deferred to Later.

## Change log

- 2026-09-25: created, Prototype mode, all fields set by assumption per "just build it" instruction.
