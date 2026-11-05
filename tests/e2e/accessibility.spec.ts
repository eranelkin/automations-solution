import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/he", "/en", "/he/accessibility", "/he/privacy", "/he/terms"];
const THEMES: Array<"light" | "dark"> = ["light", "dark"];

for (const path of PAGES) {
  for (const theme of THEMES) {
    test(`axe scan: ${path} (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(path);
      // Let entrance animations (Motion opacity fades) fully settle before
      // scanning — axe computes contrast from composited pixels, so a mid-
      // fade frame can read as a transient (false-positive) contrast failure.
      await page.waitForTimeout(1500);

      const results = await new AxeBuilder({ page })
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
  }
}
