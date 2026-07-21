/**
 * Scraper configuration and URL construction.
 *
 * Centralizes the ScraperAPI key validation and URL building so that:
 * - The key is validated lazily (at call time, not import time).
 * - HTTPS is always used (prevents credential leak in transit).
 * - The key never appears in template literals (reduces log-leak surface).
 */

function getScraperApiKey(): string {
  const key = process.env.SCRAPER_API_KEY;
  if (!key) {
    throw new Error(
      "SCRAPER_API_KEY is not configured. " +
        "Set it in .env.local — see .env.example for details.",
    );
  }
  return key;
}

export function buildScraperUrl(targetUrl: string): string {
  const key = getScraperApiKey();
  const params = new URLSearchParams({
    api_key: key,
    url: targetUrl,
    render: "false",
  });
  return `https://api.scraperapi.com/?${params}`;
}
