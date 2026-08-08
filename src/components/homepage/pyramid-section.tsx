"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
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
import { CelebrationBurst } from "./celebration-burst";

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
          "bg-surface-white/85 backdrop-blur-md border border-border-subtle border-l-4 rounded-3xl p-6 md:p-12 shadow-xl transition-all duration-700",
          isInView
            ? "opacity-100 scale-100 border-l-baseline-lime"
            : "opacity-30 scale-95 border-l-deep-navy/20"
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
  const [activeTier, setActiveTier] = useState<string>("slam");
  const prefersReducedMotion = useReducedMotion();

  const tiers: Tier[] = TIER_META.map((meta, i) => ({
    ...meta,
    ...t.home.pyramid.tiers[i],
  }));

  /*
   * Narrative order: the pyramid builds top-down (Grand Slam → Challenger)
   * while scrolling; the ATP Finals crown is the grand finale — it drops
   * from above and lands on top of the completed pyramid.
   */
  const finalsTier = tiers[0];
  const rowTiers = tiers.slice(1); // slam … challenger (graphic top → bottom)
  const textTiers = [...rowTiers, finalsTier]; // reading order, crown last

  const activeNarrativeIndex = textTiers.findIndex((x) => x.id === activeTier);
  const finalsLanded = activeTier === "finals";

  return (
    <section id="pyramid" className="relative w-full bg-surface-white">

      {/*
        Intro title. Pinned briefly on desktop (tall wrapper + sticky frame)
        so the viewport rests on the text before releasing to the pyramid,
        matching the held-scroll feel of the other sections.
      */}
      <div className="relative md:h-[180vh]">
        <div className="md:sticky md:top-0 relative min-h-[70dvh] md:min-h-screen w-full flex flex-col items-center justify-center px-6 text-center md:text-center pt-24 md:pt-32 pb-16 md:pb-24">
          <h2 className="text-[36px] md:text-[70px] font-heading font-extrabold text-foreground leading-none mb-6 md:mb-8">
            {t.home.pyramid.title}
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 text-[15px] md:text-[18px] text-text-muted text-center">
            <p className="text-xl md:text-3xl font-heading font-extrabold text-foreground mb-3 md:mb-4 text-center">
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
      </div>

      <div id="pyramid-content" className="relative">
      <div className="max-w-[1400px] mx-auto px-6 relative flex flex-col lg:flex-row items-start">

        {/* Sinistra: Piramide Grafica (Sticky) */}
        <div className="hidden lg:flex lg:w-1/2 sticky top-0 pt-24 h-screen items-center justify-center p-12">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-2">

            {/*
              ATP Finals crown — the grand finale. Hidden while the pyramid
              builds; when its chapter arrives it drops from above with a
              spring and lands on top of the completed pyramid.
            */}
            <div className="h-16 mb-8 relative flex items-center justify-center">
              <motion.div
                initial={false}
                animate={
                  finalsLanded
                    ? {
                        y: 0,
                        opacity: 1,
                        scale: 1.1,
                        boxShadow: [
                          "0 0 30px rgba(223,255,0,0.4)",
                          "0 0 60px rgba(223,255,0,0.9)",
                          "0 0 30px rgba(223,255,0,0.4)",
                        ],
                      }
                    : { y: -140, opacity: 0, scale: 0.8 }
                }
                transition={
                  finalsLanded
                    ? {
                        type: "spring",
                        stiffness: 240,
                        damping: 14,
                        mass: 1.1,
                        boxShadow: { duration: 0.7, delay: 0.15, times: [0, 0.35, 1] },
                      }
                    : { duration: 0.3, ease: "easeIn" }
                }
                className="w-16 h-16 rounded-full bg-baseline-lime shadow-[0_0_30px_rgba(223,255,0,0.4)] flex items-center justify-center relative z-10"
              >
                <Crown className="w-8 h-8 text-deep-navy" />
                {/* Connector line to the pyramid below */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-6 border-l border-dashed border-border-subtle" />

                {/* One-shot celebration burst when the crown lands */}
                <AnimatePresence>
                  {finalsLanded && !prefersReducedMotion && <CelebrationBurst />}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Pyramid rows build top-down (Grand Slam → Challenger) */}
            {rowTiers.map((tier, index) => {
              const isBuilt = index <= activeNarrativeIndex;
              const isActive = activeTier === tier.id;

              return (
                <motion.div
                  key={tier.id + "-graphic"}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={cn(
                    "transition-[background-color,border-color,opacity,box-shadow] duration-500 ease-out flex items-center justify-center",
                    `h-12 rounded-lg mt-1 ${tier.w}`,
                    // Active tier is lime, built tiers keep their navy tone, future tiers stay neutral
                    isActive
                      ? "bg-baseline-lime shadow-[0_0_30px_rgba(223,255,0,0.4)] z-10"
                      : isBuilt || finalsLanded
                        ? `${tier.tone} opacity-95`
                        : "bg-surface-gray border border-border-subtle opacity-60"
                  )}
                >
                  {(isBuilt || finalsLanded) && (
                    <span
                      className={cn(
                        "font-bold text-sm tracking-wider uppercase",
                        isActive ? "text-deep-navy" : "text-white drop-shadow-md"
                      )}
                    >
                      {tier.name}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Destra: Testi a scorrimento (Grand Slam per primo, ATP Finals come finale) */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="pb-[35vh]">
            {textTiers.map((tier) => (
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

      {/*
        Next-section cue: sticks to the bottom of the viewport for the whole
        scroll of the pyramid content, then settles at the section's end.
      */}
      <div className="sticky bottom-6 z-20 flex justify-center pb-2 pointer-events-none">
        <ScrollCue
          targetId="timeline"
          label={t.home.pyramid.scrollNext}
          className="pointer-events-auto"
        />
      </div>
      </div>
    </section>
  );
}
