#!/usr/bin/env bash
# Kept as a convenience entry point for muscle memory (./dev.sh).
#
# The real launcher is scripts/dev.sh. This file used to run the container
# without --user and without -d, which made the dev server root-own .next and
# die with its terminal — see docs/2026-08-08-dev-server-lifetime.md.
set -euo pipefail
exec "$(dirname "$0")/scripts/dev.sh" "$@"
