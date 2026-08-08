"use client";

/**
 * LiveStatusCell — Displays the live tournament status for a player.
 * Active: pulsing lime dot + semibold text + filled lime round badge.
 * Out: solid neutral dot + muted (but fully legible) text + outlined badge.
 * De-emphasis is structural (color/weight), never transparency.
 */

import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";

interface LiveStatusCellProps {
  isActive: boolean;
  tournament: string;
  stage: string;
}

export function LiveStatusCell({
  isActive,
  tournament,
  stage,
}: LiveStatusCellProps) {
  const { t } = useTranslation();

  // No tournament: quiet "not playing" label. The cell must stay in the
  // DOM — parent rows are CSS grids with auto-placement, returning null
  // would shift every following column.
  if (!tournament && !stage) {
    return (
      <div className="flex items-center">
        <span className="text-body-sm text-foreground/40 font-medium">
          {t.rankings.liveStatus.notPlaying}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Status dot — active uses tennis ball yellow (baseline-lime) with live-pulse, out uses foreground (charcoal/white) */}
      <div
        className={cn(
          "w-2.5 h-2.5 rounded-full shrink-0",
          isActive
            ? "bg-baseline-lime live-pulse shadow-[0_0_8px_rgba(223,255,0,0.6)]"
            : "bg-foreground"
        )}
      />

      {/* Status text — always full-contrast; active/out is signalled by dot, weight and badge */}
      <span
        className={cn(
          "text-body-sm whitespace-nowrap text-foreground",
          isActive ? "font-semibold" : "font-medium"
        )}
      >
        {isActive ? t.rankings.liveStatus.active : t.rankings.liveStatus.out} -{" "}
        {tournament}
      </span>

      {/* Round badge — active is filled lime, out is outlined (no fill) */}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase shrink-0",
          isActive
            ? "bg-baseline-lime text-deep-navy font-bold"
            : "border border-foreground/20 text-foreground font-semibold"
        )}
      >
        {stage}
      </span>
    </div>
  );
}
