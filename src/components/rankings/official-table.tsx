"use client";

/**
 * OfficialTable — Official ATP Rankings data table.
 * Grid: # | MOVE | Player | Points | Next Week
 * No Live Status column.
 * "Next Week" shows projected points + projected rank movement for the upcoming week.
 *
 * Desktop shows Next Week as its own column. On mobile it lives in an
 * expandable panel, so the card keeps a single points figure on the right.
 */

import { useState, useCallback, type ReactNode } from "react";
import type { OfficialRankingEntry } from "@/types";
import { MovementBadge } from "./movement-badge";
import { PlayerCell } from "./player-cell";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPoints } from "@/lib/format";
import { usePagination } from "./primitives/use-pagination";
import { ROW_MIN_H, HEADER_MIN_H } from "./primitives/table-metrics";
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
  /** Optional controls row (search/filter/updated) rendered inside the widget, above the table. */
  toolbar?: ReactNode;
}

export function OfficialTable({
  entries,
  initialCount = 20,
  toolbar,
}: OfficialTableProps) {
  const { t } = useTranslation();
  const { visibleCount, hasMore, buttonLabel, showMore } = usePagination(
    entries.length,
    initialCount,
  );
  const visibleEntries = entries.slice(0, visibleCount);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full bg-surface-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">

      {/* Embedded controls (search / filter / updated) */}
      {toolbar}

      {/* ═══ DESKTOP TABLE ═══ */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div
          className={cn(
            "grid items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30",
            HEADER_MIN_H,
            GRID_COLS
          )}
        >
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-center">
            {t.rankings.table.rank}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-center">
            {t.rankings.table.move}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            {t.rankings.table.player}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-right">
            {t.rankings.table.points}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-right pr-2">
            {t.rankings.table.nextWeek}
          </span>
        </div>

        {/* Table Rows */}
        {visibleEntries.map((entry, idx) => (
          /* Border lives on this outer wrapper, not on the grid itself: with
             border-box sizing a border on the ROW_MIN_H element would eat into
             the 76px and desync this table from Live/Race by 1px per row. */
          <div
            key={entry.player.id}
            className="border-b border-border-subtle/40 last:border-b-0"
          >
            <div
              className={cn(
                "group grid items-center px-6 py-4 transition-all duration-300",
                ROW_MIN_H,
                GRID_COLS,
                idx % 2 === 1 && "bg-surface-gray/20",
                "hover:bg-baseline-lime/5"
              )}
            >
              <span className="text-headline-md text-foreground font-heading font-extrabold text-center tabular-nums">
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
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-foreground/40">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MOBILE CARD LIST ═══ */}
      <div className="md:hidden divide-y divide-border-subtle/40">
        {visibleEntries.map((entry) => {
          const isExpanded = expandedIds.has(entry.player.id);

          return (
            <div
              key={entry.player.id}
              onClick={() => toggleExpand(entry.player.id)}
              className={cn(
                // Fixed-width rank gutter (fits a 3-digit rank): every name and
                // the expanded panel start at the same offset.
                "grid grid-cols-[36px_minmax(0,1fr)] gap-x-2 px-4 py-3 transition-colors cursor-pointer",
                isExpanded ? "bg-baseline-lime/5" : "active:bg-baseline-lime/5"
              )}
            >
              {/* Rank + movement stacked — the inline variant is narrow enough to
                  live inside the rank gutter. Coloured here: this table carries
                  no points diff, so the rank move is the only signal value. */}
              <div className="flex flex-col items-start">
                <span className="text-[20px] font-heading font-extrabold text-foreground tabular-nums">
                  {entry.rank}
                </span>
                <MovementBadge
                  type={entry.movement.type}
                  value={entry.movement.value}
                  variant="inline"
                  colored
                />
              </div>

              {/* Player | points | chevron */}
              <div className="flex items-start gap-3">
                {/* Player */}
                <div className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold text-foreground truncate">
                    {entry.player.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={cn("fi rounded-sm", `fi-${entry.player.countryCode}`)}
                      style={{ fontSize: "12px" }}
                    />
                    <span className="text-[11px] text-foreground/60 font-medium uppercase">
                      {entry.player.nationality}
                    </span>
                    <span className="text-[10px] text-foreground/30">·</span>
                    <span className="text-[11px] text-foreground/60 font-medium tabular-nums">
                      {entry.player.age}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <span className="text-[18px] font-heading font-extrabold text-foreground tabular-nums shrink-0">
                  {formatPoints(entry.points)}
                </span>

                {/* Chevron */}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 mt-1 text-text-muted shrink-0 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>

              {/* Expanded details — next week projection. Labelled, so neither
                  the points nor the arrow can be mistaken for current-week
                  values (the gutter arrow is this week's move). */}
              <div
                className="col-start-2 grid transition-[grid-template-rows] duration-200 ease-out"
                style={{
                  gridTemplateRows: isExpanded ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle/50">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                        {t.rankings.table.nextWeek}
                      </span>
                      <span className="text-sm font-heading font-extrabold text-foreground tabular-nums">
                        {formatPoints(entry.nextWeek.points)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                        {t.rankings.table.move}
                      </span>
                      <MovementBadge
                        type={
                          entry.nextWeek.rankChange > 0
                            ? "up"
                            : entry.nextWeek.rankChange < 0
                              ? "down"
                              : "none"
                        }
                        value={Math.abs(entry.nextWeek.rankChange)}
                        variant="inline"
                        colored
                      />
                    </div>
                  </div>
                </div>
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
