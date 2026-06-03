/**
 * TypeScript interfaces for tennis player data models.
 * These types will be expanded as new features are implemented.
 */

/** Basic player information */
export interface Player {
  /** Unique player identifier */
  id: string;
  /** Player's full name */
  name: string;
  /** Player's nationality (ISO 3166-1 alpha-2 country code) */
  nationality: string;
  /** Player's age */
  age: number;
}

/** Extended player profile with detailed statistics */
export interface PlayerProfile extends Player {
  /** Date of birth (ISO 8601) */
  dateOfBirth: string;
  /** Player's height in cm */
  height?: number;
  /** Player's weight in kg */
  weight?: number;
  /** Playing hand: 'R' (right) or 'L' (left) */
  playingHand?: "R" | "L";
  /** Backhand type: 'one-handed' or 'two-handed' */
  backhand?: "one-handed" | "two-handed";
  /** Year the player turned professional */
  turnedPro?: number;
  /** URL to the player's profile image */
  imageUrl?: string;
}
