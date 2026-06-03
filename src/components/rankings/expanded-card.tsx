"use client";

/**
 * ExpandedCard — Secondary data panel for an expanded rankings row.
 * Shows 4 evenly-spaced data blocks: Next Match Win, Tournament Win,
 * Official Points, and Diff (live vs official).
 */

import { cn } from "@/lib/utils";

interface ExpandedCardProps {
  /** Points if player wins their next match */
  nextMatchPoints: number;
  /** Points if player wins the tournament */
  maxPoints: number;
  /** Current official ranking points */
  officialPoints: number;
  /** Point difference: live − official */
  pointsDiff: number;
}

/** Format number with comma as thousands separator */
function fmt(n: number): string {
  return Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function ExpandedCard({
  nextMatchPoints,
  maxPoints,
  officialPoints,
  pointsDiff,
}: ExpandedCardProps) {
  return (
    <div className="bg-surface-container-low/50 border-t border-border-subtle/40 px-6 py-4 animate-expand-in">
      {/* Use same grid as parent row: skip rank column (80px), span the rest */}
      <div className="grid grid-cols-[80px_1fr] gap-0">
        {/* Empty spacer aligned with rank column */}
        <div />

        {/* 4 data blocks — independent even grid */}
        <div className="grid grid-cols-4 gap-8">
          {/* Block 1: Next Match Win */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Next Match Win
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-body-md font-bold text-primary-olive">
                {fmt(nextMatchPoints)}
              </span>
              <span className="text-[10px] text-on-surface-variant">pts</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">
              If wins next match
            </span>
          </div>

          {/* Block 2: Tournament Win */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Tournament Win
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-body-md font-bold text-deep-navy">
                {fmt(maxPoints)}
              </span>
              <span className="text-[10px] text-on-surface-variant">pts</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">
              If wins tournament
            </span>
          </div>

          {/* Block 3: Official Points */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Official Points
            </span>
            <span className="text-body-md font-bold text-deep-navy">
              {fmt(officialPoints)}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Current official
            </span>
          </div>

          {/* Block 4: Diff (live vs official) */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Diff
            </span>
            <span
              className={cn(
                "inline-flex items-center justify-center w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                pointsDiff > 0
                  ? "bg-success-green-bg text-success-green-text"
                  : pointsDiff < 0
                    ? "bg-error-red-bg text-error-red-text"
                    : "bg-surface-container text-on-surface-variant"
              )}
            >
              {pointsDiff > 0 ? "+" : ""}
              {pointsDiff === 0 ? "—" : fmt(pointsDiff)}
              {pointsDiff < 0 ? "" : ""}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Live vs Official
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
