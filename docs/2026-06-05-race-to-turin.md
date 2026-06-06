# Race to Turin — Design Document

**Data**: 2026-06-05  
**Stato**: In attesa di approvazione

---

## 1. Panoramica

Implementazione della pagina **Race to Turin**, la terza vista principale dell'app Baseline. La pagina mostra il progresso dei giocatori verso le ATP Finals di Torino, con card informative di riepilogo e una tabella classifiche con indicatori di qualificazione.

### Riferimenti visivi
- **Mockup screenshot**: `stitch/classifica_atp_live_nuova_gerarchia/race.png`
- **Design System**: `stitch/baseline_design_system/DESIGN.md`
- **Project Brief**: `docs/project-brief.md` (sezione C — Race to Turin)

---

## 2. Struttura della pagina (dal mockup)

### 2.1 Header della pagina
- **Titolo**: "Race to Turin" — `text-headline-lg` (Montserrat 32px/700)
- **Sottotitolo**: Breve descrizione — `text-body-lg` (Inter 18px/400), colore `text-muted`

### 2.2 Summary Cards (3 card in griglia orizzontale)
Tre card `rounded-xl` con border `border-subtle` disposte in una grid `grid-cols-3`:

| Card | Icona | Titolo | Valore | Sottotitolo |
|------|-------|--------|--------|-------------|
| **Qualified Players** | Trophy 🏆 | "Qualified Players" (primary-olive) | "4 / 8" (headline-lg bold) | Nomi qualificati (body-sm, muted) |
| **Remaining ATP 1000s** | Calendar 📅 | "Remaining ATP 1000s" (text-muted) | "1" (headline-lg bold) | Nome torneo + timing (body-sm, muted) |
| **Cut-off Projection** | TrendingUp 📈 | "Cut-off Projection" (text-muted) | "~3500 pts" (headline-lg bold) | "Estimated points required to qualify" (body-sm, muted) |

### 2.3 Rankings Table
Tabella classifica con le seguenti colonne (dal mockup):

| Colonna | Width | Contenuto |
|---------|-------|-----------|
| **#** | 60px | Rank position (headline-md, bold) |
| **+/-** | 70px | Movement badge (riuso `MovementBadge` esistente) |
| **PLAYER** | 1fr | Flag + Nome (stesso stile della live) |
| **POINTS** | 130px | Race points (headline-md, bold, right-aligned) |
| **TOURNAMENTS** | 140px | Numero tornei giocati (centered) |
| **STATUS** | 160px | Badge "Qualified" (verde pill) o testo "In Contention" (muted) |

### 2.4 Turin Qualification Cut line
Una riga separatrice visuale tra i giocatori qualificati (posizioni 1-8) e quelli "In Contention", con testo centrato "TURIN QUALIFICATION CUT" in stile `label-md uppercase tracking-wider`.

### 2.5 Load More Button
Bottone "Load Full Race" — `rounded-full`, bordo `border-subtle`, stile secondario (come nella live).

---

## 3. Componenti da creare

### 3.1 Nuovi file

#### `src/app/race/page.tsx` [NEW]
- Server Component per la route `/race`
- Importa `TopNavBar`, `Footer`, `RaceSummaryCards`, `RaceTable`
- Layout identico a `page.tsx` (live): `bg-surface-gray`, container 1280px, padding 24px
- SEO: title "Race to Turin — Baseline" e meta description

#### `src/components/rankings/race-summary-cards.tsx` [NEW]
- Client component con le 3 card informative
- Usa icone Lucide: `Trophy`, `Calendar`, `TrendingUp`
- Props: `qualifiedCount`, `totalSlots`, `qualifiedNames`, `remainingTournaments`, `nextTournament`, `cutoffPoints`
- Styling: `rounded-xl border border-border-subtle bg-white p-6`, spacing interno coerente

#### `src/components/rankings/race-table.tsx` [NEW]
- Client component con la tabella classifiche race
- Grid columns: `grid-cols-[60px_70px_1fr_130px_140px_160px]`
- Riuso di `MovementBadge` per la colonna +/-
- Riuso del pattern player cell (flag + nome) dalla `rankings-table.tsx`
- "TURIN QUALIFICATION CUT" separator dopo posizione 8
- "Load Full Race" button con logica `visibleCount` incrementale
- Nessuna riga espandibile (a differenza della live)
- Colonna STATUS:
  - "✅ Qualified" → pill verde (`bg-success-green-bg text-success-green-text`)
  - "In Contention" → testo semplice (`text-muted`)

#### `src/lib/mock-data-race.ts` [NEW]
- Mock data con interfaccia `RaceEntry` e array `MOCK_RACE_DATA`
- Include anche i dati per le summary cards (`MOCK_RACE_SUMMARY`)
- Dati realistici basati sul mockup: Sinner, Alcaraz, Zverev, Medvedev qualificati; Fritz, Djokovic e altri in contention

### 3.2 File da modificare

#### `src/types/ranking.ts` [MODIFY]
- Aggiungere interfaccia `RaceEntry` con campi: `rank`, `player` (stessa struttura), `racePoints`, `tournamentsPlayed`, `movement`, `status: "qualified" | "in-contention"`
- Aggiungere interfaccia `RaceSummary` per le card

#### `src/components/rankings/index.ts` [MODIFY]
- Esportare `RaceSummaryCards` e `RaceTable`

#### `src/components/layout/top-nav-bar.tsx` [MODIFY]
- Rendere la navigazione dinamica con `usePathname()` di Next.js per evidenziare il tab attivo corretto (attualmente hardcoded `active: true` su "Live Ranking")

---

## 4. Coerenza con la Live Rankings

Elementi riusati/coerenti:
- **Font**: Montserrat per titoli/numeri rank, Inter per body/labels — identico alla live
- **MovementBadge**: Stesso componente, stesso stile (▲ verde, ▼ rosso, — neutro)
- **Player cell**: Flag-icons + nome + nationality badge — stesso pattern
- **Layout**: Stesso container `max-w-[1280px] px-6 py-10`, stessa `bg-surface-gray`
- **Load More**: Stesso pattern incrementale
- **Colors/tokens**: Tutti i colori dal design system esistente in `globals.css`

Differenze dalla Live:
- **No expanded card** (non serve per la race)
- **No Live Status column** → sostituita da TOURNAMENTS e STATUS
- **No +/- point diff badge** → sostituita da TOURNAMENTS count
- **Summary cards** in cima (nuove, non presenti nella live)
- **Qualification cut separator** (linea orizzontale con testo centrato)

---

## 5. Piano di verifica

### Verifica automatica
- `npm run build` — build senza errori
- Navigazione su `http://localhost:3000/race` — pagina renderizzata correttamente

### Verifica visiva (browser)
- Confronto con screenshot mockup per layout, spaziatura, tipografia
- Verifica coerenza font/colori con la pagina live
- Test responsive: card summary impilate su mobile, tabella con scroll orizzontale
- Verifica che la nav bar evidenzi "Race to Turin" quando si è su `/race`
- Verifica dark mode basic (colori background e testo che si invertono)

---

## 6. Domande aperte

> [!IMPORTANT]
> **Navigazione attiva**: Attualmente il `TopNavBar` ha l'active state hardcoded su "Live Ranking". Va bene se lo rendo dinamico con `usePathname()` in modo che evidenzi automaticamente "Race to Turin" quando sei su `/race`?

> [!NOTE]
> **Dati mock**: Per ora userò dati mock realistici basati sul mockup. I dati dal vero scraper verranno integrati successivamente quando svilupperemo il servizio di scraping per la race.

