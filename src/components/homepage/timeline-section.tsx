"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Calendar, Sun, CloudSun, Leaf, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

/** Surface colour tokens */
const SURFACE_COLORS = {
  hard: {
    bg: "bg-blue-50 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
    dotHex: "#3B82F6",
    label: "Cemento",
  },
  clay: {
    bg: "bg-orange-50 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-500/30",
    dot: "bg-orange-500",
    dotHex: "#F97316",
    label: "Terra Rossa",
  },
  grass: {
    bg: "bg-green-50 dark:bg-green-500/15",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-500/30",
    dot: "bg-green-500",
    dotHex: "#22C55E",
    label: "Erba",
  },
  indoor: {
    bg: "bg-purple-50 dark:bg-purple-500/15",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-500/30",
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
}

const EVENTS: TimelineEvent[] = [
  {
    period: "Gennaio",
    title: "Stagione Australiana",
    highlight: "Australian Open",
    description: "L'apertura della stagione sul cemento all'aperto, culminante con il primo Slam dell'anno a Melbourne.",
    surface: "hard",
  },
  {
    period: "Marzo",
    title: "Sunshine Double",
    highlight: "Indian Wells & Miami",
    description: "I primi due Masters 1000 della stagione nel deserto californiano e in Florida.",
    surface: "hard",
  },
  {
    period: "Aprile—Maggio",
    title: "La Terra Rossa Europea",
    highlight: "Roland Garros",
    description: "La grande stagione sul rosso con i Masters 1000 di Monte Carlo, Madrid e Roma, prima dello Slam di Parigi.",
    surface: "clay",
  },
  {
    period: "Giugno—Luglio",
    title: "Stagione sull'Erba",
    highlight: "Wimbledon",
    description: "Il prestigioso e brevissimo swing sui prati inglesi che culmina nel Tempio di Londra.",
    surface: "grass",
  },
  {
    period: "Agosto—Settembre",
    title: "Summer Hardcourt Swing",
    highlight: "US Open",
    description: "La corsa sul cemento nordamericano con i Masters 1000 del Canada e Cincinnati, che lancia l'ultimo Slam a New York.",
    surface: "hard",
  },
  {
    period: "Ottobre—Novembre",
    title: "Asian Tour & Indoor Finals",
    highlight: "ATP Finals",
    description: "Il Masters 1000 di Shanghai, l'ultimo 1000 indoor a Parigi-Bercy e la resa dei conti tra i migliori 8 a Torino.",
    surface: "indoor",
  },
];

function TimelineCard({ event, inView, isLeft }: { event: TimelineEvent; inView: boolean; isLeft: boolean }) {
  const surface = SURFACE_COLORS[event.surface];
  
  // Animation: slide in from left if isLeft, else from right
  const xOffset = isLeft ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xOffset, y: 20 }}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border p-5 md:p-8 transition-all duration-300 hover:shadow-ambient hover:-translate-y-1 bg-surface-white/90 backdrop-blur-xl relative z-10 max-w-[480px]",
        surface.border
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-label-md font-bold mb-3",
          surface.bg,
          surface.text
        )}
      >
        {event.period}
      </span>
      <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-2 leading-tight">
        {event.title}
      </h3>
      <p className={cn("text-title-sm md:text-label-lg font-bold mb-3", surface.text)}>
        {event.highlight}
      </p>
      <p className="text-body-md text-text-muted leading-relaxed">
        {event.description}
      </p>
    </motion.div>
  );
}

function TimelineItem({ event, idx }: { event: TimelineEvent; idx: number }) {
  // Pari a sinistra, dispari a destra
  const isLeft = idx % 2 === 0;
  const surface = SURFACE_COLORS[event.surface];
  
  const ref = useRef<HTMLDivElement>(null);
  // Attiviamo l'animazione quando l'elemento entra nella parte centrale dello schermo
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  return (
    <div ref={ref} className="relative flex justify-center items-center w-full min-h-[300px]">
      
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center">
        {/* Left Side (Card or Empty Space) */}
        <div className="w-1/2 flex justify-end pr-12 xl:pr-24">
          {isLeft && <TimelineCard event={event} inView={isInView} isLeft={true} />}
        </div>
        
        {/* Center Node */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-8 h-8 rounded-full border-4 border-background shadow-md z-20"
            style={{ backgroundColor: surface.dotHex }}
          />
        </div>

        {/* Right Side (Empty Space or Card) */}
        <div className="w-1/2 flex justify-start pl-12 xl:pl-24">
          {!isLeft && <TimelineCard event={event} inView={isInView} isLeft={false} />}
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
            className="w-6 h-6 rounded-full border-[3px] border-background shadow-md z-20"
            style={{ backgroundColor: surface.dotHex }}
          />
        </div>
        
        <TimelineCard event={event} inView={isInView} isLeft={false} />
      </div>

    </div>
  );
}

export function TimelineSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Tracciamo lo scorrimento della sezione
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Ammorbidiamo la progressione della linea
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });

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
            Un anno di Tennis
          </h2>
          <p className="text-body-xl text-text-muted max-w-3xl mx-auto">
            La stagione tennistica dura circa 11 mesi e segue l'estate in giro per il mondo, cambiando superficie di gioco.
          </p>
        </div>

        {/* Surface legend - Sticky & Smaller */}
        <div className="sticky top-28 z-40 flex flex-wrap justify-center gap-2 md:gap-4 mb-16 md:mb-24">
          {Object.entries(SURFACE_COLORS).map(([key, style]) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-surface-white/95 backdrop-blur-md border border-border-subtle px-3 py-1.5 shadow-md"
            >
              <span className={cn("w-2 h-2 rounded-full", style.dot)} />
              <span className="text-[11px] md:text-xs text-foreground font-extrabold uppercase tracking-widest">
                {style.label}
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
              style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>

          {/* Left Line Track (Mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-[24px] -translate-x-1/2 w-1.5 bg-surface-gray rounded-full overflow-hidden">
             <motion.div 
              className="absolute top-0 left-0 w-full bg-baseline-lime"
              style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>

          {/* Events */}
          {EVENTS.map((event, idx) => (
            <TimelineItem key={event.period} event={event} idx={idx} />
          ))}

        </div>

      </div>
    </section>
  );
}
