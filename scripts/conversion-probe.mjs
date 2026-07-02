// Phase 3 conversion probe: real submit with mocked /api/contact + blocked Photon.
// Google requests are CAPTURED THEN ABORTED (except gtag.js itself), so the
// fully-formed URLs can be inspected without any ping ever reaching Google —
// safe to re-run without polluting Ads data.
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const GOOGLE_RE = /google|doubleclick|gstatic/i;
const out = {};

const browser = await chromium.launch();

async function fillForm(page) {
  await page.locator("#name").fill("Test Reviewer");
  await page.locator("#email").fill("qa-probe@example.com");
  await page.locator("#phone").fill("+390000000000");
  await page.locator("#country").fill("United States");
  await page.keyboard.press("Escape");
  await page.locator("#address").fill("123 Test Street, Springfield");
  await page.keyboard.press("Escape");
  await page.locator("#itemDescription").fill("One moka pot (QA probe)");
  await page.locator("#acceptTerms").check({ force: true });
  await page.locator("#acceptClauses").check({ force: true });
  await page.locator("#name").click(); // trigger blur validation elsewhere
  await page.waitForTimeout(600);
}

for (const consent of ["granted", "denied"]) {
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  await ctx.addInitScript((v) => {
    try { localStorage.setItem("italparcel-consent-ads", v); } catch {}
  }, consent);
  const page = await ctx.newPage();
  const reqs = [];
  await ctx.route(
    (url) => GOOGLE_RE.test(url.hostname) && !url.pathname.startsWith("/gtag/js"),
    (route) => {
      reqs.push(route.request().url());
      route.abort();
    }
  );
  let apiPayload = null;
  let apiCalls = 0;
  await page.route("**/api/contact", async (route) => {
    apiCalls++;
    apiPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.route("**photon.komoot.io**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ features: [] }) })
  );
  await page.goto(BASE + "/#contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await fillForm(page);
  const btn = page.getByRole("button", { name: /Send request/ });
  const disabled = await btn.isDisabled();
  const preCount = reqs.length;
  if (!disabled) await btn.click();
  await page.waitForTimeout(4000);
  const postSubmit = reqs.slice(preCount);
  const convLabel = postSubmit.filter((u) => u.includes("CtkVCL"));
  const emParams = postSubmit
    .filter((u) => /[?&]em=/.test(u))
    .map((u) => ({ host: new URL(u).hostname, path: new URL(u).pathname, em: u.match(/[?&]em=([^&]+)/)[1].slice(0, 60) }));
  const leakedPII = postSubmit.filter(
    (u) => decodeURIComponent(u).includes("qa-probe@example.com") || u.includes("390000000000")
  );
  const successVisible = await page.getByText("Got it.").isVisible().catch(() => false);
  const gcs = postSubmit
    .filter((u) => /gcs=/.test(u))
    .map((u) => ({ host: new URL(u).hostname, path: new URL(u).pathname, gcs: u.match(/[?&]gcs=([^&]+)/)[1] }));

  // double-fire check: click "Send another" then verify no extra conversion without a second submit
  let convAfterReset = 0;
  if (successVisible) {
    const baseline = reqs.length;
    await page.getByRole("button", { name: "Send another" }).click();
    await page.waitForTimeout(1500);
    convAfterReset = reqs.slice(baseline).filter((u) => u.includes("CtkVCL")).length;
  }

  out[consent] = {
    submitBlocked: disabled,
    apiCalls,
    honeypotFieldSent: apiPayload ? String(apiPayload.company) : null,
    turnstileTokenSent: apiPayload ? typeof apiPayload.turnstileToken : null,
    successVisible,
    conversionLabelRequests: convLabel.map((u) => ({ host: new URL(u).hostname, path: new URL(u).pathname })),
    conversionLabelCount: convLabel.length,
    emParams,
    rawPIIinURLs: leakedPII,
    gcs,
    hostsSeen: [...new Set(postSubmit.map((u) => new URL(u).hostname))],
    convAfterReset,
  };
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
