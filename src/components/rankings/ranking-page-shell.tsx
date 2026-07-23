"use client";

/**
 * RankingPageShell — Unified page wrapper for all ranking views.
 *
 * Encapsulates the page header (title + subtitle), the search/filter bar,
 * and the "last updated" badge. Ranking-specific content (table, summary
 * cards, etc.) is passed via children render prop receiving filtered entries.
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

type HasPlayer = { player: PlayerDisplay };

interface RankingPageShellProps<T extends HasPlayer> {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  entries: T[];
  children: (filtered: T[]) => ReactNode;
}

export function RankingPageShell<T extends HasPlayer>({
  title,
  subtitle,
  lastUpdated,
  entries,
  children,
}: RankingPageShellProps<T>) {
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

  return (
    <>
      {/* Page Header + Controls */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        {/* Title + Subtitle */}
        <div>
          <h1 className="text-headline-lg text-foreground mb-1">{title}</h1>
          <p className="text-body-lg text-foreground/70 font-medium flex items-center gap-2">
            <span className="w-1 h-5 bg-[#DFFF00] rounded-full inline-block shrink-0" />
            {subtitle}
          </p>
        </div>

        {/* Search, Filter, Updated badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-full border border-border-subtle bg-surface-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-baseline-lime focus:border-transparent transition-all w-40 md:w-48 lg:w-56 placeholder:text-text-muted text-foreground"
            />
          </div>

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger className="relative inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-gray/30 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover cursor-pointer">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
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
                  <h4 className="font-semibold text-foreground">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-medium text-text-muted hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Nationality Select */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                    Nationality
                  </label>
                  <Select
                    value={nationalityFilter}
                    onValueChange={(val) => setNationalityFilter(val ?? "All")}
                  >
                    <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-baseline-lime">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                      <SelectItem
                        value="All"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">All Nationalities</span>
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
                    Age Group
                  </label>
                  <Select
                    value={ageFilter}
                    onValueChange={(val) =>
                      setAgeFilter((val ?? "All") as AgeGroup)
                    }
                  >
                    <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-baseline-lime">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                      <SelectItem
                        value="All"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">All Ages</span>
                      </SelectItem>
                      <SelectItem
                        value="Under 21"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">Under 21</span>
                      </SelectItem>
                      <SelectItem
                        value="21-25"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">21 - 25</span>
                      </SelectItem>
                      <SelectItem
                        value="26-30"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">26 - 30</span>
                      </SelectItem>
                      <SelectItem
                        value="Over 30"
                        className="rounded-xl py-2.5 px-3 cursor-pointer"
                      >
                        <span className="font-medium">Over 30</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Updated Badge */}
          {lastUpdated && (
            <div className="hidden md:block rounded-full border border-border-subtle bg-surface-white px-5 py-2.5 text-sm text-text-muted shrink-0">
              Updated:{" "}
              <span className="font-medium text-foreground">{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>

      {/* Render children with filtered entries */}
      {children(filteredEntries)}
    </>
  );
}
