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
  },
  footer: {
    terms: "Termini di Servizio",
    privacy: "Informativa sulla Privacy",
    support: "Contatta il Supporto",
    about: "Chi Siamo",
    copyright: "© 2026 Baseline Tennis. Tutti i diritti riservati.",
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
