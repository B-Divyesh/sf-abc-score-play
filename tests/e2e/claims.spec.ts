import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('@claim:sample-score The demo opens with a rendered sample score', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await expect(page.locator('#paper svg')).toBeVisible();
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  await expect(page.locator('#bar-count')).toHaveText('8 bars');
  await expect(page.getByText('Demo — sample data, nothing is saved to your real score', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  for (const selector of ['#paper svg', '#bar-count', '#play-score', '#play-loop']) {
    await expect(page.locator(selector), `${selector} should intersect the first phone viewport`).toBeInViewport();
  }
  const sample = await page.locator('#abc-source').inputValue();
  await page.locator('#paper .abcjs-note.abcjs-mm2 path').first().click({ force: true });
  await expect(page.locator('#loop-start')).toHaveValue('3');
  await page.locator('#abc-source').fill('X:1\nT:Changed\nM:4/4\nL:1/4\nK:C\n| C D E F |');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#abc-source')).toHaveValue(sample);
  await expect(page.locator('#bar-count')).toHaveText('8 bars');
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

test('@claim:demo-isolation Demo edits never replace the real score', async ({ page }) => {
  const realScore = 'X:1\nT:REAL-MARKER\nM:4/4\nL:1/4\nK:C\n| C D E F |';
  const demoScore = 'X:1\nT:DEMO-MARKER\nM:4/4\nL:1/4\nK:C\n| G A B c |';
  await page.addInitScript(({ real, demo }) => {
    localStorage.setItem('abc-score-play:score', real);
    localStorage.setItem('demo:abc-score-play:score', demo);
  }, { real: realScore, demo: demoScore });
  await page.goto('/demo');
  await expect(page.locator('#abc-source')).toHaveValue(demoScore);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.locator('#abc-source')).toHaveValue(realScore);
  await expect.poll(() => page.evaluate(() => ({
    real: localStorage.getItem('abc-score-play:score'),
    demo: localStorage.getItem('demo:abc-score-play:score')
  }))).toEqual({ real: realScore, demo: null });
});

test('@claim:offline-reload The demo reloads offline after one visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.locator('#paper svg')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Play the sample score');
  await expect(page.locator('#paper svg')).toBeVisible();
});

test('@claim:score-playback A valid score plays with local audio', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const calls = { resume: 0, createOscillator: 0, start: 0 };
    Object.defineProperty(window, '__audioCalls', { value: calls });
    class FakeOscillator {
      type = 'sine';
      frequency = { value: 0 };
      connect(node: unknown) { return node; }
      start() { calls.start += 1; }
      stop() { /* Observable start is the claim boundary. */ }
    }
    class FakeGain {
      gain = {
        setValueAtTime() { /* no-op test graph */ },
        exponentialRampToValueAtTime() { /* no-op test graph */ }
      };
      connect(node: unknown) { return node; }
    }
    class FakeAudioContext {
      currentTime = 0;
      destination = {};
      async resume() { calls.resume += 1; }
      createOscillator() { calls.createOscillator += 1; return new FakeOscillator(); }
      createGain() { return new FakeGain(); }
    }
    Object.defineProperty(window, 'AudioContext', { value: FakeAudioContext, configurable: true });
  });
  await page.goto('/?demo=1');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.getByRole('button', { name: 'Play score' }).click();
  await expect(page.locator('#app-status')).toHaveText('Score playing.');
  await expect(page.locator('#transport')).toHaveClass(/is-playing/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { __audioCalls: { resume: number } }).__audioCalls.resume)).toBe(1);
  expect(await page.evaluate(() => (window as unknown as { __audioCalls: { createOscillator: number } }).__audioCalls.createOscillator)).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as unknown as { __audioCalls: { start: number } }).__audioCalls.start)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect(page.locator('#app-status')).toHaveText('Playback stopped.');
  expect(pageErrors).toEqual([]);
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

test('@claim:tempo-range Practice tempo accepts 40 through 220 BPM and clamps outside values', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  const tempo = page.locator('#tempo-number');
  await tempo.fill('40');
  await tempo.press('Enter');
  await expect(tempo).toHaveValue('40');
  await tempo.fill('220');
  await tempo.press('Enter');
  await expect(tempo).toHaveValue('220');
  await tempo.fill('39');
  await tempo.press('Enter');
  await expect(tempo).toHaveValue('40');
  await tempo.fill('221');
  await tempo.press('Enter');
  await expect(tempo).toHaveValue('220');
});

test('@claim:live-render Editing valid ABC updates the rendered staff', async ({ page }) => {
  const changedScore = 'X:1\nT:Morning Waltz\nM:3/4\nL:1/4\nK:C\n| C E G | c G E | C3 |';
  await page.goto('/?demo=1');
  await expect(page.locator('#paper svg')).toBeVisible();
  const before = await page.locator('#paper svg').innerHTML();
  await page.locator('#abc-source').fill(changedScore);
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  await expect(page.locator('#paper')).toContainText('Morning Waltz');
  expect(await page.locator('#paper svg').innerHTML()).not.toBe(before);
});

