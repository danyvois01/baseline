# Riorganizzazione delle scroll cue della homepage

Data: 2026-08-30
Stato: **approvato e implementato** (opzione 1)

## Diagnosi

`ScrollCue` è un componente unico e coerente (`src/components/homepage/scroll-cue.tsx`),
ma è usato in **8 punti con 3 meccaniche di posizionamento diverse**. È questo, non
il componente, a generare la sensazione di gestione casuale.

| # | Punto | Meccanica | Quando la vedi | Etichetta → target |
|---|---|---|---|---|
| 1 | `hero-section.tsx:245` | `absolute bottom-3 md:bottom-6` in sezione da `100dvh` | tutta la sezione (che è 1 schermo) | "Scopri" → `ranking` |
| 2 | `ranking-section.tsx:185` | `absolute bottom-6` dentro un frame `sticky top-0 h-screen` in una sezione `md:h-[300vh]` | **per 3 schermi interi** | "I Tornei" → `pyramid` |
| 3 | `ranking-section.tsx:225` | in flusso, `pt-2` (solo mobile) | un attimo, alla fine | "I Tornei" → `pyramid` |
| 4 | `pyramid-section.tsx:153` | `absolute bottom-6` nel blocco intro (`md:h-[180vh]` con frame sticky) | tutto l'intro | "Esplora la piramide" → **`pyramid-content`** |
| 5 | `pyramid-section.tsx:275` | **`sticky bottom-6 z-20`** | **per tutto lo scroll delle card**, e su mobile *sopra* il testo | "La Stagione" → `timeline` |
| 6 | `timeline-section.tsx:308` | in flusso, `pt-12 md:pt-16` | un attimo, alla fine | "Il Punteggio" → `scoring` |
| 7 | `scoring-section.tsx:84` | in flusso, `pt-12 md:pt-16` | un attimo, alla fine | "Il Dizionario" → `glossary` |
| 8 | `glossary-section.tsx:234` | in flusso, `mt-6`, **`sm:hidden`** | un attimo, alla fine, **solo mobile** | "Le Classifiche" → `cta` |

Le tre meccaniche:

- **A — ancorata al fondo di un frame a schermo pieno** (1, 2, 4). Nel caso 1 va
  bene: l'hero è alto esattamente uno schermo, quindi "fondo del frame" e "fine
  della sezione" coincidono. Nei casi 2 e 4 no: i frame sono `sticky` su sezioni
  alte 300vh e 180vh, quindi la cue resta inchiodata in basso per l'intera
  sezione e diventa arredamento.
- **B — sticky per tutta la sezione** (5). È il caso peggiore: segue il viewport
  per tutto lo scroll delle card della piramide e su mobile ci passa sopra.
- **C — in flusso a fine sezione** (3, 6, 7, 8). Concettualmente è la giusta, ma
  si vede per un attimo: nasce dal bordo inferiore del viewport e la sezione
  successiva inizia subito dopo, quindi non si ferma mai in una posizione
  comoda da leggere. Aggravata dal fatto che la cue è volutamente discreta
  (`text-[10px]`, opacità 60%).

Incoerenze aggiuntive:

