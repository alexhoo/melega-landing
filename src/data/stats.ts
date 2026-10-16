export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '2007', label: 'año de fundación' },
  { value: '+30', label: 'años de experiencia del equipo' },
  { value: '1.075 m²', label: 'de taller, oficinas y almacén' },
  // Plantilla pendiente de confirmar: el dossier se contradice (60 frente a 114).
  { value: '—', label: 'profesionales (pendiente de confirmar)' },
];
