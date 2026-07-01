import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { RankingsTable, PageHeroSection } from "@/components/rankings";
import { MOCK_LIVE_RANKINGS } from "@/lib/mock-data";

/**
 * Live ATP Rankings — /live page.
 * Displays the live rankings table with real-time point projections.
 */

export const metadata: Metadata = {
  title: "Live ATP Rankings - Baseline",
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
          {/* Hero: Title + Controls */}
          <PageHeroSection
            title="Live ATP Rankings"
            description="Real-time point projections based on ongoing tournament results."
            updatedAt="Just now"
            liveIndicator
          />

          {/* Rankings Table */}
          <RankingsTable entries={MOCK_LIVE_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

