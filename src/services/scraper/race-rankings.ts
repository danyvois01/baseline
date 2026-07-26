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

    let cutoffPoints = 6695;
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

    const rows = $('td.rk').parent('tr');

    const entries: RankingEntry[] = [];
    const qualifiedNames: string[] = [];

    rows.each((i, row) => {
      const cols = $(row).find('td');

      const rankText = cols.eq(0).text().trim();
      const rank = parseInt(rankText, 10);
      if (isNaN(rank)) return;

      const bestRanking = rank;

      let name = cols.eq(2).text().trim();
      if (!name) return;

      name = name.replace(/^✓\s*/, '').trim();

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ageText = cols.eq(3).text().trim();
      const age = isNaN(parseFloat(ageText)) ? 0 : parseFloat(ageText);
      const nationality = cols.eq(4).text().trim();

      const pointsText = cols.eq(5).text().replace(/\D/g, '');
      const points = isNaN(parseInt(pointsText, 10)) ? 0 : parseInt(pointsText, 10);

      const { rankChange, rankChangeDirection } = parseRankChange(
        cols.eq(6).text().trim(),
        cols.eq(6).hasClass('sgr'),
        cols.eq(6).hasClass('srd'),
      );

      const pointsDiff = parsePointsDiff(cols.eq(7).text().trim());

      const { isActive, tournament, stage } = parseTournamentStatus(
        $(row).find('td.rst').html() || '',
      );

      const lastCol = cols.last();
      const { nextMatchPoints, maxPoints } = parseProsAndMax(
        lastCol.text(),
        cols.eq(-2).text(),
        !!lastCol.attr('colspan'),
      );

      const isQualified = points >= cutoffPoints;
      if (isQualified && rank <= 8) {
        qualifiedNames.push(name);
      }

      entries.push({
        rank,
        rankChange,
        rankChangeDirection,
        points,
        pointsDiff,
        bestRanking,
        isQualified,
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

    const rawData: RankingData = {
      type: 'race-to-turin',
      lastUpdated,
      entries,
      summary: {
        qualifiedCount: qualifiedNames.length,
        totalSlots: 8,
        qualifiedNames,
        remainingTournaments: 4,
        nextTournament: "Montreal Masters",
        cutoffPoints: cutoffPoints.toString()
      }
    };

    validateRankingData(rawData, 'race-to-turin');

    return rawData;

  } catch (error) {
    console.error('[scraper/race] Error fetching race rankings:', error);
    throw error;
  }
}
