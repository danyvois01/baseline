"use client";

import { RaceTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { RaceRankingEntry, RaceSummary } from "@/types";
import { useTranslation } from "@/providers/locale-provider";
import { TrendingUp } from "lucide-react";

interface RaceClientProps {
  summary: RaceSummary;
  initialRankings: RaceRankingEntry[];
  lastUpdated?: string;
}

export function RaceClient({
  summary,
  initialRankings,
  lastUpdated,
}: RaceClientProps) {
  const { t } = useTranslation();

  return (
    <RankingPageShell
      title={t.rankings.pages.raceTitle}
      subtitle={t.rankings.pages.raceSubtitle}
      lastUpdated={lastUpdated}
      entries={initialRankings}
      headerExtra={
        <div className="flex flex-col md:items-end">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-baseline-lime" />
            <span className="text-[11px] text-white/60 uppercase tracking-wider font-bold">
              {t.rankings.race.cutoffProjection}
            </span>
          </div>
          <p className="text-[28px] md:text-[32px] font-heading font-extrabold text-white leading-none mb-1">
            {summary.cutoffPoints}
          </p>
          <p className="text-body-sm text-white/60">
            {t.rankings.race.cutoffCaption}
          </p>
        </div>
      }
    >
      {(filtered, toolbar) => (
        <div className="w-full bg-surface-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">
          {toolbar}
          <RaceTable entries={filtered} initialCount={20} />
        </div>
      )}
    </RankingPageShell>
  );
}
