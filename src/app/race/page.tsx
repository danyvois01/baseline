import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { RaceSummaryCards, RaceTable, PageHeroSection } from "@/components/rankings";
import { MOCK_RACE_SUMMARY, MOCK_RACE_RANKINGS } from "@/lib/mock-data-race";

/**
 * Race to Turin — Rankings page.
 * Displays the Race to Turin standings with summary cards and qualification status.
 */

export const metadata: Metadata = {
  title: "Race to Turin - Baseline",
  description:
    "Track the Race to Turin — ATP Finals qualification standings, cut-off projections, and qualified players.",
};

export default function RacePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-gray">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          {/* Hero: Title + Controls */}
          <PageHeroSection
            title="Race to Turin"
            description="The top 8 singles players and doubles teams of the 2024 calendar year qualify for the prestigious season finale in Turin, Italy."
            updatedAt="Mon, Jun 2"
          />

          {/* Summary Cards */}
          <RaceSummaryCards summary={MOCK_RACE_SUMMARY} />

          {/* Race Rankings Table */}
          <RaceTable entries={MOCK_RACE_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

