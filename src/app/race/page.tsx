import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { RaceClient } from "./race-client";
import { getRaceRankings } from "@/services/rankings-service";

/**
 * Race to Turin — Rankings page.
 * Displays the Race to Turin standings with summary cards and qualification status.
 */

export const metadata: Metadata = {
  title: "Race to Turin",
  description:
    "Track the Race to Turin — ATP Finals qualification standings, cut-off projections, and qualified players.",
  alternates: {
    canonical: "/race",
  },
};

export default async function RacePage() {
  const { rankings, summary, lastUpdated } = await getRaceRankings();

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <RaceClient
          summary={summary}
          initialRankings={rankings}
          lastUpdated={lastUpdated}
        />
      </main>

      <Footer />
    </div>
  );
}
