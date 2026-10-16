/** Turns a Spanish phone number as displayed ("956 547 899") into an E.164 `tel:` link. */
export function toTelHref(display: string): string {
  return `tel:+34${display.replace(/\D/g, '')}`;
}
