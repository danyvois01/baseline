"use client";

import { OfficialTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { OfficialRankingEntry } from "@/types";

interface OfficialClientProps {
  initialRankings: OfficialRankingEntry[];
  lastUpdated?: string;
}

export function OfficialClient({
  initialRankings,
  lastUpdated,
}: OfficialClientProps) {
  return (
    <RankingPageShell
      title="Official ATP Rankings"
      subtitle="The official weekly ATP Tour singles rankings."
      lastUpdated={lastUpdated}
      entries={initialRankings}
    >
      {(filtered) => <OfficialTable entries={filtered} initialCount={20} />}
    </RankingPageShell>
  );
}
