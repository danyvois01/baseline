"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollCue } from "./scroll-cue";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Scroll progress bands: each stat fades in and out within its band.
 * First stat is visible immediately on entry.
 */
const BANDS: [number, number, number, number][] = [
  [0, 0.02, 0.18, 0.24],
  [0.26, 0.30, 0.44, 0.50],
  [0.52, 0.56, 0.70, 0.76],
  [0.78, 0.82, 0.92, 0.98],
];

function useStatOpacity(progress: MotionValue<number>, index: number) {
  return useTransform(progress, BANDS[index], [0, 1, 1, 0]);
}

export function RankingSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const highlights = t.home.ranking.highlights;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const barWidth = useTransform(scrollYProgress, [0, 0.95], ["0%", "100%"]);

  const op0 = useStatOpacity(scrollYProgress, 0);
  const op1 = useStatOpacity(scrollYProgress, 1);
  const op2 = useStatOpacity(scrollYProgress, 2);
  const op3 = useStatOpacity(scrollYProgress, 3);
  const opacities = [op0, op1, op2, op3];

  return (
    <section
      id="ranking"
      ref={containerRef}
      className="relative w-full md:h-[300vh] bg-surface-white"
    >
      {/* --- DESKTOP: pinned full-screen frame --- */}
      <div className="hidden md:block sticky top-0 h-screen w-full overflow-hidden">
        {/*
          Fixed grid layout — 3 rows, explicit heights.
          Row 1 (auto): header area
          Row 2 (1fr): counter center
          Row 3 (auto): progress + cue
        */}
        <div className="h-full w-full max-w-3xl mx-auto px-6 grid grid-rows-[auto_1fr_auto] items-center justify-items-center pt-24 pb-8 gap-0">

          {/* ROW 1: Header */}
          <div className="text-center py-4">
            <h2 className="text-[11px] text-text-muted uppercase tracking-[0.3em] font-bold mb-2">
              {t.home.ranking.title}
            </h2>
            <p className="text-[13px] text-text-muted/70 leading-relaxed max-w-sm mx-auto">
              {t.home.ranking.lead}
            </p>
          </div>

          {/* ROW 2: The counter (number + label/desc) — vertically centered in 1fr */}
          <div className="flex flex-col items-center justify-center w-full">
            {/* Number */}
            <div className="grid place-items-center [&>*]:[grid-area:1/1]">
              {highlights.map((item, idx) => (
                <motion.span
                  key={`val-${idx}`}
                  style={{ opacity: opacities[idx] }}
                  className={cn(
                    "font-heading font-extrabold text-baseline-lime leading-none select-none",
                    item.value.length <= 2 ? "text-[120px] xl:text-[160px]" : "text-[60px] xl:text-[80px]"
                  )}
                >
                  {item.value}
                </motion.span>
              ))}
            </div>

            {/* Label + desc */}
            <div className="grid place-items-center [&>*]:[grid-area:1/1] mt-6 text-center">
              {highlights.map((item, idx) => (
                <motion.div
                  key={`lbl-${idx}`}
                  style={{ opacity: opacities[idx] }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[18px] text-foreground font-bold mb-1">{item.label}</span>
                  <span className="text-[14px] text-text-muted max-w-[280px] leading-snug">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ROW 3: Progress bar + cue */}
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-32 h-[2px] bg-surface-gray rounded-full overflow-hidden">
              <motion.div className="h-full bg-baseline-lime rounded-full" style={{ width: barWidth }} />
            </div>
            <ScrollCue targetId="pyramid" label={t.home.ranking.scrollLabel} />
          </div>

        </div>
      </div>

      {/* --- MOBILE: simple vertical list --- */}
      <div className="md:hidden flex flex-col w-full py-20 px-6 gap-14">
        <div className="text-center">
          <h2 className="text-[11px] text-text-muted uppercase tracking-[0.3em] font-bold mb-3">
            {t.home.ranking.title}
          </h2>
          <p className="text-[14px] text-text-muted max-w-sm mx-auto leading-relaxed">
            {t.home.ranking.lead}
          </p>
        </div>

        {highlights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-[64px] font-heading font-extrabold text-baseline-lime leading-none mb-2">
              {item.value}
            </span>
            <span className="text-[16px] text-foreground font-bold mb-1">{item.label}</span>
            <span className="text-[14px] text-text-muted max-w-[260px]">{item.desc}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
