/**
 * rankings-cache — In-memory Stale-While-Revalidate (SWR) cache for rankings data.
 *
 * Strategy:
 * - Each cache entry has a TTL (time-to-live). While fresh, cached data is
 *   returned immediately without hitting the scraper.
 * - After TTL expires, the entry becomes "stale". A stale entry is still
 *   returned to callers (instant response) while a background revalidation
 *   is triggered. If revalidation fails, the stale data continues to serve.
 * - A maximum staleness window (MAX_STALE_MS) prevents indefinitely serving
 *   ancient data — after that threshold the fetch is awaited and errors
 *   propagate to the caller.
 *
 * This protects against ScraperAPI outages, rate-limits, and transient
 * network failures by always having recent data available.
 */

import type { RankingData, RankingType } from "@/types/ranking";

interface CacheEntry {
  data: RankingData;
  fetchedAt: number;
}

/** Default TTL: 10 minutes — data is considered fresh. */
const DEFAULT_TTL_MS = 10 * 60 * 1000;

/** Maximum staleness: 2 hours — after this, stale data is no longer served. */
const MAX_STALE_MS = 2 * 60 * 60 * 1000;

const store = new Map<RankingType, CacheEntry>();
const pendingRevalidations = new Map<RankingType, Promise<RankingData>>();

export interface CacheOptions {
  /** Time-to-live in milliseconds. Default: 600_000 (10 minutes) */
  ttlMs?: number;
}

/**
 * Retrieves ranking data using an SWR caching strategy.
 *
 * @param key       - The ranking type used as cache key.
 * @param fetcher   - Async function that retrieves fresh data from the scraper.
 * @param options   - Optional TTL override.
 * @returns         - The ranking data (fresh, stale, or freshly fetched).
 */
export async function getCachedRankings(
  key: RankingType,
  fetcher: () => Promise<RankingData>,
  options: CacheOptions = {},
): Promise<RankingData> {
  const { ttlMs = DEFAULT_TTL_MS } = options;
  const now = Date.now();
  const cached = store.get(key);

  if (cached) {
    const age = now - cached.fetchedAt;

    if (age < ttlMs) {
      return cached.data;
    }

    if (age < MAX_STALE_MS) {
      triggerBackgroundRevalidation(key, fetcher);
      return cached.data;
    }
  }

  return awaitFreshData(key, fetcher);
}

/**
 * Forces an immediate cache invalidation for a given key.
 * Next call to getCachedRankings will fetch fresh data.
 */
export function invalidateCache(key: RankingType): void {
  store.delete(key);
}

/**
 * Clears the entire cache. Useful for testing or deployment resets.
 */
export function clearCache(): void {
  store.clear();
  pendingRevalidations.clear();
}

/**
 * Triggers a non-blocking background fetch. If one is already in progress
 * for this key, it reuses the existing promise (deduplication).
 */
function triggerBackgroundRevalidation(
  key: RankingType,
  fetcher: () => Promise<RankingData>,
): void {
  if (pendingRevalidations.has(key)) return;

  const revalidation = fetcher()
    .then((freshData) => {
      store.set(key, { data: freshData, fetchedAt: Date.now() });
      return freshData;
    })
    .catch((error) => {
      console.warn(
        `[rankings-cache] Background revalidation failed for "${key}":`,
        error instanceof Error ? error.message : error,
      );
      return store.get(key)?.data as RankingData;
    })
    .finally(() => {
      pendingRevalidations.delete(key);
    });

  pendingRevalidations.set(key, revalidation);
}

/**
 * Awaits a fresh fetch, stores it in cache, and returns it.
 * If a revalidation is already in flight, reuses that promise.
 */
async function awaitFreshData(
  key: RankingType,
  fetcher: () => Promise<RankingData>,
): Promise<RankingData> {
  const existing = pendingRevalidations.get(key);
  if (existing) return existing;

  const fetchPromise = fetcher()
    .then((freshData) => {
      store.set(key, { data: freshData, fetchedAt: Date.now() });
      return freshData;
    })
    .finally(() => {
      pendingRevalidations.delete(key);
    });

  pendingRevalidations.set(key, fetchPromise);
  return fetchPromise;
}
