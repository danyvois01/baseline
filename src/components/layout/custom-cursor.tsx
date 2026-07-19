"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a clickable element
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", updateHoverState);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", updateHoverState);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-baseline-lime rounded-full pointer-events-none z-[9999] shadow-md flex items-center justify-center overflow-hidden"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 500, damping: 28 },
          default: { type: "tween", duration: 0 },
        }}
      >
        {/* Tennis ball curve lines */}
        <div className="absolute inset-0 opacity-40 mix-blend-darken">
            <svg viewBox="0 0 100 100" className="w-full h-full text-deep-navy">
                <path d="M 50 0 A 50 50 0 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M 100 50 A 50 50 0 0 0 50 100" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
        </div>
      </motion.div>
    </>
  );
}
