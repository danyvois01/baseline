# Mobile — pulizia visiva della riga classifica

Data: 2026-08-23
Stato: **approvato e implementato**

## Problema

Su smartphone la riga della classifica risulta caotica. Cause identificate nel
codice (`rankings-table.tsx`, `race-table.tsx`, `official-table.tsx`, blocchi
`MOBILE CARD LIST`):

1. **Quattro accenti colorati per riga in competizione**: pillola movimento
   (verde/rosso pieno), diff punti (verde/rosso), dot stato, badge round (lime
   pieno o bordato). Il colore perde valore di segnale.
2. **Doppio segnale verde/rosso ambiguo**: `▼3` sono posizioni, `-190` sono
   punti; hanno peso visivo identico e sembrano lo stesso dato.
3. **Lo stato "Eliminato" pesa quanto lo stato "In gara"**: occupa una riga
   piena a 13px, per la maggior parte dei giocatori. I pochi giocatori attivi —
   il senso stesso del Live Ranking — non emergono.
4. **La colonna rank/movimento sfonda**: contenitore `w-8` (32px) con dentro una
   pillola `px-2.5` più larga. Ogni riga parte da un'ascissa diversa: è la causa
   principale della sensazione di disallineamento.
5. **Tre livelli di sfondo sovrapposti**: zebra `surface-gray/20`, highlight
   `baseline-lime/5` della riga espansa, divider.
6. **Margini magici**: `ml-11` (44px) codificato a mano per allineare la riga
   stato e la card espansa alla colonna `w-8 + gap-3`. Si rompe a ogni modifica
   della colonna sinistra.

## Principio guida

**Un solo accento colorato per riga**, riservato al dato che cambia: la
variazione punti (o "Qualificato" nella Race). Tutto il resto comunica con
forma, peso e posizione. Il lime resta esclusivo dei giocatori **in gara**.

Nota: la de-enfasi usa i token colore (`text-text-muted`) e il peso del font,
non la trasparenza — coerente con la decisione già documentata in
`live-status-cell.tsx` ("De-emphasis is structural, never transparency").

## Soluzione proposta

### 1. Rank e movimento in linea, colonna a larghezza fissa

Il movimento passa da sotto il rank a fianco del rank, dentro una colonna di
larghezza fissa. Il nome di ogni giocatore parte esattamente dalla stessa
ascissa.

```
ATTUALE                           PROPOSTA

 9   Ben Shelton      3,480        9 ▾3   Ben Shelton      3,480
▼3   USA · 23          -190               USA · 23          -190
 ● Eliminato - Cincinnati (R64)           Eliminato · Cincinnati · R64

11   Arthur Fils      2,790       11 ▴10  Arthur Fils      2,790
▲10  FRA · 22          +650               FRA · 22          +650
 ● In gara - Cincinnati (F)        ● In gara - Cincinnati  (F)
```

### 2. Struttura a griglia, via i margini magici

Ogni card mobile diventa:

```tsx
<div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-2 px-4 py-3">
  {/* col 1 — rank + movimento */}
  <div className="flex items-baseline gap-1.5">…</div>

  {/* col 2 — nome/meta + punti/diff + chevron */}
  <div className="flex items-start gap-3">…</div>

  {/* col 2 — riga stato */}
  <div className="col-start-2">…</div>

  {/* col 2 — dettagli espansi (solo Live) */}
  <div className="col-start-2">…</div>
</div>
```

Riga stato e card espansa si allineano da sole alla colonna del nome: `ml-11`
scompare. 72px ospitano un rank a 3 cifre + movimento a 2 cifre; con rank a 4
cifre si comprime solo lo spazio interno.

### 3. `MovementBadge` — nuova variante `inline`

Nuova prop opzionale `variant?: "pill" | "inline"`, default `"pill"`
(desktop invariato). La variante `inline`, usata solo dagli elenchi mobile:

- `up` / `down`: freccia `▴`/`▾` a 9px + valore, `text-[11px] font-bold
  text-text-muted tabular-nums`, nessuno sfondo.
- `mr` / `nmr`: testo `text-[10px] font-bold text-text-muted`, nessuna pillola.
- `none`: `—` in `text-text-muted`.

La direzione resta leggibile dalla forma della freccia, quindi l'informazione
non si perde — e diventa accessibile anche a chi non distingue rosso e verde.

### 4. `LiveStatusCell` — nuova prop `compact`

Nuova prop opzionale `compact?: boolean`, default `false` (desktop invariato).
Con `compact`:

- **In gara**: dot lime `w-2 h-2` con `live-pulse`, testo `text-[12px]
  font-semibold text-foreground`, badge round lime pieno `text-[9px] px-1.5`.
  Resta l'unico elemento colorato/marcato della riga.
- **Eliminato**: dot neutro `w-1.5 h-1.5 bg-text-muted`, testo `text-[11px]
  font-medium text-text-muted`, round inline come `· R64` — via la pillola
  bordata.

Il contrasto di peso tra i due casi fa emergere i giocatori attivi. Nessuna
informazione rimossa: torneo e round restano visibili in entrambi i casi.
Nessuna modifica alle stringhe i18n.

