/**
 * Shared parsing helpers for the live-tennis.eu scrapers.
 *
 * The official, live, and race scrapers all read the same table markup but at
 * different column offsets. These helpers centralize the parsing logic that is
 * identical across them, so a change to the source site's format only needs to
 * be fixed in one place.
 */

import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { CheerioAPI } from 'cheerio';
import type { RankChangeDirection } from '../../types/ranking';
import { fetchWithRetry } from './fetch-with-retry';

/**
 * The player-identifying fields shared by all three ranking tables.
 *
 * Every table renders the same block — name, age, nationality, points — but at
 * a different absolute column offset, and the offset shifts within a single
 * table because optional cells (rank change, tournament status) are omitted for
 * some players. Anchoring on `td.pn` and reading the three cells that follow it
 * is stable across all of them; reading fixed indices is not.
 */
export interface PlayerColumns {
  name: string;
  age: number;
  nationality: string;
  points: number;
}

/**
 * Extracts the player block from a ranking row, anchored on `td.pn`.
 *
 * Returns `null` when the row does not carry a usable player block, which is
 * how header, separator, and the Race "qualification threshold" rows are
 * skipped.
 */
export function parsePlayerColumns(
  $: CheerioAPI,
  row: AnyNode,
): PlayerColumns | null {
  const nameCell = $(row).find('td.pn').first();
  if (!nameCell.length) return null;

  // `✓` marks qualified players in the Race table and is not part of the name.
  const name = nameCell.text().replace(/^\s*✓\s*/, '').trim();
  if (!name) return null;

  const following = nameCell.nextAll('td');
  const ageText = following.eq(0).text().trim();
  const nationality = following.eq(1).text().trim();
  const pointsText = following.eq(2).text().replace(/\D/g, '');

  const age = parseFloat(ageText);
  const points = parseInt(pointsText, 10);

  return {
    name,
    age: isNaN(age) ? 0 : age,
    nationality,
    points: isNaN(points) ? 0 : points,
  };
}

/**
 * Reads the career-high ("MR") cell of a live row, anchored on `td.chtd`.
 *
 * The cell holds either the player's best-ever rank as a number, or a marker
 * meaning they are at their career high (`MR`) or have never been ranked
 * (`NMR`, followed by a provisional rank in parentheses). For both markers the
 * player's current rank is the best available answer, so callers pass it as the
 * fallback.
 */
export function parseCareerHigh(
  $: CheerioAPI,
  row: AnyNode,
  currentRank: number,
): number {
  const text = $(row).find('td.chtd').first().text().replace(/ /g, ' ').trim();
  if (!text || text.includes('NMR') || text.startsWith('MR')) return currentRank;

  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : currentRank;
}

/**
 * Reads the rank-change cell (`td.rdf`) of a row. Absent for players whose rank
 * did not move, in which case this reports no movement.
 */
export function parseRowRankChange(
  $: CheerioAPI,
  row: AnyNode,
): { rankChange: number; rankChangeDirection: RankChangeDirection } {
  return parseRankChange($(row).find('td.rdf').first().text().trim());
}

/**
 * Reads the live points-difference cell of a row. The source marks a gain with
 * `td.sgr` (green) and a loss with `td.srd` (red); the sign is also present in
 * the text, so both are matched and the text is the source of truth.
 */
export function parseRowPointsDiff($: CheerioAPI, row: AnyNode): number {
  return parsePointsDiff($(row).find('td.sgr, td.srd').first().text().trim());
}

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
    // `no-store` keeps Next's on-disk fetch cache out of the picture: freshness
    // is owned solely by the SWR layer in services/cache. Previously this used
    // `next: { revalidate: 3600 }`, which both pinned responses on disk for an
    // hour (making the SWR TTL inert) and silently promoted the ranking routes
    // to ISR, so pages could serve hours-old data.
    fetchOptions: { cache: "no-store" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  return { $, html };
}

/**
 * Extracts the "last updated" timestamp.
 *
 * The source page ships an empty `<td id="pagetitle">` and fills it in on the
 * client from an `addDate()` script holding the only real timestamp:
 *
 *   function addDate() { var t = Date.parse("2026-08-08T21:25:21Z") ... }
 *
 * Since we never execute that script, the script value is the primary source.
 * The match is anchored to `addDate` so an unrelated `Date.parse` elsewhere on
 * the page (ads, cookie expiries) cannot be picked up by mistake. `#pagetitle`
 * is checked as a fallback in case the site ever renders it server-side.
 *
 * Returns `null` when no timestamp can be found — callers must not substitute
 * the current time, which would label stale data as fresh.
 */
export function parseLastUpdated($: CheerioAPI, html: string): string | null {
  const addDateMatch = html.match(
    /function\s+addDate\s*\([^)]*\)\s*\{[\s\S]{0,200}?Date\.parse\("([^"]+)"\)/,
  );
  if (addDateMatch?.[1]) return addDateMatch[1];

  const fromElement = $('#pagetitle').text().trim();
  if (fromElement) return fromElement;

  return null;
}

