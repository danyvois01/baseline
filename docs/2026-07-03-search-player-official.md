# Implementazione Ricerca Giocatore (Official Rankings)

## Obiettivo
Aggiungere un campo di ricerca (Search input) nella pagina delle classifiche ufficiali (Official Rankings), posizionato a sinistra del pulsante "Filter", per permettere agli utenti di filtrare in tempo reale la tabella in base al nome del giocatore.

## Dettagli Tecnici

### 1. Creazione del Client Component (`src/app/official/official-client.tsx`)
Dato che il filtraggio richiede stato interattivo (gestito tramite `useState`) e la pagina principale `src/app/official/page.tsx` è un Server Component (in quanto esporta i `metadata`), dobbiamo estrarre il contenuto principale della pagina in un Client Component dedicato.

Questo nuovo componente:
- Riceverà `initialRankings` (es. `MOCK_OFFICIAL_RANKINGS`) come prop.
- Gestirà lo stato `searchQuery` tramite un hook `useState`.
- Conterrà l'input di ricerca posizionato prima del pulsante "Filter", con un'icona di ricerca (tramite `lucide-react`).
- Applicherà il filtro sui dati in base alla stringa immessa (`searchQuery`) prima di passarli a `OfficialTable`.

### 2. Aggiornamento di `src/app/official/page.tsx`
- Si modificherà la pagina per importare e utilizzare `OfficialClient`.
- Il layout e la struttura (TopNavBar, `<main>`, Footer) rimarranno in questo file, delegando il rendering interno (titolo, filtri e tabella) al nuovo componente client-side per mantenere una netta separazione tra Server e Client.

### 3. Stile
- Il campo di ricerca riprenderà lo stile coerente del progetto (bordi `border-border-subtle`, arrotondamento `rounded-full` tipo pill-shaped come da regole, testo `text-sm`, hover e focus personalizzati per allinearsi allo standard visuale "Baseline").

## Domande o Punti da Approvare
Tutto l'intervento è puramente di frontend (React state + UI). Attendiamo l'approvazione per procedere con l'implementazione del codice su questi due file.
