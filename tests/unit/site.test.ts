import { describe, expect, it } from 'vitest';
import { SITE, isIndexable } from '../../src/config/site';

describe('isIndexable', () => {
  it('defaults to noindex when unset', () => {
    expect(isIndexable(undefined)).toBe(false);
  });

  it('only accepts the exact string "true"', () => {
    expect(isIndexable('false')).toBe(false);
    expect(isIndexable('TRUE')).toBe(false);
    expect(isIndexable('true')).toBe(true);
  });
});

describe('SITE', () => {
  it('uses the landline as primary phone', () => {
    expect(SITE.phones.primary.href).toBe('tel:+34956547899');
    expect(SITE.phones.secondary.href).toBe('tel:+34661606065');
  });
});
