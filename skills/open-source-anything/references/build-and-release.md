# Build and release

How to turn the plan into a repository strangers can run, trust and contribute to, and how to launch and sustain it. Use it in Phases 7 and 8.

## Contents
1. Repository scaffold
2. Definition of done for each milestone
3. Verification loop
4. Documentation set
5. Community files
6. CI, security and supply chain
7. Versioning, releases and packaging
8. Pre-launch checklist
9. Launch
10. Sustaining the project

---

## 1. Repository scaffold

Adapt the layout to the stack's conventions. Keep the documents from the earlier phases.

```
.
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── ROADMAP.md
├── CHANGELOG.md
├── docker-compose.yml          # or the type-appropriate one-command start
├── .env.example                # every setting, documented, with safe defaults
├── docs/
│   ├── charter.md
│   ├── process-log.md
│   ├── brief.md
│   ├── research/dossier.md
│   ├── product/parity-matrix.md
│   ├── legal/provenance.md
│   ├── adr/0001-*.md
│   ├── design/                 # ui-research.md, direction.md, screenshots/
│   ├── self-hosting.md         # install, configure, upgrade, back up and restore
│   ├── architecture.md         # your design, for contributors
│   └── importing.md
├── .github/                    # or the forge's equivalent
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
└── <source, tests, migrations, seed data>
```

## 2. Definition of done for each milestone

A milestone is done when:
- the workflows it promises work end to end in a fresh install, not only in the development environment;
- core logic has automated tests, and the importer has tests against a realistic sample export;
- lint, format and typecheck pass in CI;
- migrations run forward cleanly on existing data;
- the parity matrix's status column is updated truthfully;
- the README quickstart still works, word for word;
- there are no secrets, personal data or third-party assets without a recorded license in the repository.

## 3. Verification loop

For every vertical slice:
1. **Start it the way a user would**, with the documented one-command start and a clean state.
2. **Walk through the workflow from the dossier**, step by step. Use a browser automation tool for web UIs, drive the CLI for command-line tools, and hit the API for services.
3. **Break it on purpose.** Try empty states, large inputs, concurrent edits (where relevant), bad input, a restart in the middle of a job, and an upgrade from the previous version.
4. **Look at it.** For anything with a UI, capture the screens and review them against the design direction and the slop list (`ui-design.md` §6).
5. **Compare with the concept model.** Does it behave the way the product's logic says it should? Where it deliberately differs, the difference belongs in the better-thesis or an ADR.
6. **Record the result.** Update the parity matrix status and note known gaps.

Show the user a short demo at each milestone: a screenshot, recording or transcript, plus what works, what doesn't yet, and what's next.

## 4. Documentation set

- **README.md** (template in `assets/templates/README.md`). The README should cover, in order:
  - what it does, and who it's for, in its own terms (the codename, not the incumbent's name);
  - why it exists (the better-thesis, stated positively);
  - a screenshot from `docs/design/screenshots/`;
  - a quickstart under five minutes;
  - a feature status table, noting that every feature is available to whoever runs it;
  - how to contribute;
  - the license;
  - a non-affiliation line if any other product is mentioned (for example, in the import section).
- **Self-hosting guide.** Requirements, install, configuration reference (generated from `.env.example` if possible), reverse proxy and TLS, backups and restore, upgrades, and troubleshooting.
- **Importing guide.** How to export from the incumbent (in your own words), how to import, and what does and doesn't carry over.
- **Architecture overview** for contributors: components, data model, where to start reading, and how to run the tests.
- **API reference**, if there's an API. Generate it from the code or schema where possible.
- **User docs** matched to the product's complexity. Write original text; never adapt the incumbent's help center.

## 5. Community files

