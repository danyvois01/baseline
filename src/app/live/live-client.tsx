"use client";

import { RankingsTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { LiveRankingEntry } from "@/types";
import { useTranslation } from "@/providers/locale-provider";

interface LiveClientProps {
  initialRankings: LiveRankingEntry[];
  lastUpdated: string;
}

export function LiveClient({ initialRankings, lastUpdated }: LiveClientProps) {
  const { t } = useTranslation();

  return (
    <RankingPageShell
      title={t.rankings.pages.liveTitle}
      subtitle={t.rankings.pages.liveSubtitle}
      lastUpdated={lastUpdated}
      entries={initialRankings}
    >
      {(filtered) => <RankingsTable entries={filtered} initialCount={20} />}
    </RankingPageShell>
  );
}
