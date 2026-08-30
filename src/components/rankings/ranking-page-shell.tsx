"use client";

/**
 * RankingPageShell — Unified page wrapper for all ranking views.
 *
 * Renders a compact full-bleed deep-navy editorial header band (micro-label,
 * display title, subtitle) followed by the page content constrained to the
 * standard container. The search/filter controls and the "last updated"
 * badge are provided as a `toolbar` node to the children render prop, so
 * each view can embed them inside its table widget.
 */

import { type ReactNode } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlayerDisplay } from "@/types";
import { useRankingFilters, type AgeGroup } from "@/hooks/use-ranking-filters";
import { useTranslation } from "@/providers/locale-provider";
import { StableLabel } from "@/components/ui/stable-label";

type HasPlayer = { player: PlayerDisplay };

interface RankingPageShellProps<T extends HasPlayer> {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  entries: T[];
  /** Optional view-specific stat rendered on the right side of the navy band. */
  headerExtra?: ReactNode;
  children: (filtered: T[], toolbar: ReactNode) => ReactNode;
}

export function RankingPageShell<T extends HasPlayer>({
  title,
  subtitle,
  lastUpdated,
  entries,
  headerExtra,
  children,
}: RankingPageShellProps<T>) {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    nationalityFilter,
    setNationalityFilter,
    ageFilter,
    setAgeFilter,
    activeFiltersCount,
    uniqueNationalities,
    filteredEntries,
    resetFilters,
  } = useRankingFilters(entries);

  const toolbar = (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center px-4 md:px-6 py-4 border-b border-border-subtle bg-surface-gray/20">
      {/* Updated Badge — left-anchored */}
      {lastUpdated && (
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border-subtle bg-surface-white px-5 py-2.5 text-sm text-text-muted shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-baseline-lime shrink-0" />
          <StableLabel text={(d) => d.rankings.shell.updated} />
          <span className="font-medium text-foreground">{lastUpdated}</span>
        </div>
      )}

      {/* Spacer pushes search+filter to the right (desktop only) */}
      <div className="md:ml-auto" />

      {/* Search + filter share a single row so they stay aligned on mobile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder={t.rankings.shell.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-full border border-border-subtle bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-baseline-lime focus:border-transparent transition-all w-full md:w-48 lg:w-56 placeholder:text-text-muted text-foreground"
          />
        </div>

        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger className="relative shrink-0 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-white px-4 md:px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover cursor-pointer">
            <SlidersHorizontal className="h-4 w-4" />
            <StableLabel text={(d) => d.rankings.shell.filter} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-baseline-lime text-[10px] font-bold text-deep-navy">
                {activeFiltersCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-72 p-5 rounded-[24px] shadow-ambient border-border-subtle bg-surface-white"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{t.rankings.shell.filtersHeading}</h4>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-medium text-text-muted hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    {t.rankings.shell.reset}
                  </button>
                )}
              </div>

              {/* Nationality Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                  {t.rankings.shell.nationality}
                </label>
                <Select
                  value={nationalityFilter}
                  onValueChange={(val) => setNationalityFilter(val ?? "All")}
                >
                  <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-baseline-lime">
                    <SelectValue placeholder={t.rankings.shell.selectNationality} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                    <SelectItem
                      value="All"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.allNationalities}</span>
                    </SelectItem>
                    {uniqueNationalities.map((item) => (
                      <SelectItem
                        key={item.nat}
                        value={item.nat}
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`fi fi-${item.code} rounded-sm shadow-sm`}
                            style={{ fontSize: "14px" }}
                          />
                          <span className="font-medium">{item.nat}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Group Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                  {t.rankings.shell.ageGroup}
                </label>
                <Select
                  value={ageFilter}
                  onValueChange={(val) =>
                    setAgeFilter((val ?? "All") as AgeGroup)
                  }
                >
                  <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-baseline-lime">
                    <SelectValue placeholder={t.rankings.shell.selectAgeGroup} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                    <SelectItem
                      value="All"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.allAges}</span>
                    </SelectItem>
                    <SelectItem
                      value="Under 21"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.under21}</span>
                    </SelectItem>
                    <SelectItem
                      value="21-25"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.age21to25}</span>
                    </SelectItem>
                    <SelectItem
                      value="26-30"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.age26to30}</span>
                    </SelectItem>
                    <SelectItem
                      value="Over 30"
                      className="rounded-xl py-2.5 px-3 cursor-pointer"
                    >
                      <span className="font-medium">{t.rankings.shell.over30}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ Editorial header band (full-bleed deep navy, compact) ═══ */}
      <div className="bg-deep-navy">
        <div className="mx-auto max-w-[1280px] px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {/* Micro-label */}
            <span className="block text-[11px] text-baseline-lime uppercase tracking-[0.3em] font-bold mb-3">
              {t.rankings.shell.microLabel}
            </span>

            {/* Display title + subtitle */}
            <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] leading-[0.95] font-heading font-extrabold text-white uppercase tracking-tighter mb-2">
              {title}
            </h1>
            <p className="text-body-md md:text-body-lg text-white/70 font-medium max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* View-specific stat (e.g. Race cut-off projection) */}
          {headerExtra && <div className="shrink-0">{headerExtra}</div>}
        </div>
      </div>

      {/* Render children with filtered entries + embeddable toolbar */}
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {children(filteredEntries, toolbar)}
      </div>
    </>
  );
}
