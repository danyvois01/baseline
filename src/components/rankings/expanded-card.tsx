"use client";

/**
 * ExpandedCard — Secondary data panel for an expanded rankings row.
 * Layout aligns with parent grid columns:
 * - Under Player: Best Ranking
 * - Under Live Status: Next (if wins next match) + Max (if wins tournament)
 * - Under Points: Official Points + Diff
 */

import { cn } from "@/lib/utils";

/** Shared grid column definition — must match rankings-table.tsx GRID_COLS */
const GRID_COLS = "grid-cols-[60px_70px_1fr_45px_1.2fr_120px_50px]";

interface ExpandedCardProps {
  /** Points if player wins their next match */
  nextMatchPoints: number;
  /** Points if player wins the tournament */
  maxPoints: number;
  /** Current official ranking points */
  officialPoints: number;
  /** Point difference: live − official */
  pointsDiff: number;
  /** Player's career-best rank position */
  bestRanking: number;
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
  bestRanking,
}: ExpandedCardProps) {
  return (
    <div className="bg-surface-container-low/50 border-t border-border-subtle/40 px-6 py-4">
      {/* Same grid as parent row for alignment */}
      <div className={cn("grid items-start", GRID_COLS)}>
        {/* Skip Rank column */}
        <div />

        {/* Skip +/- column */}
        <div />

        {/* Under Player: Best Ranking */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
            Best Ranking
          </span>
          <span className="text-body-md font-bold text-deep-navy">
            #{bestRanking}
          </span>
          <span className="text-[10px] text-on-surface-variant">
            Career high
          </span>
        </div>

        {/* Skip Age column */}
        <div />

        {/* Under Live Status: Next + Max (grouped) */}
        <div className="flex gap-8">
          {/* Next: if wins next match */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Next
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

          {/* Max: if wins tournament */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Max
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
        </div>

        {/* Under Points + Chevron: Official Points + Diff (col-span-2) */}
        <div className="col-span-2 flex gap-5">
          {/* Official Points */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Official Pts
            </span>
            <span className="text-body-md font-bold text-deep-navy tabular-nums">
              {fmt(officialPoints)}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Current official
            </span>
          </div>

          {/* Diff */}
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
              {pointsDiff > 0 && "+"}
              {pointsDiff === 0 ? "—" : fmt(pointsDiff)}
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
