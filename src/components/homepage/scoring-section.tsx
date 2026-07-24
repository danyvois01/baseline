"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";
import type { Dictionary } from "@/lib/i18n";
import { ScrollCue } from "./scroll-cue";

const SCORES = ["0", "15", "30", "40", "GAME"];

/** Chapter ids; titles/contents come from the locale dictionary by index. */
const CHAPTER_IDS = ["game", "deuce", "set", "tiebreak"] as const;

type Chapter = Dictionary["home"]["scoring"]["chapters"][number] & {
  id: (typeof CHAPTER_IDS)[number];
};

type ChapterId = (typeof CHAPTER_IDS)[number];

export function ScoringSection() {
  const { t } = useTranslation();
  const [activeChapter, setActiveChapter] = useState<ChapterId>("game");

  const chapters: Chapter[] = CHAPTER_IDS.map((id, i) => ({
    id,
    ...t.home.scoring.chapters[i],
  }));
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="scoring" ref={sectionRef} className="relative w-full bg-deep-navy text-white pb-24">
      {/* Soft seam: curved white-to-navy transition instead of a hard edge */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[60px] md:h-[120px]"
        >
          <path
            d="M0,120 C360,20 1080,20 1440,120 L1440,121 L0,121 Z"
            className="fill-deep-navy"
          />
        </svg>
      </div>

      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

      {/* Section header, styled like the light sections */}
      <div className="relative max-w-[1280px] mx-auto px-6 pt-20 md:pt-28 text-center">
        <h2 className="text-[40px] md:text-[64px] font-heading font-extrabold text-white leading-none mb-4">
          {t.home.scoring.title}
        </h2>
        <p className="text-body-lg text-white/60 max-w-2xl mx-auto">
          {t.home.scoring.lead}
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-6 relative flex flex-col md:flex-row gap-12 lg:gap-24">

        {/* Left Column: Scrolling Text */}
        <div className="w-full md:w-[45%] pt-16 pb-20 md:pt-24 md:py-[20vh]">
          {chapters.map((chapter) => (
             <ChapterBlock
               key={chapter.id}
               chapter={chapter}
               setActiveChapter={setActiveChapter}
             />
          ))}
        </div>

        {/* Right Column: Sticky Visuals (Desktop) */}
        <div className="hidden md:flex w-full md:w-[55%] sticky top-32 h-[calc(100vh-8rem)] items-center justify-center">
           <VisualContent activeChapter={activeChapter} />
        </div>

      </div>

      {/* Next-section cue (light variant on navy) */}
      <div className="relative flex justify-center pt-4">
        <ScrollCue targetId="glossary" label={t.home.scoring.scrollNext} variant="light" />
      </div>
    </section>
  );
}

// -- Components --

function ChapterBlock({
  chapter,
  setActiveChapter,
}: {
  chapter: Chapter;
  setActiveChapter: (id: ChapterId) => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  // Wider margin + taller blocks: each chapter "rests" longer while the
  // sticky scoreboard is in view, matching the held-scroll feel of Ranking
  const isInView = useInView(ref, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveChapter(chapter.id);
    }
  }, [isInView, chapter.id, setActiveChapter]);

  return (
    <motion.div
      ref={ref}
      className="min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center mb-24 md:mb-0"
      initial={{ opacity: 0.3, filter: "blur(4px)" }}
      animate={{ 
        opacity: isInView ? 1 : 0.3,
        filter: isInView ? "blur(0px)" : "blur(4px)" 
      }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-[32px] md:text-[45px] font-heading font-extrabold mb-6 text-white leading-tight">
        {chapter.title}
      </h3>
      <p className="text-body-xl text-white/70 leading-relaxed">
        {chapter.content}
      </p>
      {chapter.curiosity !== "" && (
        <div className="mt-8 p-6 rounded-2xl bg-baseline-lime/10 border border-baseline-lime/20 flex items-start gap-4">
          <Clock className="w-6 h-6 text-baseline-lime shrink-0 mt-1" />
          <p className="text-body-md text-white/80">
            <strong className="text-baseline-lime">{t.home.scoring.curiosityLabel}</strong> {chapter.curiosity}
          </p>
        </div>
      )}

      {/* Mobile Inline Visual */}
      <div className="md:hidden mt-12 w-full flex justify-center scale-90 sm:scale-100 origin-top">
        <VisualContent activeChapter={chapter.id} />
      </div>
    </motion.div>
  );
}

