"use client";

/**
 * HeroSection — Full-width dark hero with animated tennis court SVG,
 * floating particles, and staggered text entrance animations.
 *
 * Desktop: two-column layout — text (left) + animated court (right).
 * Mobile:  single-column, court hidden, text centered.
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Court line definitions for draw-on animation                       */
/* ------------------------------------------------------------------ */

const COURT_LINES: { d: string; delay: number; duration: number }[] = [
  // Outer boundary (doubles court) — landscape 520×300
  { d: "M10,10 L510,10 L510,290 L10,290 Z", delay: 0, duration: 1.5 },
  // Doubles tramlines (top & bottom)
  { d: "M10,45 L510,45", delay: 0.4, duration: 0.8 },
  { d: "M10,255 L510,255", delay: 0.4, duration: 0.8 },
  // Service lines (left & right of net)
  { d: "M155,45 L155,255", delay: 0.9, duration: 0.5 },
  { d: "M365,45 L365,255", delay: 0.9, duration: 0.5 },
  // Center service line (horizontal, through service boxes)
  { d: "M155,150 L365,150", delay: 1.2, duration: 0.5 },
  // Center marks on baselines
  { d: "M10,150 L25,150", delay: 1.4, duration: 0.3 },
  { d: "M495,150 L510,150", delay: 1.4, duration: 0.3 },
];

/* ------------------------------------------------------------------ */
/*  Floating particles — fixed positions to avoid SSR hydration issues */
/* ------------------------------------------------------------------ */

const PARTICLES = [
  { x: 12, y: 18, size: 3, opacity: 0.15, duration: 5, delay: 0 },
  { x: 88, y: 25, size: 4, opacity: 0.1, duration: 6, delay: 1.2 },
  { x: 35, y: 75, size: 2.5, opacity: 0.2, duration: 4.5, delay: 0.5 },
  { x: 72, y: 55, size: 3.5, opacity: 0.12, duration: 5.5, delay: 2 },
  { x: 55, y: 10, size: 2, opacity: 0.18, duration: 4, delay: 0.8 },
  { x: 20, y: 50, size: 5, opacity: 0.08, duration: 7, delay: 1.5 },
  { x: 92, y: 70, size: 2.5, opacity: 0.15, duration: 4.8, delay: 0.3 },
  { x: 48, y: 90, size: 3, opacity: 0.1, duration: 5.2, delay: 1.8 },
  { x: 8, y: 85, size: 2, opacity: 0.14, duration: 6.2, delay: 0.7 },
  { x: 78, y: 8, size: 3.5, opacity: 0.09, duration: 5.8, delay: 2.5 },
];

/* ------------------------------------------------------------------ */
/*  Ball rally trajectory (keyframes for cx, cy)                       */
/* ------------------------------------------------------------------ */

const BALL_CX = [60, 440, 120, 400, 260, 60];
const BALL_CY = [240, 60, 120, 230, 50, 240];

/* ================================================================== */

export function HeroSection() {
  const scrollToNext = () => {
    const el = document.getElementById("ranking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-deep-navy h-[calc(100vh-5rem)] flex items-center"
    >
      {/* ---- Ambient glow blobs ---- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-baseline-lime/10 blur-[150px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-baseline-lime/5 blur-[120px]" />
      </div>

      {/* ---- Floating particles ---- */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-baseline-lime"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{ y: [-12, 12, -12] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ---- Main content: two-column on desktop ---- */}
      <div className="relative mx-auto max-w-[1280px] px-6 py-10 md:py-14 w-full">
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left md:gap-12 lg:gap-20">
          {/* ======== Left column: Text ======== */}
          <div className="flex flex-col items-center md:items-start md:w-[55%]">
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
              <span className="text-baseline-lime">Partiamo dalle Basi</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-body-lg text-white/70 mb-12 max-w-xl"
            >
              La linea di fondo campo è il punto di partenza di ogni scambio.
              Qui su Baseline, è anche il fondamento della tua conoscenza del
              tennis professionistico. Scopri le regole, i tornei e i segreti
              del circuito ATP per seguire la stagione come un vero esperto.
            </motion.p>

            {/* Scroll indicator */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onClick={scrollToNext}
              className="flex flex-col items-center md:items-start gap-2 text-white/40 hover:text-baseline-lime transition-colors duration-300 cursor-pointer"
              aria-label="Scroll to content"
            >
              <span className="text-label-md uppercase tracking-widest">
                Scopri
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* ======== Right column: Animated Tennis Court ======== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="hidden md:flex md:w-[45%] items-center justify-center"
          >
            <div className="relative w-full max-w-[480px] lg:max-w-[520px]">
              {/* Soft glow behind the court */}
              <div className="absolute -inset-8 bg-baseline-lime/[0.04] blur-[80px] rounded-full" />

              <svg
                viewBox="0 0 520 300"
                className="relative w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Court surface — very subtle fill */}
                <motion.rect
                  x={10}
                  y={10}
                  width={500}
                  height={280}
                  rx={4}
                  fill="rgba(223, 255, 0, 0.03)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                {/* Court lines — draw-on animation */}
                {COURT_LINES.map((line, i) => (
                  <motion.path
                    key={i}
                    d={line.d}
                    stroke="#DFFF00"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.35 }}
                    transition={{
                      pathLength: {
                        duration: line.duration,
                        delay: line.delay,
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.4, delay: line.delay },
                    }}
                  />
                ))}

                {/* Net — vertical dashed line at center */}
                <motion.line
                  x1={260}
                  y1={10}
                  x2={260}
                  y2={290}
                  stroke="#DFFF00"
                  strokeWidth={2}
                  strokeDasharray="8 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{
                    pathLength: {
                      duration: 0.8,
                      delay: 0.7,
                      ease: "easeInOut",
                    },
                    opacity: { duration: 0.3, delay: 0.7 },
                  }}
                />

                {/* SVG filter for ball glow */}
                <defs>
                  <filter id="ball-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="ball-gradient">
                    <stop offset="0%" stopColor="#FFFF66" />
                    <stop offset="100%" stopColor="#DFFF00" />
                  </radialGradient>
                </defs>

                {/* Ball trail — follows the ball with delay, creating a comet effect */}
                <motion.circle
                  r={4}
                  fill="#DFFF00"
                  initial={{ opacity: 0 }}
                  animate={{
                    cx: BALL_CX,
                    cy: BALL_CY,
                    opacity: [0, 0.15, 0.15, 0.15, 0.15, 0.15],
                  }}
                  transition={{
                    duration: 8,
                    delay: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Main tennis ball */}
                <motion.circle
                  r={6}
                  fill="url(#ball-gradient)"
                  filter="url(#ball-glow)"
                  initial={{ opacity: 0 }}
                  animate={{
                    cx: BALL_CX,
                    cy: BALL_CY,
                    opacity: [0, 0.85, 0.85, 0.85, 0.85, 0.85],
                  }}
                  transition={{
                    duration: 8,
                    delay: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
