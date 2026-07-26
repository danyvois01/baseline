"use client";

/**
 * OfficialTable — Official ATP Rankings data table.
 * Grid: # | MOVE | Player | Points | Next Week
 * No expandable rows. No Live Status column.
 * "Next Week" shows projected points + projected rank movement for the upcoming week.
 */

import type { OfficialRankingEntry } from "@/types";
import { MovementBadge } from "./movement-badge";
import { PlayerCell } from "./player-cell";
import { cn } from "@/lib/utils";
import { formatPoints } from "@/lib/format";
import { usePagination } from "./primitives/use-pagination";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Grid column definition.
 * Col 1 (50px):  # rank number (centered).
 * Col 2 (80px):  MOVE badge (centered).
 * Col 3 (1fr):   Player name + flag + nationality + age.
 * Col 4 (120px): Points (right-aligned).
 * Col 5 (160px): Next Week — projected points + rank move (right-aligned).
 */
const GRID_COLS = "grid-cols-[50px_80px_1fr_120px_160px]";

interface OfficialTableProps {
  entries: OfficialRankingEntry[];
  initialCount?: number;
}

export function OfficialTable({
  entries,
  initialCount = 20,
}: OfficialTableProps) {
  const { t } = useTranslation();
  const { visibleCount, hasMore, buttonLabel, showMore } = usePagination(
    entries.length,
    initialCount,
  );
  const visibleEntries = entries.slice(0, visibleCount);

  return (
    <div className="w-full bg-surface-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">

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
          <span className="text-label-md text-text-muted uppercase tracking-wider text-right">
            {t.rankings.table.points}
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider text-right pr-2">
            {t.rankings.table.nextWeek}
          </span>
        </div>

        {/* Table Rows */}
        {visibleEntries.map((entry) => (
          <div
            key={entry.player.id}
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

            <span className="text-[20px] font-heading text-foreground font-extrabold text-right tabular-nums">
              {formatPoints(entry.points)}
            </span>

            <div className="flex flex-col items-end gap-0.5 pr-2">
              <span className="text-body-md font-semibold text-foreground tabular-nums">
                {formatPoints(entry.nextWeek.points)}
              </span>
              {entry.nextWeek.rankChange !== 0 ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                    entry.nextWeek.rankChange > 0
                      ? "bg-success-green-bg text-success-green-text"
                      : "bg-error-red-bg text-error-red-text"
                  )}
                >
                  <span className="text-[9px]">
                    {entry.nextWeek.rankChange > 0 ? "▲" : "▼"}
                  </span>
                  {Math.abs(entry.nextWeek.rankChange)}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-surface-container text-on-surface-variant">
                  —
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MOBILE CARD LIST ═══ */}
      <div className="md:hidden divide-y divide-border-subtle/60">
        {visibleEntries.map((entry) => (
          <div
            key={entry.player.id}
            className="px-4 py-3"
          >
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

              {/* Points + next week */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[18px] font-heading font-extrabold text-foreground tabular-nums">
                  {formatPoints(entry.points)}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted tabular-nums">
                    {formatPoints(entry.nextWeek.points)}
                  </span>
                  {entry.nextWeek.rankChange !== 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        entry.nextWeek.rankChange > 0
                          ? "text-success-green-text"
                          : "text-error-red-text"
                      )}
                    >
                      {entry.nextWeek.rankChange > 0 ? "▲" : "▼"}{Math.abs(entry.nextWeek.rankChange)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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
