"use client";

/**
 * PlayerAvatar — Circular avatar displaying player initials.
 * Used in the rankings table player cell.
 */

interface PlayerAvatarProps {
  /** Player initials (e.g. "JS" for Jannik Sinner) */
  initials: string;
  /** Size in pixels (default: 40) */
  size?: number;
}

export function PlayerAvatar({ initials, size = 40 }: PlayerAvatarProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-surface-gray text-foreground shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}
