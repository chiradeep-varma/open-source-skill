# Parity matrix: west-larch vs. Linktree

_Last updated: 2026-09-25_

| Primitive / area | Capability | Incumbent tier | Our tier | Effort | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Account | Sign up / log in | Free | Core | S | M1 | done | dossier §6 | bcrypt + signed cookie session |
| Profile | Display name, bio, avatar URL | Free | Core | S | M1 | done | dossier §6 | avatar by URL, not upload (Later) |
| Profile | Public page at a stable URL | Free | Core | S | M1 | done | dossier §6 | `/:username` |
| Links | Add / edit / delete links | Free | Core | S | M1 | done | dossier §6 | |
| Links | Reorder links | Free | Core | S | M1 | done | dossier §6 | up/down controls, no JS drag lib |
| Links | Hide a link without deleting it | Free | Core | S | M1 | done | dossier §6 | active/inactive toggle |
| Analytics | Per-link click counts | Free (capped) / Pro (advanced) | Core, ungated | S | M1 | done | dossier §4 pricing gate | no plan gate — it's your own database |
| Analytics | Profile page views | Free (basic) | Core | S | M1 | done | dossier §4 | |
| Analytics | Location/referrer/device breakdown, 90-day history | Pro/Premium only | Later | M | M3 | planned | dossier §4 | needs a real events table, cut from prototype |
| Themes | Preset visual themes | Free (9 themes) | Core | S | M1 | done | dossier §6 | 5 original themes, own design direction |
| Branding | Remove vendor branding | Pro/Premium only | Core, ungated | — | M1 | done | dossier §4 pain theme | there's no vendor to brand for |
| Sharing | QR code for the profile URL | Free | Switch | S | M1 | done | dossier §6 | generated server-side, no external service |
| Ownership | Custom domain per user | Not available at all (pain theme) | Diff | M | Later | planned | dossier §5 pain theme | needs reverse-proxy docs; biggest differentiator |
| Import | Import an existing Linktree page | n/a | Won't | — | — | won't | — | no public export format to import from; not worth scraping a competitor's live page |
| Commerce | Sell digital products, seller fees | Premium | Won't | — | — | won't | dossier §4 | enterprise sprawl, out of this wedge |
| Automation | Instagram/TikTok auto-post integration | Pro | Won't | — | — | won't | dossier §4 | out of scope, needs third-party API keys |
| Embeds | YouTube/TikTok/Vimeo embedded video links | Free | Later | S | M3 | planned | dossier §6 | link type extension, not in M1 |
| Scheduling | Time-scheduled links | Starter+ | Later | S | M3 | planned | dossier §4 | |

## Summary

- Core: 10 · Switch: 1 · Diff: 1 · Later: 3 · Won't: 3
- Current milestone: M1, 10 of 10 planned Core items done for the prototype.
- Honest status line for the README: "The core loop — accounts, profiles, reorderable links, click analytics, themes and QR codes — works end to end. Custom domains, scheduling, embeds and detailed geo/device analytics are not built yet."
