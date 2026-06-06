"use client";

/**
 * RaceTable — Race to Turin rankings table.
 * Same column layout as Live Rankings (# MOVE | Player | Live Status | Points | +/-)
 * plus a STATUS column for qualification state.
 * Includes a "TURIN QUALIFICATION CUT" separator after the top-8 cutoff.
 * No expandable rows.
 */

import { useState } from "react";
import type { RaceRankingEntry } from "@/lib/mock-data-race";
import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";

/** Format number with comma as thousands separator */
function formatPoints(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Format diff with sign */
function formatDiff(n: number): string {
  const abs = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (n > 0) return `+${abs}`;
  if (n < 0) return `-${abs}`;
  return "—";
}

/**
 * Grid column definition.
 * Col 1 (130px): # and MOVE merged.
 * Col 2 (1fr):   Player name + flag + nationality + age.
 * Col 3 (1.2fr): Live Status.
 * Col 4 (120px): Points (right-aligned).
 * Col 5 (100px): +/- point diff badge (centered).
 * Col 6 (160px): Status (Qualified / In Contention).
 */
const GRID_COLS = "grid-cols-[130px_1fr_1.2fr_120px_100px_160px]";

/** Number of qualification slots for Turin Finals */
const QUALIFICATION_CUTOFF = 8;

interface RaceTableProps {
  entries: RaceRankingEntry[];
  /** Number of entries to show initially */
  initialCount?: number;
}

export function RaceTable({ entries, initialCount = 10 }: RaceTableProps) {
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
        {/* # and MOVE share one header cell */}
        <div className="flex items-center gap-4">
          <span className="text-label-md text-text-muted uppercase tracking-wider">
            #
          </span>
          <span className="text-label-md text-text-muted uppercase tracking-wider">
            Move
          </span>
        </div>
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
        /** Show qualification cut separator after position = QUALIFICATION_CUTOFF */
        const showCut =
          entry.rank === QUALIFICATION_CUTOFF + 1 &&
          index > 0 &&
          visibleEntries[index - 1]?.rank <= QUALIFICATION_CUTOFF;

        return (
          <div key={entry.player.id}>
            {/* TURIN QUALIFICATION CUT separator */}
            {showCut && (
              <div className="relative flex items-center py-3 px-6">
                <div className="flex-1 border-t border-border-subtle" />
                <span className="px-4 text-label-md text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">
                  Turin Qualification Cut
                </span>
                <div className="flex-1 border-t border-border-subtle" />
              </div>
            )}

            {/* Data Row */}
            <div
              className={cn(
                "group grid items-center px-6 py-4 transition-all duration-150 border-b border-border-subtle/60 last:border-b-0",
                "hover:bg-surface-hover"
              )}
              style={{ gridTemplateColumns: "130px 1fr 1.2fr 120px 100px 160px" }}
            >
              {/* Rank + Movement */}
              <div className="flex items-center gap-3">
                <span className="text-headline-md text-deep-navy font-bold">
                  {entry.rank}
                </span>
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

              {/* Live Status */}
              <LiveStatusCell
                isActive={entry.liveStatus.isActive}
                tournament={entry.liveStatus.tournament}
                stage={entry.liveStatus.stage}
              />

              {/* Points */}
              <span className="text-headline-md text-deep-navy font-bold text-right tabular-nums">
                {formatPoints(entry.points)}
              </span>

              {/* Diff (point change) */}
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

              {/* Status (Qualified / In Contention) */}
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
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-label-md text-deep-navy font-medium hover:bg-surface-hover transition-all cursor-pointer"
          >
            Load Full Race
          </button>
        </div>
      )}
    </div>
  );
}
