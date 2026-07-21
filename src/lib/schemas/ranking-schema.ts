/**
 * Zod schemas for validating scraped ranking data.
 *
 * These schemas act as runtime contracts between the scraper layer and the
 * rest of the application. If the external HTML source changes layout and
 * the parsed data no longer matches these shapes, validation will fail with
 * a structured error identifying exactly which fields are wrong — rather
 * than silently passing corrupt data to the UI.
 */

import { z } from "zod";

/**
 * Schema for a scraped player object.
 * Validates the minimal player fields extracted from HTML.
 */
export const ScrapedPlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nationality: z.string().min(2).max(4),
  age: z.number().min(0).max(60),
});

export type ScrapedPlayerValidated = z.infer<typeof ScrapedPlayerSchema>;

/**
 * Schema for a single ranking entry.
 * All optional fields use `.optional()` to match the domain model.
 */
export const RankingEntrySchema = z.object({
  rank: z.number().int().min(1),
  previousRank: z.number().int().min(1).optional(),
  rankChange: z.number().int().optional(),
  rankChangeDirection: z.enum(["up", "down", "none", "new"]),
  player: ScrapedPlayerSchema,
  points: z.number().int().min(0),
  tournamentsPlayed: z.number().int().min(0).optional(),
  nextWeekPoints: z.number().int().min(0).optional(),
  liveStatus: z
    .object({
      isActive: z.boolean(),
      tournament: z.string(),
      stage: z.string(),
    })
    .optional(),
  nextMatchPoints: z.number().int().min(0).optional(),
  maxPoints: z.number().int().min(0).optional(),
  pointsDiff: z.number().int().optional(),
  bestRanking: z.number().int().min(1).optional(),
  isQualified: z.boolean().optional(),
});

export type RankingEntryValidated = z.infer<typeof RankingEntrySchema>;

/**
 * Schema for the Race summary metadata.
 */
export const RaceSummarySchema = z.object({
  qualifiedCount: z.number().int().min(0),
  totalSlots: z.number().int().min(1),
  qualifiedNames: z.array(z.string()),
  remainingTournaments: z.number().int().min(0),
  nextTournament: z.string(),
  cutoffPoints: z.string(),
});

/**
 * Schema for a complete RankingData response from the scraper.
 */
export const RankingDataSchema = z.object({
  type: z.enum(["singles", "live-singles", "race-to-turin"]),
  lastUpdated: z.string().min(1),
  entries: z.array(RankingEntrySchema).min(1),
  summary: RaceSummarySchema.optional(),
});

export type RankingDataValidated = z.infer<typeof RankingDataSchema>;

/**
 * Validates scraped ranking data against the schema.
 * Throws a structured error with details about which fields failed.
 *
 * @param data - Raw data from the scraper to validate.
 * @param context - Human-readable label for error messages (e.g. "live-singles").
 * @returns The validated data (same reference if valid).
 */
export function validateRankingData(
  data: unknown,
  context: string,
): RankingDataValidated {
  const result = RankingDataSchema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 5)
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `[schema-validation] Scraped data for "${context}" failed validation.\n` +
        `This likely means the source website changed its HTML structure.\n` +
        `First issues:\n${issues}`,
    );
  }

  return result.data;
}
