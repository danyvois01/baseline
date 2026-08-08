/**
 * site — canonical site identity used for SEO (sitemap, robots, metadata).
 *
 * The production URL is not hardcoded: set NEXT_PUBLIC_SITE_URL in the
 * environment (e.g. in Vercel project settings) when the real domain is
 * available. The fallback keeps local/preview builds working.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://baseline-tennis.vercel.app";

export const SITE_NAME = "Baseline";
