/**
 * Shared number formatting utilities for rankings display.
 */

/** Format a number with comma as thousands separator (e.g. 11830 → "11,830"). */
export function formatPoints(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Format a signed diff with + prefix and thousands separator (0 → "—"). */
export function formatDiff(n: number): string {
  const abs = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (n > 0) return `+${abs}`;
  if (n < 0) return `-${abs}`;
  return "—";
}
