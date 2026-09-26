# Roadmap

- **M0 — Skeleton** ✅ Repo scaffold, SQLite schema, Docker Compose, single-admin auth.
- **M1 — Core loop** ✅ Create link → redirect → record click → view stats (clicks over time, referrer, browser/OS/device, country).
- **M2 — Switch-blockers** ✅ Edit/delete links, CSV export of links and clicks, JSON API, static QR code per link.
- **M3 — Differentiators (Later)**
  - Custom/branded domains (multiple `BASE_URL`s, chosen per link).
  - Bulk import from a Bitly CSV export.
  - Per-link expiration / password-protected links.
- **M4 — Beyond this session (Later)**
  - Multi-user accounts with roles.
  - Dynamic QR codes with their own scan analytics.
  - Link-in-bio pages.
