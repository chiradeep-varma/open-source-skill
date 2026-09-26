# Corkboard

A self-hosted, open-source kanban board for small teams — boards, lists,
cards, drag-and-drop — that you run on your own server instead of paying
per seat.

Not affiliated with or endorsed by Atlassian. Trello is a trademark of
Atlassian.

## Status

Built to a **prototype** milestone: the core loop runs end-to-end and has
been exercised in a real browser session (see
[`docs/process-log.md`](docs/process-log.md) for the verification log), but
this hasn't yet had a security review or been run against real production
traffic. Treat it as a working first cut for a small trusted team, not a
hardened multi-tenant SaaS.

| Feature | Status |
|---|---|
| Boards, lists, cards, drag-and-drop | ✅ Built |
| Labels, due dates, members, checklists, comments | ✅ Built |
| Full JSON export / Trello JSON import | ✅ Built |
| One-command self-host (Docker Compose) | ✅ Built |
| File attachments on cards | ❌ Not built |
| Real-time multi-user sync (currently: reload to see others' changes) | ❌ Not built |
| Power-Ups / third-party integrations, SSO, extra board views | ❌ Out of scope — see [`ROADMAP.md`](ROADMAP.md) |

See [`docs/product/parity-matrix.md`](docs/product/parity-matrix.md) for
the full feature-by-feature breakdown.

## Why this exists

Trello is great and simple, but for a small team it means per-seat pricing
that adds up forever, a free tier that caps how many boards you can have,
and your team's task data living on someone else's servers. Corkboard is
the same boards → lists → cards workflow, self-hosted: everyone on your
team gets full access on one flat install you control, with your data in
your own Postgres database and a full JSON export any time you want it.

## Quickstart (Docker Compose)

```bash
git clone <this-repo>
cd corkboard
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD, AUTH_SECRET (openssl rand -base64 32),
# and optionally ADMIN_EMAIL/ADMIN_PASSWORD to auto-create your first account.
docker compose up -d
```

Then open `http://localhost:3000` (or whatever `NEXTAUTH_URL`/`PORT` you
set), sign in with the admin account you configured, and use **Team → Add
teammate** to add the rest of your 8-person team. No public sign-up — this
instance is meant for your team only.

Migrations run automatically on container start (see
`docker-entrypoint.sh`); there's nothing else to set up.

### Backups

Everything lives in the `corkboard-db` Postgres volume. Back it up like any
Postgres database, e.g.:

```bash
docker compose exec db pg_dump -U corkboard corkboard > backup.sql
```

Or use **Export** on any board in the UI for a human-readable JSON export
of that board's data.

## Local development

Requires Node 22+ and a local Postgres instance.

```bash
npm install
cp .env.example .env   # then point DATABASE_URL at your local Postgres
npx prisma migrate dev
npm run db:seed         # creates the admin account from .env
npm run dev
```

```bash
npm run test        # Vitest — core ordering/import logic
npm run lint         # ESLint
npx tsc --noEmit     # typecheck
npm run build        # production build
```

## Importing from Trello

On the boards page, click **Import from Trello**. In Trello, open the board
you want to move, go to **Show Menu → More → Print, export, and share →
Export as JSON**, and upload that file. Lists, cards, labels, due dates,
descriptions, and checklists carry over; archived (closed) lists/cards are
skipped, and Power-Ups, attachments, and custom fields are not imported —
see [`docs/product/parity-matrix.md`](docs/product/parity-matrix.md) for
what's in and out of scope.

## Architecture

Next.js 16 (App Router) + TypeScript, Prisma 6 + PostgreSQL, NextAuth v5
(credentials-based — no SSO, by design, for a small private instance),
dnd-kit for drag-and-drop, Tailwind for styling. See
[`docs/adr/`](docs/adr/) for the reasoning behind these choices and what was
considered instead.

## License

MIT — see [`LICENSE`](LICENSE). See [`docs/adr/0002-license.md`](docs/adr/0002-license.md)
for why.

## How this was built

This project was built using the `open-source-anything` methodology:
research the incumbent honestly, decide what's worth reimplementing, and
write everything fresh. See [`docs/charter.md`](docs/charter.md),
[`docs/research/dossier.md`](docs/research/dossier.md), and
[`docs/legal/provenance.md`](docs/legal/provenance.md) for the full record
of what informed this build and what was deliberately never accessed (no
Trello or competitor source code, at any point).
