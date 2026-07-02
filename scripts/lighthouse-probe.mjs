// Lighthouse via Playwright-launched Chromium (chrome-launcher can't spawn here).
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";

const PORT = 9222;
const browser = await chromium.launch({
  args: [`--remote-debugging-port=${PORT}`],
});

const pages = process.argv.slice(2);
const results = {};
for (const path of pages) {
  const runnerResult = await lighthouse(`http://localhost:3000${path}`, {
    port: PORT,
    output: "json",
    logLevel: "error",
  });
  const lhr = runnerResult.lhr;
  const audits = lhr.audits;
  results[path] = {
    scores: Object.fromEntries(
      Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
    ),
    metrics: {
      FCP: audits["first-contentful-paint"]?.displayValue,
      LCP: audits["largest-contentful-paint"]?.displayValue,
      TBT: audits["total-blocking-time"]?.displayValue,
      CLS: audits["cumulative-layout-shift"]?.displayValue,
      SI: audits["speed-index"]?.displayValue,
    },
    lcpElement:
      audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node
        ?.snippet ?? null,
    lcpBreakdown:
      audits["largest-contentful-paint-element"]?.details?.items?.[1]?.items?.map(
        (i) => `${i.phase}: ${Math.round(i.timing)}ms`
      ) ?? null,
    topOpportunities: Object.values(audits)
      .filter((a) => a.details?.type === "opportunity" && (a.details.overallSavingsMs ?? 0) > 100)
      .sort((a, b) => (b.details.overallSavingsMs ?? 0) - (a.details.overallSavingsMs ?? 0))
      .slice(0, 5)
      .map((a) => `${a.title}: ~${Math.round(a.details.overallSavingsMs)}ms`),
    failedAudits: Object.values(audits)
      .filter((a) => a.score !== null && a.score < 0.9 && !a.scoreDisplayMode.includes("informative"))
      .slice(0, 12)
      .map((a) => `${a.id} (${Math.round((a.score ?? 0) * 100)})`),
  };
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
