# Security policy

## Supported versions

This project is pre-1.0 and moving fast. Security fixes land on the `main`
branch; there is no separate maintenance branch yet.

## Reporting a vulnerability

Please don't open a public issue for security reports. Instead, open a
private security advisory on this repository ("Security" tab → "Report a
vulnerability"), or, if that's unavailable, email the maintainer listed in
the repository's contact information.

Include what you found, how to reproduce it, and the potential impact.
We'll acknowledge reports within a few days and aim to ship a fix or
mitigation before any public disclosure.

## Scope notes for self-hosters

- `SESSION_SECRET` must be a long random value — the app refuses to start
  without one (see `.env.example`).
- There is no built-in TLS; put this behind a reverse proxy (nginx, Caddy,
  Traefik) with HTTPS for any deployment reachable over the internet.
- Passwords are hashed with bcrypt; nothing is ever stored in plain text.
