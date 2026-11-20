#!/bin/bash
# Makes a clean copy of the website for Netlify: everything except the repository's own files
# (.git, .claude, tools, CLAUDE.md, ...). It only builds the folder and prints its path; it deploys nothing.
# Deploys are manual: a draft first (netlify deploy --no-build --dir <folder> --site wildcardgroup-play),
# and --prod only with Tom's go-ahead.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$(mktemp -d)/site}"
mkdir -p "$OUT"
rsync -a --delete \
  --exclude '.git' --exclude '.claude' --exclude 'tools' --exclude 'CLAUDE.md' \
  --exclude '.gitignore' --exclude '.netlify' --exclude '.DS_Store' \
  "$HERE/" "$OUT/"
echo "$OUT"
