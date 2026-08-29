import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium, expect, request } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://abc-score-play.sociobot.in';
const sample = `X:1
T:Evening Scale Study
C:ABC Score Play sample
M:4/4
L:1/8
Q:1/4=104
K:G
|: G2 B2 d2 B2 | A2 c2 e2 c2 |
G2 A2 B2 c2 | d4 B4 :|
|: e2 d2 c2 B2 | A2 G2 F2 D2 |
G2 B2 A2 F2 | G8 :|`;
const report = { checkedAt: new Date().toISOString(), routes: [], firstScreen: {}, findings: {}, privacy: {}, offline: {} };

const routeDefinitions = [
  ['/', 200, 'ABC Score Play — write, hear, and loop music', 'https://abc-score-play.sociobot.in/'],
  ['/demo', 200, 'Demo — ABC Score Play', 'https://abc-score-play.sociobot.in/demo'],
  ['/privacy', 200, 'Privacy — ABC Score Play', 'https://abc-score-play.sociobot.in/privacy'],
  ['/terms', 200, 'Terms — ABC Score Play', 'https://abc-score-play.sociobot.in/terms'],
  ['/missing-polish-5', 404, 'Page not found — ABC Score Play', 'https://abc-score-play.sociobot.in/404.html']
];

const api = await request.newContext({ baseURL: base });
for (const [path, status, title, canonical] of routeDefinitions) {
  const response = await api.get(path);
  const html = await response.text();
  assert.equal(response.status(), status);
  assert.match(html, new RegExp(`<title>${title}</title>`));
  assert.ok(html.includes(`href="${canonical}"`));
  report.routes.push({ path, status, title, canonical, raw: 'pass' });
}

