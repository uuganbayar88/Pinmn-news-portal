import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
test('article OG card is a real PNG; optional review screenshots', async ({
  page,
  request,
}, testInfo) => {
  const response = await request.get('/news/2027-mungunii-bodlogo/opengraph-image');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const png = await response.body();
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  if (!process.env.CAPTURE_PREVIEWS) return;
  const dest = resolve('../docs/screenshots');
  await mkdir(dest, { recursive: true });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.hero img')).toBeVisible();
  await page.screenshot({ path: dest + '/home-' + testInfo.project.name + '.png', fullPage: true });
  if (testInfo.project.name === 'mobile') {
    await page.goto('/news/2027-mungunii-bodlogo');
    await page.screenshot({ path: dest + '/article-mobile.png', fullPage: true });
    await page.getByRole('button', { name: 'Хуваалцах', exact: true }).click();
    await page.screenshot({ path: dest + '/share-mobile.png' });
    await writeFile(dest + '/article-og.png', png);
  }
  expect(errors).toEqual([]);
});
