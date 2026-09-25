# Project Charter

## Target and scope
- **Target**: Doodle (doodle.com), the group-scheduling polls and booking-page product made by Doodle AG (Zürich, Switzerland).
- **Identity**: one clear match. No ambiguity — the user's own phrasing ("Doodle... finding a time for group meetups") names the product's core job precisely: the "propose several times, group votes, pick a winner" poll, not Google's homepage-logo Doodles or any other namesake.
- **Sub-scope**: the group poll / "find a time" workflow and its finalize-and-notify step. Out of scope: 1:1 booking pages, Doodle's calendar-sync/Outlook add-ins, its AI scheduling assistant, and its enterprise SSO/admin console.

## Mode
**Prototype**, at the user's explicit direction ("Make the calls yourself and just build it (Prototype mode)"). This means: the core loop running locally end-to-end, light docs, no checkpoints — every assumption below is a call I made and recorded so it can be revisited.

## Motive
Primarily **public good / a missing property of the incumbent**: a group-scheduling poll with no account wall for participants, no ads, no artificial free-tier limits, and data the host owns. Secondarily **privacy/self-hosting**: nothing about a "when can we all meet" poll should require a third-party SaaS account or ad tracking.

## Audience
The user and anyone they self-host it for (a team, a friend group, a community). Not a commercial venture.

## Better-thesis seed
For people organizing a group meetup who are tired of ad-cluttered, account-gated polls, this is a free, self-hosted scheduling-poll tool that gives every organizer and participant the full workflow — unlimited polls, no ads, no login required to vote — unlike Doodle, which paywalls branding/ad removal and admin controls and requires an account even to create a poll.

## Must-have workflows (core loop)
1. Organizer creates a poll: title, optional description/location, a set of proposed date/time options, and gets a participant link and a separate admin link.
2. Participants open the link, enter a name (no account), and mark Yes / If-need-be / No for each option; they can revisit the link and edit their own vote.
3. Everyone sees a live results grid (counts per option, best option highlighted).
4. Organizer finalizes a winning option; the poll then shows "scheduled" to everyone.
5. Organizer can export results as CSV.

**Explicit non-goals for this prototype**: user accounts/login, email notifications, calendar-provider sync (Google/Outlook), 1:1 booking pages, payments, an admin console, native mobile apps.

## Constraints
- Runs from a cold checkout with two commands, no Docker, no external services (embedded SQLite, in-process only).
- Built where the session can develop it: `/tmp/ossa-run.4pd6o5` (this is a cloud session without access to the shared launcher folder used by the desktop app — see hand-off note).
- Stack: Node.js (LTS), Express, SQLite via `node:sqlite`/`better-sqlite3`, server-rendered views, small vanilla-JS client. Node's built-in test runner for tests (zero extra dependency).

## Technical comfort
The user is a developer (works from a coding session). Plain two-command install/run is still the target so it can be handed to non-developers later.

## Assets
None supplied. Built entirely from public research (see dossier) — no accounts, exports, or private data used.

## Openness
- License: MIT (recommended in Phase 5 — maximizes reuse for a small utility like this; no strong copyleft motive stated).
- Public or private start: the user hasn't said; left as a local prototype. Publishing is the user's call (Phase 8).
- Commercial intent: none.

## Where to build
Per environment: this is a cloud session whose primary working directory is `/tmp/ossa-run.4pd6o5`, not the shared `~/Documents/open-source-anything/` launcher folder the desktop app uses (that folder, `/tmp/run14-home`, isn't reachable by the user from this session). Building directly in the working directory so the user can open every file; the hand-off explains how to move it into the launcher folder on their own machine.

## Codename
`rustic-fjord`, generated via `scripts/codename.py --avoid doodle`. Contains no reference to Doodle's name or marks.
