"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TERMS = [
  {
    term: "ACE",
    def: "Un servizio vincente perfetto, su cui l'avversario non riesce nemmeno a mettere la racchetta.",
  },
  {
    term: "BREAK",
    def: "Vincere un game in cui a servire era l'avversario. Poiché chi batte ha un grosso vantaggio, \"strappare il servizio\" è la chiave per vincere.",
  },
  {
    term: "BASELINE",
    def: "La linea di fondo campo. Il nostro nome. È da dove si batte e dove si scambiano la maggior parte dei colpi nel tennis moderno.",
  },
  {
    term: "LET",
    def: "Quando il servizio tocca il nastro della rete ma cade comunque nel rettangolo corretto. Il giudice chiama \"Let!\" e la battuta si ripete senza penalità.",
  },
  {
    term: "DOUBLE FAULT",
    def: "Chi batte ha due possibilità per mettere in campo il servizio. Se le sbaglia entrambe, perde il punto.",
  },
  {
    term: "DROP SHOT",
    def: "Un colpo \"smorzato\" che fa rimbalzare la palla appena oltre la rete, costringendo l'avversario a una corsa disperata in avanti.",
  },
  {
    term: "LOB",
    def: "Un colpo alto e arcuato, usato per scavalcare l'avversario quando questo si è avvicinato troppo alla rete.",
  },
  {
    term: "PASSANTE",
    def: "Il colpo con cui si supera lateralmente l'avversario che è sceso a rete. Può essere giocato in diagonale (cross) o lungo la linea (lungolinea).",
  },
  {
    term: "WINNER",
    def: "Un colpo talmente potente, preciso o improvviso che l'avversario non riesce nemmeno a toccare con la racchetta prima del secondo rimbalzo.",
  },
  {
    term: "UNFORCED ERROR",
    def: "L'incubo di ogni tennista. È un errore commesso su una palla comoda, senza che l'avversario abbia fatto nulla per mettere in difficoltà chi colpisce.",
  },
  {
    term: "TOP SPIN",
    def: "La rotazione dal basso verso l'alto impressa alla pallina. La fa viaggiare alta sopra la rete per poi farla scendere rapidamente, facendola rimbalzare alta e profonda. È la base del tennis moderno.",
  },
  {
    term: "VOLLEY",
    def: "Il colpo al volo, eseguito prima che la palla tocchi terra, solitamente quando ci si trova nei pressi della rete per chiudere il punto.",
  },
  {
    term: "SMASH",
    def: "La schiacciata. Un colpo violento eseguito sopra la testa, quasi sempre in risposta a un lob corto dell'avversario. È l'equivalente della schiacciata nella pallavolo.",
  },
  {
    term: "SLICE",
    def: "La rotazione contraria al Top Spin, dall'alto verso il basso. La pallina rimane bassissima dopo il rimbalzo, costringendo l'avversario a piegare le gambe fino a terra per colpire.",
  },
  {
    term: "SERVE & VOLLEY",
    def: "Una tattica aggressiva e spettacolare. Subito dopo aver battuto, il giocatore corre verso la rete per chiudere il punto al volo, togliendo tempo all'avversario.",
  },
];

