export type TrackFn = (name: string, props: Record<string, string>) => void;

/** Sends a `llamada` event with the link's `data-call` location for every click on a `tel:` link. */
export function installCallTracking(root: Document, track: TrackFn): void {
  root.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href^="tel:"]');
    if (!link) return;
    track('llamada', { ubicacion: link.getAttribute('data-call') ?? 'desconocida' });
  });
}
