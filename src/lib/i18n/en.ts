import type { Dictionary } from "./it";

/** English dictionary — shape checked against the Italian source of truth. */
export const en: Dictionary = {
  settings: {
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
    switchLanguage: "Passa all'italiano",
    targetLanguage: "IT",
  },
  nav: {
    home: {
      ranking: "Ranking",
      tournaments: "Tournaments",
      season: "Season",
      scoring: "Scoring",
      glossary: "Glossary",
    },
    app: {
      official: "Official Ranking",
      live: "Live Ranking",
      race: "Race to Turin",
    },
    goToRankings: "Go to Rankings",
    goToRankingsShort: "Rankings",
    backToHome: "Back to Home",
  },
};
