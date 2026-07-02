import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blockExternal, seedConsent } from "./helpers";

/**
 * Known axe violations, each mapped to a REVIEW_REPORT.md finding.
 * The suite stays green while these are open; remove entries as they get fixed
 * so regressions on NEW rules still fail the build.
 */
const KNOWN_VIOLATIONS: Record<string, string[]> = {
  // A11Y-01: accent orange fails 4.5:1 (logo wordmark, marquee labels, accent CTA)
  "color-contrast": ["A11Y-01"],
  // A11Y-02: WhatsApp FAB lives outside any landmark
  region: ["A11Y-02"],
};

async function expectNoNewViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const unexpected = results.violations.filter((v) => !(v.id in KNOWN_VIOLATIONS));
  expect(
    unexpected.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    "new axe violations (not in KNOWN_VIOLATIONS allowlist)"
  ).toEqual([]);
}

test.describe("accessibility (axe)", () => {
  for (const { name, path, toggleIt } of [
    { name: "home", path: "/" },
    { name: "terms EN", path: "/terms" },
    { name: "privacy EN", path: "/privacy" },
    { name: "privacy IT", path: "/privacy", toggleIt: true },
    { name: "prohibited-items", path: "/prohibited-items" },
  ]) {
    test(`axe: ${name}`, async ({ context, page }) => {
      await blockExternal(context);
      await seedConsent(context, "denied");
      await page.goto(path, { waitUntil: "networkidle" });
      if (toggleIt) {
        await page.getByRole("button", { name: "IT", exact: true }).click();
        await page.waitForTimeout(300);
      }
      await expectNoNewViolations(page);
    });
  }

  test("axe: home with cookie banner open", async ({ context, page }) => {
    await blockExternal(context);
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator('[role="dialog"][aria-label="Cookie consent"]')).toBeVisible();
    await expectNoNewViolations(page);
  });

  test("axe: form with visible validation errors", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/#contact", { waitUntil: "networkidle" });
    await page.locator("#name").fill("A");
    await page.locator("#email").fill("bad");
    await page.locator("#email").blur();
    await page.locator("#name").blur();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expectNoNewViolations(page);
  });
});

test.describe("keyboard & focus", () => {
  test("focus-visible outline is applied to interactive elements", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/");
    // footer legal link exists on both viewports (desktop nav is hidden on mobile)
    await page.locator("footer").getByRole("link", { name: "Privacy Policy" }).focus();
    const outline = await page.evaluate(() => {
      const cs = getComputedStyle(document.activeElement!);
      return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(outline.style).toBe("solid");
    expect(parseInt(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test("cookie banner buttons are keyboard operable", async ({ context, page }) => {
    await blockExternal(context);
    await page.goto("/");
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Decline" }).focus();
    await page.keyboard.press("Enter");
    await expect(banner).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem("italparcel-consent-ads"))).toBe(
      "denied"
    );
  });

  test("form inputs have associated labels and errors are announced", async ({
    context,
    page,
  }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/#contact");
    // every visible form control in the contact form has a label
    const unlabeled = await page.$$eval(
      "#contact input:not([type=hidden]), #contact select, #contact textarea",
      (els) =>
        els
          .filter((el) => {
            if (el.id === "company") return false; // honeypot, aria-hidden subtree
            const byFor = el.id && document.querySelector(`label[for="${el.id}"]`);
            const wrapped = el.closest("label");
            const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
            return !byFor && !wrapped && !aria;
          })
          .map((el) => el.id || el.getAttribute("name") || el.tagName)
    );
    expect(unlabeled, `controls without label: ${unlabeled.join(", ")}`).toEqual([]);
    // errors use role=alert so they are announced when they appear
    await page.locator("#email").fill("bad");
    await page.locator("#email").blur();
    const err = page.locator('p[role="alert"]', { hasText: "valid email" });
    await expect(err).toBeVisible();
    // aria-invalid reflects the state
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  });

  test("FAQ accordion is keyboard operable with aria-expanded", async ({ context, page }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
    await page.goto("/#faq");
    const q = page.getByRole("button", { name: "What counts as one parcel?" });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.focus();
    await page.keyboard.press("Enter");
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("A parcel is a single shipment")).toBeVisible();
  });

  test("DOCUMENTED GAP (A11Y-03): ESC does not close the cookie banner", async ({
    context,
    page,
  }) => {
    await blockExternal(context);
    await page.goto("/");
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    // Current behavior: banner stays open (no ESC handler, non-modal dialog).
    // This assertion documents the state; flip it when A11Y-03 is fixed.
    await expect(banner).toBeVisible();
  });
});
