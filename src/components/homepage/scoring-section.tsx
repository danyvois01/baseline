"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
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

/*
 * Shared styling for the scoreboard object: a navy "device" card matching
 * the glossary deck (same radius, border, shadow) so the dark accent is a
 * branded object on the light page, not a separate dark theme.
 */
const BOARD_CARD =
  "relative overflow-hidden rounded-[32px] bg-deep-navy text-white shadow-2xl border-[8px] border-white/5";

export function ScoringSection() {
  const { t } = useTranslation();

  const chapters: Chapter[] = CHAPTER_IDS.map((id, i) => ({
    id,
    ...t.home.scoring.chapters[i],
  }));
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="scoring" ref={sectionRef} className="relative w-full bg-surface-white py-20 md:py-28">

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header — simple intro block like Timeline */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[50px] md:text-[80px] font-heading font-extrabold text-foreground leading-none mb-6">
            {t.home.scoring.title}
          </h2>
          <p className="text-body-xl text-text-muted max-w-2xl mx-auto">
            {t.home.scoring.lead}
          </p>
        </div>

        {/*
          Unified chapter cards: explanation and its scoreboard live inside
          the same frame and scroll together — alignment by construction.
        */}
        <div className="flex flex-col gap-8 md:gap-0">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

        {/* Next-section cue */}
        <div className="flex justify-center pt-12 md:pt-16">
          <ScrollCue targetId="glossary" label={t.home.scoring.scrollNext} />
        </div>
      </div>
    </section>
  );
}

// -- Components --

/** The interactive visual belonging to a chapter. */
function ChapterVisual({ id }: { id: ChapterId }) {
  switch (id) {
    case "game":
      return <InteractiveScoreboard mode="game" />;
    case "deuce":
      return <InteractiveScoreboard mode="deuce" />;
    case "set":
      return <SetVisual />;
    case "tiebreak":
      return <TieBreakVisual />;
  }
}

/**
 * One chapter = one wide card: text on the left, its own scoreboard on
 * the right. One-shot entrance reveal (no scroll-linked state toggling:
 * a bidirectional in-view effect made touchpad scrolling stutter).
 */
function ChapterCard({ chapter }: { chapter: Chapter }) {
  const { t } = useTranslation();

  return (
    <div className="md:min-h-[90vh] flex items-center md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center bg-surface-white border border-border-subtle rounded-3xl p-6 md:p-10 lg:p-12 shadow-xl"
      >
        {/* Explanation */}
        <div>
          <h3 className="text-[28px] md:text-[34px] lg:text-[38px] font-heading font-extrabold mb-6 text-foreground leading-tight">
            {chapter.title}
          </h3>
          <p className="text-body-xl text-text-muted leading-relaxed">
            {chapter.content}
          </p>
          {chapter.curiosity !== "" && (
            <div className="mt-8 p-5 md:p-6 rounded-2xl bg-surface-gray/60 border border-border-subtle flex items-start gap-4">
              {/* Icon chip: same treatment as the Ranking stat cards */}
              <div className="w-10 h-10 rounded-full bg-baseline-lime flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(223,255,0,0.35)]">
                <Lightbulb className="w-5 h-5 text-deep-navy" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">
                  {t.home.scoring.curiosityLabel}
                </p>
                <p className="text-body-md text-foreground/80 leading-relaxed">
                  {chapter.curiosity}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Its scoreboard, inside the same frame */}
        <div className="flex justify-center w-full">
          <ChapterVisual id={chapter.id} />
        </div>
      </motion.div>
    </div>
  );
}

/** Status badge above the scoreboard: one consistent lime style. */
function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm text-center bg-baseline-lime text-deep-navy shadow-[0_0_15px_rgba(223,255,0,0.4)]">
      {children}
    </div>
  );
}

