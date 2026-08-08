"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Closing CTA — a navy panel that ends the page.
 *
 * The panel is not decoration: on the surrounding white background the lime
 * button sits at roughly 1.2:1 contrast, while on deep navy it reaches ~14:1,
 * making it the brightest element on screen. Navy is used the same way as
 * elsewhere on the site (court, scoreboard, glossary deck): as an object with
 * a role, never as an isolated detail.
 */
export function CtaSection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="cta" className="relative w-full px-4 sm:px-6 pb-16 sm:pb-20 mt-16 sm:mt-24 z-10">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden w-full max-w-5xl mx-auto rounded-[40px] bg-deep-navy px-6 sm:px-10 py-16 md:py-24 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge — same pill language as the glossary category chip */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 mb-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-baseline-lime" />
            {t.home.cta.badge}
          </span>

          <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-heading font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            {t.home.cta.titleLine1}{" "}
            {t.home.cta.titleLine2}
          </h2>

          <p className="text-body-md text-white/70 max-w-md mx-auto mb-10 leading-relaxed">
            {t.home.cta.body}
          </p>

          {/* Button + its glow: one soft radial centred on the focal point */}
          <div className="relative">
            <div
              className="absolute -inset-10 rounded-full bg-baseline-lime/20 blur-[60px] pointer-events-none"
              aria-hidden="true"
            />
            <Link
              href="/live"
              className="group relative inline-flex items-center gap-2.5 rounded-full bg-baseline-lime px-7 py-3.5 text-sm sm:text-base font-black text-deep-navy transition-all duration-300 hover:shadow-[0_0_40px_rgba(223,255,0,0.45)] hover:-translate-y-1"
            >
              <Zap className="h-5 w-5 text-deep-navy group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span className="uppercase tracking-wide">{t.home.cta.button}</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
