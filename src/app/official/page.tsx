import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { OfficialTable, PageHeroSection } from "@/components/rankings";
import { MOCK_OFFICIAL_RANKINGS } from "@/lib/mock-data-official";

/**
 * Official ATP Rankings — Page.
 * Displays the verified weekly ATP Tour singles standings.
 * No Live Indicator — this is a static weekly snapshot.
 */

export const metadata: Metadata = {
  title: "Official ATP Rankings - Baseline",
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
          {/* Hero: Title + Controls */}
          <PageHeroSection
            title="Official ATP Rankings"
            description="The official weekly ATP Tour singles rankings."
            updatedAt="Mon, Jun 2"
          />

          {/* Official Rankings Table */}
          <OfficialTable entries={MOCK_OFFICIAL_RANKINGS} initialCount={10} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

