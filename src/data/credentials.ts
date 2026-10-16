export interface Credential {
  name: string;
  detail: string;
  pendingConfirmation?: boolean;
}

export const credentials: Credential[] = [
  { name: 'ISO 9001', detail: 'Gestión de la calidad' },
  { name: 'ISO 14001', detail: 'Gestión ambiental' },
  { name: 'OHSAS 18001', detail: 'Seguridad y salud en el trabajo', pendingConfirmation: true },
  { name: 'Instalador autorizado BT y MT', detail: 'Junta de Andalucía' },
  { name: 'Detección y alarma contra incendios', detail: 'Instalador mantenedor' },
  { name: 'Climatización', detail: 'Instalador autorizado' },
  { name: 'Telecomunicaciones tipo F', detail: 'Instalador autorizado' },
  { name: 'Entidad colaboradora', detail: 'Agencia Andaluza de la Energía' },
];
