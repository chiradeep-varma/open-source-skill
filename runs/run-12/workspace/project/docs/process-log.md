# Process log

## Phase 1 — Identify
- Target: Bitly (bitly.com). One clear match, no naming collision worth checking — proceeded without asking.

## Phase 2 — Charter
- Written by assumption per "just build it" (Prototype mode, explicit). See `docs/charter.md` change log.

## Phase 3 — Research
- `WebFetch` was blocked by the environment's outbound proxy for every direct page fetch attempted (bitly.com, bitly.com/pages/pricing, yourls.org). Recorded as a hard environment limitation; all research instead came from `WebSearch`, which returns synthesized snippets over primary/secondary pages with cited URLs.
- Per the evidence standard this caps every claim at `reported`, not `confirmed` — none were silently upgraded. This satisfies the Prototype research floor on breadth (site/product overview, pricing/tiers, review-mined love/pain themes, 2 rivals — YOURLS and Dub.co, UI-convention pass) but not on fetch method; noted honestly rather than claimed as fully met.
- Fetched/searched (10 sources, all logged with access date 2026-09-25): see `docs/research/dossier.md` §Sources.
- Sufficiency check: can explain why people pay for Bitly (branded domains + analytics), sketch its core loop/data model (Link → Clicks, optional QR), name its hardest problems at its own scale (redirect latency, bot filtering, aggregation), and reason about it in situations not directly looked up (e.g., what a self-hosted version doesn't need to solve). Sufficient to move on.

## Phase 4 — Synthesize
- Concept model, parity matrix (`docs/product/parity-matrix.md`), better-thesis, and one-page brief (`docs/brief.md`) written from the dossier.

## Phase 5 — Guardrails
- Codename `sunny-thicket` generated via `scripts/codename.py --avoid bitly`.
- License: MIT, decided in ADR-0002, after reading `references/legal-and-licensing.md` §1–3 and §10 guidance.
- Provenance log written (`docs/legal/provenance.md`): confirms no target source code was ever read (Bitly is proprietary; YOURLS and Dub's code were never opened, only their public project descriptions).

## Phase 6 — Design
- Read `references/ui-design.md` in full before designing.
- UI research pass written (`docs/design/ui-research.md`), sourced from the same search-based research (no screenshots saved to the repo, per the skill's rule).
- Design direction written (`docs/design/direction.md`): personality "quiet, precise, durable", warm off-white/near-black + muted teal palette, Inter + IBM Plex Mono, borders-not-shadows, deliberately differentiated from Bitly (orange, marketing-forward), YOURLS (dated/unstyled) and Dub (dark Vercel-style gradient look).
- ADR-0001 (single-process + SQLite) and ADR-0002 (MIT license) recorded.

## Phase 7 — Build
- Read `references/build-and-release.md` before scaffolding.
- Built a single Node.js/Express + SQLite app per ADR-0001: `server/{db,auth,index}.js`, `server/models/links.js`, `server/lib/{codes,clickMeta}.js`, `server/import/bitlyCsv.js`, `server/routes/{auth,redirect,dashboard,api}.js`, EJS views, and hand-written CSS/JS following `docs/design/direction.md` (no CSS framework).
- **Automated tests**: `test/links.test.js` (12 cases: link creation/validation, custom-code collisions, disable/expiry via `isLive`, cascade delete, click-stat aggregation, dashboard click counts) and `test/bitlyCsv.test.js` (CSV parsing incl. quoted fields, import with code reuse, missing-`long_url` skip, code-collision fallback, missing-column error). Ran with `npm test` (`node --test`): **12/12 passing**, confirmed both before and after the Phase-7 CSS fix below.
- **Manual verification against reality** (not just intentions): started the app the documented way (`npm start` with a real `.env`), then drove the whole core loop with `curl` — login (good/bad credentials), auth-gated dashboard and API, link creation, redirect with click logging (verified referrer/device/browser parsing across two different User-Agent/Referer combinations), 404 on an unknown code, JSON stats (verified `uniqueVisitors` dedup by IP hash), QR code (verified PNG output), Bitly CSV import (verified code reuse from the `link` column), JSON export, disable (verified disabled links 404 on redirect), and delete. All matched the concept model in the dossier.
- **Screenshot review** (`references/ui-design.md` §6): used Playwright (already available in the environment) headlessly to capture the login, dashboard, stats (empty and populated), and error/"gone" screens at desktop (1280px) and phone (390px) widths, plus dashboard/stats in dark mode. Saved to `docs/design/screenshots/`.
  - Reviewed each capture against the direction's three words, the slop list, and "could this be mistaken for Bitly/YOURLS/Dub" — no slop tells found, and the look is clearly its own (warm off-white/near-black, muted teal, borders not shadows, monospace codes).
  - **Found and fixed a real bug from the phone screenshot**: the create-link form had a large blank gap between the URL and custom-code fields. Cause: `.field-grow`'s `flex: 1 1 260px` is a *width* basis in the desktop row layout, but the same rule was still active once the mobile media query switched `.create-form` to `flex-direction: column`, where a flex-basis is read as a *height* instead — stretching the first field to 260px tall. Fixed by resetting `.field-grow { flex: initial; }` inside the `max-width: 720px` media query. Re-captured the phone screenshots afterward to confirm the gap was gone (`docs/design/screenshots/dashboard-phone.png`).
- Parity matrix statuses updated to reflect what was actually verified working (`docs/product/parity-matrix.md`).

## Phase 8 — Release
- Not started; publishing is the user's call. Pre-launch checklist in `references/build-and-release.md` §8 not yet run.
