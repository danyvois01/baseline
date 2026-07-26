"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrollCue } from "./scroll-cue";
import { useTranslation } from "@/providers/locale-provider";

/* ------------------------------------------------------------------ */
/*  Court line definitions for draw-on animation                       */
/* ------------------------------------------------------------------ */
const COURT_LINES: { d: string; delay: number; duration: number }[] = [
  { d: "M10,10 L510,10 L510,290 L10,290 Z", delay: 0, duration: 1.5 },
  { d: "M10,45 L510,45", delay: 0.4, duration: 0.8 },
  { d: "M10,255 L510,255", delay: 0.4, duration: 0.8 },
  { d: "M155,45 L155,255", delay: 0.9, duration: 0.5 },
  { d: "M365,45 L365,255", delay: 0.9, duration: 0.5 },
  { d: "M155,150 L365,150", delay: 1.2, duration: 0.5 },
  { d: "M10,150 L25,150", delay: 1.4, duration: 0.3 },
  { d: "M495,150 L510,150", delay: 1.4, duration: 0.3 },
];

/* ------------------------------------------------------------------ */
/*  Ball rally trajectory (keyframes for cx, cy)                       */
/* ------------------------------------------------------------------ */
const BALL_CX = [60, 440, 120, 400, 260, 60];
const BALL_CY = [240, 60, 120, 230, 50, 240];

export function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // The animated underline decorates the subtitle's last word in any locale.
  const subtitleWords = t.home.hero.subtitle.split(" ");
  const subtitleLastWord = subtitleWords[subtitleWords.length - 1];
  const subtitleLead = subtitleWords.slice(0, -1).join(" ");
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const courtY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const courtScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-surface-white pt-20"
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-baseline-lime/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Column: Text */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="flex-1 text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge removed */}
            <h1 className="text-[12vw] sm:text-[70px] lg:text-[90px] xl:text-[110px] leading-[0.85] font-heading font-extrabold text-foreground tracking-tighter uppercase interactive cursor-none">
              Baseline
              <br />
              <span className="inline-block pb-4 pr-4 text-foreground text-[8vw] sm:text-[50px] lg:text-[60px] xl:text-[70px]">
                {subtitleLead}{" "}
                <span className="relative inline-block">
                  {subtitleLastWord}
                  {/* Hand-drawn lime underline, draws itself like the court lines */}
                  <svg
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="absolute left-0 -bottom-[0.08em] w-full h-[0.16em] text-baseline-lime pointer-events-none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M4,10 C40,4 120,2 196,8"
                      stroke="currentColor"
                      strokeWidth={7}
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 0.7, delay: 1.1, ease: "easeInOut" },
                        opacity: { duration: 0.2, delay: 1.1 },
                      }}
                    />
                  </svg>
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 max-w-xl"
          >
            <p className="text-[20px] md:text-[22px] text-text-muted font-medium leading-relaxed">
              {t.home.hero.lead}
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column: Animated Court */}
        <motion.div 
          style={{ y: courtY, scale: courtScale, opacity }}
          className="flex-1 w-full max-w-[500px] relative hidden md:block"
        >
          {/* Straight isometric container */}
          <div className="relative w-full">
            <svg
              viewBox="0 0 520 300"
              className="relative w-full h-auto drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Court surface — dark on light bg, slightly lighter than the page in dark mode */}
              <motion.rect
                x={10}
                y={10}
                width={500}
                height={280}
                rx={4}
                className="fill-[#1C2127] dark:fill-[#1C2333]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Court lines */}
              {COURT_LINES.map((line, i) => (
                <motion.path
                  key={i}
                  d={line.d}
                  className="stroke-baseline-lime"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: line.duration, delay: line.delay, ease: "easeInOut" },
                    opacity: { duration: 0.4, delay: line.delay },
                  }}
                />
              ))}

              {/* Net */}
              <motion.line
                x1={260}
                y1={10}
                x2={260}
                y2={290}
                className="stroke-baseline-lime"
                strokeWidth={3}
                strokeDasharray="8 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.7, ease: "easeInOut" },
                  opacity: { duration: 0.3, delay: 0.7 },
                }}
              />

              <defs>
                <filter id="ball-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ball trail */}
              <motion.circle
                r={5}
                className="fill-baseline-lime"
                initial={{ opacity: 0 }}
                animate={{
                  cx: BALL_CX,
                  cy: BALL_CY,
                  opacity: [0, 0.2, 0.2, 0.2, 0.2, 0.2],
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
                r={7}
                className="fill-baseline-lime"
                filter="url(#ball-glow)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: BALL_CX,
                  cy: BALL_CY,
                  opacity: [0, 1, 1, 1, 1, 1],
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

      {/* Scroll indicator */}
      <ScrollCue
        targetId="ranking"
        label={t.home.hero.scrollLabel}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      />
    </section>
  );
}
