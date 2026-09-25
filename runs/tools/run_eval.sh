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
# If OSA_HOME is set, the agent's projects folder is copied to <output-dir>/projects-home, the
# same way. Point it at an empty throwaway folder to test the skill's default build location.
# Secrets (.env) and launcher state (.osa) are never copied.
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

EXCLUDES=(--exclude='.git' --exclude='node_modules' --exclude='.venv' --exclude='venv'
    --exclude='__pycache__' --exclude='*.db' --exclude='*.sqlite*' --exclude='.pytest_cache'
    --exclude='data' --exclude='.next' --exclude='*.tsbuildinfo' --exclude='generated' --exclude='*.so.node'
    --exclude='.env' --exclude='.osa')
mkdir -p "$OUT_DIR/workspace"
tar -C "$WORK" "${EXCLUDES[@]}" -cf - . | tar -C "$OUT_DIR/workspace" -xf -
if [ -n "${OSA_HOME:-}" ] && [ -d "$OSA_HOME" ]; then
  mkdir -p "$OUT_DIR/projects-home"
  tar -C "$OSA_HOME" "${EXCLUDES[@]}" -cf - . | tar -C "$OUT_DIR/projects-home" -xf -
fi
gzip -f "$OUT_DIR/transcript.jsonl"   # read with: zcat transcript.jsonl.gz
echo "workspace kept at $WORK for manual verification"
