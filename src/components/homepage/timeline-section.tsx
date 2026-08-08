"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import { Sun, Sparkles, Trophy, Crown, Zap, Building2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";
import { ScrollCue } from "./scroll-cue";

/** Surface colour tokens */
const SURFACE_COLORS = {
  hard: {
    bg: "bg-blue-50 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
    dotHex: "#3B82F6",
    glow: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]",
  },
  clay: {
    bg: "bg-orange-50 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-500/30",
    dot: "bg-orange-500",
    dotHex: "#F97316",
    glow: "hover:shadow-[0_8px_30px_rgba(249,115,22,0.25)]",
  },
  grass: {
    bg: "bg-green-50 dark:bg-green-500/15",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-500/30",
    dot: "bg-green-500",
    dotHex: "#22C55E",
    glow: "hover:shadow-[0_8px_30px_rgba(34,197,94,0.25)]",
  },
  indoor: {
    bg: "bg-purple-50 dark:bg-purple-500/15",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-500/30",
    dot: "bg-purple-500",
    dotHex: "#A855F7",
    glow: "hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)]",
  },
} as const;

type SurfaceType = keyof typeof SURFACE_COLORS;

interface TimelineEvent {
  period: string;
  title: string;
  highlight: string;
  description: string;
  surface: SurfaceType;
  /** Grand Slam events get a larger, ringed node on the line. */
  isMajor: boolean;
  /** Navy chip icon (Pyramid-style: deep-navy circle, lime icon). */
  icon: LucideIcon;
}

/** Non-text event metadata; period/title/highlight/description come from the locale dictionary by index. */
const EVENT_META: { surface: SurfaceType; isMajor: boolean; icon: LucideIcon }[] = [
  { surface: "hard", isMajor: true, icon: Sun },          // Australian Open — summer opener
  { surface: "hard", isMajor: false, icon: Sparkles },    // Indian Wells & Miami — "Sunshine Double"
  { surface: "clay", isMajor: true, icon: Trophy },       // Roland Garros
  { surface: "grass", isMajor: true, icon: Crown },       // Wimbledon — "The Temple"
  { surface: "hard", isMajor: true, icon: Zap },          // US Open — New York night energy
  { surface: "indoor", isMajor: false, icon: Building2 }, // Asian/Indoor Finals — arenas
];

