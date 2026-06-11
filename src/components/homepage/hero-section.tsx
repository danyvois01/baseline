"use client";

/**
 * HeroSection — Full-width dark hero with animated title and subtitle
 * introducing the "Baseline: Partiamo dalle Basi" concept.
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToNext = () => {
    const el = document.getElementById("ranking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-deep-navy min-h-[85vh] flex items-center"
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-baseline-lime blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-baseline-lime blur-[100px]" />
      </div>

      {/* Decorative tennis court lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-white" />
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-24 md:py-32 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-baseline-lime live-pulse" />
            <span className="text-label-md text-baseline-lime font-medium tracking-wide uppercase">
              La Casa del Tennis
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-display text-white mb-6"
          >
            Baseline:{" "}
            <span className="text-baseline-lime">
              Partiamo dalle Basi
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-body-lg text-white/70 mb-12 max-w-2xl"
          >
            La linea di fondo campo è il punto di partenza di ogni scambio. Qui
            su Baseline, è anche il fondamento della tua conoscenza del tennis
            professionistico. Scopri le regole, i tornei e i segreti del
            circuito ATP per seguire la stagione come un vero esperto.
          </motion.p>

          {/* Scroll indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={scrollToNext}
            className="flex flex-col items-center gap-2 text-white/40 hover:text-baseline-lime transition-colors duration-300 cursor-pointer"
            aria-label="Scroll to content"
          >
            <span className="text-label-md uppercase tracking-widest">
              Scopri
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
