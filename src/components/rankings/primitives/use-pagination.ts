"use client";

/**
 * usePagination — Shared progressive-disclosure pagination logic.
 *
 * Manages visible count state with the incremental reveal pattern:
 * 20 → 50 → 100 → all. Returns the current slice parameters and a
 * "show more" handler. Labels come from the active locale dictionary;
 * `showAllLabel` overrides the default show-all text (used by the race).
 */

import { useState } from "react";
import { useTranslation } from "@/providers/locale-provider";

export interface PaginationResult {
  visibleCount: number;
  hasMore: boolean;
  buttonLabel: string;
  showMore: () => void;
}

export function usePagination(
  totalCount: number,
  initialCount = 20,
  showAllLabel?: string,
): PaginationResult {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const hasMore = visibleCount < totalCount;

  const getNextLimit = () => {
    if (visibleCount <= 20) return 50;
    if (visibleCount <= 50) return 100;
    return visibleCount + 100;
  };

  const nextLimit = Math.min(getNextLimit(), totalCount);

  const buttonLabel =
    nextLimit >= totalCount
      ? (showAllLabel ?? t.rankings.pagination.showAll)
      : t.rankings.pagination.showTop(nextLimit);

  const showMore = () => setVisibleCount(nextLimit);

  return { visibleCount, hasMore, buttonLabel, showMore };
}
