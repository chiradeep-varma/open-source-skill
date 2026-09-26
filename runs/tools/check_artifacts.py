#!/usr/bin/env python3
"""Check the artifacts a deep run of open-source-anything should leave in a project.

Usage: check_artifacts.py <project-dir> <incumbent-name> [--verify-texts]

Prints a Markdown table of checks. It's a mechanical first pass: presence, evidence
tagging, sourcing, naming hygiene. Accuracy and quality still need human review.
--verify-texts also downloads the canonical LICENSE and Contributor Covenant texts
(with the skill's scripts/fetch_text.py) and reports any passage that differs.
"""
import difflib
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "skills", "open-source-anything", "scripts"))


def read(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except OSError:
        return ""


PLACEHOLDER = re.compile(r"<[^>]+>|\[[^\]]+\]")


def text_diff(canonical, actual):
    """Word-level differences, split into expected (placeholders filled in, http vs https) and unexpected."""
    a, b = canonical.split(), actual.split()
    expected, unexpected = 0, []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            continue
        was, now = " ".join(a[i1:i2]), " ".join(b[j1:j2])
        if PLACEHOLDER.search(was) or re.search(r"[<>]", was) or was.replace("http://", "https://") == now:
            expected += 1
        else:
            unexpected.append(f"'{was[:80]}' → '{now[:80]}'")
    return expected, unexpected


def verify_texts(root, check):
    import fetch_text

    lic_path = os.path.join(root, "LICENSE")
    pkg = os.path.join(root, "package.json")
    spdx = json.loads(read(pkg) or "{}").get("license") if os.path.exists(pkg) else None
    if os.path.exists(lic_path) and spdx:
        try:
            canonical, _ = fetch_text.fetch_license(spdx)
            _, unexpected = text_diff(canonical, read(lic_path))
            check(f"LICENSE matches the {spdx} text", not unexpected,
                  f"{len(unexpected)} changed passage(s)" + (f"; first: {unexpected[0]}" if unexpected else ""))
        except SystemExit as err:
            check(f"LICENSE matches the {spdx} text", False, f"couldn't fetch: {str(err).splitlines()[0]}")

    coc = read(os.path.join(root, "CODE_OF_CONDUCT.md"))
    if coc:
        version = "3.0" if re.search(r"version 3\.0|Covenant 3", coc) else "2.1"
        try:
            canonical, _, _ = fetch_text.fetch_coc(version, None)
            _, unexpected = text_diff(canonical, coc)
            check(f"CODE_OF_CONDUCT.md matches Contributor Covenant {version}", len(unexpected) <= 1,
                  f"{len(unexpected)} changed passage(s), 1 allowed for the contact" + (f"; first: {unexpected[0]}" if unexpected else ""))
        except SystemExit as err:
            check("CODE_OF_CONDUCT.md matches the Contributor Covenant", False, f"couldn't fetch: {str(err).splitlines()[0]}")


def main():
    root, incumbent = sys.argv[1], sys.argv[2]
    rows = []

    def check(name, ok, detail=""):
        rows.append((name, "✅" if ok else "❌", detail))

    expected = {
        "Charter": "docs/charter.md",
        "Process log": "docs/process-log.md",
        "Dossier": "docs/research/dossier.md",
        "Parity matrix": "docs/product/parity-matrix.md",
        "Provenance log": "docs/legal/provenance.md",
        "Roadmap": "ROADMAP.md",
        "Design direction": "docs/design/direction.md",
        "Written design review": "docs/design/review.md",
        "Launcher manifest": "osa.json",
        "README": "README.md",
        "LICENSE": "LICENSE",
    }
    for label, rel in expected.items():
        hits = [h for h in glob.glob(os.path.join(root, "**", rel), recursive=True) if "node_modules" not in h]
        check(label, bool(hits), hits[0].replace(root, ".") if hits else "missing")

    shots = [f for f in glob.glob(os.path.join(root, "**", "docs", "design", "screenshots", "*"), recursive=True)
             if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
    check("Reviewed UI screenshots", len(shots) > 0, f"{len(shots)} in docs/design/screenshots/")

    adrs = glob.glob(os.path.join(root, "**", "docs", "adr", "*.md"), recursive=True)
    check("ADRs", len(adrs) > 0, f"{len(adrs)} found")

    dossier = next(iter(glob.glob(os.path.join(root, "**", "docs/research/dossier.md"), recursive=True)), "")
    text = read(dossier)
    if text:
        tags = {t: len(re.findall(rf"`{t}`|\b{t}\b", text)) for t in ("confirmed", "reported", "inferred", "assumption", "memory")}
        cites = len(set(re.findall(r"\bS\d+\b", text)))
        urls = len(set(re.findall(r"(?:https?://)?(?:[\w-]+\.)+[a-z]{2,}/[^\s)>\]|]*", text)))
        lenses = sum(1 for h in ("Identity", "Concept", "Market", "Business", "Users", "Product", "Technology", "value lives") if h.lower() in text.lower())
        check("Dossier: evidence tags used", sum(tags.values()) >= 10, ", ".join(f"{k} {v}" for k, v in tags.items()))
        check("Dossier: sources cited", cites >= 5 and urls >= 5, f"{cites} distinct S# refs, {urls} distinct URLs")
        check("Dossier: all 8 lenses present", lenses >= 8, f"{lenses}/8 lens headings found")

    readme = read(next(iter(glob.glob(os.path.join(root, "**", "README.md"), recursive=True)), ""))
    if readme:
        first_heading = next((l for l in readme.splitlines() if l.startswith("# ")), "")
        check("Name doesn't contain incumbent's mark", incumbent.lower() not in first_heading.lower(), first_heading.strip())
        mentions = incumbent.lower() in readme.lower()
        has_line = bool(re.search(r"not affiliated|no affiliation|unaffiliated", readme, re.I))
        check("Non-affiliation line if the incumbent is mentioned", has_line or not mentions,
              "incumbent mentioned" if mentions else "incumbent not mentioned")
        check("No pricing tiers in README", not re.search(r"\b(pro|premium|business|enterprise) (plan|tier)\b|per seat|/mo\b", readme, re.I), "")

    if "--verify-texts" in sys.argv:
        verify_texts(root, check)

    print("| Check | Result | Detail |\n|---|---|---|")
    for name, res, detail in rows:
        print(f"| {name} | {res} | {detail} |")


if __name__ == "__main__":
    main()
