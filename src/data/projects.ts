import type { ImageMetadata } from 'astro';

export interface Project {
  title: string;
  client: string;
  place: string;
  image: ImageMetadata | null;
}

export const projects: Project[] = [
  { title: 'Centro de transformación de 2500 kVA', client: 'Dragados Offshore', place: 'Puerto Real', image: null },
  { title: 'Línea de montaje automatizada del A350', client: 'Airbus', place: 'Puerto Real', image: null },
  { title: 'Cuadros de control para grúas', client: 'Navantia', place: 'Cádiz', image: null },
  { title: 'Instalación de centros de salud', client: 'Sanidad pública', place: 'San Fernando y Chipiona', image: null },
];
