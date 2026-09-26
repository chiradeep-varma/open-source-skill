# Security Policy

Corkboard is meant to be self-hosted by a small, trusted team on
infrastructure you control. There is no public sign-up and no multi-tenant
mode — anyone who can create an account on your instance is trusted the way
any of your other internal tools would be. Keep that in mind when judging
severity: most findings here are "a signed-in teammate could do X they
shouldn't," not "an anonymous internet user could do X."

## Reporting a vulnerability

If you find a security issue (e.g. an authorization bypass that lets a
signed-in user reach data outside their board memberships, or an injection
vector), please **do not** open a public GitHub issue. Instead, use
GitHub's private vulnerability reporting for this repository ("Security" →
"Report a vulnerability"), or contact a maintainer directly if that's
listed for the project.

Please include:
- What you did, step by step.
- What you expected vs. what happened.
- The version/commit you tested against.

## Operating this project securely

If you're self-hosting:
- Always set a strong, unique `AUTH_SECRET` — the app refuses to start
  without one, but a weak one is still weak.
- Run this behind HTTPS (a reverse proxy like Caddy/nginx/Traefik) in any
  deployment reachable beyond `localhost`; the app itself doesn't terminate
  TLS.
- There's no rate limiting on the login endpoint yet — if your instance is
  internet-reachable, put it behind your existing network access controls
  (VPN, IP allowlist) rather than relying on the app alone.
- Back up your Postgres volume; see the README's Backups section.
