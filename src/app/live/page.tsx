import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { LiveClient } from "./live-client";
import { getLiveRankings } from "@/services/rankings-service";

/**
 * Live ATP Rankings — /live page.
 * Displays the live rankings table with real-time point projections.
 */

export const metadata: Metadata = {
  title: "Live ATP Rankings",
  description:
    "Live ATP Tennis Rankings — Real-time point projections based on ongoing tournament results.",
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
