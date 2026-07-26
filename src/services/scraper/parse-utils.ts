/**
 * Shared parsing helpers for the live-tennis.eu scrapers.
 *
 * The official, live, and race scrapers all read the same table markup but at
 * different column offsets. These helpers centralize the parsing logic that is
 * identical across them, so a change to the source site's format only needs to
 * be fixed in one place.
 */

import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type { RankChangeDirection } from '../../types/ranking';
import { fetchWithRetry } from './fetch-with-retry';

/**
 * Fetches a page through ScraperAPI (with retry + timeout) and loads it
 * into cheerio for DOM traversal.
 */
export async function fetchAndLoadHtml(
  url: string,
): Promise<{ $: CheerioAPI; html: string }> {
  const response = await fetchWithRetry(url, {
    maxAttempts: 3,
    timeoutMs: 30_000,
    fetchOptions: { next: { revalidate: 3600 } },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  return { $, html };
}

/**
 * Extracts the "last updated" timestamp, preferring the `#u1` element and
 * falling back to an inline `Date.parse("…")` script value, then to now.
 */
export function parseLastUpdated($: CheerioAPI, html: string): string {
  const fromElement = $('#u1').text().trim();
  if (fromElement) return fromElement;

  const scriptMatch = html.match(/Date\.parse\("([^"]+)"\)/);
  if (scriptMatch && scriptMatch[1]) return scriptMatch[1];

  return new Date().toISOString();
}

/**
 * Parses a rank-change cell into a signed magnitude and direction.
 *
 * The official table encodes direction with a leading `+`/`-` in the text,
 * while the live and race tables also use `sgr` (up) / `srd` (down) CSS
 * classes. Callers that have those classes pass them via `upClass`/`downClass`;
 * omitting them (official) reduces this to the text-only check.
 */
export function parseRankChange(
  text: string,
  upClass = false,
  downClass = false,
): { rankChange: number; rankChangeDirection: RankChangeDirection } {
  if (text.includes('+') || upClass) {
    return { rankChange: parseInt(text.replace('+', ''), 10), rankChangeDirection: 'up' };
  }
  if (text.includes('-') || downClass) {
    return { rankChange: parseInt(text.replace('-', ''), 10), rankChangeDirection: 'down' };
  }
  return { rankChange: 0, rankChangeDirection: 'none' };
}

/** Parses a points-difference cell (e.g. "+400"), defaulting to 0. */
export function parsePointsDiff(text: string): number {
  if (!text) return 0;
  const value = parseInt(text.replace('+', ''), 10);
  return isNaN(value) ? 0 : value;
}

/**
 * Parses a player's tournament-status cell (`td.rst` inner HTML) into whether
 * they are still active, plus the cleaned tournament name and stage.
 */
export function parseTournamentStatus(rstHtml: string): {
  isActive: boolean;
  tournament: string;
  stage: string;
} {
  let isActive = false;
  let tournament = '';
  let stage = '';

  if (rstHtml) {
    const lines = rstHtml.split(/<br\s*\/?>/i);

    const cleanedLines = lines
      .map((line) => {
        let text = cheerio.load(line).text().trim();
        text = text.replace(/\(.*?\)/g, '').trim();
        return text;
      })
      .filter((t) => t.length > 0);

    if (cleanedLines.length > 0) {
      const lastLine = cleanedLines[cleanedLines.length - 1];
      if (lastLine.toLowerCase().startsWith('sconfitta')) {
        isActive = false;
      } else if (lastLine.match(/\s+W$/i) || (lastLine.match(/\s+V$/i) && !lastLine.toLowerCase().includes('qualif'))) {
        isActive = false;
      } else {
        isActive = true;
      }
      tournament = lastLine;
    }
  }

  if (tournament) {
    tournament = tournament.replace(/^Sconfitta\s+/i, '').trim();
    tournament = tournament.replace(/^Qualif\.\s+/i, '').trim();

    const match = tournament.match(/(.*?)\s+(R128|R64|R32|R16|QF|SF|F|W|Q1|Q2|Q3|T1|T2|T3|RR)$/i);
    if (match) {
      tournament = match[1].trim();
      stage = match[2].trim().toUpperCase();
    } else {
      const parts = tournament.split(' ');
      stage = parts.pop() || '';
      tournament = parts.join(' ');
    }
  }

  return { isActive, tournament, stage };
}

/**
 * Parses the trailing "Pros." (next-match) and "Max" (win-tournament) point
 * columns. When the last cell spans multiple columns (`colspan`), the player
 * is not in a live tournament and both values are undefined.
 */
export function parseProsAndMax(
  lastColText: string,
  secondLastColText: string,
  hasColspan: boolean,
): { nextMatchPoints?: number; maxPoints?: number } {
  if (hasColspan) return {};

  const maxPointsText = lastColText.replace(/\D/g, '');
  const maxPoints = maxPointsText ? parseInt(maxPointsText, 10) : undefined;

  const nextMatchPointsText = secondLastColText.replace(/\D/g, '');
  const nextMatchPoints = nextMatchPointsText ? parseInt(nextMatchPointsText, 10) : undefined;

  return { nextMatchPoints, maxPoints };
}
