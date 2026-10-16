import { describe, expect, it } from 'vitest';
import { toTelHref } from '../../src/lib/phone';

describe('toTelHref', () => {
  it('formats the landline as E.164', () => {
    expect(toTelHref('956 547 899')).toBe('tel:+34956547899');
  });

  it('formats the mobile as E.164', () => {
    expect(toTelHref('661 606 065')).toBe('tel:+34661606065');
  });
});
