**Trimly** is built and working in `./project` — a self-hosted, open-source alternative to Bitly's core loop.

**What it does:** short link creation (auto or custom slug), instant redirect with click logging, and per-link analytics — clicks over time, referrer/browser/OS/device/country breakdowns, static QR codes, CSV export, and a JSON API — all gated by a single admin password. Visitor IPs are hashed before storage, never kept raw.

**Stack:** Node/Express + SQLite, server-rendered EJS dashboard, one `docker compose up` to self-host. No Postgres, no Redis — sized for side-project traffic, not hyperscale.

**Verified:** 12 automated tests (auth, link CRUD, redirect+click recording, validation) all pass, plus I ran the app directly and walked the whole flow with curl — create → redirect → click tracking → stats JSON → dashboard/stats HTML → QR PNG → CSV export — and fixed two real bugs found along the way (an auth-mount bug that was blocking public redirects, and a `req.path` vs `req.originalUrl` bug that leaked HTML redirects into what should've been a JSON API 401). Also caught and fixed a high-severity transitive vulnerability in `geoip-lite`'s dependency by bumping to the patched major version (now requires Node 24+, reflected in the Dockerfile and `.nvmrc`). Docker build itself wasn't runnable here (no daemon in this sandbox) — noted honestly in the README.

**Docs included:** `README.md` (quickstart, API, config), `docs/charter.md` (assumptions made since you said "just build it"), `docs/research/dossier.md` (sourced Bitly research), `docs/product/parity-matrix.md`, `docs/legal/provenance.md` (what was/wasn't referenced), an ADR, and `ROADMAP.md`.

Next steps, if you want them: custom domains, Bitly CSV import, or multi-user — all flagged as "Later" in the roadmap, not built.
