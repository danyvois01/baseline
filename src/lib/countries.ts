/**
 * Country code mapping utilities.
 *
 * The ranking source provides nationalities as ISO 3166-1 alpha-3 codes
 * (e.g. "ITA"), while the `flag-icons` library expects alpha-2 codes
 * (e.g. "it"). This module centralizes that mapping so it stays consistent
 * across every rankings route.
 */

/** Fallback alpha-2 code used when a nationality has no known mapping. */
export const UNKNOWN_COUNTRY_CODE = "un";

/** Maps ISO 3166-1 alpha-3 nationality codes to alpha-2 flag-icon codes. */
export const COUNTRY_CODE_MAP: Record<string, string> = {
  "ITA": "it", "ESP": "es", "SRB": "rs", "GER": "de", "RUS": "ru",
  "USA": "us", "AUS": "au", "CAN": "ca", "NOR": "no", "BUL": "bg",
  "GRE": "gr", "POL": "pl", "FRA": "fr", "ARG": "ar", "GBR": "gb",
  "CHI": "cl", "KAZ": "kz", "CZE": "cz", "NED": "nl", "DEN": "dk",
  "SUI": "ch", "AUT": "at", "CRO": "hr", "BRA": "br", "JPN": "jp",
  "CHN": "cn", "POR": "pt", "SVK": "sk", "HUN": "hu", "SWE": "se",
  "FIN": "fi", "ROU": "ro", "BEL": "be", "RSA": "za", "KOR": "kr",
  "COL": "co", "ECU": "ec", "PER": "pe", "URU": "uy", "PAR": "py",
  "MEX": "mx", "DOM": "do", "NZL": "nz", "IND": "in", "EGY": "eg",
  "TUN": "tn", "ALG": "dz", "MAR": "ma", "TUR": "tr", "CYP": "cy",
  "GEO": "ge", "ARM": "am", "AZE": "az", "UKR": "ua", "BLR": "by",
  "MDA": "md", "LTU": "lt", "LAT": "lv", "EST": "ee", "IRL": "ie",
  "LUX": "lu", "MON": "mc", "TPE": "tw", "BIH": "ba", "ISR": "il",
};

/**
 * Resolves an alpha-3 nationality code to its alpha-2 flag-icon code,
 * falling back to {@link UNKNOWN_COUNTRY_CODE} when unmapped.
 */
export function toCountryCode(nationality: string): string {
  return COUNTRY_CODE_MAP[nationality] || UNKNOWN_COUNTRY_CODE;
}
