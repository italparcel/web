import { test, expect } from "@playwright/test";
import { blockExternal, seedConsent, fillValidForm } from "./helpers";

test.describe("quote/contact form", () => {
  test.beforeEach(async ({ context }) => {
    await blockExternal(context);
    await seedConsent(context, "denied");
  });

  test("shows client-side validation messages on invalid input", async ({ page }) => {
    await page.goto("/#contact");
    await page.locator("#name").fill("A");
    await page.locator("#name").blur();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();

    await page.locator("#email").fill("not-an-email");
    await page.locator("#email").blur();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();

    // submit stays disabled while invalid
    await expect(page.getByRole("button", { name: /Send request/ })).toBeDisabled();
  });

  test("requires phone when WhatsApp reply channel is chosen", async ({ page }) => {
    await page.goto("/#contact");
    // The phone rule is a schema-level zod refine: it only runs once base field
    // validation passes, so the rest of the form must be valid first.
    await fillValidForm(page);
    await page.getByText("WhatsApp", { exact: true }).click();
    await page.locator("#phone").fill("123");
    await page.locator("#phone").blur();
    await expect(
      page.getByText("Please provide a WhatsApp number when choosing WhatsApp.")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Open WhatsApp/ })).toBeDisabled();
  });

  test("successful submit (mocked backend) shows success card and resets", async ({ page }) => {
    let payload: Record<string, unknown> | null = null;
    await page.route("**/api/contact", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto("/#contact");
    await fillValidForm(page);
    const submit = page.getByRole("button", { name: /Send request/ });
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByText("Got it.")).toBeVisible();
    expect(payload).not.toBeNull();
    expect(payload!.company).toBe(""); // honeypot untouched
    await page.getByRole("button", { name: "Send another" }).click();
    await expect(page.locator("#name")).toHaveValue("");
  });

  test("backend error surfaces an alert and keeps the form", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "Could not send email. Please try again." }),
      })
    );
    await page.goto("/#contact");
    await fillValidForm(page);
    await page.getByRole("button", { name: /Send request/ }).click();
    // p[role=alert]: Next's route announcer is also role=alert, so be specific.
    await expect(page.locator('p[role="alert"]')).toContainText("Could not send email");
    await expect(page.locator("#name")).toHaveValue(/Mario/);
  });

  test("server rejects invalid payload with 422 (real endpoint)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "X", email: "nope", acceptTerms: false },
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Invalid form data");
  });

  test("server rejects malformed JSON with 400 (real endpoint)", async ({ request }) => {
    // Buffer body is sent raw; a plain string would be JSON-quoted by Playwright.
    const res = await request.post("/api/contact", {
      headers: { "content-type": "application/json" },
      data: Buffer.from("{not json"),
    });
    expect(res.status()).toBe(400);
  });

  test("honeypot submission is accepted but not processed (real endpoint)", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: { company: "spam bot inc" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  test("non-POST methods are rejected (real endpoint)", async ({ request }) => {
    const res = await request.get("/api/contact");
    expect(res.status()).toBe(405);
  });
});
