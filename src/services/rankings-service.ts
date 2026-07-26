/**
 * rankings-service — Unified data-access layer for all ranking types.
 *
 * This is the single entry point that route pages call to retrieve ranking
 * data. It encapsulates the entire pipeline:
 *   scraper (with retry) → cache (SWR) → validation (Zod) → view-model mapping
 *
 * Route pages no longer need to know about scrapers, caching, or the
 * domain-to-view-model transformation — they call one function and receive
 * ready-to-render data.
 */

import { fetchOfficialRankings } from "./scraper/rankings";
import { fetchLiveRankings } from "./scraper/live-rankings";
import { fetchRaceRankings } from "./scraper/race-rankings";
import { toPlayerDisplay } from "@/lib/player-display";
import { toRankMovement } from "@/lib/mappers";
import { MOCK_LIVE_RANKINGS } from "@/lib/mock-data";
import { MOCK_OFFICIAL_RANKINGS } from "@/lib/mock-data-official";
import { MOCK_RACE_RANKINGS, MOCK_RACE_SUMMARY } from "@/lib/mock-data-race";
import type {
  LiveRankingEntry,
  OfficialRankingEntry,
  RaceRankingEntry,
  RaceSummary,
} from "@/types";

/** Whether to use bundled mock data instead of the live scraper. */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

/** Formats a date string into a localized display string. */
function formatLastUpdated(raw: string): string {
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw;
  return date.toLocaleString("en-US", {
    timeZone: "Europe/Rome",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ====================================================================
   LIVE RANKINGS
   ==================================================================== */

export interface LiveRankingsResult {
  rankings: LiveRankingEntry[];
  lastUpdated: string;
}

export async function getLiveRankings(): Promise<LiveRankingsResult> {
  if (USE_MOCK) {
    return { rankings: MOCK_LIVE_RANKINGS, lastUpdated: "Mock Data" };
  }

  try {
    const data = await fetchLiveRankings();

    const rankings: LiveRankingEntry[] = data.entries.map((entry) => ({
      rank: entry.rank,
      points: entry.points,
      player: toPlayerDisplay(entry.player),
      liveStatus: {
        isActive: entry.liveStatus?.isActive || false,
        tournament: entry.liveStatus?.tournament || "",
        stage: entry.liveStatus?.stage || "",
      },
      movement: toRankMovement(entry.rankChangeDirection, entry.rankChange || 0),
      officialPoints: entry.points - (entry.pointsDiff || 0),
      pointsDiff: entry.pointsDiff || 0,
      nextMatchPoints: entry.nextMatchPoints || entry.points,
      maxPoints: entry.maxPoints || entry.points,
      bestRanking: entry.bestRanking || entry.rank,
    }));

    return {
      rankings,
      lastUpdated: formatLastUpdated(data.lastUpdated),
    };
  } catch (error) {
    console.error("[rankings-service/live] Failed:", error);
    return { rankings: [], lastUpdated: "Unavailable" };
  }
}

/* ====================================================================
   OFFICIAL RANKINGS
   ==================================================================== */

export interface OfficialRankingsResult {
  rankings: OfficialRankingEntry[];
  lastUpdated: string;
}

export async function getOfficialRankings(): Promise<OfficialRankingsResult> {
  if (USE_MOCK) {
    return { rankings: MOCK_OFFICIAL_RANKINGS, lastUpdated: "Mock Data" };
  }

  try {
    const data = await fetchOfficialRankings();

    const projectedRankings = [...data.entries].sort(
      (a, b) => (b.nextWeekPoints || b.points) - (a.nextWeekPoints || a.points),
    );
    const projectedRankMap = new Map<number, number>();
    projectedRankings.forEach((entry, index) => {
      projectedRankMap.set(entry.rank, index + 1);
    });

    const rankings: OfficialRankingEntry[] = data.entries.map((entry) => ({
      rank: entry.rank,
      movement: toRankMovement(entry.rankChangeDirection, entry.rankChange || 0),
      player: toPlayerDisplay(entry.player),
      points: entry.points,
      nextWeek: {
        points: entry.nextWeekPoints || entry.points,
        rankChange:
          entry.rank - (projectedRankMap.get(entry.rank) || entry.rank),
      },
    }));

    return {
      rankings,
      lastUpdated: formatLastUpdated(data.lastUpdated),
    };
  } catch (error) {
    console.error("[rankings-service/official] Failed:", error);
    return { rankings: MOCK_OFFICIAL_RANKINGS, lastUpdated: "Mock Data" };
  }
}

/* ====================================================================
   RACE TO TURIN
   ==================================================================== */

export interface RaceRankingsResult {
  rankings: RaceRankingEntry[];
  summary: RaceSummary;
  lastUpdated: string;
}

export async function getRaceRankings(): Promise<RaceRankingsResult> {
  if (USE_MOCK) {
    return {
      rankings: MOCK_RACE_RANKINGS,
      summary: MOCK_RACE_SUMMARY,
      lastUpdated: "Mock Data",
    };
  }

  try {
    const data = await fetchRaceRankings();

    const rankings: RaceRankingEntry[] = data.entries.map((entry) => ({
      rank: entry.rank,
      points: entry.points,
      player: toPlayerDisplay(entry.player),
      liveStatus: {
        isActive: entry.liveStatus?.isActive ?? false,
        tournament: entry.liveStatus?.tournament ?? "",
        stage: entry.liveStatus?.stage ?? "",
      },
      movement: toRankMovement(entry.rankChangeDirection, entry.rankChange ?? 0),
      officialPoints: entry.points - (entry.pointsDiff ?? 0),
      pointsDiff: entry.pointsDiff ?? 0,
      nextMatchPoints: entry.nextMatchPoints ?? entry.points,
      maxPoints: entry.maxPoints ?? entry.points,
      bestRanking: entry.bestRanking ?? entry.rank,
      raceStatus: entry.isQualified ? "qualified" : "in-contention",
    }));

    const summary: RaceSummary = data.summary ?? MOCK_RACE_SUMMARY;

    return {
      rankings,
      summary,
      lastUpdated: formatLastUpdated(data.lastUpdated),
    };
  } catch (error) {
    console.error("[rankings-service/race] Failed:", error);
    return {
      rankings: MOCK_RACE_RANKINGS,
      summary: MOCK_RACE_SUMMARY,
      lastUpdated: "Mock Data",
    };
  }
}
