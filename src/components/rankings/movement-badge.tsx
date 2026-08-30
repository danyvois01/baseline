"use client";

/**
 * MovementBadge — Badge showing rank movement.
 * Supports: up (green ▲), down (red ▼), none (—), MR (career high), NMR (new career high).
 *
 * Two variants:
 * - `pill` (default, desktop): filled coloured pill.
 * - `inline` (mobile lists): neutral arrow + value, no background. Colour is
 *   reserved for the points diff and for players still in the draw, so the
 *   direction is carried by the arrow shape alone.
 */

import { cn } from "@/lib/utils";

interface MovementBadgeProps {
  type: "up" | "down" | "none" | "mr" | "nmr";
  value?: number;
  variant?: "pill" | "inline";
  /**
   * Inline variant only: colour the up/down arrow instead of keeping it grey.
   * Used on the Official mobile card, where no other value carries colour.
   */
  colored?: boolean;
}

export function MovementBadge({
  type,
  value,
  variant = "pill",
  colored = false,
}: MovementBadgeProps) {
  const isInline = variant === "inline";

  if (type === "mr" || type === "nmr") {
    const label = type === "mr" ? "MR" : "NMR";

    if (isInline) {
      return (
        <span className="text-[10px] font-bold text-text-muted">{label}</span>
      );
    }

    return (
      <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-badge-gray-bg text-badge-gray-text">
        {label}
      </span>
    );
  }

  if (type === "none") {
    // No movement: bare dash, no pill — absence of data shouldn't draw the eye.
    if (isInline) {
      return <span className="text-[11px] font-medium text-text-muted">—</span>;
    }

    return (
      <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium text-foreground/40">
        —
      </span>
    );
  }

  const isUp = type === "up";

  if (isInline) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums",
          colored
            ? isUp
              ? "text-success-green-text"
              : "text-error-red-text"
            : "text-text-muted"
        )}
      >
        <span className="text-[9px]">{isUp ? "▴" : "▾"}</span>
        {value}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isUp
          ? "bg-success-green-bg text-success-green-text"
          : "bg-error-red-bg text-error-red-text"
      )}
    >
      <span className="text-[10px]">{isUp ? "▲" : "▼"}</span>
      {value}
    </span>
  );
}
