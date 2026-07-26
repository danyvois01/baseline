# Estensione Filtri e Ricerca (Live Rankings)

## Obiettivo
Replicare le funzionalità di filtraggio (ricerca testo, nazionalità, fascia d'età) appena implementate per la pagina "Official Rankings" anche sulla pagina "Live Rankings" (`src/app/live/page.tsx`).

## Dettagli Tecnici

### 1. Creazione del Client Component (`src/app/live/live-client.tsx`)
Come fatto per la pagina Official, creeremo un componente client `LiveClient` che riceverà in input i dati iniziali (`MOCK_LIVE_RANKINGS`).
- Conterrà gli stati React per la barra di ricerca, il filtro nazionalità e il filtro età.
- Manterrà lo stesso design premium e stili di Shadcn UI (`Popover` e `Select`) già testati e approvati.
- La logica di filtraggio sarà identica (i modelli dati dei giocatori tra live e official sono compatibili).

### 2. Aggiornamento `src/app/live/page.tsx`
- La pagina principale rimarrà un Server Component (per preservare i `metadata`).
- Verrà sostituita la chiamata statica a `<RankingsTable>` con il nuovo `<LiveClient initialRankings={MOCK_LIVE_RANKINGS} />`.
- Il layout e l'intestazione (con l'indicatore "Live Updates Active") verranno spostati nel Client Component in modo da poter posizionare correttamente i controlli interattivi (la barra di ricerca e il pulsante filtro).

## Domande o Punti da Approvare
L'intervento è una replica diretta di un comportamento già approvato, applicato al contesto Live. 
Attendo la conferma per procedere con la scrittura del codice.
