# ADR 0002: Google OAuth login doubles as team authentication

## Context
Team members need both (a) permission to manage their own availability/event types, and
(b) a connected Google Calendar for free/busy + event writes. Building a separate
username/password system plus a separate "connect calendar" OAuth flow would be two auth
systems for the same 6 people.

## Decision
Use "Sign in with Google" (OAuth2, scopes `calendar` + `userinfo.email`) as the *only* login
mechanism for the admin area. On login, the resulting Google identity is checked against a
hardcoded allow-list (`TEAM_EMAILS` env var) of the firm's 6 addresses. The same OAuth grant
that logs someone in also authorizes calendar access — one flow, not two.

## Alternatives considered
- Separate password auth + separate "connect calendar" step: more code, a password to manage
  and reset, no real benefit at 6 known users.
- Magic-link email auth: requires SMTP, which this project deliberately avoids (see ADR 0003).

## Consequences
- No user-management UI is needed for v1 — adding/removing a team member is an env var edit and
  restart. Acceptable at 6 people; would need a real admin UI if the team grows much past that
  (noted in ROADMAP.md).
- Google Cloud Console setup (OAuth consent screen, client ID/secret) is a one-time manual step
  documented in the README; the app can stay in Google's "Testing" publishing status (up to 100
  test users) so it never needs Google's verification review for a 6-person internal tool.
