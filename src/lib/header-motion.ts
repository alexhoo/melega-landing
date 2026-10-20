import type { animate as Animate, scroll as Scroll } from 'motion';

const FLAT = '0 0 0 0 rgb(0 0 0 / 0)';
const RAISED = '0 1px 0 rgb(255 255 255 / 0.08), 0 8px 24px rgb(0 0 0 / 0.25)';

/** The sticky header gains a soft shadow once the page has scrolled, so it separates from light sections. */
export function installHeaderElevation(root: Document, { animate, scroll }: { animate: typeof Animate; scroll: typeof Scroll }): void {
  const header = root.querySelector<HTMLElement>('body > header');
  if (!header) return;
  let raised = false;
  scroll((_progress, info) => {
    const next = info.y.current > 8;
    if (next === raised) return;
    raised = next;
    animate(header, { boxShadow: next ? RAISED : FLAT }, { duration: 0.15, ease: 'easeOut' });
  });
}
