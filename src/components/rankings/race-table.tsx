"use client";

/**
 * RaceTable — Race to Turin rankings table.
 * Same column layout as Live Rankings (# MOVE | Player | Live Status | Points | +/-)
 * plus a STATUS column for qualification state.
 * Includes a "TURIN QUALIFICATION CUT" separator after the top-8 cutoff.
 * No expandable rows.
 */

import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { PlayerCell } from "./player-cell";
import { cn } from "@/lib/utils";
import { formatPoints, formatDiff } from "@/lib/format";
import { usePagination } from "./primitives/use-pagination";
import { CircleCheckBig, Trophy } from "lucide-react";
import type { RaceRankingEntry } from "@/types";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Grid column definition.
 * Col 1 (50px):  # rank number (centered).
 * Col 2 (80px):  MOVE badge (centered).
 * Col 3 (1fr):   Player name + flag + nationality + age.
 * Col 4 (1.2fr): Live Status.
 * Col 5 (120px): Points (right-aligned).
 * Col 6 (100px): +/- point diff badge (centered).
 * Col 7 (160px): Status (Qualified / In Contention).
 */
const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_160px]";

const QUALIFICATION_CUTOFF = 8;

interface RaceTableProps {
  entries: RaceRankingEntry[];
  initialCount?: number;
}

export function RaceTable({ entries, initialCount = 20 }: RaceTableProps) {
  const { t } = useTranslation();
  const { visibleCount, hasMore, buttonLabel, showMore } = usePagination(
    entries.length,
    initialCount,
    t.rankings.race.showFullRace,
  );
  const visibleEntries = entries.slice(0, visibleCount);

  return (
    <div className="w-full">

      {/* ═══ DESKTOP TABLE ═══ */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div
          className={cn(
            "grid items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30",
            GRID_COLS
          )}
        >
          <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
            {t.rankings.table.rank}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
            {t.rankings.table.move}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider">
            {t.rankings.table.player}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider">
            {t.rankings.table.liveStatus}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider text-right">
            {t.rankings.table.points}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
            {t.rankings.table.diff}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
            {t.rankings.table.status}
          </span>
        </div>

        {/* Table Rows */}
        {visibleEntries.map((entry, index) => {
          const showCut =
            entry.rank === QUALIFICATION_CUTOFF + 1 &&
            index > 0 &&
            visibleEntries[index - 1]?.rank <= QUALIFICATION_CUTOFF;

          return (
            <div key={entry.player.id}>
              {showCut && (
                <div className={cn("grid items-center px-6 py-3 bg-surface-gray/10 border-y border-border-subtle/50 my-1", GRID_COLS)}>
                  <div className="col-span-3 border-t border-border-subtle" />
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-[10px] tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-sm border border-white/10 whitespace-nowrap">
                      <Trophy className="h-3.5 w-3.5 shrink-0 text-baseline-lime" />
                      {t.rankings.race.turinCut}
                    </span>
                  </div>
                  <div className="col-span-3 border-t border-border-subtle" />
                </div>
              )}

              <div
                className={cn(
                  "group grid items-center px-6 py-4 transition-all duration-300",
                  GRID_COLS,
                  "hover:bg-baseline-lime/5"
                )}
              >
                <span className="text-headline-md text-foreground font-heading font-extrabold text-center">
                  {entry.rank}
                </span>

                <div className="flex justify-center">
                  <MovementBadge
                    type={entry.movement.type}
                    value={entry.movement.value}
                  />
                </div>

                <PlayerCell player={entry.player} />

                <LiveStatusCell
                  isActive={entry.liveStatus.isActive}
                  tournament={entry.liveStatus.tournament}
                  stage={entry.liveStatus.stage}
                />

                <span className="text-[20px] font-heading text-foreground font-extrabold text-right tabular-nums">
                  {formatPoints(entry.points)}
                </span>

                <div className="flex justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums",
                      entry.pointsDiff > 0
                        ? "bg-success-green-bg text-success-green-text"
                        : entry.pointsDiff < 0
                          ? "bg-error-red-bg text-error-red-text"
                          : "bg-surface-container text-on-surface-variant"
                    )}
                  >
                    {formatDiff(entry.pointsDiff)}
                  </span>
                </div>

                <div className="flex justify-center">
                  {entry.raceStatus === "qualified" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-green-bg text-success-green-text px-3 py-1 text-xs font-medium">
                      <CircleCheckBig className="h-3.5 w-3.5" />
                      {t.rankings.race.qualified}
                    </span>
                  ) : (
                    <span className="text-body-sm text-text-muted">
                      {t.rankings.race.inContention}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ MOBILE CARD LIST ═══ */}
      <div className="md:hidden divide-y divide-border-subtle/60">
        {visibleEntries.map((entry, index) => {
          const showCut =
            entry.rank === QUALIFICATION_CUTOFF + 1 &&
            index > 0 &&
            visibleEntries[index - 1]?.rank <= QUALIFICATION_CUTOFF;

          return (
            <div key={entry.player.id}>
              {showCut && (
                <div className="flex justify-center py-2 bg-surface-gray/10 border-y border-border-subtle/50">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-[10px] tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-sm border border-white/10">
                    <Trophy className="h-3.5 w-3.5 shrink-0 text-baseline-lime" />
                    {t.rankings.race.turinCut}
                  </span>
                </div>
              )}

              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Rank + movement */}
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <span className="text-[20px] font-heading font-extrabold text-foreground">
                      {entry.rank}
                    </span>
                    <MovementBadge
                      type={entry.movement.type}
                      value={entry.movement.value}
                    />
                  </div>

                  {/* Player */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-foreground truncate">
                        {entry.player.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={cn("fi rounded-sm", `fi-${entry.player.countryCode}`)}
                        style={{ fontSize: "12px" }}
                      />
                      <span className="text-[11px] text-text-muted font-medium uppercase">
                        {entry.player.nationality}
                      </span>
                      <span className="text-[11px] text-text-muted">·</span>
                      <span className="text-[11px] text-text-muted">
                        {entry.player.age}
                      </span>
                    </div>
                  </div>

                  {/* Points + status */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[18px] font-heading font-extrabold text-foreground tabular-nums">
                      {formatPoints(entry.points)}
                    </span>
                    {entry.raceStatus === "qualified" ? (
                      <span className="text-[11px] font-bold text-success-green-text">
                        {t.rankings.race.qualified}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "text-[11px] font-bold tabular-nums",
                          entry.pointsDiff > 0
                            ? "text-success-green-text"
                            : entry.pointsDiff < 0
                              ? "text-error-red-text"
                              : "text-text-muted"
                        )}
                      >
                        {formatDiff(entry.pointsDiff)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Live status */}
                {entry.liveStatus.tournament && (
                  <div className="mt-2 ml-11">
                    <LiveStatusCell
                      isActive={entry.liveStatus.isActive}
                      tournament={entry.liveStatus.tournament}
                      stage={entry.liveStatus.stage}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4 border-t border-border-subtle">
          <button
            onClick={showMore}
            className="rounded-full border border-border-subtle bg-surface-white px-6 py-2.5 text-label-md text-foreground font-medium hover:bg-surface-hover transition-all cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
