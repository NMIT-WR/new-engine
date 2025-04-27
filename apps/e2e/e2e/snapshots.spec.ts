import { expect, test } from '@playwright/test';
import { testedEshops } from '../eshop_utils';

for (const [eshop, baseURL] of Object.entries(testedEshops)) {
  test.describe(`${eshop} screenshot`, () => {
    test.use({ baseURL });

    test('landing matches snapshot', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.15 });
    });
  });
}
