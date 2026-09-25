# Provenance Log — SlotPilot

## Sources used (informed the design)
- Calendly's public help-center pages describing availability, buffers, and calendar sync
  behavior (workflow description, prose only — no code):
  - https://calendly.com/help/availability-overview
  - https://help.calendly.com/hc/en-us/articles/14048208107287-How-to-use-buffers
  - https://calendly.com/help/how-to-connect-your-google-calendar
- Third-party pricing/review aggregators (for the business-model and user-voice lenses only):
  meetergo.com, axisconsulting.io, and Capterra-summary results returned by web search.
- Public listings of existing open-source alternatives (Cal.com, OpenCalendar) — read only to
  confirm the competitive landscape and stack choices (Postgres/Redis/Node vs. this project's
  SQLite/single-process choice). Their repository READMEs were skimmed for stack/license facts
  only; no source code from either project was opened or read.
- Google's own Calendar API documentation (public, official) for the OAuth/freebusy/events
  integration — this is the interoperability surface SlotPilot must speak, not a competitor's
  asset.

## Sources explicitly NOT accessed
- No Calendly source code, internal docs, leaked material, or de-minified JS.
- No Cal.com or OpenCalendar source code — their GitHub pages were seen only at the
  README/description level via search-result snippets, never cloned or read line-by-line.
- No trademarked visual assets, icons, marketing copy, or UI text from Calendly, Cal.com, or
  OpenCalendar were copied. All UI copy, templates, and code in this repository were written
  fresh for this project.

## Naming
Searched "SlotPilot" against general web results and the existing open-source-scheduling
landscape found in this session (Cal.com/Calendso, OpenCalendar, LibreBooking, Tymeslot, Easy
Appointments, Rallly, BookingPress) — no collision found. Not checked against the PyPI/npm
registries since this prototype is not being published as a package in this pass; re-check
before any public release (see references/legal-and-licensing.md §5 in the skill for trademark
register guidance).

## License reasoning
MIT: this is an internal tool for a 6-person firm with no plan (yet) to build a hosted product
around it. MIT keeps it simple to fork, embed, or hand to a contractor later without copyleft
obligations. If the firm later decides to publish and wants to prevent a hosting company from
re-selling it as-is, revisit AGPLv3 at that point — that's a decision worth its own checkpoint,
not one to make silently now.
