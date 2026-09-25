# Parity Matrix

| Feature | Tier | Status |
|---|---|---|
| Shorten a URL (auto slug) | Core | Built |
| Custom back-half / slug | Core | Built |
| Redirect with click logging | Core | Built |
| Click count per link | Core | Built |
| Clicks-over-time chart | Core | Built |
| Referrer breakdown | Core | Built |
| Browser / OS / device breakdown | Core | Built |
| Country breakdown (offline GeoIP) | Core | Built |
| Link list / dashboard | Core | Built |
| Single-admin auth gate | Core | Built |
| Static QR code per link | Differentiator (cheap to add, free even on Bitly's paid tiers-adjacent feel) | Built |
| Link edit / delete | Switch-blocker | Built |
| JSON API (create/list/stats) | Differentiator (API-first, no seat limits) | Built |
| Data export (CSV of links+clicks) | Switch-blocker | Built |
| Full-history analytics retention (vs. Bitly's 30-day free cap) | Differentiator | Built (SQLite keeps everything until you prune it) |
| Custom/branded domains | Later | Not built — single `BASE_URL` env var only |
| Dynamic QR codes with scan analytics | Later | Not built |
| Link-in-bio pages | Won't (this session) | Not built |
| Multi-user / teams / roles | Later | Not built |
| A/B split testing, UTM builder | Won't | Not built |
