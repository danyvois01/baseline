import { it, type Dictionary } from "./it";
import { en } from "./en";

export type Locale = "it" | "en";
export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { it, en };
export const DEFAULT_LOCALE: Locale = "it";
