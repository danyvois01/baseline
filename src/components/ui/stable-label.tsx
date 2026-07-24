"use client";

/**
 * StableLabel — renders a translated label whose box is sized to the WIDEST
 * translation across all locales, so switching language never changes the
 * width of the surrounding button/link (no layout shift in the chrome).
 *
 * How: every locale's string is rendered stacked in the same grid cell;
 * only the active one is visible, the others reserve space invisibly.
 */

import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";
import { useTranslation } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface StableLabelProps {
  /** Selects the label from a dictionary; called once per locale. */
  text: (t: Dictionary) => string;
  className?: string;
}

export function StableLabel({ text, className }: StableLabelProps) {
  const { locale } = useTranslation();

  return (
    <span className={cn("inline-grid justify-items-center", className)}>
      {(Object.entries(dictionaries) as [Locale, Dictionary][]).map(
        ([loc, dict]) => (
          <span
            key={loc}
            aria-hidden={loc !== locale || undefined}
            className={cn(
              "col-start-1 row-start-1 whitespace-nowrap",
              loc !== locale && "invisible",
            )}
          >
            {text(dict)}
          </span>
        ),
      )}
    </span>
  );
}
