"use client";

import { RaceSummaryCards, RaceTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { RaceRankingEntry, RaceSummary } from "@/types";
import { useTranslation } from "@/providers/locale-provider";

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
    <>
      {/* Page header + filters via shell */}
      <RankingPageShell
        title={t.rankings.pages.raceTitle}
        subtitle={t.rankings.pages.raceSubtitle}
        lastUpdated={lastUpdated}
        entries={initialRankings}
      >
        {(filtered) => (
          <>
            {/* Summary Cards */}
            <RaceSummaryCards summary={summary} />

            {/* Table Widget */}
            <div className="w-full bg-surface-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">
              <RaceTable entries={filtered} initialCount={20} />
            </div>
          </>
        )}
      </RankingPageShell>
    </>
  );
}
