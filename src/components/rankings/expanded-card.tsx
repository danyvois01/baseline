"use client";

/**
 * ExpandedCard — Secondary data panel for an expanded rankings row.
 * Aligns with parent grid columns (spilling from their reference area):
 * - Under Player: Best Ranking
 * - Under Live Status: Next + Max
 * - Under Points/+/-: Official Points
 * Each block uses 2 lines: label + value on top, subtitle below.
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
}: ExpandedCardProps) {
  return (
    <div className="bg-surface-container-low/50 border-t border-border-subtle/40 px-6 py-3">
      <div className={cn("grid items-start", GRID_COLS)}>
        {/* Skip [#] column */}
        <div />
        {/* Skip [MOVE] column */}
        <div />

        {/* Under Player: Best Ranking — 2 lines */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Best Ranking
            </span>
            <span className="text-body-sm font-bold text-deep-navy">
              #{bestRanking}
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant">
            Career high
          </span>
        </div>

        {/* Under Live Status: Next + Max grouped — 2 lines each */}
        <div className="flex gap-6">
          {/* Next */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Next
              </span>
              <span className="text-body-sm font-bold text-primary-olive tabular-nums">
                {fmt(nextMatchPoints)}
              </span>
              <span className="text-[10px] text-on-surface-variant">pts</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">
              If wins next match
            </span>
          </div>

          {/* Max */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Max
              </span>
              <span className="text-body-sm font-bold text-deep-navy tabular-nums">
                {fmt(maxPoints)}
              </span>
              <span className="text-[10px] text-on-surface-variant">pts</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">
              If wins tournament
            </span>
          </div>
        </div>

        {/* Under Points + +/- area: Official Points — centered across both columns */}
        <div className="col-span-2 flex justify-center">
          <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Official
            </span>
            <span className="text-body-sm font-bold text-deep-navy tabular-nums">
              {fmt(officialPoints)}
            </span>
            <span className="text-[10px] text-on-surface-variant">pts</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">
            Current official
          </span>
          </div>
        </div>

        {/* Skip chevron column */}
        <div />
      </div>
    </div>
  );
}
