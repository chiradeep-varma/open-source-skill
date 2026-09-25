# rustic-fjord

A free, self-hosted group-scheduling poll: propose a few times, share one link, and let your group vote with no account required. Built to answer the one question a meetup organizer actually has — *when can everyone make it* — without ads, without a paywall on basic features, and without anyone's calendar data leaving your own server.

Not affiliated with or endorsed by Doodle. "Doodle" is a trademark of Doodle AG; this project shares the same category of tool and nothing else — no code, assets, copy, or branding from Doodle were used (see `docs/legal/provenance.md`).

## What it does
1. **Create a poll** — a title, an optional description/location, and a handful of candidate date/times.
2. **Share the link** — participants open it, type their name, and mark **Yes / If need be / No** for each option. No account, ever.
3. **Watch results live** — a grid of everyone's answers, with the best-scoring option highlighted.
4. **Finalize** — pick the winning time; the poll shows "Scheduled" to everyone from then on.
5. **Export** — download the results as CSV at any point.

## Status
| Area | Status |
|---|---|
| Create poll, share link, vote, edit your own vote | ✅ Built |
| Live results grid, best-option highlighting | ✅ Built |
| Finalize / reopen | ✅ Built |
| CSV export | ✅ Built |
| Timezone-correct display per viewer | ✅ Built |
| Automated tests for the scheduling logic | ✅ Built — `npm test` (17 tests) |
| `.ics` calendar invite on finalize | ⏳ Not yet — see `ROADMAP.md` |
| Email notifications, calendar sync | ⏳ Not yet — deliberately deferred, see `ROADMAP.md` |
| Organizer accounts | ⏳ Not yet — a secret admin link stands in for now (see `docs/adr/0002-link-based-identity-no-accounts.md`) |
| Real, browser-verified screenshot review | ⚠️ Partial — see the honest limitation noted in `docs/design/review.md` |

## Quickstart

```bash
npm install
npm run migrate   # creates the SQLite database and its tables
npm start
```

Then open http://localhost:3300. That's it — no Docker, no database server to install, no accounts to create.

Configuration is optional and lives in `.env` (copy `.env.example` if you want to change the port or the database file's location).

## Screenshot
_(This prototype was built and verified from a headless session with no screen — see `docs/design/review.md` for what was checked and how. Run it locally and open http://localhost:3300 to see it.)_

## How it's built
- Node.js + Express, server-rendered EJS views, a small vanilla-JS client (no build step, no frontend framework).
- SQLite (Node's built-in `node:sqlite`) as the only datastore — one file, no external services.
- See `docs/adr/` for the reasoning behind the storage, identity, and concurrency decisions, and `docs/design/direction.md` for the visual design rationale.

## Design notes worth knowing
- **No accounts.** A poll's admin link (shown once at creation) is the credential for managing it — keep it. Participants vote via the plain share link; a per-browser token (stored in `localStorage`) lets them come back and edit their own vote without a login.
- **Timezones.** Every time is stored as a UTC instant and rendered in each viewer's own browser timezone — nobody has to do the math.
- **No ads, no tiers.** Everything in this repository is available to every self-hoster. There's no paid plan to build toward.

## Contributing
See `CONTRIBUTING.md`. This project follows the `CODE_OF_CONDUCT.md`. Report security issues per `SECURITY.md`.

## License
MIT — see `LICENSE`.

## How this was built
This project was built with the `open-source-anything` skill in **Prototype mode**: research, a charter, a license/provenance review, a design direction, and the working core loop, all in one session. See `docs/charter.md`, `docs/research/dossier.md`, `docs/brief.md`, `docs/product/parity-matrix.md`, and `docs/process-log.md` for the full trail.
