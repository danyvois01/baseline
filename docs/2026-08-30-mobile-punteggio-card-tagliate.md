# Mobile — card del punteggio tagliate sul bordo destro

Data: 2026-08-30
Stato: **approvato e implementato**

## Problema

Nella sezione punteggio (`src/components/homepage/scoring-section.tsx`) su
schermi stretti il contenuto delle card viene tagliato a destra: il paragrafo si
interrompe a metà parola, il blocco "Curiosità" e il badge lime finiscono sotto
il bordo.

**Non è la card che esce dal viewport**: è il contenuto che sfonda la card. Il
frame della card ha `overflow-hidden` (riga 122), quindi invece di allargarsi
taglia.

Il colpevole è la larghezza minima del tabellone. Su mobile la card è una griglia
a una colonna (`grid md:grid-cols-2`), quindi **testo e tabellone condividono la
stessa traccia**; una traccia `auto` non può scendere sotto il min-content del
suo contenuto, e il tabellone lo impone:

```
2 × w-20 (160) + puntini (8) + 2 × gap-4 (32)   = 200px
+ p-6 del tabellone (48) + border-[8px] × 2 (16) = 264px  ← minimo della traccia
+ p-6 della card (48)                            = 312px  ← minimo della card
+ px-6 della sezione (48)                        = 360px  ← viewport minimo
```

Sotto i ~360px di viewport la traccia resta a 264px mentre il box interno della
card è più stretto: il testo viene portato a 264px e tagliato via
`overflow-hidden`. È esattamente ciò che si vede nello screenshot.

## Soluzione proposta

Abbassare il minimo del tabellone introducendo uno scalino a `sm`, invece di
partire dalle misure pensate per il desktop. Nessuna modifica da `md` in su.

| Elemento | Prima | Dopo |
|---|---|---|
| Pulsanti punteggio (game/deuce/tie-break) | `w-20 h-28 md:w-32 md:h-40` | `w-16 h-24 sm:w-20 sm:h-28 md:w-32 md:h-40` |
| Cifra del punteggio | `text-[50px] md:text-[80px]` | `text-[42px] sm:text-[50px] md:text-[80px]` |
| Gap della riga punteggi | `gap-4 md:gap-8` | `gap-3 sm:gap-4 md:gap-8` |
| Padding del tabellone | `p-6 md:p-8 lg:p-10` | `p-4 sm:p-6 md:p-8 lg:p-10` |
| Padding della card | `p-6 md:p-10 lg:p-12` | `p-5 sm:p-6 md:p-10 lg:p-12` |
| Badge di stato | `px-6` | `px-5 sm:px-6 max-w-full` |

Nuovo minimo: `2 × 64 + 8 + 2 × 12 = 160` → `+ p-4 (32) + border (16) = 208` →
`+ p-5 della card (40) = 248` → `+ px-6 (48) = 296px` di viewport. Sta dentro
anche su un 320px con margine.

In più due presidi strutturali:

- **`min-w-0` sui due item della griglia** della card: senza di esso un
  contenuto larghissimo può sempre allargare la traccia. Con `min-w-0` la
  colonna può scendere alla larghezza del contenitore, e l'eventuale eccesso
  resta confinato dentro il tabellone (che ha già `overflow-hidden` suo) invece
  di trascinare con sé il testo.
- **`w-full max-w-[600px] mx-auto` sul wrapper del tie-break**: è l'unico dei
  tre visual senza vincolo di larghezza (`InteractiveScoreboard` e `SetVisual`
  lo hanno già). Uniformarlo elimina un caso particolare.

## Note

`SetVisual` non è interessato: le sue caselle dei game sono in `flex-wrap`,
quindi il suo min-content è una sola casella e non c'è blowout.

## File toccati

- `src/components/homepage/scoring-section.tsx` — solo classi Tailwind.

Nessuna modifica a: layout desktop, logica di punteggio, animazioni, i18n.

## Fuori scope

- La scroll cue sticky sopra il testo nella sezione piramide (già segnalata,
  rinviata).
- Le altre sezioni della homepage: se lo scrollbar orizzontale resta anche dopo
  questa correzione, il responsabile è altrove e va cercato a parte.
