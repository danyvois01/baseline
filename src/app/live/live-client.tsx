"use client";

import { useState, useMemo } from "react";
import { RankingsTable } from "@/components/rankings";
import { LiveRankingEntry } from "@/lib/mock-data";
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

interface LiveClientProps {
  initialRankings: LiveRankingEntry[];
  lastUpdated: string;
}

export function LiveClient({ initialRankings, lastUpdated }: LiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");

  const uniqueNationalities = useMemo(() => {
    const natsMap = new Map<string, string>();
    initialRankings.forEach((r) => {
      if (!natsMap.has(r.player.nationality)) {
        natsMap.set(r.player.nationality, r.player.countryCode);
      }
    });
    return Array.from(natsMap.entries())
      .map(([nat, code]) => ({ nat, code }))
      .sort((a, b) => a.nat.localeCompare(b.nat));
  }, [initialRankings]);

  const filteredRankings = initialRankings.filter((entry) => {
    // 1. Search Query
    const matchesSearch = entry.player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // 2. Nationality
    const matchesNat =
      nationalityFilter === "All" ||
      entry.player.nationality === nationalityFilter;

    // 3. Age
    let matchesAge = true;
    if (ageFilter === "Under 21") matchesAge = entry.player.age < 21;
    else if (ageFilter === "21-25")
      matchesAge = entry.player.age >= 21 && entry.player.age <= 25;
    else if (ageFilter === "26-30")
      matchesAge = entry.player.age >= 26 && entry.player.age <= 30;
    else if (ageFilter === "Over 30") matchesAge = entry.player.age > 30;

    return matchesSearch && matchesNat && matchesAge;
  });

  const activeFiltersCount =
    (nationalityFilter !== "All" ? 1 : 0) + (ageFilter !== "All" ? 1 : 0);

  return (
    <>
      {/* Hero: Title + Controls inline */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        {/* Left: Title + Subtitle */}
        <div>
          {/* Page Title */}
          <h1 className="text-headline-lg text-deep-navy mb-1">
            Live ATP Rankings
          </h1>
          <p className="text-body-lg text-deep-navy/70 font-medium flex items-center gap-2">
            <span className="w-1 h-5 bg-[#DFFF00] rounded-full inline-block shrink-0" />
            Real-time point projections based on ongoing tournament results.
          </p>
        </div>

        {/* Right: Search, Filter + Updated badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-full border border-border-subtle bg-surface-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-baseline-lime focus:border-transparent transition-all w-40 md:w-48 lg:w-56 placeholder:text-text-muted text-deep-navy"
            />
          </div>

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger className="relative inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-gray/30 px-5 py-2.5 text-sm font-medium text-deep-navy transition-all duration-200 hover:bg-surface-hover cursor-pointer">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-baseline-lime text-[10px] font-bold text-deep-navy">
                  {activeFiltersCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-5 rounded-[24px] shadow-ambient border-border-subtle bg-white">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-deep-navy">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setNationalityFilter("All");
                        setAgeFilter("All");
                      }}
                      className="text-xs font-medium text-text-muted hover:text-deep-navy transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                    Nationality
                  </label>
                  <Select
                    value={nationalityFilter}
                    onValueChange={setNationalityFilter}
                  >
                    <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-primary-olive">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                      <SelectItem value="All" className="rounded-xl py-2.5 px-3 cursor-pointer">
                        <span className="font-medium">All Nationalities</span>
                      </SelectItem>
                      {uniqueNationalities.map((item) => (
                        <SelectItem key={item.nat} value={item.nat} className="rounded-xl py-2.5 px-3 cursor-pointer">
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

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider pl-1">
                    Age Group
                  </label>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full rounded-full border-border-subtle px-4 py-3 h-auto focus:ring-primary-olive">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border-subtle p-2 shadow-ambient">
                      <SelectItem value="All" className="rounded-xl py-2.5 px-3 cursor-pointer">
                        <span className="font-medium">All Ages</span>
                      </SelectItem>
                      <SelectItem value="Under 21" className="rounded-xl py-2.5 px-3 cursor-pointer">
                        <span className="font-medium">Under 21</span>
                      </SelectItem>
                      <SelectItem value="21-25" className="rounded-xl py-2.5 px-3 cursor-pointer">
                        <span className="font-medium">21 - 25</span>
                      </SelectItem>
                      <SelectItem value="26-30" className="rounded-xl py-2.5 px-3 cursor-pointer">
                        <span className="font-medium">26 - 30</span>
                      </SelectItem>
                      <SelectItem value="Over 30" className="rounded-xl py-2.5 px-3 cursor-pointer">
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
            <div className="hidden md:block rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm text-text-muted shrink-0">
              Updated:{" "}
              <span className="font-medium text-deep-navy">{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rankings Table */}
      <RankingsTable entries={filteredRankings} initialCount={20} />
    </>
  );
}
