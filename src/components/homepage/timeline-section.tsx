"use client";

/**
 * TimelineSection — Zigzag timeline where cards alternate above and below
 * a central horizontal line. Fully contained within the container width.
 * Mobile: vertical stacked cards.
 */

import { motion } from "framer-motion";
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
    label: "Cemento",
  },
  clay: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    label: "Terra Rossa",
  },
  grass: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    label: "Erba",
  },
  indoor: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
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
    period: "Gen",
    title: "Stagione Australiana",
    highlight: "Australian Open",
    description: "Si parte in Australia sul cemento, con il primo Slam dell'anno.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Mar",
    title: "Sunshine Double",
    highlight: "Indian Wells & Miami",
    description: "Due Masters 1000 consecutivi sul cemento americano.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Apr—Mag",
    title: "La Terra Rossa",
    highlight: "Roland Garros",
    description: "Monte Carlo, Madrid, Roma e il Roland Garros a Parigi.",
    surface: "clay",
    icon: CloudSun,
  },
  {
    period: "Giu—Lug",
    title: "Stagione sull'Erba",
    highlight: "Wimbledon",
    description: "Brevissima ma prestigiosissima. Culmine storico a Londra.",
    surface: "grass",
    icon: Leaf,
  },
  {
    period: "Ago—Set",
    title: "Estate Americana",
    highlight: "US Open",
    description: "L'ultimo grande Slam della stagione regolare a New York.",
    surface: "hard",
    icon: Sun,
  },
  {
    period: "Ott—Nov",
    title: "Finale Indoor",
    highlight: "ATP Finals",
    description: "Asia, Europa indoor e il gran finale a Torino.",
    surface: "indoor",
    icon: Snowflake,
  },
];

/** Shared card component for both above/below placement */
function TimelineCard({
  event,
  idx,
}: {
  event: TimelineEvent;
  idx: number;
}) {
  const surface = SURFACE_COLORS[event.surface];

  return (
    <AnimatedSection delay={0.1 + idx * 0.08}>
      <div
        className={cn(
          "rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
          surface.bg,
          surface.border
        )}
      >
        {/* Period badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-md font-bold mb-2",
            surface.bg,
            surface.text
          )}
        >
          <event.icon className="h-3 w-3" />
          {event.period}
        </span>

        <h3 className="text-label-lg text-deep-navy leading-tight">
          {event.title}
        </h3>
        <p className={cn("text-label-lg font-bold mb-1", surface.text)}>
          {event.highlight}
        </p>
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
              La stagione tennistica dura circa 11 mesi e segue l&apos;estate in
              giro per il mondo, cambiando superficie di gioco. Ecco le tappe
              fondamentali:
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
                <span className={cn("w-2.5 h-2.5 rounded-full", style.dot)} />
                <span className="text-label-md text-deep-navy font-medium">
                  {style.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Mobile: vertical stack */}
        <div className="md:hidden flex flex-col gap-4">
          {EVENTS.map((event, idx) => (
            <TimelineCard key={event.period} event={event} idx={idx} />
          ))}
        </div>

        {/* Desktop: zigzag timeline */}
        <div className="hidden md:block relative">
          {/* 6-column grid */}
          <div className="grid grid-cols-6 gap-x-3">
            {/* Row 1: cards ABOVE the line (even indices: 0, 2, 4) */}
            {EVENTS.map((event, idx) => (
              <div key={`top-${event.period}`} className="pb-3">
                {idx % 2 === 0 ? (
                  <TimelineCard event={event} idx={idx} />
                ) : (
                  <div aria-hidden className="invisible">
                    <TimelineCard event={event} idx={idx} />
                  </div>
                )}
              </div>
            ))}

            {/* Row 2: the connecting line with dots */}
            {EVENTS.map((event, idx) => {
              const surface = SURFACE_COLORS[event.surface];
              return (
                <div
                  key={`dot-${event.period}`}
                  className="relative flex items-center justify-center h-6"
                >
                  {/* Horizontal line segment */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-border-subtle" />
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, type: "spring" }}
                    className={cn(
                      "relative z-10 w-5 h-5 rounded-full border-[3px] border-surface-gray",
                      surface.dot
                    )}
                  />
                </div>
              );
            })}

            {/* Row 3: cards BELOW the line (odd indices: 1, 3, 5) */}
            {EVENTS.map((event, idx) => (
              <div key={`bottom-${event.period}`} className="pt-3">
                {idx % 2 !== 0 ? (
                  <TimelineCard event={event} idx={idx} />
                ) : (
                  <div aria-hidden className="invisible">
                    <TimelineCard event={event} idx={idx} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
