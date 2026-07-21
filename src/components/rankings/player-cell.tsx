"use client";

/**
 * PlayerCell — Reusable player info cell for rankings tables.
 * Renders: name (with hover color) + flag icon + nationality badge + age.
 */

import type { PlayerDisplay } from "@/types";
import { cn } from "@/lib/utils";
import "flag-icons/css/flag-icons.min.css";

interface PlayerCellProps {
  player: PlayerDisplay;
}

export function PlayerCell({ player }: PlayerCellProps) {
  return (
    <div className="flex flex-col">
      <span className="text-body-md font-semibold text-deep-navy group-hover:text-primary-olive transition-colors">
        {player.name}
      </span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span
          className={cn("fi rounded-sm", `fi-${player.countryCode}`)}
          style={{ fontSize: "14px" }}
        />
        <span className="inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium px-2 py-0.5 uppercase tracking-wider">
          {player.nationality}
        </span>
        <span className="text-[10px] text-on-surface-variant">·</span>
        <span className="text-[10px] text-on-surface-variant">
          {player.age}
        </span>
      </div>
    </div>
  );
}
