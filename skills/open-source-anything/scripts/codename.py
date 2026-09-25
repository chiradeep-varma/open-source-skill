#!/usr/bin/env python3
"""Generate a random, neutral codename for a new project, e.g. "amber-otter".

The skill doesn't brand what it builds. A random two-word codename, like a git
branch name, keeps the project clearly separate from the incumbent's brand, and
the user can rename it whenever they like.

Usage:
  python3 codename.py                  # one codename
  python3 codename.py --avoid bitly    # never contain these words (repeatable)
  python3 codename.py --count 5        # several options
"""
import argparse
import secrets

ADJECTIVES = [
    "amber", "brisk", "calm", "cedar", "clear", "cobalt", "coral", "crisp", "dusty", "early",
    "ember", "fair", "fern", "gentle", "glad", "golden", "granite", "hazel", "hollow", "humble",
    "ivory", "jade", "keen", "late", "lively", "lucky", "lunar", "maple", "mellow", "misty",
    "mossy", "noble", "north", "olive", "patient", "pebble", "plain", "polar", "quiet", "rapid",
    "rustic", "sandy", "silver", "slate", "solar", "spare", "steady", "still", "stout", "sunny",
    "swift", "tidy", "timber", "topaz", "velvet", "vivid", "warm", "west", "wild", "willow",
]

NOUNS = [
    "acorn", "alder", "anchor", "aspen", "badger", "basin", "beacon", "birch", "bramble", "brook",
    "canyon", "cinder", "comet", "cove", "crane", "delta", "dune", "falcon", "fjord", "finch",
    "glade", "grove", "harbor", "heron", "hollow", "island", "juniper", "kestrel", "lagoon", "lantern",
    "larch", "ledge", "lichen", "marsh", "meadow", "mesa", "moth", "nectar", "orchard", "otter",
    "pine", "plover", "quarry", "quill", "reef", "ridge", "river", "robin", "saddle", "sparrow",
    "spruce", "summit", "thicket", "thistle", "tundra", "valley", "walnut", "wharf", "wren", "yarrow",
]


def codename(avoid):
    avoid = [a.lower() for a in avoid if a]
    while True:
        name = f"{secrets.choice(ADJECTIVES)}-{secrets.choice(NOUNS)}"
        if not any(a in name or name.replace("-", "") in a for a in avoid):
            return name


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--avoid", action="append", default=[], help="word the codename must not contain")
    parser.add_argument("--count", type=int, default=1)
    args = parser.parse_args()
    for _ in range(max(1, args.count)):
        print(codename(args.avoid))


if __name__ == "__main__":
    main()
