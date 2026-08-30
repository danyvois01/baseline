# Mobile — contatore del dizionario appiccicato alle card

Data: 2026-08-30
Stato: **approvato e implementato**

## Problema

Nella sezione dizionario (`src/components/homepage/glossary-section.tsx`) il
contatore di posizione (`01 / 15`) tocca il bordo inferiore del mazzo di card:
sembra spazio non gestito, non una scelta.

Non è un margine mancante — il contatore ne ha già uno:

```tsx
<div className="flex items-baseline gap-1.5 mt-8 sm:mt-10 ...">
```

Il margine viene **consumato dall'overflow del mazzo**. Le tre card visibili
sono `absolute inset-0` dentro un contenitore ad altezza fissa e vengono
sfalsate con una trasformazione:

```tsx
animate: { scale: 1 - index * 0.05, y: index * 18 }
```

Con `origin-bottom` lo `scale` non muove il bordo inferiore, quindi resta il
`translateY`: la terza card finisce **36px sotto** il contenitore
(`h-[280px] sm:h-[300px]`), che essendo ad altezza fissa non si allarga per
contenerla.

```
32px di mt-8 − 36px di sporgenza = −4px di distanza reale
```

Da qui l'effetto "appiccicato": il numero cade esattamente sul bordo della card
più bassa del mazzo. Su `sm` il conto è identico (40 − 36 = 4px), solo meno
evidente perché lì il layout è più arioso.

## Soluzione proposta

Rendere l'ingombro del mazzo esplicito, invece di lasciarlo sfondare fuori dal
suo contenitore, e dare al contatore una distanza scelta.

| Elemento | Prima | Dopo |
|---|---|---|
| Contenitore del mazzo (riga 146) | `h-[280px] sm:h-[300px]` | `h-[280px] sm:h-[300px] mb-9` |
| Contatore (riga 221) | `mt-8 sm:mt-10` | `mt-10 sm:mt-12` |

`mb-9` = 36px, esattamente la sporgenza della terza card (`2 × 18px`):
l'ingombro del contenitore arriva così a coincidere con la sagoma visibile del
mazzo. Le card non cambiano dimensione, restano `absolute inset-0` sui 280px.

**Deve essere un margine, non un padding.** Con `box-sizing: border-box`
(default di Tailwind) un `pb-9` su un elemento ad altezza fissa viene assorbito
*dentro* i 280px: l'ingombro esterno non cambia di un pixel e il problema
resterebbe identico. Inoltre gli elementi assoluti si posizionano rispetto al
*padding box*, quindi `inset-0` coprirebbe comunque anche il padding. Il
margine invece sta fuori dal box e alza l'altezza della riga flex.

Distanza risultante fra ultima card e contatore: **40px su mobile, 48px da
`sm`**, invece degli attuali ~0px.

### Effetto collaterale sulle frecce (desktop, voluto)

Le frecce laterali sono `hidden sm:flex` in una riga `items-center`. Il margine
del mazzo fa parte del suo margin box, quindi la riga cresce di 36px e le frecce
si ri-centrano su quell'altezza: scendono di 18px. È un
miglioramento, non una regressione — oggi sono centrate sulla prima card e
appaiono alte rispetto al mazzo; dopo la modifica sono centrate sul mazzo
intero. Su mobile le frecce non esistono, quindi zero impatto.

## File toccati

- `src/components/homepage/glossary-section.tsx` — solo classi Tailwind, due
  punti.

Nessuna modifica a: animazioni del mazzo, swipe/drag, marquee, i18n, altezza
delle card, layout desktop del resto della sezione.

## Fuori scope (segnalato, non incluso)

- Nello stesso screenshot la definizione lunga di ACE arriva a sfiorare
  l'hint `← SWIPE →`, che è `absolute bottom-6` e quindi non occupa spazio nel
  flusso: su definizioni lunghe e schermi stretti i due possono collidere. È lo
  stesso tipo di problema (elemento assoluto senza spazio riservato) ma su un
  altro elemento; se vuoi lo sistemo subito dopo.
