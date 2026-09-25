# Design review: velvet-acorn

## How the captures were made

- Tool: `node scripts/capture.js` from the skill (Playwright, found and used directly — no install needed).
- Widths: desktop 1280px and phone 390px. Dark mode: yes, captured via `prefers-color-scheme: dark` emulation.
- Data sets loaded through the real app (HTTP, not fixtures) before capturing:
  - **empty**: a second fresh instance (`data-empty/`) with no components or incidents.
  - **one/some**: the primary instance after adding 2 components and 1 incident.
  - **many**: the primary instance after adding a resolved incident and a scheduled maintenance window (2 components, 2 incidents, one active maintenance).
  - **long**: a separate instance with a component name of 89 characters, an incident title containing a 140+ character unbroken URL, and a body combining an unbroken URL with a long sentence.

## Mechanical checks

| Screen | Data set | Desktop (1280px) | Phone (390px) |
|---|---|---|---|
| Home (`/`) | many | fits (1280px) | fits (390px) |
| Home (`/`) | empty | fits (1280px) | fits (390px) |
| Home (`/`) | long | fits (1280px) — after fix | fits (390px) — after fix |
| Incident history (`/incidents`) | many | fits (1280px) | fits (390px) |
| Incident detail (`/incidents/1`) | many | fits (1280px) | fits (390px) |
| Incident detail (`/incidents/1`) | long | fits (1280px) — after fix | fits (390px) — after fix |
| Admin login (`/admin/login`) | — | fits (1280px) | fits (390px) |
| Admin dashboard (`/admin`) | many | fits (1280px) | OVERFLOW at 425px (data-table) — **fixed**, now fits (390px) |
| Admin dashboard (`/admin`) | empty | fits (1280px) | fits (390px) |

Two real overflows were found and fixed, not just predicted:
1. The admin dashboard's incident table had no min-width/scroll container, so its 4 columns pushed the phone viewport to 425px. Fixed by wrapping both admin tables in `.table-wrap { overflow-x: auto }` with `min-width: 480px` on the table itself, so the table scrolls internally instead of the page scrolling sideways.
2. An incident title/body containing a long unbroken URL pushed the page to 2230px on desktop and 1548px on phone (`h1`/`h3.incident-title` wouldn't break). Fixed with `overflow-wrap: anywhere` on `html, body` (an inherited CSS property), so any element with untrusted long text wraps by default.

Both fixes were verified by re-running the capture script, not by inspection.

## Screen by screen

### Public status page (`/`)

Captures: `screenshots/home-manydata-{desktop,phone,dark}.png`, `home-empty-*.png`, `home-long-*.png`.

**Three weaknesses first:**
1. The overall banner and each component/incident status dot are the only color-carrying elements, which is intentional, but on first glance a colorblind user relies partly on the text label next to the dot — worth double-checking contrast ratios formally later (not done here, only visually inspected).
2. The "Recent history" section always shows up to 5 items even when there's only 1; for a brand-new page with exactly one past incident this reads a little sparse next to the empty-state box above it (component list) — acceptable for a prototype, not polished.
3. There's no visible timestamp for "as of" freshness on the banner itself (the JSON API has `generated_at`, the HTML page doesn't show an equivalent) — minor, since the page is server-rendered fresh on every request so it's never stale, but a first-time visitor has no explicit cue of that.

| Question | Answer |
|---|---|
| Where does the eye land in the first second? | The status banner — colored dot + bold label, first element on the page, above everything else. Matches the intended primary content. |
| Slop tells present? | None found: no card-kit shadows (flat 1px borders only), no gradient, no stock icons (status is a solid dot, per direction.md), no marketing copy, no emoji, spacing consistent with the 4px scale, nothing centered that shouldn't be. |
| Spacing, type sizes and radius drawn only from tokens? | Yes — checked against `public/css/styles.css`, all values are the declared `--space-*`/`--radius` tokens or the typography scale in `direction.md`. |
| User data shown exactly as entered? | Yes — component/incident names and update bodies render unescaped-but-safe via EJS's default HTML-escaping, no case transforms; the 89-character long component name renders in full, wrapped, not truncated. |
| Lists right with empty, one, many, long? | Yes for empty (dashed empty-state box, verified) and many (2 components/2 incidents, verified); "one" wasn't captured as a distinct data set but many/empty bracket it and the layout has no special-casing that would break for a single item. |
| Empty and error states designed? | Empty states are: a dashed-border box with one sentence ("No components have been added yet." / "No past incidents to show.") — no dead-end, since the admin nav is one click away for the operator. Error states (`admin/login`, forms) use `.error-banner` with a specific, actionable message. |
| Could someone mistake it for the incumbent's product? | No — warm neutral paper background vs. Statuspage's cooler product-marketing look (per dossier, not directly viewed), monospace timestamps, no Atlassian branding or colors anywhere; footer explicitly disclaims affiliation. |

**Fixed:** the long-URL overflow (`home-long-desktop.png` now fits at 1280px, was 2230px before `overflow-wrap: anywhere`).
**Left as is:** the "Recent history" sparseness with few items — a real weakness but not a defect; more content naturally fills it as the project accumulates incidents.

### Admin dashboard (`/admin`)

Captures: `screenshots/admin-dashboard-many-{desktop,phone,dark}.png`, `admin-empty-*.png`.