/** Full-card overlay with the replay button, shown when a rally ends. */
function ReplayOverlay({ show, onReset, label }: { show: boolean; onReset: () => void; label: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-deep-navy/70 backdrop-blur-sm z-10 rounded-3xl"
        >
          <button
            onClick={onReset}
            className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-baseline-lime text-deep-navy font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(223,255,0,0.5)] hover:scale-105 transition-all text-sm md:text-base"
          >
            {label}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// -- Visual States --

function InteractiveScoreboard({ mode = "game" }: { mode?: "game" | "deuce" }) {
  const { t } = useTranslation();
  const [playerScore, setPlayerScore] = useState(mode === "deuce" ? 3 : 0);
  const [opponentScore, setOpponentScore] = useState(mode === "deuce" ? 3 : 0);
  const [advantage, setAdvantage] = useState<"player" | "opponent" | null>(null);

  const gameOver = playerScore === 4 || opponentScore === 4;

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto"
    >
      <StatusBadge>{getBadgeText()}</StatusBadge>

      <div className={cn(BOARD_CARD, "inline-flex flex-col items-center p-6 md:p-8 lg:p-10 w-full")}>
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-white/50 font-bold uppercase tracking-widest mb-3 md:mb-4 text-sm md:text-base">{t.home.scoring.you}</span>
            <button
              onClick={handlePlayerScore}
              disabled={gameOver}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95 cursor-pointer",
                "bg-baseline-lime/10 border-baseline-lime/60 hover:bg-baseline-lime/20",
                gameOver && "opacity-50 pointer-events-none"
              )}
            >
              <span className={cn(
                "font-heading font-extrabold leading-none text-baseline-lime drop-shadow-[0_0_20px_rgba(223,255,0,0.6)]",
                playerScore === 4 ? "text-[28px] md:text-[42px]" : "text-[50px] md:text-[80px]"
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
              disabled={gameOver}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95 cursor-pointer",
                "bg-white/5 border-white/20 hover:bg-white/10",
                gameOver && "opacity-50 pointer-events-none"
              )}
            >
              <span className={cn(
                "font-heading font-extrabold leading-none text-white",
                opponentScore === 4 ? "text-[28px] md:text-[42px]" : "text-[50px] md:text-[80px]"
              )}>
                {getDisplayScore(opponentScore, advantage, false)}
              </span>
            </button>
          </div>
        </div>

        <ReplayOverlay show={gameOver} onReset={reset} label={t.home.scoring.replay} />
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
  const setOver = status === "player_won" || status === "opponent_won";

  const handlePlayerWinGame = () => {
    if (setOver) return;
    setPlayerGames(p => p + 1);
  };

  const handleOpponentWinGame = () => {
    if (setOver) return;
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
              "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs sm:text-sm",
              isPlayer
                ? "bg-baseline-lime border-baseline-lime text-deep-navy shadow-[0_0_15px_rgba(223,255,0,0.4)]"
                : "bg-white/10 border-white/20 text-white"
            )}
          >
            {i}
          </motion.div>
        );
      } else {
        boxes.push(
          <div key={`empty-${i}`} className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-dashed border-white/20" />
        );
      }
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 md:gap-8">
        <button
          onClick={isPlayer ? handlePlayerWinGame : handleOpponentWinGame}
          disabled={setOver}
          className={cn(
            "w-full sm:w-36 py-2 px-4 flex flex-col items-center justify-center rounded-full border-2 font-bold uppercase tracking-wider transition-transform active:scale-95 text-center shrink-0",
            isPlayer ? "border-baseline-lime text-baseline-lime hover:bg-baseline-lime/10" : "border-white/50 text-white/50 hover:bg-white/10",
            setOver && "opacity-50 pointer-events-none"
          )}
        >
          <span className="text-xs opacity-70 leading-none mb-1">{t.home.scoring.plusOneGame}</span>
          <span className="text-sm leading-none">{name}</span>
        </button>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto"
    >
      <StatusBadge>{getBadgeText()}</StatusBadge>

      <div className={cn(BOARD_CARD, "p-6 md:p-10 w-full")}>
        <div className="flex flex-col gap-8 md:gap-10">
          {renderPlayerRow(t.home.scoring.you, playerGames, true)}
          {renderPlayerRow(t.home.scoring.opponent, opponentGames, false)}
        </div>

        <ReplayOverlay show={setOver} onReset={reset} label={t.home.scoring.replay} />
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
  const over = status !== "playing";

  const handlePlayerScore = () => {
    if (over) return;
    setPlayerScore(p => p + 1);
  };

  const handleOpponentScore = () => {
    if (over) return;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6"
    >
      <StatusBadge>{getBadgeText()}</StatusBadge>

      <div className={cn(BOARD_CARD, "inline-flex flex-col items-center p-6 md:p-8 lg:p-10")}>
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-white/50 font-bold uppercase tracking-widest text-sm md:text-base">{t.home.scoring.you}</span>
            <button
              onClick={handlePlayerScore}
              disabled={over}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95 cursor-pointer",
                "bg-baseline-lime/10 border-baseline-lime/60 hover:bg-baseline-lime/20",
                over && "opacity-50 pointer-events-none"
              )}
            >
              <span className="text-[50px] md:text-[80px] font-heading font-extrabold text-baseline-lime drop-shadow-[0_0_20px_rgba(223,255,0,0.6)]">
                {playerScore}
              </span>
            </button>
            <span className={cn(
              "text-xs uppercase tracking-wider font-bold transition-opacity",
              !over ? "text-baseline-lime opacity-100 animate-pulse" : "opacity-0"
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
              disabled={over}
              className={cn(
                "w-20 h-28 md:w-32 md:h-40 rounded-3xl flex items-center justify-center border-2 transition-all active:scale-95 cursor-pointer",
                "bg-white/5 border-white/20 hover:bg-white/10",
                over && "opacity-50 pointer-events-none"
              )}
            >
              <span className="text-[50px] md:text-[80px] font-heading font-extrabold text-white">
                {opponentScore}
              </span>
            </button>
            <span className={cn(
              "text-xs uppercase tracking-wider font-bold transition-opacity",
              !over ? "text-white/50 opacity-100" : "opacity-0"
            )}>
              {t.home.scoring.clickHint}
            </span>
          </div>
        </div>

        <ReplayOverlay show={over} onReset={reset} label={t.home.scoring.replay} />
      </div>
    </motion.div>
  );
}
