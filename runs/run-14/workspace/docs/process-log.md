# Process log — rustic-fjord

Mode: **Prototype**, "just build it" (no checkpoints; phases and their floors still followed). Session date 2026-09-25.

## Phase 1 — Identify
One clear match: Doodle (doodle.com), the group-scheduling poll product, named explicitly by the user's own phrasing ("finding a time for group meetups"). No disambiguation needed.

## Phase 2 — Charter
Written to `docs/charter.md`. Key calls made without stopping to ask (per "just build it"): Prototype mode scope (core loop only, no accounts/notifications/calendar-sync), MIT license leaning, build location (`/tmp/ossa-run.4pd6o5` directly, not the shared launcher folder — this is a cloud session that can't reach `~/Documents/open-source-anything/`), stack (Node/Express/SQLite/EJS, no Docker).

## Phase 3 — Research
**Tooling note**: `WebFetch` was unavailable for the entire session — every call returned "proxy refused the connection." Confirmed independently with `curl` (see below); the egress proxy rejected the CONNECT tunnel to both `doodle.com` and `en.wikipedia.org` with a `403` ("organization policy"). `WebSearch` worked normally throughout and was used for all research. Per the skill's fallback rule, every claim in `docs/research/dossier.md` is tagged `reported` (from search-result summaries) or `inferred`/`assumption`, never `confirmed`. This is recorded explicitly at the top of the dossier and in `docs/legal/provenance.md`, and nothing load-bearing in the build depends on an unverified number (e.g. exact pricing isn't reproduced anywhere in the app).

Diagnostic commands run:
```
curl -sS -o /dev/null -w "%{http_code}\n" --max-time 15 https://doodle.com/en/        # CONNECT tunnel failed, 403
curl -sS -o /dev/null -w "%{http_code}\n" --max-time 15 https://en.wikipedia.org/...  # CONNECT tunnel failed, 403
curl -sS "$HTTPS_PROXY/__agentproxy/status"                                          # proxy itself reachable/enabled
```

Searches performed (all via `WebSearch`, accessed 2026-09-25):
1. `Doodle scheduling app reviews complaints 2025 2026 "doodle" polls group meeting`
2. `Doodle pricing plans 2026 Free Pro Team Enterprise features comparison`
3. `Doodle app history founded Switzerland Myra Nizami group scheduling`
4. `When2meet Rallly Crab Fit open source Doodle alternative features comparison`
5. `"Doodle" poll create flow how it works organizer participant options AvailWhen best time yes no if-need-be`

Research floor for Prototype mode requires: official site/docs, pricing (context), one user-voice source, two-three rivals, a UI research pass, five-plus fetched pages. **Not fully met in the literal sense** (zero pages were directly fetched — `WebFetch` was down all session); met instead through five distinct `WebSearch` passes covering the same lenses (official history/product description, pricing, user reviews/complaints, three rivals — Rallly/When2meet/Crab Fit, and the core-loop workflow), each returning multiple cited sources. This is the "if that fails too" fallback path the skill describes, applied consistently and disclosed rather than silently treated as equivalent to a fetch.

