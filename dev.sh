#!/usr/bin/env bash
# Starts the Next.js dev server inside a Node 20 container.
#
# Why a container: this machine (Amazon Linux 2) has GLIBC too old to run
# Node 20 natively, and Next.js 16 needs Node 20. The container carries its
# own newer OS, so it just works.
#
# Usage:  ./dev.sh          then open http://localhost:3000
#         Ctrl+C to stop.
set -euo pipefail
cd "$(dirname "$0")"

finch run --rm -it \
  -p 3000:3000 \
  -v "$(pwd)":/app \
  -w /app \
  node:20 \
  npm run dev -- -H 0.0.0.0
