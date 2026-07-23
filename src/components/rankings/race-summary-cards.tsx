"use client";

/**
 * RaceSummaryCards — Three overview cards for the Race to Turin page.
 * Displays: Qualified Players count, Remaining Tournaments, Cut-off Projection.
 * Pill-shaped aesthetic with subtle borders, consistent with design system.
 */

import type { RaceSummary } from "@/types/ranking";
import { Trophy, TrendingUp } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";

interface RaceSummaryCardsProps {
  summary: RaceSummary;
}

export function RaceSummaryCards({ summary }: RaceSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Qualified Players */}
      <div className="rounded-xl border border-border-subtle bg-surface-white p-4 px-5">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-primary-olive" />
          <span className="text-label-lg text-primary-olive">
            {t.rankings.race.qualifiedPlayers}
          </span>
        </div>
        <p className="text-headline-md text-foreground mb-1.5">
          {summary.qualifiedCount}{" "}
          <span className="text-text-muted font-normal text-body-md">
            / {summary.totalSlots}
          </span>
        </p>
        <p className="text-body-sm text-text-muted">
          {summary.qualifiedNames.join(", ")}
        </p>
      </div>

      {/* Cut-off Projection */}
      <div className="rounded-xl border border-border-subtle bg-surface-white p-4 px-5">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-text-muted" />
          <span className="text-label-lg text-text-muted">
            {t.rankings.race.cutoffProjection}
          </span>
        </div>
        <p className="text-headline-md text-foreground mb-1.5">
          {summary.cutoffPoints}
        </p>
        <p className="text-body-sm text-text-muted">
          {t.rankings.race.cutoffCaption}
        </p>
      </div>
    </div>
  );
}
