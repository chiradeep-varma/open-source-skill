# Design direction: velvet-acorn

## Personality

Three words: **quiet, precise, reassuring.** A status page's only job during an incident is to be read correctly and fast by someone who's worried — so the interface stays out of the way and color carries meaning, not mood.

## Grounding

The subject is trust under stress: components and incidents. Nothing about the page should compete with the status banner for attention. A warm, paper-like neutral surface (not the cold blue/indigo of typical SaaS or the incumbent's product-marketing gloss) keeps the page calm even when it's reporting a major outage.

## Typography

| Role | Family (license) | Size / weight / line height |
|---|---|---|
| UI text | Inter (SIL OFL 1.1) | 15px/1.5, weight 400; labels 13px/500 |
| Headings | Inter | 28px/1.2 weight 600 (h1), 18px/1.3 weight 600 (h2) |
| Numbers, timestamps, incident refs | JetBrains Mono (SIL OFL 1.1) | 13px/1.4, weight 400–500 |

Why: Inter is a plain, highly legible humanist sans that doesn't read as "marketing site." The monospace for timestamps and incident IDs gives the admin/ops parts a slight technical texture without resorting to icon decoration.

## Color tokens

| Token | Value (light) | Value (dark) | Use |
|---|---|---|---|
| `--bg` | `#F7F5F1` | `#14171A` | page background |
| `--surface` | `#FFFFFF` | `#1C2024` | panels, inputs, cards |
| `--text` | `#1A1D1F` | `#ECEDEE` | body text (≈15.5:1 / ≈14.8:1) |
| `--text-muted` | `#5C6166` | `#9BA1A6` | secondary text (≈5.2:1 / ≈5.6:1) |
| `--border` | `#E3E0DA` | `#2A2E33` | dividers, input borders |
| `--accent` | `#2B5D53` | `#5FA394` | links, primary buttons only |
| `--success` | `#2E7D32` | `#5FBF66` | operational |
| `--warning` | `#B8860B` | `#E0B84D` | degraded / partial outage |
| `--danger` | `#C1442A` | `#E5735A` | major outage |
| `--maintenance` | `#5B6B8C` | `#8FA0C2` | scheduled maintenance |

Dark mode: yes, via `prefers-color-scheme`, because operators check a status page at all hours during an incident.

## Space, shape, elevation

- Spacing scale: 4px base (4/8/12/16/24/32/48).
- Radius: 6px — enough to soften, not enough to look bubbly.
- Borders vs. elevation: flat 1px borders throughout; no drop shadows except a 1px ring on focus states. A status page reporting an outage shouldn't look playful.

## Iconography and motion

- No icon library. Status is shown as a solid 8px circle in the state color plus its text label — never a decorative icon.
- Motion: a single 150ms fade when a status or incident list updates; nothing else animates.

## Copy voice

Plain, sentence case, active voice. Buttons: "Post update", "Resolve incident", "Add component". Error example: "Couldn't save — check the required fields and try again."

## Screens in the core loop

| Screen | Primary action | What the eye lands on first | Density |
|---|---|---|---|
| Public status page | Read status | Overall status banner | Medium |
| Public incident history | Read past incidents | Month grouping headers | Medium |
| Admin login | Sign in | Password field | Low |
| Admin dashboard | Manage components / open incident | Component list + "New incident" button | Medium |
| Admin incident detail | Post update / resolve | Update composer | Medium |

## Differentiation check

No blue/indigo/purple gradient, no bubbly rounded cards, no marketing hero, no stock icon set — a warm neutral paper background and mono timestamps give it a distinct, slightly editorial feel, different from both Statuspage's cooler product-marketing look and generic SaaS-template defaults.
