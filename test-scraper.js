const cheerio = require('cheerio');
const fs = require('fs');

async function test() {
  const url = `http://api.scraperapi.com/?api_key=7a0b0ba3183412336e456a60c5c55c95&url=https://live-tennis.eu/it/classifica-race-atp&render=false&t=1`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  let cutoffPoints = 6695;
  const thresholdRow = $('td').filter((i, el) => $(el).text().includes("Punti per la qualif")).last().parent('tr');
  if (thresholdRow.length) {
    thresholdRow.find('td').each((i, td) => {
      const text = $(td).text().trim();
      if (/^\d{3,5}$/.test(text)) {
        cutoffPoints = parseInt(text, 10);
        return false;
      }
    });
  }
  
  console.log("Cutoff points:", cutoffPoints);

  const entries = [];
  const rows = $('td.rk').parent('tr');
  rows.each((i, row) => {
    const cols = $(row).find('td');
    
    // Check if this row is actually a player row or the "Punti per la qualif" row
    const rankText = cols.eq(0).text().trim();
    const rank = parseInt(rankText, 10);
    if (isNaN(rank)) return; 

    let name = cols.eq(2).text().trim();
    if(i < 3) console.log("Row", i, "Name:", name);
    name = name.replace(/^✓\s*/, '').trim();
    if(i < 3) console.log("Cleaned Name:", name);
  });
}

test();
