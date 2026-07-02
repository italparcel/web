// Which element is the LCP, and when do its paint candidates occur?
// Emulates Lighthouse mobile conditions via CDP (Moto G class: 4x CPU, slow 4G).
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 1.75,
  isMobile: true,
  hasTouch: true,
});
await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
await ctx.addInitScript(() => {
  try { localStorage.setItem("italparcel-consent-ads", "denied"); } catch {}
  window.__lcpCandidates = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__lcpCandidates.push({
        t: Math.round(e.startTime),
        size: e.size,
        tag: e.element?.tagName,
        cls: (e.element?.className || "").toString().slice(0, 60),
        text: (e.element?.textContent || "").slice(0, 60),
      });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  window.__fontLoads = [];
  if (document.fonts) {
    document.fonts.addEventListener("loadingdone", () => {
      window.__fontLoads.push(Math.round(performance.now()));
    });
  }
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const result = await page.evaluate(() => ({
  candidates: window.__lcpCandidates,
  fontLoadsAt: window.__fontLoads,
  fcp: Math.round(
    performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1
  ),
}));
console.log(JSON.stringify(result, null, 2));
await browser.close();
