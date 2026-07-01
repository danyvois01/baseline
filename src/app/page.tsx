"use client";

/**
 * Homepage — "Baseline: Partiamo dalle Basi"
 *
 * Single-page education landing that walks the visitor through professional
 * tennis fundamentals: rankings, tournament hierarchy, the season calendar,
 * match scoring, and a glossary — all with scroll-triggered animations.
 */

import { useRef } from "react";
import Link from "next/link";
import { TopNavBar, Footer } from "@/components/layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { RankingSection } from "@/components/homepage/ranking-section";
import { PyramidSection } from "@/components/homepage/pyramid-section";
import { TimelineSection } from "@/components/homepage/timeline-section";
import { ScoringSection } from "@/components/homepage/scoring-section";
import { GlossarySection } from "@/components/homepage/glossary-section";
import { SectionTabBar } from "@/components/homepage/section-tab-bar";
import { Zap } from "lucide-react";

/** Section metadata used by the sticky tab bar */
const SECTIONS = [
  { id: "ranking", label: "Ranking" },
  { id: "pyramid", label: "Tornei" },
  { id: "timeline", label: "Stagione" },
  { id: "scoring", label: "Punteggio" },
  { id: "glossary", label: "Dizionario" },
] as const;

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main ref={mainRef} className="flex-1">
        {/* 1 — Hero */}
        <HeroSection />

        {/* Sticky section tab bar — pins to top after scrolling past hero */}
        <SectionTabBar sections={SECTIONS} />

        {/* 2 — How rankings work */}
        <RankingSection />

        {/* 3 — Tournament pyramid */}
        <PyramidSection />

        {/* 4 — Season timeline */}
        <TimelineSection />

        {/* 5 — Match scoring */}
        <ScoringSection />

        {/* 6 — Tennis glossary */}
        <GlossarySection />

        {/* CTA Banner */}
        <section className="bg-surface-white">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="rounded-3xl bg-deep-navy p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-baseline-lime blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="text-headline-lg text-white mb-4">
                  Pronto a seguire l&apos;azione?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 max-w-md mx-auto">
                  Ora che conosci le basi e i segreti del circuito, sei pronto a
                  tuffarti nella stagione. Esplora le classifiche aggiornate e
                  scopri chi sta dominando il Tour.
                </p>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 rounded-full bg-baseline-lime px-8 py-3.5 text-sm font-bold text-deep-navy transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                >
                  <Zap className="h-4 w-4" />
                  Esplora i Live Rankings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
