/**
 * PointsDiffBadge — Live points differential (+/-).
 * Filled pill for gains (green) and losses (red); zero renders as a bare
 * dash — absence of data shouldn't draw the eye.
 * Shared by the Live and Race tables.
 */

import { cn } from "@/lib/utils";
import { formatDiff } from "@/lib/format";

interface PointsDiffBadgeProps {
  diff: number;
}

export function PointsDiffBadge({ diff }: PointsDiffBadgeProps) {
  if (diff === 0) {
    return (
      <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-medium text-foreground/40">
        —
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums",
        diff > 0
          ? "bg-success-green-bg text-success-green-text"
          : "bg-error-red-bg text-error-red-text"
      )}
    >
      {formatDiff(diff)}
    </span>
  );
}
