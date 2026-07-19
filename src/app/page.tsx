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
import { SectionNavigator } from "@/components/homepage/section-navigator";
import { Zap } from "lucide-react";

/** Section metadata used by the floating navigator */
const SECTIONS = [
  { id: "hero", label: "Intro" },
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

      {/* Floating section navigator (hidden on mobile) */}
      <SectionNavigator sections={SECTIONS} />

      <main ref={mainRef} className="flex-1 flex flex-col w-full relative">
        <HeroSection />
        <RankingSection />
        <PyramidSection />
        <TimelineSection />
        <ScoringSection />
        <GlossarySection />

        {/* CTA Banner */}
        <section className="relative w-full px-4 sm:px-6 pb-12 sm:pb-16 mt-12 sm:mt-16 z-10">
          <div className="relative w-full max-w-5xl mx-auto bg-deep-navy rounded-[32px] sm:rounded-[48px] py-16 sm:py-20 overflow-hidden shadow-2xl border border-surface-white/10">
            {/* Sfondo dinamico pulito (Navy) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-[100px]" />
            </div>
            
            {/* Elementi grafici decorativi neutri */}
            <div className="absolute top-0 right-0 w-48 h-48 border-[30px] border-surface-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="relative mx-auto max-w-[800px] px-6 text-center z-10 flex flex-col items-center">
              <div className="inline-block bg-white/5 backdrop-blur-md px-5 py-1.5 rounded-full mb-6 border border-white/10 shadow-sm">
                <span className="text-[#DFFF00] font-bold tracking-widest uppercase text-xs">Join the Tour</span>
              </div>
              
              <h2 className="text-[36px] sm:text-[48px] md:text-[60px] font-heading font-black text-white mb-5 leading-[1.1] tracking-tight">
                Pronto a seguire <br className="hidden sm:block"/> l&apos;azione?
              </h2>
              
              <p className="text-base sm:text-lg text-surface-gray mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                Ora che conosci le basi e i segreti del circuito, sei pronto a tuffarti nella stagione. 
                Esplora le classifiche aggiornate.
              </p>
              
              <Link
                href="/live"
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#DFFF00] px-8 py-4 text-base sm:text-lg font-black text-deep-navy transition-all duration-300 hover:shadow-[0_0_30px_rgba(223,255,0,0.3)] hover:scale-105 hover:bg-white"
              >
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-deep-navy group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 uppercase tracking-wide">Esplora i Live Rankings</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
