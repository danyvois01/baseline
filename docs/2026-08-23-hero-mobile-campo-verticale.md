# Hero mobile — campo verticale in prospettiva

Data: 2026-08-23
Stato: **approvato e implementato** (con la revisione "versione leggera" in fondo)

## Problema

Nell'hero della homepage il campo animato è `hidden md:block`
(`src/components/homepage/hero-section.tsx`, colonna destra): su mobile viene
rimosso e resta solo il testo. L'hero mobile perde l'unico elemento dinamico e
l'identità visiva del progetto — la linea di fondo campo, che dà il nome al sito.

Il campo desktop è un SVG landscape `520×300`: superficie scura, linee lime che
si disegnano da sole in sequenza, rete tratteggiata, pallina che palleggia in
loop da 8s con una scia. Rimpicciolirlo su uno schermo verticale lo renderebbe
un francobollo.

## Soluzione proposta

Un **secondo tracciato** del campo, in orientamento portrait e in prospettiva,
visto da dietro la linea di fondo: base larga in basso, fondo stretto in alto.
Riempie la forma dello schermo invece di combatterla, è full-bleed dietro al
testo e non richiede spazio verticale aggiuntivo.

```
┌─ 100dvh ─────────────┐
│  BASELINE            │  testo invariato,
│  LA LINEA DI FONDO   │  z-10
│  ────────            │
│  La linea di fondo   │
│  campo è il punto    │
│  di partenza...      │
│                      │
│    ╲───┬───╱         │  linee lime che si
│     ╲  │  ╱   ●      │  disegnano + pallina
│      ╲─┼─╱           │  che palleggia in
│       ╲│╱            │  profondità
│     SCOPRI ⌄         │
└──────────────────────┘
```

### Nuovo componente

`src/components/homepage/hero-court-portrait.tsx` — il campo verticale isolato,
per non gonfiare `hero-section.tsx` (già 247 righe). Usato nell'hero come layer
`md:hidden`; la colonna desktop resta esattamente com'è.

### Geometria (viewBox `0 0 360 420`)

Trapezio prospettico. Linea di fondo vicina larga 320px in basso, fondo lontano
larga 100px in alto; la metà vicina occupa 200px di profondità contro i 150px
della metà lontana, così la compressione si legge come prospettiva.

| Elemento | Path |
|---|---|
| Perimetro (doppio) | `M20,400 L130,60 L230,60 L340,400 Z` |
| Corridoio sinistro (singolo) | `M60,400 L142.5,60` |
| Corridoio destro (singolo) | `M300,400 L217.5,60` |
| Linea di servizio vicina | `M53,300 L307,300` |
| Linea di servizio lontana | `M103,145 L257,145` |
| Linea centrale di servizio | `M180,300 L180,145` |
| Segni di centro | `M180,400 L180,390` e `M180,60 L180,70` |
| Rete (tratteggiata, più spessa) | `M82,210 L278,210` |

Le larghezze intermedie seguono l'interpolazione lineare fra le due linee di
fondo (`w = 100 + (y-60)/340 × 220`), quindi ogni linea orizzontale tocca
esattamente i corridoi.

### Animazione

Stessa grammatica del desktop, così mobile e desktop si sentono lo stesso
oggetto:

- **Draw-on** sequenziale con `motion.path` + `pathLength`, delay 0 → 1.4s
  nell'ordine: perimetro, corridoi, rete, linee di servizio, segni di centro.
- **Superficie** `fill-[#1C2127] dark:fill-[#1C2333]` (identica al desktop), in
  fade a 0.5s.
- **Pallina** `motion.circle` con keyframes `cx`/`cy`/`r` — il raggio si
  rimpicciolisce in profondità (7 → 3), che è ciò che rende leggibile la
  prospettiva. Loop 8s infinito, più la scia a opacità 0.2 con 0.2s di ritardo,
  come sul desktop. Tutti i punti del rally cadono dentro il trapezio.
- **Parallax**: riuso di `courtY` / `courtScale` / `opacity` già calcolati
  nell'hero da `useScroll`, così il campo scorre con lo stesso ritmo del testo.