/** Clean card: neutral border, surface color carried by badge + highlight only. */
function TimelineCardBody({ event }: { event: TimelineEvent }) {
  const surface = SURFACE_COLORS[event.surface];

  return (
    <div
      className={cn(
        "relative rounded-3xl border border-border-subtle bg-surface-white/90 backdrop-blur-xl shadow-ambient p-5 md:p-8 transition-all duration-300 hover:-translate-y-1",
        surface.glow
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full font-bold px-4 py-1.5 text-label-md mb-4 bg-deep-navy text-white dark:bg-deep-navy dark:border dark:border-white/10">
        <span className={cn("w-1.5 h-1.5 rounded-full", surface.dot)} />
        {event.period}
      </span>

      {/* Header: navy icon chip (Pyramid-style) + title/highlight */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg bg-deep-navy text-baseline-lime shrink-0">
          <event.icon className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-foreground leading-tight text-2xl md:text-3xl mb-1">
            {event.title}
          </h3>
          <p className={cn("font-bold text-title-sm md:text-label-lg", surface.text)}>
            {event.highlight}
          </p>
        </div>
      </div>

      <p className="text-text-muted text-body-md leading-relaxed">
        {event.description}
      </p>
    </div>
  );
}

/** One timeline row: alternating card left/right of the central line (desktop). */
function TimelineItem({ event, idx }: { event: TimelineEvent; idx: number }) {
  // Pari a sinistra, dispari a destra
  const isLeft = idx % 2 === 0;
  const surface = SURFACE_COLORS[event.surface];

  const ref = useRef<HTMLDivElement>(null);
  // Attiviamo l'animazione quando l'elemento entra nella parte centrale dello schermo
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px", once: true });

  // Small lateral offset + slight scale: reads as a fade, not a slide.
  const xOffset = isLeft ? -24 : 24;
  const cardHidden = { opacity: 0, x: xOffset, y: 12, scale: 0.96 };
  const cardShown = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <div ref={ref} className="relative flex justify-center items-center w-full min-h-[300px] md:min-h-[45vh]">

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center">
        {/* Left Side (Card or Empty Space) */}
        <div className="w-1/2 flex justify-end pr-12 xl:pr-24">
          {isLeft && (
            <motion.div
              initial={cardHidden}
              animate={isInView ? cardShown : cardHidden}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="max-w-[480px]"
            >
              <TimelineCardBody event={event} />
            </motion.div>
          )}
        </div>

        {/* Center Node — Grand Slams get a bigger, ringed marker */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "rounded-full border-4 border-surface-white shadow-md z-20",
              event.isMajor ? "w-10 h-10" : "w-8 h-8"
            )}
            style={{
              backgroundColor: surface.dotHex,
              boxShadow: event.isMajor ? `0 0 0 3px ${surface.dotHex}66` : undefined,
            }}
          />
        </div>

        {/* Right Side (Empty Space or Card) */}
        <div className="w-1/2 flex justify-start pl-12 xl:pl-24">
          {!isLeft && (
            <motion.div
              initial={cardHidden}
              animate={isInView ? cardShown : cardHidden}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="max-w-[480px]"
            >
              <TimelineCardBody event={event} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex w-full relative pl-16">
        {/* Center Node Mobile */}
        <div className="absolute left-[24px] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "rounded-full border-[3px] border-surface-white shadow-md z-20",
              event.isMajor ? "w-8 h-8" : "w-6 h-6"
            )}
            style={{
              backgroundColor: surface.dotHex,
              boxShadow: event.isMajor ? `0 0 0 2px ${surface.dotHex}66` : undefined,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24, y: 12, scale: 0.96 }}
          animate={isInView ? cardShown : { opacity: 0, x: 24, y: 12, scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[480px]"
        >
          <TimelineCardBody event={event} />
        </motion.div>
      </div>

    </div>
  );
}

export function TimelineSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const events: TimelineEvent[] = EVENT_META.map((meta, i) => ({
    ...meta,
    ...t.home.timeline.events[i],
  }));

  // Line fill driven by section scroll (free-flowing, no pinning)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const lineFill = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full py-20 md:py-24 bg-surface-white"
    >
      <div className="mx-auto max-w-[1400px] px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[50px] md:text-[80px] font-heading font-extrabold text-foreground mb-6 leading-none">
            {t.home.timeline.title}
          </h2>
          <p className="text-body-xl text-text-muted max-w-3xl mx-auto">
            {t.home.timeline.lead}
          </p>
        </div>

        {/*
          Surface legend: static intro key under the header (not sticky —
          a floating legend overlapped the cards while scrolling; each card
          badge now carries its own surface dot anyway).
        */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 md:mb-24">
          {Object.entries(SURFACE_COLORS).map(([key, style]) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-surface-white border border-border-subtle px-3 py-1.5 shadow-sm"
            >
              <span className={cn("w-2 h-2 rounded-full", style.dot)} />
              <span className="text-[11px] md:text-xs text-foreground font-extrabold uppercase tracking-widest">
                {t.home.timeline.surfaces[key as SurfaceType]}
              </span>
            </div>
          ))}
        </div>

        {/* The Timeline */}
        <div className="relative flex flex-col gap-12 md:gap-8">

          {/* Central Line Track (Desktop) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-surface-gray rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-baseline-lime"
              style={{ height: lineFill }}
            />
          </div>

          {/* Traveling dot riding the leading edge of the fill (Desktop) */}
          {!prefersReducedMotion && (
            <motion.div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-baseline-lime shadow-[0_0_14px_rgba(223,255,0,0.9)] z-10 pointer-events-none"
              style={{ top: lineFill }}
              aria-hidden="true"
            />
          )}

          {/* Left Line Track (Mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-[24px] -translate-x-1/2 w-1.5 bg-surface-gray rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-baseline-lime"
              style={{ height: lineFill }}
            />
          </div>

          {/* Traveling dot (Mobile) */}
          {!prefersReducedMotion && (
            <motion.div
              className="md:hidden absolute left-[24px] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-baseline-lime shadow-[0_0_10px_rgba(223,255,0,0.9)] z-10 pointer-events-none"
              style={{ top: lineFill }}
              aria-hidden="true"
            />
          )}

          {/* Events */}
          {events.map((event, idx) => (
            <TimelineItem key={event.period} event={event} idx={idx} />
          ))}

        </div>

        {/* Next-section cue */}
        <div className="flex justify-center pt-12 md:pt-16">
          <ScrollCue targetId="scoring" label={t.home.timeline.scrollNext} />
        </div>
      </div>
    </section>
  );
}
