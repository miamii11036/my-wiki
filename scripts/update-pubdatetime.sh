#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash scripts/update-pubdatetime.sh --mode=staged --policy=always
#   bash scripts/update-pubdatetime.sh --mode=all --policy=empty

MODE="staged"
POLICY="always"

for arg in "$@"; do
  case "$arg" in
    --mode=staged) MODE="staged" ;;
    --mode=all) MODE="all" ;;
    --policy=always) POLICY="always" ;;
    --policy=empty) POLICY="empty" ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

NOW="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
UPDATED_COUNT=0

update_file() {
  local file="$1"

  [[ -f "$file" ]] || return 0
  [[ "$file" =~ ^content/.*\.md$ ]] || return 0

  if ! grep -Eq '^pubDatetime:' "$file"; then
    return 0
  fi

  if [[ "$POLICY" == "empty" ]]; then
    if ! grep -Eq '^pubDatetime:[[:space:]]*$|^pubDatetime:[[:space:]]*null[[:space:]]*$' "$file"; then
      return 0
    fi
  fi

  sed -i -E "s|^pubDatetime:.*$|pubDatetime: $NOW|" "$file"

  if [[ "$MODE" == "staged" ]]; then
    git add "$file"
  fi

  UPDATED_COUNT=$((UPDATED_COUNT + 1))
  echo "updated pubDatetime: $NOW in $file"
}

if [[ "$MODE" == "staged" ]]; then
  while IFS= read -r -d '' file; do
    update_file "$file"
  done < <(git diff --cached --name-only --diff-filter=AM -z)
else
  while IFS= read -r -d '' file; do
    update_file "$file"
  done < <(find content -type f -name '*.md' -print0)
fi

echo "pubDatetime update complete. Updated files: $UPDATED_COUNT"
