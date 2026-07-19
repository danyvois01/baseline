# Tennis Scoring Storytelling Redesign

## Panoramica
L'obiettivo è reintegrare i contenuti educativi sul punteggio del tennis (Game, Set, Deuce, Tie-Break) presenti nel progetto originale, fondendoli con l'interattività e l'estetica moderna della nuova `ScoringSection` (il "Tabellone Segnapunti").

La nuova implementazione sarà strutturata come un'esperienza di **"scrollytelling"** (storytelling basato sullo scroll), per offrire un'esperienza fluida, coinvolgente e visivamente premium, in linea con i requisiti del progetto ATP Baseline.

## Struttura dell'Esperienza

La sezione `scoring-section.tsx` verrà trasformata. Invece di una semplice vista statica, adotteremo un layout diviso (su desktop) con un comportamento *sticky*:

1.  **Colonna di Sinistra (Testuale & Scrolling):** 
    Conterrà i blocchi di testo esplicativi che l'utente scorrerà verticalmente. Ogni blocco rappresenterà un "capitolo" della spiegazione:
    *   **Il Game & Le Origini:** Introduzione al sistema 15, 30, 40 e la curiosità dell'orologio.
    *   **Deuce e Vantaggi:** Spiegazione del 40-40 e della regola dei vantaggi.
    *   **Il Set:** Come si vince un set (6 game, scarto di 2, 5-5).
    *   **Il Tie-Break:** La regola speciale sul 6-6.

2.  **Colonna di Destra (Visuale & Sticky):**
    Un'area fissa sullo schermo che cambierà dinamicamente contenuto in base al "capitolo" attualmente visibile nella colonna di sinistra.
    *   *Per "Il Game":* Verrà mostrato il **Tabellone Segnapunti Interattivo** attuale, permettendo all'utente di cliccare e capire il punteggio.
    *   *Per "Deuce":* Il tabellone visualizzerà una situazione di parità, evidenziando il concetto di "AD" (Advantage).
    *   *Per "Il Set":* Un'animazione grafica che mostra la progressione dei game in un set (es. una linea del tempo o dei pallini che si riempiono fino al 6).
    *   *Per "Il Tie-Break":* Un focus visivo sui numeri interi (1, 2, 3... 7), contrastando con il sistema 15-30-40.

## Dettagli Tecnici

*   **Framer Motion:** Utilizzo di `useScroll` e `useInView` per tracciare quale blocco di testo è attualmente al centro dello schermo. La colonna di destra userà `AnimatePresence` per transizionare morbidamente tra le diverse visualizzazioni (Tabellone interattivo -> Grafica Set -> Grafica Tie-break).
*   **Tailwind CSS:** Layout responsive (su mobile i contenuti visuali e testuali si alterneranno verticalmente, perdendo l'effetto sticky che richiede schermi più ampi). Utilizzo dei colori di progetto (Deep Navy, Baseline Lime, bianco) per garantire alto contrasto in dark mode.
*   **Componenti Shadcn/UI & Lucide:** Verranno riutilizzate icone (es. `Clock`, `Info`) e stili coerenti.

## File Modificati
*   `src/components/homepage/scoring-section.tsx` (Riscritto per includere logica di scrollytelling e animazioni).

## Aspetto Grafico
*   **Colori:** Sfondo scuro (`bg-deep-navy`), accenti in `baseline-lime` (`#DFFF00`).
*   **Tipografia:** Font grandi per i numeri e titoli ad alto impatto.
*   **Animazioni:** Transizioni fluide `ease-in-out` sui cambi di stato visivo, micro-animazioni sui bottoni del tabellone.
