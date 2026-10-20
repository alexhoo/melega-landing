import type { animate as Animate, scroll as Scroll } from 'motion';
import { prepareCount, runCount } from './count-up';

export interface MotionDeps {
  animate: typeof Animate;
  scroll: typeof Scroll;
}

const EASE_OUT = [0.2, 0, 0, 1] as const;

/**
 * Progressive enhancement for the hero. The text entrance stays in CSS (`animate-enter`) so the
 * hero renders without JS; this adds the photo settle, scroll parallax, glow and number count-up.
 * Everything is skipped under `prefers-reduced-motion`.
 */
export function installHeroMotion(root: Document, { animate, scroll }: MotionDeps): void {
  if (root.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = root.querySelector<HTMLElement>('#inicio');
  if (!hero) return;

  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  const photo = media?.querySelector<HTMLElement>('img');
  // The photo is the LCP element, so it is never faded: it only settles from a slight zoom.
  // It settles to 1.03, not 1, so the pointer drift below never exposes the edges of the clipped frame.
  const settled = photo ? animate(photo, { scale: [1.08, 1.03] }, { duration: 1.4, ease: EASE_OUT }) : undefined;

  // The photo drifts a little slower than the page while the hero scrolls out of view.
  if (media) {
    scroll(animate(media, { y: [0, 36] }, { ease: 'linear' }), {
      target: hero,
      offset: ['start start', 'end start'],
    });
  }

  // The copy fades back a little as the hero scrolls out, which adds depth against the photo.
  const copy = hero.querySelector<HTMLElement>('[data-hero-copy]');
  if (copy) {
    scroll(animate(copy, { y: [0, -28], opacity: [1, 0.35] }, { ease: 'linear' }), {
      target: hero,
      offset: ['start start', 'end start'],
    });
  }

  const glow = hero.querySelector<HTMLElement>('[data-hero-glow]');
  if (glow) {
    animate(
      glow,
      { opacity: [0.3, 0.55], scale: [1, 1.08] },
      { duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
    );
  }

  // One soft ring on the call button once the entrance has settled, never repeated.
  const cta = hero.querySelector<HTMLElement>('a[data-call="hero"]');
  if (cta) {
    animate(
      cta,
      { boxShadow: ['0 0 0 0 rgb(62 174 44 / 0.55)', '0 0 0 14px rgb(62 174 44 / 0)'] },
      { duration: 1.2, delay: 1.4, ease: 'easeOut' },
    );
  }

  // Pointer drift only on devices that can hover; touch never sees it.
  const drift = hero.querySelector<HTMLElement>('[data-hero-glow-drift]');
  if (root.defaultView?.matchMedia('(hover: hover)').matches && (photo || drift)) {
    const spring = { type: 'spring', stiffness: 90, damping: 22 } as const;
    // Wait for the settle so the two animations never fight over the same transform.
    Promise.resolve(settled?.finished).then(() => {
      hero.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const box = hero.getBoundingClientRect();
        const nx = ((event.clientX - box.left) / box.width - 0.5) * 2;
        const ny = ((event.clientY - box.top) / box.height - 0.5) * 2;
        if (photo) animate(photo, { x: nx * -6, y: ny * -6 }, spring);
        if (drift) animate(drift, { x: nx * 18, y: ny * 18 }, spring);
      });
      hero.addEventListener('pointerleave', () => {
        if (photo) animate(photo, { x: 0, y: 0 }, spring);
        if (drift) animate(drift, { x: 0, y: 0 }, spring);
      });
    });
  }

  hero.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    prepareCount(el);
    runCount(el, animate, 0.45);
  });
}
