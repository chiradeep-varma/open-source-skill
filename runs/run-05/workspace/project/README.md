# Trimly

A small, self-hosted link shortener with click analytics — built as an open-source alternative to Bitly's core loop for people running personal side projects, not agency accounts.

Not affiliated with Bitly, Inc.

## Why

Bitly's free tier caps you at ~5–10 links/month, 30 days of analytics retention, and gates referrer/device/browser breakdowns behind a paid plan. If you're just running a handful of side projects and want to know who's clicking your links, that's a lot of ceremony (and a recurring bill) for a redirect and a counter. Trimly gives you the whole core loop — for free, on your own server, with your own data.

## What it does today

- Shorten a URL, with an optional custom slug.
- Redirect instantly and log every click.
- Per-link stats: total clicks, a clicks-over-time chart, and breakdowns by referrer, browser, OS, device type, and country.
- A static QR code for every link.
- CSV export of a link's raw click log.
- A JSON API for everything (`/api/links`, `/api/stats`), so you can script link creation from your own tools.
- A simple dashboard, protected by a single admin password (no user accounts, no SaaS — see [Status](#status) for what that means).

Visitor IP addresses are **never stored** — they're hashed (with your `SESSION_SECRET`) before being written to the database, and only country-level location is derived, offline, with no data sent to a third party.

## What it doesn't do (yet)

Custom/branded domains, link-in-bio pages, dynamic QR codes with scan tracking, and multi-user accounts are intentionally out of scope for this first pass. See [`ROADMAP.md`](./ROADMAP.md) and [`docs/product/parity-matrix.md`](./docs/product/parity-matrix.md) for the full picture, including *why* each of those was cut for now.

## Quickstart (Docker)

```bash
git clone <this-repo> trimly && cd trimly
cp .env.example .env
# edit .env: set ADMIN_PASSWORD, SESSION_SECRET, and BASE_URL
docker compose up -d --build
```

Then open `http://localhost:3000`, log in with `ADMIN_PASSWORD`, and create your first link.

Generate a strong `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Quickstart (without Docker)

Requires Node.js **24+**.

```bash
npm install
cp .env.example .env   # edit it
npm start
```

The SQLite database is created automatically at `DATABASE_PATH` (`./data/trimly.db` by default) on first run — no separate migration step.

## Configuration

All configuration is environment variables — see [`.env.example`](./.env.example):

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | no (default 3000) | Port the server listens on |
| `BASE_URL` | yes | Public base URL used to build short links shown in the dashboard/API |
| `ADMIN_PASSWORD` | yes | Password for the dashboard/API |
| `SESSION_SECRET` | yes | Signs the session cookie and hashes visitor IPs |
| `DATABASE_PATH` | no | Path to the SQLite file |

## API

All `/api/*` routes require the same session cookie the dashboard uses (log in via `POST /login` with `{password}` form field first), or can be called from a script that logs in once and reuses the cookie.

- `GET /api/links` — list links with click counts.
- `POST /api/links` — create a link. Body: `{ "long_url": "https://...", "slug": "optional", "title": "optional" }`.
- `DELETE /api/links/:slug` — delete a link and its click history.
- `GET /api/stats/:slug` — clicks-by-day, and top referrers/browsers/OS/devices/countries.
- `GET /api/stats/:slug/export.csv` — raw click log as CSV.
- `GET /qr/:slug.png` — a static QR code image for the short link.

## Status

This is a **prototype**, built to prove out the core loop, not a finished public project. In particular:

- **Single admin, no teams.** There's one password, not per-user accounts. Fine for a personal side-project dashboard; not fine for a shared team tool as-is.
- **SQLite, single-writer.** Comfortable at side-project scale (thousands of links/clicks); not built for high-concurrency write load.
- **Docker build wasn't verified in this environment** (no Docker daemon available where this was built) — the app itself was run and exercised directly with Node and `curl`/an automated test suite, and the Dockerfile follows the same install/run steps.
- No CI, no versioned releases yet.

See [`docs/charter.md`](./docs/charter.md) for the full set of assumptions this build made, and [`docs/research/dossier.md`](./docs/research/dossier.md) for the (lightweight) research behind the feature choices.

## Development

```bash
npm install
npm test      # runs the test suite (node's built-in test runner)
npm run dev   # runs with --watch for auto-restart
```

## License

MIT — see [`LICENSE`](./LICENSE).
