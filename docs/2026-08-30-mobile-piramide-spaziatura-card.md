# Mobile — spaziatura delle card nella sezione piramide

Data: 2026-08-30
Stato: **approvato e implementato**

## Problema

Su smartphone, nella sezione "piramide" (categorie di tornei: Grand Slam →
Challenger, `src/components/homepage/pyramid-section.tsx`) le card sono separate
da uno schermo vuoto ciascuna: si scorre a lungo senza vedere nulla.

Causa: il wrapper di ogni card in `TierTextBlock` è

```tsx
<div className="min-h-[100dvh] flex flex-col justify-center py-16 md:py-20">
```

`min-h-[100dvh]` + `py-16` (64px sopra e sotto) valgono a **tutti** i
breakpoint. Su desktop è voluto: la piramide grafica a sinistra è `sticky` e
ogni blocco di testo deve occupare un viewport intero, così mentre scorri il
tier corrispondente si illumina. Ma quella grafica è `hidden lg:flex`: **su
mobile non esiste**, quindi l'altezza a schermo pieno non sincronizza niente e
resta solo vuoto.

Stesso discorso per due dettagli collegati:

- `pb-[35vh]` sulla colonna dei testi (riga 243): serve perché l'ultima card
  riesca ad arrivare al centro dello schermo e attivare la corona ATP Finals.
  Su mobile è solo un buco finale prima della scroll cue.
- La de-enfasi `opacity-30 scale-95` sulle card fuori dal centro (riga 62):
  esiste per indicare quale tier è attivo *nella grafica*. Senza grafica non
  comunica nulla, e con le card ravvicinate diventa uno sfarfallio di opacità
  durante lo scroll. È visibile anche nello screenshot: la card in alto è
  slavata a metà.

## Soluzione proposta

Nessuna modifica al comportamento desktop: si tratta di far valere le regole
attuali solo dal breakpoint in cui la piramide grafica compare, cioè `lg`.

| Riga | Prima | Dopo |
|---|---|---|
| Wrapper card | `min-h-[100dvh] ... py-16 md:py-20` | `py-4 lg:min-h-[100dvh] lg:py-20` |
| Colonna testi | `pb-[35vh]` | `pb-8 lg:pb-[35vh]` |
| De-enfasi fuori vista | `opacity-30 scale-95` | `lg:opacity-30 lg:scale-95` |

Effetti su mobile:

- Le card si susseguono con **32px di stacco** (`py-4` di due card adiacenti),
  in linea con il ritmo delle altre sezioni della homepage.
- Tutte le card sono a piena opacità: si leggono scorrendo, senza dover
  centrare ciascuna per vederla nitida. Il bordo sinistro continua a passare a
  lime quando la card è al centro, quindi l'indicazione di "card corrente" non
  si perde del tutto.
- La sezione si accorcia di circa 5 viewport, che è la ragione per cui oggi la
  si percepisce come interminabile.

`setActiveTier` continua a girare anche su mobile (nessuna modifica alla logica
di stato): resta corretto e senza effetti collaterali, dato che l'unico
consumatore — la piramide grafica — è nascosto.

## File toccati

- `src/components/homepage/pyramid-section.tsx` — solo classi Tailwind, tre
  punti.

Nessuna modifica a: layout desktop, logica di stato, i18n, animazioni della
corona ATP Finals, sezione intro.

## Nota di implementazione

Le soglie sono `lg`, non `md`: la piramide grafica è `hidden lg:flex`, quindi
anche i tablet in portrait (md) restavano senza grafica e con un viewport vuoto
per card. Ora il comportamento "una card = uno schermo" parte esattamente dal
breakpoint in cui la grafica compare.

## Fuori scope (segnalato, non incluso)

- La scroll cue "LA STAGIONE" è `sticky bottom-6` e su mobile galleggia **sopra**
  il testo delle card (visibile nello screenshot). È un problema diverso dalla
  spaziatura; se vuoi lo affronto subito dopo.