function VisualContent({ activeChapter }: { activeChapter: ChapterId }) {
  return (
    <AnimatePresence mode="wait">
      {activeChapter === "game" && <InteractiveScoreboard key="game" mode="game" />}
      {activeChapter === "deuce" && <InteractiveScoreboard key="deuce" mode="deuce" />}
      {activeChapter === "set" && <SetVisual key="set" />}
      {activeChapter === "tiebreak" && <TieBreakVisual key="tiebreak" />}
    </AnimatePresence>
  );
}

// -- Visual States --

function InteractiveScoreboard({ mode = "game" }: { mode?: "game" | "deuce" }) {
  const { t } = useTranslation();
  const [playerScore, setPlayerScore] = useState(mode === "deuce" ? 3 : 0);
  const [opponentScore, setOpponentScore] = useState(mode === "deuce" ? 3 : 0);
  const [advantage, setAdvantage] = useState<"player" | "opponent" | null>(null);

  const handlePlayerScore = () => {
    if (playerScore === 3 && opponentScore === 3) {
      if (advantage === "player") setPlayerScore(4);
      else if (advantage === "opponent") setAdvantage(null);
      else setAdvantage("player");
    } else if (playerScore < 4) {
      setPlayerScore(prev => prev + 1);
    }
  };

  const handleOpponentScore = () => {
    if (playerScore === 3 && opponentScore === 3) {
      if (advantage === "opponent") setOpponentScore(4);
      else if (advantage === "player") setAdvantage(null);
      else setAdvantage("opponent");
    } else if (opponentScore < 4) {
      setOpponentScore(prev => prev + 1);
    }
  };

  const reset = () => {
    setPlayerScore(mode === "deuce" ? 3 : 0);
    setOpponentScore(mode === "deuce" ? 3 : 0);
    setAdvantage(null);
  };

  const getDisplayScore = (score: number, adv: "player" | "opponent" | null, isPlayer: boolean) => {
    if (score === 4) return "GAME";
    if (playerScore === 3 && opponentScore === 3) {
      if (adv === (isPlayer ? "player" : "opponent")) return "AD";
      return "40"; // Deuce
    }
    return SCORES[score];
  };

  const getBadgeText = () => {
    const b = t.home.scoring.badges;
    if (playerScore === 4) return b.gameYouWin;
    if (opponentScore === 4) return b.gameOpponentWins;
    if (playerScore === 3 && opponentScore === 3) {
      if (advantage === "player") return b.advantageYou;
      if (advantage === "opponent") return b.advantageOpponent;
      if (mode === "deuce") return b.deuceClick;
      return b.deuce;
    }
    return b.gameIdle;
  };

  const getBadgeStyle = () => {
    if (playerScore === 4) return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    if (opponentScore === 4) return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    if (playerScore === 3 && opponentScore === 3) return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    return "bg-white/10 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto"
    >
      <div className={cn(
        "px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm backdrop-blur-md transition-colors text-center shadow-lg",
        getBadgeStyle()
      )}>
        {getBadgeText()}
      </div>

      <div className="relative overflow-hidden inline-flex flex-col items-center p-6 md:p-8 lg:p-10 rounded-[3rem] bg-black border-[4px] border-[#222] shadow-[0_30px_100px_rgba(0,0,0,0.8)] w-full">
        <div className="flex gap-4 md:gap-8">
        <div className="flex flex-col items-center">
          <span className="text-white/50 font-bold uppercase tracking-widest mb-3 md:mb-4 text-sm md:text-base">{t.home.scoring.you}</span>
          <button 
            onClick={handlePlayerScore}
            disabled={playerScore === 4 || opponentScore === 4}
            className={cn(
              "relative group w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden transition-transform active:scale-95",
              (playerScore === 4 || opponentScore === 4) && "opacity-50 pointer-events-none"
            )}
          >
            <div className="absolute inset-0 bg-baseline-lime/20 group-hover:bg-baseline-lime/40 transition-colors" />
            <span className={cn(
              "font-heading font-extrabold leading-none",
              playerScore === 4
                ? "text-[28px] md:text-[42px] text-baseline-lime drop-shadow-[0_0_15px_rgba(223,255,0,0.8)]"
                : "text-[50px] md:text-[80px] text-baseline-lime drop-shadow-[0_0_30px_rgba(223,255,0,0.8)]"
            )}>
              {getDisplayScore(playerScore, advantage, true)}
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4 pt-8 md:pt-10">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/20" />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/20" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white/50 font-bold uppercase tracking-widest mb-3 md:mb-4 text-sm md:text-base">{t.home.scoring.opponent}</span>
          <button 
            onClick={handleOpponentScore}
            disabled={playerScore === 4 || opponentScore === 4}
            className={cn(
              "relative group w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden transition-transform active:scale-95",
              (playerScore === 4 || opponentScore === 4) && "opacity-50 pointer-events-none"
            )}
          >
            <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors" />
            <span className={cn(
              "font-heading font-extrabold leading-none",
              opponentScore === 4
                ? "text-[28px] md:text-[42px] text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                : "text-[50px] md:text-[80px] text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
            )}>
              {getDisplayScore(opponentScore, advantage, false)}
            </span>
          </button>
        </div>
      </div>
        <AnimatePresence>
          {(playerScore === 4 || opponentScore === 4) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-[2.75rem]"
            >
              <button
                onClick={reset}
                className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest hover:bg-baseline-lime transition-colors text-sm md:text-base shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                {t.home.scoring.replay}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}



function SetVisual() {
  const { t } = useTranslation();
  const [playerGames, setPlayerGames] = useState(0);
  const [opponentGames, setOpponentGames] = useState(0);

  const getStatus = () => {
    if (playerGames === 6 && opponentGames <= 4) return "player_won";
    if (opponentGames === 6 && playerGames <= 4) return "opponent_won";
    if (playerGames === 7) return "player_won";
    if (opponentGames === 7) return "opponent_won";
    if (playerGames === 6 && opponentGames === 6) return "tie_break";
    return "playing";
  };

  const status = getStatus();

  const handlePlayerWinGame = () => {
    if (status === "player_won" || status === "opponent_won") return;
    setPlayerGames(p => p + 1);
  };

  const handleOpponentWinGame = () => {
    if (status === "player_won" || status === "opponent_won") return;
    setOpponentGames(p => p + 1);
  };

  const reset = () => {
    setPlayerGames(0);
    setOpponentGames(0);
  };

  const maxGames = (playerGames >= 5 && opponentGames >= 5) ? 7 : 6;

  const renderPlayerRow = (name: string, score: number, isPlayer: boolean) => {
    const boxes = [];
    for (let i = 1; i <= maxGames; i++) {
      if (i <= score) {
        boxes.push(
          <motion.div 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0",
              isPlayer 
                ? "bg-baseline-lime border-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.4)]"
                : "bg-white/10 border-white/20 text-white"
            )}
          >
            {i}
          </motion.div>
        );
      } else {
        boxes.push(
          <div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-dashed border-white/20 shrink-0" />
        );
      }
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 md:gap-8">
        <button
          onClick={isPlayer ? handlePlayerWinGame : handleOpponentWinGame}
          disabled={status === "player_won" || status === "opponent_won"}
          className={cn(
            "w-full sm:w-36 py-2 px-4 flex flex-col items-center justify-center rounded-full border-2 font-bold uppercase tracking-wider transition-transform active:scale-95 text-center shrink-0",
            isPlayer ? "border-baseline-lime text-baseline-lime hover:bg-baseline-lime/10" : "border-white/50 text-white/50 hover:bg-white/10",
            (status === "player_won" || status === "opponent_won") && "opacity-50 pointer-events-none"
          )}
        >
          <span className="text-xs opacity-70 leading-none mb-1">{t.home.scoring.plusOneGame}</span>
          <span className="text-sm leading-none">{name}</span>
        </button>
        <div className="flex gap-2 justify-center sm:justify-start">
          {boxes}
        </div>
      </div>
    );
  };

  const getBadgeText = () => {
    const b = t.home.scoring.badges;
    if (status === "player_won") return b.setYouWin;
    if (status === "opponent_won") return b.setOpponentWins;
    if (status === "tie_break") return b.setTiebreak;
    return b.setIdle;
  };

  const getBadgeStyle = () => {
    if (status === "player_won") return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    if (status === "opponent_won") return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    if (status === "tie_break") return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    return "bg-white/10 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto"
    >
      <div className={cn(
        "px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm backdrop-blur-md transition-colors text-center shadow-lg",
        getBadgeStyle()
      )}>
        {getBadgeText()}
      </div>

      <div className="relative overflow-hidden p-6 md:p-10 rounded-[3rem] bg-black border-[4px] border-[#222] shadow-[0_30px_100px_rgba(0,0,0,0.8)] w-full">
        <div className="flex flex-col gap-8 md:gap-10">
          {renderPlayerRow(t.home.scoring.you, playerGames, true)}
          {renderPlayerRow(t.home.scoring.opponent, opponentGames, false)}
        </div>

        <AnimatePresence>
          {(status === "player_won" || status === "opponent_won") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-[2.75rem]"
            >
              <button
                onClick={reset}
                className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest hover:bg-baseline-lime transition-colors text-sm md:text-base shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                {t.home.scoring.replay}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TieBreakVisual() {
  const { t } = useTranslation();
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const getStatus = () => {
    if (playerScore >= 7 && playerScore - opponentScore >= 2) return "player_won";
    if (opponentScore >= 7 && opponentScore - playerScore >= 2) return "opponent_won";
    return "playing";
  };

  const status = getStatus();

  const handlePlayerScore = () => {
    if (status !== "playing") return;
    setPlayerScore(p => p + 1);
  };

  const handleOpponentScore = () => {
    if (status !== "playing") return;
    setOpponentScore(p => p + 1);
  };

  const reset = () => {
    setPlayerScore(0);
    setOpponentScore(0);
  };

  const getBadgeText = () => {
    const b = t.home.scoring.badges;
    if (status === "player_won") return b.tiebreakYouWin;
    if (status === "opponent_won") return b.tiebreakOpponentWins;
    return b.tiebreakIdle;
  };

  const getBadgeStyle = () => {
    if (status === "player_won") return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    if (status === "opponent_won") return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
    return "bg-baseline-lime text-black shadow-[0_0_15px_rgba(223,255,0,0.5)]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6"
    >
      <div className={cn(
        "px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm backdrop-blur-md transition-colors text-center shadow-lg",
        getBadgeStyle()
      )}>
        {getBadgeText()}
      </div>

      <div className="relative inline-flex flex-col items-center p-6 md:p-8 lg:p-10 rounded-[3rem] bg-black border-[4px] border-[#222] shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-white/50 font-bold uppercase tracking-widest text-sm md:text-base">{t.home.scoring.you}</span>
            <button
              onClick={handlePlayerScore}
              disabled={status !== "playing"}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95",
                "bg-baseline-lime/10 border-baseline-lime hover:bg-baseline-lime/20 cursor-pointer shadow-[0_0_20px_rgba(223,255,0,0.2)]",
                status !== "playing" && "opacity-50 pointer-events-none"
              )}
            >
              <span className="text-[50px] md:text-[80px] font-heading font-extrabold text-baseline-lime drop-shadow-[0_0_30px_rgba(223,255,0,0.8)]">
                {playerScore}
              </span>
            </button>
            <span className={cn(
              "text-xs uppercase tracking-wider font-bold transition-opacity",
              status === "playing" ? "text-baseline-lime opacity-100 animate-pulse" : "opacity-0"
            )}>
              {t.home.scoring.clickHint}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 pt-8 md:pt-12">
             <div className="text-2xl md:text-3xl font-bold text-white/30">-</div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-white/50 font-bold uppercase tracking-widest text-sm md:text-base">{t.home.scoring.opponent}</span>
            <button
              onClick={handleOpponentScore}
              disabled={status !== "playing"}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95",
                "bg-white/5 border-white/20 hover:bg-white/10 cursor-pointer",
                status !== "playing" && "opacity-50 pointer-events-none"
              )}
            >
              <span className="text-[50px] md:text-[80px] font-heading font-extrabold text-white">
                {opponentScore}
              </span>
            </button>
            <span className={cn(
              "text-xs uppercase tracking-wider font-bold transition-opacity",
              status === "playing" ? "text-white/50 opacity-100" : "opacity-0"
            )}>
              {t.home.scoring.clickHint}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {status !== "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-[2.75rem]"
            >
              <button
                onClick={reset}
                className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest hover:bg-baseline-lime transition-colors text-sm md:text-base shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                {t.home.scoring.replay}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
