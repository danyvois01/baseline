import { RankingData, RankingEntry } from '../../types/ranking';
import { fetchAndLoadHtml, parseLastUpdated, parseRankChange } from './parse-utils';
import { buildScraperUrl } from './config';
import { getCachedRankings } from '../cache/rankings-cache';
import { validateRankingData } from '@/lib/schemas/ranking-schema';

const TARGET_URL = 'https://live-tennis.eu/it/classifica-ufficiale-atp';

/**
 * Fetches official ranking data with SWR caching.
 * Returns cached data when fresh, triggers background revalidation when stale,
 * and performs a full fetch only when no cache exists.
 */
export async function fetchOfficialRankings(): Promise<RankingData> {
  return getCachedRankings('singles', scrapeOfficialRankings);
}

/**
 * Raw scraping logic — called by the cache layer when fresh data is needed.
 * Validates the parsed output against the Zod schema before returning.
 */
async function scrapeOfficialRankings(): Promise<RankingData> {
  const url = buildScraperUrl(TARGET_URL);

  try {
    const { $, html } = await fetchAndLoadHtml(url);
    const lastUpdated = parseLastUpdated($, html);

    const rows = $('td.rk').parent('tr');

    const entries: RankingEntry[] = [];

    rows.each((i, row) => {
      const cols = $(row).find('td');

      const rankText = cols.eq(0).text().trim();
      const rank = parseInt(rankText, 10);
      if (isNaN(rank)) return;

      const name = cols.eq(2).text().trim();
      if (!name) return;

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ageText = cols.eq(3).text().trim();
      const age = isNaN(parseFloat(ageText)) ? 0 : parseFloat(ageText);
      const nationality = cols.eq(4).text().trim();

      const pointsText = cols.eq(5).text().replace(/\D/g, '');
      const points = isNaN(parseInt(pointsText, 10)) ? 0 : parseInt(pointsText, 10);

      const { rankChange, rankChangeDirection } = parseRankChange(cols.eq(6).text().trim());

      const nextWeekPointsText = cols.eq(-2).text().replace(/\D/g, '');
      const nextWeekPoints = nextWeekPointsText ? parseInt(nextWeekPointsText, 10) : undefined;

      entries.push({
        rank,
        previousRank: rankChangeDirection === 'up' ? rank + rankChange : (rankChangeDirection === 'down' ? rank - rankChange : rank),
        rankChange,
        rankChangeDirection,
        points,
        nextWeekPoints: !isNaN(nextWeekPoints as number) ? nextWeekPoints : undefined,
        player: {
          id,
          name,
          nationality,
          age
        }
      });
    });

    const rawData = {
      type: 'singles' as const,
      lastUpdated,
      entries,
    };

    validateRankingData(rawData, 'singles');

    return rawData;

  } catch (error) {
    console.error('[scraper/official] Error fetching rankings:', error);
    throw error;
  }
}
