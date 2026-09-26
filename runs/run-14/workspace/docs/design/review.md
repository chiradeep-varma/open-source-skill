# Design review — rustic-fjord

## Honest limitation
This session had no browser-automation tool available (no Playwright/Puppeteer-style tool in the toolset, and `WebFetch` — which could at least have rendered a page — was blocked by the sandbox's egress policy all session; see `docs/process-log.md`). **No actual screenshots were captured.** What follows is a source-level review (HTML/CSS read against the four data sets, plus functional verification through the running server via `curl`), not a verified pixel review. Treat the mobile/overflow claims below as reasoned-but-unverified, and re-run this review with a real browser before shipping past Prototype mode.

## Screens reviewed (by reading `views/*.ejs` + `public/style.css`, and exercising each state through the running server)
1. Home / create-poll form
2. Participant voting page — empty (no votes yet), one participant, many participants, finalized
3. Admin page — open, finalized
4. Not-found page

## Weaknesses found, three per screen, before any verdict

**Home / create-poll**
1. The timezone field is invisible (hidden input, filled by JS) — a user with JS disabled gets `UTC` silently instead of an error or a visible fallback. Acceptable for a prototype (no-JS is an explicit non-goal), but worth a note in the README.
2. No client-side feedback while typing that a title is required until after a failed submit; the first-time error only appears after a full round trip. Fine for a prototype, a rough edge for later.
3. The "+ Add another time" button has no visual limit — a user could add 50 rows with no scroll affordance, which would make the create form very long. Not fixed this round; flagged for M2.

**Participant voting page**
1. **Verified via curl, not visually**: with a long participant name (tested with `Smith, "Ace"`-style edge cases in the CSV test, not yet a 100+ character name on the actual grid) — `td.name-cell` has `white-space: normal`, which should wrap rather than overflow, but this is reasoned from the CSS, not seen.
2. The vote button's three-state cycle (unset → yes → if-need-be → no → yes…) has no tooltip explaining the click behavior beyond the legend above the grid; a first-time user could be confused about what one click vs. three clicks does. Legend addresses this but isn't inline on the buttons themselves.
3. `table.grid { overflow-x: auto }` is applied only under the `@media (max-width: 560px)` rule — reasoned to prevent horizontal page scroll on a poll with many options on a phone, but not confirmed against `scrollWidth <= innerWidth` with a real viewport, because no browser tool was available.

**Admin page**
1. The participant-link box is populated only by JS (`app.js` sets `textContent`); with JS disabled, the admin sees an empty box with no link to copy. Same no-JS caveat as the create form.
2. The finalize radio list re-states each option's vote counts inline in plain text next to the radio — dense on a long list of options; acceptable for a handful of options (the prototype's expected scale) but would want a table layout if the option count grows.
3. No confirmation step before "Finalize this time" — a misclick finalizes immediately. Reopening is one click away (`/reopen`), so the cost of a mistake is low, but this is a deliberate simplicity tradeoff worth flagging rather than a silent gap.

## Slop-list check
- No untouched component-kit look: custom CSS, no UI kit dependency.
- No purple/blue gradient wash: palette is deep slate-teal + warm sand (see `docs/design/direction.md`), verified by reading the token values.
- No identical drop-shadow cards for everything: `.card` uses a hairline border, no box-shadow.
- No emoji/decorative icons: the only glyphs are the three vote-state marks (✓ / ~ / ✕) and a single location pin used once, functionally.
- No marketing hero copy inside the app: copy is plain and instructional throughout (checked every `.ejs` file's text nodes).
- Empty state: "No one has voted yet. Be the first." — present. Error state: the `errors` banner on the create form — present. 404 page — present.

## What was fixed as a result of this pass
- Legend wording changed from "No / click to clear" to plain "No" (the three-state cycle never returns to blank once started, so the original copy was inaccurate) — see the diff in `views/poll.ejs`.

## Claims check (README vs. running app)
Every feature the README claims (poll creation, no-login voting, edit-your-own-vote, live results, finalize, CSV export, no ads) was exercised against the running server this session — see `docs/process-log.md` for the exact `curl` transcript. Nothing in the README describes a capability that wasn't verified running.

## Incumbent-look check
Palette, shapes, and copy voice were checked against `docs/design/direction.md`'s stated differences from Doodle's reported teal/coral/yellow, rounded-bubbly, marketing-inflected style — no color, shape, or copy choice in this codebase matches that description.
