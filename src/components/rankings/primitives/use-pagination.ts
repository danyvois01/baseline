"use client";

/**
 * usePagination — Shared progressive-disclosure pagination logic.
 *
 * Manages visible count state with the incremental reveal pattern:
 * 20 → 50 → 100 → all. Returns the current slice parameters and a
 * "show more" handler.
 */

import { useState } from "react";

export interface PaginationResult {
  visibleCount: number;
  hasMore: boolean;
  buttonLabel: string;
  showMore: () => void;
}

export function usePagination(
  totalCount: number,
  initialCount = 20,
  showAllLabel = "Show All Players",
): PaginationResult {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const hasMore = visibleCount < totalCount;

  const getNextLimit = () => {
    if (visibleCount <= 20) return 50;
    if (visibleCount <= 50) return 100;
    return visibleCount + 100;
  };

  const nextLimit = Math.min(getNextLimit(), totalCount);

  const buttonLabel =
    nextLimit >= totalCount ? showAllLabel : `Show Top ${nextLimit}`;

  const showMore = () => setVisibleCount(nextLimit);

  return { visibleCount, hasMore, buttonLabel, showMore };
}
