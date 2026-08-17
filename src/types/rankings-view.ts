/**
 * View-model types for the rankings UI.
 *
 * These are the shapes consumed by the ranking tables and cards, produced by
 * mapping the raw scraper domain models (see `./ranking.ts`) in each route.
 * They intentionally carry display-only fields (country code, initials,
 * movement indicators) that the domain models do not.
 */

import type { RaceStatus } from "./ranking";

/** Player information as displayed in the rankings UI. */
export interface PlayerDisplay {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-3 country code for display (e.g. "ITA") */
  nationality: string;
  /** ISO 3166-1 alpha-2 country code for flag-icons (e.g. "it") */
  countryCode: string;
  age: number;
  /** Player initials for avatar fallback */
  initials: string;
}

/** Rank position movement indicator. */
export interface RankMovement {
  /** Type of movement indicator */
  type: "up" | "down" | "none" | "mr" | "nmr";
  /** Movement amount (only for up/down) */
  value?: number;
}

/** A single entry in the Official ATP Rankings table. */
export interface OfficialRankingEntry {
  /** Current official rank position */
  rank: number;
  /** Player information */
  player: PlayerDisplay;
  /** Current official ranking points */
  points: number;
  /** Rank position movement compared to previous week */
  movement: RankMovement;
  /** Next week projection data */
  nextWeek: {
    /** Projected points for next week */
    points: number;
    /** Projected rank position change (positive = climbing, negative = dropping) */
    rankChange: number;
  };
}

/** A single entry in the Live ATP Rankings table. */
export interface LiveRankingEntry {
  /** Current live rank position */
  rank: number;
  /** Player information */
  player: PlayerDisplay;
  /** Current live points */
  points: number;
  /** Live status information */
  liveStatus: {
    /** Whether player is currently active in a tournament */
    isActive: boolean;
    /** Current tournament name */
    tournament: string;
    /** Current round/stage (e.g. "SF", "R32", "F", "QF") */
    stage: string;
  };
  /** Rank position movement */
  movement: RankMovement;
  /** Current official ranking points (before live adjustments) */
  officialPoints: number;
  /** Difference: livePoints - officialPoints */
  pointsDiff: number;
  /**
   * Points if the player wins their next match.
   *
   * Optional: the source only publishes projections for part of the field, so
   * plenty of active players legitimately have none. Absent means "unknown" and
   * must render as such — defaulting to the current points would present an
   * invented projection as real data.
   */
  nextMatchPoints?: number;
  /** Points if the player wins the tournament. Optional for the same reason. */
  maxPoints?: number;
  /** Player's career-best rank position */
  bestRanking: number;
}

/** A single entry in the Race to Turin table. */
export interface RaceRankingEntry extends LiveRankingEntry {
  /** Qualification status for Turin Finals */
  raceStatus: RaceStatus;
}
