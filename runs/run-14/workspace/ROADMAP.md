# Roadmap

- **M0 — Skeleton** (this session): project scaffold, embedded SQLite + migrations, license/community files, launcher manifest.
- **M1 — Core loop** (this session): create poll → share link → vote (Yes/If-need-be/No, edit own vote) → live results grid → finalize → CSV export. Automated tests for the scheduling logic. This is the definition of "done" for Prototype mode.
- **M2 — Switch-blockers**: `.ics` calendar-invite generation on finalize; a JSON/CSV poll import format (so a poll built elsewhere can be brought in) — no scraping of any incumbent, purely an open import format of our own; response deadlines with auto-close.
- **M3 — Differentiators**: organizer accounts (optional, not required — link-based access stays available); recurring/multi-week polls; per-viewer timezone picker override; embeddable poll widget.
- **Later tiers**: email notifications, Google/Outlook calendar availability sync (each is an external OAuth integration, deliberately deferred past the "no external services" prototype constraint).
