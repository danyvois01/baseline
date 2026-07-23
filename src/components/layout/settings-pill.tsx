"use client";

/**
 * SettingsPill — Segmented ghost pill hosting the theme toggle (left)
 * and the language toggle (right). Sits before the primary CTA in the
 * navbar; intentionally quieter than the CTA (border only, no fill).
 * The language segment shows the TARGET language ("EN" while in Italian).
 */

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/providers/locale-provider";

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
  const { t, toggleLocale } = useTranslation();

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
        className="flex h-10 w-10 items-center justify-center rounded-l-full text-foreground/80 transition-colors hover:bg-surface-gray/50 hover:text-foreground cursor-pointer"
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

      <button
        type="button"
        onClick={toggleLocale}
        aria-label={t.settings.switchLanguage}
        className="flex h-10 items-center justify-center rounded-r-full px-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-surface-gray/50 hover:text-foreground cursor-pointer"
      >
        {t.settings.targetLanguage}
      </button>
    </div>
  );
}