const browser = await chromium.launch();
const routeContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const routePage = await routeContext.newPage();
for (const [path, status, title, canonical] of routeDefinitions) {
  const response = await routePage.goto(base + path, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), status);
  await expect(routePage).toHaveTitle(title);
  await expect(routePage.locator('h1')).toHaveCount(1);
  await expect(routePage.locator('main')).toBeVisible();
  await expect(routePage.locator('.skip-link')).toHaveText('Skip to page content');
  await expect(routePage.locator('.skip-link')).toHaveAttribute('href', '#main');
  await expect(routePage.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
  await expect(routePage.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Demo', 'Editor', 'Privacy']);
  assert.equal(await routePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
  const axe = await new AxeBuilder({ page: routePage }).analyze();
  assert.deepEqual(axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')).map((violation) => violation.id), []);
}

await routePage.goto(base + '/');
for (const selector of ['h1', '.lede', '.hero-action-row', '.facts']) {
  const box = await routePage.locator(selector).boundingBox();
  assert.ok(box && box.y >= 0 && box.y + box.height <= 844, `${selector} must fit in the first phone viewport`);
}
report.firstScreen = {
  headline: await routePage.locator('h1').textContent(),
  audience: await routePage.locator('.lede').textContent(),
  action: await routePage.getByRole('link', { name: 'Try it with sample data' }).textContent(),
  facts: await routePage.locator('.facts li').allTextContents(),
  phoneViewport: 'pass'
};
await routeContext.close();

const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
const page = await context.newPage();
const requests = [];
const errors = [];
page.on('request', (requestEvent) => requests.push({ url: requestEvent.url(), method: requestEvent.method(), hasBody: Boolean(requestEvent.postData()) }));
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
await page.addInitScript(() => {
  const calls = { resume: 0, createOscillator: 0, start: 0 };
  Object.defineProperty(window, '__audioCalls', { value: calls });
  class FakeOscillator {
    type = 'sine';
    frequency = { value: 0 };
    connect(node) { return node; }
    start() { calls.start += 1; }
    stop() {}
  }
  class FakeGain {
    gain = { setValueAtTime() {}, exponentialRampToValueAtTime() {} };
    connect(node) { return node; }
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

const realScore = 'X:1\nT:LIVE REAL\nM:4/4\nL:1/4\nK:C\n| C D E F |';
await page.goto(base + '/');
await page.evaluate((value) => localStorage.setItem('abc-score-play:score', value), realScore);
await page.getByRole('link', { name: 'Try it with sample data' }).click();
await expect(page).toHaveURL(/\?demo=1$/);
await expect(page.locator('#abc-source')).toHaveValue(sample);
await expect(page.locator('#bar-count')).toHaveText('8 bars');
for (const selector of ['#paper svg', '#bar-count', '#play-score', '#play-loop']) await expect(page.locator(selector)).toBeInViewport();
await expect(page.getByText('Demo — sample data, nothing is saved to your real score', { exact: true })).toBeVisible();
await page.locator('#abc-source').fill('X:1\nT:CHANGED\nM:4/4\nL:1/4\nK:C\n| C D E F |');
await page.getByRole('button', { name: 'Reset demo' }).click();
await expect(page.locator('#abc-source')).toHaveValue(sample);
report.findings['F-1-1'] = report.findings['sample-score'] = 'pass';

await page.locator('#paper .abcjs-note.abcjs-mm2 path').first().click({ force: true });
await expect(page.locator('#loop-start')).toHaveValue('3');
await expect(page.locator('#loop-end')).toHaveValue('3');
await expect(page.locator('#loop-summary')).toHaveText('Bar 3 will repeat until you stop.');
report.findings['F-5-4'] = 'pass';

await page.locator('#paper-bay').focus();
await page.keyboard.press('Space');
await expect(page.locator('#app-status')).toHaveText('Score playing.');
await expect.poll(() => page.evaluate(() => window.__audioCalls.start)).toBeGreaterThan(0);
await page.keyboard.press('Space');
await expect(page.locator('#app-status')).toHaveText('Playback stopped.');
report.findings['F-1-3'] = report.findings['F-5-5'] = 'pass';

await page.locator('#loop-start').fill('2');
await page.locator('#loop-start').dispatchEvent('change');
await page.locator('#loop-end').fill('3');
await page.locator('#loop-end').dispatchEvent('change');
await expect(page.locator('#loop-summary')).toHaveText('Bars 2–3 will repeat until you stop.');
const startsBeforeLoop = await page.evaluate(() => window.__audioCalls.start);
await page.evaluate(() => {
  const measures = new Set();
  window.__playedMeasures = measures;
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const target = mutation.target;
      if (!target.classList?.contains('playing')) continue;
      for (const name of target.classList) if (/^abcjs-mm\d+$/.test(name)) measures.add(name);
    }
  }).observe(document.querySelector('#paper'), { attributes: true, attributeFilter: ['class'], subtree: true });
});
await page.getByRole('button', { name: 'Play loop' }).click();
await expect.poll(() => page.evaluate(() => [...window.__playedMeasures])).toContain('abcjs-mm1');
await expect.poll(() => page.evaluate(() => [...window.__playedMeasures])).toContain('abcjs-mm2');
await expect(page.locator('#app-status')).toContainText('Loop played 2 times', { timeout: 10_000 });
const loopStarts = await page.evaluate((before) => window.__audioCalls.start - before, startsBeforeLoop);
assert.ok(loopStarts >= 16);
await page.getByRole('button', { name: 'Stop' }).click();
report.findings['F-5-6'] = { status: 'pass', measures: [2, 3], oscillatorStarts: loopStarts };

const fileSource = 'X:1\nT:Live File Five\nM:2/4\nL:1/8\nK:D\n| D2 F2 | A4 |';
await page.locator('#open-score-file').setInputFiles({ name: 'live-five.abc', mimeType: 'text/vnd.abc', buffer: Buffer.from(fileSource) });
await expect(page.locator('#abc-source')).toHaveValue(fileSource);
await expect(page.locator('#paper')).toContainText('Live File Five');
const downloadEvent = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download ABC file' }).click();
const download = await downloadEvent;
const downloadPath = await download.path();
assert.equal(download.suggestedFilename(), 'live-file-five.abc');
assert.equal(await readFile(downloadPath, 'utf8'), fileSource);
report.findings['F-1-15'] = 'pass';

const exits = [
  ['ABC Score Play home', '.site-header', /\/$/],
  ['Editor', '.site-header', /\/#workbench$/],
  ['Privacy', '.site-header', /\/privacy$/],
  ['Terms', 'footer', /\/terms$/]
];
for (const [name, scope, url] of exits) {
  await page.goto(base + '/?demo=1');
  await page.locator('#abc-source').fill(`X:1\nT:EXIT ${name}\nM:4/4\nL:1/4\nK:C\n| G A B c |`);
  await page.locator(scope).getByRole('link', { name }).click();
  await expect(page).toHaveURL(url);
  const storage = await page.evaluate(() => ({ real: localStorage.getItem('abc-score-play:score'), demo: localStorage.getItem('demo:abc-score-play:score') }));
  assert.deepEqual(storage, { real: realScore, demo: null });
  await page.goto(base + '/?demo=1');
  await expect(page.locator('#abc-source')).toHaveValue(sample);
}
report.findings['F-5-1'] = 'pass';

await page.getByRole('button', { name: 'Start for real' }).click();
await expect(page).toHaveURL(/\/#workbench$/);
await expect(page.locator('#workbench-title')).toBeFocused();
await expect(page.locator('#workbench-title')).toBeInViewport();
await expect(page.locator('#abc-source')).toHaveValue(realScore);
report.findings['F-1-2'] = 'pass';

await page.locator('#abc-source').fill('X:1\nT:MY DRAFT\nM:4/4\nL:1/4\nK:C\n| C D E F |');
await page.getByRole('button', { name: 'Load sample score' }).click();
await expect(page.locator('#abc-source')).toHaveValue(sample);
await expect(page.locator('#bar-count')).toHaveText('8 bars');
assert.equal(await page.evaluate(() => localStorage.getItem('abc-score-play:score')), sample);
report.findings['F-5-2'] = 'pass';

await page.evaluate(() => localStorage.setItem('demo:abc-score-play:score', 'DEMO PRESERVE'));
await page.getByRole('button', { name: 'Clear editor' }).click();
assert.deepEqual(await page.evaluate(() => ({ real: localStorage.getItem('abc-score-play:score'), demo: localStorage.getItem('demo:abc-score-play:score') })), { real: null, demo: 'DEMO PRESERVE' });
await page.evaluate((value) => localStorage.setItem('abc-score-play:score', value), realScore);
await page.goto(base + '/demo');
await expect(page.locator('#abc-source')).toHaveValue('DEMO PRESERVE');
await page.getByRole('button', { name: 'Clear editor' }).click();
assert.deepEqual(await page.evaluate(() => ({ real: localStorage.getItem('abc-score-play:score'), demo: localStorage.getItem('demo:abc-score-play:score') })), { real: realScore, demo: null });
report.findings['F-5-3'] = 'pass';

report.findings['F-5-7'] = 'pass';
report.privacy = {
  crossOrigin: requests.filter((item) => new URL(item.url).origin !== base),
  requestBodies: requests.filter((item) => item.hasBody),
  consoleErrors: errors
};
assert.deepEqual(report.privacy, { crossOrigin: [], requestBodies: [], consoleErrors: [] });
await context.close();

const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const offlinePage = await offlineContext.newPage();
await offlinePage.goto(base + '/demo');
await offlinePage.locator('#paper svg').waitFor();
await offlinePage.evaluate(() => navigator.serviceWorker.ready);
await offlinePage.reload();
await offlinePage.locator('#paper svg').waitFor();
await offlineContext.setOffline(true);
await offlinePage.reload();
await offlinePage.locator('#paper svg').waitFor();
report.offline = {
  title: await offlinePage.title(),
  bars: await offlinePage.locator('#bar-count').textContent(),
  serviceWorker: await offlinePage.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null)
};
assert.deepEqual(report.offline, { title: 'Demo — ABC Score Play', bars: '8 bars', serviceWorker: `${base}/sw.js` });
await offlineContext.close();

await writeFile('.factory/evidence/polish-5/live-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
await api.dispose();
