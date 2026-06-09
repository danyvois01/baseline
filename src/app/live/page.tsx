import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { RankingsTable } from "@/components/rankings";
import { MOCK_LIVE_RANKINGS } from "@/lib/mock-data";
import { SlidersHorizontal } from "lucide-react";

/**
 * Live ATP Rankings — /live page.
 * Displays the live rankings table with real-time point projections.
 */

export const metadata: Metadata = {
  title: "Live ATP Rankings — Baseline",
  description:
    "Live ATP Tennis Rankings — Real-time point projections based on ongoing tournament results.",
};

export default function LivePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-gray">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          {/* Hero: Title + Controls inline */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            {/* Left: Live indicator + Title + Subtitle */}
            <div>
              {/* Live Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary-olive live-pulse" />
                <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                  Live Updates Active
                </span>
              </div>

              {/* Page Title */}
              <h1 className="text-headline-lg text-deep-navy mb-1">
                Live ATP Rankings
              </h1>
              <p className="text-body-lg text-text-muted">
                Real-time point projections based on ongoing tournament results.
              </p>
            </div>

            {/* Right: Filter + Updated badge */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Filter Button */}
              <button className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-medium text-deep-navy transition-all duration-200 hover:bg-surface-hover cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>

              {/* Updated Badge */}
              <div className="rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm text-text-muted">
                Updated: <span className="font-medium text-deep-navy">Just now</span>
              </div>
            </div>
          </div>

          {/* Rankings Table */}
          <RankingsTable entries={MOCK_LIVE_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
