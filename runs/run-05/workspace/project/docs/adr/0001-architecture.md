# ADR 0001: Single-process Node/Express + SQLite, no external services

## Context
Target user runs this for personal side projects, likely on a small VPS or homelab, and wants `docker compose up` simplicity. Bitly's real architecture (inferred: distributed key-value store, async click pipeline) is built for hyperscale multi-tenant traffic, which this project doesn't need.

## Decision
- One Node.js process (Express) serves the redirect, the JSON API, and a server-rendered (EJS) dashboard.
- SQLite (via `better-sqlite3`) is the only datastore — no Postgres, no Redis, no message queue.
- Click enrichment (UA parsing, GeoIP) happens synchronously in-process using offline libraries (`ua-parser-js`, `geoip-lite`) — no network calls to third-party analytics/geo services, so redirects don't depend on external uptime and no click data leaves the host.
- Auth is a single admin password (env var) plus a signed cookie session (`cookie-session`) — no session store, no user table, no OAuth. Multi-user is out of scope for this session (see parity matrix, "Later").
- IP addresses are hashed (SHA-256 + server secret) before storage, never stored raw — a privacy-by-default choice that also differentiates from typical SaaS analytics tools.

## Alternatives considered
- Postgres instead of SQLite: rejected for this scale — adds a second container and connection config for no benefit at side-project click volumes.
- Next.js full-stack: rejected — Express + EJS has fewer moving parts and no separate frontend build/deploy step, matching "operability first."
- External GeoIP API (e.g., ip-api.com) at click time: rejected — adds a network dependency and latency to every redirect, and leaks visitor IPs to a third party.

## Consequences
- Vertical scaling only (SQLite is single-writer). Fine for the stated scale (a side project's traffic); documented as a known limit, not hidden.
- Adding real multi-user support later means adding a `users` table and moving off the single-admin-password model — flagged in ROADMAP.md.
