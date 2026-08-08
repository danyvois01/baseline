"use client";

/**
 * PlayerCell — Reusable player info cell for rankings tables.
 * Renders: name (with hover color) + flag icon + nationality code + age.
 * Nationality and age are both static player attributes, so they share the
 * same plain-text weight. Pills in these tables are reserved for live or
 * changing state (movement, point diff, tournament round).
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
      <span className="text-body-md font-semibold text-foreground group-hover:text-primary-olive transition-colors">
        {player.name}
      </span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span
          className={cn("fi rounded-sm", `fi-${player.countryCode}`)}
          style={{ fontSize: "14px" }}
        />
        <span className="text-[10px] text-foreground/60 font-medium uppercase tracking-wider">
          {player.nationality}
        </span>
        <span className="text-[10px] text-foreground/30">·</span>
        <span className="text-[10px] text-foreground/60 font-medium tabular-nums">
          {player.age}
        </span>
      </div>
    </div>
  );
}
