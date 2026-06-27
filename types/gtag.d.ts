// Global typings for the Google Ads gtag.js snippet loaded in app/layout.tsx.
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
