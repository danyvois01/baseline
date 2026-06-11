"use client";

/**
 * RankingSection — Explains how the ATP ranking system works:
 * 52 weeks, best-19 results, point accumulation and defence.
 */

import { Trophy, BarChart3, CalendarDays, ShieldAlert } from "lucide-react";
import { AnimatedSection } from "./animated-section";

/** Quick stat cards displayed beside the explanatory text */
const HIGHLIGHTS = [
  {
    icon: Trophy,
    value: "19",
    label: "Migliori Risultati",
    desc: "contano per il ranking",
  },
  {
    icon: CalendarDays,
    value: "52",
    label: "Settimane",
    desc: "finestra temporale",
  },
  {
    icon: BarChart3,
    value: "2000",
    label: "Punti Max",
    desc: "per un singolo torneo",
  },
  {
    icon: ShieldAlert,
    value: "Difesa",
    label: "Punti in Scadenza",
    desc: "da riconquistare ogni anno",
  },
] as const;

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
              Come funziona il Tennis?
            </h2>
            <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
              Il tennis è uno sport globale in cui i giocatori professionisti si
              sfidano in decine di tornei durante l&apos;anno, viaggiando in
              tutto il mondo. L&apos;obiettivo? Vincere partite, sollevare trofei
              e, soprattutto,{" "}
              <strong className="text-deep-navy">accumulare punti</strong> per
              scalare il &quot;Ranking Mondiale&quot; (la classifica).
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Explanatory text */}
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl bg-white border border-border-subtle p-8 shadow-ambient">
              <h3 className="text-headline-sm text-deep-navy mb-4">
                I Punti e il Ranking
              </h3>
              <p className="text-body-md text-text-muted leading-relaxed">
                Il sistema di classifica ufficiale tiene conto delle{" "}
                <strong className="text-deep-navy">
                  migliori 19 prestazioni
                </strong>{" "}
                di un giocatore nelle ultime{" "}
                <strong className="text-deep-navy">52 settimane</strong>. I punti
                guadagnati in un torneo variano in base a due fattori:
                l&apos;importanza del torneo e fino a che punto del tabellone
                riesci ad arrivare (es. vincere il torneo dà il massimo dei
                punti, arrivare in finale ne dà circa la metà, e così via a
                scendere per semifinali, quarti, ecc.).
              </p>
              <div className="mt-6 rounded-xl bg-baseline-lime/10 border border-baseline-lime/20 p-4">
                <p className="text-body-sm text-primary-olive font-medium">
                  ⚠️ Attenzione: chi l&apos;anno precedente ha guadagnato molti
                  punti in un torneo, dovrà difendere quell&apos;ottimo risultato
                  l&apos;anno successivo, altrimenti perderà i punti in
                  scadenza!
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
                  <p className="text-headline-md text-deep-navy">{item.value}</p>
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
