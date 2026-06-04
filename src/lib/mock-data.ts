/**
 * Mock data for Live ATP Rankings.
 * Placeholder data for UI development — will be replaced by real scraping data.
 */

export interface LiveRankingEntry {
  /** Current live rank position */
  rank: number;
  /** Player information */
  player: {
    id: string;
    name: string;
    /** ISO 3166-1 alpha-3 country code for display (e.g. "ITA") */
    nationality: string;
    /** ISO 3166-1 alpha-2 country code for flag-icons (e.g. "it") */
    countryCode: string;
    age: number;
    /** Player initials for avatar fallback */
    initials: string;
  };
  /** Current live points */
  points: number;
  /** Live status information */
  liveStatus: {
    /** Whether player is currently active in a tournament */
    isActive: boolean;
    /** Current tournament name */
    tournament: string;
    /** Current round/stage (e.g. "SF", "R32", "F", "QF") */
    stage: string;
  };
  /** Rank position movement */
  movement: {
    /** Type of movement indicator */
    type: "up" | "down" | "none" | "mr" | "nmr";
    /** Movement amount (only for up/down) */
    value?: number;
  };
  // --- Expanded card fields ---
  /** Current official ranking points (before live adjustments) */
  officialPoints: number;
  /** Difference: livePoints - officialPoints */
  pointsDiff: number;
  /** Points if player wins their next match */
  nextMatchPoints: number;
  /** Points if player wins the tournament */
  maxPoints: number;
  /** Player's career-best rank position */
  bestRanking: number;
}

