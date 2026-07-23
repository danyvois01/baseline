"use client";

/**
 * SectionNavigator — Floating sticky dot-nav that tracks viewport scroll
 * position and highlights the active section.  Hidden on small screens.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionMeta {
  readonly id: string;
  readonly label: string;
}

interface SectionNavigatorProps {
  sections: readonly SectionMeta[];
}

export function SectionNavigator({ sections }: SectionNavigatorProps) {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navigator only after scrolling past the hero
      setIsVisible(window.scrollY > 400);

      // Determine which section is currently in view
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          aria-label="Section navigation"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className="group relative flex items-center justify-center cursor-pointer p-1"
                aria-label={`Go to ${section.label}`}
              >
                {/* Tooltip label (appears on hover to the left) */}
                <span
                  className="absolute right-full mr-3 rounded-full bg-primary px-3 py-1 text-label-md text-primary-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {section.label}
                </span>

                {/* Dot indicator */}
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "w-3 h-3 bg-baseline-lime shadow-[0_0_8px_rgba(223,255,0,0.5)]"
                      : "w-2 h-2 bg-border-subtle group-hover:bg-text-muted"
                  )}
                />
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
