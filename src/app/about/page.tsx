import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { AboutContent } from "./about-content";

/**
 * About — /about page.
 * Brand story, data sourcing notes, and ATP non-affiliation disclaimer.
 */

export const metadata: Metadata = {
  title: "About — Baseline",
  description:
    "Baseline is an independent platform for real-time ATP tennis rankings: official standings, live projections and the Race to Turin.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[720px] px-6 py-8">
          <AboutContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
