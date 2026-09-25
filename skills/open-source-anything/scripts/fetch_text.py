#!/usr/bin/env python3
"""Fetch the exact text of a license or the Contributor Covenant, never from memory.

Standard texts must be verbatim. In testing, an AGPL-3.0 LICENSE written from
memory silently dropped a sentence from section 13, the network clause that was
the reason for choosing the license. This script downloads the canonical text
and tries several sources, because sandboxes often block some hosts but not others.

Usage:
  python3 fetch_text.py license AGPL-3.0-only -o LICENSE
  python3 fetch_text.py license MIT --holder "The amber-otter contributors" -o LICENSE
  python3 fetch_text.py coc --contact "conduct@example.org" -o CODE_OF_CONDUCT.md
  python3 fetch_text.py coc --version 2.1 --contact "https://example.org/report"

License ids are SPDX identifiers (https://spdx.org/licenses/). For licenses whose
text starts with a copyright line to fill in (MIT, BSD, ISC and similar), pass
--holder, and --year if it isn't the current year. Other licenses (Apache, GPL,
AGPL, LGPL, MPL) are written exactly as published; their "how to apply" appendix
is instructions for source files, so leave it as it is.

If no source can be reached, the script exits with status 1 and writes nothing.
Then leave a placeholder that names the license and its canonical URL, and tell
the user. Don't fill the gap from memory.
"""
import argparse
import datetime
import io
import json
import re
import sys
import tarfile
import urllib.request

TIMEOUT = 20

LICENSE_SOURCES = [
    ("SPDX license-list-data on GitHub", "https://raw.githubusercontent.com/spdx/license-list-data/main/text/{id}.txt", "text"),
    ("spdx.org", "https://spdx.org/licenses/{id}.json", "spdx-json"),
    ("npm package spdx-license-list", "https://registry.npmjs.org/spdx-license-list/latest", "npm"),
]

COC_SOURCES = [
    ("Contributor Covenant on GitHub", "https://raw.githubusercontent.com/EthicalSource/contributor_covenant/release/content/version/{path}/code_of_conduct.md"),
    ("contributor-covenant.org", "https://www.contributor-covenant.org/version/{path}/code_of_conduct/code_of_conduct.md"),
]

# Copyright-line placeholders used in SPDX texts, e.g. "Copyright (c) <year> <copyright holders>".
YEAR = re.compile(r"<year>|\[yyyy\]", re.I)
HOLDER = re.compile(r"<(copyright holders?|owner|name of author)>|\[name of copyright owner\]", re.I)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "open-source-anything/fetch_text"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
        return res.read()


def fetch_license(spdx_id):
    errors = []
    for label, url, kind in LICENSE_SOURCES:
        try:
            if kind == "text":
                text = get(url.format(id=spdx_id)).decode("utf-8")
            elif kind == "spdx-json":
                text = json.loads(get(url.format(id=spdx_id)))["licenseText"]
            else:
                tarball = json.loads(get(url))["dist"]["tarball"]
                with tarfile.open(fileobj=io.BytesIO(get(tarball)), mode="r:gz") as tar:
                    member = tar.extractfile(f"package/licenses/{spdx_id}.json")
                    text = json.load(member)["licenseText"]
            if len(text.strip()) < 200:
                raise ValueError("the text is too short to be a license")
            return text, f"{label} ({url.format(id=spdx_id)})"
        except Exception as err:  # try the next source
            errors.append(f"{label}: {err}")
    raise SystemExit("Couldn't fetch the license text from any source:\n  " + "\n  ".join(errors)
                     + f"\nCheck the id at https://spdx.org/licenses/ ({spdx_id!r} is case-sensitive).")


def fill_copyright(text, spdx_id, holder, year):
    # Only the opening copyright line is filled in. Placeholders further down
    # (an appendix on how to apply the license) stay as published.
    lines = text.split("\n")
    head, rest = "\n".join(lines[:6]), "\n".join(lines[6:])
    if not (YEAR.search(head) or HOLDER.search(head)):
        return text, False
    if not holder:
        raise SystemExit(f"{spdx_id} starts with a copyright line to fill in. "
                         f'Pass --holder, for example --holder "The <codename> contributors".')
    head = HOLDER.sub(holder, YEAR.sub(str(year), head))
    return head + ("\n" + rest if rest else ""), True


def reporting_phrase(version, contact):
    # Version 3.0's placeholder expects an instruction ("email ..."); 2.1's expects an address.
    if version.startswith("2") or " " in contact.strip():
        return contact
    return f"email {contact}" if "@" in contact else f"use the form at {contact}"


def fetch_coc(version, contact):
    path = version.replace(".", "/")
    errors = []
    for label, url in COC_SOURCES:
        try:
            raw = get(url.format(path=path)).decode("utf-8")
            break
        except Exception as err:
            errors.append(f"{label}: {err}")
    else:
        raise SystemExit("Couldn't fetch the Contributor Covenant from any source:\n  " + "\n  ".join(errors))

    front = {}
    match = re.match(r"\+\+\+\n(.*?)\n\+\+\+\n", raw, re.S)
    if match:
        for line in match.group(1).splitlines():
            key, _, value = line.partition("=")
            front[key.strip()] = value.strip().strip('"')
        raw = raw[match.end():].lstrip("\n")

    notes = []
    reporting = front.get("reportingPlaceholder")
    if reporting and reporting in raw:
        if contact:
            raw = raw.replace(reporting, reporting_phrase(version, contact))
        else:
            notes.append(f"Fill in {reporting} with how to report (an email address or a private form) before publishing.")
    enforcement = front.get("enforcementPlaceholder")
    if enforcement:
        # An editor's note to adopters, not part of the policy. Adopting the suggested ladder as-is is what it allows.
        raw = re.sub(r"\n\*\*" + re.escape(enforcement) + r"\*\*\n", "\n", raw)
        raw = raw.replace(enforcement, "")
    return raw, f"{label} ({url.format(path=path)})", notes


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = parser.add_subparsers(dest="what", required=True)
    lic = sub.add_parser("license", help="an SPDX license text")
    lic.add_argument("spdx_id")
    lic.add_argument("--holder", help='copyright holder for MIT/BSD/ISC-style texts, e.g. "The amber-otter contributors"')
    lic.add_argument("--year", type=int, default=datetime.date.today().year)
    lic.add_argument("-o", "--output")
    coc = sub.add_parser("coc", help="the Contributor Covenant code of conduct")
    coc.add_argument("--version", default="3.0", help="3.0 (current, default) or 2.1")
    coc.add_argument("--contact", help="how to report a problem: an email address or a private form URL")
    coc.add_argument("-o", "--output")
    args = parser.parse_args()

    if args.what == "license":
        text, source = fetch_license(args.spdx_id)
        text, filled = fill_copyright(text, args.spdx_id, args.holder, args.year)
        notes = [f"Filled in the copyright line: {args.year}, {args.holder}."] if filled else []
    else:
        text, source, notes = fetch_coc(args.version, args.contact)

    if not text.endswith("\n"):
        text += "\n"
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Wrote {args.output} from {source}", file=sys.stderr)
    else:
        sys.stdout.write(text)
        print(f"Fetched from {source}", file=sys.stderr)
    for note in notes:
        print(note, file=sys.stderr)


if __name__ == "__main__":
    main()