### Posizionamento e leggibilità

Layer `absolute inset-x-0 bottom-0 h-[52dvh]`, dietro il testo (testo `z-10`,
scroll cue `z-20`). Il testo non si sposta di un pixel: nessuno spazio verticale
in più.

Sopra al layer una maschera CSS
`mask-image: linear-gradient(to top, transparent 0%, black 14%, black 62%, transparent 100%)`:

- **in alto** il campo sfuma verso il fondo lontano — prospettiva atmosferica,
  nessun bordo netto che tagli la pagina a metà;
- **in basso** sfuma negli ultimi 14%, così la scroll cue "SCOPRI" resta su
  fondo chiaro e leggibile.

## File toccati

- `src/components/homepage/hero-court-portrait.tsx` — nuovo.
- `src/components/homepage/hero-section.tsx` — inserimento del layer `md:hidden`
  e passaggio delle motion values del parallax.
- `src/components/homepage/index.ts` — export del nuovo componente.

Nessuna modifica a: colonna campo desktop, testi, i18n, layout del testo, altre
sezioni della homepage.

## Revisione: versione leggera (approvata in chat)

Richiesta in fase di approvazione: "senza farlo troppo pesante, in mobile
l'esperienza deve restare clean". Modifiche rispetto al piano sopra:

- **Sei linee invece di otto**: eliminati i due segni di centro sulle linee di
  fondo. A questa scala erano dettaglio non leggibile, solo rumore.
- **Nessuna scia della pallina**: resta una sola pallina con il glow. Un
  elemento animato al posto di due.
