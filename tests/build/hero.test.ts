import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

const PRIMARY = 'tel:+34956547899';

describe('header and hero', () => {
  const page = loadPage();

  it('header shows primary phone link', () => {
    expect(page.querySelector(`header a[href="${PRIMARY}"]`)).not.toBeNull();
  });

  it('hero has h1 and primary call CTA', () => {
    expect(page.querySelector('#inicio h1')).not.toBeNull();
    expect(page.querySelector(`#inicio a[data-call="hero"][href="${PRIMARY}"]`)).not.toBeNull();
  });

  it('nav anchors point to sections', () => {
    const hrefs = page.querySelectorAll('header nav a').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#servicios', '#proyectos', '#empresa', '#contacto']);
  });

  it('mobile call bar present', () => {
    const link = page.querySelector(`a[data-call="mobile-bar"][href="${PRIMARY}"]`);
    expect(link).not.toBeNull();
    expect(link!.closest('[data-mobile-call-bar]')?.classList.contains('md:hidden')).toBe(true);
  });

  it('logo has accessible name', () => {
    const logo = page.querySelector('header [aria-label="Melega"], header img[alt="Melega"]');
    expect(logo).not.toBeNull();
  });
});
