#!/usr/bin/env python3
"""Check the artifacts a deep run of open-source-anything should leave in a project.

Usage: check_artifacts.py <project-dir> <incumbent-name>

Prints a Markdown table of checks. It's a mechanical first pass: presence, evidence
tagging, sourcing, naming hygiene. Accuracy and quality still need human review.
"""
import glob
import os
import re
import sys


def read(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except OSError:
        return ""


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
        "README": "README.md",
        "LICENSE": "LICENSE",
    }
    for label, rel in expected.items():
        hits = glob.glob(os.path.join(root, "**", rel), recursive=True)
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

    print("| Check | Result | Detail |\n|---|---|---|")
    for name, res, detail in rows:
        print(f"| {name} | {res} | {detail} |")


if __name__ == "__main__":
    main()
