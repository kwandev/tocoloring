import { expect, test } from '@playwright/test';

test('홈페이지에 제목이 표시된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Next.js Boilerplate');
});

test('SSR 샘플 링크로 이동한다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'SSR 샘플' }).click();
  await expect(page).toHaveURL('/ssr');
});

test('SPA 샘플 링크로 이동한다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'SPA 샘플' }).click();
  await expect(page).toHaveURL('/spa');
});
