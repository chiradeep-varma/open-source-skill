# ADR 0001: FastAPI + SQLite + server-rendered Jinja2, no Postgres/Redis/Node

## Context
User knows Python, has a small VPS, and wants 6 users. Cal.com (the closest existing
open-source project) needs Postgres, Redis, and a Node/Next.js build pipeline — real ops
overhead for a team with no dedicated infra person.

## Decision
Build a single Python service: FastAPI for routing, SQLModel over SQLite for storage
(one file, trivial backup: copy the file), Jinja2 server-rendered templates for all pages, and
a small amount of vanilla JS only for browser-timezone detection. One Docker container, one
volume for the SQLite file.

## Alternatives considered
- Django: heavier batteries (admin panel, auth) than needed for a 6-user tool with only two
  page groups (admin, public booking); FastAPI + SQLModel is lighter and the user already leans
  Python-general rather than Django-specific.
- Postgres instead of SQLite: unnecessary at 6 users and dozens of bookings/day; SQLite removes
  a whole service to operate and backup.
- A JS framework (React/Next) for the booking page: adds a build step the VPS doesn't need;
  server-rendered HTML is enough for a booking form.

## Consequences
- Easy to run (`docker compose up`), easy to back up (one file), easy for the user to read and
  extend given their Python background.
- Ceiling: SQLite isn't the right choice past maybe a few dozen concurrent writers — fine for a
  6-person firm, would need revisiting if this became a public multi-tenant product.
