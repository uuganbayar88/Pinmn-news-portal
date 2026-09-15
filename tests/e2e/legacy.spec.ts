import { test, expect } from '@playwright/test';
test('previous article links retain content and integrate with saved stories', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const response = await page.goto('/tatvaryn-shinechlel');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Татварын шинэчлэл');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('.site-header')).toHaveCount(1);
  await page.getByRole('button', { name: 'Хадгалах', exact: true }).click();
  await page.goto('/saved');
  await page.locator('.saved-row h2 a').click();
  await expect(page).toHaveURL(/\/tatvaryn-shinechlel$/);
  await expect(page.getByRole('button', { name: 'Хадгалсан', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
