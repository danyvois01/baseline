# 2026-07-03 - Scraper Classifica ATP

## Implementazione Scraper per live-tennis.eu

Questo documento descrive l'implementazione del sistema di scraping per ottenere i dati reali della classifica ATP dal sito `https://live-tennis.eu/it/classifica-ufficiale-atp`, come richiesto.

### 1. Librerie e API
- **ScraperAPI**: Utilizzeremo ScraperAPI (con API key `7a0b0ba3183412336e456a60c5c55c95`) per ottenere la pagina HTML in modo affidabile, gestendo IP rotazionali.
- **Fetch API**: Utilizzeremo il `fetch` nativo di Node.js (v18+) senza dipendenze aggiuntive.
- **Cheerio**: Verrà installata la libreria `cheerio` (es. `npm install cheerio`), che rappresenta lo standard per il parsing e la manipolazione dell'HTML lato server in Node.js, per estrarre i dati dalle righe della tabella.

### 2. Dati Estratti (Mappatura)
Verranno analizzate le righe della tabella (saltando le intestazioni e i giocatori non necessari). I dettagli "Torneo in Corso" e "Tornei Precedenti" verranno **esclusi**, come richiesto. I dati saranno mappati sull'interfaccia `RankingEntry`:
- **# (Rank)** -> `rank` (number)
- **Giocatore** -> `player.name` (string). Genereremo un `player.id` normalizzato (es. `jannik-sinner`).
- **Età** -> `player.age` (number)
- **Naz.** -> `player.nationality` (string, estraendo la sigla dal testo, es. "ITA")
- **Pti** -> `points` (number)
- **+/-** -> Verrà parsato per ottenere `rankChange` (number) e `rankChangeDirection` ("up" | "down" | "none").
- **Pros. Set.** -> Aggiungeremo una nuova proprietà `nextWeekPoints` (number) all'interfaccia.

### 3. Modifiche al Codice
- **`package.json`**: Aggiunta della dipendenza `cheerio`.
- **`src/types/ranking.ts`**: Aggiornamento dell'interfaccia `RankingEntry` per includere `nextWeekPoints?: number`.
- **`src/services/scraper/rankings.ts`**: 
  - Creazione di una funzione `fetchOfficialRankings()` che esegue la richiesta POST a `api.scraperapi.com`.
  - Passaggio dell'URL `https://live-tennis.eu/it/classifica-ufficiale-atp`.
  - Parsing del documento con Cheerio (`load(html)`).
  - Iterazione dei nodi del DOM (i `tr` del corpo della tabella) e lettura dei `td` corrispondenti.
  - Costruzione dell'array finale di dati.

### 4. Verifica
- Testeremo la funzione chiamandola e verificando in console (o tramite un output temporaneo sulla pagina) che i dati dei Top 10 giocatori combacino con lo screenshot fornito (es. Jannik Sinner primo con 13450 punti, Carlos Alcaraz secondo, ecc.).
