# Mobile — allineamento toolbar Ricerca / Filtri

Data: 2026-08-23
Stato: **approvato e implementato**

## Problema

Su smartphone (screenshot utente, pagina Race to Turin) la barra strumenti
delle classifiche mostra il campo "Cerca giocatore" allineato a destra su una
riga e il bottone "Filtri" a capo, allineato a sinistra. I due controlli
sembrano scollegati e sprecano due righe verticali.

Causa: in `src/components/rankings/ranking-page-shell.tsx` il `toolbar` è un
unico contenitore `flex flex-wrap` con uno spacer `<div className="ml-auto" />`
che spinge ricerca + filtro a destra. Sotto i ~640px i due controlli non stanno
sulla stessa riga: il wrap li separa e lo spacer applica l'allineamento a destra
solo al primo dei due.

Il toolbar è condiviso: la correzione vale per Official, Live e Race.

## Soluzione proposta

Raggruppare ricerca e filtro in un **unico blocco flex** che su mobile occupa
tutta la larghezza, con l'input elastico e il bottone a larghezza intrinseca.
Da `md:` in su il comportamento attuale (badge a sinistra, controlli a destra)
resta identico.

### Modifiche a `src/components/rankings/ranking-page-shell.tsx`

1. **Contenitore toolbar**: da `flex flex-wrap items-center gap-3` a
   `flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center`.
   Su mobile il badge "Aggiornato" (già `hidden md:flex`) non incide.
2. **Spacer**: `ml-auto` → `md:ml-auto` (nessun effetto in colonna).
3. **Nuovo wrapper** attorno a ricerca + popover filtri:
   `flex items-center gap-2 md:gap-3` — così sono sempre sulla stessa riga e
   condividono la stessa baseline.
4. **Input ricerca**: wrapper `relative flex-1 min-w-0`, input
   `w-full md:w-48 lg:w-56` (rimosso `w-40` fisso) così su mobile si allarga
   fino allo spazio disponibile.
5. **Trigger Filtri**: aggiunto `shrink-0` e, su mobile, padding leggermente
   ridotto (`px-4 md:px-5`) per lasciare più spazio all'input.

Nessuna modifica a logica, hook `use-ranking-filters`, i18n o markup del
popover. Nessun nuovo componente, nessuna dipendenza.

### Risultato atteso (mobile)

```
┌───────────────────────────────────────────┐
│ [ 🔍 Cerca giocatore............ ] [ ⚙ Filtri ] │
└───────────────────────────────────────────┘
```

Una sola riga, controlli allineati verticalmente, larghezza piena del widget.
Desktop invariato.

## Fuori scope

- Header/nav sticky che copre il contenuto nello screenshot.
- Layout delle righe giocatore e badge "Eliminato".
- Mostrare il badge "Aggiornato" su mobile.

Se vuoi che affronti anche uno di questi punti, dimmelo e apro un doc separato.
