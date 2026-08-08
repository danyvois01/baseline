"use client";

/**
 * SettingsPill — Segmented ghost pill hosting the theme toggle (left)
 * and the language segmented control (right). Sits before the primary CTA in
 * the navbar; intentionally quieter than the CTA (border only, no fill) and
 * one step shorter on mobile so it never outweighs the CTA.
 * The language control lists every locale with the active one highlighted.
 */

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/providers/locale-provider";
import { dictionaries, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Derived from the dictionaries so adding a locale needs no change here. */
const LOCALES = Object.keys(dictionaries) as Locale[];

const emptySubscribe = () => () => {};

/** True only after hydration — safe to read client-only values like the theme. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function SettingsPill() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();

  // next-themes is undefined until mounted; render a stable icon first
  // to avoid a hydration mismatch.
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <div className="flex items-center rounded-full border border-border-subtle bg-transparent">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? t.settings.switchToLight : t.settings.switchToDark}
        className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-l-full text-foreground/80 transition-colors hover:bg-surface-gray/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baseline-lime cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <div className="h-5 w-px bg-border-subtle" aria-hidden />

      {/* Both locales are always rendered — the active one is dominant, so the
          control reads as state AND affordance without the "EN means what?"
          ambiguity of showing only the target language. */}
      <div
        role="group"
        aria-label={t.settings.languageGroup}
        className="flex h-8 md:h-10 items-center gap-0.5 rounded-r-full pl-1.5 pr-2 md:pl-2 md:pr-2.5"
      >
        {LOCALES.map((loc) => {
          const isActive = loc === locale;

          return (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              // Not `disabled`: the active locale must stay focusable so
              // keyboard and screen-reader users can perceive which one is on.
              aria-current={isActive ? "true" : undefined}
              aria-label={t.settings.switchToLocale[loc]}
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs md:text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baseline-lime",
                isActive
                  ? "text-foreground cursor-default"
                  : "text-foreground/40 hover:text-foreground cursor-pointer",
              )}
            >
              {loc.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
