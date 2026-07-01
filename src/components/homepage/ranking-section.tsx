"use client";

/**
 * RankingSection — Explains how the ATP ranking system works:
 * 52 weeks, best-19 results, point accumulation and defence.
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  Trophy,
  BarChart3,
  CalendarDays,
  ShieldAlert,
  Globe,
  RotateCcwSquare,
} from "lucide-react";
import { AnimatedSection } from "./animated-section";

/* ------------------------------------------------------------------ */
/*  AnimatedValue — counts up from 0 for numeric values on scroll     */
/* ------------------------------------------------------------------ */

function AnimatedValue({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const isNumeric = /^\d+$/.test(value);
  const [displayValue, setDisplayValue] = useState(isNumeric ? "0" : value);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    const target = parseInt(value);
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target).toString());
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, isNumeric]);

  return (
    <p ref={ref} className={className}>
      {displayValue}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Explanatory paragraphs with icons                                 */
/* ------------------------------------------------------------------ */

const EXPLANATIONS = [
  {
    icon: Globe,
    title: "Il Circuito ATP:",
    text: "I giocatori professionisti viaggiano per il mondo affrontandosi nei tornei ufficiali. Ottengono punti in base all\u2019importanza del torneo e a quanto avanzano nel tabellone.",
  },
  {
    icon: CalendarDays,
    title: "Le 52 Settimane:",
    text: "La classifica non si azzera a gennaio. Conta i punti ottenuti esattamente nelle ultime 52 settimane. I punti \u201Cscadono\u201D un anno dopo essere stati conquistati.",
  },
  {
    icon: Trophy,
    title: "La Regola dei 19:",
    text: "Il ranking ufficiale considera solo i migliori 19 risultati stagionali di un giocatore, per evitare che venga premiato semplicemente chi gioca pi\u00F9 tornei.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Stat highlight cards                                              */
/* ------------------------------------------------------------------ */

const HIGHLIGHTS = [
  {
    icon: Trophy,
    value: "19",
    label: "I Migliori Risultati",
    desc: "Vengono sommati solo i tuoi migliori piazzamenti stagionali.",
  },
  {
    icon: CalendarDays,
    value: "52",
    label: "Settimane",
    desc: "La \u201Cfinestra\u201D mobile del ranking. Calcolata sull\u2019ultimo anno.",
  },
  {
    icon: RotateCcwSquare,
    value: "Zero",
    label: "Nessun Azzeramento",
    desc: "La classifica non si azzera mai a gennaio: \u00E8 una corsa senza traguardo.",
  },
  {
    icon: ShieldAlert,
    value: "Scadenza",
    label: "Difesa dei punti",
    desc: "Ogni risultato \u201Cscade\u201D dopo un anno solare. Devi tornare a vincere.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function RankingSection() {
  return (
    <section id="ranking" className="bg-surface-gray scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
              <BarChart3 className="h-3.5 w-3.5 text-primary-olive" />
              <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                Il Ranking
              </span>
            </div>
            <h2 className="text-headline-lg text-deep-navy mb-4">
              Come funziona la classifica mondiale?
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
              Il tennis è l&apos;unico sport globale che dura 11 mesi
              l&apos;anno. Non esiste una &quot;stagione regolare&quot; come nel
              calcio o nel basket: esiste solo il ranking mondiale, una
              classifica viva che cambia ogni lunedì.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Explanatory text */}
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl bg-white border border-border-subtle p-8 shadow-ambient">
              <h3 className="text-headline-sm text-deep-navy mb-6">
                I Punti e il Ranking
              </h3>

              <div className="space-y-5">
                {EXPLANATIONS.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <item.icon className="h-4.5 w-4.5 text-primary-olive" />
                    </div>
                    <div>
                      <p className="text-body-md text-text-muted leading-relaxed">
                        <strong className="text-deep-navy">{item.title}</strong>{" "}
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-baseline-lime/10 border border-baseline-lime/20 p-4">
                <p className="text-body-sm text-primary-olive font-medium">
                  ⚠️ Attenzione: chi l&apos;anno precedente ha guadagnato molti
                  punti vincendo un torneo, dovrà difendere quell&apos;ottimo
                  risultato l&apos;anno successivo tornando a vincere, altrimenti
                  perderà i punti in scadenza precipitando in classifica!
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Stat cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item, idx) => (
              <AnimatedSection key={item.label} delay={0.15 + idx * 0.1}>
                <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-ambient transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-baseline-lime/15 mb-4">
                    <item.icon className="h-4.5 w-4.5 text-primary-olive" />
                  </div>
                  <AnimatedValue
                    value={item.value}
                    className="text-headline-md text-deep-navy"
                  />
                  <p className="text-label-lg text-deep-navy mt-1">
                    {item.label}
                  </p>
                  <p className="text-body-sm text-text-muted mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
