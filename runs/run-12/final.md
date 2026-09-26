**sunny-thicket** is built in `./project` — a self-hosted Bitly alternative: short links, a click-analytics dashboard (referrers, devices, browsers, a clicks-over-time chart), QR codes, and unique-visitor counts via privacy-preserving hashed IPs.

What's working (verified with `npm test` — 12/12 passing — and a full curl walkthrough of every endpoint):
- Create links (auto or custom short codes), redirect + click logging, disable/delete
- Full REST API with session or bearer-token auth (no tier gating, unlike Bitly)
- Bitly CSV importer and full JSON export
- Docker Compose one-command start, single SQLite file for everything

Design direction: quiet/precise/durable — warm off-white and near-black surfaces, a muted teal accent, monospace for short codes, borders instead of shadows — deliberately distinct from Bitly's orange, YOURLS' dated look, and Dub's dark gradient style. I screenshotted every core screen at desktop/phone widths and in dark mode with Playwright and actually caught and fixed a real CSS bug (a flex-basis mobile layout bug that left a big blank gap in the create-link form).

Everything's documented in `docs/` — charter, research dossier, brief, parity matrix vs. Bitly, ADRs, and self-hosting/importing/architecture guides. Full research notes are honestly flagged as `reported` (search-synthesized) rather than `confirmed`, since direct page fetches were blocked by this environment's proxy — noted in `docs/process-log.md`.

Not built yet (intentionally, to keep this a real one-evening wedge): multi-user accounts, GeoIP, link-in-bio pages, a UTM builder UI — all listed honestly in the README's status table.

To run it: `cp .env.example .env`, set `SESSION_SECRET` and `ADMIN_PASSWORD`, then `docker compose up -d`. Want me to also set up git and make an initial commit?