- **Geometria alzata**: linea di fondo vicina a `y=345` invece di `y=400`, con
  75 unità di spazio vuoto sotto (~18% dell'altezza del layer). La scroll cue
  "SCOPRI" resta così completamente fuori dal campo, su fondo chiaro — niente
  sfumatura in basso a comprometterne il tracciato.
- **Maschera solo verso l'alto**:
  `linear-gradient(to top, black 0%, black 38%, transparent 92%)`. Sfuma
  insieme superficie e linee verso il fondo lontano; il campo si dissolve nella
  pagina invece di presentarsi come blocco scuro.
- **Layer a `h-[50dvh]`** con `preserveAspectRatio="xMidYMax slice"`, così la
  base del campo resta ancorata al fondo su qualsiasi altezza di viewport.

La superficie scura resta (è ciò che rende leggibile il lime, come sul desktop),
ma essendo un trapezio sfumato verso l'alto occupa una frazione dell'area di un
rettangolo full-bleed.

Geometria finale (viewBox `0 0 360 420`):

| Elemento | Path |
|---|---|
| Perimetro / superficie | `M20,345 L130,40 L230,40 L340,345 Z` |
| Corridoio sinistro | `M60,345 L142.5,40` |
| Corridoio destro | `M300,345 L217.5,40` |
| Linea di servizio vicina | `M51,260 L309,260` |
| Linea di servizio lontana | `M101,122 L259,122` |
| Linea centrale di servizio | `M180,260 L180,122` |
| Rete (tratteggiata) | `M80,180 L280,180` |

Il filtro del glow usa un id dedicato (`hero-ball-glow-portrait`): il campo
desktop è nascosto solo via CSS, quindi il suo `<defs>` resta nel documento e un
id duplicato sarebbe ambiguo.

## Revisione: fascia bassa dedicata (dopo test su device)

La versione full-bleed dietro al testo non funzionava: la superficie scura è più
densa in basso, cioè esattamente dove finisce il paragrafo, che diventava
illeggibile. La maschera che sfumava verso l'alto peggiorava le cose — spostava
il nero verso il testo invece che lontano da esso.

Il campo passa a una **fascia autonoma in fondo all'hero**, senza alcuna
sovrapposizione col testo:

- **viewBox `0 0 360 200`** — proporzione bassa e larga, tipo inquadratura TV
  dietro il fondo campo. Linea di fondo vicina 320 di larghezza a `y=155`, fondo
  lontano 80 a `y=20`; `w(y) = 80 + (y-20)/135 × 240`.
- **Contenitore** `absolute inset-x-0 bottom-0 w-full aspect-[360/200]`: stesso
  rapporto del viewBox, quindi nessun letterboxing e nessuno stroke stirato.
  Altezza risultante ≈ 55.5vw.
- **L'hero riserva la fascia** con `pb-[56vw] md:pb-0`: il testo resta centrato
  *sopra* al campo. Nessun `z-index` da bilanciare, nessuna sovrapposizione
  possibile.
- **Niente maschera**: il trapezio è una forma chiusa — il suo bordo superiore
  *è* la linea di fondo lontana — quindi non c'è nessun taglio da nascondere.
  Resta un `drop-shadow-xl` che segue la sagoma, come il `drop-shadow-2xl` del
  campo desktop.
- **45 unità vuote sotto la linea di fondo** (~12vw): la scroll cue vive in
  quella striscia chiara, con `bottom-3 md:bottom-6`. Nessun bisogno di
  duplicare `ScrollCue` nella variante light per il fondo scuro.
- **Testo compattato su mobile**: il lead passa a `text-[17px] leading-snug`
  (invariato da `md` in su) e `mt-6 md:mt-8`, così il blocco di testo entra
  sopra la fascia anche su viewport corti tipo iPhone SE.

Geometria finale (viewBox `0 0 360 200`):

| Elemento | Path |
|---|---|
| Perimetro / superficie | `M20,155 L140,20 L220,20 L340,155 Z` |
| Corridoio sinistro | `M60,155 L150,20` |
| Corridoio destro | `M300,155 L210,20` |
| Linea di servizio vicina | `M45,127 L315,127` |
| Linea di servizio lontana | `M111,53 L249,53` |
| Linea centrale di servizio | `M180,127 L180,53` |
| Rete (tratteggiata) | `M87,80 L273,80` |

Le due leve per regolare l'ingombro restano `aspect-[360/200]` sul contenitore e
il `pb-[56vw]` dell'hero, che vanno cambiati insieme.

## Revisione finale: campo landscape impilato (dopo test su device)

Scelta dell'utente dopo aver visto la fascia in prospettiva: **stesso campo
orizzontale del desktop, solo sotto il testo invece che di fianco.** La
prospettiva viene abbandonata.

Questo non richiede nessun tracciato nuovo: il contenitore dell'hero è già
`flex flex-col md:flex-row`, quindi la colonna del campo si impila da sola sotto
il testo su mobile. Bastava smettere di nasconderla.

- `hero-court-portrait.tsx` **eliminato** (e il suo export dal barrel): tutto il
  campo verticale in prospettiva descritto sopra non esiste più. Le sezioni
  precedenti di questo documento restano come traccia del percorso.
- Colonna campo: `hidden md:block` → visibile a tutti i breakpoint. Nessuna
  modifica all'SVG, ai path, all'animazione o al parallax: mobile e desktop
  mostrano ora esattamente lo stesso oggetto.
- Sezione hero: `pb-16 md:pb-0` al posto del `pb-[56vw]`. Il campo è in flusso,
  quindi non serve riservargli una fascia; il padding serve solo a tenere la
  scroll cue staccata dal campo. La cue torna quindi al suo offset,
  `bottom-3 md:bottom-6`.
- Resta la **compattazione del lead su mobile** (`text-[17px] leading-snug`,
  `mt-6`): con il campo in flusso il testo deve stare comunque in `100dvh`, e su
  un viewport tipo iPhone SE senza compattazione la scroll cue finisce sotto il
  fold.

Il campo su mobile è larghezza del contenitore meno `px-6`, con il suo
`max-w-[500px]`: circa 342×197 su uno schermo da 390px.

## Fuori scope

- `prefers-reduced-motion`: l'hero attuale non lo gestisce da nessuna parte,
  quindi non lo introduco qui per non cambiare comportamento solo su mobile.
  Se lo vuoi, lo affronto come intervento a sé su tutta la homepage.
- Ridisegno del testo dell'hero (dimensioni titolo, lunghezza del lead).
- Le altre sezioni della homepage su mobile.
