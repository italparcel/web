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

  test("SEC-02 regression: X-Forwarded-For spoofing cannot reset the rate limit", async ({
    request,
  }) => {
    // Simulates Netlify: the trusted x-nf-client-connection-ip is fixed while
    // the attacker rotates X-Forwarded-For on every request. With the old
    // leftmost-XFF key each request looked like a new client and the limit
    // never triggered; keyed on the trusted header, request #6 must get 429.
    // Payloads pass validation but never send email locally (Turnstile secret
    // is not configured, so non-limited requests stop with a 4xx/5xx there).
    const trusted = `198.51.100.${Math.floor(Math.random() * 200)}.${Date.now() % 1000}`;
    const payload = {
      name: "Rate Limit Probe",
      email: "rate-limit-probe@example.com",
      phone: "",
      country: "United States",
      address: "123 Probe Street, Springfield",
      itemDescription: "rate limit regression test",
      parcels: "1",
      origin: "extra-eu",
      notes: "",
      channel: "email",
      acceptTerms: true,
      acceptClauses: true,
    };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/contact", {
        headers: {
          "x-nf-client-connection-ip": trusted,
          "x-forwarded-for": `10.0.${i}.${i}, 172.16.0.1`,
        },
        data: payload,
      });
      statuses.push(res.status());
      if (res.status() === 429) break;
    }
    expect(statuses, `statuses seen: ${statuses.join(",")}`).toContain(429);
  });
});
