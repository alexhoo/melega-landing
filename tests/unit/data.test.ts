import { describe, expect, it } from 'vitest';
import { services } from '../../src/data/services';
import { projects } from '../../src/data/projects';
import { stats } from '../../src/data/stats';
import { credentials } from '../../src/data/credentials';
import { clients } from '../../src/data/clients';
import { containsHashedName } from '../forbidden-names';

describe('content data', () => {
  it('has at least six services per audience', () => {
    expect(services.empresa.items.length).toBeGreaterThanOrEqual(6);
    expect(services.hogar.items.length).toBeGreaterThanOrEqual(6);
    expect(services.empresa.label).toBe('Empresa e industria');
    expect(services.hogar.label).toBe('Hogar y comercio');
  });

  it('features exactly four projects', () => {
    expect(projects).toHaveLength(4);
  });

  it('does not publish an unconfirmed staff count', () => {
    const text = JSON.stringify(stats);
    expect(text).not.toMatch(/\b(60|100|114)\b/);
  });

  it('words the experience as team experience', () => {
    expect(stats.map((s) => s.label)).toContain('años de experiencia del equipo');
  });

  it('flags OHSAS 18001 as pending confirmation', () => {
    const ohsas = credentials.find((c) => c.name.includes('OHSAS'));
    expect(ohsas?.pendingConfirmation).toBe(true);
  });

  it('never includes org-chart names', () => {
    const all = JSON.stringify({ services, projects, stats, credentials, clients });
    expect(containsHashedName(all)).toBe(false);
  });
});
