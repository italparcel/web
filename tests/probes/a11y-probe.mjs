// Phase 7 discovery: axe violations per page/state + keyboard behavior of the banner.
import { chromium } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

const browser = await chromium.launch();
const out = { axe: {}, keyboard: {} };

async function scan(name, setup) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  await setup(ctx, page);
  const res = await new AxeBuilder({ page }).analyze();
  out.axe[name] = res.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 6).map((n) => n.target.join(" ")),
    help: v.help,
  }));
  await ctx.close();
}

const seedDenied = (ctx) =>
  ctx.addInitScript(() => {
    try { localStorage.setItem("italparcel-consent-ads", "denied"); } catch {}
  });

await scan("home+banner", async (ctx, page) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
});
await scan("home", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
});
await scan("privacy-en", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
});
await scan("privacy-it", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "IT", exact: true }).click();
  await page.waitForTimeout(400);
});
await scan("terms", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/terms", { waitUntil: "networkidle" });
});
await scan("prohibited", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/prohibited-items", { waitUntil: "networkidle" });
});
await scan("form-errors", async (ctx, page) => {
  await seedDenied(ctx);
  await page.goto("http://localhost:3000/#contact", { waitUntil: "networkidle" });
  await page.locator("#name").fill("A");
  await page.locator("#email").fill("bad");
  await page.locator("#email").blur();
  await page.locator("#name").blur();
  await page.waitForTimeout(500);
});

// ── keyboard behavior of the cookie banner ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
  out.keyboard.bannerVisible = await banner.isVisible();
  // where does focus start? does the banner receive focus / is it reachable?
  const attrs = await banner.evaluate((el) => ({
    ariaModal: el.getAttribute("aria-modal"),
    tabindex: el.getAttribute("tabindex"),
  }));
  out.keyboard.bannerAttrs = attrs;
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  out.keyboard.escClosesBanner = !(await banner.isVisible());
  // focus-visible styling on a button
  await page.getByRole("button", { name: "Decline" }).focus();
  out.keyboard.focusOutline = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement, ":focus-visible");
    const plain = getComputedStyle(document.activeElement);
    return { outlineStyle: plain.outlineStyle, outlineWidth: plain.outlineWidth, outlineColor: plain.outlineColor };
  });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
