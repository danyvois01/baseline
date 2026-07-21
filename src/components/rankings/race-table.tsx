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
  const { visibleCount, hasMore, buttonLabel, showMore } = usePagination(
    entries.length,
    initialCount,
    "Show Full Race",
  );
  const visibleEntries = entries.slice(0, visibleCount);

  return (
    <div className="w-full">
      {/* Table Header */}
      <div
        className={cn(
          "grid items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30",
          GRID_COLS
        )}
      >
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          #
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          Move
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          Player
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          Live Status
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-right">
          Points
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          +/-
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          Status
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
            {/* TURIN QUALIFICATION CUT separator */}
            {showCut && (
              <div className={cn("grid items-center px-6 py-3 bg-surface-gray/10 border-y border-border-subtle/50 my-1", GRID_COLS)}>
                <div className="col-span-3 border-t border-border-subtle" />
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 bg-deep-navy text-white font-bold text-[10px] tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-sm border border-white/10 whitespace-nowrap">
                    <Trophy className="h-3.5 w-3.5 shrink-0 text-baseline-lime" />
                    Turin Cut
                  </span>
                </div>
                <div className="col-span-3 border-t border-border-subtle" />
              </div>
            )}

            {/* Data Row */}
            <div
              className={cn(
                "group grid items-center px-6 py-4 transition-all duration-300",
                GRID_COLS,
                "hover:bg-baseline-lime/5"
              )}
            >
              <span className="text-headline-md text-deep-navy font-heading font-extrabold text-center">
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

              <span className="text-[20px] font-heading text-deep-navy font-extrabold text-right tabular-nums">
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
                    Qualified
                  </span>
                ) : (
                  <span className="text-body-sm text-text-muted">
                    In Contention
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4 border-t border-border-subtle">
          <button
            onClick={showMore}
            className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-label-md text-deep-navy font-medium hover:bg-surface-hover transition-all cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
