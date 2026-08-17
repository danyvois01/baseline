import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { LiveClient } from "./live-client";
import { getLiveRankings } from "@/services/rankings-service";

/**
 * Live ATP Rankings — /live page.
 * Displays the live rankings table with real-time point projections.
 */

/**
 * Rendered on every request. Freshness is owned by the SWR cache in
 * services/cache (10-minute TTL), so an ISR shell here would only add a second,
 * longer-lived layer that pins stale standings on disk.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live ATP Rankings",
  description:
    "Live ATP Tennis Rankings: real-time point projections based on ongoing tournament results.",
  alternates: {
    canonical: "/live",
  },
};

export default async function LivePage() {
  const { rankings, lastUpdated } = await getLiveRankings();

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <LiveClient initialRankings={rankings} lastUpdated={lastUpdated} />
      </main>

      <Footer />
    </div>
  );
}
