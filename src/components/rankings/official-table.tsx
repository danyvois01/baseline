"use client";

/**
 * OfficialTable — Official ATP Rankings data table.
 * Grid: # | MOVE | Player | Points | Next Week
 * No expandable rows. No Live Status column.
 * "Next Week" shows projected points + projected rank movement for the upcoming week.
 * Same visual patterns as RankingsTable and RaceTable for consistency.
 */

import { useState } from "react";
import type { OfficialRankingEntry } from "@/lib/mock-data-official";
import { MovementBadge } from "./movement-badge";
import { cn } from "@/lib/utils";
import "flag-icons/css/flag-icons.min.css";

/** Format number with comma as thousands separator */
function formatPoints(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
  /** Number of entries to show initially */
  initialCount?: number;
}

export function OfficialTable({
  entries,
  initialCount = 10,
}: OfficialTableProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

  return (
    <div className="w-full">
      {/* Table Header */}
      <div
        className={cn(
          "grid items-center px-6 py-3 border-b border-border-subtle",
          GRID_COLS
        )}
      >
        {/* # header */}
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          #
        </span>
        {/* MOVE header */}
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          Move
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          Player
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-right">
          Points
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-right pr-2">
          Next Week
        </span>
      </div>

      {/* Table Rows */}
      {visibleEntries.map((entry) => (
        <div
          key={entry.player.id}
          className={cn(
            "group grid items-center px-6 py-4 transition-all duration-150 border-b border-border-subtle/60 last:border-b-0",
            "hover:bg-surface-hover",
            GRID_COLS
          )}
        >
          {/* # — Rank number */}
          <span className="text-headline-md text-deep-navy font-bold text-center">
            {entry.rank}
          </span>

          {/* MOVE — Movement badge (centered in its own column) */}
          <div className="flex justify-center">
            <MovementBadge
              type={entry.movement.type}
              value={entry.movement.value}
            />
          </div>

          {/* Player — Flag + Name + Nationality · Age (no avatar) */}
          <div className="flex flex-col">
            <span className="text-body-md font-semibold text-deep-navy group-hover:text-primary-olive transition-colors">
              {entry.player.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "fi rounded-sm",
                  `fi-${entry.player.countryCode}`
                )}
                style={{ fontSize: "14px" }}
              />
              <span className="inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium px-2 py-0.5 uppercase tracking-wider">
                {entry.player.nationality}
              </span>
              <span className="text-[10px] text-on-surface-variant">·</span>
              <span className="text-[10px] text-on-surface-variant">
                {entry.player.age}
              </span>
            </div>
          </div>

          {/* Points */}
          <span className="text-headline-md text-deep-navy font-bold text-right tabular-nums">
            {formatPoints(entry.points)}
          </span>

          {/* Next Week — Projected points + rank movement */}
          <div className="flex flex-col items-end gap-0.5 pr-2">
            <span className="text-body-md font-semibold text-deep-navy tabular-nums">
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

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4 border-t border-border-subtle">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-label-md text-deep-navy font-medium hover:bg-surface-hover transition-all cursor-pointer"
          >
            Load More Players
          </button>
        </div>
      )}
    </div>
  );
}
