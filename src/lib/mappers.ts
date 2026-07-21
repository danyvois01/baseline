/**
 * Domain-to-view-model mappers.
 *
 * These functions convert scraper domain types into UI view-model types
 * with exhaustive pattern matching — TypeScript will error if a new
 * variant is added to the source type without being handled here.
 */

import type { RankChangeDirection } from "@/types/ranking";
import type { RankMovement } from "@/types/rankings-view";

/**
 * Maps a scraper RankChangeDirection + magnitude into a UI RankMovement.
 * Exhaustive — adding a new RankChangeDirection variant without a case here
 * will produce a compile error.
 */
export function toRankMovement(
  direction: RankChangeDirection,
  value: number,
): RankMovement {
  switch (direction) {
    case "up":
      return { type: "up", value };
    case "down":
      return { type: "down", value };
    case "new":
      return { type: "nmr" };
    case "none":
      return { type: "none" };
  }
}
