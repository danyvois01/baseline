"use client";

/**
 * SectionTabBar — Horizontal fixed tab bar for quick navigation between
 * homepage sections. Replaces the dot-nav SectionNavigator.
 *
 * Behaviour:
 * - Renders as `fixed top-0` and appears once the user scrolls past the hero.
 * - Stays visible even when scrolling back up, covering the TopNavBar.
 * - Hides only when the user is very near the top of the page (hero fully visible).
 * - Tracks the currently visible section via scroll position.
 * - Active pill uses baseline-lime; inactive pills are subtle.
 * - On mobile: horizontally scrollable with hidden scrollbar.
 * - Logo on the left: click to scroll back to the top of the page.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionMeta {
  readonly id: string;
  readonly label: string;
}

interface SectionTabBarProps {
  sections: readonly SectionMeta[];
}

/** Height of the tab bar in pixels (h-12 = 48px) */
const TAB_BAR_HEIGHT = 48;

export function SectionTabBar({ sections }: SectionTabBarProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  /* ── Track active section + visibility on scroll ── */
  useEffect(() => {
    const handleScroll = () => {
      // Show the tab bar once scrolled past ~60% of the viewport (hero area)
      const threshold = window.innerHeight * 0.6;
      setIsVisible(window.scrollY > threshold);

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            setActiveId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  /* ── Auto-scroll the tab container to keep active tab visible ── */
  useEffect(() => {
    const activeTab = tabRefs.current.get(activeId);
    if (activeTab && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (
        tabRect.left < containerRect.left ||
        tabRect.right > containerRect.right
      ) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeId]);

  /* ── Click handler: smooth scroll to section ── */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset by the tab bar height so the section isn't hidden behind it
      const top = el.getBoundingClientRect().top + window.scrollY - TAB_BAR_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  /* ── Click handler: scroll back to top ── */
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Ref callback for tab buttons ── */
  const setTabRef = useCallback(
    (id: string) => (node: HTMLButtonElement | null) => {
      if (node) {
        tabRefs.current.set(id, node);
      } else {
        tabRefs.current.delete(id);
      }
    },
    []
  );

  return (
    <>
      {/* Spacer — occupies the same space in the flow so content doesn't jump */}
      <div style={{ height: TAB_BAR_HEIGHT }} />

      {/* Fixed tab bar — overlays the viewport top */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -TAB_BAR_HEIGHT, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -TAB_BAR_HEIGHT, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-surface-white dark:bg-[#0A0E14] border-b border-border-subtle dark:border-white/10 shadow-ambient"
          >
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
              <div className="flex items-center h-12 gap-3">
                {/* ── Logo: scroll to top ── */}
                <button
                  onClick={scrollToTop}
                  className="shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-70"
                  aria-label="Torna all'inizio"
                >
                  <Image
                    src="/logo_new_crop.png"
                    alt="Baseline"
                    width={120}
                    height={28}
                    style={{ width: "auto", height: "28px" }}
                    className="object-contain"
                  />
                </button>

                {/* ── Vertical divider ── */}
                <div className="shrink-0 w-px h-5 bg-border-subtle dark:bg-white/15" />

                {/* ── Section pills (horizontally scrollable on mobile) ── */}
                <div
                  ref={scrollContainerRef}
                  className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide"
                >
                  {sections.map((section) => {
                    const isActive = activeId === section.id;
                    return (
                      <button
                        key={section.id}
                        ref={setTabRef(section.id)}
                        onClick={() => scrollTo(section.id)}
                        className={cn(
                          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                          isActive
                            ? "bg-baseline-lime text-deep-navy"
                            : "text-text-muted hover:bg-surface-gray dark:hover:bg-white/10 hover:text-deep-navy dark:hover:text-white"
                        )}
                        aria-label={`Vai a ${section.label}`}
                      >
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
