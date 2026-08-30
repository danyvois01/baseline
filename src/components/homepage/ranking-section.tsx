"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollCue, SectionEndCue } from "./scroll-cue";
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

/** Numbers arrive slightly small, settle at 1, and shrink a touch on exit. */
function useStatScale(progress: MotionValue<number>, index: number) {
  return useTransform(progress, BANDS[index], [0.92, 1, 1, 0.96]);
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function RankingSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const highlights = t.home.ranking.highlights;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progress ring fill (0 → 1 across the pinned scroll)
  const ringProgress = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  /*
   * Desktop scroll cue reveal. The cue is anchored to the bottom of the pinned
   * frame, which stays on screen for the section's full 300vh — left always
   * visible it reads as permanent furniture rather than "this chapter is
   * ending". Revealing it only over the last stretch gives it the same meaning
   * as the in-flow cues in the other sections.
   *
   * 0.86 is the tail of the last stat's band (BANDS[3]), which holds full
   * opacity until 0.92: the cue arrives while the last number is still
   * readable, not competing with it.
   */
  const cueOpacity = useTransform(scrollYProgress, [0.86, 0.95], [0, 1]);
  // Keeps the invisible button from being clickable during the rest of the pin.
  const cuePointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.86 ? "auto" : "none"
  );

  const op0 = useStatOpacity(scrollYProgress, 0);
  const op1 = useStatOpacity(scrollYProgress, 1);
  const op2 = useStatOpacity(scrollYProgress, 2);
  const op3 = useStatOpacity(scrollYProgress, 3);
  const opacities = [op0, op1, op2, op3];

  const sc0 = useStatScale(scrollYProgress, 0);
  const sc1 = useStatScale(scrollYProgress, 1);
  const sc2 = useStatScale(scrollYProgress, 2);
  const sc3 = useStatScale(scrollYProgress, 3);
  const scales = [sc0, sc1, sc2, sc3];

  // Current stat index (1-based) for the "01 — 04" indicator
  const activeIndex = useTransform(scrollYProgress, (v) => {
    for (let i = BANDS.length - 1; i >= 0; i--) {
      if (v >= BANDS[i][0]) return i;
    }
    return 0;
  });
  const indexLabel = useTransform(activeIndex, (i) => String(i + 1).padStart(2, "0"));

  return (
    <section
      id="ranking"
      ref={containerRef}
      className="relative w-full md:h-[300vh] bg-surface-white"
    >
      {/* --- DESKTOP: pinned full-screen frame --- */}
      <div className="hidden md:block sticky top-0 h-screen w-full overflow-hidden">
        {/*
          Layout — 2 rows:
          Row 1 (auto): section title + main lead sentence, full width
          Row 2 (1fr):  two columns — progress ring with the stat value on
                        the left, label + description on the right

          The scroll cue sits outside this grid, absolutely anchored to the
          bottom of the pinned frame: the ring has a fixed pixel size, so as a
          third grid row the cue got pushed past the frame's overflow-hidden
          edge and disappeared on shorter viewports.
        */}
        <div className="h-full w-full max-w-5xl mx-auto px-6 grid grid-rows-[auto_1fr] pt-24 pb-20">

          {/* ROW 1: Header — the lead is the protagonist */}
          <div className="text-center py-4 max-w-3xl mx-auto">
            <h2 className="text-[11px] text-text-muted uppercase tracking-[0.3em] font-bold mb-4">
              {t.home.ranking.title}
            </h2>
            <p className="text-[20px] xl:text-[24px] text-foreground font-heading font-bold leading-snug">
              {t.home.ranking.lead}
            </p>
          </div>

          {/* ROW 2: ring left, explanation right */}
          <div className="grid grid-cols-2 items-center gap-10 xl:gap-16 w-full">

            {/* LEFT: progress ring with the stat value inside */}
            <div className="relative flex items-center justify-center justify-self-end">
              {/* Soft lime glow anchoring the ring on the white background */}
              <div
                className="absolute w-[320px] h-[320px] xl:w-[380px] xl:h-[380px] rounded-full bg-[radial-gradient(circle,rgba(223,255,0,0.12)_0%,transparent_65%)] pointer-events-none"
                aria-hidden="true"
              />

              {/* Progress ring: closes as the section is scrolled */}
              <svg
                viewBox="0 0 100 100"
                className="w-[300px] h-[300px] xl:w-[360px] xl:h-[360px] -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  strokeWidth="1.2"
                  className="stroke-surface-gray"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-baseline-lime"
                  style={{ pathLength: ringProgress }}
                />
              </svg>

              {/* Stat values, stacked at the ring's center — sized to fit inside */}
              <div className="absolute inset-0 grid place-items-center [&>*]:[grid-area:1/1] px-12">
                {highlights.map((item, idx) => (
                  <motion.span
                    key={`val-${idx}`}
                    style={{ opacity: opacities[idx], scale: scales[idx] }}
                    className={cn(
                      "font-heading font-extrabold text-foreground leading-none select-none text-center",
                      item.value.length <= 2
                        ? "text-[110px] xl:text-[130px]"
                        : "text-[38px] xl:text-[48px]"
                    )}
                  >
                    {item.value}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* RIGHT: label + description + index */}
            <div className="flex flex-col justify-center max-w-[380px]">
              <div className="grid [&>*]:[grid-area:1/1]">
                {highlights.map((item, idx) => (
                  <motion.div
                    key={`lbl-${idx}`}
                    style={{ opacity: opacities[idx] }}
                    className="flex flex-col"
                  >
                    <span className="text-[26px] xl:text-[30px] font-heading font-extrabold text-foreground leading-tight mb-3">
                      {item.label}
                    </span>
                    <span className="text-[16px] xl:text-[17px] text-text-muted leading-relaxed">
                      {item.desc}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stat index indicator: 01 / 04 */}
              <div className="flex items-baseline gap-1.5 mt-8 font-heading font-bold select-none">
                <motion.span className="text-[15px] text-foreground">{indexLabel}</motion.span>
                <span className="text-[12px] text-text-muted/60">/ {String(highlights.length).padStart(2, "0")}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Scroll cue — anchored to the bottom of the pinned frame (there is no
            visible "after the last element" in 300vh of pin), revealed over the
            last stretch of the scroll. */}
        <motion.div
          style={{ opacity: cueOpacity, pointerEvents: cuePointerEvents }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ScrollCue targetId="pyramid" label={t.home.ranking.scrollLabel} />
        </motion.div>
      </div>

      {/* --- MOBILE: simple vertical list ---
          No bottom padding: the cue band below supplies it. */}
      <div className="md:hidden flex flex-col w-full pt-20 px-6 gap-14">
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
            <span className="relative text-[64px] font-heading font-extrabold text-foreground leading-none mb-2">
              <span
                className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(223,255,0,0.15)_0%,transparent_70%)] pointer-events-none"
                aria-hidden="true"
              />
              {item.value}
            </span>
            <span className="text-[16px] text-foreground font-bold mb-1">{item.label}</span>
            <span className="text-[14px] text-text-muted max-w-[260px]">{item.desc}</span>
          </motion.div>
        ))}

      </div>

      {/* Next-section cue for the mobile layout — outside the list on purpose:
          inside, the list's `gap-14` would stack on top of the band's own top
          padding. The desktop layout carries its own cue in the pinned frame. */}
      <div className="md:hidden">
        <SectionEndCue targetId="pyramid" label={t.home.ranking.scrollLabel} />
      </div>
    </section>
  );
}