- **La piramide ha due cue** e la prima (#4) è l'unica a fare un salto
  *interno* alla sezione: semantica diversa da tutte le altre ("esplora questa
  sezione" invece di "vai alla prossima").
- **Il dizionario non ha cue da `sm` in su** (`sm:hidden`): su desktop la
  catena di capitoli si interrompe prima del CTA finale.
- La `ranking` ne ha due, ma sono i due layout mutuamente esclusivi
  (desktop/mobile): quella è duplicazione legittima.
- `SectionNavigator` (la dot-nav laterale) è `hidden xl:flex`: la navigazione
  persistente esiste **solo su desktop larghi**. Sotto `xl`, e quindi su tutto
  il mobile, le cue sono l'unico ausilio di navigazione.

## Tre direzioni possibili

### Opzione 1 — "Fine capitolo" (consigliata)

Una regola sola: **la cue compare quando il capitolo sta finendo, e non viaggia
mai col viewport.** Una cue per sezione, nessuna eccezione.

- Meccanica **C** (in flusso a fine sezione) per tutte le sezioni a scorrimento
  normale: piramide, timeline, punteggio, dizionario, ranking-mobile.
- Per le sezioni *pinnate*, dove non esiste un "dopo l'ultimo elemento"
  visibile (ranking desktop, intro piramide), la cue resta ancorata al fondo
  del frame **ma appare in dissolvenza solo nell'ultima parte del pin**, con
  un `useTransform` sullo `scrollYProgress` già calcolato in quelle sezioni
  (es. `[0.85, 0.95] → [0, 1]`). Risultato percepito: identico al caso C.
- Si elimina la meccanica **B**: la `sticky` della piramide (#5) diventa in
  flusso a fine sezione. Questo chiude anche la sovrapposizione sul testo delle
  card che avevamo rinviato.
- Si elimina la cue intra-sezione (#4 → `pyramid-content`) oppure la si
  declassa a elemento diverso (non una `ScrollCue`), perché non è "vai al
  capitolo dopo".
- Si toglie `sm:hidden` dal dizionario: la catena arriva al CTA a ogni
  breakpoint.
- Contro il "vedo per un attimo": wrapper unico e generoso a fine sezione
  (`pt-16 pb-20` uniforme invece di `pt-2` / `pt-12` / `mt-6` a caso), così la
  cue vive in una fascia vuota e calma invece di essere schiacciata fra due
  blocchi.

Risultato: 7 cue, una meccanica, spaziatura identica, catena completa
hero → ranking → piramide → stagione → punteggio → dizionario → CTA.

### Opzione 2 — Cue globale unica

Si cancellano tutte le 8 istanze e si mette **una sola cue `fixed bottom-6`**
in `page.tsx`, che calcola la sezione corrente dallo scroll (la logica esiste
già identica in `SectionNavigator`) e mostra l'etichetta della successiva,
nascondendosi sul CTA.

- Massima coerenza possibile: una istanza, un comportamento, zero
  posizionamenti per sezione.
- Meno codice di tutti: il componente diventa autonomo e le sezioni non sanno
  più nulla delle cue.
- **Contro**: è chrome fluttuante permanente. Su mobile sta sopra il contenuto
  per tutta la pagina — cioè il difetto della cue #5 generalizzato a tutto il
  sito.

### Opzione 3 — Solo hero + navigazione persistente

La cue resta **solo nell'hero** (dove serve davvero: dire "scorri"). Ai confini
di capitolo non si mette nulla, e al suo posto la `SectionNavigator` viene
estesa sotto `xl` — su mobile come barra compatta di puntini, in basso.

- Contenuto pulitissimo, nessun elemento che fluttua sul testo.
- La navigazione diventa una sola cosa, sempre disponibile e sempre nello
  stesso posto, invece di 8 inviti sparsi.
- **Contro**: è l'intervento più grosso (richiede un layout mobile nuovo per la
  navigator) e si perde il naming narrativo ai confini ("La Stagione", "Il
  Punteggio"), che oggi dà il senso di avanzamento nel racconto.

## File coinvolti (in tutte le opzioni)

- `src/components/homepage/scroll-cue.tsx`
- `hero-section.tsx`, `ranking-section.tsx`, `pyramid-section.tsx`,
  `timeline-section.tsx`, `scoring-section.tsx`, `glossary-section.tsx`
- `src/app/page.tsx` e `section-navigator.tsx` (solo opzioni 2 e 3)

Nessuna modifica prevista a i18n (le etichette restano quelle), animazioni di
sezione, o layout dei contenuti.

## Fuori scope

- Restyling grafico della cue (dimensione, colore, icona): qui si sistema
  *dove* e *quando* appare, non com'è fatta. Se serve, dopo.

---

# Implementazione — opzione 1 "Fine capitolo"

## La causa vera del "la vedo per un attimo"

Non è (solo) geometria. `ScrollCue` ha:

```tsx
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ duration: 0.8, delay: 0.3 }}
```

La cue raggiunge l'opacità piena **1,1s dopo** essere entrata nel viewport.
`whileInView` scatta quando il primo pixel entra dal bordo inferiore: a velocità
di scroll normale, nel secondo che serve alla dissolvenza la cue ha già
attraversato lo schermo. È per questo che le cue in flusso (#3, #6, #7, #8) si
percepiscono come un lampo, mentre quelle ancorate a un frame sticky (#2, #4)
hanno tutto il tempo di apparire e restano.

Quindi l'intervento ha due gambe: **tempi** e **geometria**.

## 1. Tempi — `scroll-cue.tsx`

| Prima | Dopo |
|---|---|
| `transition={{ duration: 0.8, delay: 0.3 }}` | `transition={{ duration: 0.4 }}` |

La cue è a pieno regime 0,4s dopo essere entrata in vista. L'unico effetto
collaterale è nell'hero, dove oggi la cue compare con un ritardo di 1,1s dal
caricamento: diventa quasi immediata. È un miglioramento, non una perdita.

## 2. La fascia uniforme — nuovo `SectionEndCue`

Nello stesso file, un wrapper che **possiede la spaziatura del confine di
capitolo**, così non è più decisa sezione per sezione:

```tsx
/**
 * Chapter-end cue: the band that closes a scrolling section.
 * Owns the boundary spacing so every chapter ends the same way, and gives the
 * cue scroll distance to travel while on screen instead of flashing past at
 * the section edge. More room below than above on purpose: the space below is
 * what keeps the cue on screen while the reader keeps scrolling.
 */
export function SectionEndCue(props: ScrollCueProps) {
  return (
    <div className="flex justify-center pt-16 pb-20">
      <ScrollCue {...props} />
    </div>
  );
}
```

64px sopra, 80px sotto, a ogni confine. Lo sbilanciamento verso il basso è la
leva contro il lampo: è lo spazio sotto che dà alla cue la distanza di scroll
per salire nel viewport e farsi leggere.

**Corollario necessario**: il padding inferiore delle sezioni va rimosso, altrimenti
si somma alla fascia e ogni confine torna a essere diverso dall'altro. La
spaziatura di fine sezione diventa proprietà di `SectionEndCue`, in un punto
solo.

| Sezione | Prima | Dopo |
|---|---|---|
| `timeline` | `py-20 md:py-24` | `pt-20 md:pt-24` |
| `scoring` | `py-20 md:py-28` | `pt-20 md:pt-28` |
| `glossary` | `pt-28 pb-16 sm:pt-32 sm:pb-24` | `pt-28 sm:pt-32` |
| `ranking` (lista mobile) | `py-20 px-6 gap-14` | `pt-20 px-6 gap-14` |
| `pyramid` | nessun padding inferiore | invariato (lo fornisce la fascia) |

## 3. Le otto istanze, una per una

| # | Punto | Intervento |
|---|---|---|
| 1 | hero | **invariata.** È l'unica eccezione legittima: la sezione è alta esattamente uno schermo, quindi "fondo del frame" e "fine del capitolo" sono lo stesso posto. Va documentato nel codice, così non sembra una dimenticanza. |
| 2 | ranking desktop | resta `absolute bottom-6` nel frame pinnato (non c'è un "dopo l'ultimo elemento" visibile in 300vh di pin), ma **appare in dissolvenza nell'ultimo tratto** — vedi sotto. |
| 3 | ranking mobile | passa a `SectionEndCue`, spostata **fuori** dalla lista flex: dentro, il `gap-14` si sommerebbe al `pt-16` della fascia. |
| 4 | piramide, intro | **rimossa.** È l'unica cue che salta dentro la propria sezione (`→ pyramid-content`): semantica diversa da tutte le altre, e con una cue a fine sezione il capitolo ha già la sua chiusura. |
| 5 | piramide, contenuto | da `sticky bottom-6 z-20` a `SectionEndCue`. **Chiude anche la sovrapposizione sul testo delle card** che avevamo rinviato. |
| 6 | timeline | wrapper `pt-12 md:pt-16` → `SectionEndCue`. |
| 7 | punteggio | wrapper `pt-12 md:pt-16` → `SectionEndCue`. |
| 8 | dizionario | wrapper `mt-6 sm:hidden` → `SectionEndCue`, **senza `sm:hidden`**: la catena arriva al CTA a ogni breakpoint. |

Totale: **7 istanze** (di cui 2 mutuamente esclusive per breakpoint), una
meccanica, catena completa
`hero → ranking → piramide → stagione → punteggio → dizionario → CTA`.

### Il caso pinnato (#2) in dettaglio

`ranking-section.tsx` ha già `scrollYProgress` su tutta la sezione da 300vh:

```tsx
// The cue is anchored to the bottom of the pinned frame, which stays on screen
// for the section's full 300vh. Revealing it only over the last stretch makes
// it mean "this chapter is ending", exactly like the in-flow cues elsewhere,
// instead of sitting there as permanent furniture.
const cueOpacity = useTransform(scrollYProgress, [0.86, 0.95], [0, 1]);
const cuePointerEvents = useTransform(scrollYProgress, (v) =>
  v > 0.86 ? "auto" : "none"
);
```

`0.86` è la fine della banda dell'ultima statistica (`BANDS[3] = [0.78, 0.82,
0.92, 0.98]`, quindi l'ultimo numero è pienamente visibile fino a `0.92`): la
cue entra mentre l'ultima statistica è ancora leggibile, senza sovrapporsi
all'attenzione. `cuePointerEvents` evita un bottone invisibile ma cliccabile
durante il resto del pin.

L'intro della piramide (#4) non ha bisogno dello stesso trattamento perché la
cue viene rimossa: la sezione non usa `useScroll` e non serve introdurlo.

## 4. Pulizia i18n

Rimossa la cue #4, la chiave `home.pyramid.exploreLabel` ("Esplora la
piramide" / "Explore the pyramid") non ha più consumatori: va tolta da
`src/lib/i18n/it.ts` e `en.ts`. `tsc` verifica che i due dizionari restino
allineati, dato che `Dictionary` è derivato da `it.ts`.

## File toccati

- `src/components/homepage/scroll-cue.tsx` — tempi + nuovo `SectionEndCue`.
- `src/components/homepage/index.ts` — export di `SectionEndCue`.
- `hero-section.tsx` — solo un commento che spiega l'eccezione.
- `ranking-section.tsx` — dissolvenza sulla cue desktop, fascia su quella mobile,
  padding della lista.
- `pyramid-section.tsx` — rimozione della cue intro, sticky → fascia.
- `timeline-section.tsx`, `scoring-section.tsx`, `glossary-section.tsx` — fascia
  + padding di sezione.
- `src/lib/i18n/it.ts`, `en.ts` — rimozione di `exploreLabel`.

Nessuna modifica a: animazioni delle sezioni, layout dei contenuti, `SectionNavigator`,
altre etichette i18n.

## Note di implementazione

Due scostamenti minimi dal piano, entrambi conseguenze dirette della regola
"la fascia possiede la spaziatura del confine":

- **Piramide, colonna dei testi**: `pb-8 lg:pb-[35vh]` → `lg:pb-[35vh]`. Quel
  `pb-8` era spaziatura di fine sezione per il mobile, che ora è della fascia.
  Il `lg:pb-[35vh]` resta perché serve alla corona ATP Finals.
- **i18n**: insieme a `exploreLabel` è stata rimossa anche `exploreAria`
  ("Scorri alla piramide grafica" / "Scroll to the pyramid graphic"). Apparteneva
  alla stessa cue #4, ed era in realtà **già inutilizzata prima** di questo
  intervento: nessun componente la referenziava.

## Stato finale — le 7 istanze

| Sezione | Meccanica | Note |
|---|---|---|
| hero | `ScrollCue` nuda, `absolute bottom-3 md:bottom-6` | unica eccezione, documentata nel codice |
| ranking desktop | `ScrollCue` nuda in `motion.div` `absolute bottom-6` | dissolvenza `0.86 → 0.95` dello `scrollYProgress` |
| ranking mobile | `SectionEndCue` | fuori dalla lista flex |
| piramide | `SectionEndCue` | era `sticky`, ed era doppia |
| timeline | `SectionEndCue` | |
| punteggio | `SectionEndCue` | |
| dizionario | `SectionEndCue` | senza più `sm:hidden` |

Catena completa: `hero → ranking → piramide → stagione → punteggio → dizionario
→ CTA`.

## Cosa resta non risolto

Sotto `xl` la `SectionNavigator` è nascosta, quindi su mobile e tablet le cue
restano l'unico ausilio di navigazione — e ora si vedono solo ai confini. Se
scorrendo senti la mancanza di un riferimento continuo su mobile, la risposta
giusta è estendere la navigator (opzione 3 del documento), non rimettere le cue
sticky.
