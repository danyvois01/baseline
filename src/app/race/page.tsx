import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { RaceClient } from "./race-client";
import { fetchRaceRankings } from "@/services/scraper/race-rankings";
import { MOCK_RACE_RANKINGS, MOCK_RACE_SUMMARY } from "@/lib/mock-data-race";

/**
 * Race to Turin — Rankings page.
 * Displays the Race to Turin standings with summary cards and qualification status.
 */

export const metadata: Metadata = {
  title: "Race to Turin — Baseline",
  description:
    "Track the Race to Turin — ATP Finals qualification standings, cut-off projections, and qualified players.",
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

export default async function RacePage() {
  let summary: any;
  let mappedEntries: any[] = [];
  let displayUpdated = "N/A";

  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    summary = MOCK_RACE_SUMMARY;
    mappedEntries = MOCK_RACE_RANKINGS;
    displayUpdated = "Mock Data";
  } else {
    try {
      const data = await fetchRaceRankings();

      mappedEntries = data.entries.map((entry) => ({
        ...entry,
        player: {
          ...entry.player,
          countryCode: countryCodeMap[entry.player.nationality] || "un",
        }
      }));

      summary = data.summary;
      const date = new Date(data.lastUpdated);
      displayUpdated = date.toLocaleString('en-US', { timeZone: 'Europe/Rome', weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Failed to fetch race rankings, falling back to mock", error);
      summary = MOCK_RACE_SUMMARY;
      mappedEntries = MOCK_RACE_RANKINGS;
      displayUpdated = "Mock Data";
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <RaceClient summary={summary} initialRankings={mappedEntries as any} lastUpdated={displayUpdated} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
