import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/he#contact");
    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("p.text-red-500").first()).toBeVisible();
  });

  test("submits successfully with a mocked API response", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.goto("/he#contact");
    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());

    await page.fill("#fullName", "דני כהן");
    await page.fill("#phone", "050-1234567");
    await page.fill("#email", "dani@example.com");
    await page.check("#consent");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("הפנייה נשלחה בהצלחה!")).toBeVisible();
  });

  test("shows the no-webhook error without faking success", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({ status: 503, json: { ok: false, error: "no_webhook" } });
    });

    await page.goto("/he#contact");
    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());

    await page.fill("#fullName", "דני כהן");
    await page.fill("#phone", "050-1234567");
    await page.fill("#email", "dani@example.com");
    await page.check("#consent");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("#contact").getByRole("alert")).toContainText("לא ניתן לשלוח");
    // Values must not be wiped — user shouldn't have to retype on failure.
    await expect(page.locator("#fullName")).toHaveValue("דני כהן");
  });
});
