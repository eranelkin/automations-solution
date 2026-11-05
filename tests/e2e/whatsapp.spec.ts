import { test, expect } from "@playwright/test";

test.describe("WhatsApp link", () => {
  test("floating button opens wa.me with the correct prepared message", async ({ page }) => {
    await page.goto("/he");
    await page.evaluate(() => window.scrollTo(0, 600));

    const link = page.getByLabel("שלחו הודעה בוואטסאפ");
    await expect(link).toBeVisible({ timeout: 10000 });
    const href = await link.getAttribute("href");
    expect(href).toContain("https://wa.me/972523637333");
    expect(href).toContain("text=");
    expect(await link.getAttribute("target")).toBe("_blank");
    expect(await link.getAttribute("rel")).toContain("noopener");
  });

  test("English floating button has an English message", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => window.scrollTo(0, 600));

    const link = page.getByLabel("Message us on WhatsApp");
    await expect(link).toBeVisible({ timeout: 10000 });
    const href = await link.getAttribute("href");
    expect(decodeURIComponent(href ?? "")).toContain("I came from your website");
  });
});
