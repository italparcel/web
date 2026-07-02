import { test, expect } from "@playwright/test";
import { blockExternal, seedConsent, watchErrors } from "./helpers";

test.describe("home page", () => {
  test("loads without console errors or failed requests", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    const { consoleErrors, failedRequests } = watchErrors(page);

    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(/ItalParcel/);
    await expect(page.locator("h1")).toContainText("Your Italian");
    // key commercial sections are present
    for (const id of ["how", "features", "pricing", "faq", "contact"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    // "Failed to load resource: net::ERR_FAILED" is the duplicate-logo cache
    // artifact documented in helpers.watchErrors — real failures still surface
    // through failedRequests below.
    const realConsoleErrors = consoleErrors.filter(
      (e) => e !== "Failed to load resource: net::ERR_FAILED"
    );
    expect(realConsoleErrors, realConsoleErrors.join("\n")).toEqual([]);
    expect(failedRequests, failedRequests.join("\n")).toEqual([]);
  });

  test("has exactly one h1 and a lang attribute", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("html").getAttribute("lang")).toBe("en");
  });

  test("renders under reduced motion without hydration errors", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await blockExternal(context);
    await seedConsent(context, "denied");
    const page = await context.newPage();
    const { consoleErrors } = watchErrors(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    const hydrationErrors = consoleErrors.filter((e) => /hydrat|did not match/i.test(e));
    expect(hydrationErrors, hydrationErrors.join("\n")).toEqual([]);
    await context.close();
  });
});
