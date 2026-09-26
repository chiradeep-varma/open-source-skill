Corkboard is built and verified end-to-end. Summary:

## What's in `./project`

A self-hosted kanban board (Next.js 16 + TypeScript, Prisma 6 + PostgreSQL, NextAuth v5, dnd-kit, Tailwind), MIT-licensed, named **Corkboard**.

**Core loop (all built and browser-tested):** sign in → boards → lists → cards → drag-and-drop (within/across lists, persists on reload) → card detail with due dates, labels, member assignment, checklists, comments → archive/delete → full JSON export → Trello JSON import (closed lists/cards correctly skipped, labels/checklists/due dates carried over) → team management (add teammates, add/remove board members).

**Verification actually run**, not just claimed:
- `npm run lint`, `npx tsc --noEmit`, `npm run test` (16 Vitest tests on the ordering math and Trello importer), `npm run build` — all pass.
- Drove the real app in a headless browser through the full workflow above (login → board → lists → cards → card detail → drag-and-drop → reload → boards home), and separately verified Trello import/export with a hand-built sample export file.
- Found and fixed one real bug this way: creating a label from the card modal threw on a stale-closure race; fixed in `src/components/board/CardModal.tsx`.
- Also fixed a `next start` self-host issue (NextAuth's `UntrustedHost` error) and migrated off the deprecated `middleware.ts` convention to Next 16's `proxy.ts`.

**Self-hosting:** `docker compose up` after copying `.env.example` to `.env` (Dockerfile, docker-compose.yml, and an entrypoint that runs migrations automatically are all in place; I validated the standalone build's file layout matches what the Dockerfile copies, though I couldn't run an actual `docker build` in this sandbox since there's no Docker daemon here).

**Docs:** `README.md` (quickstart, backups, architecture), `docs/charter.md`, `docs/research/dossier.md`, `docs/product/{brief,parity-matrix}.md`, `docs/adr/` (stack + license reasoning), `docs/legal/provenance.md`, `docs/process-log.md` (full record of what was checked and how), plus `LICENSE`/`CONTRIBUTING`/`CODE_OF_CONDUCT`/`SECURITY.md` and a CI workflow.

**Honest gaps** (see the parity matrix): no file attachments yet, no real-time sync (reload to see teammates' changes), no Power-Ups/SSO/extra views — all deliberately out of scope for a prototype per the charter.

The repo is git-initialized but **not committed** — let me know if you'd like me to make the initial commit, or if you want to take it from here.
