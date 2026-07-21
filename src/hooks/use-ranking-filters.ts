"use client";

/**
 * useRankingFilters — Shared filtering logic for all ranking pages.
 *
 * Manages search query, nationality filter, and age-group filter state,
 * plus derived values (unique nationalities list, filtered entries, active
 * filter count). Accepts any entry shape that contains a `player` field
 * matching PlayerDisplay.
 */

import { useState, useMemo } from "react";
import type { PlayerDisplay } from "@/types";

/** Age group filter options */
export type AgeGroup = "All" | "Under 21" | "21-25" | "26-30" | "Over 30";

/** Constraint: any ranking entry that has a player field */
type HasPlayer = { player: PlayerDisplay };

/** Return type of the hook */
export interface RankingFiltersResult<T extends HasPlayer> {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  nationalityFilter: string;
  setNationalityFilter: (value: string) => void;
  ageFilter: AgeGroup;
  setAgeFilter: (value: AgeGroup) => void;
  activeFiltersCount: number;
  uniqueNationalities: { nat: string; code: string }[];
  filteredEntries: T[];
  resetFilters: () => void;
}

export function useRankingFilters<T extends HasPlayer>(
  entries: T[],
): RankingFiltersResult<T> {
  const [searchQuery, setSearchQuery] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState<AgeGroup>("All");

  const uniqueNationalities = useMemo(() => {
    const natsMap = new Map<string, string>();
    entries.forEach((entry) => {
      if (!natsMap.has(entry.player.nationality)) {
        natsMap.set(entry.player.nationality, entry.player.countryCode);
      }
    });
    return Array.from(natsMap.entries())
      .map(([nat, code]) => ({ nat, code }))
      .sort((a, b) => a.nat.localeCompare(b.nat));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.player.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesNat =
        nationalityFilter === "All" ||
        entry.player.nationality === nationalityFilter;

      let matchesAge = true;
      if (ageFilter === "Under 21") matchesAge = entry.player.age < 21;
      else if (ageFilter === "21-25")
        matchesAge = entry.player.age >= 21 && entry.player.age <= 25;
      else if (ageFilter === "26-30")
        matchesAge = entry.player.age >= 26 && entry.player.age <= 30;
      else if (ageFilter === "Over 30") matchesAge = entry.player.age > 30;

      return matchesSearch && matchesNat && matchesAge;
    });
  }, [entries, searchQuery, nationalityFilter, ageFilter]);

  const activeFiltersCount =
    (nationalityFilter !== "All" ? 1 : 0) + (ageFilter !== "All" ? 1 : 0);

  const resetFilters = () => {
    setNationalityFilter("All");
    setAgeFilter("All");
  };

  return {
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
  };
}
