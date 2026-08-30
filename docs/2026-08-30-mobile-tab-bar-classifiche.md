# Mobile — tab bar delle classifiche: pill che sborda e raggi incoerenti

Data: 2026-08-30
Stato: **approvato e implementato** (etichette corte)

## Problema

Nelle pagine classifiche, su mobile, la pill lime della tab attiva ("Official
Ranking") esce dalla sagoma bianca dell'header, e il suo raggio non ha alcuna
relazione con quello della barra.

`src/components/layout/top-nav-bar.tsx` anima il raggio dell'header:

```tsx
const navRadius = useTransform(scrollY, [0, 100], ["0px", "9999px"]);
```

`9999px` funziona quando l'header è una riga sola (homepage, `h-16 sm:h-20`): il
browser clampa il raggio a metà dell'altezza minore, cioè 32–40px, e viene un
pill vero. Ma nelle pagine classifiche sotto `xl` compare una **seconda riga**
di tab, e l'header arriva a ~104px:

```
h-16 (64px)  riga logo + azioni
+ 40px       riga tab (pt-1 + tab 28px + pb-2)
= 104px      →  raggio clampato a 52px
```

Con 52px di raggio gli angoli inferiori curvano via dal bordo inferiore proprio
dove vivono le tab. La riga è a larghezza piena con `justify-center`, e
l'header **non ha clipping** (non potrebbe averlo: il raggio è animato, e
`overflow-hidden` taglierebbe le tab invece di contenerle). Risultato: la pill
non viene tagliata, è il bianco che le scappa da sotto.

I conti, su un viewport da 360px con l'header al 90% (dopo lo scroll):

```
riga tab (min-content):  107 + 84 + 88 + 8 di gap =  287px
spazio disponibile:      324 − 24 (px-3)          =  300px
slack di justify-center: (300 − 287) / 2          =  6.5px
bordo sinistro pill:     12 + 6.5                 =  18.5px

sagoma dell'header a quell'altezza (8px dal fondo, raggio 52):
  x = 52 − √(52² − 44²)                           =  24.3px
```

18.5 < 24.3 → la pill sta 6px fuori dalla sagoma. Su 390px rientra di pochissimo,
su 320px sborda molto: coerente con il "sborda un po'" osservato.

Stessa causa per il secondo problema: la pill è `rounded-full` su 28px di
altezza, cioè 14px di raggio, contro i 52px dell'header. Non sono "due raggi
scelti male", sono due forme senza alcuna relazione.

Nota collaterale: il `border-t border-border-subtle/50` della riga tab è a
larghezza piena e a `y=64` la sagoma inizia a `x≈1.4px`, quindi anche quella
linea sporge — di poco, ma è lo stesso difetto.

## Soluzione proposta

### 1. Raggio dell'header coerente con la sua forma

```tsx
// 9999px only makes sense while the header is a single row. On the ranking
// pages a second row of tabs makes it ~104px tall, where the clamped 52px
// corners curve away from the bottom edge and anything sitting there falls
// outside the shape.
const radiusTarget = isHome ? "9999px" : "28px";
const navRadius = useTransform(scrollY, [0, 100], ["0px", radiusTarget]);
```

Non è un cambio di linguaggio visivo: sulla homepage `9999px` su 80px di altezza
rende già 40px di raggio, e su `xl` (dove la riga tab è nascosta) l'header delle
classifiche è a riga singola, dove 28px e 40px sono indistinguibili a occhio.

### 2. La riga tab diventa un segmented control su un track rientrato

```tsx
<div className="xl:hidden px-3 pb-3">
  <nav className="flex items-center gap-0.5 rounded-full bg-surface-gray/60 p-1">
    …
  </nav>
</div>
```

- **Rientrato di 12px** su tre lati: con 28px di raggio l'angolo inferiore
  sinistro del track cade dentro la sagoma con margine
  (`√(16² + 16²) = 22.6 < 28`), quindi il problema non può ripresentarsi al
  variare della larghezza delle etichette o del viewport.
- **Il track ha il suo `rounded-full`**, quindi la pill attiva ha una forma in
  cui incastrarsi: la progressione dei raggi diventa 28px (header) → 18px
  (track) → 14px (pill), che è esattamente il nidificarsi di pill del design
  system invece di due raggi scorrelati.
- **Via il `border-t`**: il riempimento grigio del track separa le due righe
  meglio di una linea, e la linea a larghezza piena sporgeva anch'essa.
- `min-w-0` sulle tab, così `flex-1` può davvero distribuire lo spazio in parti
  uguali invece di fermarsi al min-content e far tracimare la riga.

### 3. Etichette

Con il track, tre etichette piene su uno schermo stretto sono al limite:
"Official Ranking" a `text-xs` misura ~91px di testo, e su un 360px lo spazio
per tab scende a ~96px. Sta dentro per pochi pixel, e su 320px non ci sta.
Due strade, da decidere:

- **Etichette corte solo nella tab bar mobile** — "Official" / "Live" / "Race",
  identiche in italiano e inglese (il dizionario italiano usa già i termini
  inglesi). Servono tre chiavi i18n nuove (`nav.app.officialShort`, `liveShort`,
  `raceShort`), come già si fa per `goToRankingsShort`. Sta comoda a ogni
  larghezza e il contesto "classifiche" è già dato dalla pagina.
- **Etichette piene a `text-[11px]`** con `px-1.5`: nessun cambio di contenuto,
  ma resta stretta sotto i ~380px e sotto i 320px le etichette si toccano.

## File toccati

- `src/components/layout/top-nav-bar.tsx`
- `src/lib/i18n/it.ts`, `en.ts` — solo se si scelgono le etichette corte.

Nessuna modifica a: header della homepage, riga logo/azioni, `SettingsPill`,
nav desktop `xl`, animazioni di scroll dell'header.

## Note di implementazione

Scelta l'opzione delle **etichette corte** ("Official" / "Live" / "Race"), con
tre chiavi nuove `nav.app.officialShort` / `liveShort` / `raceShort` e un campo
`shortText` in `APP_NAV_ITEMS`. Le etichette piene restano nella nav `xl`.

Un'aggiunta rispetto al piano: sulle tab mobili è stato messo
`aria-label={item.text(t)}`, così l'accorciamento è **solo visivo** e chi usa
uno screen reader continua a sentire "Official Ranking" invece di "Official".
Aggiunto anche `aria-current="page"` sulla tab attiva, che mancava. Questo
richiede `useTranslation` in `TopNavBar`, che prima non lo usava (le etichette
passavano tutte da `StableLabel`).

Geometria finale, con il track rientrato di 12px e 28px di raggio:

```
altezza header:  64 (riga logo) + 36 (track) + 12 (pb-3)  = 112px
angolo track:    √(16² + 16²) = 22.6  <  28   ✓ dentro la sagoma
angolo pill:     √(12² + 12²) = 17.0  <  28   ✓ dentro con margine
```

Spazio per tab su un viewport da 320px: `(288 − 24 − 8 − 4) / 3 ≈ 84px` contro i
~62px richiesti da "Official" a `text-xs` — comodo anche sul più stretto.

## Fuori scope

- La nav desktop (`xl`) e la sua `active-nav-pill`: lì l'header è a riga singola
  e il problema non esiste.
