// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { installPageMotion, type PageMotionDeps } from '../../src/lib/page-motion';

const HTML = `
  <section id="inicio"><span data-count-to="30">30</span></section>
  <div data-reveal id="above">above</div>
  <div data-reveal id="single">single</div>
  <ul data-reveal-group id="group"><li>a</li><li>b</li><li>c</li></ul>
  <dd data-count-to="1075" data-count-suffix=" m²" id="stat">1.075 m²</dd>
  <span data-pulse-ring data-pulse-from="a" data-pulse-to="b" id="pin"></span>`;

function setup(reduced: boolean) {
  document.body.innerHTML = HTML;
  window.matchMedia = vi.fn((query: string) => ({ matches: query.includes('reduce') && reduced })) as unknown as typeof window.matchMedia;
  // jsdom has no layout: report everything but #above as below the fold.
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return { top: this.id === 'above' ? 0 : 5000 } as DOMRect;
  });
  const entered: Array<() => unknown> = [];
  const animate = vi.fn((..._args: unknown[]) => ({ finished: Promise.resolve(), stop: vi.fn() }));
  const inView = vi.fn((_el: unknown, onEnter: () => unknown) => void entered.push(onEnter));
  installPageMotion(document, { animate, inView } as unknown as PageMotionDeps);
  return { animate, inView, entered };
}

const el = (id: string) => document.getElementById(id)!;

describe('installPageMotion', () => {
  it('hides only below-the-fold elements, so everything stays readable otherwise', () => {
    setup(false);
    expect(el('above').style.opacity).toBe('');
    expect(el('single').style.opacity).toBe('0');
    expect([...el('group').children].map((c) => (c as HTMLElement).style.opacity)).toEqual(['0', '0', '0']);
  });

  it('reveals group children staggered by 100ms with rise and blur', () => {
    const { animate, entered } = setup(false);
    entered.forEach((enter) => enter());
    const calls = animate.mock.calls.filter((c) => (c[0] as Element).parentElement?.id === 'group');
    expect(calls.map((c) => (c[2] as { delay: number }).delay)).toEqual([0, 0.1, 0.2]);
    expect(Object.keys(calls[0][1] as object)).toEqual(['opacity', 'y', 'filter']);
  });

  it('counts the stat up from zero and leaves the hero counter to the hero module', () => {
    setup(false);
    expect(el('stat').textContent).toBe('0 m²');
    expect(document.querySelector('#inicio [data-count-to]')!.textContent).toBe('30');
  });

  it('only fades under prefers-reduced-motion and skips counts and pulses', () => {
    const { animate, entered } = setup(true);
    expect(el('stat').textContent).toBe('1.075 m²');
    entered.forEach((enter) => enter());
    expect(animate.mock.calls.length).toBeGreaterThan(0);
    for (const call of animate.mock.calls) expect(Object.keys(call[1] as object)).toEqual(['opacity']);
    expect(el('pin').style.opacity).toBe('');
  });

  it('stops the pulse when the ring leaves the viewport', () => {
    const { animate, entered } = setup(false);
    const leave = entered[entered.length - 1]() as () => void;
    const loop = animate.mock.results[animate.mock.results.length - 1].value as { stop: ReturnType<typeof vi.fn> };
    leave();
    expect(loop.stop).toHaveBeenCalled();
  });
});
