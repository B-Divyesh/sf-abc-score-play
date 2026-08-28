import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:sample-score The demo opens with a rendered sample score', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  await expect(page.locator('#bar-count')).toHaveText('8 bars');
  await page.locator('#paper .abcjs-note.abcjs-mm2 path').first().click({ force: true });
  await expect(page.locator('#loop-start')).toHaveValue('3');
});

test('@claim:free-use The product is free and needs no account', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free to use', { exact: true })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/buy|subscribe|sign in/i)).toHaveCount(0);
});

test('@claim:local-score Score text stays in the browser', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.locator('#abc-source').fill('X:1\nT:Local\nM:4/4\nL:1/4\nK:C\n| C D E F |');
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  expect(await page.evaluate(() => localStorage.getItem('demo:abc-score-play:score'))).toContain('T:Local');
  expect(crossOrigin).toEqual([]);
});

test('@claim:offline-reload The demo reloads offline after one visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.locator('#paper svg')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Play a ready-made ABC score');
  await expect(page.locator('#paper svg')).toBeVisible();
});

test('@claim:score-playback A valid score plays with local audio', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.getByRole('button', { name: 'Play score' }).click();
  await expect(page.locator('#app-status')).toHaveText('Score playing.');
  await expect(page.locator('#transport')).toHaveClass(/is-playing/);
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect(page.locator('#app-status')).toHaveText('Playback stopped.');
});

test('@claim:bar-loop A selected bar repeats twice', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.locator('#tempo-number').fill('220');
  await page.locator('#tempo-number').press('Enter');
  await page.getByRole('button', { name: 'Play loop' }).click();
  await expect(page.locator('#app-status')).toContainText('Loop played 2 times', { timeout: 8_000 });
  await page.getByRole('button', { name: 'Stop' }).click();
});

test('@claim:score-link A score link restores the score', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  const requestedUrls: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  const expected = await page.locator('#abc-source').inputValue();
  await page.getByRole('button', { name: 'Copy score link' }).click();
  await expect(page.locator('#app-status')).toHaveText('Score link copied.');
  expect(page.url()).toContain('#score=');
  await page.evaluate(() => localStorage.removeItem('demo:abc-score-play:score'));
  await page.reload();
  await expect(page.locator('#abc-source')).toHaveValue(expected);
  expect(requestedUrls.some((url) => url.includes('score='))).toBe(false);
});

test('@claim:print-card The print action opens a print view', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { printCalled?: boolean }).print = () => { (window as Window & { printCalled?: boolean }).printCalled = true; };
  });
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.getByRole('button', { name: 'Print score card' }).click();
  expect(await page.evaluate(() => (window as Window & { printCalled?: boolean }).printCalled)).toBe(true);
  await expect(page.locator('#app-status')).toHaveText('Print view opened.');
});

test('@claim:error-lines Invalid ABC points to the line to fix', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#abc-source').fill('X:1\nT:Broken "chord\nM:4/4\nL:1/4\nK:C\nC D E F');
  await expect(page.locator('#validation-errors')).toContainText('Line 2');
  await page.getByRole('button', { name: 'Line 2' }).click();
  expect(await page.locator('#abc-source').evaluate((node) => (node as HTMLTextAreaElement).selectionStart)).toBe(4);
});

test('site structure, mobile layout, and accessibility baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('#paper svg')).toBeVisible();
  const darkResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(darkResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('regression: every visible mobile control has a 44 by 44 touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const undersized: Array<{ path: string; id: string; name: string; width: number; height: number }> = [];

  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const targets = await page.locator('a, button, input, textarea, [role="button"]').evaluateAll((elements) => elements
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          id: element.id,
          name: (element.textContent || element.getAttribute('aria-label') || element.getAttribute('name') || element.tagName).trim(),
          width: bounds.width,
          height: bounds.height,
          visible: bounds.width > 0 && bounds.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
        };
      })
      .filter((target) => target.visible && (target.width < 44 || target.height < 44))
    );
    undersized.push(...targets.map((target) => ({ path, ...target })));
  }

  expect(undersized).toEqual([]);
});

test('keyboard access reaches the skip link and controls playback', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.locator('#paper-bay').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#app-status')).toHaveText('Score playing.');
  await page.keyboard.press('Space');
  await expect(page.locator('#app-status')).toHaveText('Playback stopped.');
});

test('legal and unknown routes have one clear heading', async ({ page }) => {
  for (const route of ['/privacy', '/terms', '/missing-bar']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.title()).not.toBe('');
  }
});
