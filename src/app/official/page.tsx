import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { OfficialClient } from "./official-client";
import { getOfficialRankings } from "@/services/rankings-service";

/**
 * Official ATP Rankings — /official page.
 * Displays the verified weekly ATP Tour singles standings.
 */

/**
 * Rendered on every request. Freshness is owned by the SWR cache in
 * services/cache (10-minute TTL), so an ISR shell here would only add a second,
 * longer-lived layer that pins stale standings on disk.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Official ATP Rankings",
  description:
    "The official weekly ATP Tour singles rankings — verified standings, points, and next-week projections.",
  alternates: {
    canonical: "/official",
  },
};

export default async function OfficialPage() {
  const { rankings, lastUpdated } = await getOfficialRankings();

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <OfficialClient initialRankings={rankings} lastUpdated={lastUpdated} />
      </main>

      <Footer />
    </div>
  );
}
