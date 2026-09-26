# Design direction: west-larch

## Personality

**Direct, calm, legible.** This is infrastructure for someone else's audience to click through fast — it should get out of the way, not perform "creator energy" with gradients and pill buttons the way the category defaults to.

## Grounding

The product is a list of destinations. The links and their labels are the content; everything else (chrome, theme, decoration) should be quiet enough that the eye lands on the link text first, every time — on both the builder and the public page.

## Typography

| Role | Family (license) | Size / weight / line height |
|---|---|---|
| UI text | System UI stack (`-apple-system, Segoe UI, Roboto, sans-serif`) — no network font requests | 15px / 400 / 1.5 |
| Headings | Same stack, 600 weight | 20–28px / 600 / 1.25 |
| Numbers / stats | System monospace stack (`ui-monospace, SFMono-Regular, Menlo, monospace`) | 13–14px / 500 |

Why: a self-hosted tool shouldn't make every visitor's browser fetch a Google Fonts file just to see someone's link page — system fonts keep it fast, private and license-free, and the plainness matches "direct."

## Color tokens (base / "Paper" theme)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#faf7f2` | page background |
| `--surface` | `#ffffff` | cards, inputs |
| `--text` | `#211d18` | body text (contrast vs bg: 14.9:1) |
| `--text-muted` | `#6b6156` | secondary text (contrast: 4.6:1) |
| `--border` | `#e4ddd1` | dividers, card borders |
| `--accent` | `#b3521f` | primary actions only (burnt amber — a nod to a larch's autumn needles) |
| `--success` | `#3f7d4a` | |
| `--warning` | `#a3690a` | |
| `--danger` | `#a83b2f` | |

Four more presets (Ink, Moss, Clay, Slate) redefine these same tokens; see `src/public/css/themes.css`. Dark mode: yes, via the "Ink" and "Slate" presets and a `prefers-color-scheme` default.

## Space, shape, elevation

- Spacing scale: 4px base (4/8/12/16/24/32/48).
- Radius: 6px (small, rectangular — deliberately not the category's pill shape).
- Elevation: a single 1px border, no drop shadows — flat and calm.

## Iconography and motion

- No icon font/CDN; the handful of icons needed (edit, delete, up/down, eye) are inline SVG, stroke width 1.75, 16–18px.
- Motion: a single 120ms opacity/transform transition on hover/press; nothing decorative, nothing on the public page beyond a link's own hover state.

## Copy voice

Plain, sentence case, active voice. Buttons: "Add link", "Save changes", "Copy link". Error example: "That username is taken. Try another."

## Screens in the core loop

| Screen | Primary action | What the eye lands on first | Density |
|---|---|---|---|
| Sign up / log in | Submit | The form fields | Low |
| Dashboard | Add link | The link list | Medium |
| Public profile | Click a link | The first link | Low |

## Differentiation check

Rectangular left-aligned cards, flat color themes with no gradients, and system typography with no external requests separate this from Linktree's centered pill-button, pastel-gradient look, and from generic component-kit defaults (no purple/blue gradient wash, no identical shadowed cards, no emoji icons).
