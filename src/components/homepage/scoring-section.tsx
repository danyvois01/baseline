"use client";

/**
 * ScoringSection — Visual step-by-step explanation of tennis scoring.
 * Includes the Game points (Love → 15 → 30 → 40 → Game),
 * Deuce/Advantage rules, and the Tie-Break system.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";

/** Steps in the game scoring sequence */
const SCORE_STEPS = [
  { score: "0", label: "Love", description: "Zero punti." },
  { score: "15", label: "Primo punto", description: "Il primo punto vinto." },
  { score: "30", label: "Secondo punto", description: "Il secondo punto vinto." },
  { score: "40", label: "Terzo punto", description: "Il terzo punto vinto." },
  {
    score: "GAME",
    label: "Gioco vinto",
    description: "Il quarto punto vince il gioco (se l'avversario è a 30 o meno).",
  },
] as const;

/** Tabs for the detailed scoring rules */
const SCORING_TABS = [
  {
    id: "deuce",
    label: "Deuce & Vantaggi",
    title: "Cosa succede sul 40-40?",
    content:
      "Se entrambi i giocatori arrivano a 40, si va in \"Deuce\" (Parità). Da qui in poi, per vincere il game serve conquistare due punti consecutivi. Il primo dà il \"Vantaggio\" (Ad); se si vince anche il secondo, è Game. Se si perde, si torna in parità.",
  },
  {
    id: "set",
    label: "Il Set",
    title: "Come si vince un Set?",
    content:
      "Per vincere un Set bisogna conquistare 6 Game, mantenendo almeno due game di scarto (es. 6-4 o 6-3). Sul punteggio di 5-5, si prosegue fino a 7 (es. 7-5).",
  },
  {
    id: "tiebreak",
    label: "Tie-Break",
    title: "Il Game Decisivo",
    content:
      "Sul punteggio di 6-6, si gioca il Tie-Break: un game speciale dove i punti si contano numericamente (1, 2, 3...). Vince il set chi arriva a 7 punti per primo, sempre con almeno due punti di scarto.",
  },
] as const;

export function ScoringSection() {
  const [activeTab, setActiveTab] = useState("deuce");

  return (
    <section id="scoring" className="bg-surface-white scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
              <Gauge className="h-3.5 w-3.5 text-primary-olive" />
              <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                Il Punteggio
              </span>
            </div>
            <h2 className="text-headline-lg text-deep-navy mb-4">
              Game, Set, Match: Come si gioca?
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
              Ora che sai come funzionano il ranking e i tornei, scendiamo in
              campo. Il tennis ha un sistema di punteggio storico. Una partita è
              divisa in Set, che a loro volta sono divisi in Game.
            </p>
          </div>
        </AnimatedSection>

        {/* Score stepper */}
        <AnimatedSection delay={0.1}>
          <div className="mb-16">
            <h3 className="text-headline-sm text-deep-navy mb-8 text-center">
              I Punti all&apos;interno di un Game
            </h3>
            <div className="flex flex-wrap justify-center items-end gap-3 md:gap-4">
              {SCORE_STEPS.map((step, idx) => (
                <motion.div
                  key={step.score}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + idx * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Score bubble */}
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                      step.score === "GAME"
                        ? "w-20 h-20 md:w-24 md:h-24 bg-baseline-lime border-baseline-lime text-deep-navy"
                        : "w-16 h-16 md:w-20 md:h-20 bg-white border-border-subtle text-deep-navy hover:border-baseline-lime"
                    )}
                  >
                    <span
                      className={cn(
                        "font-heading font-bold",
                        step.score === "GAME"
                          ? "text-sm md:text-base"
                          : "text-xl md:text-2xl"
                      )}
                    >
                      {step.score}
                    </span>
                  </div>

                  {/* Label */}
                  <span className="text-label-md text-text-muted mt-2">
                    {step.label}
                  </span>

                  {/* Connector arrow (except last) */}
                  {idx < SCORE_STEPS.length - 1 && (
                    <span className="hidden md:block absolute" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Tabbed detail cards */}
        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl bg-surface-gray border border-border-subtle overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-border-subtle bg-white">
              {SCORING_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-4 px-4 text-label-lg text-center transition-all duration-200 cursor-pointer relative",
                    activeTab === tab.id
                      ? "text-deep-navy font-bold"
                      : "text-text-muted hover:text-deep-navy"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="scoring-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-baseline-lime rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 md:p-8 min-h-[140px]">
              <AnimatePresence mode="wait">
                {SCORING_TABS.filter((t) => t.id === activeTab).map((tab) => (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Info className="h-5 w-5 text-primary-olive shrink-0 mt-0.5" />
                      <h4 className="text-headline-sm text-deep-navy">
                        {tab.title}
                      </h4>
                    </div>
                    <p className="text-body-md text-text-muted leading-relaxed pl-8">
                      {tab.content}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
