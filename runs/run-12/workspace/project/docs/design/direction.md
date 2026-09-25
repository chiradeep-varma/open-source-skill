# Design direction: sunny-thicket

## Personality

**Quiet, precise, durable.** This is a developer's own infrastructure for their side projects — not a marketing tool being sold to them. The interface should feel like something you'd trust to keep running for years, not something trying to impress you.

## Grounding

The core object is a **link** — two strings (a code, a destination) and a stream of **events** (clicks) attached to it. The design leans on that: short codes get their own typographic treatment (monospace, like the code they are), and the numbers — click counts, timestamps — are the loudest thing on any screen, never decoration around them.

## Typography

| Role | Family (license) | Size / weight / line height |
|---|---|---|
| UI text | Inter (OFL) | 14px/1.5 body, 400 weight; 13px for secondary text |
| Headings | Inter (OFL) | 20px/600 page titles, 15px/600 section labels |
| Numbers / short codes | IBM Plex Mono (OFL) | 14–28px depending on context, 500 weight — used for short codes, click counts, and chart axis labels |

Inter is a dense, legible UI face with no strong "brand" association, right for an operator tool. Plex Mono ties the monospace treatment specifically to the product's core object (codes and counts) rather than using monospace everywhere.

## Color tokens

| Token | Value (light) | Value (dark) | Use |
|---|---|---|---|
| `--bg` | `#F7F5F0` | `#14161A` | page background (warm off-white / near-black, not stock white/gray) |
| `--surface` | `#FFFFFF` | `#1C1F24` | panels, inputs, table rows |
| `--text` | `#1A1D21` | `#EDEEF0` | body text (contrast ≈ 15:1 / 14:1) |
| `--text-muted` | `#5B6169` | `#9BA1AA` | secondary text (contrast ≈ 4.6:1 / 4.7:1) |
| `--border` | `#E2DFD6` | `#2A2E34` | dividers, input borders |
| `--accent` | `#2C6E63` (muted teal/forest) | `#4FA08F` | primary actions only |
| `--success` | `#2F7D4F` | `#5FBE85` | |
| `--warning` | `#B0791A` | `#E0A64A` | |
| `--danger` | `#B23B3B` | `#E06565` | |

Dark mode: yes, via `prefers-color-scheme`, since developers running their own tools commonly expect it.

Deliberately avoids Bitly's orange, and avoids the generic purple/indigo/blue-gradient default.

## Space, shape, elevation

- Spacing scale: 4px base (4/8/12/16/24/32/48).
- Radius: 6px for inputs/buttons, 8px for panels/cards — small and consistent, not the bubbly 16px+ "SaaS card" look.
- Borders, not shadows: panels are separated with a 1px `--border` line, not drop shadows. Flatter, calmer, and reads as a tool rather than a marketing page.

## Iconography and motion

- Icon set: a small set of hand-drawn inline SVGs (stroke width 1.75, 18–20px), used only where they carry meaning (copy, delete, disable, external-link) — not decoratively in headings or empty states.
- Motion: a 120ms opacity/transform transition on toasts and menu open/close only. No page-transition animation, no hover-lift on cards.

## Copy voice

Plain, sentence case, active. Examples:
- Button: "Create link" (not "Get Started" or "Shorten Now!")
- Empty state: "No links yet. Create your first one above."
- Error: "That short code is already taken. Try another one."

## Screens in the core loop

| Screen | Primary action | What the eye lands on first | Density |
|---|---|---|---|
| Dashboard (link list) | Create link | The create-link input at the top | Dense table |
| Link stats | Copy short URL / QR code | Total clicks number + clicks-over-time chart | Medium |
| Login | Sign in | Password field | Spacious (single form) |

## Differentiation check

Bitly's product is bright, orange-branded, marketing-forward, with upsell prompts throughout the UI. YOURLS is minimal to the point of being visibly dated (unstyled tables, default browser widgets). Dub leans into a slick, dark, "modern SaaS" look common to Vercel-adjacent products (sharp black/white with a bright accent, heavy use of gradients on its marketing site). sunny-thicket differs from all three: warm off-white/near-black surfaces (not pure white or pure black), a muted teal accent instead of orange or a bright saturated brand color, borders instead of shadows/gradients, and no upsell or marketing chrome anywhere in the authenticated UI — every screen shows only what the instance can actually do.