/**
 * Builds a stable, URL-safe player id from a display name.
 *
 * Decomposes accents before stripping non-ASCII so that names keep their
 * letters: a naive `[^a-z0-9]` replace turns "Jiří Lehečka" into "ji-lehe-ka"
 * and risks collisions between names differing only by diacritics.
 */
export function toPlayerId(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parses a rank-change cell (`td.rdf`) into a magnitude and direction.
 *
 * All three tables encode the direction with a leading `+`/`-` in the cell
 * text. An earlier version also accepted `sgr`/`srd` CSS class flags, but those
 * classes belong to the *points-diff* column, not this one — the flags were
 * always false and the arguments were dead. Magnitude is always returned
 * unsigned; the direction carries the sign.
 */
export function parseRankChange(
  text: string,
): { rankChange: number; rankChangeDirection: RankChangeDirection } {
  const magnitude = parseInt(text.replace(/[^\d]/g, ''), 10);
  const value = isNaN(magnitude) ? 0 : magnitude;

  if (text.includes('+')) {
    return { rankChange: value, rankChangeDirection: 'up' };
  }
  if (text.includes('-')) {
    return { rankChange: value, rankChangeDirection: 'down' };
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
 * Parses a row's tournament status into whether the player is still in a draw,
 * plus the cleaned tournament name and stage.
 *
 * Two source quirks are handled here:
 *
 * 1. `td.rst` normally lists every tournament the player featured in this week,
 *    most recent last. For ~8% of rows it is rendered empty and the same data
 *    lives in the `td.hdc` cells instead, in reverse order — so the current
 *    tournament is the *first* `hdc` cell. Without this fallback those players
 *    lose their tournament entirely.
 * 2. Whether the player is still active is taken from the row's `on*` / `of*`
 *    class rather than from the Italian word "Sconfitta". The class is what the
 *    site uses to colour the row and carries the same meaning without depending
 *    on the page language, so switching to the `/en/` URLs cannot silently mark
 *    every player as active.
 */
export function parseTournamentStatus(
  $: CheerioAPI,
  row: AnyNode,
): { isActive: boolean; tournament: string; stage: string } {
  const rowClass = $(row).attr('class') || '';
  const isActive = /\bon\d*\b/.test(rowClass);

  let tournament = readCurrentTournament($, row);
  let stage = '';

  if (tournament) {
    tournament = tournament
      .replace(/^Sconfitta\s+/i, '')
      .replace(/^Qualif\.\s+/i, '')
      .trim();

    const match = tournament.match(
      /(.*?)\s+(R128|R64|R32|R16|QF|SF|F|W|Q1|Q2|Q3|T1|T2|T3|RR)$/i,
    );
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
 * Returns the player's most recent tournament line, reading `td.rst` when it is
 * populated and falling back to the first `td.hdc` cell when it is not.
 */
function readCurrentTournament($: CheerioAPI, row: AnyNode): string {
  const rstHtml = $(row).find('td.rst').first().html() || '';
  const rstLines = splitTournamentLines(rstHtml);
  if (rstLines.length > 0) {
    // Most recent entry is last in `rst`.
    return rstLines[rstLines.length - 1];
  }

  const hdcCells = $(row).find('td.hdc').toArray();
  for (const cell of hdcCells) {
    // Most recent entry is first in the `hdc` sequence.
    const lines = splitTournamentLines($(cell).html() || '');
    if (lines.length > 0) return lines[0];
  }

  return '';
}

/** Splits a tournament cell's inner HTML into cleaned, non-empty text lines. */
function splitTournamentLines(html: string): string[] {
  if (!html) return [];
  return html
    .split(/<br\s*\/?>/i)
    .map((line) => cheerio.load(line).text().replace(/\(.*?\)/g, '').trim())
    .filter((line) => line.length > 0);
}

/**
 * Returns the numeric values of the projection columns trailing a row.
 *
 * These sit after the tournament-status block (`td.rst` / `td.hdc`) and are
 * present only for players still in a draw; otherwise the row ends in a
 * `colspan` spacer, which is skipped. The live and race tables trail with
 * [Pros., Max], the official table with [next week's points].
 */
export function parseTrailingProjections($: CheerioAPI, row: AnyNode): number[] {
  const cells = $(row).find('td').toArray();

  let lastStatusIndex = -1;
  cells.forEach((cell, index) => {
    const className = $(cell).attr('class') || '';
    if (/\b(rst|hdc)\b/.test(className)) lastStatusIndex = index;
  });

  return cells
    .slice(lastStatusIndex + 1)
    .filter((cell) => !$(cell).attr('colspan'))
    .map((cell) => $(cell).text().trim())
    .filter((text) => /^[\d,]+$/.test(text))
    .map((text) => parseInt(text.replace(/\D/g, ''), 10));
}

/**
 * Parses the "Pros." (next-match) and "Max" (win-tournament) point columns of a
 * live or race row. Both are absent unless the player is still in a draw.
 */
export function parseProsAndMax(
  $: CheerioAPI,
  row: AnyNode,
): { nextMatchPoints?: number; maxPoints?: number } {
  const values = parseTrailingProjections($, row);
  if (values.length < 2) return {};
  return { nextMatchPoints: values[0], maxPoints: values[1] };
}
