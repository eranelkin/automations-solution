import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("root redirects to default locale /he", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("homepage has the expected title and landmarks", async ({ page }) => {
    await page.goto("/he");
    await expect(page).toHaveTitle(/FlowPilot/);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("header nav link scrolls to the target section", async ({ page }) => {
    await page.goto("/he");
    await page.getByRole("link", { name: "מחשבון" }).first().click();
    await page.waitForTimeout(500);
    await expect(page.locator("#calculator")).toBeInViewport();
  });

  test("no horizontal overflow on common breakpoints", async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/he");
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasOverflow, `width ${width}`).toBe(false);
    }
  });
});
