"use client";

/**
 * RaceTable — Race to Turin rankings table.
 * Same column layout as Live Rankings (# MOVE | Player | Live Status | Points | +/-)
 * plus a STATUS column for qualification state.
 * Includes a "TURIN QUALIFICATION CUT" separator after the top-8 cutoff.
 * No expandable rows.
 */

import { useState } from "react";
import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Trophy } from "lucide-react";
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
 * Col 1 (50px):  # rank number (centered).
 * Col 2 (80px):  MOVE badge (centered).
 * Col 3 (1fr):   Player name + flag + nationality + age.
 * Col 4 (1.2fr): Live Status.
 * Col 5 (120px): Points (right-aligned).
 * Col 6 (100px): +/- point diff badge (centered).
 * Col 7 (160px): Status (Qualified / In Contention).
 */
const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_160px]";

/** Number of qualification slots for Turin Finals */
const QUALIFICATION_CUTOFF = 8;

interface RaceTableProps {
  entries: any[];
  /** Number of entries to show initially */
  initialCount?: number;
}

export function RaceTable({ entries, initialCount = 20 }: RaceTableProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

  const getNextIncrement = () => {
    if (visibleCount <= 20) return 50;
    if (visibleCount <= 50) return 100;
    return visibleCount + 100;
  };

  const nextLimit = Math.min(getNextIncrement(), entries.length);
  const buttonLabel = nextLimit >= entries.length ? "Show Full Race" : `Show Top ${nextLimit}`;

  return (
    <div className="w-full">
      {/* Table Header */}
      <div
        className={cn(
          "grid items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30",
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
              <div className={cn("grid items-center px-6 py-3 bg-surface-gray/10 border-y border-border-subtle/50 my-1", GRID_COLS)}>
                {/* Columns 1-3 (Rank, Move, Player): line */}
                <div className="col-span-3 border-t border-border-subtle" />
                {/* Column 4 (Live Status): Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 bg-deep-navy text-white font-bold text-[10px] tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-sm border border-white/10 whitespace-nowrap">
                    <Trophy className="h-3.5 w-3.5 shrink-0 text-baseline-lime" />
                    Turin Cut
                  </span>
                </div>
                {/* Columns 5-7 (Points, +/-, Status): line */}
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
              {/* # — Rank number */}
              <span className="text-headline-md text-deep-navy font-heading font-extrabold text-center">
                {entry.rank}
              </span>

              {/* MOVE — Movement badge (centered in its own column) */}
              <div className="flex justify-center">
                <MovementBadge
                  type={entry.movement?.type || entry.rankChangeDirection}
                  value={entry.movement?.value ?? entry.rankChange}
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
              <span className="text-[20px] font-heading text-deep-navy font-extrabold text-right tabular-nums">
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
                {entry.isQualified ? (
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
            onClick={() => setVisibleCount(nextLimit)}
            className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-label-md text-deep-navy font-medium hover:bg-surface-hover transition-all cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
