"use client";

/**
 * PyramidSection — Interactive tournament hierarchy displayed as a
 * visual pyramid of cards with decreasing widths.  Each tier can be
 * clicked/tapped to expand and reveal its description.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Medal,
  Award,
  Star,
  Layers,
  ChevronDown,
  Footprints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";

/** Tournament tiers ordered from apex to base */
const TIERS = [
  {
    id: "finals",
    name: "ATP Finals",
    points: "1500",
    tagline: "La punta della piramide",
    description:
      "Riservato solamente ai migliori 8 giocatori della stagione (qualificati tramite \"The Race\"). È l'unico torneo con una spettacolare fase iniziale a gironi (Round Robin) prima delle semifinali a eliminazione diretta.",
    icon: Crown,
    width: "max-w-sm",
    accent: "from-amber-400 to-amber-500",
    accentBg: "bg-amber-50",
    accentText: "text-amber-700",
    accentBorder: "border-amber-200",
  },
  {
    id: "slam",
    name: "Grand Slam",
    points: "2000",
    tagline: "I quattro pilastri storici",
    description:
      "Australian Open, Roland Garros, Wimbledon e US Open. I tornei più antichi, prestigiosi e fisicamente brutali: sono gli unici dove si gioca al meglio dei 5 set, con partite che possono durare oltre 4 ore. Vincere un \"Major\" è il traguardo massimo nella carriera di ogni tennista.",
    icon: Medal,
    width: "max-w-md",
    accent: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50",
    accentText: "text-violet-700",
    accentBorder: "border-violet-200",
  },
  {
    id: "masters",
    name: "Masters 1000",
    points: "1000",
    tagline: "L'élite del tour",
    description:
      "Nove appuntamenti obbligatori sparsi nel mondo, appena un gradino sotto gli Slam per importanza. Vincerne uno significa entrare nell'élite. Vincerli tutti è un'impresa riuscita solo a pochi nella storia.",
    icon: Award,
    width: "max-w-lg",
    accent: "from-blue-500 to-cyan-500",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentBorder: "border-blue-200",
  },
  {
    id: "500",
    name: "ATP 500",
    points: "500",
    tagline: "L'alto livello",
    description:
      "Tredici tornei di grande importanza. Cruciali per consolidare la propria posizione in Top 20 o per accumulare i punti necessari per qualificarsi alle Finals a fine anno.",
    icon: Star,
    width: "max-w-xl",
    accent: "from-emerald-500 to-teal-500",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    accentBorder: "border-emerald-200",
  },
  {
    id: "250",
    name: "ATP 250",
    points: "250",
    tagline: "La base del circuito maggiore",
    description:
      "L'ossatura del circuito. Decine di tornei in tutto il mondo ogni settimana, occasioni preziose per emergere, raccogliere punti costanti e far debuttare i giovani talenti.",
    icon: Layers,
    width: "max-w-2xl",
    accent: "from-gray-400 to-gray-500",
    accentBg: "bg-gray-50",
    accentText: "text-gray-600",
    accentBorder: "border-gray-200",
  },
  {
    id: "challenger",
    name: "Challenger & ITF",
    points: "175",
    tagline: "Il trampolino di lancio",
    description:
      "Le leghe minori. Il trampolino di lancio essenziale per i giovani tennisti e per chi cerca di accumulare i primi punti per entrare nel circuito principale.",
    icon: Footprints,
    width: "max-w-3xl",
    accent: "from-stone-400 to-stone-500",
    accentBg: "bg-stone-50",
    accentText: "text-stone-600",
    accentBorder: "border-stone-200",
  },
] as const;

export function PyramidSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section id="pyramid" className="bg-surface-white scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
              <Layers className="h-3.5 w-3.5 text-primary-olive" />
              <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                La Piramide
              </span>
            </div>
            <h2 className="text-headline-lg text-deep-navy mb-4">
              Non tutti i tornei sono uguali
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto mb-4">
              I tornei sono divisi in categorie ben precise, che determinano il
              prestigio, la difficoltà e, ovviamente, i punti in palio. Più si
              sale verso il vertice della piramide, maggiore è la gloria.
            </p>
            <p className="text-body-md text-text-muted max-w-3xl mx-auto mb-6">
              I più importanti in assoluto sono i{" "}
              <strong className="text-deep-navy">Grand Slam</strong> (2000 punti
              al vincitore), seguiti dai{" "}
              <strong className="text-deep-navy">Masters 1000</strong>, dagli{" "}
              <strong className="text-deep-navy">ATP 500</strong> e{" "}
              <strong className="text-deep-navy">250</strong>. La stagione
              culmina con le{" "}
              <strong className="text-deep-navy">ATP Finals</strong>, riservate
              ai migliori 8 dell&apos;anno.
            </p>
            <div className="rounded-xl bg-baseline-lime/10 border border-baseline-lime/20 p-4 max-w-2xl mx-auto">
              <p className="text-body-sm text-primary-olive font-medium">
                💡 Curiosità: Il numero del torneo (1000, 500, 250) indica i
                punti che guadagna il vincitore! Negli Slam e nelle Finals,
                invece, le regole cambiano.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Pyramid stack */}
        <div className="flex flex-col items-center gap-3">
          {TIERS.map((tier, idx) => (
            <AnimatedSection
              key={tier.id}
              delay={0.1 + idx * 0.08}
              className={cn("w-full", tier.width)}
            >
              <button
                onClick={() => toggle(tier.id)}
                className={cn(
                  "w-full rounded-2xl border p-5 md:p-6 text-left transition-all duration-300 cursor-pointer",
                  "hover:shadow-md hover:-translate-y-0.5",
                  expandedId === tier.id
                    ? `${tier.accentBg} ${tier.accentBorder} shadow-md`
                    : "bg-white border-border-subtle shadow-ambient"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Icon badge with gradient */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br text-white shrink-0",
                        tier.accent
                      )}
                    >
                      <tier.icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-headline-sm text-deep-navy">
                        {tier.name}
                      </h3>
                      <p className="text-body-sm text-text-muted">
                        {tier.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Points badge */}
                    <span
                      className={cn(
                        "hidden sm:inline-flex rounded-full px-4 py-1.5 text-label-lg font-bold",
                        tier.accentBg,
                        tier.accentText
                      )}
                    >
                      {tier.points} Pts
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-text-muted transition-transform duration-300",
                        expandedId === tier.id && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {/* Expandable description */}
                <AnimatePresence>
                  {expandedId === tier.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border-subtle">
                        {/* Points badge on mobile */}
                        <span
                          className={cn(
                            "sm:hidden inline-flex rounded-full px-4 py-1.5 text-label-lg font-bold mb-3",
                            tier.accentBg,
                            tier.accentText
                          )}
                        >
                          {tier.points} Pts
                        </span>
                        <p className="text-body-md text-text-muted leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
