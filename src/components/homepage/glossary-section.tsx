"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";



export function GlossarySection() {
  const { t } = useTranslation();
  const terms = t.home.glossary.terms;
  const [activeIndex, setActiveIndex] = useState(0);
  const [leaveX, setLeaveX] = useState(-300);

  const navigate = (direction: "next" | "prev") => {
    // direction next -> card esce a sinistra (-300)
    // direction prev -> card esce a destra (300)
    setLeaveX(direction === "next" ? -300 : 300);
    setTimeout(() => {
      setActiveIndex((prev) => {
        if (direction === "next") return (prev + 1) % terms.length;
        return (prev - 1 + terms.length) % terms.length;
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

  const handleDragEnd = (_event: PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      navigate("prev"); // trascinato verso destra
    } else if (info.offset.x < -swipeThreshold) {
      navigate("next"); // trascinato verso sinistra
    }
  };

  // Otteniamo le 3 carte visibili per il loop infinito
  const visibleCards = [
    terms[activeIndex],
    terms[(activeIndex + 1) % terms.length],
    terms[(activeIndex + 2) % terms.length],
  ];

  return (
    <section id="glossary" className="relative w-full pt-28 pb-16 sm:pt-32 sm:pb-24 bg-surface-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header - Centrato */}
        <div className="text-center mb-6 sm:mb-8 relative z-10 w-full max-w-2xl">
          <h2 className="text-[36px] sm:text-[48px] font-heading font-extrabold text-foreground mb-3 leading-tight">
            {t.home.glossary.title}
          </h2>
          <p className="text-base sm:text-lg text-foreground/60 font-medium leading-relaxed">
            {t.home.glossary.lead}
          </p>
        </div>

        {/* Marquee (News Ticker style) */}
        <div className="w-full relative mb-8 sm:mb-10 border-y border-border-subtle overflow-hidden bg-surface-white">
          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap py-3 sm:py-4 items-center w-max">
            {/* Ripetiamo l'array 4 volte per coprire schermi larghi e permettere il loop infinito */}
            {[...terms, ...terms, ...terms, ...terms].map((item, idx) => {
              const realIndex = idx % terms.length;
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
                      : "bg-transparent border-transparent text-foreground/30 group-hover:text-foreground hover:bg-surface-gray/10"
                  }`}>
                    {item.term}
                  </span>
                  <span className="ml-4 sm:ml-6 text-foreground/10 text-xs">●</span>
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
            className="hidden sm:flex w-14 h-14 rounded-full bg-surface-white border border-border-subtle shadow-sm items-center justify-center text-foreground hover:bg-surface-gray hover:scale-110 transition-all group z-20"
            aria-label={t.home.glossary.prevCard}
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
                    className={`absolute inset-0 w-full h-full rounded-[32px] bg-deep-navy text-white shadow-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center border-[8px] border-white/5 origin-bottom ${
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
                         <span>{t.home.glossary.swipeHint}</span>
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
            aria-label={t.home.glossary.nextCard}
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
