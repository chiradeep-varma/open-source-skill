# Formstead

A self-hosted, open-source conversational form and survey builder — an open alternative to [Typeform](https://www.typeform.com/) built for organizations (like volunteer nonprofits) that don't want to pay per response.

Build a form, publish a link, respondents answer one question at a time, you collect unlimited responses and export them whenever you want. Runs as one small Docker container on the cheapest VPS you can find.

**Not affiliated with or endorsed by Typeform.** "Typeform" is a trademark of Typeform S.L., used here only to describe what this project is an alternative to.

## Status

Prototype — the core loop works end to end and has been exercised manually (see `docs/process-log.md`), but this hasn't been used in production yet. See `docs/product/parity-matrix.md` for the full feature-by-feature comparison with Typeform.

| Works today | Not yet built |
|---|---|
| Build forms with 9 question types (short/long text, email, number, single/multiple choice, yes/no, rating, date) | Import from a Typeform export |
| Drag-free reordering (up/down), required fields | File-upload question type |
| Branching logic ("if answer to X, jump to Y or submit") | Payment collection |
| One-question-at-a-time public form with progress bar, keyboard nav, and a no-JS fallback | Integration marketplace (Zapier, Slack, etc. — use the webhook instead) |
| Unlimited responses, CSV export, response deletion | Custom domains, per-form theming beyond the default look |
| Webhook on every new response | Multiple admin roles / SSO |
| Honeypot spam protection, session-based admin login | Email notifications on new responses |
| One-command self-hosted deploy (Docker Compose), SQLite (single file, easy backups) | |

## Quickstart (self-hosted)

Requires Docker and Docker Compose on your VPS.

```bash
git clone <your-fork-url> formstead
cd formstead
cp .env.example .env
# edit .env: set ADMIN_EMAIL, ADMIN_PASSWORD, and a random SESSION_SECRET
#   openssl rand -hex 32   (use the output as SESSION_SECRET)
docker compose up -d --build
```

Formstead is now listening on port 3000. Put it behind a reverse proxy (Caddy, nginx, Traefik) for HTTPS on a real domain, then set `COOKIE_SECURE=true` in `.env` and restart. Log in at `https://your-domain/admin` with the admin email/password you set.

### Running without Docker

```bash
npm install
cp .env.example .env   # edit as above
npm start
```

## How it works

- **Admin** (`/admin`): create forms, add questions, set branching logic, publish, view/export responses. Session-login, no external auth provider needed.
- **Public form** (`/f/<slug>`): respondents fill it out one question at a time. If JavaScript is disabled, all questions render on one page instead — the form still works, it's just not conversational.
- **Data**: everything lives in one SQLite file (`/data/formstead.db` in the container). Back it up by copying that file, or the whole `formstead-data` Docker volume.
- **Webhooks**: set a webhook URL per form to get a JSON POST on every new response — wire it into Zapier, a Slack incoming webhook, a Google Sheets Apps Script, or anything else that accepts JSON.

## Configuration

All configuration is environment variables — see `.env.example`:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Creates the first admin account on first boot only |
| `SESSION_SECRET` | Random string used to sign session cookies — generate with `openssl rand -hex 32` |
| `COOKIE_SECURE` | Set `true` once served over HTTPS |
| `PORT` | Defaults to 3000 |
| `DATA_DIR` | Where the SQLite file lives (defaults to `/data` in the container) |

## Why this exists

Typeform metered its free plan down to 10 responses/month in February 2026, and paid plans bill by monthly response volume ($25–$83+/mo for 100–10,000 responses). For a volunteer nonprofit running a few signup forms and surveys, that's real money spent on something a $5/mo VPS can do without any cap. See `docs/brief.md` and `docs/research/dossier.md` for the full research behind this build.

## License

[AGPL-3.0-or-later](./LICENSE). If you modify Formstead and run it as a service others use over a network, you must make your modified source available to them.

## Project docs

- `docs/charter.md` — intent and scope
- `docs/research/dossier.md` — research on Typeform, its market, and its users
- `docs/brief.md` — the one-page plan
- `docs/product/parity-matrix.md` — feature-by-feature status
- `docs/adr/` — architecture decisions and why
- `docs/legal/provenance.md` — independent-creation record
- `ROADMAP.md` — what's next
