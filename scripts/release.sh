#!/usr/bin/env bash
# Create a GitHub release to trigger the deploy workflow.
# Usage: ./scripts/release.sh
# Tag format: v2026.02.23-143012 (date + time, UTC)
set -euo pipefail

if ! command -v gh &> /dev/null; then
  echo "Error: gh CLI is not installed. Install it from https://cli.github.com" >&2
  exit 1
fi

tag="v$(date -u '+%Y.%m.%d-%H%M%S')"

echo "Creating release $tag"
gh release create "$tag" --title "$tag" --generate-notes
echo "Release $tag created. Deploy workflow triggered."
