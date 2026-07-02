import type { NextConfig } from "next";
import path from "node:path";

// Security headers MUST live here, not in netlify.toml: the Netlify Next.js
// runtime applies netlify.toml [[headers]] only to static CDN assets, never to
// HTML or API responses (verified against production on 2026-07-02).

// Google Ads / gtag origins. Conversion "1p-user-list" pings go to the
// visitor's country Google domain; CSP cannot wildcard TLDs, so the plausible
// ones are listed explicitly (EEA/UK/CH — reachable only after consent — plus
// the main non-EU customer markets; google.com covers the US). While the CSP
// ships as Report-Only, any missed domain shows up as a console report and can
// be appended before the policy is flipped to enforcing.
const GOOGLE_COUNTRY_ORIGINS = [
  // EEA + UK + CH
  "https://*.google.it",
  "https://*.google.co.uk",
  "https://*.google.ch",
  "https://*.google.at",
  "https://*.google.be",
  "https://*.google.bg",
  "https://*.google.hr",
  "https://*.google.com.cy",
  "https://*.google.cz",
  "https://*.google.de",
  "https://*.google.dk",
  "https://*.google.ee",
  "https://*.google.es",
  "https://*.google.fi",
  "https://*.google.fr",
  "https://*.google.gr",
  "https://*.google.hu",
  "https://*.google.ie",
  "https://*.google.is",
  "https://*.google.li",
  "https://*.google.lt",
  "https://*.google.lu",
  "https://*.google.lv",
  "https://*.google.com.mt",
  "https://*.google.nl",
  "https://*.google.no",
  "https://*.google.pl",
  "https://*.google.pt",
  "https://*.google.ro",
  "https://*.google.se",
  "https://*.google.si",
  "https://*.google.sk",
  // Main non-EU markets
  "https://*.google.ca",
  "https://*.google.com.au",
  "https://*.google.co.nz",
  "https://*.google.co.jp",
  "https://*.google.co.kr",
  "https://*.google.com.br",
  "https://*.google.com.mx",
  "https://*.google.com.ar",
  "https://*.google.cl",
  "https://*.google.ae",
  "https://*.google.com.sg",
  "https://*.google.com.hk",
  "https://*.google.com.tw",
  "https://*.google.co.th",
  "https://*.google.co.in",
  "https://*.google.co.za",
  "https://*.google.com.tr",
].join(" ");

const GOOGLE_ADS_ORIGINS = `https://*.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://*.googlesyndication.com ${GOOGLE_COUNTRY_ORIGINS}`;

// 'unsafe-inline' in script-src is a deliberate trade-off: Next.js hydration
// scripts, the inline gtag/consent bootstrap and the JSON-LD blocks are all
// inline, and a nonce-based CSP would force dynamic rendering of pages that
// are intentionally static. Do not "fix" this with nonces.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://*.googlesyndication.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://www.googletagmanager.com ${GOOGLE_ADS_ORIGINS}`,
  "font-src 'self'",
  `connect-src 'self' https://photon.komoot.io https://challenges.cloudflare.com https://www.googletagmanager.com ${GOOGLE_ADS_ORIGINS}`,
  "frame-src https://challenges.cloudflare.com https://td.doubleclick.net https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Report-Only until the owner validates a deploy preview (browser console
  // shows "[Report Only]" violations); flipping to enforcing is a one-line
  // rename of this key to Content-Security-Policy.
  { key: "Content-Security-Policy-Report-Only", value: CSP },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
