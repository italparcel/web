// Phase 3 consent & tracking probe — runs against http://localhost:3000 (next start).
// Read-only with respect to the app; outbound form submissions are mocked.
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const GOOGLE_RE = /google|doubleclick|gstatic/i;
const out = { scenarios: {} };

function trackGoogle(page, bucket) {
  page.on("request", (req) => {
    const url = req.url();
    if (GOOGLE_RE.test(new URL(url).hostname)) bucket.push(url);
  });
}

async function getState(page) {
  return page.evaluate(() => {
    const dl = (window.dataLayer || []).map((entry) => {
      try {
        return Array.from(entry).map((x) =>
          x instanceof Date ? "DATE" : typeof x === "object" ? JSON.parse(JSON.stringify(x)) : x
        );
      } catch {
        return ["<unserializable>"];
      }
    });
    let stored = null;
    try { stored = localStorage.getItem("italparcel-consent-ads"); } catch {}
    return { dataLayer: dl, cookie: document.cookie, stored };
  });
}

function gcsOf(urls) {
  return urls
    .filter((u) => /gcs=/.test(u))
    .map((u) => {
      const m = u.match(/[?&]gcs=([^&]+)/);
      return { host: new URL(u).hostname, path: new URL(u).pathname, gcs: m && m[1] };
    });
}

const browser = await chromium.launch();

// ───────────────────────── Scenario A: first visit, no interaction ─────────────────────────
{
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  const page = await ctx.newPage();
  const reqs = [];
  const consoleErrors = [];
  trackGoogle(page, reqs);
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const state = await getState(page);
  const cookies = await ctx.cookies();
  const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
  const bannerVisible = await banner.isVisible().catch(() => false);
  let buttons = null;
  if (bannerVisible) {
    buttons = await banner.locator("button").evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height), fontSize: cs.fontSize, bg: cs.backgroundColor, color: cs.color, border: cs.borderColor };
      })
    );
  }
  out.scenarios.A_preConsent = {
    bannerVisible, buttons, consoleErrors,
    dataLayer: state.dataLayer, documentCookie: state.cookie, stored: state.stored,
    contextCookies: cookies.map((c) => ({ name: c.name, domain: c.domain })),
    googleRequests: reqs, gcs: gcsOf(reqs),
  };
  await ctx.close();
}

// ───────────────────────── Scenario B: accept flow + persistence ─────────────────────────
{
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  const page = await ctx.newPage();
  const reqs = [];
  trackGoogle(page, reqs);
  await page.goto(BASE, { waitUntil: "networkidle" });
  const preClickCount = reqs.length;
  await page.getByRole("button", { name: "Accept" }).click();
  await page.waitForTimeout(2500);
  const state = await getState(page);
  const cookies = await ctx.cookies();
  const postAccept = reqs.slice(preClickCount);
  // reload → banner must stay closed, consent re-applied
  const reloadReqs = [];
  trackGoogle(page, reloadReqs);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const stateAfterReload = await getState(page);
  const bannerAfterReload = await page
    .locator('[role="dialog"][aria-label="Cookie consent"]')
    .isVisible()
    .catch(() => false);
  out.scenarios.B_accept = {
    stored: state.stored, documentCookie: state.cookie,
    contextCookies: cookies.map((c) => ({ name: c.name, domain: c.domain })),
    dataLayerTail: state.dataLayer.slice(-4),
    googleAfterAccept: postAccept, gcsAfterAccept: gcsOf(postAccept),
    reload: {
      bannerVisible: bannerAfterReload,
      stored: stateAfterReload.stored,
      dataLayerHead: stateAfterReload.dataLayer.slice(0, 4),
      gcs: gcsOf(reloadReqs),
      cookiesAfterReload: (await ctx.cookies()).map((c) => c.name),
    },
  };
  await ctx.close();
}

