"use client";

/**
 * RankingsTable — Live ATP Rankings data table with expandable rows.
 * Desktop: 7-column grid. Mobile: compact card layout.
 */

import { useState, useCallback, type ReactNode } from "react";
import type { LiveRankingEntry } from "@/types";
import { MovementBadge } from "./movement-badge";
import { LiveStatusCell } from "./live-status-cell";
import { PlayerCell } from "./player-cell";
import { PointsDiffBadge } from "./points-diff-badge";
import { ExpandedCard } from "./expanded-card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPoints, formatDiff } from "@/lib/format";
import { usePagination } from "./primitives/use-pagination";
import { useTranslation } from "@/providers/locale-provider";

const GRID_COLS = "grid-cols-[50px_80px_1fr_1.2fr_120px_100px_50px]";

interface RankingsTableProps {
  entries: LiveRankingEntry[];
  initialCount?: number;
  /** Optional controls row (search/filter/updated) rendered inside the widget, above the table. */
  toolbar?: ReactNode;
}

export function RankingsTable({
  entries,
  initialCount = 20,
  toolbar,
}: RankingsTableProps) {
  const { t } = useTranslation();
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

      {/* Embedded controls (search / filter / updated) */}
      {toolbar}

      {/* ═══ DESKTOP TABLE ═══ */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div
          className={cn(
            "grid items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30",
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
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            {t.rankings.table.liveStatus}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-right">
            {t.rankings.table.points}
          </span>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider text-center">
            {t.rankings.table.diff}
          </span>
          <span />
        </div>

        {/* Table Rows */}
        {visibleEntries.map((entry, idx) => {
          const isExpanded = expandedIds.has(entry.player.id);

          return (
            <div
              key={entry.player.id}
              className="border-b border-border-subtle/40 last:border-b-0"
            >
              <div
                onClick={() => toggleExpand(entry.player.id)}
                className={cn(
                  "group grid items-center px-6 py-4 transition-all duration-300 cursor-pointer",
                  GRID_COLS,
                  isExpanded
                    ? "bg-baseline-lime/5"
                    : cn(idx % 2 === 1 && "bg-surface-gray/20", "hover:bg-baseline-lime/5")
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

                <LiveStatusCell
                  isActive={entry.liveStatus.isActive}
                  tournament={entry.liveStatus.tournament}
                  stage={entry.liveStatus.stage}
                />

                <span className="text-[20px] font-heading text-foreground font-extrabold text-right tabular-nums">
                  {formatPoints(entry.points)}
                </span>

                <div className="flex justify-center">
                  <PointsDiffBadge diff={entry.pointsDiff} />
                </div>

                <div className="flex justify-end">
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-foreground/50 group-hover:text-primary-olive transition-all duration-200",
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
      </div>

      {/* ═══ MOBILE CARD LIST ═══ */}
      <div className="md:hidden divide-y divide-border-subtle/40">
        {visibleEntries.map((entry, idx) => {
          const isExpanded = expandedIds.has(entry.player.id);

          return (
            <div
              key={entry.player.id}
              onClick={() => toggleExpand(entry.player.id)}
              className={cn(
                "px-4 py-3 transition-colors cursor-pointer",
                isExpanded
                  ? "bg-baseline-lime/5"
                  : cn(idx % 2 === 1 && "bg-surface-gray/20", "active:bg-baseline-lime/5")
              )}
            >
              {/* Main row: rank | player info | points */}
              <div className="flex items-center gap-3">
                {/* Rank + movement */}
                <div className="flex flex-col items-center shrink-0 w-8">
                  <span className="text-[20px] font-heading font-extrabold text-foreground tabular-nums">
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
                    <span className="text-[11px] text-foreground/60 font-medium uppercase">
                      {entry.player.nationality}
                    </span>
                    <span className="text-[10px] text-foreground/30">·</span>
                    <span className="text-[11px] text-foreground/60 font-medium tabular-nums">
                      {entry.player.age}
                    </span>
                  </div>
                </div>

                {/* Points + diff */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[18px] font-heading font-extrabold text-foreground tabular-nums">
                    {formatPoints(entry.points)}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-bold tabular-nums",
                      entry.pointsDiff > 0
                        ? "text-success-green-text"
                        : entry.pointsDiff < 0
                          ? "text-error-red-text"
                          : "text-foreground/60"
                    )}
                  >
                    {formatDiff(entry.pointsDiff)}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-foreground/50 shrink-0 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>

              {/* Live status (secondary line) */}
              {entry.liveStatus.tournament && (
                <div className="mt-2 ml-11">
                  <LiveStatusCell
                    isActive={entry.liveStatus.isActive}
                    tournament={entry.liveStatus.tournament}
                    stage={entry.liveStatus.stage}
                  />
                </div>
              )}

              {/* Expanded details */}
              <div
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{
                  gridTemplateRows: isExpanded ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 ml-11 grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle/50">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                        {t.rankings.expandedCard.careerHigh}
                      </span>
                      <span className="text-sm font-heading font-extrabold text-foreground">
                        #{entry.bestRanking}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                        {t.rankings.expandedCard.officialPoints}
                      </span>
                      <span className="text-sm font-heading font-extrabold text-foreground tabular-nums">
                        {formatPoints(entry.officialPoints)}
                      </span>
                    </div>
                    {entry.liveStatus.isActive && (
                      <>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                            {t.rankings.expandedCard.projNext}
                          </span>
                          <span className="text-sm font-heading font-extrabold text-foreground tabular-nums">
                            {formatPoints(entry.nextMatchPoints)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold block">
                            {t.rankings.expandedCard.projMax}
                          </span>
                          <span className="text-sm font-heading font-extrabold text-foreground tabular-nums">
                            {formatPoints(entry.maxPoints)}
                          </span>
                        </div>
                      </>
                    )}
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
