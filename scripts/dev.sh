#!/bin/sh
# Run the Next.js dev server in a Node 20 container as the *current user*.
#
# Why this script exists: /usr/local/bin/finch is a wrapper that always calls
# sudo, so a plain `finch run` executes as root and every file the dev server
# writes (.next/, node_modules/.cache) ends up root-owned. Once that happens
# HMR can no longer rewrite its own chunks, the browser is served stale or
# half-written assets, and the app appears to stop loading. `--user` keeps
# ownership with us, so the cache stays writable.
#
# Usage: ./scripts/dev.sh [extra next dev args]
set -eu

REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

# A root-owned .next from an earlier run would still be unwritable — clear it.
if [ -d "$REPO/.next" ] && [ ! -w "$REPO/.next" ]; then
  echo "==> Removing root-owned .next left by a previous root container"
  sudo rm -rf "$REPO/.next"
fi

# -it only works with a real terminal; without one (CI, background) it aborts
# with "provided file is not a console".
TTY_FLAGS=""
[ -t 0 ] && [ -t 1 ] && TTY_FLAGS="-it"

# shellcheck disable=SC2086 # TTY_FLAGS must word-split (empty = no flag)
exec finch run --rm $TTY_FLAGS \
  --user "$(id -u):$(id -g)" \
  -p 3000:3000 \
  -v "$REPO:/app" \
  -w /app \
  node:20 npm run dev -- -H 0.0.0.0 "$@"
