"use client";

/**
 * MovementBadge — Pill-shaped badge showing rank movement.
 * Supports: up (green ▲), down (red ▼), none (—), MR (career high), NMR (new career high).
 */

import { cn } from "@/lib/utils";

interface MovementBadgeProps {
  type: "up" | "down" | "none" | "mr" | "nmr";
  value?: number;
}

export function MovementBadge({ type, value }: MovementBadgeProps) {
  if (type === "mr") {
    return (
      <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-badge-gray-bg text-badge-gray-text">
        MR
      </span>
    );
  }

  if (type === "nmr") {
    return (
      <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-badge-gray-bg text-badge-gray-text">
        NMR
      </span>
    );
  }

  if (type === "none") {
    return (
      <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-surface-container text-on-surface-variant">
        —
      </span>
    );
  }

  const isUp = type === "up";

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
