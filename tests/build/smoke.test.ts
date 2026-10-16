import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

describe('build smoke', () => {
  it('builds index with lang es and one h1', () => {
    const page = loadPage();
    expect(page.querySelector('html')?.getAttribute('lang')).toBe('es');
    expect(page.querySelectorAll('h1')).toHaveLength(1);
  });
});
