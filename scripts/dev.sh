#!/bin/sh
# Run the Next.js dev server in a Node 20 container, detached and self-healing.
#
# Why a container: this host's glibc is too old for Node 20, which Next.js 16
# requires. The container carries its own newer OS.
#
# Two problems this script exists to avoid:
#
# 1. Ownership. /usr/local/bin/finch is a wrapper that always calls sudo, so a
#    plain `finch run` executes as root and every file the dev server writes
#    (.next/, node_modules/.cache) ends up root-owned. HMR can then no longer
#    rewrite its own chunks and the app appears to stop loading. `--user` keeps
#    ownership with us so the cache stays writable.
#
# 2. Lifetime. `finch run -it` (no -d) binds the server to the terminal that
#    launched it: closing that terminal, an SSH/VSCode reconnect, or the shell
#    going away takes the container down with it. The port dies too — it is
#    held by a helper process under the container's containerd-shim, not by the
#    host — so the browser is left loading forever. `-d --restart unless-stopped`
#    detaches the server from any terminal and brings it back if it exits.
#    Detaching also enables `finch logs`, which stays empty for -it containers,
#    so a crash now leaves a trace instead of vanishing.
#
# Usage: ./scripts/dev.sh [extra next dev args]   start (or restart) the server
#        npm run dev:logs                         follow the output
#        npm run dev:stop                         stop it
set -eu

REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
NAME="baseline-dev"

# A root-owned .next from an earlier run would still be unwritable — clear it.
if [ -d "$REPO/.next" ] && [ ! -w "$REPO/.next" ]; then
  echo "==> Removing root-owned .next left by a previous root container"
  sudo rm -rf "$REPO/.next"
fi

# --restart cannot be combined with --rm, so reclaim the name explicitly.
if finch ps -a --format '{{.Names}}' 2>/dev/null | grep -qx "$NAME"; then
  echo "==> Removing previous '$NAME' container"
  finch rm -f "$NAME" >/dev/null
fi

echo "==> Starting dev server (detached)"
finch run -d \
  --name "$NAME" \
  --restart unless-stopped \
  --user "$(id -u):$(id -g)" \
  -p 3000:3000 \
  -v "$REPO:/app" \
  -w /app \
  node:20 npm run dev -- -H 0.0.0.0 "$@" >/dev/null

echo "==> http://localhost:3000 — first compile takes a few seconds"
echo "    logs: npm run dev:logs     stop: npm run dev:stop"
