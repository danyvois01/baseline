# Implementazione Filtri (Nazionalità ed Età) - Official Rankings

## Obiettivo
Rendere funzionante il pulsante "Filter" nella pagina Official Rankings, consentendo agli utenti di filtrare i giocatori in base a:
- **Nazionalità** (estratta dinamicamente dalla lista dei giocatori).
- **Età** (utilizzando fasce d'età predefinite, es. "Under 21", "21-25", "26-30", "Over 30").

## Dettagli Tecnici

### 1. Gestione dello Stato in `OfficialClient`
Aggiungeremo i seguenti stati all'interno di `src/app/official/official-client.tsx`:
- `isFilterOpen`: booleano per gestire l'apertura/chiusura del pannello dei filtri.
- `nationalityFilter`: stringa (default: "All") per la nazionalità selezionata.
- `ageFilter`: stringa (default: "All") per la fascia d'età selezionata.

### 2. Logica di Filtraggio
Il filtro esistente (`filteredRankings`) verrà espanso per includere le nuove condizioni:
```typescript
const matchesNat = nationalityFilter === "All" || entry.player.nationality === nationalityFilter;

let matchesAge = true;
if (ageFilter === "Under 21") matchesAge = entry.player.age < 21;
else if (ageFilter === "21-25") matchesAge = entry.player.age >= 21 && entry.player.age <= 25;
else if (ageFilter === "26-30") matchesAge = entry.player.age >= 26 && entry.player.age <= 30;
else if (ageFilter === "Over 30") matchesAge = entry.player.age > 30;
```

### 3. Interfaccia Utente (UI)
- Il pulsante "Filter" funzionerà come un *toggle*.
- Al clic, verrà mostrato un pannello "popover" (un `div` in posizione assoluta) sotto il pulsante.
- Il pannello conterrà due menù a tendina nativi (o dei selettori customizzati) per "Nazionalità" ed "Età", più un pulsantino rapido per "Resetta filtri".
- Lo stile del pannello seguirà le linee guida del progetto (sfondo bianco, bordi tenui `border-border-subtle`, arrotondamento `rounded-2xl` o `rounded-xl`, ombra morbida `shadow-ambient`).

## Domande o Punti da Approvare
Il pannello custom è sufficiente, o si preferisce installare una componente `Popover` / `Select` di Shadcn tramite CLI? Per mantenere il progetto leggero, ho pianificato di creare un pannello con HTML nativo e Tailwind.

Attendiamo approvazione per procedere con l'implementazione in `src/app/official/official-client.tsx`.
