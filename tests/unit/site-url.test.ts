import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from '../../src/lib/site-url';

describe('resolveSiteUrl', () => {
  it('prefers an explicit SITE_URL', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://melega.es', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' })).toBe('https://melega.es');
  });

  it("falls back to Vercel's production URL", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'melega-landing.vercel.app' })).toBe('https://melega-landing.vercel.app');
  });

  it('uses localhost when nothing is set', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:4321');
  });
});
