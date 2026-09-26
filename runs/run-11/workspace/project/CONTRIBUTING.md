# Contributing

Corkboard is a small, focused project — a self-hosted kanban board, not a
Trello clone with every feature. See [`ROADMAP.md`](ROADMAP.md) and
[`docs/product/parity-matrix.md`](docs/product/parity-matrix.md) before
proposing a large feature, since some things (Power-Ups, an automation
builder, SSO) are deliberately out of scope.

## Getting set up

See the "Local development" section of [`README.md`](README.md). You'll
need Node 22+ and a local Postgres instance.

## Before opening a PR

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

All four should pass. If you're touching drag-and-drop ordering or the
Trello importer, add a test to `src/lib/ordering.test.ts` or
`src/lib/trelloImport.test.ts` rather than only checking it by hand — those
files are pure logic and easy to cover.

## Design decisions

Significant architectural choices are recorded in
[`docs/adr/`](docs/adr/). If you're proposing something that changes one of
those decisions (e.g. swapping Postgres for SQLite, adding real-time sync),
open an issue with the trade-off first rather than a PR — it's a bigger
conversation than a code review.

## Code style

- No unnecessary abstraction — this codebase favors a few repeated lines
  over a premature shared helper.
- Comments explain *why*, not *what*.
- API routes validate input manually (no framework-level schema layer);
  keep that consistent rather than introducing a second validation style
  in one route.

## Reporting bugs / security issues

Regular bugs: open a GitHub issue. Security issues: see
[`SECURITY.md`](SECURITY.md) — please don't open a public issue for those.
