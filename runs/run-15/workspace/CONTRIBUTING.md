# Contributing

velvet-acorn is a small, self-hostable status page. Contributions are welcome.

## Getting set up

```
npm install
cp .env.example .env   # then set SESSION_SECRET and ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000. The SQLite database is created automatically at `data/velvet-acorn.sqlite3` on first run.

## Before opening a pull request

- `npm test` — runs the unit test suite (`node --test`). Add tests for any change to `src/status.js` or `src/models.js`, since those hold the rules that make the product correct (status aggregation, incident lifecycle).
- Keep the two state machines separate — see `docs/adr/0003-two-state-machines.md` — don't collapse component status and incident status into one field.
- If you touch a view, check it at phone width (390px) too; `public/css/styles.css` has no framework, just the tokens documented in `docs/design/direction.md`.
- No new required external services (databases, queues, mail providers) without discussion first — see `docs/adr/0001-embedded-sqlite-no-docker.md` for why.

## Project layout

- `src/db.js`, `src/models.js` — SQLite schema, migrations, queries.
- `src/status.js` — the pure status-aggregation logic (unit tested).
- `src/routes/public.js`, `src/routes/admin.js` — HTTP routes.
- `views/` — EJS templates.
- `docs/` — the research, design and decision records behind this project; read `docs/brief.md` first for the why.
