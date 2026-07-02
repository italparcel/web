// CONS-04 verification: the consent default must be pushed FIRST, deny all
// four signals, and carry NO region scoping (global default). Externals are
// blocked entirely — the inline snippet alone is under test.
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const first = await page.evaluate(() => {
  const e = (window.dataLayer || [])[0];
  return e ? [e[0], e[1], JSON.parse(JSON.stringify(e[2] ?? null))] : null;
});
const cookies = await ctx.cookies();
await browser.close();

const [cmd, action, payload] = first ?? [];
const ok =
  cmd === "consent" &&
  action === "default" &&
  payload &&
  payload.ad_storage === "denied" &&
  payload.ad_user_data === "denied" &&
  payload.ad_personalization === "denied" &&
  payload.analytics_storage === "denied" &&
  !("region" in payload) &&
  cookies.length === 0;

console.log(JSON.stringify({ first, cookies: cookies.length, ok }, null, 2));
process.exit(ok ? 0 : 1);
