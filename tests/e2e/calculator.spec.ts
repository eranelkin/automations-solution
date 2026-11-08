import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Calculator dock", () => {
  test("float button opens the panel, updates results, and closes with X", async ({ page }) => {
    await page.goto("/he");

    const openButton = page.getByRole("button", { name: "פתיחת מחשבון החיסכון" });
    await expect(openButton).toBeVisible();
    await openButton.click();

    const panel = page.getByRole("dialog", { name: "כמה עולה לכם לא לעשות אוטומציה?" });
    await expect(panel).toBeVisible();
    await expect(openButton).toBeHidden();

    const yearly = panel.getByText("חיסכון שנתי פוטנציאלי").locator("xpath=following-sibling::p[1]");
    const before = await yearly.textContent();
    const employees = panel.getByRole("spinbutton").first();
    // Typing alone (no Enter/blur) recalculates.
    await employees.fill("50");
    await expect(yearly).not.toHaveText(before ?? "");

    await panel.getByRole("button", { name: "סגירת המחשבון" }).click();
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "פתיחת מחשבון החיסכון" })).toBeVisible();
  });

  test("Escape closes the panel and returns focus to the button", async ({ page }) => {
    await page.goto("/he");
    await page.getByRole("button", { name: "פתיחת מחשבון החיסכון" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByRole("button", { name: "פתיחת מחשבון החיסכון" })).toBeFocused();
  });

  test("clicking outside the panel closes it", async ({ page }) => {
    await page.goto("/he");
    await page.getByRole("button", { name: "פתיחת מחשבון החיסכון" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.locator("h1").click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByRole("button", { name: "פתיחת מחשבון החיסכון" })).toBeVisible();
  });

  test("open panel has no serious axe violations", async ({ page }) => {
    await page.goto("/he");
    await page.getByRole("button", { name: "פתיחת מחשבון החיסכון" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    if (seriousOrCritical.length > 0) {
      console.log(JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });
});
