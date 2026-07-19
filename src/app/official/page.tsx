import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { MOCK_OFFICIAL_RANKINGS, OfficialRankingEntry } from "@/lib/mock-data-official";
import { OfficialClient } from "./official-client";
import { fetchOfficialRankings } from "@/services/scraper/rankings";

export const metadata: Metadata = {
  title: "Official ATP Rankings — Baseline",
  description:
    "The official weekly ATP Tour singles rankings — verified standings, points, and next-week projections.",
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

export default async function OfficialPage() {
  let rankings: OfficialRankingEntry[] = [];
  let lastUpdated = "N/A";

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    rankings = MOCK_OFFICIAL_RANKINGS;
    lastUpdated = "Mock Data";
  } else {
    try {
      const data = await fetchOfficialRankings();
      
      // Calculate projected rank changes
      const projectedRankings = [...data.entries].sort((a, b) => (b.nextWeekPoints || b.points) - (a.nextWeekPoints || a.points));
      const projectedRankMap = new Map<number, number>();
      projectedRankings.forEach((entry, index) => {
        projectedRankMap.set(entry.rank, index + 1); 
      });
    
    // Map scraper data to OfficialRankingEntry
    rankings = data.entries.map((entry) => ({
      rank: entry.rank,
      movement: {
        type: entry.rankChangeDirection === "new" ? "up" : entry.rankChangeDirection,
        value: entry.rankChange || 0,
      },
      player: {
        id: entry.player.id,
        name: entry.player.name,
        nationality: entry.player.nationality,
        countryCode: countryCodeMap[entry.player.nationality] || "un",
        age: entry.player.age,
      },
      points: entry.points,
      nextWeek: {
        points: entry.nextWeekPoints || entry.points,
        rankChange: entry.rank - (projectedRankMap.get(entry.rank) || entry.rank),
      },
    }));

    // Format date string nicely
    const date = new Date(data.lastUpdated);
    lastUpdated = date.toLocaleString('en-US', { timeZone: 'Europe/Rome', weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Failed to fetch rankings, falling back to mock", error);
      rankings = MOCK_OFFICIAL_RANKINGS;
      lastUpdated = "Mock Data";
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <OfficialClient initialRankings={rankings} lastUpdated={lastUpdated} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
