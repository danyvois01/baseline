"use client";

import { RaceSummaryCards, RaceTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { RaceRankingEntry, RaceSummary } from "@/types";

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
  return (
    <>
      {/* Page header + filters via shell */}
      <RankingPageShell
        title="Race to Turin"
        subtitle="The top 8 singles players of the calendar year qualify for the prestigious season finale in Turin, Italy."
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
