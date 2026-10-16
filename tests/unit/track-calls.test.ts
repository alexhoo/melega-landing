// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { installCallTracking } from '../../src/lib/track-calls';

function setup(html: string) {
  document.body.innerHTML = html;
  const track = vi.fn();
  installCallTracking(document, track);
  return track;
}

describe('installCallTracking', () => {
  it('tracks tel clicks with location', () => {
    const track = setup('<a href="tel:+34956547899" data-call="hero"><span>Llámanos</span></a>');
    document.querySelector('span')!.click();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('llamada', { ubicacion: 'hero' });
  });

  it('ignores non-tel links', () => {
    const track = setup('<a href="#servicios">Servicios</a>');
    document.querySelector('a')!.click();
    expect(track).not.toHaveBeenCalled();
  });
});
