"use client";

/**
 * RankingsTable — Live ATP Rankings data table with expandable rows.
 * Grid: [# MOVE] | Player | Live Status | Points | +/- | Chevron
 * Smooth expand/collapse via CSS grid-template-rows transition.
 */

import { useState, useCallback } from "react";
import type { LiveRankingEntry } from "@/types";
import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { PlayerCell } from "./player-cell";
import { ExpandedCard } from "./expanded-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPoints, formatDiff } from "@/lib/format";
import { usePagination } from "./primitives/use-pagination";

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
  initialCount?: number;
}

export function RankingsTable({
  entries,
  initialCount = 20,
}: RankingsTableProps) {
  const { visibleCount, hasMore, buttonLabel, showMore } = usePagination(
    entries.length,
    initialCount,
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const visibleEntries = entries.slice(0, visibleCount);

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
            {/* Collapsed Row */}
            <div
              onClick={() => toggleExpand(entry.player.id)}
              className={cn(
                "group grid items-center px-6 py-4 transition-all duration-300 cursor-pointer",
                GRID_COLS,
                isExpanded
                  ? "bg-baseline-lime/5"
                  : "hover:bg-baseline-lime/5"
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

              <div className="flex justify-end">
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-on-surface-variant group-hover:text-primary-olive transition-all duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>

            {/* Expanded Card */}
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
                  isActive={entry.liveStatus.isActive}
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
