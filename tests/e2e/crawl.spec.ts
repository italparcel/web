import { test, expect } from "@playwright/test";
import { blockExternal, seedConsent } from "./helpers";

test.describe("site crawl", () => {
  test("404 page renders for unknown routes", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Error 404")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  });

  test("crawl internal pages: no broken links, images or mixed content", async ({
    context,
    page,
    request,
  }) => {
    test.slow();
    await blockExternal(context);
    await seedConsent(context, "denied");

    const toVisit = ["/"];
    const visited = new Set<string>();
    const broken: string[] = [];
    const brokenImages: string[] = [];
    const mixedContent: string[] = [];

    while (toVisit.length > 0 && visited.size < 25) {
      const path = toVisit.pop()!;
      if (visited.has(path)) continue;
      visited.add(path);

      const res = await page.goto(path, { waitUntil: "networkidle" });
      if (!res || res.status() >= 400) {
        broken.push(`${path} -> HTTP ${res?.status()}`);
        continue;
      }

      // discover internal links
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
      for (const href of hrefs) {
        if (href.startsWith("http://") && !href.startsWith("http://localhost")) {
          mixedContent.push(`${path}: ${href}`);
        }
        if (href.startsWith("/")) {
          const clean = href.split("#")[0] || "/";
          if (!visited.has(clean)) toVisit.push(clean);
        }
      }

      // verify images loaded
      // naturalWidth > 0 is the load criterion; `complete` can be false for the
      // duplicated logo request cancelled by the routing/cache artifact (see helpers).
      const imgs = await page.$$eval("img", (els) =>
        els.map((img) => ({
          src: img.currentSrc || img.getAttribute("src") || "",
          ok: img.naturalWidth > 0,
        }))
      );
      for (const img of imgs) {
        if (!img.ok && img.src.startsWith("http://localhost")) {
          brokenImages.push(`${path}: ${img.src}`);
        }
      }

      // http:// subresources = mixed content risk in production
      const httpResources = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((n) => n.startsWith("http://") && !n.startsWith("http://localhost"))
      );
      for (const r of httpResources) mixedContent.push(`${path}: ${r}`);
    }

    expect(visited.size).toBeGreaterThanOrEqual(4);
    expect(broken, broken.join("\n")).toEqual([]);
    expect(brokenImages, brokenImages.join("\n")).toEqual([]);
    expect(mixedContent, mixedContent.join("\n")).toEqual([]);
  });
});
