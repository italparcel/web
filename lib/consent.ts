// Shared Google Consent Mode v2 constants.
//
// The consent default is DENIED GLOBALLY (no region scoping): every visitor,
// EEA or not, is measured only after accepting the banner. This keeps the
// banner text ("only with your consent") and privacy policy §8 literally true
// for everyone, at the cost of pre-consent modeling data outside the EEA — an
// explicit product decision (see REVIEW_REPORT.md, CONS-04).

// localStorage key holding the user's advertising-cookie choice:
// "granted" | "denied". Absent = no choice yet (show the banner).
export const CONSENT_STORAGE_KEY = "italparcel-consent-ads";
