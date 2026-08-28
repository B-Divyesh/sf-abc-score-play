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
    expect(page).toContain('This bar is not in the score');
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
});
