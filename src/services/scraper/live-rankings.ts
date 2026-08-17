import { RankingData, RankingEntry } from '../../types/ranking';
import {
  fetchAndLoadHtml,
  parseLastUpdated,
  parsePlayerColumns,
  parseRowRankChange,
  parseRowPointsDiff,
  parseTournamentStatus,
  parseProsAndMax,
  parseCareerHigh,
  toPlayerId,
} from './parse-utils';
import { buildScraperUrl } from './config';
import { getCachedRankings } from '../cache/rankings-cache';
import { validateRankingData } from '@/lib/schemas/ranking-schema';

const TARGET_URL = 'https://live-tennis.eu/it/classifica-atp-live';

/**
 * Fetches live ranking data with SWR caching.
 * Returns cached data when fresh, triggers background revalidation when stale,
 * and performs a full fetch only when no cache exists.
 */
export async function fetchLiveRankings(): Promise<RankingData> {
  return getCachedRankings('live-singles', scrapeLiveRankings);
}

/**
 * Raw scraping logic — called by the cache layer when fresh data is needed.
 * Validates the parsed output against the Zod schema before returning.
 */
async function scrapeLiveRankings(): Promise<RankingData> {
  const url = buildScraperUrl(TARGET_URL);

  try {
    const { $, html } = await fetchAndLoadHtml(url);
    const lastUpdated = parseLastUpdated($, html);

    const rows = $('td.rk').parent('tr');

    const entries: RankingEntry[] = [];

    rows.each((i, row) => {
      const rank = parseInt($(row).find('td.rk').first().text().trim(), 10);
      if (isNaN(rank)) return;

      const player = parsePlayerColumns($, row);
      if (!player) return;

      const { rankChange, rankChangeDirection } = parseRowRankChange($, row);
      const { isActive, tournament, stage } = parseTournamentStatus($, row);
      const { nextMatchPoints, maxPoints } = parseProsAndMax($, row);

      entries.push({
        rank,
        rankChange,
        rankChangeDirection,
        points: player.points,
        pointsDiff: parseRowPointsDiff($, row),
        bestRanking: parseCareerHigh($, row, rank),
        liveStatus: {
          isActive,
          tournament,
          stage
        },
        nextMatchPoints,
        maxPoints,
        player: {
          id: toPlayerId(player.name),
          name: player.name,
          nationality: player.nationality,
          age: player.age
        }
      });
    });

    if (!lastUpdated) {
      throw new Error(
        'Could not read the source timestamp — the page layout likely changed.',
      );
    }

    const rawData = {
      type: 'live-singles' as const,
      lastUpdated,
      entries,
    };

    validateRankingData(rawData, 'live-singles');

    return rawData;

  } catch (error) {
    console.error('[scraper/live] Error fetching live rankings:', error);
    throw error;
  }
}
