/**
 * Mock data for Official ATP Rankings.
 * Placeholder data for UI development — will be replaced by real scraping data.
 */

import type { OfficialRankingEntry } from "@/types";

export const MOCK_OFFICIAL_RANKINGS: OfficialRankingEntry[] = [
  {
    rank: 1,
    player: { id: "sinner", name: "Jannik Sinner", nationality: "ITA", countryCode: "it", age: 24, initials: "JS" },
    points: 11830,
    movement: { type: "none" },
    nextWeek: { points: 11830, rankChange: 0 },
  },
  {
    rank: 2,
    player: { id: "alcaraz", name: "Carlos Alcaraz", nationality: "ESP", countryCode: "es", age: 23, initials: "CA" },
    points: 9960,
    movement: { type: "none" },
    nextWeek: { points: 9460, rankChange: 0 },
  },
  {
    rank: 3,
    player: { id: "zverev", name: "Alexander Zverev", nationality: "GER", countryCode: "de", age: 29, initials: "AZ" },
    points: 8135,
    movement: { type: "up", value: 1 },
    nextWeek: { points: 8535, rankChange: 0 },
  },
  {
    rank: 4,
    player: { id: "djokovic", name: "Novak Djokovic", nationality: "SRB", countryCode: "rs", age: 39, initials: "ND" },
    points: 4460,
    movement: { type: "down", value: 1 },
    nextWeek: { points: 3760, rankChange: -3 },
  },
  {
    rank: 5,
    player: { id: "shelton", name: "Ben Shelton", nationality: "USA", countryCode: "us", age: 23, initials: "BS" },
    points: 4070,
    movement: { type: "mr" },
    nextWeek: { points: 3920, rankChange: 0 },
  },
  {
    rank: 6,
    player: { id: "auger", name: "Félix Auger-Aliassime", nationality: "CAN", countryCode: "ca", age: 25, initials: "FA" },
    points: 4050,
    movement: { type: "up", value: 2 },
    nextWeek: { points: 4440, rankChange: 1 },
  },
  {
    rank: 7,
    player: { id: "fritz", name: "Taylor Fritz", nationality: "USA", countryCode: "us", age: 27, initials: "TF" },
    points: 3855,
    movement: { type: "none" },
    nextWeek: { points: 3605, rankChange: -2 },
  },
  {
    rank: 8,
    player: { id: "deminaur", name: "Alex de Minaur", nationality: "AUS", countryCode: "au", age: 27, initials: "AD" },
    points: 3855,
    movement: { type: "up", value: 1 },
    nextWeek: { points: 3905, rankChange: 1 },
  },
  {
    rank: 9,
    player: { id: "medvedev", name: "Daniil Medvedev", nationality: "RUS", countryCode: "ru", age: 30, initials: "DM" },
    points: 3760,
    movement: { type: "down", value: 1 },
    nextWeek: { points: 3760, rankChange: 0 },
  },
  {
    rank: 10,
    player: { id: "ruud", name: "Casper Ruud", nationality: "NOR", countryCode: "no", age: 26, initials: "CR" },
    points: 3445,
    movement: { type: "none" },
    nextWeek: { points: 3445, rankChange: 0 },
  },
  {
    rank: 11,
    player: { id: "draper", name: "Jack Draper", nationality: "GBR", countryCode: "gb", age: 23, initials: "JD" },
    points: 3375,
    movement: { type: "up", value: 1 },
    nextWeek: { points: 3375, rankChange: 0 },
  },
  {
    rank: 12,
    player: { id: "rune", name: "Holger Rune", nationality: "DEN", countryCode: "dk", age: 22, initials: "HR" },
    points: 2740,
    movement: { type: "up", value: 3 },
    nextWeek: { points: 3140, rankChange: 2 },
  },
  {
    rank: 13,
    player: { id: "tsitsipas", name: "Stefanos Tsitsipas", nationality: "GRE", countryCode: "gr", age: 26, initials: "ST" },
    points: 3120,
    movement: { type: "down", value: 2 },
    nextWeek: { points: 3120, rankChange: 0 },
  },
  {
    rank: 14,
    player: { id: "paul", name: "Tommy Paul", nationality: "USA", countryCode: "us", age: 27, initials: "TP" },
    points: 2950,
    movement: { type: "none" },
    nextWeek: { points: 2950, rankChange: 0 },
  },
  {
    rank: 15,
    player: { id: "dimitrov", name: "Grigor Dimitrov", nationality: "BUL", countryCode: "bg", age: 33, initials: "GD" },
    points: 2840,
    movement: { type: "down", value: 2 },
    nextWeek: { points: 2840, rankChange: 0 },
  },
  {
    rank: 16,
    player: { id: "musetti", name: "Lorenzo Musetti", nationality: "ITA", countryCode: "it", age: 23, initials: "LM" },
    points: 2320,
    movement: { type: "up", value: 4 },
    nextWeek: { points: 2720, rankChange: 2 },
  },
  {
    rank: 17,
    player: { id: "hurkacz", name: "Hubert Hurkacz", nationality: "POL", countryCode: "pl", age: 28, initials: "HH" },
    points: 2650,
    movement: { type: "none" },
    nextWeek: { points: 2650, rankChange: 0 },
  },
  {
    rank: 18,
    player: { id: "rublev", name: "Andrey Rublev", nationality: "RUS", countryCode: "ru", age: 27, initials: "AR" },
    points: 2490,
    movement: { type: "down", value: 1 },
    nextWeek: { points: 2490, rankChange: 0 },
  },
  {
    rank: 19,
    player: { id: "tiafoe", name: "Frances Tiafoe", nationality: "USA", countryCode: "us", age: 26, initials: "FT" },
    points: 2340,
    movement: { type: "none" },
    nextWeek: { points: 2340, rankChange: 0 },
  },
  {
    rank: 20,
    player: { id: "berrettini", name: "Matteo Berrettini", nationality: "ITA", countryCode: "it", age: 28, initials: "MB" },
    points: 1550,
    movement: { type: "up", value: 5 },
    nextWeek: { points: 2050, rankChange: 3 },
  },
];
