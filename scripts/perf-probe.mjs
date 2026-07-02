// Phase 5 perf probe: real transfer sizes + Web Vitals approximations on next start.
// External requests blocked so numbers reflect first-party payload only.
import { chromium } from "@playwright/test";

const PAGES = ["/", "/terms", "/privacy"];
const out = {};
const browser = await chromium.launch();

for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem("italparcel-consent-ads", "denied"); } catch {}
    // CLS observer
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    // LCP observer
    window.__lcp = 0;
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1);
      if (last) window.__lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const res = performance.getEntriesByType("resource");
    const byType = {};
    for (const r of res) {
      const ext = r.name.includes(".css") ? "css"
        : r.name.includes("/_next/image") || /\.(png|jpg|webp|avif|svg)/.test(r.name) ? "img"
        : r.name.includes(".woff") ? "font"
        : r.name.includes(".js") ? "js" : "other";
      byType[ext] = byType[ext] || { count: 0, transferKB: 0 };
      byType[ext].count++;
      byType[ext].transferKB += Math.round((r.transferSize || 0) / 1024);
    }
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null;
    return {
      htmlKB: Math.round((nav?.transferSize || 0) / 1024),
      byType,
      totalTransferKB:
        Math.round((nav?.transferSize || 0) / 1024) +
        Object.values(byType).reduce((a, t) => a + t.transferKB, 0),
      fcpMs: fcp && Math.round(fcp),
      lcpMs: Math.round(window.__lcp),
      cls: Math.round(window.__cls * 1000) / 1000,
      domInteractiveMs: Math.round(nav?.domInteractive || 0),
    };
  });
  out[path] = metrics;
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
