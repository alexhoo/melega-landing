import type { animate as Animate, inView as InView } from 'motion';
import { prepareCount, runCount } from './count-up';

export interface PageMotionDeps {
  animate: typeof Animate;
  inView: typeof InView;
}

// Fire a little before the element is fully inside the viewport.
const MARGIN = '0px 0px -12% 0px';

/**
 * Scroll-triggered motion for the sections below the hero. Nothing is hidden by CSS: elements are
 * only hidden here, and only when they start below the fold, so the page is fully readable without JS.
 *
 * - `[data-reveal]` reveals the element itself.
 * - `[data-reveal-group]` reveals its direct children one after another.
 * - `[data-reveal-zoom]` inside a revealed child settles from a slight zoom.
 * - `[data-count-to]` counts up when scrolled into view.
 * - `[data-pulse-ring]` pulses a ring while it is in view; `[data-ring-once]` pulses it once.
 *
 * Under `prefers-reduced-motion` reveals become a short opacity fade and everything else is skipped.
 */
export function installPageMotion(root: Document, { animate, inView }: PageMotionDeps): void {
  const win = root.defaultView;
  if (!win) return;
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const belowFold = (el: Element) => el.getBoundingClientRect().top > win.innerHeight;

  function reveal(el: HTMLElement, delay: number) {
    const keyframes = reduced
      ? { opacity: [0, 1] }
      : { opacity: [0, 1], y: [12, 0], filter: ['blur(4px)', 'blur(0px)'] };
    animate(el, keyframes, { duration: reduced ? 0.15 : 0.3, delay, ease: 'easeOut' }).finished.then(() => {
      // Motion commits its final styles right after `finished`, so clear them one frame later: a
      // leftover `filter: blur(0px)` would keep every revealed element on its own compositing layer.
      win.requestAnimationFrame(() => {
        for (const property of ['opacity', 'transform', 'filter']) el.style.removeProperty(property);
      });
    });
    const zoom = el.querySelector<HTMLElement>('[data-reveal-zoom]');
    if (zoom && !reduced) animate(zoom, { scale: [1.06, 1] }, { duration: 0.9, delay, ease: [0.2, 0, 0, 1] });
  }

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (!belowFold(el)) return;
    el.style.opacity = '0';
    inView(el, () => reveal(el, 0), { margin: MARGIN });
  });

  root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (!belowFold(group)) return;
    const items = Array.from(group.children) as HTMLElement[];
    // Long lists tighten the step so the last item does not wait for seconds.
    const step = items.length > 6 ? 0.05 : 0.1;
    items.forEach((item) => (item.style.opacity = '0'));
    inView(group, () => items.forEach((item, i) => reveal(item, i * step)), { margin: MARGIN });
  });

  if (reduced) return;

  root.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    // The hero counter is started by the hero module.
    if (el.closest('#inicio') || !belowFold(el)) return;
    prepareCount(el);
    inView(el, () => runCount(el, animate), { margin: MARGIN });
  });

  root.querySelectorAll<HTMLElement>('[data-pulse-ring]').forEach((el) => {
    const [from, to] = [el.dataset.pulseFrom!, el.dataset.pulseTo!];
    inView(el, () => {
      const loop = animate(el, { boxShadow: [from, to] }, { duration: 2.4, ease: 'easeOut', repeat: Infinity });
      return () => loop.stop();
    });
  });

  root.querySelectorAll<HTMLElement>('[data-ring-once]').forEach((el) => {
    const [from, to] = [el.dataset.pulseFrom!, el.dataset.pulseTo!];
    inView(el, () => void animate(el, { boxShadow: [from, to] }, { duration: 1.2, delay: 0.4, ease: 'easeOut' }), {
      margin: MARGIN,
    });
  });
}