Sufficiency test: can explain why people pay (ad/branding removal, admin controls — see dossier §4); can sketch the core loop and data model (dossier §6 → directly became the schema in `src/db.js`); can name three hard parts (timezone correctness, no-account identity + edit safety, vote concurrency — dossier §8 and the brief's "hard parts"); can predict behavior not looked up (e.g. a participant in a different timezone sees converted local times) — consistent with how the build's timezone handling was designed. Considered met for Prototype-mode depth.

## Phase 4 — Synthesize
`docs/brief.md` and `docs/product/parity-matrix.md` written from the dossier. Wedge for M1: the full poll loop (create → vote → results → finalize → export) for one audience (small groups), explicitly cutting accounts, notifications, and calendar sync to later milestones — checked against the wedge test (shippable in one session, does one real job).

## Phase 5 — Guardrails
- Codename generated: `python3 scripts/codename.py --avoid doodle` → `rustic-fjord`.
- License: MIT, fetched verbatim via `python3 scripts/fetch_text.py license MIT --holder "The rustic-fjord contributors" -o LICENSE` (source: SPDX license-list-data on GitHub).
- Code of Conduct: `python3 scripts/fetch_text.py coc --contact "open an issue on this repository" -o CODE_OF_CONDUCT.md` (source: Contributor Covenant v3.0 on GitHub).
- `docs/legal/provenance.md` written, recording that no Doodle code/assets/copy were ever accessed (no page was fetched at all this session) and that competitor projects (Rallly/When2meet/Crab Fit) appear only as market/UI-pattern references, never as code sources.

## Phase 6 — Design
- `docs/design/ui-research.md`: pattern-level synthesis from search results (no live screenshots — same `WebFetch` outage), explicitly labeled as such.
- `docs/design/direction.md`: three personality words (quiet/plain/sure-footed), grounded in the wedge (the incumbent's most-cited visual complaint is ad/upsell clutter, not a lack of polish); color/type/spacing/icon/motion/copy tokens defined; checked against both the incumbent's reported look and generic SaaS defaults.
- Three ADRs written: `docs/adr/0001` (embedded SQLite), `docs/adr/0002` (link-based identity, no accounts), `docs/adr/0003` (DB-level uniqueness for votes).
- `ROADMAP.md` written (M0–M3 + later tiers).

## Phase 7 — Build
- Scaffolded: `package.json`, `server.js`, `src/{db,repo,scheduling,migrate}.js`, `views/*.ejs`, `public/{style.css,app.js}`, `test/*.test.js`, `osa.json`, `.env.example`, `.gitignore`.
- `npm install` — 76 packages (express, ejs, and their transitive deps), 0 vulnerabilities.
- **Tests**: `npm test` → Node's built-in test runner, **17/17 passing** (`test/scheduling.test.js` — pure scoring/validation/CSV logic; `test/repo.test.js` — SQLite-backed create/vote/finalize, including a dedicated test that fires five repeat submits through the same edit token and asserts exactly one response row survives, verifying ADR 0003).
- **Manual end-to-end verification** against the running server (`npm start`, port 3301), via `curl`:
  - Created a poll with two time options → got redirected to a valid admin link.
  - Fetched the admin page, extracted real option ids from the rendered HTML.
  - Voted as two participants (Ada: yes/if_need_be, Bea: yes/no).
  - Re-submitted Ada's vote three times using her real edit token → confirmed via direct SQLite inspection that exactly one response row per option exists for her (no duplicates).
  - Confirmed a participant page fetched without a stored token correctly created a new, separate participant (distinct-browser behavior).
  - Finalized the poll on the earlier option → confirmed the participant page now shows a "Scheduled" banner with the finalized time.
  - Confirmed voting after finalize is rejected with `409` and a clear error message.
  - Confirmed wrong admin token and unknown poll id both return `404`.
  - Downloaded the CSV export and confirmed it contains the correct header row (option times) and one data row per participant with their per-option vote values, correctly comma/quote-escaped.
- **Screenshot review**: no browser-automation tool was available this session, so no real screenshots were captured. `docs/design/review.md` documents this gap explicitly and substitutes a source-level review (reading the rendered HTML/CSS against the four data sets) plus the functional `curl` verification above. This is recorded as a known limitation, not silently skipped.
- **Fresh-copy launcher test** (per the skill's "prove a stranger's first click will work" requirement):
  ```
  cp -r /tmp/ossa-run.4pd6o5 /tmp/osa-fresh-test/rustic-fjord
  rm -rf .../node_modules .../data .../.env .../server.log
  node scripts/osa/osa.js --home /tmp/osa-fresh-test/home add /tmp/osa-fresh-test/rustic-fjord
  node scripts/osa/osa.js --home /tmp/osa-fresh-test/home check /tmp/osa-fresh-test/rustic-fjord
    → "osa.json is valid: rustic-fjord (web)" / "Requirements are met on this machine."
  node scripts/osa/osa.js --home /tmp/osa-fresh-test/home start rustic-fjord
    → installed, migrated, started: "rustic-fjord is running at http://localhost:3300/"
  curl -sS -o /dev/null -w "%{http_code}" http://localhost:3300/   → 200
  node scripts/osa/osa.js --home /tmp/osa-fresh-test/home stop rustic-fjord   → "Stopped rustic-fjord"
  ```
  The temporary folder was deleted after the test.

## Phase 8 — Release
Not entered this session. Publishing is the user's call (Prototype mode, local build). The hand-off message explains next steps, including that this cloud session can't reach the desktop launcher folder directly.
