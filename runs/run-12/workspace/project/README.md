# sunny-thicket

A self-hosted link shortener: short links, click analytics, and QR codes — for your own side projects, on your own server.

Not affiliated with or endorsed by Bitly. Bitly is a trademark of Bitly, Inc. This project's Bitly CSV importer exists only to help you move your own links over if you choose to self-host instead.

## Why

Hosted link shorteners cap how many links you can make, how long they keep your click history, and whether you get API access, unless you pay per tier. sunny-thicket gives you unlimited click history and a full API on every install, because it's your server — see `docs/brief.md` for the full reasoning.

## Screenshot

![Link stats dashboard, showing total clicks, unique visitors, a clicks-over-time chart, and referrer/device/browser breakdowns](docs/design/screenshots/stats-with-data-desktop.png)

More screens (dashboard, login, dark mode, phone width) are in `docs/design/screenshots/`.

## Quickstart

```bash
git clone <this-repo> sunny-thicket && cd sunny-thicket
cp .env.example .env
# edit .env: set SESSION_SECRET and ADMIN_PASSWORD
#   openssl rand -hex 32   # SESSION_SECRET
docker compose up -d
```

Open `http://localhost:3000`, sign in with the admin credentials from your `.env`, and create your first link. Full setup, backups, and reverse-proxy notes: `docs/self-hosting.md`.

## Status

Prototype — the core loop works end to end; see `docs/product/parity-matrix.md` for the full breakdown.

| Feature | Status |
|---|---|
| Create short links (auto or custom code) | ✅ |
| Redirect + click logging | ✅ |
| Stats dashboard (clicks over time, referrers, devices, browsers, unique visitors) | ✅ |
| QR codes | ✅ |
| Disable / delete links | ✅ |
| Full REST API (session or bearer token) | ✅ |
| JSON export | ✅ |
| Bitly CSV import | ✅ (built from Bitly's documented export shape, not yet tested against a real export — see `docs/importing.md`) |
| Link expiry (backend) / expiry UI | Backend done, no dashboard control yet |
| Multi-user / team accounts | Not built |
| Country/city (GeoIP) analytics | Not built |
| Link-in-bio pages, UTM builder UI | Not built (deliberately out of scope for this project — see `docs/brief.md`) |

Every feature above is available to whoever runs the instance — there are no tiers, seat limits, or paywalls here.

## Documentation

- [`docs/self-hosting.md`](docs/self-hosting.md) — install, configure, back up, upgrade.
- [`docs/importing.md`](docs/importing.md) — moving your links over from Bitly.
- [`docs/architecture.md`](docs/architecture.md) — how it's built, for contributors.
- [`docs/brief.md`](docs/brief.md) and [`docs/product/parity-matrix.md`](docs/product/parity-matrix.md) — what this project is and isn't trying to be.

## Development

```bash
npm install
cp .env.example .env   # edit it
npm run dev             # nodemon, auto-restarts on change
npm test                 # runs the test suite (node --test)
```

## License

MIT — see [`LICENSE`](LICENSE). See [`docs/adr/0002-mit-license.md`](docs/adr/0002-mit-license.md) for why.
