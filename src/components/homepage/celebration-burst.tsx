"use client";

import { motion } from "framer-motion";

/**
 * One-shot celebration burst: 8 lime shards radiate out from the center of
 * the parent (which must be `position: relative`) and fade over ~600ms.
 * Used for the Pyramid crown landing and Scoring game wins.
 *
 * Mount it conditionally (e.g. inside <AnimatePresence>) so it replays each
 * time the celebrated state is re-entered. Callers should skip rendering it
 * when `prefers-reduced-motion` is set.
 */
const SHARD_COUNT = 8;

function buildShards(radius: number) {
  return Array.from({ length: SHARD_COUNT }, (_, i) => {
    const angle = (i / SHARD_COUNT) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

export function CelebrationBurst({ radius = 56 }: { radius?: number }) {
  const shards = buildShards(radius);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {shards.map((shard, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-baseline-lime"
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: shard.x, y: shard.y, scale: 0.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
