"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Crown,
  Medal,
  Award,
  Star,
  Layers,
  Footprints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";
import type { Dictionary } from "@/lib/i18n";
import { ScrollCue } from "./scroll-cue";

/**
 * Tier tones form a tonal navy scale: full deep-navy at the top of the
 * pyramid (Grand Slam) fading toward the base. The floating ATP Finals
 * crown and the active tier are highlighted in baseline-lime.
 */
/** Non-text tier metadata; names/taglines/descriptions come from the locale dictionary by index. */
const TIER_META = [
  { id: "finals", points: "1500", icon: Crown, tone: "bg-baseline-lime", w: "w-[20%]" },
  { id: "slam", points: "2000", icon: Medal, tone: "bg-deep-navy", w: "w-[36%]" },
  { id: "masters", points: "1000", icon: Award, tone: "bg-deep-navy/85", w: "w-[52%]" },
  { id: "500", points: "500", icon: Star, tone: "bg-deep-navy/70", w: "w-[68%]" },
  { id: "250", points: "250", icon: Layers, tone: "bg-deep-navy/55", w: "w-[84%]" },
  { id: "challenger", points: "175", icon: Footprints, tone: "bg-deep-navy/40", w: "w-[100%]" },
] as const;

type Tier = (typeof TIER_META)[number] & Dictionary["home"]["pyramid"]["tiers"][number];

// Componente per il singolo blocco di testo che aggiorna lo stato "active" quando entra nel viewport
function TierTextBlock({
  tier,
  pointsToWinner,
  setActiveTier,
}: {
  tier: Tier;
  pointsToWinner: string;
  setActiveTier: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Il margine negativo fa in modo che l'elemento sia considerato "in view" solo quando è vicino al centro dello schermo
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveTier(tier.id);
    }
  }, [isInView, tier.id, setActiveTier]);

  return (
    <div ref={ref} className="min-h-[100dvh] flex flex-col justify-center py-16 md:py-20">
      <motion.div
        className={cn(
          "bg-surface-white/85 backdrop-blur-md border border-border-subtle rounded-3xl p-6 md:p-12 shadow-xl transition-all duration-700",
          isInView ? "opacity-100 scale-100" : "opacity-30 scale-95"
        )}
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-deep-navy text-baseline-lime">
            <tier.icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-[40px] font-heading font-extrabold text-foreground leading-none mb-2">{tier.name}</h3>
            <p className="text-label-lg font-bold uppercase tracking-wider text-primary-olive">{tier.tagline}</p>
          </div>
        </div>

        <p className="text-body-xl text-foreground leading-relaxed mb-8">
          {tier.description}
        </p>

        <div className="inline-flex items-center gap-3 bg-surface-gray rounded-full px-5 py-2 border border-border-subtle">
          <span className="text-label-md font-medium text-text-muted">{pointsToWinner}</span>
          <span className="text-headline-sm font-black text-primary-olive">{tier.points}</span>
        </div>
      </motion.div>
    </div>
  );
}

export function PyramidSection() {
  const { t } = useTranslation();
  const [activeTier, setActiveTier] = useState<string>("finals");

  const tiers: Tier[] = TIER_META.map((meta, i) => ({
    ...meta,
    ...t.home.pyramid.tiers[i],
  }));

  return (
    <section id="pyramid" className="relative w-full bg-surface-white">

      {/* Intro Titolo (Full Screen) */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
        <h2 className="text-[50px] md:text-[70px] font-heading font-extrabold text-foreground leading-none mb-8">
          {t.home.pyramid.title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-6 text-[18px] text-text-muted">
          <p className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-4">
            {t.home.pyramid.lead}
          </p>
          <p className="leading-relaxed">
            {t.home.pyramid.intro1}
          </p>
          <p className="leading-relaxed">
            {t.home.pyramid.intro2BeforeSlam}<strong className="text-foreground">Grand Slam</strong>{t.home.pyramid.intro2AfterSlam}<strong className="text-primary-olive">ATP Finals</strong>{t.home.pyramid.intro2AfterFinals}
          </p>
        </div>

        {/* Scroll indicator (like Hero) */}
        <ScrollCue
          targetId="pyramid-content"
          label={t.home.pyramid.exploreLabel}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        />
      </div>

      <div id="pyramid-content" className="max-w-[1400px] mx-auto px-6 relative flex flex-col lg:flex-row items-start">

        {/* Sinistra: Piramide Grafica (Sticky) */}
        <div className="hidden lg:flex lg:w-1/2 sticky top-0 pt-24 h-screen items-center justify-center p-12">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-2">
            {tiers.map((tier, index) => {
              const activeIndex = tiers.findIndex((x) => x.id === activeTier);
              const isPassed = index <= activeIndex;
              const isActive = activeTier === tier.id;
              const isFinals = tier.id === "finals";

              return (
                <div
                  key={tier.id + "-graphic"}
                  className={cn(
                    "transition-all duration-500 ease-out flex items-center justify-center",
                    // The floating crown vs the pyramid tiers
                    isFinals
                      ? "h-16 w-16 rounded-full mb-8 relative"
                      : `h-12 rounded-lg mt-1 ${tier.w}`,
                    // Active tier is lime, passed tiers keep their navy tone, future tiers stay neutral
                    isActive
                      ? "bg-baseline-lime shadow-[0_0_30px_rgba(223,255,0,0.4)] scale-110 z-10"
                      : isPassed
                        ? `${tier.tone} opacity-95 scale-100`
                        : "bg-surface-gray border border-border-subtle scale-100 opacity-60"
                  )}
                >
                  {isActive || isPassed ? (
                    <span
                      className={cn(
                        "font-bold text-sm tracking-wider uppercase",
                        isActive || isFinals ? "text-deep-navy" : "text-white drop-shadow-md"
                      )}
                    >
                      {isFinals ? <Crown className="w-8 h-8" /> : tier.name}
                    </span>
                  ) : (
                    isFinals && <Crown className="w-8 h-8 text-text-muted opacity-60" />
                  )}

                  {/* Visual connector line for the floating crown */}
                  {isFinals && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-6 border-l border-dashed border-border-subtle" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Destra: Testi a scorrimento */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="pb-[50vh]">
            {tiers.map((tier) => (
              <TierTextBlock
                key={tier.id}
                tier={tier}
                pointsToWinner={t.home.pyramid.pointsToWinner}
                setActiveTier={setActiveTier}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Next-section cue */}
      <div className="relative flex justify-center pb-12 -mt-[30vh]">
        <ScrollCue targetId="timeline" label={t.home.pyramid.scrollNext} />
      </div>
    </section>
  );
}