- **CONTRIBUTING.md.** Dev setup, how to run tests, the coding conventions, how to propose changes, the DCO sign-off (or the CLA, with the reason for it), and "good first issue" guidance.
- **CODE_OF_CONDUCT.md.** Use the Contributor Covenant. Fetch the current official text rather than writing it from memory, and fill in the enforcement contact.
- **SECURITY.md.** A private reporting channel (for example, the forge's private vulnerability reporting, or an email address), supported versions, and the response process.
- **Issue and pull-request templates.** Bug report (version, environment, steps), feature request (the problem before the solution), and a pull-request checklist.
- **Optional:** `GOVERNANCE.md` (who decides, and how maintainers are added), `CODEOWNERS` and a funding file.

## 6. CI, security and supply chain

- **CI on every pull request.** Lint, typecheck, tests, build, and a container or package build smoke test.
- **Dependency hygiene.** Automated update PRs (Dependabot or Renovate), a license scan against the allowed-license policy, and SBOM generation (SPDX or CycloneDX) on release.
- **Secrets.** Nothing in the repository. Enable secret scanning, and keep `.env.example` free of real values.
- **Secure defaults.**
  - No default admin password: generate one or run a first-run setup.
  - Secure cookie and session settings, CSRF protection, input validation and rate limiting on auth.
  - Least-privilege containers (non-root, read-only filesystem where possible).
  - Telemetry off by default.
- **Optional credibility signals.** OpenSSF Scorecard and the OpenSSF Best Practices badge.

## 7. Versioning, releases and packaging

- **Semantic versioning.** Before 1.0, say plainly that things may change. Keep a `CHANGELOG.md` in "Keep a Changelog" style.
- **Releases.** Tag releases, automate release notes, attach artifacts and include upgrade notes for breaking changes.
- **Packaging by type:**
  - **Web services:** multi-architecture container images (amd64 and arm64, for homelabs and small ARM servers) on a public registry, a Compose file, and optionally a Helm chart or one-click deploy templates.
  - **CLIs and libraries:** the ecosystem's registries, plus static binaries where natural.
  - **Desktop:** signed installers and an update feed.
  - **Mobile:** store listings, and F-Droid if the build is fully free.
  - **Hardware:** Gerbers, BOM, CAD exports and firmware binaries as release assets.

## 8. Pre-launch checklist

- [ ] Fresh-machine install following only the README succeeds.
- [ ] License chosen, `LICENSE` present, SPDX identifiers in manifests, and a dependency license scan that comes back clean.
- [ ] The project uses its random codename. No trace of the incumbent's name, logo or look. If the README mentions the incumbent, it has a non-affiliation line.
- [ ] No plans, tiers, seat limits or paywalls copied from the incumbent. Every built feature is available to whoever runs it.
- [ ] A design direction exists (`docs/design/direction.md`), and final screenshots of the core screens are in `docs/design/screenshots/` after a review against the slop list.
- [ ] No incumbent assets, text or code anywhere. Provenance log up to date.
- [ ] Any claims about other products are true, dated and sourced. The project doesn't define itself by comparison.
- [ ] Security basics in place, and `SECURITY.md` published.
- [ ] Screenshots and a demo made from your own seed data, not the incumbent's content.
- [ ] Parity matrix status is honest, with known limitations listed.
- [ ] At least one person other than the author has followed the quickstart, if possible.

## 9. Launch

Publishing and announcing are the user's decisions. Prepare the material and offer the options.

- **Channels.**
  - Show HN on Hacker News.
  - Relevant subreddits: r/selfhosted and r/opensource, plus category communities.
  - Curated lists such as `awesome-selfhosted` and category "awesome" lists. Each has contribution criteria (maturity, license, docs), so read and meet them before submitting.
  - Alternative-software directories (AlternativeTo, openalternative.co).
  - Product Hunt, and the incumbent's frustrated-user threads, where genuinely relevant and not spammy.
- **Message.** Lead with the better-thesis and the honest status. Communities that value open source punish overclaiming and reward candor about limitations.
- **Timing.** Launch when the quickstart is bulletproof. First impressions of a broken install are hard to undo.
- **Be ready** to respond to issues quickly for the first week or two.

## 10. Sustaining the project

Discuss this with the user in Project and Venture modes, because unmaintained alternatives fail their users.

- **Maintainer capacity.** Be realistic about hours per week. Triage rules, issue labels and a public roadmap help contributors help.
- **Scope control.** Say no to features that break the better-thesis or the operability promise. "Won't do" is a legitimate issue label.
- **Funding options.**
  - Sponsorships through GitHub Sponsors or Open Collective.
  - A paid hosted version.
  - Support contracts.
  - Open-core add-ons, labeled honestly.
  - Public open-source grants: in Europe, NLnet's NGI funds and national programs such as Germany's Sovereign Tech Agency for infrastructure-grade software. Check current calls.
- **Governance growth.** Add maintainers from active contributors, write down decision rules, and consider a foundation if companies start depending on it.
- **Regulation.** If the project becomes commercial and is distributed in the EU, revisit the Cyber Resilience Act notes in the legal reference.
