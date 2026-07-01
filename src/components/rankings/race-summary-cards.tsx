"use client";

/**
 * RaceSummaryCards — Three overview cards for the Race to Turin page.
 * Displays: Qualified Players count, Remaining Tournaments, Cut-off Projection.
 * Pill-shaped aesthetic with subtle borders, consistent with design system.
 */

import type { RaceSummary } from "@/types/ranking";
import { Trophy, Calendar, TrendingUp } from "lucide-react";

interface RaceSummaryCardsProps {
  summary: RaceSummary;
}

export function RaceSummaryCards({ summary }: RaceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      {/* Qualified Players */}
      <div className="rounded-xl border border-border-subtle bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-primary-olive" />
          <span className="text-label-md text-primary-olive">
            Qualified Players
          </span>
        </div>
        <p className="text-headline-md text-deep-navy mb-1">
          {summary.qualifiedCount}{" "}
          <span className="text-text-muted font-normal">
            / {summary.totalSlots}
          </span>
        </p>
        <p className="text-body-sm text-text-muted">
          {summary.qualifiedNames.join(", ")}
        </p>
      </div>

      {/* Remaining ATP 1000s */}
      <div className="rounded-xl border border-border-subtle bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-text-muted" />
          <span className="text-label-md text-text-muted">
            Remaining ATP 1000s
          </span>
        </div>
        <p className="text-headline-md text-deep-navy mb-1">
          {summary.remainingTournaments}
        </p>
        <p className="text-body-sm text-text-muted">
          {summary.nextTournament}
        </p>
      </div>

      {/* Cut-off Projection */}
      <div className="rounded-xl border border-border-subtle bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-text-muted" />
          <span className="text-label-md text-text-muted">
            Cut-off Projection
          </span>
        </div>
        <p className="text-headline-md text-deep-navy mb-1">
          {summary.cutoffPoints}
        </p>
        <p className="text-body-sm text-text-muted">
          Estimated points required to qualify
        </p>
      </div>
    </div>
  );
}

