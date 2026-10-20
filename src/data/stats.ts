export interface Stat {
  value: string;
  label: string;
  /** Numeric part that counts up on scroll; `value` stays the server-rendered final text. */
  count?: { to: number; prefix?: string; suffix?: string };
}

export const stats: Stat[] = [
  { value: '2007', label: 'año de fundación' },
  { value: '+30', count: { to: 30, prefix: '+' }, label: 'años de experiencia del equipo' },
  { value: '1.075 m²', count: { to: 1075, suffix: ' m²' }, label: 'de taller, oficinas y almacén' },
  // Plantilla pendiente de confirmar: el dossier se contradice (60 frente a 114).
  { value: '—', label: 'profesionales (pendiente de confirmar)' },
];
