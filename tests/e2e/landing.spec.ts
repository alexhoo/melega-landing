import { expect, test } from '@playwright/test';

test('no horizontal scroll at 320 and 375', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `width ${width}`).toBeLessThanOrEqual(0);
  }
});

test('mobile call bar visible on mobile, hidden on desktop', async ({ page }, info) => {
  await page.goto('/');
  const bar = page.locator('a[data-call="mobile-bar"]');
  if (info.project.name === 'mobile') await expect(bar).toBeVisible();
  else await expect(bar).toBeHidden();
});

test('call bar does not cover footer', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile only');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const lastLink = await page.locator('footer a').last().boundingBox();
  const bar = await page.locator('[data-mobile-call-bar] a').boundingBox();
  expect(lastLink!.y + lastLink!.height).toBeLessThanOrEqual(bar!.y);
});

test('hero visible immediately with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const opacity = await page.locator('#inicio h1').evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
});

test('tabs work after hydration', async ({ page }) => {
  await page.goto('/');
  await page.locator('#servicios').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'Hogar y comercio' }).click();
  await expect(page.getByText('Instalaciones fotovoltaicas')).toBeVisible();
});

test('no stray colour band below the footer on mobile', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile only');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const gap = await page.evaluate(() => window.innerHeight - document.querySelector('footer')!.getBoundingClientRect().bottom);
  expect(gap).toBeLessThanOrEqual(1);
});
