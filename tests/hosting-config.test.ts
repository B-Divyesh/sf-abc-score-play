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
    expect(config.routes.filter((route) => route.rewrite === '/index.html').map((route) => route.route))
      .toEqual(['/demo', '/privacy', '/terms']);
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });

    const page = readFileSync(resolve(root, 'public/404.html'), 'utf8');
    expect(page).toContain('<html lang="en">');
    expect(page).toContain('<title>Page not found — ABC Score Play</title>');
    expect(page).toContain('<main id="main"');
    expect(page.match(/<h1>/g)).toHaveLength(1);
    expect(page).toContain('This bar is not in the score');
    expect(page).toContain('Skip to page content');
    expect(page).toContain('aria-label="Main navigation"');
  });
});
