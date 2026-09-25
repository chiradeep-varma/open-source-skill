# Design review: <codename>

> Written in Phase 7, after capturing the screens and before calling the UI done. You built these screens, so assume you're blind to their flaws; this page is how you find them anyway. See the skill's `references/ui-design.md` §6.

## How the captures were made

- Tool and script: <e.g. Playwright, `scripts/screenshots.js`>
- Widths: desktop 1280px and phone 390px. Dark mode: <yes, captured / not in this design>
- Data sets, each loaded before capturing:
  - **empty**: a new install with nothing in it;
  - **one**: a single item;
  - **many**: realistic volume (enough to scroll, paginate or fill a chart);
  - **long**: the longest value the validation allows in every text field, plus an unbroken string such as a long URL or email address.

## Mechanical checks

The overflow check runs on every screen, at phone width, with the **long** data set: `document.documentElement.scrollWidth <= window.innerWidth`.

| Screen | Data set | scrollWidth / innerWidth | Pass |
|---|---|---|---|
| | long | / 390 | |

## Screen by screen

Repeat this block for every core-loop screen, including the public-facing ones.

### <Screen name>

Captures: `screenshots/<file>.png`, …

**Three weaknesses first**, as a skeptical designer would write them, before deciding anything. "None" isn't an answer.
1. 
2. 
3. 

| Question | Answer |
|---|---|
| Where does the eye land in the first second? Is that the primary action or the main content? | |
| Slop tells from §4 present: card kit, gradients, template chrome, emoji, marketing patterns, filler copy, inconsistency, everything centered. Name each one and say why it's deliberate, or "none". | |
| Spacing, type sizes and radius drawn only from the tokens? | |
| User data shown exactly as entered (no case changes; truncation keeps the useful part)? | |
| Lists and charts right with empty, one, many and long data? | |
| Empty and error states designed, each with one clear next step? | |
| Could someone mistake it for the incumbent's product? | |

**Fixed:** <what changed, and the capture that shows it>
**Left as is:** <weaknesses kept, and why>

## Claims check

Every claim in the README's features, status table and "why" section, checked against the running app.

| Claim | Where it's true (test, file or capture) |
|---|---|
| | |

Remove or correct any claim you can't point to.
