import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { OfficialClient } from "./official-client";
import { getOfficialRankings } from "@/services/rankings-service";

/**
 * Official ATP Rankings — /official page.
 * Displays the verified weekly ATP Tour singles standings.
 */

export const metadata: Metadata = {
  title: "Official ATP Rankings — Baseline",
  description:
    "The official weekly ATP Tour singles rankings — verified standings, points, and next-week projections.",
};

export default async function OfficialPage() {
  const { rankings, lastUpdated } = await getOfficialRankings();

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <OfficialClient initialRankings={rankings} lastUpdated={lastUpdated} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
