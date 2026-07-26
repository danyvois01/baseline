/**
 * Italian dictionary — source of truth for the i18n shape.
 * Every user-facing string lives here; `en.ts` must mirror this shape
 * (enforced at compile time via the Dictionary type).
 */
export const it = {
  settings: {
    switchToDark: "Attiva il tema scuro",
    switchToLight: "Attiva il tema chiaro",
    switchLanguage: "Switch to English",
    targetLanguage: "EN",
  },
  nav: {
    home: {
      ranking: "Ranking",
      tournaments: "Tornei",
      season: "Stagione",
      scoring: "Punteggio",
      glossary: "Dizionario",
    },
    app: {
      official: "Official Ranking",
      live: "Live Ranking",
      race: "Race to Turin",
    },
    goToRankings: "Vai alle Classifiche",
    goToRankingsShort: "Classifiche",
    backToHome: "Torna alla Home",
    backToHomeShort: "Home",
  },
  footer: {
    terms: "Termini di Servizio",
    privacy: "Informativa sulla Privacy",
    support: "Contatta il Supporto",
    about: "Chi Siamo",
    copyright: "© 2026 Baseline Tennis. Tutti i diritti riservati.",
  },
  privacyPage: {
    title: "Informativa sulla Privacy",
    lastUpdated: "Ultimo aggiornamento: 26 luglio 2026",
    intro:
      "Questa pagina descrive quali dati vengono trattati quando visiti Baseline, come vengono utilizzati e quali diritti hai in merito.",
    sections: [
      {
        heading: "Titolare del trattamento",
        paragraphs: [
          "Il titolare del trattamento è il gestore di questo sito. Per qualsiasi domanda relativa a questa informativa o ai tuoi dati puoi scrivere a [EMAIL].",
        ],
      },
      {
        heading: "Dati trattati",
        paragraphs: [
          "Baseline non richiede registrazione e non raccoglie dati personali in modo attivo: non ci sono account, moduli di contatto né strumenti di tracciamento pubblicitario.",
          "Come per qualsiasi sito web, il provider di hosting (Vercel Inc.) tratta gli indirizzi IP dei visitatori nei log del server, per finalità di sicurezza e di corretta erogazione del servizio. Questi log sono conservati per un periodo limitato.",
        ],
      },
      {
        heading: "Preferenze salvate nel browser",
        paragraphs: [
          "Le tue preferenze di tema (chiaro/scuro) e lingua (IT/EN) vengono salvate esclusivamente nel localStorage del tuo browser. Si tratta di memorizzazione tecnica: questi dati non lasciano mai il tuo dispositivo, non vengono trasmessi a nessuno e non richiedono consenso. Puoi cancellarli in qualsiasi momento eliminando i dati di navigazione del browser.",
          "Baseline non utilizza cookie di profilazione né strumenti di analytics.",
        ],
      },
      {
        heading: "Servizi di terze parti",
        paragraphs: [
          "Il sito è ospitato su Vercel (Vercel Inc., USA), che agisce come responsabile del trattamento per i dati tecnici di connessione. Puoi consultare la loro informativa su vercel.com/legal/privacy-policy.",
        ],
      },
      {
        heading: "I tuoi diritti",
        paragraphs: [
          "Ai sensi del GDPR (Regolamento UE 2016/679) hai il diritto di accedere ai tuoi dati, chiederne la rettifica o la cancellazione, limitarne od opporti al trattamento, e proporre reclamo all'autorità di controllo (in Italia, il Garante per la Protezione dei Dati Personali). Per esercitare questi diritti puoi scrivere al contatto indicato sopra.",
        ],
      },
      {
        heading: "Modifiche a questa informativa",
        paragraphs: [
          "Eventuali modifiche a questa informativa saranno pubblicate su questa pagina, con aggiornamento della data indicata in alto.",
        ],
      },
    ],
  },
  aboutPage: {
    title: "Chi Siamo",
    intro:
      "Baseline è una piattaforma moderna per seguire le classifiche del tennis professionistico in tempo reale.",
    sections: [
      {
        heading: "Cos'è Baseline",
        paragraphs: [
          "Baseline nasce per rendere il ranking ATP semplice da capire e bello da consultare. Offre tre viste complementari: il ranking ufficiale aggiornato ogni settimana, il ranking live con le proiezioni punti basate sui tornei in corso, e la Race to Turin verso le ATP Finals.",
          "Il nome viene dalla linea di fondo campo — la baseline — il punto di partenza di ogni scambio: qui è il punto di partenza della tua conoscenza del tennis.",
        ],
      },
      {
        heading: "I dati",
        paragraphs: [
          "Le classifiche vengono elaborate a partire da fonti pubblicamente accessibili e aggiornate a intervalli regolari. I dati sono forniti a puro scopo informativo: per le classifiche ufficiali fa sempre fede il sito ATP.",
        ],
      },
    ],
    disclaimerTitle: "Disclaimer",
    disclaimerBody:
      "Baseline è un progetto indipendente e non è affiliato, approvato o sponsorizzato da ATP Tour, Inc. Tutti i marchi citati appartengono ai rispettivi proprietari. I dati pubblicati non sono ufficiali e sono forniti a solo scopo informativo.",
  },
  errors: {
    title: "Qualcosa è andato storto",
    genericBody:
      "Si è verificato un errore imprevisto. Il nostro team è stato avvisato. Riprova o torna alla homepage.",
    officialBody:
      "Non siamo riusciti a caricare il ranking ufficiale. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    liveBody:
      "Non siamo riusciti a caricare il ranking live. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    raceBody:
      "Non siamo riusciti a caricare la Race to Turin. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    tryAgain: "Riprova",
    homepage: "Homepage",
    errorId: "ID errore: ",
  },
  notFound: {
    title: "Pagina non trovata",
    body: "La pagina che cerchi non esiste o è stata spostata. Torna alla homepage.",
    backHome: "Torna a Baseline",
  },
  rankings: {
    shell: {
      searchPlaceholder: "Cerca giocatore...",
      filter: "Filtri",
      filtersHeading: "Filtri",
      reset: "Azzera",
      nationality: "Nazionalità",
      ageGroup: "Fascia d'età",
      selectNationality: "Seleziona nazionalità",
      selectAgeGroup: "Seleziona fascia d'età",
      allNationalities: "Tutte le nazionalità",
      allAges: "Tutte le età",
      under21: "Under 21",
      age21to25: "21 - 25",
      age26to30: "26 - 30",
      over30: "Over 30",
      updated: "Aggiornato: ",
    },
    table: {
      rank: "#",
      move: "Mov.",
      player: "Giocatore",
      liveStatus: "Stato Live",
      points: "Punti",
      diff: "+/-",
      nextWeek: "Pross. Sett.",
      status: "Stato",
    },
    pagination: {
      showAll: "Mostra tutti i giocatori",
      showTop: (n: number) => `Mostra Top ${n}`,
    },
    expandedCard: {
      careerHigh: "Best Ranking",
      projNext: "Proi. Prossima",
      projMax: "Proi. Max",
      officialPoints: "Punti Ufficiali",
      pts: "pt",
      winsNextMatch: "Se vince il prossimo match",
      titleWin: "Se vince il torneo",
      atpVerified: "Verificato ATP",
    },
    liveStatus: {
      active: "In gara",
      out: "Eliminato",
    },
    race: {
      turinCut: "Taglio Torino",
      qualified: "Qualificato",
      inContention: "In corsa",
      qualifiedPlayers: "Giocatori qualificati",
      cutoffProjection: "Proiezione del taglio",
      cutoffCaption: "Punti stimati necessari per qualificarsi",
      showFullRace: "Mostra tutta la Race",
    },
    pages: {
      officialTitle: "Official ATP Rankings",
      officialSubtitle:
        "Il ranking ufficiale ATP di singolare, aggiornato ogni settimana.",
      liveTitle: "Live ATP Rankings",
      liveSubtitle:
        "Proiezioni punti in tempo reale basate sui tornei in corso.",
      raceTitle: "Race to Turin",
      raceSubtitle:
        "I migliori 8 giocatori dell'anno solare si qualificano per le prestigiose Finals di Torino.",
    },
  },
  home: {
    sections: {
      intro: "Intro",
      ranking: "Ranking",
      tournaments: "Tornei",
      season: "Stagione",
      scoring: "Punteggio",
      glossary: "Dizionario",
      navAriaLabel: "Navigazione sezioni",
      goTo: (label: string) => `Vai a ${label}`,
    },
    scrollCue: {
      defaultLabel: "Continua",
      ariaNext: (label: string) => `Vai alla sezione successiva: ${label}`,
    },
    hero: {
      subtitle: "La Linea Di Fondo",
      lead: "La linea di fondo campo è il punto di partenza di ogni scambio. Qui su Baseline, è anche il fondamento della tua conoscenza del tennis professionistico.",
      scrollLabel: "Scopri",
    },
    ranking: {
      title: "Il Ranking",
      lead: 'Il tennis è l\'unico sport globale che dura 11 mesi l\'anno. Non esiste una "stagione regolare": esiste solo il ranking mondiale, una classifica viva che cambia ogni lunedì.',
      scrollLabel: "I Tornei",
      highlights: [
        {
          value: "19",
          label: "I Migliori Risultati",
          desc: "Vengono sommati solo i tuoi migliori piazzamenti stagionali.",
        },
        {
          value: "52",
          label: "Settimane",
          desc: "La “finestra” mobile del ranking. Calcolata sull’ultimo anno.",
        },
        {
          value: "Zero",
          label: "Nessun Azzeramento",
          desc: "La classifica non si azzera mai a gennaio: è una corsa continua.",
        },
        {
          value: "Scadenza",
          label: "Difesa dei punti",
          desc: "Ogni risultato “scade” dopo un anno. Devi tornare a vincere.",
        },
      ],
    },
    pyramid: {
      title: "La Piramide dei Tornei",
      lead: "Non tutti i tornei sono uguali",
      intro1:
        "I tornei sono divisi in categorie ben precise, che determinano il prestigio, la difficoltà e, ovviamente, i punti in palio. Più si sale verso il vertice della piramide, maggiore è la gloria.",
      intro2BeforeSlam: "I più importanti in assoluto sono i ",
      intro2AfterSlam:
        " (2000 punti al vincitore), seguiti dai Masters 1000, dagli ATP 500 e 250. La stagione culmina con le ",
      intro2AfterFinals: ", riservate ai migliori 8 dell'anno.",
      pointsToWinner: "Punti al vincitore:",
      exploreLabel: "Esplora la piramide",
      exploreAria: "Scorri alla piramide grafica",
      scrollNext: "La Stagione",
      tiers: [
        {
          name: "ATP Finals",
          tagline: "La punta della piramide",
          description:
            "Riservato solamente ai migliori 8 giocatori della stagione. È l'unico torneo con una spettacolare fase iniziale a gironi (Round Robin) prima delle semifinali a eliminazione diretta.",
        },
        {
          name: "Grand Slam",
          tagline: "I quattro pilastri storici",
          description:
            "Australian Open, Roland Garros, Wimbledon e US Open. I tornei più antichi, prestigiosi e fisicamente brutali: sono gli unici dove si gioca al meglio dei 5 set.",
        },
        {
          name: "Masters 1000",
          tagline: "L'élite del tour",
          description:
            "Nove appuntamenti obbligatori sparsi nel mondo, appena un gradino sotto gli Slam per importanza. Vincerne uno significa entrare nell'élite.",
        },
        {
          name: "ATP 500",
          tagline: "L'alto livello",
          description:
            "Tredici tornei di grande importanza. Cruciali per consolidare la propria posizione in Top 20 o per accumulare punti preziosi.",
        },
        {
          name: "ATP 250",
          tagline: "La base del circuito maggiore",
          description:
            "L'ossatura del circuito. Decine di tornei in tutto il mondo ogni settimana, occasioni preziose per emergere e far debuttare i giovani talenti.",
        },
        {
          name: "Challenger & ITF",
          tagline: "Il trampolino di lancio",
          description:
            "Le leghe minori. Il trampolino di lancio essenziale per i giovani tennisti e per chi cerca di accumulare i primi punti.",
        },
      ],
    },
    timeline: {
      title: "Un anno di Tennis",
      lead: "La stagione tennistica dura circa 11 mesi e segue l'estate in giro per il mondo, cambiando superficie di gioco.",
      scrollNext: "Il Punteggio",
      surfaces: {
        hard: "Cemento",
        clay: "Terra Rossa",
        grass: "Erba",
        indoor: "Indoor",
      },
      events: [
        {
          period: "Gennaio",
          title: "Stagione Australiana",
          highlight: "Australian Open",
          description:
            "L'apertura della stagione sul cemento all'aperto, culminante con il primo Slam dell'anno a Melbourne.",
        },
        {
          period: "Marzo",
          title: "Sunshine Double",
          highlight: "Indian Wells & Miami",
          description:
            "I primi due Masters 1000 della stagione nel deserto californiano e in Florida.",
        },
        {
          period: "Aprile—Maggio",
          title: "La Terra Rossa Europea",
          highlight: "Roland Garros",
          description:
            "La grande stagione sul rosso con i Masters 1000 di Monte Carlo, Madrid e Roma, prima dello Slam di Parigi.",
        },
        {
          period: "Giugno—Luglio",
          title: "Stagione sull'Erba",
          highlight: "Wimbledon",
          description:
            "Il prestigioso e brevissimo swing sui prati inglesi che culmina nel Tempio di Londra.",
        },
        {
          period: "Agosto—Settembre",
          title: "Summer Hardcourt Swing",
          highlight: "US Open",
          description:
            "La corsa sul cemento nordamericano con i Masters 1000 del Canada e Cincinnati, che lancia l'ultimo Slam a New York.",
        },
        {
          period: "Ottobre—Novembre",
          title: "Asian Tour & Indoor Finals",
          highlight: "ATP Finals",
          description:
            "Il Masters 1000 di Shanghai, l'ultimo 1000 indoor a Parigi-Bercy e la resa dei conti tra i migliori 8 a Torino.",
        },
      ],
    },
    scoring: {
      title: "Il Punteggio",
      lead: "Game, Set, Match: il sistema di punteggio del tennis, spiegato con un tabellone interattivo.",
      scrollNext: "Il Dizionario",
      curiosityLabel: "Curiosità",
      you: "Tu",
      opponent: "Avversario",
      replay: "Rigioca",
      plusOneGame: "+1 Game",
      clickHint: "+ Clicca",
      chapters: [
        {
          title: "Game, Set, Match: Come si gioca?",
          content:
            "Il tennis ha un sistema di punteggio storico. Una partita è divisa in Set, che a loro volta sono divisi in Game.",
          curiosity:
            "Il sistema di punteggio all'interno del game è nato probabilmente guardando i quadranti dell'orologio, ed è per questo che incrementa in questo modo bizzarro (15, 30, 40).",
        },
        {
          title: "Deuce & Vantaggi",
          content:
            'Se entrambi i giocatori arrivano a 40, si va in "Deuce" (Parità). Da qui in poi, per vincere il game serve conquistare due punti consecutivi. Il primo dà il "Vantaggio" (Ad); se si vince anche il secondo, è Game. Se si perde, si torna in parità.',
          curiosity: "",
        },
        {
          title: "Il Set",
          content:
            'Per vincere un Set bisogna conquistare 6 Game, mantenendo almeno due game di scarto (es. 6-4 o 6-3). Sul punteggio di 5-5, si prosegue fino a 7 (es. 7-5). Nei tornei normali vince la partita chi fa per primo 2 Set ("Al meglio dei 3"). Negli Slam maschili vince chi ne fa 3 ("Al meglio dei 5").',
          curiosity: "",
        },
        {
          title: "Il Tie-Break",
          content:
            "Sul punteggio di 6-6, si gioca il Tie-Break: un game speciale dove i punti si contano numericamente (1, 2, 3...). Vince il set chi arriva a 7 punti per primo, sempre con almeno due punti di scarto.",
          curiosity: "",
        },
      ],
      badges: {
        gameYouWin: "Hai vinto il game!",
        gameOpponentWins: "L'avversario vince il game!",
        advantageYou: "Vantaggio: Tu",
        advantageOpponent: "Vantaggio: Avversario",
        deuceClick: "Deuce: Clicca per il vantaggio",
        deuce: "Parità (Deuce)",
        gameIdle: "Il Game: Clicca per giocare",
        setYouWin: "Hai vinto il Set!",
        setOpponentWins: "L'avversario vince il Set!",
        setTiebreak: "Tie-Break! (6-6)",
        setIdle: "Il Set: Vinci 6 Game",
        tiebreakYouWin: "Hai vinto poi il set! (7-6)",
        tiebreakOpponentWins: "L'avversario vince il set (7-6)",
        tiebreakIdle: "Tie-Break: Arriva a 7 punti",
      },
    },
    glossary: {
      scrollNext: "Le Classifiche",
      title: "Parla come un Pro",
      lead: "I telecronisti parlano spesso in codice. Ecco le parole chiave per seguire una partita senza perderti neanche un punto.",
      prevCard: "Carta precedente",
      nextCard: "Prossima carta",
      swipeHint: "← Swipe →",
      terms: [
        {
          term: "ACE",
          def: "Un servizio vincente perfetto, su cui l'avversario non riesce nemmeno a mettere la racchetta.",
        },
        {
          term: "BREAK",
          def: 'Vincere un game in cui a servire era l\'avversario. Poiché chi batte ha un grosso vantaggio, "strappare il servizio" è la chiave per vincere.',
        },
        {
          term: "BASELINE",
          def: "La linea di fondo campo. Il nostro nome. È da dove si batte e dove si scambiano la maggior parte dei colpi nel tennis moderno.",
        },
        {
          term: "LET",
          def: 'Quando il servizio tocca il nastro della rete ma cade comunque nel rettangolo corretto. Il giudice chiama "Let!" e la battuta si ripete senza penalità.',
        },
        {
          term: "DOUBLE FAULT",
          def: "Chi batte ha due possibilità per mettere in campo il servizio. Se le sbaglia entrambe, perde il punto.",
        },
        {
          term: "DROP SHOT",
          def: "Un colpo \"smorzato\" che fa rimbalzare la palla appena oltre la rete, costringendo l'avversario a una corsa disperata in avanti.",
        },
        {
          term: "LOB",
          def: "Un colpo alto e arcuato, usato per scavalcare l'avversario quando questo si è avvicinato troppo alla rete.",
        },
        {
          term: "PASSANTE",
          def: "Il colpo con cui si supera lateralmente l'avversario che è sceso a rete. Può essere giocato in diagonale (cross) o lungo la linea (lungolinea).",
        },
        {
          term: "WINNER",
          def: "Un colpo talmente potente, preciso o improvviso che l'avversario non riesce nemmeno a toccare con la racchetta prima del secondo rimbalzo.",
        },
        {
          term: "UNFORCED ERROR",
          def: "L'incubo di ogni tennista. È un errore commesso su una palla comoda, senza che l'avversario abbia fatto nulla per mettere in difficoltà chi colpisce.",
        },
        {
          term: "TOP SPIN",
          def: "La rotazione dal basso verso l'alto impressa alla pallina. La fa viaggiare alta sopra la rete per poi farla scendere rapidamente, facendola rimbalzare alta e profonda. È la base del tennis moderno.",
        },
        {
          term: "VOLLEY",
          def: "Il colpo al volo, eseguito prima che la palla tocchi terra, solitamente quando ci si trova nei pressi della rete per chiudere il punto.",
        },
        {
          term: "SMASH",
          def: "La schiacciata. Un colpo violento eseguito sopra la testa, quasi sempre in risposta a un lob corto dell'avversario. È l'equivalente della schiacciata nella pallavolo.",
        },
        {
          term: "SLICE",
          def: "La rotazione contraria al Top Spin, dall'alto verso il basso. La pallina rimane bassissima dopo il rimbalzo, costringendo l'avversario a piegare le gambe fino a terra per colpire.",
        },
        {
          term: "SERVE & VOLLEY",
          def: "Una tattica aggressiva e spettacolare. Subito dopo aver battuto, il giocatore corre verso la rete per chiudere il punto al volo, togliendo tempo all'avversario.",
        },
      ],
    },
    cta: {
      badge: "Entra nel Tour",
      titleLine1: "Pronto a seguire",
      titleLine2: "l'azione?",
      body: "Ora che conosci le basi e i segreti del circuito, sei pronto a tuffarti nella stagione. Esplora le classifiche aggiornate.",
      button: "Esplora i Live Rankings",
    },
  },
};

/**
 * Widens literal string types to `string` (and function-valued entries to
 * their signature) so `en.ts` can hold different text with the same shape.
 */
type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : DeepString<T[K]>;
};

export type Dictionary = DeepString<typeof it>;
