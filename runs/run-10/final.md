Clean repo, no stray test artifacts, `.env`/`data/` correctly gitignored and absent. The build is complete and verified.

## Formstead is built and working in `./project`

**What it is:** a self-hosted, open-source conversational form/survey builder — an open alternative to Typeform, with the pitch that matters for a nonprofit: **unlimited responses, no metering, your own $5/mo VPS.** Research showed Typeform's free tier was just cut to 10 responses/month and paid plans bill $25–$300+/mo by response volume — that's the whole reason this exists.

**Stack** (ADR-0001): one Node.js/Express process, SQLite (single file), server-rendered HTML with a small vanilla-JS enhancement layer — no build step, no SPA, no second database container. One `docker compose up -d --build` deploys it.

**What works** (verified live with curl against the real server, not just written):
- Admin login, form builder with 9 question types, reordering, required fields
- Branching logic (tested: skipping a question based on a prior answer)
- One-question-at-a-time public form with progress bar and a no-JS fallback
- Unlimited response collection, CSV export, per-response delete
- Webhook on every new response (tested against a throwaway listener)
- Honeypot spam protection, required-field validation — both confirmed to correctly reject/drop bad submissions

**Honestly not done yet:** Typeform import, file uploads, payments, custom domains — listed with reasons in `docs/product/parity-matrix.md` and `ROADMAP.md`. Also: I couldn't test the actual `docker build` (no Docker daemon in this sandbox), though the Dockerfile just runs the same commands already verified directly — worth a real `docker compose up` check on your VPS before fully relying on it.

**License:** AGPL-3.0-or-later, name "Formstead" — checked for collisions, none found (`docs/legal/provenance.md`).

Full research, charter, and decision records are in `docs/` if you want the reasoning behind any choice. One thing worth knowing: outbound web fetching was blocked by org policy in this session, so all Typeform research came from search-result snippets rather than direct page loads — flagged as `reported` throughout the dossier rather than `confirmed`, and worth a quick manual pricing-page check before quoting those numbers anywhere public.
