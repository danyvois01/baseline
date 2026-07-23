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
  footer: {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    support: "Contact Support",
    about: "About Us",
    copyright: "© 2026 Baseline Tennis. All rights reserved.",
  },
  errors: {
    title: "Something went wrong",
    genericBody:
      "An unexpected error occurred. Our team has been notified. You can try again or head back to the homepage.",
    officialBody:
      "We couldn't load the official rankings. This may be a temporary issue with our data source. Please try again.",
    liveBody:
      "We couldn't load the live rankings. This may be a temporary issue with our data source. Please try again.",
    raceBody:
      "We couldn't load the Race to Turin standings. This may be a temporary issue with our data source. Please try again.",
    tryAgain: "Try Again",
    homepage: "Homepage",
    errorId: "Error ID: ",
  },
  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist or may have been moved. Try heading back to the homepage.",
    backHome: "Back to Baseline",
  },
  rankings: {
    shell: {
      searchPlaceholder: "Search player...",
      filter: "Filter",
      filtersHeading: "Filters",
      reset: "Reset",
      nationality: "Nationality",
      ageGroup: "Age Group",
      selectNationality: "Select nationality",
      selectAgeGroup: "Select age group",
      allNationalities: "All Nationalities",
      allAges: "All Ages",
      under21: "Under 21",
      age21to25: "21 - 25",
      age26to30: "26 - 30",
      over30: "Over 30",
      updated: "Updated: ",
    },
    table: {
      rank: "#",
      move: "Move",
      player: "Player",
      liveStatus: "Live Status",
      points: "Points",
      diff: "+/-",
      nextWeek: "Next Week",
      status: "Status",
    },
    pagination: {
      showAll: "Show All Players",
      showTop: (n: number) => `Show Top ${n}`,
    },
    expandedCard: {
      careerHigh: "Career High",
      projNext: "Proj. Next",
      projMax: "Proj. Max",
      officialPoints: "Official Points",
      pts: "pts",
      winsNextMatch: "Wins next match",
      titleWin: "Title win",
      atpVerified: "ATP verified",
    },
    liveStatus: {
      active: "Active",
      out: "Out",
    },
    race: {
      turinCut: "Turin Cut",
      qualified: "Qualified",
      inContention: "In Contention",
      qualifiedPlayers: "Qualified Players",
      cutoffProjection: "Cut-off Projection",
      cutoffCaption: "Estimated points required to qualify",
      showFullRace: "Show Full Race",
    },
    pages: {
      officialTitle: "Official ATP Rankings",
      officialSubtitle: "The official weekly ATP Tour singles rankings.",
      liveTitle: "Live ATP Rankings",
      liveSubtitle:
        "Real-time point projections based on ongoing tournament results.",
      raceTitle: "Race to Turin",
      raceSubtitle:
        "The top 8 singles players of the calendar year qualify for the prestigious season finale in Turin, Italy.",
    },
  },
};
