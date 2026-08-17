# Dev Server Lifetime — "dopo un po' si inchioda e gira a vuoto"

**Status:** fixed (2026-08-08)
**Scope:** `scripts/dev.sh`, `dev.sh`, `package.json`

## Symptom

After working normally for a while, the app stopped responding: reloading the
browser hung ("gira a vuoto") rather than showing an error page. Restarting the
container fixed it, until it happened again. Reported three times.

## Why the earlier diagnosis was incomplete

A previous pass found `.next` root-owned (the finch wrapper hard-codes `sudo`,
and the launcher had no `--user`) and fixed that. That was real, but it was not
this: during this investigation `.next` had **0 root-owned files** and was
writable, yet the symptom recurred. Ownership was a second, separate bug.

## Root cause

The dev server was dying, and the port died with it.

Observed directly: the `next-server` PID changed four times in ~40 minutes
(1445 → 6060 → 18872 → 7676), and `dmesg` showed container network interfaces
being created and torn down 2–4 seconds apart. Not an OOM — the kernel log had
no OOM kills and the host had ~24 GB free, with the container under no memory
limit (`"Memory": 0`, heap limit 4144 MB).

The cause was the launcher: `finch run --rm -it` with no `-d`. That ties the
container to the terminal that started it, so a closed terminal, an SSH/VSCode
reconnect, or the shell going away takes the dev server down.

Why it *hangs* instead of failing fast — the part that explains "gira a vuoto":

```
LISTEN 0 4096 0.0.0.0:3000 users:(("sleep",pid=7367,fd=3))
  └─ pid 7367 `sleep infinity`, child of containerd-shim-runc-v2 for the container
```

The listening socket on port 3000 belongs to a helper process **inside the
container's shim**, not to the host. When the container dies, that socket goes
with it, so the browser gets neither a response nor a refusal on an
already-open connection — it just waits. `--rm` then deleted the container,
erasing the evidence, and because `finch logs` stays empty for `-it`
containers there was no trace to read afterwards.

## Fix

`scripts/dev.sh` now runs the server detached and self-healing:

```sh
finch run -d --name baseline-dev --restart unless-stopped \
  --user "$(id -u):$(id -g)" -p 3000:3000 -v "$REPO:/app" -w /app \
  node:20 npm run dev -- -H 0.0.0.0
```

- `-d` — no terminal ownership, so the server survives the shell.
- `--restart unless-stopped` — if it exits anyway, it comes back by itself.
- `--user` — keeps the ownership fix from the earlier pass.
- `--name` — stable handle for logs/stop/status. `--restart` cannot be combined
  with `--rm`, so the script removes a stale container by name instead.
- Detaching also makes `finch logs` work, so the next crash leaves a trace.

`dev.sh` (repo root, previously the *cause* — no `--user`, no `-d`) now just
delegates to `scripts/dev.sh`, so running it from muscle memory is safe.
New helpers: `npm run dev:logs`, `dev:stop`, `dev:status`.

## Verification

- Start via `./dev.sh` → returns the prompt immediately; HTTP 200, 130812 bytes.
- **Survives terminal death:** SIGHUP to a child session → container unchanged, HTTP 200.
- **Self-heals:** `kill -9 1` inside the container → server back up on its own, HTTP 200.
- **Observed in the wild:** during a 90 s watch the container id changed
  (`3fb57444d481` → `6b96d06a96d1`) while HTTP stayed **200** throughout —
  previously that same death produced the hang.
- `find .next ! -user danyvois` → 0 files.
- All routes 200: `/`, `/live`, `/race`, `/official`.
- `npx tsc --noEmit` inside the container → exit 0.

## Notes

Two findings surfaced by the now-readable logs, left alone as out of scope:

- `official-table.tsx:142` briefly threw a compile error making `/live` 500.
  It compiles now — it was a half-saved file from another session's in-progress
  work (`git status` shows 14 unrelated modified files, none touched in the
  last 30 minutes). Worth knowing that a partial save on that page yields a
  500, not a blank page.
- Next.js reported "Found a change in next.config.ts. Restarting" although the
  file is identical to git — an mtime touch, harmless but it does briefly drop
  the port. Requests during that window are the one remaining legitimate way to
  see a hang.

Separately, and relevant to how the symptom *looked*: the homepage ships 46
elements with inline `opacity:0` (framer-motion `initial` values in
`animated-section.tsx` and the hero/ranking/scoring/timeline/glossary sections).
The markup is present in the SSR HTML but invisible until hydration runs, so
any JS failure renders as a **blank page** rather than partial content. That
amplifies every server hiccup into "pagina bianca" and is worth a design doc of
its own if it keeps causing confusion.
