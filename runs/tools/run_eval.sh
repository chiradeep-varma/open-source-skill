#!/usr/bin/env bash
# Run one evaluation of the open-source-anything skill, headless.
#
# Usage: runs/tools/run_eval.sh <output-dir> "<prompt>"
#
# Requires the skill installed (e.g. `claude plugin install open-source-anything@open-source-skill`).
# The agent works in a scratch workspace outside this repository, so it can't touch
# the repo's git history. Afterwards the workspace is copied into <output-dir>/workspace
# (without .git, dependency folders or databases). The script also saves:
#   <output-dir>/transcript.jsonl  full event stream (every tool call and result)
#   <output-dir>/final.md          the agent's final reply
#   <output-dir>/trace.md          summary: stats, searches, pages fetched, files read, commands run
set -euo pipefail

OUT_DIR="$(mkdir -p "$1" && cd "$1" && pwd)"
PROMPT="$2"
TOOLS_DIR="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/ossa-run.XXXXXX")"

echo "workspace: $WORK"
( cd "$WORK" && timeout "${TIMEOUT:-5400}" claude -p "$PROMPT" \
    --allowedTools "WebSearch,WebFetch,Read,Write,Edit,Glob,Grep,Bash,Skill" \
    --output-format stream-json --verbose \
    > "$OUT_DIR/transcript.jsonl" 2> "$OUT_DIR/stderr.log" ) || echo "claude exited non-zero (see stderr.log)"

python3 "$TOOLS_DIR/trace_summary.py" "$OUT_DIR/transcript.jsonl" "$OUT_DIR/final.md" > "$OUT_DIR/trace.md"

mkdir -p "$OUT_DIR/workspace"
if command -v rsync >/dev/null; then
  rsync -a --exclude '.git' --exclude 'node_modules' --exclude '.venv' --exclude 'venv' \
        --exclude '__pycache__' --exclude '*.db' --exclude '*.sqlite*' --exclude '.pytest_cache' \
        "$WORK"/ "$OUT_DIR/workspace"/
else
  cp -r "$WORK"/. "$OUT_DIR/workspace"/ && rm -rf "$OUT_DIR/workspace/.git"
fi
echo "workspace kept at $WORK for manual verification"