### 5. Zebra striping rimosso su mobile

Rimosso `idx % 2 === 1 && "bg-surface-gray/20"` dai tre elenchi mobile; i
`divide-y divide-border-subtle/40` bastano a separare le righe. Resta il
`bg-baseline-lime/5` della riga espansa, che così torna a essere leggibile come
stato e non come alternanza.

### 6. Chevron (solo Live)

Resta, ma passa a `text-text-muted` e `h-4 w-4` allineato al centro verticale
della prima riga, per non aggiungere un secondo elemento a peso pieno a destra.

## File toccati

- `src/components/rankings/movement-badge.tsx` — prop `variant`.
- `src/components/rankings/live-status-cell.tsx` — prop `compact`.
- `src/components/rankings/rankings-table.tsx` — blocco mobile.
- `src/components/rankings/race-table.tsx` — blocco mobile.
- `src/components/rankings/official-table.tsx` — blocco mobile.

Nessuna modifica a: layout desktop, tipi, hook dei filtri, i18n, scraper,
logica di paginazione ed espansione.

## Riepilogo colore per riga (dopo)

| Elemento | Prima | Dopo |
|---|---|---|
| Movimento posizioni | pillola verde/rossa piena | freccia + valore, neutro |
| Diff punti | testo verde/rosso | testo verde/rosso (unico accento) |
| Stato — in gara | dot lime + badge lime | dot lime + badge lime (invariato) |
| Stato — eliminato | testo pieno + badge bordato | testo muted, round inline |
| Sfondo riga | zebra + espansa lime | solo espansa lime |

## Revisione: gutter più stretto (approvata dopo test su device)

Il gutter da 72px reggeva rank + movimento in linea, ma un rank a 1-2 cifre ne
usava ~30: i nomi partivano troppo a destra. Colonne strette a
`grid-cols-[36px_minmax(0,1fr)] gap-x-2` (36px = rank a 3 cifre in Outfit
ExtraBold 20px) e movimento **impilato sotto il rank** dentro lo stesso gutter.

Questo è possibile solo grazie alla variante `inline`: larga ~22px, contro i
~44px della pillola colorata originale, che è ciò che costringeva a un gutter
enorme. I nomi passano da ~100px a ~60px dal bordo della card e smettono di
troncare nei casi comuni.

## Revisione: "prossima settimana" nella Official (approvata in chat)

La card mobile della Official impilava a destra due numeri senza etichetta —
punti correnti e punti proiettati — più una freccia che indicava la variazione di
**posizione** proiettata, ma stava accanto a un numero di **punti**. In più la
card mostra due movimenti diversi (quello della settimana corrente nel gutter e
quello proiettato a destra) senza nulla che li distingua.

La colonna destra torna a un solo numero grande. La proiezione passa a una riga
etichettata sotto la meta, nella stessa posizione in cui Live e Race mostrano lo
stato torneo:

```
Pross. Sett. · 12,800          (nessuna variazione di posizione)
Pross. Sett. · 7,160 · ▾1      (posizione proiettata in calo di 1)
```

Testo `text-[11px] text-text-muted`, freccia via `MovementBadge variant="inline"`
— quindi anche l'ultimo accento colorato a destra sparisce. Etichetta dalla
chiave i18n già esistente `rankings.table.nextWeek` ("Pross. Sett." / "Next
Week"), nessuna stringa nuova.

## Revisione: espansione Official + movimento colorato (approvata in chat)

1. **Espansione anche su mobile Official**, benché su desktop la colonna Next
   Week sia sempre visibile. La riga etichettata inline è diventata un pannello
   espandibile con lo stesso meccanismo di Live (`expandedIds` Set, transizione
   `grid-template-rows` 0fr→1fr, chevron che ruota, sfondo `baseline-lime/5`
   quando aperta). Contenuto: griglia a 2 celle con micro-label, come il
   pannello espanso di Live — `PROSS. SETT. / 2,080` e `MOV. / ▾6`.
   La card chiusa resta a due righe con un solo numero a destra.

2. **Movimento colorato solo nella Official.** La tabella non ha una variazione
   punti, quindi il movimento di posizione è l'unico valore di segnale della
   riga: nuova prop `colored` su `MovementBadge` (variante `inline`) che colora
   la freccia verde/rossa mantenendo la forma compatta. Live e Race restano
   neutre, perché lì il colore è già speso sulla variazione punti.

## Correzione post-implementazione

La traccia `1fr` ha minimo implicito `auto`, quindi non scendeva sotto la
larghezza min-content del contenuto: ogni card (griglia indipendente) si
dimensionava sulla lunghezza del nome del giocatore, i punti finivano a
un'ascissa diversa per riga e i nomi lunghi sfondavano invece di troncare.
Le colonne sono passate a `grid-cols-[72px_minmax(0,1fr)]`.

## Fuori scope

- Layout desktop (tabella a 7 colonne).
- Riordino o rimozione di dati dalla riga.
- Accordion a card singola per l'espansione mobile.
