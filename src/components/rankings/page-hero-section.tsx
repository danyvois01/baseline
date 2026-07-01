"use client";

/**
 * PageHeroSection — Shared hero header for all ranking pages.
 * Displays: Title + Description (left) and Search + Filter + Updated badge (right).
 * Optionally shows a live-updates indicator above the title.
 */

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface PageHeroSectionProps {
  /** Page heading (e.g. "Live ATP Rankings") */
  title: string;
  /** Short description shown below the title */
  description: string;
  /** Text displayed in the "Updated" badge (e.g. "Just now", "Mon, Jun 2") */
  updatedAt: string;
  /** Whether to show the pulsing green "Live Updates Active" indicator */
  liveIndicator?: boolean;
}

export function PageHeroSection({
  title,
  description,
  updatedAt,
  liveIndicator = false,
}: PageHeroSectionProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      {/* Left: Title + Description */}
      <div className="min-w-0">
        {liveIndicator && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary-olive live-pulse" />
            <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
              Live Updates Active
            </span>
          </div>
        )}

        <h1 className="text-headline-lg text-deep-navy mb-1">{title}</h1>
        <p className="text-body-lg text-text-muted">{description}</p>
      </div>

      {/* Right: Search + Filter + Updated badge */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10 w-[200px] rounded-full border border-border-subtle bg-white pl-10 pr-4 text-sm text-deep-navy placeholder:text-text-muted outline-none transition-all duration-200 focus:border-baseline-lime focus:ring-2 focus:ring-baseline-lime/30"
          />
        </div>

        {/* Filter Button */}
        <button className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-medium text-deep-navy transition-all duration-200 hover:bg-surface-hover cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>

        {/* Updated Badge */}
        <div className="rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm text-text-muted whitespace-nowrap">
          Updated:{" "}
          <span className="font-medium text-deep-navy">{updatedAt}</span>
        </div>
      </div>
    </div>
  );
}
