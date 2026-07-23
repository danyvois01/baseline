"use client";

/**
 * ExpandedCard — Secondary data panel for an expanded rankings row.
 * Aligns with parent grid columns (spilling from their reference area):
 * - Under Player (Col 3): Career High
 * - Under Live Status (Col 4): Projected Next & Max
 * - Under Points (Col 5): Official Points (right-aligned)
 */

import { cn } from "@/lib/utils";

/** Grid cols must match rankings-table.tsx GRID_COLS (7 columns) */
const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_50px]";

interface ExpandedCardProps {
  /** Points if player wins their next match */
  nextMatchPoints: number;
  /** Points if player wins the tournament */
  maxPoints: number;
  /** Current official ranking points */
  officialPoints: number;
  /** Player's career-best rank position */
  bestRanking: number;
  /** Whether the player is currently active in a tournament */
  isActive?: boolean;
}

/** Format number with comma as thousands separator */
function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function ExpandedCard({
  nextMatchPoints,
  maxPoints,
  officialPoints,
  bestRanking,
  isActive = true,
}: ExpandedCardProps) {
  return (
    <div className="bg-surface-gray/30 shadow-inner border-t border-border-subtle/40 px-6 py-4">
      <div className={cn("grid items-start", GRID_COLS)}>
        {/* Col 1 & 2: Skip [#] and [MOVE] */}
        <div />
        <div />

        {/* Col 3 (Player): Career High */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Career High
          </span>
          <span className="text-body-md font-heading font-extrabold text-foreground">
            #{bestRanking}
          </span>
        </div>

        {/* Col 4 (Live Status): Proj. Next & Proj. Max */}
        <div className="flex gap-8 items-start">
          {isActive ? (
            <>
              {/* Next */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold flex items-center gap-1.5">
                  Proj. Next
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-body-md font-heading font-extrabold text-foreground tabular-nums">
                    {fmt(nextMatchPoints)}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium">pts</span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">Wins next match</span>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-10 bg-border-subtle/80 mt-1" />

              {/* Max */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
                  Proj. Max
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-body-md font-heading font-extrabold text-foreground tabular-nums">
                    {fmt(maxPoints)}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium">pts</span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">Title win</span>
              </div>
            </>
          ) : (
            <div className="flex items-center h-10">
              <span className="text-body-sm text-on-surface-variant font-medium opacity-50">—</span>
            </div>
          )}
        </div>

        {/* Col 5 (Points): Official Points right-aligned to match the points above */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Official Points
          </span>
          <div className="flex justify-end items-baseline gap-1">
            <span className="text-body-md font-heading font-extrabold text-foreground tabular-nums">
              {fmt(officialPoints)}
            </span>
            <span className="text-[10px] text-text-muted font-medium">pts</span>
          </div>
          <span className="text-[10px] text-on-surface-variant font-medium">ATP verified</span>
        </div>

        {/* Col 6 & 7: Skip [+/-] and [Chevron] */}
        <div />
        <div />
      </div>
    </div>
  );
}
