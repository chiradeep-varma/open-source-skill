# Security

velvet-acorn is a single-admin, self-hosted app. A few things to know before you expose it publicly:

- The admin panel (`/admin`) is protected by one password (`ADMIN_PASSWORD`), hashed with bcrypt. There's no rate limiting on the login form yet — if you expose `/admin` to the internet, consider putting it behind a reverse proxy with basic rate limiting, or restricting it by IP.
- Session cookies are `httpOnly` and `SameSite=Lax`. Set `COOKIE_SECURE=true` once you're serving over HTTPS (you should be, for the admin login).
- The app refuses to start if `SESSION_SECRET` or `ADMIN_PASSWORD` is missing — there is no default credential.
- The public status page and its JSON API/RSS feed have no authentication by design; they're meant to be public.

## Reporting a vulnerability

Please email **bhaskar@enrichdigital.technology** rather than opening a public issue. Include what you found and, if possible, how to reproduce it.
