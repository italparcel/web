import { test, expect } from "@playwright/test";
import { blockExternal, seedConsent } from "./helpers";

const PAGES = ["/", "/terms", "/privacy", "/prohibited-items"];

test.describe("navigation", () => {
  test("all internal links on every page resolve (no 4xx/5xx)", async ({
    context,
    page,
    request,
  }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");

    const internal = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
      for (const href of hrefs) {
        if (href.startsWith("/")) internal.add(href.split("#")[0] || "/");
      }
    }
    expect(internal.size).toBeGreaterThan(3);
    for (const path of internal) {
      const res = await request.get(path);
      expect(res.status(), `${path} -> ${res.status()}`).toBeLessThan(400);
    }
  });

  test("in-page anchors used by nav and form exist", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");

    await page.goto("/");
    for (const id of ["how", "pricing", "features", "faq", "contact"]) {
      await expect(page.locator(`[id="${id}"]`), `#${id} on /`).toHaveCount(1);
    }
    // clause anchors referenced by the form's art. 1341/1342 checkbox
    await page.goto("/terms");
    for (const id of ["sec-3-2", "sec-3-10", "sec-4-5", "sec-5-9", "sec-7-3", "sec-8-2"]) {
      await expect(page.locator(`[id="${id}"]`), `#${id} on /terms`).toHaveCount(1);
    }
  });

  test("legal pages language toggle switches content and stays on page", async ({
    context,
    page,
  }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");

    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
    await page.getByRole("button", { name: "IT", exact: true }).click();
    await expect(page.locator("h1")).toContainText("Informativa sulla Privacy");
    expect(page.url()).toContain("/privacy");
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });

  test("mobile menu opens, navigates and closes", async ({ context, page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });
});
