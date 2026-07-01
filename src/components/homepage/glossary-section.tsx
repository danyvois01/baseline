"use client";

/**
 * GlossarySection — Page-based carousel of tennis dictionary cards.
 * No free-scrolling: navigation is fully controlled via arrow buttons
 * and pagination dots placed below the card area.
 * Shows 3 cards per page on desktop, 2 on tablet, 1 on mobile.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Swords,
  Minus,
  Globe,
  Feather,
  ArrowUpFromDot,
  AlertTriangle,
  Crosshair,
  XCircle,
  Target,
  RotateCw,
  Hand,
  ArrowDown,
  Disc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";

/** Glossary entries */
const TERMS = [
  {
    term: "ACE",
    icon: Zap,
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
    definition:
      "Un servizio vincente perfetto, su cui l'avversario non riesce nemmeno a mettere la racchetta.",
  },
  {
    term: "BREAK",
    icon: Swords,
    accentBg: "bg-red-50",
    accentText: "text-red-600",
    definition:
      "Vincere un game in cui a servire era l'avversario. Poiché chi batte ha un grosso vantaggio, \"strappare il servizio\" è la chiave per vincere.",
  },
  {
    term: "BASELINE",
    icon: Minus,
    accentBg: "bg-baseline-lime/15",
    accentText: "text-primary-olive",
    definition:
      "La linea di fondo campo. Il nostro nome. È da dove si batte e dove si scambiano la maggior parte dei colpi nel tennis moderno.",
  },
  {
    term: "LET",
    icon: Globe,
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
    definition:
      "Quando il servizio tocca il nastro della rete ma cade comunque nel rettangolo corretto. Il giudice chiama \"Let!\" e la battuta si ripete senza penalità.",
  },
  {
    term: "DOUBLE FAULT",
    icon: AlertTriangle,
    accentBg: "bg-orange-50",
    accentText: "text-orange-600",
    definition:
      "Chi batte ha due possibilità per mettere in campo il servizio. Se le sbaglia entrambe, perde il punto.",
  },
  {
    term: "DROP SHOT",
    icon: Feather,
    accentBg: "bg-purple-50",
    accentText: "text-purple-600",
    definition:
      "Un colpo \"smorzato\" che fa rimbalzare la palla appena oltre la rete, costringendo l'avversario a una corsa disperata in avanti.",
  },
  {
    term: "LOB",
    icon: ArrowUpFromDot,
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    definition:
      "Un colpo alto e arcuato, usato per scavalcare l'avversario quando questo si è avvicinato troppo alla rete.",
  },
  {
    term: "PASSANTE",
    icon: Crosshair,
    accentBg: "bg-cyan-50",
    accentText: "text-cyan-600",
    definition:
      "Il colpo con cui si supera lateralmente l'avversario che è sceso a rete. Può essere giocato in diagonale (cross) o lungo la linea (lungolinea).",
  },
  {
    term: "WINNER",
    icon: Target,
    accentBg: "bg-indigo-50",
    accentText: "text-indigo-600",
    definition:
      "Un colpo talmente potente, preciso o improvviso che l'avversario non riesce nemmeno a toccare con la racchetta prima del secondo rimbalzo.",
  },
  {
    term: "UNFORCED ERROR",
    icon: XCircle,
    accentBg: "bg-rose-50",
    accentText: "text-rose-600",
    definition:
      "L'incubo di ogni tennista. È un errore commesso su una palla comoda, senza che l'avversario abbia fatto nulla per mettere in difficoltà chi colpisce.",
  },
  {
    term: "TOP SPIN",
    icon: RotateCw,
    accentBg: "bg-teal-50",
    accentText: "text-teal-600",
    definition:
      "La rotazione dal basso verso l'alto impressa alla pallina. La fa viaggiare alta sopra la rete per poi farla scendere rapidamente, facendola rimbalzare alta e profonda. È la base del tennis moderno.",
  },
  {
    term: "VOLLEY",
    icon: Hand,
    accentBg: "bg-sky-50",
    accentText: "text-sky-600",
    definition:
      "Il colpo al volo, eseguito prima che la palla tocchi terra, solitamente quando ci si trova nei pressi della rete per chiudere il punto.",
  },
  {
    term: "SMASH",
    icon: ArrowDown,
    accentBg: "bg-red-50",
    accentText: "text-red-600",
    definition:
      "La schiacciata. Un colpo violento eseguito sopra la testa, quasi sempre in risposta a un lob corto dell'avversario. È l'equivalente della schiacciata nella pallavolo.",
  },
  {
    term: "SLICE",
    icon: Disc,
    accentBg: "bg-violet-50",
    accentText: "text-violet-600",
    definition:
      "La rotazione contraria al Top Spin, dall'alto verso il basso. La pallina rimane bassissima dopo il rimbalzo, costringendo l'avversario a piegare le gambe fino a terra per colpire.",
  },
];

