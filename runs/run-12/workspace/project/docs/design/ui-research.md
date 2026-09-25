# UI research: link shorteners

_Sources: Bitly marketing/support pages, YOURLS project site, Dub.co marketing site — all via search synthesis (see `docs/research/dossier.md`). Observations recorded in words; no screenshots saved to this repository, per the skill's rules._

## Screens the core loop needs
- A **link list/dashboard**: every product in the category leads with a table of your links (destination, short code, click count, created date), because that's the object users manage most often. [reported, S1/S8]
- A **create link** action, usually a single prominent field for the long URL, with custom-slug as a secondary/expandable option rather than a separate page.
- A **per-link stats page**: a clicks-over-time chart is the convention users expect first, then breakdowns (referrer, device, geography) below it. [S2/S8]
- A **QR code view**: shown alongside a link's short URL, downloadable as an image.

## Conventions worth adopting
- Short codes are shown in a distinguishable, copy-friendly format (commonly monospace) with a one-click copy action — a small but consistently expected affordance across the category.
- Stats pages default to "last 30 days" or "all time" with a simple range toggle, not a complex date-range picker — this is a lightweight tool, not a BI dashboard.
- Disabling a link (instead of only deleting) is a pattern reviewers value, since printed/shared links shouldn't 404 outright.

## What reviewers complain about (interface-relevant)
- Analytics described as "cumbersome" and shallow in reporting depth [S10] → our stats page should surface referrer + device + a real time series by default, not bury them behind extra clicks.
- Tier-gated features shown but grayed out/upsold in the UI is a specific annoyance mentioned in review themes → our UI never shows an upsell; every screen shows only what's actually available.

## Density and tone
- This is a developer's personal tool for side projects, not a marketing team's shared workspace — so it should read as a dense, fast, developer-facing utility (closer to a self-hosted admin panel) rather than a spacious consumer marketing product. This also matches YOURLS' audience but should feel considerably more polished and less dated.

## What makes the category's best products feel well made
- Speed of the create-link action (no multi-step wizard for the common case).
- A stats page that leads with the number that matters (total clicks) and a chart, not a wall of settings.
- Clear, immediate feedback that a link was created (the new short URL shown and copyable instantly).
