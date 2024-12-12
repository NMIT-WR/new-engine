import { test, expect } from "@playwright/test";
import { testedEshops } from "../eshop_utils"

for (const [eshop, url] of Object.entries(testedEshops)) {
  test(`${eshop} landing matches snapshot`,async ({ page }) => {
    await page.goto(`${url}/`);
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.15 });
  });
}