/** Slide transition variants — slide direction matches navigation */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function GlossarySection() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Determine how many cards to show based on container width */
  const updateCardsPerView = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    if (width < 640) setCardsPerView(1);
    else if (width < 1024) setCardsPerView(2);
    else setCardsPerView(3);
  }, []);

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [updateCardsPerView]);

  const totalPages = Math.ceil(TERMS.length / cardsPerView);

  // Clamp page if window resize reduces total pages
  useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const goToPage = (newPage: number) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };

  const goPrev = () => {
    if (page > 0) goToPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages - 1) goToPage(page + 1);
  };

  /** Get the cards for the current page */
  const startIdx = page * cardsPerView;
  const visibleTerms = TERMS.slice(startIdx, startIdx + cardsPerView);

  return (
    <section id="glossary" className="bg-surface-gray scroll-mt-20">
      <div ref={containerRef} className="mx-auto max-w-[1280px] px-6 py-24">
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
              I telecronisti parlano spesso in codice. Ecco le parole chiave per
              seguire una partita senza perderti neanche un punto.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {/* Card area with fixed height to prevent layout shift */}
          <div className="relative overflow-hidden" style={{ minHeight: "220px" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn(
                  "grid gap-5",
                  cardsPerView === 1 && "grid-cols-1",
                  cardsPerView === 2 && "grid-cols-2",
                  cardsPerView === 3 && "grid-cols-3"
                )}
              >
                {visibleTerms.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-2xl bg-white border border-border-subtle p-6 shadow-ambient transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                  >
                    {/* Icon + Term header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "inline-flex items-center justify-center w-10 h-10 rounded-full",
                          item.accentBg
                        )}
                      >
                        <item.icon
                          className={cn("h-4.5 w-4.5", item.accentText)}
                        />
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
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation: arrows + dots in a single row */}
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Prev arrow */}
            <button
              onClick={goPrev}
              disabled={page === 0}
              aria-label="Precedente"
              className={cn(
                "w-10 h-10 rounded-full border border-border-subtle bg-white shadow-ambient",
                "flex items-center justify-center transition-all duration-200 cursor-pointer",
                "hover:shadow-md hover:bg-surface-hover",
                page === 0 && "opacity-30 pointer-events-none"
              )}
            >
              <ChevronLeft className="h-5 w-5 text-deep-navy" />
            </button>

            {/* Pagination dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Pagina ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all duration-300 cursor-pointer",
                    i === page
                      ? "w-8 h-2.5 bg-baseline-lime"
                      : "w-2.5 h-2.5 bg-border-subtle hover:bg-text-muted"
                  )}
                />
              ))}
            </div>

            {/* Next arrow */}
            <button
              onClick={goNext}
              disabled={page >= totalPages - 1}
              aria-label="Successivo"
              className={cn(
                "w-10 h-10 rounded-full border border-border-subtle bg-white shadow-ambient",
                "flex items-center justify-center transition-all duration-200 cursor-pointer",
                "hover:shadow-md hover:bg-surface-hover",
                page >= totalPages - 1 && "opacity-30 pointer-events-none"
              )}
            >
              <ChevronRight className="h-5 w-5 text-deep-navy" />
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
