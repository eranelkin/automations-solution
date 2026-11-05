import { test, expect } from "@playwright/test";

test.describe("Theme switching", () => {
  test("switches between light, dark, and system", async ({ page }) => {
    await page.goto("/he");
    const header = page.locator("header");

    await header.getByLabel("ערכת צבעים").click();
    await page.getByRole("menuitem", { name: "כהה" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await header.getByLabel("ערכת צבעים").click();
    await page.getByRole("menuitem", { name: "בהיר" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("persists theme choice across reload", async ({ page }) => {
    await page.goto("/he");
    const header = page.locator("header");
    await header.getByLabel("ערכת צבעים").click();
    await page.getByRole("menuitem", { name: "כהה" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("no flash of incorrect theme on load", async ({ page }) => {
    await page.goto("/he");
    const header = page.locator("header");
    await header.getByLabel("ערכת צבעים").click();
    await page.getByRole("menuitem", { name: "כהה" }).click();

    await page.goto("/he");
    const bgColor = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    // Dark background (#0A0B10) should already be applied on first paint.
    expect(bgColor).toBe("rgb(10, 11, 16)");
  });
});
