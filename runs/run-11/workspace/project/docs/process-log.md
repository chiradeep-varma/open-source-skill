# Process Log

Mode: **Prototype**, "just build it" — checkpoints skipped, phases not.

## Phase 1: Identify
"Trello" is unambiguous (no competing active product shares the name in the
kanban/PM category). Proceeded without a disambiguation question.

## Phase 2: Charter
Wrote `docs/charter.md`. All charter fields inferred/assumed rather than asked,
per "just build it" — assumptions listed explicitly in the charter for later
revision.

## Phase 3: Research
Attempted direct WebFetch of primary sources:
- `https://trello.com/pricing` → failed ("proxy refused the connection")
- `https://github.com/wekan/wekan` → failed (HTTP 403)
- `https://github.com/plankanban/planka` → failed (HTTP 403)

Environment's outbound WebFetch was blocked for these hosts, so research
proceeded via WebSearch instead (queries below), and every dossier claim is
tagged `reported` rather than `confirmed`. This is the documented fallback path
in the research playbook (archived copy or alternate source when a primary page
is unreachable); no archive/Wayback lookup was attempted given Prototype-mode
budget, so exact figures (pricing tiers, board caps) should be spot-checked
against trello.com before being quoted publicly.

WebSearch queries run:
1. `Trello reviews complaints 2026 "too expensive" OR "limited" OR "wish it had"`
2. `Trello core features lists cards labels due dates checklists power-ups 2026`
3. `Trello pricing 2026 Free Standard Premium Enterprise per user month`
4. `Wekan open source Trello alternative features self-hosted tech stack`
5. `Planka open source kanban board self-hosted Docker license`
6. `"Corkboard" app kanban project management` (name check)
7. `Corkboard github kanban open source` (name check)

Sufficiency test: can explain why people pay for Trello (visual simplicity vs.
plain lists), sketch the core loop/data model (boards→lists→cards, position
ordering), name the hard technical problems (drag ordering, auth, one-command
self-host), and the competitive field (Wekan, Planka, Kanboard, Focalboard) is
mapped. Floor met given the environment constraint above.

## Phase 4: Synthesize
Wrote `docs/product/parity-matrix.md` and `docs/product/brief.md`.

## Phase 5: Guardrails
Name checked (queries 6–7 above): no collision found. License: MIT (ADR 0002).
Provenance log written at `docs/legal/provenance.md` — no competitor code, assets,
or copy accessed at any point.

## Phase 6: Design
ADRs written under `docs/adr/`. Stack: Next.js 14 (App Router, TS) + Prisma +
PostgreSQL + NextAuth (credentials) + dnd-kit + Tailwind, shipped via Docker
Compose. `ROADMAP.md` written at repo root.

## Phase 7: Build
Stack scaffolded: Next.js 16 (App Router) + TypeScript, Prisma 6.19.3 +
PostgreSQL, NextAuth v5 (beta) credentials provider, dnd-kit, Tailwind 4.
(Prisma's `latest` tag resolved to an 8.0.0-rc build with a breaking
config-file rework — pinned to the last stable 6.x line instead, so the
schema-based `url = env("DATABASE_URL")` datasource config used throughout
this codebase actually works.)

Built vertical slices for the full core loop: auth, boards, lists, cards,
drag-and-drop (list reorder + card move across/within lists), labels, due
dates, member assignment, checklists, comments, archive/delete, full JSON
export, and a Trello-JSON importer, each wired end-to-end from Prisma schema
through API routes to the UI.

**Automated tests**: `npm run test` (Vitest) — 16 tests across
`src/lib/ordering.test.ts` (fractional-index position math: append, insert
between neighbors, empty-list and boundary cases, repeated-insert
distinctness) and `src/lib/trelloImport.test.ts` (Trello export parsing:
rejects malformed input, drops closed lists/cards including cards orphaned
by a closed list, maps label colors, attaches checklists to the right card,
carries over due dates/descriptions, defaults untitled items). Result: **16
passed (16)**.

**Typecheck**: `npx tsc --noEmit` — clean.
**Lint**: `npx eslint src --max-warnings=0` — clean.
**Production build**: `npm run build` — succeeds; migrated off the
deprecated `middleware.ts` convention to Next 16's `proxy.ts` after the
build warned about it.

**Manual verification** (browser-driven, via Playwright against
`npm run build && npm run start` on a local Postgres instance, not a mocked
environment — see the `run` skill's output for the full transcript):
logged in as the seeded admin, created a board, added 3 lists, added cards,
opened a card and set a due date / created+attached a label / added a
checklist with an item / posted a comment, dragged a card from one list to
another and confirmed the move survived a full page reload, and confirmed
the board list view showed correct list/member counts. Found and fixed one
real bug this way: creating a new label from the card modal threw
`Cannot read properties of undefined (reading 'color')` because the
"attach the new label to this card" step looked the label up in a stale
`board` prop closure that hadn't yet re-rendered with the newly created
label — fixed by attaching the label object returned from the creation API
call directly instead of re-deriving it from `board.labels`
(`src/components/board/CardModal.tsx`).

Also verified the Trello importer and board export against a hand-built
sample Trello export file: closed lists/cards were correctly dropped
(including a card that belonged to a closed list), labels/due
dates/checklists carried over onto the right card, and the exported JSON
round-tripped the imported board's structure correctly.

Also fixed along the way: NextAuth's `UntrustedHost` error on `next start`
(self-hosted deployments have no fixed trusted origin the way Vercel does) —
added `trustHost: true` to the NextAuth config.

## Phase 8
Not started — publishing is the user's call per the skill's Phase 8
guidance. README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, and
Docker Compose packaging were written as part of this build so the repo is
ready whenever the user decides to publish it.
