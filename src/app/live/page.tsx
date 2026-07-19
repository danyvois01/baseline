import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { LiveRankingEntry, MOCK_LIVE_RANKINGS } from "@/lib/mock-data";
import { LiveClient } from "./live-client";
import { fetchLiveRankings } from "@/services/scraper/live-rankings";

/**
 * Live ATP Rankings — /live page.
 * Displays the live rankings table with real-time point projections.
 */

export const metadata: Metadata = {
  title: "Live ATP Rankings — Baseline",
  description:
    "Live ATP Tennis Rankings — Real-time point projections based on ongoing tournament results.",
};

const countryCodeMap: Record<string, string> = {
  "ITA": "it", "ESP": "es", "SRB": "rs", "GER": "de", "RUS": "ru",
  "USA": "us", "AUS": "au", "CAN": "ca", "NOR": "no", "BUL": "bg",
  "GRE": "gr", "POL": "pl", "FRA": "fr", "ARG": "ar", "GBR": "gb",
  "CHI": "cl", "KAZ": "kz", "CZE": "cz", "NED": "nl", "DEN": "dk",
  "SUI": "ch", "AUT": "at", "CRO": "hr", "BRA": "br", "JPN": "jp",
  "CHN": "cn", "POR": "pt", "SVK": "sk", "HUN": "hu", "SWE": "se",
  "FIN": "fi", "ROU": "ro", "BEL": "be", "RSA": "za", "KOR": "kr",
  "COL": "co", "ECU": "ec", "PER": "pe", "URU": "uy", "PAR": "py",
  "MEX": "mx", "DOM": "do", "NZL": "nz", "IND": "in", "EGY": "eg",
  "TUN": "tn", "ALG": "dz", "MAR": "ma", "TUR": "tr", "CYP": "cy",
  "GEO": "ge", "ARM": "am", "AZE": "az", "UKR": "ua", "BLR": "by",
  "MDA": "md", "LTU": "lt", "LAT": "lv", "EST": "ee", "IRL": "ie",
  "LUX": "lu", "MON": "mc", "TPE": "tw", "BIH": "ba", "ISR": "il"
};

export default async function LivePage() {
  let rankings: LiveRankingEntry[] = [];
  let lastUpdated = "N/A";

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    rankings = MOCK_LIVE_RANKINGS;
    lastUpdated = "Mock Data";
  } else {
    try {
      const data = await fetchLiveRankings();
    
    rankings = data.entries.map((entry) => ({
      rank: entry.rank,
      points: entry.points,
      player: {
        id: entry.player.id,
        name: entry.player.name,
        nationality: entry.player.nationality,
        countryCode: countryCodeMap[entry.player.nationality] || "un",
        age: entry.player.age,
        initials: entry.player.name.split(' ').map(n => n[0]).join('').substring(0, 2)
      },
      liveStatus: {
        isActive: entry.liveStatus?.isActive || false,
        tournament: entry.liveStatus?.tournament || "",
        stage: entry.liveStatus?.stage || ""
      },
      movement: {
        type: entry.rankChangeDirection === "new" ? "nmr" : entry.rankChangeDirection as any,
        value: entry.rankChange || 0 // Correctly use rank change (positions moved)
      },
      // officialPoints = livePoints - pointsDiff
      officialPoints: entry.points - (entry.pointsDiff || 0),
      pointsDiff: entry.pointsDiff || 0,
      nextMatchPoints: entry.nextMatchPoints || entry.points,
      maxPoints: entry.maxPoints || entry.points,
      bestRanking: entry.bestRanking || entry.rank
    }));

    const date = new Date(data.lastUpdated);
    lastUpdated = date.toLocaleString('en-US', { timeZone: 'Europe/Rome', weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Failed to fetch live rankings, falling back to empty", error);
      rankings = [];
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <LiveClient initialRankings={rankings} lastUpdated={lastUpdated} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
