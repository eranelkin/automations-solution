import { test, expect } from "@playwright/test";

test.describe("Locale switching", () => {
  test("switches from Hebrew to English and back", async ({ page }) => {
    await page.goto("/he");
    const header = page.locator("header");
    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await header.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await page.locator("header").getByRole("link", { name: "עברית" }).click();
    await expect(page).toHaveURL(/\/he/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("preserves the scroll anchor when switching language", async ({ page }) => {
    await page.goto("/he#calculator");
    await page.evaluate(() => document.getElementById("calculator")?.scrollIntoView());
    await page.locator("header").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en#calculator/);
  });
});
