"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Infinity, Hourglass, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollCue } from "./scroll-cue";
import { useTranslation } from "@/providers/locale-provider";

/* ------------------------------------------------------------------ */
/*  Stat highlight cards                                               */
/* ------------------------------------------------------------------ */
interface Highlight {
  icon: LucideIcon;
  value: string;
  label: string;
  desc: string;
  /** Text alignment: left-column cards align right (toward the circle), right-column cards align left */
  align: "left" | "right";
  /** Scroll progress range in which the card fades/floats in */
  scrollRange: [number, number];
}

/** Non-text card metadata; text comes from the locale dictionary by index. */
const HIGHLIGHT_META = [
  { icon: Award, align: "right", scrollRange: [0.1, 0.3] },
  { icon: Clock, align: "left", scrollRange: [0.2, 0.4] },
  { icon: Infinity, align: "right", scrollRange: [0.3, 0.5] },
  { icon: Hourglass, align: "left", scrollRange: [0.4, 0.6] },
] as const;

/**
 * Single stat card bound to the section scroll progress.
 * Extracted as a component so useTransform is called at the top level
 * instead of inside a .map() callback.
 */
function HighlightCard({
  item,
  progress,
}: {
  item: Highlight;
  progress: MotionValue<number>;
}) {
  const cardOpacity = useTransform(progress, item.scrollRange, [0, 1]);
  const cardY = useTransform(progress, item.scrollRange, [40, 0]);

  return (
    <motion.div
      style={{ opacity: cardOpacity, y: cardY }}
      className="w-full max-w-[300px] rounded-3xl bg-surface-white/85 backdrop-blur-xl border border-border-subtle p-6 shadow-hover"
    >
      <div
        className={cn(
          "flex flex-col",
          item.align === "right" ? "items-end text-right" : "items-start text-left"
        )}
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-baseline-lime mb-3 shadow-[0_0_16px_rgba(223,255,0,0.35)]">
          <item.icon className="h-5 w-5 text-deep-navy" />
        </div>
        <h3 className="text-[32px] font-heading font-extrabold text-foreground leading-none mb-1">
          {item.value}
        </h3>
        <p className="text-title-sm text-foreground font-bold mb-2">{item.label}</p>
        <p className="text-label-md text-text-muted">{item.desc}</p>
      </div>
    </motion.div>
  );
}

export function RankingSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  const highlights: Highlight[] = HIGHLIGHT_META.map((meta, i) => ({
    icon: meta.icon,
    align: meta.align,
    scrollRange: [...meta.scrollRange] as [number, number],
    ...t.home.ranking.highlights[i],
  }));
  /** Column split for the desktop grid: [0, 2] left of the circle, [1, 3] right. */
  const leftCards = [highlights[0], highlights[2]];
  const rightCards = [highlights[1], highlights[3]];
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Calculate the circumference of the circle
  const radius = 200;
  const circumference = 2 * Math.PI * radius;

  // Finish drawing the circle earlier (at 70% of scroll progress) so the user can see it complete
  const strokeDashoffset = useTransform(scrollYProgress, [0, 0.7], [circumference, 0]);

  // Opacity fade in for central text
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  return (
    <section
      id="ranking"
      ref={containerRef}
      className="relative w-full md:h-[300vh] bg-surface-white"
    >
      {/* --- DESKTOP STICKY LAYOUT --- */}
      <div className="hidden md:flex sticky top-0 h-screen w-full flex-col items-center justify-center overflow-hidden pt-20">

        {/* Background Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="w-[800px] h-[800px] rounded-full border-[1px] border-deep-navy" />
            <div className="absolute w-[1200px] h-[1200px] rounded-full border-[1px] border-deep-navy" />
        </div>

        {/*
          True 3-column grid (cards | circle | cards): columns cannot
          overlap the fixed-size circle at any viewport aspect ratio.
        */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-10 w-full max-w-[1400px] mx-auto px-6">

          {/* Left column: stacked cards, aligned toward the circle */}
          <div className="flex flex-col items-end gap-8 lg:gap-12 justify-self-end">
            {leftCards.map((item) => (
              <HighlightCard key={item.value} item={item} progress={scrollYProgress} />
            ))}
          </div>

          {/* Center column: animated SVG circle + central text */}
          <div className="relative w-[380px] h-[380px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            >
              {/* Background track */}
              <circle
                cx="250" cy="250" r={radius}
                stroke="currentColor"
                className="text-surface-gray"
                strokeWidth="4"
                fill="none"
              />
              {/* Foreground animated progress */}
              <motion.circle
                cx="250" cy="250" r={radius}
                stroke="currentColor"
                className="text-baseline-lime"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset
                }}
              />
            </svg>

            {/* Central Text Content */}
            <motion.div
              style={{ opacity: textOpacity, y: textY }}
              className="text-center max-w-xs z-10 p-8"
            >
              <div className="text-[70px] lg:text-[90px] font-heading font-extrabold text-foreground leading-none mb-2">
                ATP
              </div>
              <h2 className="text-title-lg text-foreground mb-4 uppercase tracking-widest">
                {t.home.ranking.title}
              </h2>
              <p className="text-body-md text-text-muted">
                {t.home.ranking.lead}
              </p>
            </motion.div>
          </div>

          {/* Right column: stacked cards, aligned toward the circle */}
          <div className="flex flex-col items-start gap-8 lg:gap-12 justify-self-start">
            {rightCards.map((item) => (
              <HighlightCard key={item.value} item={item} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Next-section cue */}
        <ScrollCue
          targetId="pyramid"
          label={t.home.ranking.scrollLabel}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        />
      </div>

      {/* --- MOBILE VERTICAL REEL LAYOUT --- */}
      <div className="md:hidden flex flex-col w-full py-20 px-6 gap-8 relative z-10">

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          className="text-center mb-6"
        >
          <div className="text-[70px] font-heading font-extrabold text-foreground leading-none mb-2">
            ATP
          </div>
          <h2 className="text-title-lg text-foreground mb-4 uppercase tracking-widest">
            {t.home.ranking.title}
          </h2>
          <p className="text-body-md text-text-muted">
            {t.home.ranking.lead}
          </p>
        </motion.div>

        {/* Vertical Cards */}
        {highlights.map((item, idx) => (
          <motion.div
            key={`mobile-${idx}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            className="w-full rounded-3xl bg-surface-white/85 backdrop-blur-xl border border-border-subtle p-6 shadow-ambient flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Subtle lime glow in the corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-baseline-lime/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-baseline-lime mb-4 text-deep-navy shadow-[0_0_16px_rgba(223,255,0,0.35)]">
              <item.icon className="h-7 w-7" />
            </div>
            <h3 className="text-[48px] font-heading font-extrabold text-foreground leading-none mb-2">
              {item.value}
            </h3>
            <p className="text-title-md text-foreground font-bold mb-3">
              {item.label}
            </p>
            <p className="text-body-md text-text-muted">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
