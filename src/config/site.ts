import { toTelHref } from '../lib/phone';

export interface Phone {
  display: string;
  href: string;
}

function phone(display: string): Phone {
  return { display, href: toTelHref(display) };
}

/** Only the exact string "true" makes the site indexable; anything else keeps the preview private. */
export function isIndexable(value: string | undefined): boolean {
  return value === 'true';
}

const address = {
  street: 'C/ Doctor González de la Cotera, 10–12',
  area: 'Polígono Industrial Las Salinas de Levante',
  city: 'El Puerto de Santa María',
  region: 'Cádiz',
  // TODO confirmar con el cliente: el dossier no incluye el código postal.
  postalCode: '11500',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Calle+Doctor+Gonz%C3%A1lez+de+la+Cotera+10+El+Puerto+de+Santa+Mar%C3%ADa',
};

export const SITE = {
  name: 'Melega',
  legalName: 'Melega, S.L.',
  tagline: 'Montajes Eléctricos Gaditanos',
  // Single source of truth: `site` in astro.config.mjs.
  url: import.meta.env.SITE,
  phones: {
    primary: phone('956 547 899'),
    secondary: phone('661 606 065'),
  },
  address,
  indexable: isIndexable(import.meta.env.PUBLIC_INDEXABLE),
} as const;
