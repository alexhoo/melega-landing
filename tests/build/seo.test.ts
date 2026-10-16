import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

const PAGES = ['index.html', 'aviso-legal/index.html', 'privacidad/index.html'];

describe('SEO and preview indexing (built without PUBLIC_INDEXABLE)', () => {
  it('preview is noindex', () => {
    for (const path of PAGES) {
      const robots = loadPage(path).querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content'), path).toBe('noindex, nofollow');
    }
  });

  it('robots.txt blocks crawling', () => {
    expect(readFileSync('dist/robots.txt', 'utf8')).toContain('Disallow: /');
  });

  it('vercel header', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const rule = config.headers.find((h: { source: string }) => h.source === '/(.*)');
    expect(rule.headers).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex' });
  });

  it('local business json-ld', () => {
    const script = loadPage().querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.text);
    expect(data['@type']).toBe('Electrician');
    expect(data.telephone).toBe('+34956547899');
    expect(data.address.addressLocality).toBe('El Puerto de Santa María');
  });

  it('title and description', () => {
    const page = loadPage();
    expect(page.querySelector('title')!.text).toContain('Melega');
    expect(page.querySelector('meta[name="description"]')!.getAttribute('content')!.length).toBeGreaterThanOrEqual(70);
  });

  it('all call links use E.164', () => {
    for (const path of PAGES) {
      for (const a of loadPage(path).querySelectorAll('a[href^="tel:"]')) {
        expect(a.getAttribute('href')).toMatch(/^tel:\+34\d{9}$/);
      }
    }
  });

  it('legal pages are placeholders', () => {
    for (const path of PAGES.slice(1)) {
      expect(loadPage(path).querySelector('[data-placeholder]'), path).not.toBeNull();
    }
  });
});
