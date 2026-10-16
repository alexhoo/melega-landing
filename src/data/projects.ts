import type { ImageMetadata } from 'astro';
import centroTransformacion from '../assets/stock/proyecto-centro-transformacion.jpg';
import automatizacion from '../assets/stock/proyecto-automatizacion.jpg';
import naval from '../assets/stock/proyecto-naval.jpg';
import cuadros from '../assets/stock/proyecto-cuadros.jpg';

export interface Project {
  title: string;
  client: string;
  place: string;
  image: ImageMetadata | null;
  /** Describes the (stock) photo, not the real project. */
  imageAlt: string;
}

export const projects: Project[] = [
  {
    title: 'Centro de transformación de 2500 kVA',
    client: 'Dragados Offshore',
    place: 'Puerto Real',
    image: centroTransformacion,
    imageAlt: 'Torres de alta tensión al atardecer',
  },
  {
    title: 'Línea de montaje automatizada del A350',
    client: 'Airbus',
    place: 'Puerto Real',
    image: automatizacion,
    imageAlt: 'Maquinaria industrial automatizada',
  },
  {
    title: 'Cuadros de control para grúas',
    client: 'Navantia',
    place: 'Cádiz',
    image: naval,
    imageAlt: 'Operario trabajando con chispas en un taller',
  },
  {
    title: 'Instalación de centros de salud',
    client: 'Sanidad pública',
    place: 'San Fernando y Chipiona',
    image: cuadros,
    imageAlt: 'Interior de un cuadro eléctrico con interruptores',
  },
];