export const MOCK_LIVE_RANKINGS: LiveRankingEntry[] = [
  {
    rank: 1,
    player: { id: "sinner", name: "Jannik Sinner", nationality: "ITA", countryCode: "it", age: 24, initials: "JS" },
    points: 13500,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R64" },
    movement: { type: "mr" },
    officialPoints: 11830,
    pointsDiff: -1250,
    nextMatchPoints: 13500,
    maxPoints: 13500,
    bestRanking: 1,
  },
  {
    rank: 2,
    player: { id: "alcaraz", name: "Carlos Alcaraz", nationality: "ESP", countryCode: "es", age: 23, initials: "CA" },
    points: 9960,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R64" },
    movement: { type: "down", value: 1 },
    officialPoints: 8805,
    pointsDiff: -2000,
    nextMatchPoints: 9960,
    maxPoints: 9960,
    bestRanking: 1,
  },
  {
    rank: 3,
    player: { id: "zverev", name: "Alexander Zverev", nationality: "GER", countryCode: "de", age: 29, initials: "AZ" },
    points: 6105,
    liveStatus: { isActive: true, tournament: "Roland Garros", stage: "SF" },
    movement: { type: "up", value: 1 },
    officialPoints: 8135,
    pointsDiff: 400,
    nextMatchPoints: 6605,
    maxPoints: 7305,
    bestRanking: 2,
  },
  {
    rank: 4,
    player: { id: "auger", name: "Félix Auger-Aliassime", nationality: "CAN", countryCode: "ca", age: 25, initials: "FA" },
    points: 4440,
    liveStatus: { isActive: true, tournament: "Roland Garros", stage: "QF" },
    movement: { type: "up", value: 2 },
    officialPoints: 4050,
    pointsDiff: 390,
    nextMatchPoints: 4840,
    maxPoints: 6040,
    bestRanking: 6,
  },
  {
    rank: 5,
    player: { id: "shelton", name: "Ben Shelton", nationality: "USA", countryCode: "us", age: 23, initials: "BS" },
    points: 3920,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R64" },
    movement: { type: "mr" },
    officialPoints: 4070,
    pointsDiff: -150,
    nextMatchPoints: 3920,
    maxPoints: 3920,
    bestRanking: 5,
  },
  {
    rank: 6,
    player: { id: "deminaur", name: "Alex de Minaur", nationality: "AUS", countryCode: "au", age: 27, initials: "AD" },
    points: 3905,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "up", value: 1 },
    officialPoints: 3855,
    pointsDiff: 50,
    nextMatchPoints: 3905,
    maxPoints: 3905,
    bestRanking: 6,
  },
  {
    rank: 7,
    player: { id: "djokovic", name: "Novak Djokovic", nationality: "SRB", countryCode: "rs", age: 39, initials: "ND" },
    points: 3760,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "down", value: 3 },
    officialPoints: 4460,
    pointsDiff: -700,
    nextMatchPoints: 3760,
    maxPoints: 3760,
    bestRanking: 1,
  },
  {
    rank: 8,
    player: { id: "medvedev", name: "Daniil Medvedev", nationality: "RUS", countryCode: "ru", age: 30, initials: "DM" },
    points: 3760,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R128" },
    movement: { type: "none" },
    officialPoints: 3760,
    pointsDiff: 0,
    nextMatchPoints: 3760,
    maxPoints: 3760,
    bestRanking: 1,
  },
  {
    rank: 9,
    player: { id: "fritz", name: "Taylor Fritz", nationality: "USA", countryCode: "us", age: 27, initials: "TF" },
    points: 3605,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R16" },
    movement: { type: "down", value: 2 },
    officialPoints: 3605,
    pointsDiff: 0,
    nextMatchPoints: 3605,
    maxPoints: 3605,
    bestRanking: 4,
  },
  {
    rank: 10,
    player: { id: "ruud", name: "Casper Ruud", nationality: "NOR", countryCode: "no", age: 26, initials: "CR" },
    points: 3445,
    liveStatus: { isActive: true, tournament: "Roland Garros", stage: "QF" },
    movement: { type: "down", value: 1 },
    officialPoints: 3445,
    pointsDiff: 0,
    nextMatchPoints: 3845,
    maxPoints: 4545,
    bestRanking: 2,
  },
  {
    rank: 11,
    player: { id: "draper", name: "Jack Draper", nationality: "GBR", countryCode: "gb", age: 23, initials: "JD" },
    points: 3375,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "up", value: 1 },
    officialPoints: 3375,
    pointsDiff: 0,
    nextMatchPoints: 3375,
    maxPoints: 3375,
    bestRanking: 11,
  },
  {
    rank: 12,
    player: { id: "rune", name: "Holger Rune", nationality: "DEN", countryCode: "dk", age: 22, initials: "HR" },
    points: 3140,
    liveStatus: { isActive: true, tournament: "Roland Garros", stage: "QF" },
    movement: { type: "up", value: 3 },
    officialPoints: 2740,
    pointsDiff: 400,
    nextMatchPoints: 3540,
    maxPoints: 4240,
    bestRanking: 4,
  },
  {
    rank: 13,
    player: { id: "tsitsipas", name: "Stefanos Tsitsipas", nationality: "GRE", countryCode: "gr", age: 26, initials: "ST" },
    points: 3120,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R16" },
    movement: { type: "down", value: 2 },
    officialPoints: 3120,
    pointsDiff: 0,
    nextMatchPoints: 3120,
    maxPoints: 3120,
    bestRanking: 3,
  },
  {
    rank: 14,
    player: { id: "paul", name: "Tommy Paul", nationality: "USA", countryCode: "us", age: 27, initials: "TP" },
    points: 2950,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R64" },
    movement: { type: "none" },
    officialPoints: 2950,
    pointsDiff: 0,
    nextMatchPoints: 2950,
    maxPoints: 2950,
    bestRanking: 10,
  },
  {
    rank: 15,
    player: { id: "dimitrov", name: "Grigor Dimitrov", nationality: "BUL", countryCode: "bg", age: 33, initials: "GD" },
    points: 2840,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R64" },
    movement: { type: "down", value: 2 },
    officialPoints: 2840,
    pointsDiff: 0,
    nextMatchPoints: 2840,
    maxPoints: 2840,
    bestRanking: 3,
  },
  {
    rank: 16,
    player: { id: "musetti", name: "Lorenzo Musetti", nationality: "ITA", countryCode: "it", age: 23, initials: "LM" },
    points: 2720,
    liveStatus: { isActive: true, tournament: "Roland Garros", stage: "QF" },
    movement: { type: "up", value: 4 },
    officialPoints: 2320,
    pointsDiff: 400,
    nextMatchPoints: 3120,
    maxPoints: 3820,
    bestRanking: 15,
  },
  {
    rank: 17,
    player: { id: "hurkacz", name: "Hubert Hurkacz", nationality: "POL", countryCode: "pl", age: 28, initials: "HH" },
    points: 2650,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "none" },
    officialPoints: 2650,
    pointsDiff: 0,
    nextMatchPoints: 2650,
    maxPoints: 2650,
    bestRanking: 6,
  },
  {
    rank: 18,
    player: { id: "rublev", name: "Andrey Rublev", nationality: "RUS", countryCode: "ru", age: 27, initials: "AR" },
    points: 2490,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "down", value: 1 },
    officialPoints: 2490,
    pointsDiff: 0,
    nextMatchPoints: 2490,
    maxPoints: 2490,
    bestRanking: 5,
  },
  {
    rank: 19,
    player: { id: "tiafoe", name: "Frances Tiafoe", nationality: "USA", countryCode: "us", age: 26, initials: "FT" },
    points: 2340,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R16" },
    movement: { type: "none" },
    officialPoints: 2340,
    pointsDiff: 0,
    nextMatchPoints: 2340,
    maxPoints: 2340,
    bestRanking: 10,
  },
  {
    rank: 20,
    player: { id: "berrettini", name: "Matteo Berrettini", nationality: "ITA", countryCode: "it", age: 28, initials: "MB" },
    points: 2050,
    liveStatus: { isActive: false, tournament: "Roland Garros", stage: "R32" },
    movement: { type: "up", value: 5 },
    officialPoints: 1550,
    pointsDiff: 500,
    nextMatchPoints: 2050,
    maxPoints: 2050,
    bestRanking: 6,
  },
];
