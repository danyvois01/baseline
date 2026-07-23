"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
 */
export function ScrollCue({
  targetId,
  label = "Continua",
  variant = "dark",
  className,
}: ScrollCueProps) {
  const scrollToTarget = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onClick={scrollToTarget}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-colors cursor-pointer",
        variant === "dark"
          ? "text-text-muted/60 hover:text-primary-olive"
          : "text-white/60 hover:text-baseline-lime",
        className
      )}
      aria-label={`Vai alla sezione successiva: ${label}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
}
