# Design Document: Ottimizzazione e Visualizzazione Mobile (Landing Page)
**Data:** 2026-07-03
**Autore:** Antigravity (AI)

## 1. Obiettivo
Portare l'esperienza mobile della landing page "Baseline" a un livello premium ("figa, fluida, pulita"), risolvendo i gravi bug di layout e sovrapposizione degli elementi visibili attualmente sugli schermi ridotti.

## 2. Analisi del Problema
Attualmente la pagina su mobile risulta "un casino cosmico" con elementi che si sovrappongono. Dalla review del codice, la causa radice è la `ScoringSection` (`src/components/homepage/scoring-section.tsx`), la quale renderizza i visual interattivi (es. il tabellone Deuce/Vantaggio) dentro un div con classi:
`fixed bottom-4 left-0 right-0 z-10`
Poiché è posizionato in modo assoluto rispetto alla finestra (fixed viewport) senza condizioni di rendering legate alla visibilità della sua sezione genitore, questo widget si sovrappone permanentemente sin dal caricamento della pagina, distruggendo la UX (ad esempio sovrapponendosi alla Hero Section).

## 3. Piano di Implementazione

### 3.1. Fix Sovrapposizione Scoring Section
- **File:** `src/components/homepage/scoring-section.tsx`
- **Azione:** Cambiare il comportamento mobile dei visual.
- **Dettagli:** Utilizzeremo un approccio combinato: manterremo un div per il mobile ma lo renderemo visibile in modo condizionale (usando `useInView` per il contenitore della sezione) oppure cambieremo l'approccio strutturale da `fixed` a `sticky`. La soluzione `sticky` all'interno della `ScoringSection` è preferibile perché naturale al browser, ma richiede che i testi di testo "scorrano" sopra l'elemento sticky. In alternativa, lasceremo il comportamento `fixed` ma lo nasconderemo con `opacity-0 pointer-events-none` tramite Framer Motion quando l'utente si trova fuori dalla sezione del punteggio.

### 3.2. Refinements Tipografici e di Spaziatura (Hero, Pyramid, Timeline)
- **File:** `src/components/homepage/hero-section.tsx`, `pyramid-section.tsx`, `timeline-section.tsx`
- **Azione:** Ottimizzazione micro-interazioni e spazi.
- **Dettagli:** 
  - Regolare l'altezza minima (`min-h-screen` vs altezze basate su `dvh`) per evitare tagli di testo nei browser mobile (Safari/Chrome bar).
  - Ottimizzare i padding (`p-6` vs `p-4`) in timeline e pyramid per lasciare respiro ai componenti decorativi laterali (come la linea della timeline).

## 4. Criteri di Accettazione
1. Il widget dello scoring compare SOLO quando l'utente naviga la `ScoringSection`.
2. L'apertura della home page su simulatore mobile è pulita, mostrando unicamente il titolo e l'animazione SVG in background, senza widget flottanti estranei.
3. Lo scorrimento verticale è fluido e nessuna card esce orizzontalmente dal viewport (`overflow-x-hidden`).
