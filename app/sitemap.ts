import type { MetadataRoute } from "next";

// Real content dates (audit L-6): `new Date()` re-stamped every URL on every
// deploy, which makes lastmod meaningless to crawlers. Update the matching
// entry when a page's content meaningfully changes (the legal dates follow
// the version headers inside the documents).
const LASTMOD = {
  home: new Date("2026-07-02"),
  terms: new Date("2026-05-30"), // T&C v1.1
  privacy: new Date("2026-07-02"), // Privacy Policy v1.3
  prohibited: new Date("2026-05-30"), // annex to the T&C
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://italparcel.com";
  return [
    { url: `${base}/`, lastModified: LASTMOD.home, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/terms`, lastModified: LASTMOD.terms, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: LASTMOD.privacy, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/prohibited-items`, lastModified: LASTMOD.prohibited, changeFrequency: "yearly", priority: 0.4 },
  ];
}
