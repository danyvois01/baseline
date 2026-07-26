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
import { useTranslation } from "@/providers/locale-provider";

export default function Home() {
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);

  /** Section metadata used by the floating navigator */
  const sections = [
    { id: "hero", label: t.home.sections.intro },
    { id: "ranking", label: t.home.sections.ranking },
    { id: "pyramid", label: t.home.sections.tournaments },
    { id: "timeline", label: t.home.sections.season },
    { id: "scoring", label: t.home.sections.scoring },
    { id: "glossary", label: t.home.sections.glossary },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      {/* Floating section navigator (hidden on mobile) */}
      <SectionNavigator sections={sections} />

      <main ref={mainRef} className="flex-1 flex flex-col w-full relative">
        <HeroSection />
        <RankingSection />
        <PyramidSection />
        <TimelineSection />
        <ScoringSection />
        <GlossarySection />

        {/* CTA Banner — clean, light, on-brand */}
        <section id="cta" className="relative w-full px-4 sm:px-6 pb-16 sm:pb-20 mt-16 sm:mt-24 z-10">
          <div className="w-full max-w-2xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-heading font-extrabold text-foreground leading-[1.1] tracking-tight mb-4">
              {t.home.cta.titleLine1}{" "}
              {t.home.cta.titleLine2}
            </h2>

            <p className="text-body-md text-text-muted max-w-md mx-auto mb-8 leading-relaxed">
              {t.home.cta.body}
            </p>

            <Link
              href="/live"
              className="group inline-flex items-center gap-2.5 rounded-full bg-baseline-lime px-7 py-3.5 text-sm sm:text-base font-black text-deep-navy transition-all duration-300 hover:shadow-[0_0_40px_rgba(223,255,0,0.45)] hover:-translate-y-1"
            >
              <Zap className="h-5 w-5 text-deep-navy group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span className="uppercase tracking-wide">{t.home.cta.button}</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
