import { expect, test } from '@playwright/test';

test('SSR 페이지에 제목이 표시된다', async ({ page }) => {
  await page.goto('/ssr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Photos (SSR)');
});

test('SSR 페이지에 photo 카드가 렌더링된다', async ({ page }) => {
  await page.goto('/ssr');
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test('SSR 페이지에서 필터가 동작한다', async ({ page }) => {
  await page.goto('/ssr');
  await expect(page.getByRole('listitem').first()).toBeVisible();

  const countBefore = await page.getByRole('listitem').count();
  await page.getByPlaceholder('Filter by title...').fill('accusamus');
  const countAfter = await page.getByRole('listitem').count();

  expect(countAfter).toBeLessThan(countBefore);
});
