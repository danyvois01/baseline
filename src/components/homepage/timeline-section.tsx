"use client";

/**
 * TimelineSection — Serpentine vertical timeline with SVG curved path.
 * Cards alternate left/right along a winding path that flows downward.
 * Desktop: serpentine layout with animated SVG curve.
 * Mobile: vertical stacked cards with a straight line.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Sun, CloudSun, Leaf, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";

/** Surface colour tokens */
const SURFACE_COLORS = {
  hard: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    dotHex: "#3B82F6",
    label: "Cemento",
  },
  clay: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    dotHex: "#F97316",
    label: "Terra Rossa",
  },
  grass: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    dotHex: "#22C55E",
    label: "Erba",
  },
  indoor: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
    dotHex: "#A855F7",
    label: "Indoor",
  },
} as const;

type SurfaceType = keyof typeof SURFACE_COLORS;

interface TimelineEvent {
  period: string;
  title: string;
  highlight: string;
  description: string;
  surface: SurfaceType;
  icon: typeof Sun;
}

const EVENTS: TimelineEvent[] = [
  {
    period: "Gennaio",
    title: "Stagione Australiana",
    highlight: "Australian Open",
    description:
      "L'apertura della stagione sul cemento all'aperto, culminante con il primo Slam dell'anno a Melbourne.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Marzo",
    title: "Sunshine Double",
    highlight: "Indian Wells & Miami",
    description:
      "I primi due Masters 1000 della stagione nel deserto californiano e in Florida.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Aprile—Maggio",
    title: "La Terra Rossa Europea",
    highlight: "Roland Garros",
    description:
      "La grande stagione sul rosso con i Masters 1000 di Monte Carlo, Madrid e Roma, prima dello Slam di Parigi.",
    surface: "clay",
    icon: CloudSun,
  },
  {
    period: "Giugno—Luglio",
    title: "Stagione sull'Erba",
    highlight: "Wimbledon",
    description:
      "Il prestigioso e brevissimo swing sui prati inglesi che culmina nel Tempio di Londra.",
    surface: "grass",
    icon: Leaf,
  },
  {
    period: "Agosto—Settembre",
    title: "Summer Hardcourt Swing",
    highlight: "US Open",
    description:
      "La corsa sul cemento nordamericano con i Masters 1000 del Canada e Cincinnati, che lancia l'ultimo Slam a New York.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Ottobre—Novembre",
    title: "Asian Tour & Indoor Finals",
    highlight: "ATP Finals",
    description:
      "Il Masters 1000 di Shanghai, l'ultimo 1000 indoor a Parigi-Bercy e la resa dei conti tra i migliori 8 a Torino.",
    surface: "indoor",
    icon: Snowflake,
  },
];

/**
 * SVG serpentine path for 6 nodes.
 * viewBox: 800 x 840
 *
 * Node positions (x, y):
 *   0: (200, 60)   — left
 *   1: (600, 200)  — right
 *   2: (200, 340)  — left
 *   3: (600, 480)  — right
 *   4: (200, 620)  — left
 *   5: (600, 760)  — right
 */
const SERPENTINE_PATH =
  "M 200 60 C 200 130, 600 130, 600 200 C 600 270, 200 270, 200 340 C 200 410, 600 410, 600 480 C 600 550, 200 550, 200 620 C 200 690, 600 690, 600 760";

const NODE_POSITIONS = [
  { x: 200, y: 60 },
  { x: 600, y: 200 },
  { x: 200, y: 340 },
  { x: 600, y: 480 },
  { x: 200, y: 620 },
  { x: 600, y: 760 },
];

const SVG_WIDTH = 800;
const SVG_HEIGHT = 840;

/** Animated SVG serpentine path that draws itself on scroll */
function SerpentinePath() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Background path (subtle track) */}
      <path
        d={SERPENTINE_PATH}
        stroke="#E9ECEF"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />

      {/* Animated foreground path */}
      <motion.path
        d={SERPENTINE_PATH}
        stroke="#DFFF00"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.8, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Node dots */}
      {NODE_POSITIONS.map((pos, idx) => {
        const surface = SURFACE_COLORS[EVENTS[idx].surface];
        return (
          <motion.circle
            key={idx}
            cx={pos.x}
            cy={pos.y}
            r={10}
            fill={surface.dotHex}
            stroke="#F1F3F5"
            strokeWidth={4}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              delay: 0.5 + idx * 0.35,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          />
        );
      })}
    </svg>
  );
}

