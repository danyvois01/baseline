"use client";

/**
 * RankingsTable — Live ATP Rankings data table with expandable rows.
 * Grid: [# MOVE] | Player | Live Status | Points | +/- | Chevron
 * # and MOVE are merged into a single 130px cell, visually pairing the rank
 * number with its movement indicator. No avatar circle. Age in player meta.
 * Smooth expand/collapse via CSS grid-template-rows transition.
 */

import { useState, useCallback } from "react";
import type { LiveRankingEntry } from "@/lib/mock-data";
import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { ExpandedCard } from "./expanded-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
 * Grid column definition shared between header, rows, and expanded card.
 * Col 1 (50px):  # rank number (centered).
 * Col 2 (80px):  MOVE badge (centered).
 * Col 3 (1fr):   Player name + flag + nationality + age.
 * Col 4 (1.2fr): Live Status.
 * Col 5 (120px): Points (right-aligned).
 * Col 6 (100px): +/- point diff badge (centered).
 * Col 7 (50px):  Expand chevron.
 */
const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_50px]";

interface RankingsTableProps {
  entries: LiveRankingEntry[];
  /** Number of entries to show initially */
  initialCount?: number;
}

export function RankingsTable({
  entries,
  initialCount = 10,
}: RankingsTableProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

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
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          Live Status
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-right">
          Points
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          +/-
        </span>
        {/* Empty header for chevron column */}
        <span />
      </div>

      {/* Table Rows */}
      {visibleEntries.map((entry) => {
        const isExpanded = expandedIds.has(entry.player.id);

        return (
          <div
            key={entry.player.id}
            className="border-b border-border-subtle/60 last:border-b-0"
          >
            {/* Collapsed Row — clickable to expand */}
            <div
              onClick={() => toggleExpand(entry.player.id)}
              className={cn(
                "group grid items-center px-6 py-4 transition-all duration-150 cursor-pointer",
                GRID_COLS,
                isExpanded
                  ? "bg-surface-hover"
                  : "hover:bg-surface-hover"
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

              {/* Expand chevron */}
              <div className="flex justify-end">
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-on-surface-variant group-hover:text-primary-olive transition-all duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>

            {/* Expanded Card — smooth transition via grid-template-rows */}
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <ExpandedCard
                  nextMatchPoints={entry.nextMatchPoints}
                  maxPoints={entry.maxPoints}
                  officialPoints={entry.officialPoints}
                  bestRanking={entry.bestRanking}
                />
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
            className="text-label-md text-primary-olive font-bold hover:underline transition-all cursor-pointer"
          >
            Load More Players
          </button>
        </div>
      )}
    </div>
  );
}
