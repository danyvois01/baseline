# Dev Container Root Ownership — "the app stops loading"

**Status:** fixed (2026-07-28)
**Scope:** `scripts/dev.sh` (new), `package.json`

## Symptom

The app stops loading in the browser. Source is correct and type-checks
cleanly, but the dev server serves stale or half-written assets, and
`rm -rf .next` fails with "Permission denied".

## Root Cause

`/usr/local/bin/finch` is a wrapper that hard-codes `sudo`:

```sh
sudo HOME="/home/danyvois" DOCKER_CONFIG="..." /usr/bin/finch "$@"
```

So `finch run ... node:20 npm run dev` executes **as root inside the
container**, and the repo is bind-mounted. Every file the dev server writes
is therefore root-owned on the host:

| Path | Root-owned files found |
|---|---|
| `.next/` | 2091 |
| `node_modules/` | 49369 |
| `src/` | 0 (source was never affected) |

Once `.next/` is root-owned, Turbopack cannot rewrite its own chunks on
recompile. HMR silently fails, the browser keeps getting old or partial
assets, and the page appears to break. A root-owned `node_modules/` also
blocks `npm install` and any local tool that writes to `node_modules/.cache`.

This is an environment problem, not a code problem — which is why `tsc` was
clean the whole time.

## Fix

`scripts/dev.sh` runs the container as the invoking user via
`--user "$(id -u):$(id -g)"`, so everything it writes stays owned by us.
It also clears a root-owned `.next` left behind by an earlier run, and only
passes `-it` when a real TTY is present (without that guard finch aborts with
"provided file is not a console" when run from a non-interactive shell).

Use it instead of a bare `finch run`:

```sh
npm run dev:container      # or: ./scripts/dev.sh
```

One-time cleanup of the damage already on disk (already applied):

```sh
sudo rm -rf .next
sudo chown -R "$(id -u):$(id -g)" node_modules
```

## Verification

Performed after the fix, with the container started via `scripts/dev.sh`:

- `/`, `/official`, `/live`, `/race` → HTTP 200
- CSS + all 31 JS chunks → HTTP 200; served CSS contains
  `hover\:shadow-ambient` and the current settings-pill classes
- Root-owned files under `.next` after a dev run: **0**
- Edited a source file to force a recompile → still HTTP 200, still 0
  root-owned files (this is the case that used to wedge)
- `npx tsc --noEmit` in the Node 20 container → exit 0
- `npx next build` in the Node 20 container → **exit 0**, all 11 routes
  prerendered

The build was run with `NEXT_DIST_DIR=.next-build` so it would not fight the
running dev server for `.next`; that temp directory was removed afterwards.

## Note on the Local Shell

The host shell is pinned to Node 16 (mise), while Next.js 16 requires
Node >= 20.9, so `next build` and `eslint` cannot run there — and Node 20 is
not installable on this host (prebuilt binaries need a newer glibc than the
system provides). Run those through the container instead:

```sh
finch run --rm --user "$(id -u):$(id -g)" -v "$PWD:/app" -w /app node:20 npx next build
```
