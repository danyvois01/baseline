# Design Document: Aggiornamento Layout Race to Turin

## Obiettivo
Ottimizzare e ripulire l'interfaccia della pagina "Race to Turin", allineandola alle direttive di design del progetto (minimalismo, utilizzo oculato degli spazi) e alle richieste specifiche dell'utente.

## Modifiche da Apportare

1. **Rimozione Card "Remaining ATP 1000s"**
   - Rimuovere dal componente `RaceSummaryCards` la logica e il markup per il rendering dei tornei rimanenti.
   - Modificare il layout della griglia che contiene le card da `md:grid-cols-3` a `md:grid-cols-2` in modo che le due card rimanenti ("Qualified Players" e "Cut-off Projection") abbiano uno spazio paritario ed elegante.

2. **Allineamento Controlli Tabella "Race Standings"**
   - Attualmente i controlli (Search, Filter, Updated) si dispongono su una nuova riga su schermi di dimensioni standard a causa delle regole responsive (`xl:flex-row`).
   - Sostituire le classi del wrapper in `race-client.tsx` per forzare la disposizione dei controlli sulla stessa linea del titolo "Race Standings" (es. utilizzando `md:flex-row md:items-center flex-wrap`).

## Impatto sui Componenti
- `src/components/rankings/race-summary-cards.tsx`: Rimozione di blocchi JSX e aggiornamento classi Tailwind CSS.
- `src/app/race/race-client.tsx`: Modifiche esclusive al container dell'header della tabella (`div` wrapper).

## UI/UX Guidelines Rispettate
- Nessuna alterazione ai token di colore (Deep Charcoal, Tennis Green).
- Mantenimento delle forme "pill-shaped" e `rounded-xl`.
- Interfaccia ottimizzata per data density.
