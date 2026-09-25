# Process log: velvet-acorn

Mode: Prototype, "just build it" (no checkpoints; every charter answer is an assumption, logged as such).

## Phase 1 — Identify

- Target: Statuspage (statuspage.io), owned by Atlassian. One clear match — no other active product shares the name in the incident-communication category, and the user's phrasing ("Statuspage for my side projects... incident updates") matches it unambiguously. No disambiguation question was needed.

## Phase 2 — Charter

- Wrote `docs/charter.md`. All answers assumed per the user's explicit "make the calls yourself" instruction. Mode: Prototype.

## Phase 3 — Research

- Attempted direct fetch of `atlassian.com/software/statuspage` and its pricing page via WebFetch — both calls failed with "proxy refused the connection" (environment's outbound fetch proxy). Fell back to WebSearch, which returns a search-engine synthesis citing the same URLs; those pricing/feature claims are tagged `reported`, not `confirmed`, in the dossier.
- Searches run (5 total): Statuspage features/pricing; Statuspage reviews/complaints; open-source status-page alternatives (Cachet, OpenStatus, Instatus, Better Stack); status-page UI/design best practices.
- Pages/sources cited: 8 in the dossier's Sources table (S1–S8) plus 4 UI-research sources (U1–U4) — meets the Prototype research floor (≥5 sources; official site + pricing context; user-voice/review source; 2–3 rivals; a UI research pass).
- Sufficiency test: can explain why people pay for it (trusted, official outage channel), sketch its core loop/data model (components × incidents × updates, two state machines), name its hardest problems (status aggregation, timeline legibility, easy self-hosting), and reason about untested cases (e.g. maintenance windows) from the model. Stopped research here.
- Wrote `docs/research/dossier.md`.

## Phase 4 — Synthesize

- Wrote `docs/brief.md` and `docs/product/parity-matrix.md` (19 rows: 11 Core, 4 Diff, 3 Later, 2 Won't).

## Phase 5 — Guardrails

- Wrote `docs/legal/provenance.md`. No Statuspage account was ever created; no code, assets or copy were accessed. Codename `velvet-acorn` generated via `scripts/codename.py --avoid statuspage`.
- License: MIT (recommended for a permissively-licensed personal side-project tool; see brief).

## Phase 6 — Design

- Wrote `docs/design/ui-research.md` (category conventions, sourced) and `docs/design/direction.md` (original visual direction, checked against both Statuspage's look and generic SaaS defaults).
- Wrote `docs/adr/0001` (embedded SQLite, no Docker), `docs/adr/0002` (single-admin auth), `docs/adr/0003` (two state machines: component status vs. incident status).
- Wrote `ROADMAP.md`.

## Phase 7 — Build

- Scaffolded a Node.js + Express + `better-sqlite3` + EJS app (no Docker, no external services — per ADR-0001). Dropped the originally-planned `connect-sqlite3` session store after `npm audit` flagged 7 vulnerabilities (1 critical) in its transitive `node-gyp`/`tar` build chain; switched to `express-session`'s in-memory store, appropriate for a single-process, single-admin prototype. Re-ran `npm audit`: 0 vulnerabilities.
- Built the full core loop: `src/status.js` (pure worst-status-wins aggregation), `src/db.js`/`src/models.js` (schema, migrations, queries), `src/routes/public.js` and `src/routes/admin.js`, EJS views for the public status page, incident history, incident detail, admin login, dashboard, component form, incident/maintenance form and incident detail with an update composer.
- Automated tests: `test/status.test.js` (6 cases on `computeOverallStatus`) and `test/models.test.js` (4 cases: component defaults, incident creation writes its first update and links components, resolving stamps `resolved_at` and appends rather than duplicating, `listIncidents({onlyUnresolved})` excludes resolved and maintenance). Test command: `npm test` → `node --test "test/**/*.test.js"` — **10/10 passing**. (Note: `node --test test/` with a bare directory argument failed with `MODULE_NOT_FOUND` on this Node 22.22.2 build; switched the script to an explicit glob, which works.)
- Manually exercised the live app end to end with curl against a running server: public homepage, `/api/status.json`, admin login/auth-gating, creating 2 components, opening an incident linked to a component (verified the public banner flipped from "All systems operational" to "Partial outage"), posting a resolving update (verified banner returned to operational and the component's status reset), scheduling a maintenance window (verified it appeared under "Scheduled maintenance" on the public page, separate from "Active incidents"), and the `/feed.xml` RSS output (valid RSS 2.0, correct item for the resolved incident).
- Screenshot review: captured all core-loop screens (public home, incident history, incident detail, admin login, admin dashboard) at desktop (1280px) and phone (390px), light and dark, across empty/many/long data sets, using `scripts/capture.js` (Playwright, already available — no install needed). Found and fixed two real overflow bugs (not just predicted from source): (1) the admin dashboard's incident table pushed phone width to 425px — fixed with a `.table-wrap { overflow-x: auto }` scroll container; (2) a long unbroken URL in an incident title pushed desktop width to 2230px — fixed with `overflow-wrap: anywhere` on `html, body`. Both re-captured and confirmed fitting afterward. Full writeup in `docs/design/review.md`, including the claims check against the README.
- Fresh-copy launcher proof: copied the project (excluding `node_modules/`, `data/`, `.env`) to a clean temp folder, registered it with `osa add`, and ran `osa start` against a separate temp `--home`. It installed dependencies, generated `.env` with a real `SESSION_SECRET`/`ADMIN_PASSWORD`, picked a free port, started, and answered `GET /` (200) and `/api/status.json` correctly. Stopped cleanly with `osa stop`. Ran `osa check` on the project — `osa.json is valid`. (This session is a cloud session with no local machine to double-click the launcher on — see the hand-off note below.)
- `LICENSE` (MIT) fetched via `scripts/fetch_text.py license MIT` from the SPDX license-list-data source. `CODE_OF_CONDUCT.md` fetched via `scripts/fetch_text.py coc` (Contributor Covenant 3.0) with the user's email as the private reporting contact.

## Phase 8 — Release

- Not published. This is a cloud session — the working directory isn't the user's own machine, so there is no "publish when ready" step to defer; the user gets the project files and decides what to do with them (see hand-off message).
