/**
 * Maps a scraped domain player into the display shape used by the UI.
 *
 * Centralizes the derivation of display-only fields (flag-icon country code
 * and avatar initials) so every rankings route produces identical player
 * objects.
 */

import type { PlayerDisplay } from "@/types";
import { toCountryCode } from "@/lib/countries";

/** The subset of scraped player data needed to build a {@link PlayerDisplay}. */
type ScrapedPlayer = {
  id: string;
  name: string;
  nationality: string;
  age: number;
};

/** Derives up-to-two-letter initials from a player's full name (e.g. "JS"). */
export function toInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

/** Converts a scraped player into the UI display shape. */
export function toPlayerDisplay(player: ScrapedPlayer): PlayerDisplay {
  return {
    id: player.id,
    name: player.name,
    nationality: player.nationality,
    countryCode: toCountryCode(player.nationality),
    age: player.age,
    initials: toInitials(player.name),
  };
}