/** Card component for a timeline event */
function TimelineCard({
  event,
  idx,
}: {
  event: TimelineEvent;
  idx: number;
}) {
  const surface = SURFACE_COLORS[event.surface];

  return (
    <AnimatedSection delay={0.3 + idx * 0.15}>
      <div
        className={cn(
          "rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white/90 backdrop-blur-sm",
          surface.bg,
          surface.border
        )}
      >
        {/* Period badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-md font-bold mb-2",
            surface.bg,
            surface.text
          )}
        >
          <event.icon className="h-3 w-3" />
          {event.period}
        </span>

        {/* Season title */}
        <h3 className="text-label-lg text-deep-navy leading-tight">
          {event.title}
        </h3>

        {/* Tournament highlight */}
        <p className={cn("text-label-lg font-bold mb-1", surface.text)}>
          {event.highlight}
        </p>

        {/* Description */}
        <p className="text-body-sm text-text-muted leading-snug">
          {event.description}
        </p>
      </div>
    </AnimatedSection>
  );
}

export function TimelineSection() {
  return (
    <section id="timeline" className="bg-surface-gray scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
              <Calendar className="h-3.5 w-3.5 text-primary-olive" />
              <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                La Stagione
              </span>
            </div>
            <h2 className="text-headline-lg text-deep-navy mb-4">
              Un anno di Tennis
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
              La stagione tennistica dura circa 11 mesi e segue l&apos;estate
              in giro per il mondo, cambiando superficie di gioco. Ecco le
              tappe fondamentali:
            </p>
          </div>
        </AnimatedSection>

        {/* Surface legend */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(SURFACE_COLORS).map(([key, style]) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border-subtle px-4 py-2"
              >
                <span
                  className={cn("w-2.5 h-2.5 rounded-full", style.dot)}
                />
                <span className="text-label-md text-deep-navy font-medium">
                  {style.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Mobile: vertical timeline with line */}
        <div className="md:hidden flex flex-col gap-0">
          {EVENTS.map((event, idx) => {
            const surface = SURFACE_COLORS[event.surface];
            return (
              <div key={event.period} className="flex gap-4">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + idx * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className={cn(
                      "w-4 h-4 rounded-full border-[3px] border-surface-gray shrink-0 z-10",
                      surface.dot
                    )}
                  />
                  {idx < EVENTS.length - 1 && (
                    <div className="w-[2px] flex-1 bg-border-subtle min-h-[16px]" />
                  )}
                </div>

                {/* Card */}
                <div className="pb-6 flex-1">
                  <TimelineCard event={event} idx={idx} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: serpentine winding timeline */}
        <div
          className="hidden md:block relative"
          style={{ aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}` }}
        >
          {/* SVG curved path */}
          <SerpentinePath />

          {/* Cards positioned along the curve */}
          {EVENTS.map((event, idx) => {
            const node = NODE_POSITIONS[idx];
            const isLeft = node.x < 400;

            // Convert SVG coordinates to percentages
            const topPercent = (node.y / SVG_HEIGHT) * 100;

            // Left-side nodes: card goes to the right of the dot
            // Right-side nodes: card goes to the left of the dot
            const style: React.CSSProperties = isLeft
              ? {
                  position: "absolute",
                  top: `${topPercent}%`,
                  left: `${(node.x / SVG_WIDTH) * 100 + 4}%`,
                  transform: "translateY(-50%)",
                  maxWidth: "340px",
                }
              : {
                  position: "absolute",
                  top: `${topPercent}%`,
                  right: `${100 - (node.x / SVG_WIDTH) * 100 + 4}%`,
                  transform: "translateY(-50%)",
                  maxWidth: "340px",
                };

            return (
              <div key={event.period} style={style}>
                <TimelineCard event={event} idx={idx} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
