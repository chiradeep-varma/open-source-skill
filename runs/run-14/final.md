**rustic-fjord is ready**: a free, self-hosted group-scheduling poll — propose times, share one link, vote with no account, finalize a winner, export CSV. It's a full software project at `/tmp/ossa-run.4pd6o5`, in this cloud session's working directory (not the desktop launcher folder, which this session can't reach — see below).

**To use it here:** `npm install && npm run migrate && npm start`, then open http://localhost:3300.

**On your own machine (to use the one-click launcher):** copy the `rustic-fjord` folder into `~/Documents/open-source-anything/`, run `npx github:chiradeep-varma/open-source-skill setup` once, then double-click **Start projects** → **Start** next to rustic-fjord → **Open**. No sign-in needed — it has no accounts by design.

**What works:** the full core loop — create poll → share link → vote (Yes/If-need-be/No, edit-your-own-vote) → live results grid → finalize → CSV export, with timezone-correct display per viewer. Verified end-to-end against the running server (curl walkthrough) and with automated tests: `npm test` → **17/17 passing**, including a test that fires five repeat submits and confirms no duplicate votes land in the database. A fresh-checkout launcher test (install → migrate → start → respond → stop) also passed.

**Not yet:** `.ics` calendar invites, email notifications, calendar-provider sync, and organizer accounts (a secret admin link stands in for now) — all listed in `ROADMAP.md`. Also worth knowing: this session's web-fetch tool was blocked by sandbox policy all session, so the research behind it (in `docs/research/dossier.md`) is search-summary-based rather than fetched-primary-source, and no real browser screenshots exist yet (`docs/design/review.md` is explicit about both gaps).

What would be most useful next — `.ics` invites so it's a real drop-in Doodle replacement for calendar apps, or should I open it in a browser next time you're at a machine and iterate on the visuals?
