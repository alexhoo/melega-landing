import type { animate as Animate } from 'motion';

const EASE_OUT = [0.2, 0, 0, 1] as const;
const grouped = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });

function format(el: HTMLElement, value: number): string {
  return `${el.dataset.countPrefix ?? ''}${grouped.format(Math.round(value))}${el.dataset.countSuffix ?? ''}`;
}

/** Resets a `[data-count-to]` element to zero; the server-rendered text is its final value. */
export function prepareCount(el: HTMLElement): void {
  el.dataset.countFinal = el.textContent ?? '';
  el.textContent = format(el, 0);
}

/** Counts a prepared element up to `data-count-to`, then restores its exact server-rendered text. */
export function runCount(el: HTMLElement, animate: typeof Animate, delay = 0): void {
  const target = Number(el.dataset.countTo);
  const restore = () => {
    el.textContent = el.dataset.countFinal ?? String(target);
  };
  animate(0, target, {
    duration: 1.2,
    delay,
    ease: EASE_OUT,
    onUpdate: (value) => {
      el.textContent = format(el, value);
    },
    onComplete: restore,
  });
}
