#!/usr/bin/env python3
"""Summarize a `claude -p --output-format stream-json --verbose` transcript.

Usage: trace_summary.py <transcript.jsonl> [final.md]

Prints a Markdown summary covering run stats, whether the skill loaded, which reference
files were read, web searches, pages fetched, files written and commands run. If a second
path is given, the agent's final reply is written there.
"""
import json
import sys
from collections import Counter


def short(s, n=160):
    s = " ".join(str(s).split())
    return s if len(s) <= n else s[: n - 1] + "…"


def main():
    path = sys.argv[1]
    final_path = sys.argv[2] if len(sys.argv) > 2 else None
    calls, result = [], {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
            except json.JSONDecodeError:
                continue
            if ev.get("type") == "assistant":
                for block in ev.get("message", {}).get("content", []):
                    if block.get("type") == "tool_use":
                        calls.append((block.get("name"), block.get("input", {})))
            elif ev.get("type") == "result":
                result = ev

    counts = Counter(name for name, _ in calls)
    skill_loaded = any(n == "Skill" for n, _ in calls)
    refs = [i.get("file_path", "") for n, i in calls if n == "Read" and "open-source-anything" in i.get("file_path", "")]
    searches = [i.get("query", "") for n, i in calls if n == "WebSearch"]
    fetches = [i.get("url", "") for n, i in calls if n == "WebFetch"]
    writes = [i.get("file_path", "") for n, i in calls if n in ("Write", "Edit")]
    commands = [i.get("command", "") for n, i in calls if n == "Bash"]

    out = ["# Trace summary", ""]
    if result:
        out += [
            f"- Outcome: `{result.get('subtype', '?')}`",
            f"- Turns: {result.get('num_turns', '?')}",
            f"- Duration: {round(result.get('duration_ms', 0) / 60000, 1)} min",
            f"- Cost: ${result.get('total_cost_usd', 0):.2f}",
        ]
    out += [
        f"- Skill invoked: {'yes' if skill_loaded else 'no'}",
        f"- Tool calls: {len(calls)} ({', '.join(f'{k} {v}' for k, v in counts.most_common())})",
        "",
    ]

    def section(title, items):
        out.append(f"## {title} ({len(items)})")
        out.append("")
        out.extend(f"- {short(x)}" for x in items) if items else out.append("- none")
        out.append("")

    section("Skill files read", sorted(set(p.split("open-source-anything/")[-1] for p in refs)))
    section("Web searches", searches)
    section("Pages fetched", fetches)
    section("Files written or edited", sorted(set(writes)))
    section("Commands run", commands)

    print("\n".join(out))
    if final_path:
        with open(final_path, "w", encoding="utf-8") as f:
            f.write(result.get("result", "(no final result recorded)") + "\n")


if __name__ == "__main__":
    main()
