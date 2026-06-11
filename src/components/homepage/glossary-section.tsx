"use client";

/**
 * GlossarySection — Grid of tennis dictionary cards with
 * minimalist icon badges.  Each card has a hover lift effect.
 */

import {
  Zap,
  Swords,
  Minus,
  Globe,
  Feather,
  ArrowUpFromDot,
} from "lucide-react";
import { AnimatedSection } from "./animated-section";

/** Glossary entries */
const TERMS = [
  {
    term: "ACE",
    icon: Zap,
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
    definition:
      "Un servizio vincente perfetto, in cui la pallina atterra nel rettangolo giusto e l'avversario non riesce nemmeno a sfiorarla con la racchetta.",
  },
  {
    term: "BREAK",
    icon: Swords,
    accentBg: "bg-red-50",
    accentText: "text-red-600",
    definition:
      "Vincere un game quando a servire è l'avversario. Poiché chi batte ha un grosso vantaggio, \"strappare il servizio\" (fare un break) è la chiave per vincere i set.",
  },
  {
    term: "BASELINE",
    icon: Minus,
    accentBg: "bg-baseline-lime/15",
    accentText: "text-primary-olive",
    definition:
      "La linea di fondo campo. I giocatori che amano costruire il gioco da qui, tempestando l'avversario di colpi potenti, sono chiamati \"baseliner\". È la base da cui parte il tennis moderno.",
  },
  {
    term: "NET",
    icon: Globe,
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
    definition:
      "\"Net!\" è la chiamata del giudice di sedia quando il servizio tocca il nastro superiore ma cade comunque nel rettangolo corretto. Il servizio va ripetuto senza penalità.",
  },
  {
    term: "DROP SHOT",
    icon: Feather,
    accentBg: "bg-purple-50",
    accentText: "text-purple-600",
    definition:
      "Un colpo \"smorzato\" e leggero, che fa rimbalzare la palla appena oltre la rete, costringendo l'avversario a una corsa disperata in avanti.",
  },
  {
    term: "LOB",
    icon: ArrowUpFromDot,
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    definition:
      "Un colpo alto e arcuato, usato per scavalcare l'avversario quando questo si è avventato troppo a ridosso della rete.",
  },
] as const;

export function GlossarySection() {
  return (
    <section id="glossary" className="bg-surface-gray scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
              <Zap className="h-3.5 w-3.5 text-primary-olive" />
              <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                Dizionario
              </span>
            </div>
            <h2 className="text-headline-lg text-deep-navy mb-4">
              Parla come un Pro
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
              I termini essenziali per seguire una partita di tennis senza
              perderti neanche un punto.
            </p>
          </div>
        </AnimatedSection>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TERMS.map((item, idx) => (
            <AnimatedSection key={item.term} delay={0.1 + idx * 0.07}>
              <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-ambient transition-all duration-200 hover:shadow-md hover:-translate-y-1 h-full">
                {/* Icon + Term header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.accentBg}`}
                  >
                    <item.icon className={`h-4.5 w-4.5 ${item.accentText}`} />
                  </div>
                  <h3 className="text-headline-sm text-deep-navy font-bold tracking-wide">
                    {item.term}
                  </h3>
                </div>

                {/* Definition */}
                <p className="text-body-md text-text-muted leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
