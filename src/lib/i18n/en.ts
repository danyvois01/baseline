import type { Dictionary } from "./it";

/** English dictionary — shape checked against the Italian source of truth. */
export const en: Dictionary = {
  settings: {
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
    languageGroup: "Language",
    switchToLocale: {
      it: "Switch to Italian",
      en: "Switch to English",
    },
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
    backToHomeShort: "Home",
  },
  footer: {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    support: "Contact Support",
    about: "About Us",
    copyright: "© 2026 Baseline Tennis. All rights reserved.",
  },
  privacyPage: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: July 26, 2026",
    intro:
      "This page explains what data is processed when you visit Baseline, how it is used, and what rights you have.",
    sections: [
      {
        heading: "Data controller",
        paragraphs: [
          "The data controller is the operator of this website. For any questions about this policy or your data, you can write to baselinetennis.info@gmail.com.",
        ],
      },
      {
        heading: "Data we process",
        paragraphs: [
          "Baseline does not require registration and does not actively collect personal data: there are no accounts, contact forms, or advertising trackers.",
          "As with any website, the hosting provider (Vercel Inc.) processes visitors' IP addresses in server logs for security purposes and to properly deliver the service. These logs are retained for a limited period.",
        ],
      },
      {
        heading: "Preferences stored in your browser",
        paragraphs: [
          "Your theme (light/dark) and language (IT/EN) preferences are stored exclusively in your browser's localStorage. This is technical storage: the data never leaves your device, is not transmitted to anyone, and does not require consent. You can delete it at any time by clearing your browser data.",
          "Baseline does not use profiling cookies or analytics tools.",
        ],
      },
      {
        heading: "Third-party services",
        paragraphs: [
          "The site is hosted on Vercel (Vercel Inc., USA), which acts as a data processor for technical connection data. You can read their policy at vercel.com/legal/privacy-policy.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under the GDPR (EU Regulation 2016/679) you have the right to access your data, request its rectification or erasure, restrict or object to its processing, and lodge a complaint with a supervisory authority (in Italy, the Garante per la Protezione dei Dati Personali). To exercise these rights, write to the contact listed above.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: [
          "Any changes to this policy will be published on this page, updating the date shown at the top.",
        ],
      },
    ],
  },
  aboutPage: {
    title: "About Us",
    intro:
      "Baseline is a modern platform for following professional tennis rankings in real time.",
    sections: [
      {
        heading: "What is Baseline",
        paragraphs: [
          "Baseline was created to make the ATP ranking easy to understand and a pleasure to browse. It offers three complementary views: the official ranking updated every week, the live ranking with point projections based on ongoing tournaments, and the Race to Turin towards the ATP Finals.",
          "The name comes from the baseline, the line at the back of the court where every rally starts: here, it's where your tennis knowledge starts.",
        ],
      },
      {
        heading: "The data",
        paragraphs: [
          "Rankings are computed from publicly accessible sources and refreshed at regular intervals. Data is provided for informational purposes only: for official rankings, the ATP website is always the authoritative source.",
        ],
      },
    ],
    disclaimerTitle: "Disclaimer",
    disclaimerBody:
      "Baseline is an independent project and is not affiliated with, endorsed by, or sponsored by ATP Tour, Inc. All trademarks mentioned belong to their respective owners. Published data is unofficial and provided for informational purposes only.",
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
      microLabel: "ATP Tour — Rankings",
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
      notPlaying: "Not playing",
    },
    race: {
      qualificationLine: "Qualification Line",
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
        "The top 8 singles players of the calendar year qualify for the prestigious Finals in Turin.",
    },
  },
  home: {
    sections: {
      intro: "Intro",
      ranking: "Ranking",
      tournaments: "Tournaments",
      season: "Season",
      scoring: "Scoring",
      glossary: "Glossary",
      navAriaLabel: "Section navigation",
      goTo: (label: string) => `Go to ${label}`,
    },
    scrollCue: {
      defaultLabel: "Continue",
      ariaNext: (label: string) => `Go to the next section: ${label}`,
    },
    hero: {
      subtitle: "From The Basics",
      lead: "The baseline is where every rally begins. Here at Baseline, it's also the foundation of your knowledge of professional tennis.",
      scrollLabel: "Discover",
    },
    ranking: {
      title: "The Ranking",
      lead: 'Tennis is the only global sport that runs 11 months a year. There is no "regular season": there is only the world ranking, a living leaderboard that changes every Monday.',
      scrollLabel: "Tournaments",
      highlights: [
        {
          value: "19",
          label: "Best Results",
          desc: "Only a player's 19 best results of the season are added together.",
        },
        {
          value: "52",
          label: "Weeks",
          desc: "The rolling ranking “window”, calculated over the past 52 weeks.",
        },
        {
          value: "Zero",
          label: "No Reset",
          desc: "The ranking never resets in January: it's a continuous race.",
        },
        {
          value: "Expiry",
          label: "Defending points",
          desc: "Every result “expires” after one year: keeping the points means winning again.",
        },
      ],
    },
    pyramid: {
      title: "The Tournament Pyramid",
      lead: "Not all tournaments are equal",
      intro1:
        "Tournaments are divided into precise categories that determine prestige, difficulty and, of course, the points at stake. The higher you climb the pyramid, the greater the glory.",
      intro2BeforeSlam: "The most important of all are the ",
      intro2AfterSlam:
        " (2000 points to the winner), followed by the Masters 1000s, the ATP 500s and 250s. The season culminates with the ",
      intro2AfterFinals: ", reserved for the year's best 8 players.",
      curiosity:
        "Fun fact: the tournament number (1000, 500, 250) is the number of points the winner earns! At the Slams and the Finals, however, the rules change.",
      pointsToWinner: "Points to the winner:",
      exploreLabel: "Explore the pyramid",
      exploreAria: "Scroll to the pyramid graphic",
      scrollNext: "The Season",
      tiers: [
        {
          name: "ATP Finals",
          tagline: "The top of the pyramid",
          description:
            "Reserved for the season's best 8 players only. It is the only tournament with a spectacular round-robin group stage before the knockout semifinals.",
        },
        {
          name: "Grand Slam",
          tagline: "The four historic pillars",
          description:
            "Australian Open, Roland Garros, Wimbledon and US Open. The oldest, most prestigious and physically brutal tournaments: the only ones played best of 5 sets.",
        },
        {
          name: "Masters 1000",
          tagline: "The tour's elite",
          description:
            "Nine mandatory events around the world, just one step below the Slams in importance. Winning one means joining the elite.",
        },
        {
          name: "ATP 500",
          tagline: "The upper tier",
          description:
            "Thirteen tournaments of great importance. Crucial for consolidating a Top 20 position or collecting precious points.",
        },
        {
          name: "ATP 250",
          tagline: "The base of the main tour",
          description:
            "The backbone of the circuit. Dozens of tournaments around the world every week — precious opportunities to emerge and for young talents to debut.",
        },
        {
          name: "Challenger & ITF",
          tagline: "The launching pad",
          description:
            "The minor leagues. The essential springboard for young players and for anyone chasing their first ranking points.",
        },
      ],
    },
    timeline: {
      title: "A Year of Tennis",
      lead: "The tennis season lasts about 11 months and follows the summer around the world, changing playing surface.",
      scrollNext: "Scoring",
      surfaces: {
        hard: "Hard",
        clay: "Clay",
        grass: "Grass",
        indoor: "Indoor",
      },
      events: [
        {
          period: "January",
          title: "Australian Season",
          highlight: "Australian Open",
          description:
            "The season opener on outdoor hard courts, culminating in the first Slam of the year in Melbourne.",
        },
        {
          period: "March",
          title: "Sunshine Double",
          highlight: "Indian Wells & Miami",
          description:
            "The first two Masters 1000s of the season, in the Californian desert and in Florida.",
        },
        {
          period: "April-May",
          title: "The European Clay Swing",
          highlight: "Roland Garros",
          description:
            "The great clay season with the Monte Carlo, Madrid and Rome Masters 1000s, leading up to the Paris Slam.",
        },
        {
          period: "June-July",
          title: "Grass Season",
          highlight: "Wimbledon",
          description:
            "The prestigious, ultra-short swing on English lawns that culminates at the Temple of London.",
        },
        {
          period: "August-September",
          title: "Summer Hardcourt Swing",
          highlight: "US Open",
          description:
            "The North American hard-court run with the Canada and Cincinnati Masters 1000s, launching the last Slam in New York.",
        },
        {
          period: "October-November",
          title: "Asian Tour & Indoor Finals",
          highlight: "ATP Finals",
          description:
            "The Shanghai Masters 1000, the last indoor 1000 in Paris-Bercy, and the final showdown between the best 8 in Turin.",
        },
      ],
    },
    scoring: {
      title: "Scoring",
      lead: "Game, Set, Match: tennis's scoring system, explained with an interactive scoreboard.",
      scrollNext: "The Glossary",
      curiosityLabel: "Fun fact",
      you: "You",
      opponent: "Opponent",
      replay: "Replay",
      plusOneGame: "+1 Game",
      clickHint: "+ Click",
      chapters: [
        {
          title: "Game, Set, Match: How is it played?",
          content:
            "Tennis has a historic scoring system. A match is divided into Sets, which in turn are divided into Games.",
          curiosity:
            "The scoring system within a game was probably born from clock faces, which is why it increments in this peculiar way (15, 30, 40).",
        },
        {
          title: "Deuce & Advantages",
          content:
            'If both players reach 40, the game goes to "Deuce". From then on, winning the game requires two consecutive points. The first gives the "Advantage" (Ad); winning the second one wins the Game. Lose it, and the score returns to deuce.',
          curiosity: "",
        },
        {
          title: "The Set",
          content:
            'To win a Set you must take 6 Games with a margin of at least two (e.g. 6-4 or 6-3). At 5-5, play continues to 7 (e.g. 7-5). In regular tournaments, the first to win 2 Sets takes the match ("best of 3"). In men\'s Slams it takes 3 ("best of 5").',
          curiosity: "",
        },
        {
          title: "The Tie-Break",
          content:
            "At 6-6, a Tie-Break is played: a special game where points are counted numerically (1, 2, 3...). The first player to reach 7 points wins the set — always with a margin of at least two.",
          curiosity: "",
        },
      ],
      badges: {
        gameYouWin: "You won the game!",
        gameOpponentWins: "The opponent wins the game!",
        advantageYou: "Advantage: You",
        advantageOpponent: "Advantage: Opponent",
        deuceClick: "Deuce: Click for the advantage",
        deuce: "Deuce",
        gameIdle: "The Game: Click to play",
        setYouWin: "You won the Set!",
        setOpponentWins: "The opponent wins the Set!",
        setTiebreak: "Tie-Break! (6-6)",
        setIdle: "The Set: Win 6 Games",
        tiebreakYouWin: "You then won the set! (7-6)",
        tiebreakOpponentWins: "The opponent wins the set (7-6)",
        tiebreakIdle: "Tie-Break: Reach 7 points",
      },
    },
    glossary: {
      scrollNext: "The Rankings",
      title: "Talk Like a Pro",
      lead: "Commentators often speak in code. Here are the key words to follow a match without missing a single point.",
      prevCard: "Previous card",
      nextCard: "Next card",
      swipeHint: "← Swipe →",
      categories: {
        serve: "Serve",
        shots: "Shots",
        play: "Play",
        court: "Court",
      },
      terms: [
        {
          term: "ACE",
          def: "A perfect winning serve the opponent can't even touch with the racket.",
        },
        {
          term: "BREAK",
          def: 'Winning a game in which the opponent was serving. Since the server has a big advantage, "breaking serve" is the key to winning.',
        },
        {
          term: "BASELINE",
          def: "The back line of the court. Our name. It's where you serve from and where most shots are exchanged in modern tennis.",
        },
        {
          term: "LET",
          def: 'When the serve clips the net tape but still lands in the correct service box. The umpire calls "Let!" and the serve is replayed without penalty.',
        },
        {
          term: "DOUBLE FAULT",
          def: "The server has two chances to put the serve in play. Miss both, and the point is lost.",
        },
        {
          term: "DROP SHOT",
          def: "A softly cut shot that makes the ball bounce just over the net, forcing the opponent into a desperate sprint forward.",
        },
        {
          term: "LOB",
          def: "A high, arcing shot used to sail over an opponent who has come too close to the net.",
        },
        {
          term: "PASSING SHOT",
          def: "The shot that beats a net-rushing opponent down the side. It can be played cross-court or down the line.",
        },
        {
          term: "WINNER",
          def: "A shot so powerful, precise or sudden that the opponent can't even touch it before the second bounce.",
        },
        {
          term: "UNFORCED ERROR",
          def: "Every player's nightmare. A mistake made on a comfortable ball, with the opponent having done nothing to cause the difficulty.",
        },
        {
          term: "TOP SPIN",
          def: "Bottom-to-top rotation applied to the ball. It travels high over the net, then dips quickly and bounces high and deep. The foundation of modern tennis.",
        },
        {
          term: "VOLLEY",
          def: "A shot hit before the ball touches the ground, usually from near the net to finish the point.",
        },
        {
          term: "SMASH",
          def: "The overhead. A violent shot hit above the head, almost always in reply to a short lob. Tennis's equivalent of a volleyball spike.",
        },
        {
          term: "SLICE",
          def: "The opposite rotation to topspin, top-to-bottom. The ball stays very low after the bounce, forcing the opponent to bend all the way down to hit it.",
        },
        {
          term: "SERVE & VOLLEY",
          def: "An aggressive, spectacular tactic. Right after serving, the player rushes to the net to finish the point on the volley, stealing time from the opponent.",
        },
      ],
    },
    cta: {
      badge: "Join the Tour",
      titleLine1: "Ready to follow",
      titleLine2: "the action?",
      body: "Now that you know the basics and the secrets of the tour, you're ready to dive into the season. Explore the up-to-date rankings.",
      button: "Explore the Live Rankings",
    },
  },
};
