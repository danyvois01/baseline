import * as cheerio from 'cheerio';
import { RankingData, RankingEntry, RankChangeDirection } from '../../types/ranking';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY || '7a0b0ba3183412336e456a60c5c55c95';
const TARGET_URL = 'https://live-tennis.eu/it/classifica-ufficiale-atp';

/**
 * Fetches live ranking data (points, positions) from the source website.
 */
export async function fetchOfficialRankings(): Promise<RankingData> {
  const url = `http://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${TARGET_URL}&render=false&t=3`;

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

    // Troviamo tutte le righe dei giocatori usando il parent diretto della cella .rk
    // per evitare di matchare eventuali tag <tr> di layout esterni
    const rows = $('td.rk').parent('tr');
    
    const entries: RankingEntry[] = [];

    rows.each((i, row) => {
      const cols = $(row).find('td');

      const rankText = cols.eq(0).text().trim();
      const rank = parseInt(rankText, 10);
      if (isNaN(rank)) return; // Salta intestazioni

      const name = cols.eq(2).text().trim();
      if (!name) return; // Riga vuota
      
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const ageText = cols.eq(3).text().trim();
      const age = isNaN(parseFloat(ageText)) ? 0 : parseFloat(ageText);
      const nationality = cols.eq(4).text().trim();
      
      const pointsText = cols.eq(5).text().replace(/\D/g, '');
      const points = isNaN(parseInt(pointsText, 10)) ? 0 : parseInt(pointsText, 10);
      
      const rankChangeText = cols.eq(6).text().trim();
      let rankChange = 0;
      let rankChangeDirection: RankChangeDirection = 'none';
      if (rankChangeText.includes('+')) {
        rankChange = parseInt(rankChangeText.replace('+', ''), 10);
        rankChangeDirection = 'up';
      } else if (rankChangeText.includes('-')) {
        rankChange = parseInt(rankChangeText.replace('-', ''), 10);
        rankChangeDirection = 'down';
      }

      // Nello screenshot: "Pros. Set." è la penultima colonna
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

    return {
      type: 'singles',
      lastUpdated: lastUpdated,
      entries
    };

  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
}
