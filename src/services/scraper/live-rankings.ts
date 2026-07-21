import { RankingData, RankingEntry } from '../../types/ranking';
import {
  fetchAndLoadHtml,
  parseLastUpdated,
  parseRankChange,
  parsePointsDiff,
  parseTournamentStatus,
  parseProsAndMax,
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
      const cols = $(row).find('td');

      const rankText = cols.eq(0).text().trim();
      const rank = parseInt(rankText, 10);
      if (isNaN(rank)) return;

      const mrText = cols.eq(1).text().trim();
      let bestRanking = rank;
      const mrMatch = mrText.match(/\d+/);
      if (mrText !== 'MR' && !mrText.includes('NMR') && mrMatch) {
         bestRanking = parseInt(mrMatch[0], 10);
      }

      const name = cols.eq(3).text().trim();
      if (!name) return;

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ageText = cols.eq(4).text().trim();
      const age = isNaN(parseFloat(ageText)) ? 0 : parseFloat(ageText);
      const nationality = cols.eq(5).text().trim();

      const pointsText = cols.eq(6).text().replace(/\D/g, '');
      const points = isNaN(parseInt(pointsText, 10)) ? 0 : parseInt(pointsText, 10);

      const { rankChange, rankChangeDirection } = parseRankChange(
        cols.eq(7).text().trim(),
        cols.eq(7).hasClass('sgr'),
        cols.eq(7).hasClass('srd'),
      );

      const pointsDiff = parsePointsDiff(cols.eq(8).text().trim());

      const { isActive, tournament, stage } = parseTournamentStatus(
        $(row).find('td.rst').html() || '',
      );

      const lastCol = cols.last();
      const { nextMatchPoints, maxPoints } = parseProsAndMax(
        lastCol.text(),
        cols.eq(-2).text(),
        !!lastCol.attr('colspan'),
      );

      entries.push({
        rank,
        rankChange,
        rankChangeDirection,
        points,
        pointsDiff,
        bestRanking,
        liveStatus: {
          isActive,
          tournament,
          stage
        },
        nextMatchPoints,
        maxPoints,
        player: {
          id,
          name,
          nationality,
          age
        }
      });
    });

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
