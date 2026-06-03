"use client";

/**
 * LiveStatusCell — Displays the live tournament status for a player.
 * Shows a colored dot (primary with live-pulse for active, gray for out)
 * + tournament name + round badge (Baseline Lime for active, gray for out).
 */

import { cn } from "@/lib/utils";

interface LiveStatusCellProps {
  isActive: boolean;
  tournament: string;
  stage: string;
}

export function LiveStatusCell({
  isActive,
  tournament,
  stage,
}: LiveStatusCellProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Status dot — active uses primary olive with live-pulse, out uses gray */}
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          isActive
            ? "bg-primary-olive live-pulse"
            : "bg-on-surface-variant"
        )}
      />

      {/* Status text — active text is medium weight */}
      <span
        className={cn(
          "text-body-sm whitespace-nowrap",
          isActive
            ? "text-deep-navy font-medium"
            : "text-deep-navy"
        )}
      >
        {isActive ? "Active" : "Out"} - {tournament}
      </span>

      {/* Round badge — active uses Baseline Lime palette, out uses gray surface */}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase shrink-0",
          isActive
            ? "bg-baseline-lime text-on-primary-container font-bold"
            : "bg-surface-container text-on-surface-variant font-medium"
        )}
      >
        {stage}
      </span>
    </div>
  );
}
