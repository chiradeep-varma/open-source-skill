# Design direction — rustic-fjord

## Personality (three words)
**Quiet. Plain. Sure-footed.** A scheduling poll is infrastructure for a decision other people have to make quickly — it should get out of the way, look trustworthy to a stranger who clicks a link with no context, and never compete with the grid of options for attention.

## Grounding
The codename evokes cold, clear water and unfinished stone/wood — calm, a little cold, nothing decorative. That maps directly onto the wedge from `ui-research.md`: the incumbent's biggest complaint is visual clutter (ads, upsells) inside the working page; the opposite of that is *quiet*, not *flashier*.

## Typography
- UI/body: a plain geometric-humanist sans (system UI stack: `-apple-system, "Segoe UI", Inter, Roboto, sans-serif` — no webfont dependency, keeps the prototype self-contained).
- Numerals (vote counts, dates) use tabular figures so the results grid stays aligned.
- No display/serif face — a second family would work against "plain."

## Color
Deep slate-ink and cold sand, not Doodle's teal/coral/yellow and not a generic blue/purple SaaS gradient:
- `--ink-900 #10201d` (near-black, green-black — text, headers)
- `--fjord-600 #2b5f5a` (deep teal-slate — primary actions; deliberately duller/greyer than Doodle's brighter teal)
- `--fjord-100 #dfeceb` (pale wash — selected/hover backgrounds)
- `--sand-500 #b08a5c` (warm clay — the one warm accent: "If need be" state, small emphasis)
- `--yes-600 #3a7a52` / `--no-600 #a4443a` (muted, desaturated green/red for vote states — never neon)
- `--bg #fbfaf7` (warm off-white, not pure white) / dark mode `#12201d` background with lightened tokens.
Validated for AA contrast on body text and interactive states (see review).

## Spacing, radius, icons, motion
- 8px spacing scale. Generous whitespace around the results grid specifically — it's the one thing on the page competing for attention, so nothing else should.
- Small, consistent corner radius (6px) — plain, not pill-shaped/bubbly (avoids Doodle's rounded-playful feel).
- No icon font/emoji. The only glyphs are the three vote states, drawn as simple SVG shapes (check / tilde / empty), plain-colored, not illustrative.
- Motion: a single 120ms opacity/transform transition on state changes (vote toggle, finalize). Nothing decorative, no page-load animation.

## Copy voice
Plain and direct, second person, no exclamation points, no "let's find your perfect moment" marketing tone. "Add a time." "You're marked as available." "3 of 5 people have voted."

## Differs from
- **The incumbent**: no teal/coral/yellow playful-consumer palette, no rounded-bubbly shapes, no marketing chrome inside the working page.
- **Generic defaults**: no blue/purple gradient wash, no untouched component-kit look, no drop-shadow cards for everything — the results grid uses hairline borders and background-color states instead of shadows.
