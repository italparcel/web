// Post-deploy verification against a Netlify deploy preview, where the
// netlify.toml headers (CSP included) are actually applied.
//
//   node scripts/preview-audit.mjs https://deploy-preview-N--site.netlify.app
//
// Safety: every Google request except gtag.js itself is captured then ABORTED
// (the CSP verdict happens in the browser before our handler, so blocked
// requests still surface as securitypolicyviolation events); /api/contact is
// mocked and Photon is blocked — no email, no conversion, no geocoder call
// ever leaves the machine.
import { chromium } from "@playwright/test";

const BASE = process.argv[2];
if (!BASE || !BASE.startsWith("http")) {
  console.error("usage: node scripts/preview-audit.mjs <preview-base-url>");
  process.exit(2);
}
const GOOGLE_RE = /google|doubleclick|gstatic/i;
const out = { base: BASE, scenarios: {} };
const browser = await chromium.launch();

async function newScenario({ consent } = {}) {
  const ctx = await browser.newContext({ locale: "it-IT", timezoneId: "Europe/Rome" });
  if (consent) {
    await ctx.addInitScript((v) => {
      try { localStorage.setItem("italparcel-consent-ads", v); } catch {}
    }, consent);
  }
  await ctx.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (e) => {
      window.__cspViolations.push(`${e.violatedDirective} :: ${e.blockedURI}`);
    });
  });
  const page = await ctx.newPage();
  const google = [];
  const blocked = [];
  await page.route(
    (url) => GOOGLE_RE.test(url.hostname) && !url.pathname.startsWith("/gtag/js"),
    (route) => {
      google.push(route.request().url());
      route.abort();
    }
  );
  await page.route("**photon.komoot.io**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: '{"features":[]}' })
  );
  await page.route("**/api/contact", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' })
  );
  page.on("requestfailed", (req) => {
    if (req.failure()?.errorText?.includes("BLOCKED_BY_CSP")) {
      blocked.push(req.url());
    }
  });
  return { ctx, page, google, blocked };
}

const state = (page) =>
  page.evaluate(() => ({
    firstDL: (() => {
      const e = (window.dataLayer || [])[0];
      try {
        return e ? [e[0], e[1], JSON.parse(JSON.stringify(e[2] ?? null))] : null;
      } catch {
        return ["<unserializable>"];
      }
    })(),
    cookie: document.cookie,
    csp: window.__cspViolations,
  }));

const hostsOf = (urls) => [...new Set(urls.map((u) => new URL(u).hostname))];
const gcsOf = (urls) =>
  urls.filter((u) => /gcs=/.test(u)).map((u) => ({
    host: new URL(u).hostname,
    gcs: u.match(/[?&]gcs=([^&]+)/)[1],
  }));

async function submitForm(page) {
  await page.locator("#name").fill("Preview Audit");
  await page.locator("#email").fill("qa-preview@example.com");
  await page.locator("#phone").fill("+15551234567");
  await page.locator("#country").fill("United States");
  await page.keyboard.press("Escape");
  await page.locator("#address").fill("123 Preview Street, Springfield");
  await page.keyboard.press("Escape");
  await page.locator("#itemDescription").fill("Preview audit probe");
  await page.locator("#acceptTerms").check({ force: true });
  await page.locator("#acceptClauses").check({ force: true });
  await page.locator("#name").click();
  // On the preview Turnstile is configured: the submit stays disabled until
  // the widget auto-issues a token (managed mode) — poll up to 15s.
  const btn = page.getByRole("button", { name: /Send request/ });
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (!(await btn.isDisabled())) break;
    await page.waitForTimeout(500);
  }
  if (await btn.isDisabled()) return false;
  await btn.click();
  await page.waitForTimeout(4000);
  return page.getByText("Got it.").isVisible().catch(() => false);
}

// A — first load, no interaction (CONS-04 + pre-consent CSP)
{
  const { ctx, page, google, blocked } = await newScenario();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const s = await state(page);
  out.scenarios.A_load = {
    firstDataLayer: s.firstDL,
    documentCookie: s.cookie,
    cookies: (await ctx.cookies()).map((c) => c.name),
    cspViolations: s.csp,
    cspBlockedRequests: blocked,
    googleHostsAttempted: hostsOf(google),
    gcs: gcsOf(google),
  };
  await ctx.close();
}

// B — accept flow
{
  const { ctx, page, google, blocked } = await newScenario();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Accept" }).click();
  await page.waitForTimeout(3000);
  const s = await state(page);
  out.scenarios.B_accept = {
    cspViolations: s.csp,
    cspBlockedRequests: blocked,
    googleHostsAttempted: hostsOf(google),
    gcs: gcsOf(google),
    cookies: (await ctx.cookies()).map((c) => c.name),
  };
  await ctx.close();
}

// C — reject flow + submit with consent denied (the CONS-01 core case:
// the cookieless conversion ping to pagead2.googlesyndication.com)
{
  const { ctx, page, google, blocked } = await newScenario();
  await page.goto(BASE + "/#contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Decline" }).click();
  await page.waitForTimeout(1000);
  const submitted = await submitForm(page);
  const s = await state(page);
  out.scenarios.C_reject_submit = {
    submitted,
    cspViolations: s.csp,
    cspBlockedRequests: blocked,
    googleHostsAttempted: hostsOf(google),
    gcs: gcsOf(google),
    conversionPing: google.filter((u) => u.includes("CtkVCL")).map((u) => new URL(u).hostname),
    cookies: (await ctx.cookies()).map((c) => c.name),
  };
  await ctx.close();
}

// D — submit with consent granted (CONS-02: em= parameter on the conversion)
{
  const { ctx, page, google, blocked } = await newScenario({ consent: "granted" });
  await page.goto(BASE + "/#contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const submitted = await submitForm(page);
  const s = await state(page);
  out.scenarios.D_granted_submit = {
    submitted,
    cspViolations: s.csp,
    cspBlockedRequests: blocked,
    googleHostsAttempted: hostsOf(google),
    conversionPing: google.filter((u) => u.includes("CtkVCL")).map((u) => new URL(u).hostname),
    emParams: google
      .filter((u) => /[?&]em=/.test(u))
      .map((u) => ({ host: new URL(u).hostname, em: u.match(/[?&]em=([^&]+)/)[1].slice(0, 50) })),
    rawPII: google.filter((u) => decodeURIComponent(u).includes("qa-preview@example.com")),
  };
  await ctx.close();
}

await browser.close();

const allViolations = Object.values(out.scenarios).flatMap((s) => [
  ...(s.cspViolations || []),
  ...(s.cspBlockedRequests || []),
]);
out.verdict = {
  cspClean: allViolations.length === 0,
  deniedConversionPingSent:
    (out.scenarios.C_reject_submit.conversionPing || []).length > 0,
  globalDeniedDefault:
    JSON.stringify(out.scenarios.A_load.firstDataLayer?.[2] ?? {}).includes('"denied"') &&
    !("region" in (out.scenarios.A_load.firstDataLayer?.[2] ?? {})),
  noCookiesPreConsent: (out.scenarios.A_load.cookies || []).length === 0,
};
console.log(JSON.stringify(out, null, 2));
