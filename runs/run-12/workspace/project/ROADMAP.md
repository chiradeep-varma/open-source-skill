# Roadmap

See `docs/product/parity-matrix.md` for the full feature-by-feature status.

- **M0 — Skeleton** ✅ Express + SQLite app, auth, Docker Compose.
- **M1 — Core loop** ✅ Create link (auto or custom code), redirect + click logging, per-link stats dashboard (clicks over time, referrers, devices, browsers), QR codes, disable/delete.
- **M2 — Switch-blockers** ✅ Full REST API (session or bearer-token auth), Bitly CSV importer, full JSON export.
- **M3 — Differentiator polish** — not started: link expiry UI (backend supports `expires_at` today, no dashboard control yet), bulk delete.
- **Later** (deliberately deferred, see `docs/brief.md`): multi-user/team accounts, country/city GeoIP analytics, link-in-bio pages, a UTM campaign-builder UI, bulk CSV bulk-create, a browser extension.
- **Won't**: seat-based billing, usage quotas, or any paywalled tier — every feature here is available to whoever runs the instance.
