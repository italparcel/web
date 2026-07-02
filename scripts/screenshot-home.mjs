// Homepage screenshots (desktop + mobile) for visual before/after comparison.
// Usage: node scripts/screenshot-home.mjs <label>   → docs/audit-screenshots/home-<label>-{desktop,mobile}.png
// Note: the shipment card rotates its destination and the marquee scrolls, so
// those regions naturally differ between runs; layout and styling must not.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const label = process.argv[2] ?? "shot";
mkdirSync("docs/audit-screenshots", { recursive: true });

const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem("italparcel-consent-ads", "denied"); } catch {}
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500); // let entrance animations settle
  await page.screenshot({
    path: `docs/audit-screenshots/home-${label}-${name}.png`,
    fullPage: false,
  });
  await ctx.close();
}
await browser.close();
console.log(`saved docs/audit-screenshots/home-${label}-{desktop,mobile}.png`);
