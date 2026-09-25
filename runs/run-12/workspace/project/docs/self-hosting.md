# Self-hosting guide

## Requirements

- Docker and Docker Compose (recommended), or Node.js 20+ to run it directly.
- A domain or subdomain if you want links shorter/nicer than an IP address (optional — works fine on `localhost` or a bare IP for testing).

## Install with Docker Compose

```bash
cp .env.example .env
# Edit .env: set SESSION_SECRET and ADMIN_PASSWORD at minimum.
#   openssl rand -hex 32   # for SESSION_SECRET
#   openssl rand -hex 16   # for IP_HASH_SALT

docker compose up -d
```

The app is now at `http://localhost:3000`. Sign in with `ADMIN_USER` / `ADMIN_PASSWORD` from your `.env`.

## Install without Docker

```bash
npm install
cp .env.example .env   # then edit it
npm start
```

## Configuration reference

All settings are environment variables — see `.env.example` for the full list with defaults. The app **refuses to start** if `SESSION_SECRET` or `ADMIN_PASSWORD` is missing; there is no default admin password.

| Variable | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | yes | Signs the session cookie. |
| `ADMIN_USER`, `ADMIN_PASSWORD` | `ADMIN_PASSWORD` yes | Dashboard login. |
| `API_TOKEN` | no | Bearer token for scripting the REST API. |
| `BASE_URL` | no (defaults to request host) | Used to build short links and QR codes — set this to your real domain. |
| `IP_HASH_SALT` | recommended | Fixed salt for hashing visitor IPs. Without it, unique-visitor counts reset on restart. |
| `DB_PATH` | no | Where the SQLite file lives. |
| `COOKIE_SECURE` | no | Set `true` once you're behind HTTPS. |
| `TRUST_PROXY` | no | Set `true` behind a reverse proxy, so client IPs and `req.protocol` are read from `X-Forwarded-*`. |

## Reverse proxy and TLS

Put the app behind any reverse proxy (Caddy, nginx, Traefik) that terminates TLS and forwards to port 3000. Set `TRUST_PROXY=true` and `COOKIE_SECURE=true` once it's behind HTTPS. Example Caddyfile:

```
short.example.com {
  reverse_proxy localhost:3000
}
```

## Backups and restore

Everything lives in one SQLite file (the `sunny-thicket-data` Docker volume, or `DB_PATH` if running directly). To back up:

```bash
docker compose exec app sqlite3 /app/data/sunny-thicket.sqlite ".backup /app/data/backup.sqlite"
docker cp $(docker compose ps -q app):/app/data/backup.sqlite ./backup.sqlite
```

To restore, stop the app, replace the database file with your backup, and restart. You can also use `GET /api/export` (see `docs/importing.md`) for a portable JSON snapshot of your links and clicks, independent of SQLite.

## Upgrades

```bash
git pull   # or however you track updates to your fork
docker compose up -d --build
```

The schema is created automatically on startup (`server/db.js`); there is no separate migration step yet at this project's size.

## Troubleshooting

- **"Missing required ADMIN_PASSWORD" and the process exits** — set it in `.env` and restart.
- **Links redirect to the wrong host in QR codes/short URLs** — set `BASE_URL` explicitly.
- **Unique-visitor counts reset after a restart** — set a fixed `IP_HASH_SALT`.
