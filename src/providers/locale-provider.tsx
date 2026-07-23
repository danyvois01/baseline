"use client";

/**
 * LocaleProvider — client-side locale state for the IT/EN toggle.
 * Persists the choice to localStorage and mirrors it onto <html lang>.
 * SSR always renders the default locale (accepted trade-off, see spec).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  dictionaries,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "baseline-locale";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  // Restore persisted choice after hydration; ignore unknown/corrupt values.
  // setState here is intentional: reading localStorage during render would
  // cause a hydration mismatch (SSR always renders the default locale).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "it" || stored === "en") setLocale(stored);
    } catch {
      // localStorage unavailable (private mode) — keep default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Non-fatal: preference simply won't persist.
    }
  }, [locale]);

  const toggleLocale = useCallback(
    () => setLocale((prev) => (prev === "it" ? "en" : "it")),
    [],
  );

  return (
    <LocaleContext.Provider
      value={{ locale, t: dictionaries[locale], toggleLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
