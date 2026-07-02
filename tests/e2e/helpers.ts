import type { Page, BrowserContext } from "@playwright/test";

/** Abort all third-party requests so tests are hermetic (no Google/Photon traffic). */
export async function blockExternal(context: BrowserContext) {
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
}

/** Pre-seed a consent choice so the cookie banner does not overlay the page. */
export async function seedConsent(context: BrowserContext, value: "granted" | "denied") {
  await context.addInitScript((v) => {
    try {
      localStorage.setItem("italparcel-consent-ads", v);
    } catch {}
  }, value);
}

/** Collect console errors and failed same-origin requests for assertions. */
export function watchErrors(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("requestfailed", (req) => {
    // Ignore the routing artifact: with context.route() active Playwright disables
    // the HTTP cache, so the two identical logo requests (Nav + Footer) race and
    // Chromium cancels the duplicate with net::ERR_FAILED. Verified harmless via
    // tests/probes/image-probe.mjs (no routing -> both load fine).
    const dupImageArtifact =
      req.url().includes("/_next/image") && req.failure()?.errorText === "net::ERR_FAILED";
    if (req.url().startsWith("http://localhost") && !dupImageArtifact) {
      failedRequests.push(`${req.url()} :: ${req.failure()?.errorText}`);
    }
  });
  page.on("response", (res) => {
    if (res.url().startsWith("http://localhost") && res.status() >= 400) {
      failedRequests.push(`${res.url()} :: HTTP ${res.status()}`);
    }
  });
  return { consoleErrors, failedRequests };
}

export const VALID_FORM = {
  name: "Mario Rossi",
  email: "mario.rossi@example.com",
  phone: "+15551234567",
  country: "United States",
  address: "350 Fifth Avenue, New York, NY 10118, United States",
  itemDescription: "Two leather jackets and one moka pot",
};

/** Fill the quote form with valid data. Assumes Photon/Google are blocked or mocked. */
export async function fillValidForm(page: Page) {
  await page.locator("#name").fill(VALID_FORM.name);
  await page.locator("#email").fill(VALID_FORM.email);
  await page.locator("#phone").fill(VALID_FORM.phone);
  await page.locator("#country").fill(VALID_FORM.country);
  await page.keyboard.press("Escape");
  await page.locator("#address").fill(VALID_FORM.address);
  await page.keyboard.press("Escape");
  await page.locator("#itemDescription").fill(VALID_FORM.itemDescription);
  await page.locator("#acceptTerms").check({ force: true });
  await page.locator("#acceptClauses").check({ force: true });
  await page.locator("#name").click();
}
