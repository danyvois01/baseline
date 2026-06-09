# Official ATP Rankings Page — Design Document

**Data:** 2026-06-08  
**Stato:** In attesa di approvazione

---

## 1. Panoramica

Implementazione della pagina **Official ATP Rankings** sotto la route `/official`. Questa pagina mostra la classifica settimanale ufficiale ATP verificata, con un layout più snello rispetto alla Live Rankings: **nessun Live Status**, nessun `+/-` punti, ma con una nuova colonna **"Pros. Set."** (Proiezione Settimana prossima).

### Differenze chiave rispetto alle altre pagine

| Aspetto | Live Rankings | Race to Turin | **Official (NEW)** |
|---------|--------------|---------------|-------------------|
| Live Status | ✅ | ✅ | ❌ |
| +/- Points Diff | ✅ | ✅ | ❌ |
| Move badge | ✅ | ✅ | ✅ |
| Pros. Set. (proiezione) | ❌ | ❌ | ✅ |
| Expanded card | ✅ | ❌ | ❌ |
| Live Indicator (hero) | ✅ | ❌ | ❌ |

---

## 2. Colonne della tabella

La griglia avrà **5 colonne dati** (senza chevron expand e senza live status):

| # | Col ID | Header Label | Larghezza | Allineamento | Descrizione |
|---|--------|-------------|-----------|-------------|-------------|
| 1 | `rank` | `#` | `50px` | Centro | Posizione attuale |
| 2 | `move` | `Move` | `80px` | Centro | Badge movimento (▲/▼/—/MR/NMR) — riusa `MovementBadge` |
| 3 | `player` | `Player` | `1fr` | Sinistra | Nome + Flag + Nazionalità · Età — stesso identico markup delle altre pagine |
| 4 | `points` | `Points` | `120px` | Destra | Punti ufficiali correnti |
| 5 | `projection` | `Pros. Set.` | `120px` | Destra | Proiezione punti settimana successiva |

**Grid template:** `grid-cols-[50px_80px_1fr_120px_120px]`

---

## 3. File da creare/modificare

### 3.1 [NEW] `src/lib/mock-data-official.ts`

Dati mock per la classifica ufficiale. Definisce:
- `OfficialRankingEntry` interface con i campi: `rank`, `player` (stesso formato delle altre pagine), `points`, `projectedPoints`, `movement`.
- `MOCK_OFFICIAL_RANKINGS` array con ~20 entries.

### 3.2 [NEW] `src/components/rankings/official-table.tsx`

Componente tabella per la classifica ufficiale. Segue lo stesso pattern di `race-table.tsx`:
- **Nessuna riga espandibile** (come Race).
- **Nessun Live Status** column.
- Colonna **"Pros. Set."** con formattazione punti e badge colorato per indicare variazione rispetto ai punti attuali.
- Stesso hover behavior, stessi font, stessi colori delle altre tabelle.
- `Load More` button con lo stesso stile della Race table (pill button).
- Riuso di `MovementBadge` per la colonna Move.
- Riuso di `flag-icons` + nationality badge per la colonna Player.

### 3.3 [NEW] `src/app/official/page.tsx`

Pagina route `/official`. Struttura:
- `TopNavBar` + `Footer` (come tutte le pagine).
- Hero section **senza** Live Indicator (nessun pallino verde pulsante).
- Titolo: "Official ATP Rankings" (`text-headline-lg`).
- Sottotitolo: "The official weekly ATP Tour singles rankings." (`text-body-lg text-text-muted`).
- Badge "Updated" e bottone "Filter" nella parte destra dell'hero (come nella Live page).
- `OfficialTable` con i dati mock.
- `Metadata` per SEO.

### 3.4 [MODIFY] `src/components/rankings/index.ts`

Aggiungere l'export di `OfficialTable`.

---

## 4. Stile e coerenza visiva

- **Font**: Montserrat per headline/rank, Inter per body/label — stessi delle altre pagine.
- **Colori**: Deep Navy per testo primario, `text-muted` per label, `surface-gray` background.
- **Badge Movement**: Riuso identico di `MovementBadge` (pill green/red/gray).
- **Proiezione punti**: La colonna "Pros. Set." mostrerà il valore numerico formattato. Se diverso dai punti attuali, apparirà un micro-badge colorato accanto (verde se sale, rosso se scende, trattino se uguale), seguendo lo stesso stile dei badge `+/-` usati nelle altre tabelle.
- **Hover**: `bg-surface-hover` con transizione `duration-150`.
- **Player name**: Colore `text-deep-navy` con `group-hover:text-primary-olive` — identico.
- **Borders**: `border-border-subtle/60` tra righe, `border-border-subtle` per header.
- **Responsive**: `overflow-x-auto` per mobile.

---

## 5. Verifica

1. `npm run dev` — navigare su `/official` e verificare rendering.
2. Verificare che il NavBar evidenzia correttamente "Official Ranking" (pill lime attiva).
3. Confronto visivo con Live Rankings e Race to Turin per coerenza stilistica.
4. Testare il "Load More" button.
5. Verificare assenza di errori TypeScript.
