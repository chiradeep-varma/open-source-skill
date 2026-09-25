# 2. Link-based identity instead of accounts

## Context
The dossier's core-loop research shows participants never need a Doodle account to vote; the charter makes "no login to participate" part of the better-thesis, and explicitly puts organizer accounts out of scope for this prototype.

## Decision
- A poll has a public **participant link** (`/p/:pollId`) and a separate, unguessable **admin link** (`/a/:pollId/:adminToken`) generated at creation time. Whoever holds the admin link can edit the poll and finalize it — the link itself is the credential.
- A participant's vote is tied to a per-participant **edit token**, generated on first vote and stored in the browser's `localStorage`. Returning with the same browser lets them update their own vote in place instead of creating a duplicate row; a different browser or a cleared `localStorage` is treated as a new participant (matching how link-based tools like this generally behave, and consistent with "no login").

## Alternatives considered
- **Full accounts (email + password or OAuth)**: matches Doodle's current organizer flow but pulls in a real auth system, sessions, and password/email handling that the charter explicitly excludes from this prototype's scope (see `ROADMAP.md` — Later).
- **Cookie-only identity**: rejected because it silently breaks across devices/browsers in a more confusing way than an explicit "this link is your key" model, and doesn't survive clearing cookies any better than `localStorage` does.

## Consequences
- Losing the admin link means losing control of the poll — documented in the UI and README as the tradeoff of "no accounts."
- The participant edit token is a convenience, not a security boundary: it prevents accidental duplicate votes from the same browser, not a determined actor from voting twice under different names. Acceptable for this trust model (small group meetups), documented as a known limitation.
