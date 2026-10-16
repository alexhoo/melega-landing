import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

const PRIMARY = 'tel:+34956547899';
const SECONDARY = 'tel:+34661606065';

describe('page sections', () => {
  const page = loadPage();

  it('section order matches spec', () => {
    const ids = page.querySelectorAll('main > section').map((s) => s.id);
    expect(ids).toEqual(['inicio', 'clientes', 'servicios', 'empresa', 'proyectos', 'garantias', 'contacto', 'llamar']);
  });

  it('clients are text, not logos', () => {
    const clientes = page.querySelector('#clientes')!;
    expect(clientes.text).toContain('Navantia');
    expect(clientes.querySelectorAll('img')).toHaveLength(0);
  });

  it('no staff count published', () => {
    expect(page.querySelector('#empresa')!.text).not.toMatch(/\b(60|100|114)\b/);
  });

  it('experience copy', () => {
    expect(page.querySelector('#empresa')!.text).toContain('años de experiencia del equipo');
  });

  it('four projects', () => {
    expect(page.querySelectorAll('#proyectos article')).toHaveLength(4);
  });

  it('ohsas flagged', () => {
    const items = page.querySelectorAll('#garantias [data-pending]');
    expect(items.some((i) => i.text.includes('OHSAS 18001'))).toBe(true);
  });

  it('location has both phones and no google iframe', () => {
    expect(page.querySelector(`#contacto a[href="${PRIMARY}"]`)).not.toBeNull();
    expect(page.querySelector(`#contacto a[href="${SECONDARY}"]`)).not.toBeNull();
    expect(page.querySelectorAll('iframe')).toHaveLength(0);
  });

  it('final cta calls primary', () => {
    expect(page.querySelector(`#llamar a[data-call="final"][href="${PRIMARY}"]`)).not.toBeNull();
  });

  it('every img has alt', () => {
    for (const img of page.querySelectorAll('img')) {
      expect(img.hasAttribute('alt')).toBe(true);
    }
  });

  it('no org-chart names', () => {
    expect(page.text).not.toContain('[nombre del organigrama]');
    expect(page.text).not.toContain('[nombre del organigrama]');
  });

  it('footer links to legal pages', () => {
    expect(page.querySelector('footer a[href="/aviso-legal"]')).not.toBeNull();
    expect(page.querySelector('footer a[href="/privacidad"]')).not.toBeNull();
  });
});
