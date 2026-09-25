# Provenance log

## Sources that informed this build
All research was conducted via the `WebSearch` tool only (see `docs/research/dossier.md` for the full source list and access dates of 2026-09-25). Every source is a public marketing page, help-center article, or third-party review/comparison aggregator, surfaced as search-result summaries. `WebFetch` (which would have opened a primary page directly) was unavailable in this environment for the entire session (blocked by the sandbox's egress policy — confirmed with a direct `curl` test as well, which returned `403` on the CONNECT tunnel to both doodle.com and en.wikipedia.org).

Informed the **product concept and workflows only**:
- Doodle's own history blog post and help-center article descriptions (poll creation and voting steps), as summarized by search results.
- Independent how-to guides (Columbia Tech Hub, meetergo) describing the same flow.
- Review aggregators (Capterra, Trustpilot, and synthesis blogs) for user love/pain themes.
- Comparison roundups covering Rallly, When2meet, and Crab Fit, for the competitive field.

## What was never accessed
- **No Doodle source code, client bundle, or de-minified/source-mapped JavaScript** was read, fetched, or reverse-engineered. No page from doodle.com was fetched at all this session (the tool that would do so was unavailable) — only search-engine summaries of public pages were used.
- **No Doodle assets**: no icons, illustrations, fonts, or images were copied or referenced.
- **No Doodle copy**: all UI text, error messages, and documentation in this repository were written fresh for this project.
- **No Doodle name, logo, or color system** appears anywhere in this project. The codename `rustic-fjord` was generated randomly (`scripts/codename.py --avoid doodle`) and contains no reference to Doodle's marks.
- **No accounts, exports, or private data** belonging to Doodle or any user of Doodle were used — the charter's "Assets" section confirms none were supplied.
- **No competitor (Rallly, When2meet, Crab Fit) source code was read either.** They appear only in the dossier's market lens, as prior art to differentiate against, and as UI research subjects at the pattern level (see `docs/design/ui-research.md`) — never as code or assets to copy.

## License
MIT, fetched verbatim via `scripts/fetch_text.py` (see `docs/process-log.md` for the exact command and result), holder "The rustic-fjord contributors".