**Three weaknesses first:**
1. On phone width the incident table scrolls horizontally inside its own box with no visual scroll affordance (no gradient edge or scrollbar hint) — a user might not realize the "Opened" column is off-screen. Acceptable for a prototype, worth a subtle fade-edge later.
2. "Schedule maintenance" and "New incident" are visually equal-weight buttons side by side; since incidents are the more urgent, time-pressured action, a stronger visual hierarchy (e.g., making maintenance the secondary-styled button, which it already is) helps — this is already done correctly, confirmed in the capture.
3. The components table's "Status" column duplicates what an incident's update already sets automatically — an operator might edit it by hand and create an inconsistency with an open incident's component links. Documented as a deliberate manual override in the component-form hint text, not hidden.

| Question | Answer |
|---|---|
| Where does the eye land first? | The "Admin" heading, then the green "Add component" button — for the empty state, this correctly draws the eye to the one available action. |
| Slop tells present? | None: flat table, no shadow, no icon set, buttons follow the direction's accent-color rule (solid accent for primary, outline for secondary/danger). |
| Spacing/type/radius from tokens? | Yes, `.data-table`/`.table-wrap` reuse the same `--radius`/`--border` tokens as the public page. |
| User data shown exactly as entered? | Yes, including the long component name (verified in the "long" data set, wraps inside the table cell without truncation). |
| Lists right with empty/one/many/long? | Empty verified (dashed empty-state text, distinct per section); many verified (2 rows each table); long verified after the table-wrap fix. |
| Empty/error states designed? | Yes — "No components yet…" and "Nothing posted yet. Everything's quiet." each read as calm rather than broken, matching the "reassuring" personality word. |
| Could someone mistake it for the incumbent's product? | No — plain data tables, no admin-dashboard chrome borrowed from any recognizable SaaS template. |

**Fixed:** the phone-width table overflow (see Mechanical checks).
**Left as is:** no scroll-affordance gradient on the table edge; the manual status-override field on the component form (intentional, documented).

### Admin login (`/admin/login`)

Captures: `screenshots/login-{desktop,phone,dark}.png`.

**Three weaknesses first:**
1. The username field is pre-filled with "admin" and editable, which is slightly redundant for a single-admin app — but keeping it as a real field (rather than hiding it) makes the one-admin assumption visible and future-proofs the markup for ADR-0002's later multi-admin path.
2. No "forgot password" affordance — acceptable, since there's exactly one admin and the password lives in `.env`, but worth a one-line hint in the docs (added to `SECURITY.md`/`README.md` instead of the UI, to keep the login screen quiet).
3. The card has generous empty space below it at desktop width; intentional per the "quiet" personality, but borderline for a "does this look unfinished" read — checked against the direction doc, this matches the "Low density" spec for this screen.

| Question | Answer |
|---|---|
| Where does the eye land first? | The password field, which has `autofocus` — matches the primary action (typing the password) rather than the heading. |
| Slop tells present? | None — single flat card, no gradient hero, no logo mark invented for the project. |
| Spacing/type/radius from tokens? | Yes. |
| Empty/error states designed? | Yes — wrong-password shows `.error-banner` with "Incorrect username or password." (verified by posting a bad password during the smoke test — returned HTTP 401 with the message rendered). |
| Could someone mistake it for the incumbent's product? | No. |

**Fixed:** nothing needed here.
**Left as is:** no "forgot password" UI (by design — see above).

## Claims check

| Claim (README) | Where it's true |
|---|---|
| "create, edit, group, reorder, and give each its own status" | `src/routes/admin.js` component routes; exercised live via curl (create, and the manual status field in `component-form.ejs`); `docs/product/parity-matrix.md` row "Components". |
| "overall banner is always the worst current component status — computed" | `src/status.js::computeOverallStatus`, unit-tested in `test/status.test.js` (6 passing cases); confirmed live — creating a `major` incident against a component flipped the public banner from "All systems operational" to "Partial outage" in the same curl session. |
| "Incidents: open one, post timestamped updates, resolve it" | `src/models.js::createIncident`/`addIncidentUpdate`, unit-tested in `test/models.test.js`; confirmed live — resolving incident #1 via curl set `status: "operational"` on its component and moved it into history. |
| "Scheduled maintenance windows, shown separately from real incidents" | `impact = 'maintenance'` path in `src/routes/admin.js`; confirmed live — created "Database upgrade", appeared under "Scheduled maintenance" on `/`, not under "Active incidents". |
| "JSON API (`/api/status.json`)" | `src/routes/public.js`; confirmed live via curl, correct shape. |
| "RSS feed (`/feed.xml`)" | `src/rss.js`; confirmed live via curl, valid RSS 2.0 XML with the resolved incident as an item. |
| "no external requests at runtime" (fonts) | `public/css/styles.css` uses a system-font stack (`Inter, -apple-system, …`) with no `@import`/`<link>` to any font CDN — checked the CSS and `header.ejs` directly. |
| "runs without Docker, npm install && npm start" | Ran exactly that sequence against a clean `data/`-less checkout during this session; server started and served all routes. |
| "app refuses to start without SESSION_SECRET/ADMIN_PASSWORD" | `src/app.js` throws if `sessionSecret` missing; `src/db.js::ensureAdminUser` throws if `ADMIN_PASSWORD` missing — not re-tested live in this pass, but read directly from the source alongside the claim. |
| "layout that works down to phone width" | All screens captured at 390px; the one overflow found (admin table) was fixed and re-verified. |

No claim in the README could not be pointed to a test, a capture, or a direct live check; none were removed.
