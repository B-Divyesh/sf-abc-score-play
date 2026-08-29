import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as {
  navigationFallback?: unknown;
  routes: Array<{ route: string; rewrite?: string }>;
  responseOverrides: Record<string, { rewrite?: string; statusCode?: number }>;
};

describe('Azure Static Web Apps routing contract', () => {
  it('keeps the known SPA routes while returning a real styled 404 for unknown paths', () => {
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes.slice(0, 3)).toEqual([
      { route: '/demo', rewrite: '/demo.html' },
      { route: '/privacy', rewrite: '/privacy.html' },
      { route: '/terms', rewrite: '/terms.html' }
    ]);
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });

    const page = readFileSync(resolve(root, 'public/404.html'), 'utf8');
    expect(page).toContain('<html lang="en">');
    expect(page).toContain('<title>Page not found — ABC Score Play</title>');
    expect(page).toContain('rel="canonical"');
    expect(page).toContain('property="og:title"');
    expect(page).toContain('name="twitter:title"');
    expect(page).toContain('rel="apple-touch-icon"');
    expect(page).toContain('<main id="main"');
    expect(page.match(/<h1>/g)).toHaveLength(1);
    expect(page).toContain('<h1>Page not found</h1>');
    expect(page).toContain('This address does not lead to a page in ABC Score Play.');
    expect(page).not.toContain('This bar is not in the score');
    expect(page).toContain('Skip to page content');
    expect(page).toContain('aria-label="Main navigation"');
    expect(page).toContain('Built by Param Factory · v1.0.0 · Original generated artwork');
  });

  it('ships route-specific raw metadata documents', () => {
    for (const [file, title, canonical] of [
      ['demo.html', 'Demo — ABC Score Play', '/demo'],
      ['privacy.html', 'Privacy — ABC Score Play', '/privacy'],
      ['terms.html', 'Terms — ABC Score Play', '/terms']
    ]) {
      const page = readFileSync(resolve(root, file), 'utf8');
      expect(page).toContain(`<title>${title}</title>`);
      expect(page).toContain(`content="${title}"`);
      expect(page).toContain(`href="https://abc-score-play.sociobot.in${canonical}"`);
      expect(page).toContain(`content="https://abc-score-play.sociobot.in${canonical}"`);
    }
  });

  it('pins the complete install used by the documented clean setup', () => {
    const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      engines: Record<string, string>;
    };
    const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')) as {
      lockfileVersion: number;
      packages: Record<string, {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        engines?: Record<string, string>;
      }>;
    };
    const readme = readFileSync(resolve(root, 'README.md'), 'utf8');

    expect(lock.lockfileVersion).toBe(3);
    expect(lock.packages[''].dependencies).toEqual(manifest.dependencies);
    expect(lock.packages[''].devDependencies).toEqual(manifest.devDependencies);
    expect(lock.packages[''].engines).toEqual(manifest.engines);
    expect(readme).toContain('npm ci');
  });

  it('maps every registered public claim to exactly one browser test', () => {
    const claims = JSON.parse(readFileSync(resolve(root, '.factory/claims.json'), 'utf8')) as Array<{
      id: string;
      test: string;
    }>;
    const browserTests = readFileSync(resolve(root, 'tests/e2e/claims.spec.ts'), 'utf8');
    const registered = claims.map((claim) => claim.id).sort();
    const implemented = [...browserTests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]).sort();

    expect(new Set(registered).size).toBe(registered.length);
    expect(implemented).toEqual(registered);
    for (const claim of claims) expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
  });
});
