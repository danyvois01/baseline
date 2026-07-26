"use client";

import { OfficialTable } from "@/components/rankings";
import { RankingPageShell } from "@/components/rankings/ranking-page-shell";
import type { OfficialRankingEntry } from "@/types";
import { useTranslation } from "@/providers/locale-provider";

interface OfficialClientProps {
  initialRankings: OfficialRankingEntry[];
  lastUpdated?: string;
}

export function OfficialClient({
  initialRankings,
  lastUpdated,
}: OfficialClientProps) {
  const { t } = useTranslation();

  return (
    <RankingPageShell
      title={t.rankings.pages.officialTitle}
      subtitle={t.rankings.pages.officialSubtitle}
      lastUpdated={lastUpdated}
      entries={initialRankings}
    >
      {(filtered) => <OfficialTable entries={filtered} initialCount={20} />}
    </RankingPageShell>
  );
}
