"use client";

import { RankingsTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { LiveRankingEntry } from "@/types";

interface LiveClientProps {
  initialRankings: LiveRankingEntry[];
  lastUpdated: string;
}

export function LiveClient({ initialRankings, lastUpdated }: LiveClientProps) {
  return (
    <RankingPageShell
      title="Live ATP Rankings"
      subtitle="Real-time point projections based on ongoing tournament results."
      lastUpdated={lastUpdated}
      entries={initialRankings}
    >
      {(filtered) => <RankingsTable entries={filtered} initialCount={20} />}
    </RankingPageShell>
  );
}
