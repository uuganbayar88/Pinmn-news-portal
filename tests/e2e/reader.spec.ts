import { test, expect } from '@playwright/test';
test('home, article, save persistence and removal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('2027');
  await page.locator('h1 a').click();
  await expect(page.getByRole('heading', { name: 'Голыг нь ойлгоё.' })).toBeVisible();
  await page.getByRole('button', { name: 'Хадгалах', exact: true }).click();
  await page.goto('/saved');
  await expect(page.locator('.saved-row')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.saved-row')).toHaveCount(1);
  await page.getByRole('button', { name: 'Хадгалсан', exact: true }).click();
  await expect(page.locator('.saved-row')).toHaveCount(0);
});
test('search has shareable query, combined filters and empty state', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'Хайх үг' }).fill('сургууль');
  await page.getByRole('button', { name: 'Хайх', exact: true }).click();
  await expect(page.locator('.search-results article')).toHaveCount(2);
  await expect(page).toHaveURL(/q=/);
  await page.locator('select[name=category]').selectOption('world');
  await page.getByRole('button', { name: 'Шүүх', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Илэрц олдсонгүй.' })).toBeVisible();
});
test('sharing dialog has focus, keyboard dismissal and Facebook URL', async ({ page }) => {
  await page.goto('/news/2027-mungunii-bodlogo');
  await expect(page.locator('.facebook-button')).toHaveAttribute(
    'href',
    /facebook\.com\/sharer\/sharer\.php\?u=/,
  );
  await page.getByRole('button', { name: 'Хуваалцах', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#share-url')).toHaveValue(/\/news\/2027-mungunii-bodlogo$/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('daily digest, unavailable auth and missing article', async ({ page }) => {
  await page.goto('/daily');
  await expect(page.locator('.digest-item')).toHaveCount(7);
  await page.goto('/login');
  await expect(page.locator('input[type=password]')).toBeDisabled();
  await expect(page.getByText('Тун удахгүй', { exact: true })).toBeVisible();
  const response = await page.goto('/news/does-not-exist');
  expect(response?.status()).toBe(404);
});
test('core news reads without JavaScript; metadata is present', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/news/2027-mungunii-bodlogo');
  await expect(page.locator('h1')).toContainText('2027');
  await expect(page.locator('.article-body')).toContainText('Монголбанк');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /opengraph-image/,
  );
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    /\/news\/2027-mungunii-bodlogo$/,
  );
  await page.goto('/search?q=сургууль');
  await expect(page.locator('.search-results article')).toHaveCount(2);
  await context.close();
});
test('main pages stay within viewport', async ({ page }) => {
  for (const route of [
    '/',
    '/daily',
    '/search',
    '/login',
    '/newsletter',
    '/category/society',
    '/news/2027-mungunii-bodlogo',
  ]) {
    await page.goto(route);
    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(fits, route + ' overflows horizontally').toBe(true);
  }
});
