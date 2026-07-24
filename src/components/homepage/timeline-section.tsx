"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, type MotionValue } from "framer-motion";
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
  },
  clay: {
    bg: "bg-orange-50 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-500/30",
    dot: "bg-orange-500",
    dotHex: "#F97316",
  },
  grass: {
    bg: "bg-green-50 dark:bg-green-500/15",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-500/30",
    dot: "bg-green-500",
    dotHex: "#22C55E",
  },
  indoor: {
    bg: "bg-purple-50 dark:bg-purple-500/15",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-500/30",
    dot: "bg-purple-500",
    dotHex: "#A855F7",
  },
} as const;

type SurfaceType = keyof typeof SURFACE_COLORS;

interface TimelineEvent {
  period: string;
  title: string;
  highlight: string;
  description: string;
  surface: SurfaceType;
}

/** Non-text event metadata; period/title/highlight/description come from the locale dictionary by index. */
const EVENT_SURFACES: SurfaceType[] = ["hard", "hard", "clay", "grass", "hard", "indoor"];

/** Refined card: neutral border + a colored side bar on the inner edge. */
function TimelineCardBody({
  event,
  side,
  compact = false,
}: {
  event: TimelineEvent;
  /** Which edge faces the central line (gets the colored bar) */
  side: "left" | "right";
  /** Compact type scale for the pinned desktop frame */
  compact?: boolean;
}) {
  const surface = SURFACE_COLORS[event.surface];

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border-subtle bg-surface-white/90 backdrop-blur-xl shadow-ambient overflow-hidden",
        compact ? "p-4 xl:p-5" : "p-5 md:p-8"
      )}
    >
      {/* Colored side bar on the edge facing the timeline */}
      <div
        className={cn(
          "absolute top-3 bottom-3 w-1 rounded-full",
          surface.dot,
          side === "left" ? "right-1.5" : "left-1.5"
        )}
      />
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full font-bold",
          compact ? "px-3 py-1 text-[11px] mb-2" : "px-4 py-1.5 text-label-md mb-3",
          surface.bg,
          surface.text
        )}
      >
        {event.period}
      </span>
      <h3
        className={cn(
          "font-heading font-extrabold text-foreground leading-tight",
          compact ? "text-lg xl:text-xl mb-1" : "text-2xl md:text-3xl mb-2"
        )}
      >
        {event.title}
      </h3>
      <p className={cn("font-bold", compact ? "text-sm mb-1.5" : "text-title-sm md:text-label-lg mb-3", surface.text)}>
        {event.highlight}
      </p>
      <p className={cn("text-text-muted", compact ? "text-[13px] leading-snug" : "text-body-md leading-relaxed")}>
        {event.description}
      </p>
    </div>
  );
}

/**
 * Desktop pinned-frame card: fades/slides in when section progress
 * crosses its range and stays visible afterwards (building the year).
 */
function PinnedTimelineCard({
  event,
  idx,
  progress,
}: {
  event: TimelineEvent;
  idx: number;
  progress: MotionValue<number>;
}) {
  const isLeft = idx % 2 === 0;
  const surface = SURFACE_COLORS[event.surface];

  // Sequential reveal windows: card i appears while progress crosses its range
  const start = 0.08 + idx * 0.13;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [isLeft ? -40 : 40, 0]);
  const dotScale = useTransform(progress, [start, end], [0, 1]);

  return (
    <div
      className={cn("relative min-h-0 flex items-center", isLeft ? "justify-self-end" : "justify-self-start")}
      style={{
        gridColumn: isLeft ? 1 : 2,
        gridRow: `${idx + 1} / span 2`,
      }}
    >
      <motion.div style={{ opacity, x }} className="max-w-[440px]">
        <TimelineCardBody event={event} side={isLeft ? "left" : "right"} compact />
      </motion.div>

      {/* Node on the central line */}
      <motion.div
        style={{ scale: dotScale, backgroundColor: surface.dotHex }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-surface-white shadow-md z-20",
          isLeft ? "-right-8 translate-x-1/2" : "-left-8 -translate-x-1/2"
        )}
      />
    </div>
  );
}

