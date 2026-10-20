// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { installHeroMotion, type MotionDeps } from '../../src/lib/hero-motion';

const HTML = `
  <section id="inicio">
    <div data-hero-copy></div>
    <div data-hero-glow-drift><div data-hero-glow></div></div>
    <a data-call="hero" href="tel:+34956547899">Llamar</a>
    <div data-hero-media><img alt="" /></div>
    <span data-count-to="30">30</span>
  </section>`;

function setup(reduced: boolean, hover = false) {
  document.body.innerHTML = HTML;
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes('reduce') ? reduced : query.includes('hover') ? hover : false,
  })) as unknown as typeof window.matchMedia;
  const animate = vi.fn((..._args: unknown[]) => ({}));
  const scroll = vi.fn();
  installHeroMotion(document, { animate, scroll } as unknown as MotionDeps);
  return { animate, scroll };
}

describe('installHeroMotion', () => {
  it('does nothing under prefers-reduced-motion and keeps the final number', () => {
    const { animate, scroll } = setup(true);
    expect(animate).not.toHaveBeenCalled();
    expect(scroll).not.toHaveBeenCalled();
    expect(document.querySelector('[data-count-to]')!.textContent).toBe('30');
  });

  it('animates photo, parallax, glow and count-up otherwise', () => {
    const { animate, scroll } = setup(false);
    const targets = animate.mock.calls.map((call) => call[0]);
    expect(targets).toContain(document.querySelector('img'));
    expect(targets).toContain(document.querySelector('[data-hero-media]'));
    expect(targets).toContain(document.querySelector('[data-hero-glow]'));
    expect(targets).toContain(document.querySelector('[data-hero-copy]'));
    expect(targets).toContain(document.querySelector('a[data-call="hero"]'));
    expect(targets).toContain(0);
    expect(scroll).toHaveBeenCalledTimes(2);
  });

  it('never fades the LCP photo', () => {
    const { animate } = setup(false);
    const photoCall = animate.mock.calls.find((call) => call[0] === document.querySelector('img'))!;
    expect(Object.keys(photoCall[1] as object)).toEqual(['scale']);
  });

  it('drifts photo and glow with a mouse, only on hover-capable devices', async () => {
    const move = () => {
      const event = new Event('pointermove') as Event & Record<string, unknown>;
      Object.assign(event, { pointerType: 'mouse', clientX: 0, clientY: 0 });
      document.querySelector('#inicio')!.dispatchEvent(event);
    };

    const touch = setup(false, false);
    await Promise.resolve();
    move();
    expect(touch.animate.mock.calls.some((c) => typeof c[1] === 'object' && 'x' in (c[1] as object))).toBe(false);

    const mouse = setup(false, true);
    await Promise.resolve();
    await Promise.resolve();
    move();
    const drifted = mouse.animate.mock.calls.filter((c) => typeof c[1] === 'object' && 'x' in (c[1] as object)).map((c) => c[0]);
    expect(drifted).toEqual([document.querySelector('img'), document.querySelector('[data-hero-glow-drift]')]);
  });
});
