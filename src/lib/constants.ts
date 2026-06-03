/**
 * Application-wide constants.
 * Centralized configuration values used across the app.
 */

/** Application metadata */
export const APP_NAME = "ATP Rankings";
export const APP_DESCRIPTION =
  "Live ATP Tennis Rankings — Singles, Doubles & Race to Turin";

/** Ranking type labels for UI display */
export const RANKING_TYPE_LABELS: Record<string, string> = {
  singles: "Singles",
  doubles: "Doubles",
  "race-to-turin": "Race to Turin",
} as const;

/** Default number of rows per page in rankings tables */
export const DEFAULT_PAGE_SIZE = 50;

/** Available page size options */
export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
