# Provenance Log

## Sources consulted
- Bitly's own blog post on free-plan limits (bitly.com/blog/bitly-free-plan) — read for free-tier link/QR/retention limits only.
- Third-party pricing summaries (linklyhq.com, u2l.ai) — read for paid-tier price points and feature gating.

All of the above were read **only** for pricing-tier structure and feature-gating facts, recorded in `docs/research/dossier.md` with source and access date. No page's text, layout, imagery, or code was copied or paraphrased into this project.

## Sources never accessed
- Bitly's source code, mobile app binaries, or any decompiled/de-minified assets.
- Bitly's internal documentation, engineering blog deep-dives, or any NDA/insider material.
- Bitly's UI screenshots, icon set, illustrations, or marketing copy.
- Any bulk-scraped Bitly data or user data.

## Independent creation
The domain model (links, clicks, UA/geo enrichment), API shape, database schema, and all UI copy, layout, and code in this repository were written from scratch based on the general, publicly-known concept of a URL shortener with analytics (a widely implemented pattern, also present in prior open-source projects such as YOURLS, Shlink, and Kutt, none of which were consulted for this build). No Bitly code or assets were referenced at any point.

## Naming
Project name **Trimly** was chosen to be phonetically and visually distinct from "Bitly." Not exhaustively trademark-cleared — recommend a proper trademark/domain search before commercial use or public launch under this name.

## License
MIT. Rationale: this is a personal-use, self-hosted utility with no proprietary business-model component in this session; MIT maximizes ease of reuse and forking for other indie developers, consistent with the charter's motive (cost/ownership, not building a company).
