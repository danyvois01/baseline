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
  if (!tournament && !stage) {
    return (
      <div className="flex items-center gap-2 opacity-30">
        <span className="text-body-sm text-on-surface-variant font-medium">—</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", !isActive && "opacity-50 grayscale-[50%]")}>
      {/* Status dot — active uses tennis ball yellow (baseline-lime) with live-pulse, out uses gray */}
      <div
        className={cn(
          "w-2.5 h-2.5 rounded-full shrink-0",
          isActive
            ? "bg-baseline-lime live-pulse shadow-[0_0_8px_rgba(223,255,0,0.6)]"
            : "bg-on-surface-variant"
        )}
      />

      {/* Status text */}
      <span
        className={cn(
          "text-body-sm whitespace-nowrap",
          isActive
            ? "text-deep-navy font-semibold"
            : "text-deep-navy font-medium"
        )}
      >
        {isActive ? "Active" : "Out"} - {tournament}
      </span>

      {/* Round badge — active uses tennis ball yellow (baseline-lime), out uses gray surface */}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase shrink-0",
          isActive 
            ? "bg-baseline-lime text-deep-navy font-bold" 
            : "bg-surface-container text-on-surface-variant font-medium"
        )}
      >
        {stage}
      </span>
    </div>
  );
}
