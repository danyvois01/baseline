import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { OfficialTable } from "@/components/rankings";
import { MOCK_OFFICIAL_RANKINGS } from "@/lib/mock-data-official";
import { SlidersHorizontal } from "lucide-react";

/**
 * Official ATP Rankings — Page.
 * Displays the verified weekly ATP Tour singles standings.
 * No Live Indicator — this is a static weekly snapshot.
 */

export const metadata: Metadata = {
  title: "Official ATP Rankings — Baseline",
  description:
    "The official weekly ATP Tour singles rankings — verified standings, points, and next-week projections.",
};

export default function OfficialPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-gray">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          {/* Hero: Title + Controls inline */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            {/* Left: Title + Subtitle (no Live Indicator) */}
            <div>
              <h1 className="text-headline-lg text-deep-navy mb-1">
                Official ATP Rankings
              </h1>
              <p className="text-body-lg text-text-muted">
                The official weekly ATP Tour singles rankings.
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
                Updated:{" "}
                <span className="font-medium text-deep-navy">Mon, Jun 2</span>
              </div>
            </div>
          </div>

          {/* Official Rankings Table */}
          <OfficialTable entries={MOCK_OFFICIAL_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
