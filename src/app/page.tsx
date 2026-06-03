import { TopNavBar, Footer } from "@/components/layout";
import { RankingsTable } from "@/components/rankings";
import { MOCK_LIVE_RANKINGS } from "@/lib/mock-data";
import { SlidersHorizontal } from "lucide-react";

/**
 * Live ATP Rankings — Main page.
 * Displays the live rankings table with real-time point projections.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-gray">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-primary-olive live-pulse" />
            <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
              Live Updates Active
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-headline-lg text-deep-navy mb-1">
            Live ATP Rankings
          </h1>
          <p className="text-body-lg text-text-muted mb-8">
            Real-time point projections based on ongoing tournament results.
          </p>

          {/* Controls Row */}
          <div className="flex items-center justify-end gap-3 mb-6">
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

          {/* Rankings Table */}
          <RankingsTable entries={MOCK_LIVE_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
