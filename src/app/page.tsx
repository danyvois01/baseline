"use client";

/**
 * Homepage — "Baseline: Partiamo dalle Basi"
 *
 * Single-page education landing that walks the visitor through professional
 * tennis fundamentals: rankings, tournament hierarchy, the season calendar,
 * match scoring, and a glossary — all with scroll-triggered animations.
 */

import { useRef } from "react";
import { TopNavBar, Footer } from "@/components/layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { RankingSection } from "@/components/homepage/ranking-section";
import { PyramidSection } from "@/components/homepage/pyramid-section";
import { TimelineSection } from "@/components/homepage/timeline-section";
import { ScoringSection } from "@/components/homepage/scoring-section";
import { GlossarySection } from "@/components/homepage/glossary-section";
import { CtaSection } from "@/components/homepage/cta-section";
import { SectionNavigator } from "@/components/homepage/section-navigator";
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

        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
