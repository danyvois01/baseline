import { fetchRaceRankings } from './src/services/scraper/race-rankings';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const url = 'https://live-tennis.eu/it/classifica-race-atp';
    const response = await fetch(`http://api.scraperapi.com/?api_key=7a0b0ba3183412336e456a60c5c55c95&url=${url}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('tr').each((i, row) => {
      if ($(row).text().includes("Jaime Faria")) {
        console.log("HTML:", $(row).html());
      }
    });
    
  } catch (err) {
    console.error(err);
  }
}

run();
