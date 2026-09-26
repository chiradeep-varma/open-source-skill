# Roadmap

- **M0 — Skeleton**: Next.js + Prisma + Postgres wired up, Docker Compose boots
  the stack, NextAuth credentials login works, admin bootstrap from env vars.
- **M1 — Core loop** *(this build)*: boards, lists, cards, drag-and-drop
  reordering, card detail (description/due date/labels/members/checklists/
  comments), archive/delete, full JSON export, basic Trello-JSON import.
- **M2 — Polish the switch**: harden the Trello importer against real exports
  (attachments, Power-Up data ignored gracefully), file attachments on cards,
  activity log per card/board.
- **M3 — Differentiators**: real-time sync (WebSocket or SSE-based board
  updates), keyboard-driven card entry, saved filters, optional extra views
  (table/calendar) if the team actually wants them.
