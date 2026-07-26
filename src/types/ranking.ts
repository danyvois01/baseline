/**
 * TypeScript interfaces for ranking data models.
 * These types will be expanded as new ranking features are implemented.
 */

/**
 * Supported ranking categories. The site currently covers men's singles only.
 *
 * - `singles`: official standings, updated weekly after tournaments.
 * - `live-singles`: real-time projected singles standings, updated daily as
 *   matches are played. A distinct category from the official `singles`.
 * - `race-to-turin`: year-end ATP Finals qualification race.
 */
export type RankingType = "singles" | "live-singles" | "race-to-turin";

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
  /** Next week points (Pros. Set.) */
  nextWeekPoints?: number;
  /** Live status information (only for live rankings) */
  liveStatus?: {
    isActive: boolean;
    tournament: string;
    stage: string;
  };
  /** Points if player wins their next match (Pros. only for live) */
  nextMatchPoints?: number;
  /** Points if player wins the tournament (Max only for live) */
  maxPoints?: number;
  /** Points difference from official ranking (live only) */
  pointsDiff?: number;
  /** Career High ranking (live only) */
  bestRanking?: number;
  /** True if player is qualified for ATP Finals (Race only) */
  isQualified?: boolean;
}

/** Complete ranking data for a given category and date */
export interface RankingData {
  /** Ranking category */
  type: RankingType;
  /** Last update date (ISO 8601 or string) */
  lastUpdated: string;
  /** List of ranking entries */
  entries: RankingEntry[];
  /** Summary data (mainly for Race to Turin) */
  summary?: RaceSummary;
}

/* ============================
   Race to Turin Types
   ============================ */

/** Qualification status for Race to Turin */
export type RaceStatus = "qualified" | "in-contention";

/** Summary data for the Race to Turin overview cards */
export interface RaceSummary {
  /** Number of players already qualified */
  qualifiedCount: number;
  /** Total qualification slots available */
  totalSlots: number;
  /** Names of qualified players */
  qualifiedNames: string[];
  /** Number of remaining ATP 1000 tournaments */
  remainingTournaments: number;
  /** Name and timing of next major tournament */
  nextTournament: string;
  /** Estimated points threshold for qualification */
  cutoffPoints: string;
}
