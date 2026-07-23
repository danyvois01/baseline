"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Infinity, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Stat highlight cards from original version                        */
/* ------------------------------------------------------------------ */
const HIGHLIGHTS = [
  {
    icon: Award,
    value: "19",
    label: "I Migliori Risultati",
    desc: "Vengono sommati solo i tuoi migliori piazzamenti stagionali.",
    position: "top-[5%] md:top-[8%] left-[2%] md:left-[10%] xl:left-[15%]",
    align: "text-left",
    scrollRange: [0.1, 0.3]
  },
  {
    icon: Clock,
    value: "52",
    label: "Settimane",
    desc: "La “finestra” mobile del ranking. Calcolata sull’ultimo anno.",
    position: "top-[5%] md:top-[8%] right-[2%] md:right-[10%] xl:right-[15%]",
    align: "text-right",
    scrollRange: [0.2, 0.4]
  },
  {
    icon: Infinity,
    value: "Zero",
    label: "Nessun Azzeramento",
    desc: "La classifica non si azzera mai a gennaio: è una corsa continua.",
    position: "bottom-[5%] md:bottom-[8%] left-[2%] md:left-[10%] xl:left-[15%]",
    align: "text-left",
    scrollRange: [0.3, 0.5]
  },
  {
    icon: Hourglass,
    value: "Scadenza",
    label: "Difesa dei punti",
    desc: "Ogni risultato “scade” dopo un anno. Devi tornare a vincere.",
    position: "bottom-[5%] md:bottom-[8%] right-[2%] md:right-[10%] xl:right-[15%]",
    align: "text-right",
    scrollRange: [0.4, 0.6]
  },
];

export function RankingSection() {
  const containerRef = useRef<HTMLElement>(null);
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
      <div className="hidden md:flex sticky top-0 h-screen w-full items-center justify-center overflow-hidden pt-20">
        
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="w-[800px] h-[800px] rounded-full border-[1px] border-deep-navy" />
            <div className="absolute w-[1200px] h-[1200px] rounded-full border-[1px] border-deep-navy" />
        </div>

        <div className="relative flex items-center justify-center w-full max-w-[1400px] mx-auto h-full">
          {/* Animated SVG Circle */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -rotate-90 pointer-events-none">
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
            className="text-center max-w-xs z-10 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="text-[90px] font-heading font-extrabold text-foreground leading-none mb-2">
              ATP
            </div>
            <h2 className="text-title-lg text-foreground mb-4 uppercase tracking-widest">
              Il Ranking
            </h2>
            <p className="text-body-md text-text-muted">
              Il tennis è l'unico sport globale che dura 11 mesi l'anno. Non esiste una "stagione regolare": esiste solo il ranking mondiale, una classifica viva che cambia ogni lunedì.
            </p>
          </motion.div>

          {/* Floating Highlight Cards */}
          {HIGHLIGHTS.map((item, idx) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const cardOpacity = useTransform(scrollYProgress, item.scrollRange, [0, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const cardY = useTransform(scrollYProgress, item.scrollRange, [40, 0]);

            return (
              <motion.div
                key={idx}
                style={{ opacity: cardOpacity, y: cardY }}
                className={cn(
                  "absolute z-20 w-[240px] md:w-[280px] rounded-3xl bg-surface-white/60 backdrop-blur-xl border border-border-subtle p-5 shadow-ambient",
                  item.position
                )}
              >
                <div className={cn("flex flex-col", item.align === "text-right" ? "items-end text-right" : "items-start text-left")}>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-baseline-lime/20 mb-3">
                    <item.icon className="h-5 w-5 text-primary-olive" />
                  </div>
                  <h3 className="text-[32px] font-heading font-extrabold text-foreground leading-none mb-1">
                    {item.value}
                  </h3>
                  <p className="text-title-sm text-foreground font-bold mb-2">
                    {item.label}
                  </p>
                  <p className="text-label-md text-text-muted">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
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
            Il Ranking
          </h2>
          <p className="text-body-md text-text-muted">
            Il tennis è l'unico sport globale che dura 11 mesi l'anno. Non esiste una "stagione regolare": esiste solo il ranking mondiale, una classifica viva che cambia ogni lunedì.
          </p>
        </motion.div>

        {/* Vertical Cards */}
        {HIGHLIGHTS.map((item, idx) => (
          <motion.div
            key={`mobile-${idx}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            className="w-full rounded-3xl bg-surface-white/80 backdrop-blur-xl border border-border-subtle p-6 shadow-ambient flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Sottile background glow nell'angolo in base alla card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-baseline-lime/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-baseline-lime/20 mb-4 text-primary-olive shadow-sm">
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
