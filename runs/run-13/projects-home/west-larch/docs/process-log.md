# Process log: west-larch

## Phase 1 — Identify
- Identified target as Linktree (linktr.ee), an unambiguous single match — no name collision found. Proceeded without a confirmation checkpoint per the user's "Prototype mode, just build it" instruction.

## Phase 2 — Charter
- Wrote `docs/charter.md`. All items marked "assumed" — no clarifying questions asked, per explicit instruction.

## Phase 3 — Research
- Fetches attempted: `WebFetch https://linktr.ee` and `WebFetch https://linktr.ee/s/pricing` — both failed (`proxy refused the connection`). Checked `$HTTPS_PROXY/__agentproxy/status`: proxy itself reported healthy, so this was a target-side/tool-side refusal, not a proxy misconfiguration.
- Fell back to `WebSearch` for: general reviews/complaints, pricing tiers, company history/funding, feature list, and open-source alternatives. Five distinct searches, each returning multiple sources, cited in `docs/research/dossier.md` (S1–S6).
- Research-floor check for Prototype mode: pricing (yes, via search) · review mining (yes, Trustpilot/Capterra/G2 aggregated) · 2–3 rivals (yes: Beacons/Milkshake/Campsite proprietary; LinkStack/LinkBreeze/LittleLink/Singlelink/Kytelink/Linky open) · UI research pass (yes, from descriptions, recorded in `docs/design/ui-research.md`). **Not met at `confirmed` tag level** — every claim is `reported` since the primary site itself was unreachable. Flagged explicitly in the dossier's summary and in `docs/brief.md` risks.
- Sufficiency test: could explain why people pay (branding removal, advanced analytics, scheduling), sketch the core loop and domain model (profile → ordered links), name three hard problems (concurrent click counting, non-technical page builder UX, fast themeable public pages), and reason about untested cases (e.g., billing lapse taking a page down) from the review themes. Test passed; stopped researching there.

## Phase 4 — Synthesize
- Wrote `docs/product/parity-matrix.md` and `docs/brief.md`.

## Phase 5 — Guardrails
- Generated codename via `python3 scripts/codename.py --avoid linktree` → `west-larch`.
- License decision recorded in `docs/adr/0002-license.md`: AGPL-3.0.
- Provenance log: `docs/legal/provenance.md`.

## Phase 6 — Design
- UI research: `docs/design/ui-research.md` (from search descriptions, not live screenshots — noted as a limitation).
- Design direction: `docs/design/direction.md`.
- Stack ADR: `docs/adr/0001-stack-and-storage.md`.
- `ROADMAP.md` written.

## Phase 7 — Build
- Scaffolded Node/Express/EJS/better-sqlite3 app per ADR-0001: `src/db.js`, `src/models/{users,links}.js`, `src/lib/validate.js`, `src/middleware/{auth,csrf,rateLimit}.js`, `src/routes/{auth,dashboard,public}.js`, `src/app.js`, EJS views, `src/public/css/{base,themes}.css`.
- `npm install` succeeded (155 packages, 0 vulnerabilities) with Node v22.22.2.
- Automated tests: `npm test` (Node's built-in `node:test` runner) — **19/19 passing**. Covers unit-level validation, link reordering/click-count/visibility logic against an in-memory SQLite database, username uniqueness enforced at the DB level, and a full HTTP integration test (signup → add link → view public page → click-through redirect → click count visible on dashboard; 404 for unknown username; dashboard redirects to /login when logged out; wrong password rejected).
- Manual run: started the app with `npm start` on `PORT=3901` (3000 was occupied by an unrelated process already running in this environment) after generating `SESSION_SECRET` and copying `.env.example` to `.env`. Confirmed via `curl` that security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) and session cookies are set.
- Browser walkthrough: installed Playwright + Chromium (`npx playwright install chromium --with-deps`) and scripted the full core loop (landing → sign up → dashboard empty state → edit profile/theme → add three links → public page → 404) at both desktop (1280×900) and phone (390×844) widths. Screenshots saved to `docs/design/screenshots/`.
- Screenshot review against the design direction and slop list found one real bug: on the dashboard, the link-edit row crammed order arrows, title, URL, Save, click count, Hide and Delete into one horizontal flex row inside the 560px-wide panel, causing the URL input to visually overlap the Hide/Delete buttons. Fixed by restructuring `dashboard.ejs`'s link row into two stacked lines (`link-row__top` for order/title/url/Save, `link-row__meta` for clicks/Hide/Delete below) and updating `base.css` accordingly (removed a since-redundant mobile-only override in the process). Re-ran the screenshot script after the fix and confirmed no overlap at either width. No other slop-list issues found: no gradients, no pill buttons, no emoji icons, empty/error states present and styled, flat themes with real contrast.
- Stopped the manual dev server (`pkill -f "node src/app.js"`) before the launcher fresh-copy test below.

## Phase 8 — Release
- **Fresh-copy launcher test:** copied the project to `/tmp/fresh-test/home/west-larch`, stripping `node_modules/`, `.env`, `data/` and `.osa/` first, then ran `node scripts/osa/osa.js --home /tmp/fresh-test/home start west-larch`. It installed dependencies, generated `SESSION_SECRET`, started the app, and printed `west-larch is running at http://localhost:3001/`. Confirmed with `curl` that it answered with `200 OK` and the expected security headers. Stopped it with `osa stop west-larch`, then ran `osa check /tmp/fresh-test/home/west-larch` → `osa.json is valid: west-larch (web)` / `Requirements are met on this machine.` Test artifacts removed afterward.
- Not published anywhere; publishing is the user's decision (Prototype mode, one session — the user can revisit Phase 8's launch checklist in `references/build-and-release.md` when ready).

## Known limitation of this session's research
- Direct `WebFetch` calls to any external host (including static, non-JS pages like `gnu.org` and `contributor-covenant.org`) were refused by this environment's egress policy; only the `WebSearch` tool could reach the open web. `LICENSE` (AGPL-3.0) and `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) were therefore reproduced from the assistant's own knowledge of these standard, unchanging legal/community texts rather than fetched verbatim. Both are extremely common, fixed documents, but a maintainer publishing this project should diff `LICENSE` against https://www.gnu.org/licenses/agpl-3.0.txt and `CODE_OF_CONDUCT.md` against https://www.contributor-covenant.org/version/2/1/code_of_conduct.html before relying on them for legal purposes.
