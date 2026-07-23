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