export function GlossarySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leaveX, setLeaveX] = useState(-300);

  const navigate = (direction: "next" | "prev") => {
    // direction next -> card esce a sinistra (-300)
    // direction prev -> card esce a destra (300)
    setLeaveX(direction === "next" ? -300 : 300);
    setTimeout(() => {
      setActiveIndex((prev) => {
        if (direction === "next") return (prev + 1) % TERMS.length;
        return (prev - 1 + TERMS.length) % TERMS.length;
      });
    }, 10);
  };

  const jumpTo = (index: number) => {
    if (index === activeIndex) return;
    setLeaveX(index > activeIndex ? -300 : 300);
    setTimeout(() => {
      setActiveIndex(index);
    }, 10);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      navigate("prev"); // trascinato verso destra
    } else if (info.offset.x < -swipeThreshold) {
      navigate("next"); // trascinato verso sinistra
    }
  };

  // Otteniamo le 3 carte visibili per il loop infinito
  const visibleCards = [
    TERMS[activeIndex],
    TERMS[(activeIndex + 1) % TERMS.length],
    TERMS[(activeIndex + 2) % TERMS.length],
  ];

  return (
    <section id="glossary" className="relative w-full pt-28 pb-16 sm:pt-32 sm:pb-24 bg-surface-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header - Centrato */}
        <div className="text-center mb-6 sm:mb-8 relative z-10 w-full max-w-2xl">
          <h2 className="text-[36px] sm:text-[48px] font-heading font-extrabold text-deep-navy mb-3 leading-tight">
            Parla come un Pro
          </h2>
          <p className="text-base sm:text-lg text-deep-navy/60 font-medium leading-relaxed">
            I telecronisti parlano spesso in codice. Ecco le parole chiave per seguire una partita senza perderti neanche un punto.
          </p>
        </div>

        {/* Marquee (News Ticker style) */}
        <div className="w-full relative mb-8 sm:mb-10 border-y border-border-subtle overflow-hidden bg-surface-white">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap py-3 sm:py-4 items-center w-max">
            {/* Ripetiamo l'array 4 volte per coprire schermi larghi e permettere il loop infinito */}
            {[...TERMS, ...TERMS, ...TERMS, ...TERMS].map((item, idx) => {
              const realIndex = idx % TERMS.length;
              const isActive = activeIndex === realIndex;
              return (
                <button
                  key={`marquee-${idx}`}
                  onClick={() => jumpTo(realIndex)}
                  className={`flex items-center group transition-all duration-300 mx-2 sm:mx-4`}
                >
                  <span className={`text-lg sm:text-xl font-heading font-black uppercase tracking-widest transition-all duration-300 px-5 py-1.5 rounded-full border-2 ${
                    isActive 
                      ? "bg-[#DFFF00] border-[#DFFF00] text-deep-navy shadow-md scale-105" 
                      : "bg-transparent border-transparent text-deep-navy/30 group-hover:text-deep-navy hover:bg-surface-gray/10"
                  }`}>
                    {item.term}
                  </span>
                  <span className="ml-4 sm:ml-6 text-deep-navy/10 text-xs">●</span>
                </button>
              );
            })}
          </div>
          {/* Sfumature laterali */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-surface-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-surface-white to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Card Stack e Controlli Laterali */}
        <div className="flex items-center justify-center w-full gap-4 sm:gap-12 mt-4 sm:mt-8">
          
          {/* Freccia Sinistra (Nascosta su mobile dove si usa lo swipe) */}
          <button
            onClick={() => navigate("prev")}
            className="hidden sm:flex w-14 h-14 rounded-full bg-white border border-border-subtle shadow-sm items-center justify-center text-deep-navy hover:bg-surface-gray hover:scale-110 transition-all group z-20"
            aria-label="Carta precedente"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Card Stack Container */}
          <div className="relative w-full max-w-[340px] sm:max-w-[440px] h-[280px] sm:h-[300px] z-10">
            <AnimatePresence custom={leaveX}>
              {visibleCards.map((item, index) => {
                const isTopCard = index === 0;
                
                return (
                  <motion.div
                    key={item.term}
                    custom={leaveX}
                    variants={{
                      initial: { scale: 0.95, y: 40, opacity: 0 },
                      animate: { 
                        scale: 1 - index * 0.05, 
                        y: index * 18, 
                        opacity: 1 - index * 0.1 
                      },
                      exit: (dir) => ({
                        x: dir,
                        opacity: 0,
                        scale: 0.8,
                        rotate: dir > 0 ? 15 : -15,
                        transition: { duration: 0.2, ease: "easeOut" }
                      })
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`absolute inset-0 w-full h-full rounded-[32px] bg-deep-navy text-white shadow-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center border-[8px] border-surface-white/5 origin-bottom ${
                      isTopCard ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                    style={{ zIndex: 10 - index }}
                    drag={isTopCard ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={isTopCard ? handleDragEnd : undefined}
                    whileDrag={{ rotate: 3, scale: 1.05 }}
                  >
                    <h3 className="text-3xl sm:text-4xl font-heading font-black text-[#DFFF00] mb-4 uppercase tracking-wider">
                      {item.term}
                    </h3>
                    <p className="text-base sm:text-lg text-surface-gray font-medium leading-relaxed">
                      {item.def}
                    </p>
                    
                    {isTopCard && (
                       <div className="absolute bottom-6 flex gap-4 text-surface-gray/40 font-bold uppercase tracking-widest text-xs pointer-events-none sm:hidden">
                         <span>&larr; Swipe &rarr;</span>
                       </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Freccia Destra (Nascosta su mobile) */}
          <button
            onClick={() => navigate("next")}
            className="hidden sm:flex w-14 h-14 rounded-full bg-deep-navy text-white shadow-lg shadow-deep-navy/20 items-center justify-center hover:bg-deep-navy/90 hover:scale-110 transition-all group z-20"
            aria-label="Prossima carta"
          >
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
      
      {/* Stili personalizzati per marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        /* Pausa l'animazione se la prefers-reduced-motion è attiva */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation-play-state: paused;
          }
        }
      `}} />
    </section>
  );
}