test('@claim:abc-file-open Opening an ABC file updates the source and staff without uploading', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  const fixture = 'X:1\nT:File Round Trip\nM:2/4\nL:1/8\nK:D\n| D2 F2 | A4 |';
  await page.goto('/?demo=1');
  await page.locator('#open-score-file').setInputFiles({ name: 'lesson.abc', mimeType: 'text/vnd.abc', buffer: Buffer.from(fixture) });
  await expect(page.locator('#abc-source')).toHaveValue(fixture);
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  await expect(page.locator('#paper')).toContainText('File Round Trip');
  expect(await page.evaluate(() => localStorage.getItem('demo:abc-score-play:score'))).toBe(fixture);
  expect(await page.evaluate(() => localStorage.getItem('abc-score-play:score'))).toBeNull();
  expect(requests.filter((url) => new URL(url).origin !== 'http://127.0.0.1:4173')).toEqual([]);
});

test('@claim:abc-file-download Downloading preserves exact ABC text and uses a safe filename', async ({ page }) => {
  const source = 'X:1\nT:Evening / Scale?\nM:4/4\nL:1/4\nK:C\n| C D E F |';
  await page.goto('/?demo=1');
  await page.locator('#abc-source').fill(source);
  await expect(page.locator('#validation-label')).toHaveText('Valid score');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download ABC file' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('evening-scale.abc');
  const path = await download.path();
  expect(path).not.toBeNull();
  expect(await readFile(path!, 'utf8')).toBe(source);
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

test('@claim:print-card The print action opens a clean print view', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { printCalled?: boolean }).print = () => { (window as Window & { printCalled?: boolean }).printCalled = true; };
  });
  await page.goto('/demo');
  await expect(page.locator('#paper svg')).toBeVisible();
  await page.getByRole('button', { name: 'Print score card' }).click();
  expect(await page.evaluate(() => (window as Window & { printCalled?: boolean }).printCalled)).toBe(true);
  await expect(page.locator('#app-status')).toHaveText('Print view opened.');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#paper svg')).toBeVisible();
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.demo-strip')).toBeHidden();
  await expect(page.locator('.editor-panel')).toBeHidden();
  await expect(page.locator('#transport')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
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

test('every public page has one H1 and no serious accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/missing-bar']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
});

test('route titles, social metadata, raw heads, and consistent navigation are complete', async ({ page, request }) => {
  const routes = [
    { path: '/', title: 'ABC Score Play — write, hear, and loop music', canonical: 'https://abc-score-play.sociobot.in/' },
    { path: '/demo', title: 'Demo — ABC Score Play', canonical: 'https://abc-score-play.sociobot.in/demo' },
    { path: '/privacy', title: 'Privacy — ABC Score Play', canonical: 'https://abc-score-play.sociobot.in/privacy' },
    { path: '/terms', title: 'Terms — ABC Score Play', canonical: 'https://abc-score-play.sociobot.in/terms' }
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', route.canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Demo', 'Editor', 'Privacy']);
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);
    const raw = await response.text();
    expect(raw).toContain(`<title>${route.title}</title>`);
    expect(raw).toContain(`content="${route.title}"`);
    expect(raw).toContain(`href="${route.canonical}"`);
  }
  const missing = await request.get('/missing-bar');
  expect(missing.status()).toBe(404);
  const missingHtml = await missing.text();
  expect(missingHtml).toContain('<title>Page not found — ABC Score Play</title>');
  expect(missingHtml).toContain('rel="canonical"');
  expect(missingHtml).toContain('rel="apple-touch-icon"');
  expect(missingHtml).toContain('Built by Param Factory · v1.0.0 · Original generated artwork');
  await page.goto('/missing-bar');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Demo', 'Editor', 'Privacy']);
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link')).toHaveText(['Privacy', 'Terms']);
});

test('Start for real, direct editor links, and browser history focus the visible destination', async ({ page }) => {
  const realScore = 'X:1\nT:REAL ROUTE\nM:4/4\nL:1/4\nK:C\n| C D E F |';
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript((score) => localStorage.setItem('abc-score-play:score', score), realScore);
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#workbench$/);
  await expect(page.locator('#workbench-title')).toBeFocused();
  await expect(page.locator('#workbench-title')).toBeInViewport();
  await expect(page.locator('#abc-source')).toHaveValue(realScore);

  await page.goto('/#workbench');
  await expect(page.locator('#workbench-title')).toBeFocused();
  await expect(page.locator('#workbench-title')).toBeInViewport();

  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.locator('h1')).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator('h1')).toBeFocused();
});

test('regression: the focused skip link passes axe contrast checks in light and dark modes', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('/demo');
    await expect(page.locator('#paper svg')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await expect(page.locator('.skip-link')).toBeVisible();
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('regression: every visible mobile control has a 44 by 44 touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const undersized: Array<{ path: string; id: string; name: string; width: number; height: number }> = [];

  for (const path of ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/missing-bar']) {
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
