// Minimal probe: does /_next/image work in a real browser context (no routing)?
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
const imageResponses = [];
page.on("response", (res) => {
  if (res.url().includes("/_next/image")) {
    imageResponses.push({ url: res.url(), status: res.status(), type: res.headers()["content-type"] });
  }
});
page.on("requestfailed", (req) => {
  if (req.url().includes("/_next/image")) {
    imageResponses.push({ url: req.url(), failed: req.failure()?.errorText });
  }
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const imgs = await page.$$eval("img", (els) =>
  els.map((img) => ({ src: (img.currentSrc || img.src).slice(0, 90), complete: img.complete, nw: img.naturalWidth }))
);
console.log(JSON.stringify({ imageResponses, imgs }, null, 2));
await browser.close();
