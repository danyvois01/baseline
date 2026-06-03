"use client";

/**
 * RankingsTable — Live ATP Rankings data table with expandable rows.
 * Displays ranking data in a borderless layout with smooth expand/collapse
 * interaction revealing secondary data (Pros, Max, Official, Diff).
 */

import { useState, useCallback } from "react";
import type { LiveRankingEntry } from "@/lib/mock-data";
import { PlayerAvatar } from "./player-avatar";
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

/** Grid column definition shared between header and rows */
const GRID_COLS = "grid-cols-[80px_1fr_60px_1fr_140px_80px_50px]";

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
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          #
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider">
          Player
        </span>
        <span className="text-label-md text-text-muted uppercase tracking-wider text-center">
          Age
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
                "group grid items-center px-6 py-4 transition-colors duration-150 cursor-pointer",
                GRID_COLS,
                isExpanded
                  ? "bg-surface-hover"
                  : "hover:bg-surface-hover"
              )}
            >
              {/* Rank */}
              <span className="text-headline-md text-deep-navy font-bold">
                {entry.rank}
              </span>

              {/* Player — Flag + Name + Nationality pill */}
              <div className="flex items-center gap-3">
                <PlayerAvatar initials={entry.player.initials} />
                <div className="flex flex-col">
                  <span className="text-body-md font-semibold text-deep-navy group-hover:text-primary-olive transition-colors">
                    {entry.player.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
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
                  </div>
                </div>
              </div>

              {/* Age */}
              <span className="text-body-sm text-deep-navy text-center">
                {entry.player.age}
              </span>

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

              {/* Movement (rank change) */}
              <div className="flex justify-center">
                <MovementBadge
                  type={entry.movement.type}
                  value={entry.movement.value}
                />
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

            {/* Expanded Card — secondary data */}
            {isExpanded && (
              <ExpandedCard
                nextMatchPoints={entry.nextMatchPoints}
                maxPoints={entry.maxPoints}
                officialPoints={entry.officialPoints}
                pointsDiff={entry.pointsDiff}
              />
            )}
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
