import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

describe('review fixes', () => {
  it('favicon is the Melega bolt, not the Astro logo', () => {
    const svg = readFileSync('dist/favicon.svg', 'utf8');
    expect(svg).toContain('#3eae2c');
    expect(svg).not.toContain('M50.4 78.5');
    expect(loadPage().querySelector('link[href="/favicon.ico"]')).toBeNull();
  });

  it('smooth scrolling only without reduced-motion preference', () => {
    const css = readdirSync('dist/_astro')
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(`dist/_astro/${f}`, 'utf8'))
      .join('\n');
    const at = css.indexOf('scroll-behavior:smooth');
    expect(at).toBeGreaterThan(-1);
    const before = css.slice(0, at);
    expect(before.lastIndexOf('prefers-reduced-motion:no-preference')).toBeGreaterThan(before.lastIndexOf('}}'));
  });

  it('noindex header only on vercel.app hosts', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const rule = config.headers.find((h: { headers: { key: string }[] }) => h.headers.some((x) => x.key === 'X-Robots-Tag'));
    expect(rule.has).toEqual([{ type: 'host', value: '(?<sub>.*)\\.vercel\\.app' }]);
  });
});
