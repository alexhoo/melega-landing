import { describe, expect, it } from 'vitest';
import { loadPage } from './html';

describe('services section', () => {
  it('both groups are server-rendered', () => {
    const section = loadPage().querySelector('#servicios');
    expect(section).not.toBeNull();
    const text = section!.text;
    expect(text).toContain('Media y baja tensión');
    expect(text).toContain('Instalaciones fotovoltaicas');
    const panels = section!.querySelectorAll('[role="tabpanel"]');
    expect(panels).toHaveLength(2);
    expect(panels.filter((p) => p.hasAttribute('hidden'))).toHaveLength(1);
  });
});
