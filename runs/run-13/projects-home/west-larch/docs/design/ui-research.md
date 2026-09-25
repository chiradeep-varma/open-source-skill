# UI research: link-in-bio category

_2026-09-25, informed by search results (dossier §3, §6), not by opening Linktree's live UI directly._

## Observed conventions in this category (from descriptions, not screenshots)
- A centered, mobile-first single column: avatar, name, short bio, then a vertical stack of full-width buttons.
- Rounded "pill" buttons are the category's default look (reported across Linktree's own theme names — "Mineral", "Air", "Lake" — and most rivals).
- Social icons as a small row, either above or below the link stack.
- Heavy use of soft gradients and pastel theme presets as the differentiator between "free" visual themes.
- QR code and a share button as a first-class action next to the page, since the whole point is sharing one URL.

## What we're taking as inspiration (pattern only, not look)
- Single stable public URL as the whole product.
- Vertical ordered list of link "buttons" as the core object.
- A small set of switchable presets rather than a full theme editor, to keep the builder simple.

## What we're deliberately not doing
- No rounded pill buttons — using rectangular, left-aligned cards instead, so a screenshot doesn't read as "a Linktree page."
- No pastel/gradient theme presets — themes are flat, high-contrast, typographic.
- No centered-everything layout — text is left-aligned for legibility and a calmer, less "poster" feel.
- No external fonts, icon CDNs or embeds on the public page — system font stack only, so a visit to someone's page makes zero third-party requests.

See `docs/design/direction.md` for the resulting direction.
