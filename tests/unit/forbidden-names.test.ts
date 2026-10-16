import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { containsHashedName } from '../forbidden-names';

const hashes = new Set([createHash('sha256').update('pérez gómez').digest('hex'), createHash('sha256').update('fulano').digest('hex')]);

describe('containsHashedName', () => {
  it('matches single- and two-word names case-insensitively', () => {
    expect(containsHashedName('Contacto: Fulano, técnico', hashes)).toBe(true);
    expect(containsHashedName('Gerente: Ana PÉREZ GÓMEZ', hashes)).toBe(true);
  });

  it('ignores text without the names', () => {
    expect(containsHashedName('Instalaciones eléctricas en Cádiz', hashes)).toBe(false);
    expect(containsHashedName('Pérez y Gómez por separado', hashes)).toBe(false);
  });
});
