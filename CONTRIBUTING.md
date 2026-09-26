# Contributing

Thanks for helping make **open-source-anything** better. The skill is only as good as the judgment it encodes, so focused, well-reasoned changes are the most valuable.

## Good contributions

- **Worked examples.** Tricky targets and how the skill should handle them: name collisions, product families, renamed or discontinued products, non-software targets. These go in `skills/open-source-anything/references/disambiguation.md` or `product-types.md`.
- **Product-type playbooks.** Categories the skill doesn't cover well yet.
- **Corrections.** Licenses change, projects get archived, and laws move. When you correct a fact, include a source link in your pull request.
- **Eval cases.** Realistic prompts with checkable assertions in `evals/evals.json`, and near-miss trigger queries in `evals/trigger-evals.json`.

## Guidelines

- **Keep `SKILL.md` lean.** It loads every time the skill runs, so detail belongs in `references/`, with a pointer from `SKILL.md` saying when to read it.
- **Explain the why.** Write guidance as reasoning the model can generalize from, not as a pile of rigid rules.
- **Stay build-focused.** The skill always builds. Research informs *what* to build and never recommends an existing product instead.
- **Stay legally careful.** Anything touching IP, licensing or regulation should cite a primary source (a statute, a court decision, official guidance) and stay framed as orientation, not legal advice.
- **Test behavior changes.** If you change how the skill behaves, add or update an eval case, and run the affected prompts with the skill installed to confirm the change does what you intended.

## Testing locally

```bash
# from the repository root
claude plugin validate .
claude plugin marketplace add ./
claude plugin install open-source-anything@open-source-skill
claude -p "make me an open source bolt"   # compare with the assertions in evals/evals.json
```

## Pull requests

1. Fork the repository and create a branch.
2. Make your change, following the guidelines above.
3. Describe what changed and why, and link sources for any factual claims.
4. Sign off your commits (`git commit -s`) to certify the [Developer Certificate of Origin](https://developercertificate.org/).

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
