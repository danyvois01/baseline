"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";

interface ScrollCueProps {
  /** id of the section to scroll to */
  targetId: string;
  /** Short label shown above the chevron */
  label?: string;
  /** Light variant for dark backgrounds (e.g. the Scoring section) */
  variant?: "dark" | "light";
  /** Extra classes for positioning inside the parent section */
  className?: string;
}

/**
 * Shared "go to next section" affordance.
 * Same style as the hero's original "Scopri" cue: tiny uppercase label
 * plus a gently bouncing chevron. Placed at the bottom of every
 * homepage section so the affordance is consistent throughout the page.
 *
 * Prefer `SectionEndCue` below: it adds the standard boundary spacing. Use
 * this component bare only where the cue has to be positioned absolutely
 * inside a full-screen frame (the hero, the pinned Ranking frame).
 */
export function ScrollCue({
  targetId,
  label,
  variant = "dark",
  className,
}: ScrollCueProps) {
  const { t } = useTranslation();
  const cueLabel = label ?? t.home.scrollCue.defaultLabel;
  const scrollToTarget = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      /*
       * Short and immediate on purpose. `whileInView` fires as soon as the
       * first pixel crosses the viewport's bottom edge, so a slow fade means
       * the cue is still translucent by the time normal scrolling has carried
       * it off screen — that was the "I only see it for a split second"
       * problem with the in-flow cues.
       */
      transition={{ duration: 0.4 }}
      onClick={scrollToTarget}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-colors cursor-pointer",
        variant === "dark"
          ? "text-text-muted/60 hover:text-primary-olive"
          : "text-white/60 hover:text-baseline-lime",
        className
      )}
      aria-label={t.home.scrollCue.ariaNext(cueLabel)}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest">{cueLabel}</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
}

/**
 * Chapter-end cue: the band that closes a scrolling section.
 *
 * It owns the boundary spacing so every chapter ends the same way instead of
 * each section inventing its own margin. Sections that use it must therefore
 * drop their own bottom padding, or the two stack up and the boundaries stop
 * matching again.
 *
 * More room below than above on purpose: the space below is what gives the cue
 * scroll distance to travel while on screen, rather than appearing right as the
 * next section pushes in.
 */
export function SectionEndCue(props: ScrollCueProps) {
  return (
    <div className="flex justify-center pt-16 pb-20">
      <ScrollCue {...props} />
    </div>
  );
}
