import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Hero story and live demo", () => {
  test("shows the 5-step story", async ({ page }) => {
    await page.goto("/he");
    const story = page.getByRole("list", { name: /כך זה עובד/ });
    await expect(story.getByRole("listitem")).toHaveCount(5);
  });

  test("opens the demo popup and closes it with X, Escape and an outside click", async ({
    page,
  }) => {
    await page.goto("/he");
    const trigger = page.getByRole("button", { name: "צפו בהדגמה החיה" });
    const dialog = page.getByRole("dialog");

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toContainText("וואטסאפ");
    await dialog.getByRole("button", { name: "סגירה" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(dialog).toBeHidden();
  });

  test("open popup has no serious axe violations", async ({ page }) => {
    await page.goto("/he");
    await page.getByRole("button", { name: "צפו בהדגמה החיה" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});
