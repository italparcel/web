// Shared Google Consent Mode v2 constants.
//
// EEA (EU-27 + Iceland, Liechtenstein, Norway) plus the United Kingdom and
// Switzerland: the regions where advertising/analytics consent is denied by
// default until the user opts in. Outside these regions we set no default, so
// Consent Mode treats consent as granted — our non-EU audience keeps being
// measured without a gate. ISO 3166-1 alpha-2 codes.
export const CONSENT_DENIED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
] as const;

// localStorage key holding the user's advertising-cookie choice:
// "granted" | "denied". Absent = no choice yet (show the banner).
export const CONSENT_STORAGE_KEY = "italparcel-consent-ads";