// ───────────────────────── Scenario C: reject flow + reopen ─────────────────────────
{
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  const page = await ctx.newPage();
  const reqs = [];
  trackGoogle(page, reqs);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Decline" }).click();
  await page.waitForTimeout(2000);
  const state = await getState(page);
  const cookies = await ctx.cookies();
  await page.reload({ waitUntil: "networkidle" });
  const bannerAfterReload = await page
    .locator('[role="dialog"][aria-label="Cookie consent"]')
    .isVisible()
    .catch(() => false);
  // reopen via footer "Manage cookies"
  await page.locator("footer").getByRole("button", { name: "Manage cookies" }).click();
  const reopened = await page
    .locator('[role="dialog"][aria-label="Cookie consent"]')
    .isVisible()
    .catch(() => false);
  out.scenarios.C_reject = {
    stored: state.stored, documentCookie: state.cookie,
    contextCookies: cookies.map((c) => ({ name: c.name, domain: c.domain })),
    dataLayerTail: state.dataLayer.slice(-3),
    bannerAfterReload, reopenWorks: reopened,
    gcs: gcsOf(reqs),
  };
  await ctx.close();
}

// ───────────────── Scenario D: conversion — consent GRANTED, mocked backend ─────────────────
async function fillAndSubmitForm(page) {
  await page.locator("#name").fill("Test Reviewer");
  await page.locator("#email").fill("qa-probe@example.com");
  await page.locator("#phone").fill("+390000000000");
  await page.locator("#country").fill("United States");
  await page.locator("#address").fill("123 Test Street, Springfield");
  // close any open suggestion dropdown
  await page.keyboard.press("Escape");
  await page.locator("#itemDescription").fill("One moka pot (QA probe)");
  await page.locator('label[for="acceptTerms"]').click();
  await page.locator('label[for="acceptClauses"]').click();
  await page.locator("#itemDescription").click(); // blur checkboxes, trigger validation
  await page.waitForTimeout(400);
  const btn = page.getByRole("button", { name: /Send request/ });
  const disabled = await btn.isDisabled();
  if (!disabled) await btn.click();
  return disabled;
}

for (const consent of ["granted", "denied"]) {
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  await ctx.addInitScript((v) => {
    try { localStorage.setItem("italparcel-consent-ads", v); } catch {}
  }, consent);
  const page = await ctx.newPage();
  const reqs = [];
  trackGoogle(page, reqs);
  let apiPayload = null;
  await page.route("**/api/contact", async (route) => {
    apiPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto(BASE + "/#contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const preCount = reqs.length;
  const stillDisabled = await fillAndSubmitForm(page);
  await page.waitForTimeout(3500);
  const state = await getState(page);
  const postSubmit = reqs.slice(preCount);
  const conversionReqs = postSubmit.filter((u) => /conversion|CtkVCL/i.test(u));
  const leakedPII = postSubmit.filter(
    (u) => u.includes("qa-probe%40example.com") || u.includes("qa-probe@example.com") || u.includes("390000000000")
  );
  const successVisible = await page.getByText("Got it.").isVisible().catch(() => false);
  out.scenarios[`D_conversion_${consent}`] = {
    submitBlocked: stillDisabled,
    successVisible,
    apiPayloadKeys: apiPayload ? Object.keys(apiPayload) : null,
    honeypotSent: apiPayload ? apiPayload.company : undefined,
    dataLayerTail: state.dataLayer.slice(-6),
    googleAfterSubmit: postSubmit,
    conversionRequests: conversionReqs,
    conversionCount: conversionReqs.length,
    gcs: gcsOf(postSubmit),
    rawPIIinURLs: leakedPII,
  };
  await ctx.close();
}

// ─────────────── Scenario F: all Google hostnames seen vs CSP allowlist ───────────────
const cspAllow = new Set([
  "www.googletagmanager.com", "www.google.com", "googleads.g.doubleclick.net",
  "www.googleadservices.com", "td.doubleclick.net",
]);
const allHosts = new Set();
for (const s of Object.values(out.scenarios)) {
  for (const u of [...(s.googleRequests || []), ...(s.googleAfterAccept || []), ...(s.googleAfterSubmit || [])]) {
    allHosts.add(new URL(u).hostname);
  }
}
out.googleHostsSeen = [...allHosts];
out.hostsNotInCSP = [...allHosts].filter((h) => !cspAllow.has(h));

await browser.close();
console.log(JSON.stringify(out, null, 2));
