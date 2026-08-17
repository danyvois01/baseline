import { RankingData, RankingEntry } from '../../types/ranking';
import {
  fetchAndLoadHtml,
  parseLastUpdated,
  parsePlayerColumns,
  parseRowRankChange,
  parseRowPointsDiff,
  parseTournamentStatus,
  parseProsAndMax,
  toPlayerId,
} from './parse-utils';
import { buildScraperUrl } from './config';
import { getCachedRankings } from '../cache/rankings-cache';
import { validateRankingData } from '@/lib/schemas/ranking-schema';

const TARGET_URL = 'https://live-tennis.eu/it/classifica-race-atp';

/**
 * Fetches Race ATP ranking data with SWR caching.
 * Returns cached data when fresh, triggers background revalidation when stale,
 * and performs a full fetch only when no cache exists.
 */
export async function fetchRaceRankings(): Promise<RankingData> {
  return getCachedRankings('race-to-turin', scrapeRaceRankings);
}

/**
 * Raw scraping logic — called by the cache layer when fresh data is needed.
 * Validates the parsed output against the Zod schema before returning.
 */
async function scrapeRaceRankings(): Promise<RankingData> {
  const url = buildScraperUrl(TARGET_URL);

  try {
    const { $, html } = await fetchAndLoadHtml(url);
    const lastUpdated = parseLastUpdated($, html);

    // The qualification cut-off drives `isQualified` for every player, so a
    // hardcoded default would silently mislabel the whole table once it drifts.
    // Better to fail and keep serving the last good data from the cache.
    let cutoffPoints: number | undefined;
    const thresholdRow = $('td').filter((i, el) => $(el).text().includes("Punti per la qualif")).last().parent('tr');
    if (thresholdRow.length) {
      const tds = thresholdRow.find('td');
      tds.each((i, td) => {
        const text = $(td).text().trim();
        if (/^\d{3,5}$/.test(text)) {
          cutoffPoints = parseInt(text, 10);
          return false;
        }
      });
    }
    if (cutoffPoints === undefined) {
      throw new Error(
        'Could not read the ATP Finals qualification cut-off from the page.',
      );
    }
    // Bound to a const so the narrowing survives inside the row callback.
    const cutoff = cutoffPoints;

    const rows = $('td.rk').parent('tr');

    const entries: RankingEntry[] = [];
    const qualifiedNames: string[] = [];

    rows.each((i, row) => {
      const rank = parseInt($(row).find('td.rk').first().text().trim(), 10);
      if (isNaN(rank)) return;

      const player = parsePlayerColumns($, row);
      if (!player) return;

      const { rankChange, rankChangeDirection } = parseRowRankChange($, row);
      const { isActive, tournament, stage } = parseTournamentStatus($, row);
      const { nextMatchPoints, maxPoints } = parseProsAndMax($, row);

      const isQualified = player.points >= cutoff;
      if (isQualified && rank <= 8) {
        qualifiedNames.push(player.name);
      }

      entries.push({
        rank,
        rankChange,
        rankChangeDirection,
        points: player.points,
        pointsDiff: parseRowPointsDiff($, row),
        bestRanking: rank,
        isQualified,
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

    const rawData: RankingData = {
      type: 'race-to-turin',
      lastUpdated,
      entries,
      summary: {
        qualifiedCount: qualifiedNames.length,
        // Eight singles slots at the ATP Finals is a tour rule, not page data.
        totalSlots: 8,
        qualifiedNames,
        cutoffPoints: cutoff.toString()
        // `remainingTournaments` and `nextTournament` are intentionally absent:
        // the source page does not carry them, and the previous hardcoded
        // values ("Montreal Masters", 4) were served to the UI as if scraped.
      }
    };

    validateRankingData(rawData, 'race-to-turin');

    return rawData;

  } catch (error) {
    console.error('[scraper/race] Error fetching race rankings:', error);
    throw error;
  }
}
