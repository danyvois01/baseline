"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Crown,
  Medal,
  Award,
  Star,
  Layers,
  Footprints,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    id: "finals",
    name: "ATP Finals",
    points: "1500",
    tagline: "La punta della piramide",
    description:
      "Riservato solamente ai migliori 8 giocatori della stagione. È l'unico torneo con una spettacolare fase iniziale a gironi (Round Robin) prima delle semifinali a eliminazione diretta.",
    icon: Crown,
    color: "bg-amber-400",
    textColor: "text-amber-500",
    w: "w-[20%]",
  },
  {
    id: "slam",
    name: "Grand Slam",
    points: "2000",
    tagline: "I quattro pilastri storici",
    description:
      "Australian Open, Roland Garros, Wimbledon e US Open. I tornei più antichi, prestigiosi e fisicamente brutali: sono gli unici dove si gioca al meglio dei 5 set.",
    icon: Medal,
    color: "bg-violet-500",
    textColor: "text-violet-600",
    w: "w-[36%]",
  },
  {
    id: "masters",
    name: "Masters 1000",
    points: "1000",
    tagline: "L'élite del tour",
    description:
      "Nove appuntamenti obbligatori sparsi nel mondo, appena un gradino sotto gli Slam per importanza. Vincerne uno significa entrare nell'élite.",
    icon: Award,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    w: "w-[52%]",
  },
  {
    id: "500",
    name: "ATP 500",
    points: "500",
    tagline: "L'alto livello",
    description:
      "Tredici tornei di grande importanza. Cruciali per consolidare la propria posizione in Top 20 o per accumulare punti preziosi.",
    icon: Star,
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    w: "w-[68%]",
  },
  {
    id: "250",
    name: "ATP 250",
    points: "250",
    tagline: "La base del circuito maggiore",
    description:
      "L'ossatura del circuito. Decine di tornei in tutto il mondo ogni settimana, occasioni preziose per emergere e far debuttare i giovani talenti.",
    icon: Layers,
    color: "bg-gray-400",
    textColor: "text-gray-600",
    w: "w-[84%]",
  },
  {
    id: "challenger",
    name: "Challenger & ITF",
    points: "175",
    tagline: "Il trampolino di lancio",
    description:
      "Le leghe minori. Il trampolino di lancio essenziale per i giovani tennisti e per chi cerca di accumulare i primi punti.",
    icon: Footprints,
    color: "bg-stone-400",
    textColor: "text-stone-600",
    w: "w-[100%]",
  },
] as const;

// Componente per il singolo blocco di testo che aggiorna lo stato "active" quando entra nel viewport
function TierTextBlock({ 
  tier, 
  setActiveTier 
}: { 
  tier: typeof TIERS[number]; 
  setActiveTier: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Il margine negativo fa in modo che l'elemento sia considerato "in view" solo quando è vicino al centro dello schermo
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveTier(tier.id);
    }
  }, [isInView, tier.id, setActiveTier]);

  return (
    <div ref={ref} className="min-h-[100dvh] flex flex-col justify-center py-16 md:py-20">
      <motion.div 
        className={cn(
          "bg-surface-white/80 backdrop-blur-md border border-border-subtle rounded-3xl p-6 md:p-12 shadow-xl transition-all duration-700",
          isInView ? "opacity-100 scale-100" : "opacity-30 scale-95"
        )}
      >
        <div className="flex items-center gap-6 mb-6">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-white", tier.color)}>
            <tier.icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-[40px] font-heading font-extrabold text-foreground leading-none mb-2">{tier.name}</h3>
            <p className={cn("text-label-lg font-bold uppercase tracking-wider", tier.textColor)}>{tier.tagline}</p>
          </div>
        </div>
        
        <p className="text-body-xl text-foreground leading-relaxed mb-8">
          {tier.description}
        </p>

        <div className="inline-flex items-center gap-3 bg-surface-gray rounded-full px-5 py-2 border border-border-subtle">
          <span className="text-label-md font-medium text-text-muted">Punti al vincitore:</span>
          <span className={cn("text-headline-sm font-black", tier.textColor)}>{tier.points}</span>
        </div>
      </motion.div>
    </div>
  );
}

export function PyramidSection() {
  const [activeTier, setActiveTier] = useState<string>("finals");

  return (
    <section id="pyramid" className="relative w-full bg-surface-white">
      
      {/* Intro Titolo (Full Screen) */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
        <h2 className="text-[50px] md:text-[70px] font-heading font-extrabold text-foreground leading-none mb-8">
          La Piramide dei Tornei
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6 text-[18px] text-text-muted">
          <p className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-4">
            Non tutti i tornei sono uguali
          </p>
          <p className="leading-relaxed">
            I tornei sono divisi in categorie ben precise, che determinano il prestigio, la difficoltà e, ovviamente, i punti in palio. Più si sale verso il vertice della piramide, maggiore è la gloria.
          </p>
          <p className="leading-relaxed">
            I più importanti in assoluto sono i <strong className="text-foreground">Grand Slam</strong> (2000 punti al vincitore), seguiti dai Masters 1000, dagli ATP 500 e 250. La stagione culmina con le <strong className="text-amber-500">ATP Finals</strong>, riservate ai migliori 8 dell'anno.
          </p>
        </div>

        {/* Scroll indicator (like Hero) */}
        <button
          onClick={() => {
            const el = document.getElementById("pyramid-content");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted/60 hover:text-primary-olive transition-colors cursor-pointer"
          aria-label="Scroll to pyramid graphic"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Esplora la piramide</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      <div id="pyramid-content" className="max-w-[1400px] mx-auto px-6 relative flex flex-col lg:flex-row items-start">
        
        {/* Sinistra: Piramide Grafica (Sticky) */}
        <div className="hidden lg:flex lg:w-1/2 sticky top-0 pt-24 h-screen items-center justify-center p-12">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-2">
            {TIERS.map((tier, index) => {
              const activeIndex = TIERS.findIndex(t => t.id === activeTier);
              const isPassed = index <= activeIndex;
              const isActive = activeTier === tier.id;
              const isFinals = tier.id === "finals";
              
              return (
                <div 
                  key={tier.id + "-graphic"} 
                  className={cn(
                    "transition-all duration-500 ease-out flex items-center justify-center",
                    // The floating crown vs the pyramid tiers
                    isFinals 
                      ? "h-16 w-16 rounded-full mb-8 relative" 
                      : `h-12 rounded-lg mt-1 ${tier.w}`,
                    // Active vs inactive states
                    isActive 
                      ? `${tier.color} shadow-[0_0_30px_rgba(0,0,0,0.15)] scale-110 z-10` 
                      : isPassed
                        ? `${tier.color} opacity-90 scale-100` // Keep color for passed tiers
                        : isFinals 
                          ? "bg-surface-gray border border-amber-200 scale-100 opacity-50"
                          : "bg-surface-gray border border-border-subtle scale-100 opacity-60"
                  )}
                >
                  {isActive || isPassed ? (
                    <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
                      {isFinals ? <Crown className="w-8 h-8" /> : tier.name}
                    </span>
                  ) : (
                    isFinals && <Crown className="w-8 h-8 text-amber-500 opacity-60" />
                  )}
                  
                  {/* Visual connector line for the floating crown */}
                  {isFinals && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-6 border-l border-dashed border-border-subtle" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Destra: Testi a scorrimento */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="pb-[50vh]">
            {TIERS.map((tier) => (
              <TierTextBlock 
                key={tier.id} 
                tier={tier} 
                setActiveTier={setActiveTier} 
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
