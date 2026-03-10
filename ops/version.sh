#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-patch}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG="$SCRIPT_DIR/../package.json"

if [[ ! -f "$PKG" ]]; then
  echo "Error: package.json not found at $PKG" >&2
  exit 1
fi

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" ]]; then
  echo "Usage: $0 [patch|minor|major]" >&2
  echo "  Default: patch" >&2
  exit 1
fi

CURRENT=$(jq -r '.version' "$PKG")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
TAG="v$NEW_VERSION"

echo "Bumping version: $CURRENT -> $NEW_VERSION ($BUMP)"

# Update package.json
jq --arg v "$NEW_VERSION" '.version = $v' "$PKG" > "$PKG.tmp" && mv "$PKG.tmp" "$PKG"

# Commit, tag, push
cd "$SCRIPT_DIR/.."
git add package.json
git commit -m "chore: bump version to $TAG"
git tag "$TAG"
git push
git push --tags

echo "Done! Released $TAG"
