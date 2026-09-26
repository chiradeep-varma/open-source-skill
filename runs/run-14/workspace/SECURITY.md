# Security policy

## Reporting a vulnerability
Please open an issue on this repository describing the problem. If it's sensitive (e.g. a way to bypass the admin-link authorization), say so in the issue title and keep exploit details minimal until a maintainer responds.

## Known, deliberate tradeoffs (not vulnerabilities to report)
These are documented design decisions, not bugs:
- **No password/login system.** A poll's admin link and a participant's edit token are both unguessable, capability-bearing URLs/tokens, not accounts — see `docs/adr/0002-link-based-identity-no-accounts.md`. Anyone who obtains an admin link can manage that poll. Don't share it.
- **No rate limiting is built in yet.** If you expose this on the open internet, put it behind a reverse proxy with basic rate limiting for abuse resistance.
- **No email verification for participant names.** A participant only supplies a display name; this project trusts small-group social context (the way the poll link itself is shared) rather than verifying identity.

## Supported versions
This is a young project (Prototype-mode initial release); only the latest commit on the default branch is supported.
