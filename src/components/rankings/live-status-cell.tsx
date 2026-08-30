"use client";

/**
 * LiveStatusCell — Displays the live tournament status for a player.
 * Active: pulsing lime dot + semibold text + filled lime round badge.
 * Out: solid neutral dot + muted (but fully legible) text + outlined badge.
 * De-emphasis is structural (color/weight), never transparency.
 *
 * The `compact` variant is used by the mobile card lists: players still in the
 * draw keep the full lime treatment, while eliminated players drop to muted
 * text with the round inline. The weight gap is what makes active players stand
 * out on a small screen — no information is removed.
 */

import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";

interface LiveStatusCellProps {
  isActive: boolean;
  tournament: string;
  stage: string;
  compact?: boolean;
}

export function LiveStatusCell({
  isActive,
  tournament,
  stage,
  compact = false,
}: LiveStatusCellProps) {
  const { t } = useTranslation();

  // No tournament: quiet "not playing" label. The cell must stay in the
  // DOM — parent rows are CSS grids with auto-placement, returning null
  // would shift every following column.
  if (!tournament && !stage) {
    return (
      <div className="flex items-center">
        <span
          className={cn(
            "font-medium",
            compact
              ? "text-[11px] text-text-muted"
              : "text-body-sm text-foreground/40"
          )}
        >
          {t.rankings.liveStatus.notPlaying}
        </span>
      </div>
    );
  }

  const label = `${isActive ? t.rankings.liveStatus.active : t.rankings.liveStatus.out} - ${tournament}`;

  // Compact + eliminated: single muted line, round inline, no outlined pill.
  if (compact && !isActive) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0" />
        <span className="text-[11px] font-medium text-text-muted truncate">
          {label}
        </span>
        <span className="text-[11px] font-medium text-text-muted shrink-0">
          · {stage}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Status dot — active uses tennis ball yellow (baseline-lime) with live-pulse, out uses foreground (charcoal/white) */}
      <div
        className={cn(
          "rounded-full shrink-0",
          compact ? "w-2 h-2" : "w-2.5 h-2.5",
          isActive
            ? "bg-baseline-lime live-pulse shadow-[0_0_8px_rgba(223,255,0,0.6)]"
            : "bg-foreground"
        )}
      />

      {/* Status text — always full-contrast; active/out is signalled by dot, weight and badge */}
      <span
        className={cn(
          "text-foreground",
          compact ? "text-[12px] truncate" : "text-body-sm whitespace-nowrap",
          isActive ? "font-semibold" : "font-medium"
        )}
      >
        {label}
      </span>

      {/* Round badge — active is filled lime, out is outlined (no fill) */}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full tracking-wide uppercase shrink-0",
          compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
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
