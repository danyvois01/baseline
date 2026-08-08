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
  "INA": "id", "IRI": "ir", "JAM": "jm", "JOR": "jo", "PHI": "ph",
  "THA": "th", "VIE": "vn", "MAS": "my", "SGP": "sg", "HKG": "hk",
  "PAK": "pk", "SRI": "lk", "BAN": "bd", "UZB": "uz", "KGZ": "kg",
  "QAT": "qa", "KSA": "sa", "UAE": "ae", "KUW": "kw", "BRN": "bh",
  "LIB": "lb", "SYR": "sy", "IRQ": "iq", "NGR": "ng", "KEN": "ke",
  "ZIM": "zw", "GHA": "gh", "CIV": "ci", "SEN": "sn", "CMR": "cm",
  "BAR": "bb", "BAH": "bs", "TTO": "tt", "PUR": "pr", "CRC": "cr",
  "ESA": "sv", "GUA": "gt", "HON": "hn", "PAN": "pa", "VEN": "ve",
  "BOL": "bo", "ISL": "is", "MLT": "mt", "SLO": "si", "MKD": "mk",
  "MNE": "me", "ALB": "al", "KOS": "xk", "AND": "ad", "LIE": "li",
  "SMR": "sm", "NMK": "mk", "GRN": "gd", "HAI": "ht", "MRI": "mu",
  "MAD": "mg", "ANG": "ao", "BOT": "bw", "NAM": "na", "UGA": "ug",
  "TAN": "tz", "ETH": "et", "SUD": "sd", "LBA": "ly", "OMA": "om",
  "YEM": "ye", "AFG": "af", "NEP": "np", "MYA": "mm", "CAM": "kh",
  "LAO": "la", "MGL": "mn", "PRK": "kp", "FIJ": "fj", "PNG": "pg",
  "SAM": "ws", "TGA": "to", "VAN": "vu", "GUM": "gu", "BER": "bm",
  "CAY": "ky", "IVB": "vg", "ISV": "vi", "ANT": "ag", "LCA": "lc",
  "SKN": "kn", "VIN": "vc", "DMA": "dm", "BIZ": "bz", "GUY": "gy",
  "SUR": "sr", "ARU": "aw", "CUB": "cu", "TWN": "tw", "NMI": "mp",
  "LBN": "lb",
};

/**
 * Resolves an alpha-3 nationality code to its alpha-2 flag-icon code,
 * falling back to {@link UNKNOWN_COUNTRY_CODE} when unmapped.
 */
export function toCountryCode(nationality: string): string {
  return COUNTRY_CODE_MAP[nationality] || UNKNOWN_COUNTRY_CODE;
}
