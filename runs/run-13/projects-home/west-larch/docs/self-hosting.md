# Self-hosting guide

## Requirements

- Node.js 20 or newer.
- No database server, no Docker, no other services required.

## Install (native, no Docker)

```bash
git clone <your fork/clone URL> west-larch
cd west-larch
npm install
cp .env.example .env
```

Edit `.env`:
- `SESSION_SECRET` — required. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `BASE_URL` — set to the public URL you'll use (e.g. `https://links.example.com`). Used to build the QR code and the "your page" link shown in the dashboard.
- `PORT` — defaults to 3000.

Then:

```bash
npm start
```

Open `http://localhost:3000` (or your configured port) and sign up.

## With the launcher

If this folder lives in the shared projects folder, open that folder, double-click **Start projects**, and press **Start** next to `west-larch`. The launcher runs `npm install` and `npm start` for you and generates `SESSION_SECRET` automatically.

## Configuration reference

See `.env.example` — every setting the app reads is listed there with an explanation.

## Reverse proxy and TLS

Put this behind a reverse proxy for any deployment reachable over the internet; the app itself doesn't terminate TLS. Example with Caddy:

```
links.example.com {
  reverse_proxy localhost:3000
}
```

Or nginx, with a standard `proxy_pass http://127.0.0.1:3000;` block plus a Let's Encrypt certificate (certbot or your provider's equivalent).

## Custom domain

Point your domain's DNS at the server running the reverse proxy above, then set `BASE_URL` in `.env` to match. There's no per-user custom domain support yet (see `ROADMAP.md` — it's the top `Later` item); today the whole instance shares one domain, with each user at `yourdomain.com/username`.

## Backups and restore

Everything lives in one file: the path set by `DB_PATH` (default `./data/west-larch.db`). To back up, copy that file (and its `-wal`/`-shm` siblings if present) while the app is stopped, or use SQLite's own backup mechanism for a live copy:

```bash
sqlite3 data/west-larch.db ".backup data/backup-$(date +%F).db"
```

To restore, stop the app, replace the database file with your backup, and start it again.

## Upgrades

```bash
git pull
npm install
npm start
```

The app creates any new tables it needs on startup (`CREATE TABLE IF NOT EXISTS`); there's no separate migration step to run yet.

## Troubleshooting

- **"SESSION_SECRET is missing or too short"** — set a real value in `.env`; the app refuses to start without one.
- **Port already in use** — change `PORT` in `.env`.
- **Public page 404s for a username you just created** — usernames are case-insensitive; check for typos and reserved words (see `src/lib/validate.js`).
