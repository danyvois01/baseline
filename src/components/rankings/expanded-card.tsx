"use client";

/**
 * ExpandedCard — Secondary data panel for an expanded rankings row.
 * Aligns with parent grid columns (spilling from their reference area):
 * - Under Player (Col 3): Career High
 * - Under Live Status (Col 4): Projected Next & Max
 * - Under Points (Col 5): Official Points (right-aligned)
 *
 * Two value tiers: projections at 20px (the reason the row is expanded, Max
 * accented in olive) and reference figures — career high, official points —
 * at 16px. Sizes use explicit `text-[Npx]` rather than the `text-body-*`
 * tokens: those are unlayered CSS and would override `font-heading` /
 * `font-extrabold`, silently rendering the numbers as Inter regular.
 */

import { cn } from "@/lib/utils";
import { formatPoints } from "@/lib/format";
import { useTranslation } from "@/providers/locale-provider";

/** Grid cols must match rankings-table.tsx GRID_COLS (7 columns) */
const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_50px]";

interface ExpandedCardProps {
  /** Points if player wins their next match. Absent when the source has none. */
  nextMatchPoints?: number;
  /** Points if player wins the tournament. Absent when the source has none. */
  maxPoints?: number;
  /** Current official ranking points */
  officialPoints: number;
  /** Player's career-best rank position */
  bestRanking: number;
  /** Whether the player is currently active in a tournament */
  isActive?: boolean;
}

export function ExpandedCard({
  nextMatchPoints,
  maxPoints,
  officialPoints,
  bestRanking,
  isActive = true,
}: ExpandedCardProps) {
  const { t } = useTranslation();

  // The two projections always arrive together or not at all.
  const hasProjections =
    nextMatchPoints !== undefined && maxPoints !== undefined;

  return (
    <div className="bg-surface-gray/30 shadow-inner border-t border-border-subtle/40 px-6 py-4">
      <div className={cn("grid items-start", GRID_COLS)}>
        {/* Col 1 & 2: Skip [#] and [MOVE] */}
        <div />
        <div />

        {/* Col 3 (Player): Career High */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
            {t.rankings.expandedCard.careerHigh}
          </span>
          <span className="text-[16px] font-heading font-extrabold text-foreground leading-none">
            #{bestRanking}
          </span>
        </div>

        {/* Col 4 (Live Status): Proj. Next & Proj. Max — the reason the row is expanded.
            Rendered only when the source actually provides them: they're absent for
            players who are out (the exit round is already shown in the main row) and
            also for active players the source publishes no projection for, which is
            common further down the ranking. */}
        <div className="flex gap-8 items-start">
          {isActive && hasProjections && (
            <>
              {/* Next */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-foreground font-bold flex items-center gap-1.5">
                  {t.rankings.expandedCard.projNext}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-heading font-extrabold text-foreground tabular-nums leading-none">
                    {formatPoints(nextMatchPoints)}
                  </span>
                  <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.pts}</span>
                </div>
                <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.winsNextMatch}</span>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-10 bg-border-subtle/80 mt-1" />

              {/* Max */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
                  {t.rankings.expandedCard.projMax}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-heading font-extrabold text-primary-olive tabular-nums leading-none">
                    {formatPoints(maxPoints)}
                  </span>
                  <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.pts}</span>
                </div>
                <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.titleWin}</span>
              </div>
            </>
          )}
        </div>

        {/* Col 5 (Points): Official Points right-aligned to match the points above */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
            {t.rankings.expandedCard.officialPoints}
          </span>
          <div className="flex justify-end items-baseline gap-1">
            <span className="text-[16px] font-heading font-extrabold text-foreground tabular-nums leading-none">
              {formatPoints(officialPoints)}
            </span>
            <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.pts}</span>
          </div>
          <span className="text-[10px] text-foreground/60 font-medium">{t.rankings.expandedCard.atpVerified}</span>
        </div>

        {/* Col 6 & 7: Skip [+/-] and [Chevron] */}
        <div />
        <div />
      </div>
    </div>
  );
}
