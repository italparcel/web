import { test, expect } from "@playwright/test";
import { blockExternal } from "./helpers";

const BANNER = '[role="dialog"][aria-label="Cookie consent"]';

test.describe("cookie banner", () => {
  test("first visit shows banner with equal accept/decline options", async ({
    context,
    page,
  }) => {
    await blockExternal(context);
    await page.goto("/");
    const banner = page.locator(BANNER);
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("button", { name: "Accept" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Decline" })).toBeVisible();
    await expect(banner.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  });

  test("accept persists and closes banner across reloads", async ({ context, page }) => {
    await blockExternal(context);
    await page.goto("/");
    await page.locator(BANNER).getByRole("button", { name: "Accept" }).click();
    await expect(page.locator(BANNER)).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("italparcel-consent-ads"))).toBe(
      "granted"
    );
    await page.reload();
    await expect(page.locator(BANNER)).toBeHidden();
  });

  test("decline persists, sets no cookies, and can be reopened from footer", async ({
    context,
    page,
  }) => {
    await blockExternal(context);
    await page.goto("/");
    await page.locator(BANNER).getByRole("button", { name: "Decline" }).click();
    await expect(page.locator(BANNER)).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("italparcel-consent-ads"))).toBe(
      "denied"
    );
    expect(await context.cookies()).toEqual([]);
    await page.reload();
    await expect(page.locator(BANNER)).toBeHidden();
    await page.locator("footer").getByRole("button", { name: "Manage cookies" }).click();
    await expect(page.locator(BANNER)).toBeVisible();
  });
});
