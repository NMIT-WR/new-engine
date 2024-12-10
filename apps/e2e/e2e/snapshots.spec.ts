import { test, expect } from "@playwright/test";

test("landing matches snapshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot();
});