/** Mobile card with in-view reveal (free scrolling, no pinning on touch). */
function MobileTimelineItem({ event }: { event: TimelineEvent }) {
  const surface = SURFACE_COLORS[event.surface];
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  return (
    <div ref={ref} className="flex w-full relative pl-16 min-h-[240px] items-center">
      {/* Node on the left line */}
      <div className="absolute left-[24px] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-6 h-6 rounded-full border-[3px] border-surface-white shadow-md z-20"
          style={{ backgroundColor: surface.dotHex }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50, y: 20 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 50, y: 20 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="w-full max-w-[480px]"
      >
        <TimelineCardBody event={event} side="right" />
      </motion.div>
    </div>
  );
}

export function TimelineSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  const events: TimelineEvent[] = EVENT_SURFACES.map((surface, i) => ({
    surface,
    ...t.home.timeline.events[i],
  }));

  // Pinned scrollytelling progress (desktop): frame releases after the last event
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const lineFill = useTransform(smoothProgress, [0.05, 0.9], ["0%", "100%"]);

  // Mobile free-scroll progress for the left line
  const mobileRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileRef,
    offset: ["start center", "end center"],
  });
  const mobileLineFill = useTransform(
    useSpring(mobileProgress, { stiffness: 50, damping: 20, restDelta: 0.001 }),
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full bg-surface-white md:h-[400vh]"
    >
      {/* --- DESKTOP PINNED FRAME --- */}
      <div className="hidden md:flex sticky top-0 h-screen w-full flex-col overflow-hidden pt-24 pb-4">

        {/* Header + legend */}
        <div className="text-center px-6 shrink-0">
          <h2 className="text-[40px] lg:text-[56px] font-heading font-extrabold text-foreground mb-3 leading-none">
            {t.home.timeline.title}
          </h2>
          <p className="text-body-lg text-text-muted max-w-3xl mx-auto mb-5">
            {t.home.timeline.lead}
          </p>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
            {Object.entries(SURFACE_COLORS).map(([key, style]) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 rounded-full bg-surface-white/95 backdrop-blur-md border border-border-subtle px-3 py-1.5 shadow-md"
              >
                <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                <span className="text-[11px] text-foreground font-extrabold uppercase tracking-widest">
                  {t.home.timeline.surfaces[key as SurfaceType]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline area */}
        <div className="relative flex-1 w-full max-w-[1280px] mx-auto px-6 mt-6 min-h-0">
          {/* Central line track */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-surface-gray rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-baseline-lime"
              style={{ height: lineFill }}
            />
          </div>

          {/* Staggered 2-column grid: even events left, odd events right */}
          <div className="grid h-full grid-cols-2 gap-x-16" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
            {events.map((event, idx) => (
              <PinnedTimelineCard key={event.period} event={event} idx={idx} progress={smoothProgress} />
            ))}
          </div>
        </div>

        {/* Next-section cue */}
        <div className="shrink-0 flex justify-center pt-2">
          <ScrollCue targetId="scoring" label={t.home.timeline.scrollNext} />
        </div>
      </div>

      {/* --- MOBILE FREE-SCROLLING LAYOUT --- */}
      <div className="md:hidden w-full py-20 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[50px] font-heading font-extrabold text-foreground mb-6 leading-none">
            {t.home.timeline.title}
          </h2>
          <p className="text-body-xl text-text-muted max-w-3xl mx-auto">
            {t.home.timeline.lead}
          </p>
        </div>

        {/* Surface legend */}
        <div className="sticky top-28 z-40 flex flex-wrap justify-center gap-2 mb-16">
          {Object.entries(SURFACE_COLORS).map(([key, style]) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-surface-white/95 backdrop-blur-md border border-border-subtle px-3 py-1.5 shadow-md"
            >
              <span className={cn("w-2 h-2 rounded-full", style.dot)} />
              <span className="text-[11px] text-foreground font-extrabold uppercase tracking-widest">
                {t.home.timeline.surfaces[key as SurfaceType]}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div ref={mobileRef} className="relative flex flex-col gap-12">
          {/* Left line track */}
          <div className="absolute top-0 bottom-0 left-[24px] -translate-x-1/2 w-1.5 bg-surface-gray rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-baseline-lime"
              style={{ height: mobileLineFill }}
            />
          </div>

          {events.map((event) => (
            <MobileTimelineItem key={event.period} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
