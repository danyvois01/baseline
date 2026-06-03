/**
 * TypeScript interfaces for ranking data models.
 * These types will be expanded as new ranking features are implemented.
 */

/** Supported ranking categories */
export type RankingType = "singles" | "doubles" | "race-to-turin";

/** Direction of rank change compared to previous week */
export type RankChangeDirection = "up" | "down" | "none" | "new";

/** A single entry in the rankings table */
export interface RankingEntry {
  /** Current rank position */
  rank: number;
  /** Previous week rank position */
  previousRank?: number;
  /** Rank change compared to previous week */
  rankChange?: number;
  /** Direction of rank change */
  rankChangeDirection: RankChangeDirection;
  /** Player information */
  player: {
    id: string;
    name: string;
    nationality: string;
    age: number;
    imageUrl?: string;
  };
  /** Current ranking points */
  points: number;
  /** Number of tournaments counted */
  tournamentsPlayed?: number;
}

/** Complete ranking data for a given category and date */
export interface RankingData {
  /** Ranking category */
  type: RankingType;
  /** Last update date (ISO 8601) */
  lastUpdated: string;
  /** List of ranking entries */
  entries: RankingEntry[];
}
