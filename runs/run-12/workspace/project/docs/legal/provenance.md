# Provenance log

## Sources that informed this build

All from `docs/research/dossier.md` (search-result synthesis over public marketing/docs/review pages — see Sources table there for URLs and access dates). No source below was code — all are product marketing pages, pricing pages, and third-party review aggregators.

- Bitly homepage, pricing page, free-plan/UTM blog posts, support docs — for feature inventory and pricing/gating shape only.
- G2 and Capterra review aggregations — for love/pain themes, used only as prose summaries (no verbatim review text copied).
- YOURLS project site — noted as prior art in the category, for positioning only; **its source code was never opened or read.**
- Dub.co marketing/blog pages and GitHub repository *listing* (name/description only, via search) — for positioning only; **its source code was never opened or read.**

## Never accessed

- Bitly's, YOURLS', or Dub's source code, in any form (no cloning, no decompiling, no reading of GitHub file contents for Dub).
- Any authenticated Bitly account, admin panel, or internal documentation.
- No Bitly data export was available this session; the CSV importer (`server/import/bitlyCsv.js`) is implemented from the documented export shape (long URL + short code + click count columns), not from a real file. It should be tested against an actual Bitly export before being trusted.

## Independent-creation discipline

All code (schema, API routes, redirect handler, analytics queries, EJS templates, CSS, client JS) was written fresh for this project from the concept model in `docs/research/dossier.md` and the design direction in `docs/design/direction.md`. No text, icons, illustrations, or layout was copied from Bitly, YOURLS, or Dub. The visual design (colors, type, spacing) was chosen to differ deliberately from all three — see `docs/design/direction.md` §"Differentiation check".

## Naming and branding

- Project codename: **sunny-thicket**, generated via the skill's `codename.py --avoid bitly` script — not derived from "Bitly" or any incumbent name.
- No Bitly trademarks, logos, or the orange brand color are used anywhere in the UI or docs.
- README carries the required non-affiliation note.
