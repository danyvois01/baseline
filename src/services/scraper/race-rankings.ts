import * as cheerio from 'cheerio';
import { RankingData, RankingEntry, RankChangeDirection } from '../../types/ranking';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY || '7a0b0ba3183412336e456a60c5c55c95';
const TARGET_URL = 'https://live-tennis.eu/it/classifica-race-atp';

/**
 * Fetches Race ATP Live ranking data from the source website.
 */
export async function fetchRaceRankings(): Promise<RankingData> {
  const url = `http://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${TARGET_URL}&render=false&t=1`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`ScraperAPI error: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    let lastUpdated = $('#u1').text().trim();
    if (!lastUpdated) {
      const scriptMatch = html.match(/Date\.parse\("([^"]+)"\)/);
      if (scriptMatch && scriptMatch[1]) {
        lastUpdated = scriptMatch[1];
      } else {
        lastUpdated = new Date().toISOString();
      }
    }

    // Find the qualification threshold
    let cutoffPoints = 6695; // default fallback
    const thresholdRow = $('td').filter((i, el) => $(el).text().includes("Punti per la qualif")).last().parent('tr');
    if (thresholdRow.length) {
      const tds = thresholdRow.find('td');
      tds.each((i, td) => {
        const text = $(td).text().trim();
        if (/^\d{3,5}$/.test(text)) {
          cutoffPoints = parseInt(text, 10);
          return false; // break loop
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
      if (isNaN(rank)) return; // Salta intestazioni

      // No Career High column in Race
      let bestRanking = rank; // placeholder

      let name = cols.eq(2).text().trim(); // In Race, name is eq(2)
      if (!name) return; // Riga vuota
      
      name = name.replace(/^✓\s*/, '').trim();
      
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ageText = cols.eq(3).text().trim();
      const age = isNaN(parseFloat(ageText)) ? 0 : parseFloat(ageText);
      const nationality = cols.eq(4).text().trim();
      
      const pointsText = cols.eq(5).text().replace(/\D/g, '');
      const points = isNaN(parseInt(pointsText, 10)) ? 0 : parseInt(pointsText, 10);
      
      // Rank change: Column 6
      const rankChangeText = cols.eq(6).text().trim();
      let rankChange = 0;
      let rankChangeDirection: RankChangeDirection = 'none';

      if (rankChangeText.includes('+') || cols.eq(6).hasClass('sgr')) {
        rankChange = parseInt(rankChangeText.replace('+', ''), 10);
        rankChangeDirection = 'up';
      } else if (rankChangeText.includes('-') || cols.eq(6).hasClass('srd')) {
        rankChange = parseInt(rankChangeText.replace('-', ''), 10);
        rankChangeDirection = 'down';
      }

      // Points diff: Column 7
      const pointsDiffText = cols.eq(7).text().trim();
      let pointsDiff = 0;
      if (pointsDiffText) {
        pointsDiff = parseInt(pointsDiffText.replace('+', ''), 10);
        if (isNaN(pointsDiff)) pointsDiff = 0;
      }

      // Tornei
      let isActive = false;
      let tournamentStr = '';
      let stage = '';

      const rstHtml = $(row).find('td.rst').html() || '';
      if (rstHtml) {
        const lines = rstHtml.split(/<br\s*\/?>/i);
        
        const cleanedLines = lines.map(line => {
           let text = cheerio.load(line).text().trim();
           // Remove parentheses content entirely
           text = text.replace(/\(.*?\)/g, '').trim();
           return text;
        }).filter(t => t.length > 0);

        if (cleanedLines.length > 0) {
           const lastLine = cleanedLines[cleanedLines.length - 1];
           if (lastLine.toLowerCase().startsWith('sconfitta')) {
              isActive = false;
           } else if (lastLine.match(/\s+W$/i) || lastLine.match(/\s+V$/i) && !lastLine.toLowerCase().includes("qualif")) {
              // If he won the whole tournament (W or V) and it's not just Qualif V
              isActive = false;
           } else {
              isActive = true;
           }
           tournamentStr = lastLine;
        }
      }

      // Clean up tournament str e.g. "Sconfitta Wimbledon R128" -> "Wimbledon" "R128"
      if (tournamentStr) {
        // Rimuoviamo "Sconfitta" all'inizio
        tournamentStr = tournamentStr.replace(/^Sconfitta\s+/i, '').trim();
        // Rimuoviamo "Qualif." se presente per pulire il nome
        tournamentStr = tournamentStr.replace(/^Qualif\.\s+/i, '').trim();
        
        // Dividiamo per stage ancorando alla fine della stringa
        const match = tournamentStr.match(/(.*?)\s+(R128|R64|R32|R16|QF|SF|F|W|Q1|Q2|Q3|T1|T2|T3|RR)$/i);
        if (match) {
          tournamentStr = match[1].trim();
          stage = match[2].trim().toUpperCase();
        } else {
          // Fallback se non c'è match esatto
          const parts = tournamentStr.split(' ');
          stage = parts.pop() || '';
          tournamentStr = parts.join(' ');
        }
      }

      // Pros e Max (ultime due colonne se non c'è colspan)
      let nextMatchPoints: number | undefined;
      let maxPoints: number | undefined;

      const lastCol = cols.last();
      if (!lastCol.attr('colspan')) {
        const maxPointsText = lastCol.text().replace(/\D/g, '');
        maxPoints = maxPointsText ? parseInt(maxPointsText, 10) : undefined;
        
        const nextMatchPointsText = cols.eq(-2).text().replace(/\D/g, '');
        nextMatchPoints = nextMatchPointsText ? parseInt(nextMatchPointsText, 10) : undefined;
      }

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
          tournament: tournamentStr,
          stage: stage
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

    return {
      type: 'race-to-turin',
      lastUpdated: lastUpdated,
      entries,
      summary: {
        qualifiedCount: qualifiedNames.length,
        totalSlots: 8,
        qualifiedNames: qualifiedNames,
        remainingTournaments: 4, // Placeholder
        nextTournament: "Montreal Masters", // Placeholder
        cutoffPoints: cutoffPoints.toString()
      }
    };

  } catch (error) {
    console.error('Error fetching live rankings:', error);
    throw error;
  }
}
