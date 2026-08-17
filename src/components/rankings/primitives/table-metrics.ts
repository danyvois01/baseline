/**
 * Shared desktop metrics for the ranking tables.
 *
 * Row and header heights are pinned rather than content-driven so that
 * switching between Live, Official and Race keeps every row on the same
 * baseline. Left implicit, each view resolves to a slightly different height
 * because its tallest cell differs: Live is driven by the player cell, while
 * Official is driven by the stacked "Next Week" figure. Any future column
 * whose content is taller than ROW_MIN_H would reintroduce the drift, so keep
 * new cells within this height (or raise it for all three tables at once).
 */

/** Desktop data row height. */
export const ROW_MIN_H = "min-h-[76px]";

/** Desktop header row height. */
export const HEADER_MIN_H = "min-h-[52px]";
