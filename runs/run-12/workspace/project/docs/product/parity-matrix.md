# Parity matrix: sunny-thicket vs. Bitly

_Last updated: 2026-09-25_

| Primitive / area | Capability | Incumbent tier or plan | Our tier | Effort | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Link | Create short link, auto-generated code | Free | Core | S | M1 | done | [S1] | |
| Link | Custom slug | Core+ | Core | S | M1 | done | [S1] | Free tier here; paid-only on Bitly |
| Link | Edit destination / title, disable, delete | Free | Core | S | M1 | done | inferred | |
| Link | Expiring links | Growth+ | Later | S | M3 | planned | [S8] | |
| Redirect | Fast redirect + click logging | Free (ads on free tier) | Core | M | M1 | done | [S9] | No ad interstitial, ever |
| Analytics | Total clicks, clicks-over-time chart | Free (very limited) | Core | M | M1 | done | [S2][S10] | Pain theme: "limited reporting depth" |
| Analytics | Referrer breakdown | Core+ | Core | S | M1 | done | [S2] | |
| Analytics | Device / browser / OS breakdown | Premium (fuller) | Core | M | M1 | done | [S2] | |
| Analytics | Click-history retention | Capped 30–365 days by tier | Diff | S | M1 | done | [S2] | Unlimited on every install |
| Analytics | Country / city geo | Premium | Later | M | — | planned | [S2] | Needs a GeoIP DB dependency |
| QR codes | Generate QR code per link | Free: 2/mo cap | Diff | S | M1 | done | [S9] | Unlimited on every install |
| API | Full REST API | Effectively paid-tier | Diff | M | M2 | done | [S2][S9] | Unrestricted on every install |
| Auth | Single-admin login | n/a (Bitly is multi-tenant SaaS) | Core | S | M1 | done | assumption | Required `ADMIN_PASSWORD`, no default creds |
| Import | Import Bitly CSV export | n/a | Switch | M | M2 | done | switching-blocker theme | Built from documented export shape, not tested against a real export |
| Data | Export all data (links + clicks) as JSON/CSV | n/a on Bitly free/core | Diff | S | M2 | done | openness principle | |
| Link-in-bio | Landing page per profile | Growth+ | Later | L | — | planned | [S8] | Distinct feature, not core to "short links + stats" |
| Campaigns | UTM builder UI | Growth+ | Later | M | — | planned | [S8] | |
| Teams | Multi-user / roles | Paid tiers | Later | L | — | planned | assumption | |
| Bulk ops | CSV bulk-create | Growth+ | Later | S | — | planned | [S8] | |
| Billing | Plans, seat limits, quotas | n/a (Bitly's business model) | Won't | — | — | won't | principle | Not our business model |
| Ads | Interstitial ad before redirect | Free tier | Won't | — | — | won't | pain theme | |

## Summary

- Core: 9 done · Switch: 1 done · Diff: 4 done · Later: 6 planned · Won't: 2
- Current milestone: M2 done (core loop + import/API/export), Later items deferred.
- Honest status line for the README: "Core link-shortening, click analytics, QR codes, a full API, and a Bitly-CSV importer all work today. Multi-user teams, GeoIP, link-in-bio pages and a UTM builder UI are not built yet."
