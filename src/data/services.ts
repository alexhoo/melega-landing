export type Audience = 'empresa' | 'hogar';

export type ServiceIcon =
  | 'zap'
  | 'circuit'
  | 'ship'
  | 'cpu'
  | 'wrench'
  | 'lamp'
  | 'file'
  | 'sun'
  | 'droplet'
  | 'plug'
  | 'snowflake'
  | 'cctv'
  | 'flame';

export interface Service {
  title: string;
  description: string;
  icon: ServiceIcon;
}

export interface ServiceGroup {
  label: string;
  items: Service[];
}

export const services: Record<Audience, ServiceGroup> = {
  empresa: {
    label: 'Empresa e industria',
    items: [
      { icon: 'zap', title: 'Media y baja tensión', description: 'Centros de transformación, líneas y distribución en baja tensión para plantas e instalaciones industriales.' },
      { icon: 'circuit', title: 'Cuadros eléctricos', description: 'Fabricamos en taller propio cuadros de potencia, distribución, mando y control con marcado CE.' },
      { icon: 'ship', title: 'Naval y offshore', description: 'Instalación y reparación eléctrica en buques y plataformas, en astillero y a bordo.' },
      { icon: 'cpu', title: 'Automatización', description: 'Diseño, programación y puesta en marcha de autómatas, SCADA y automatización de edificios.' },
      { icon: 'wrench', title: 'Mantenimiento', description: 'Mantenimiento preventivo y correctivo, y atención rápida de averías.' },
      { icon: 'lamp', title: 'Alumbrado público', description: 'Instalaciones de alumbrado exterior, con y sin telegestión.' },
      { icon: 'file', title: 'Proyectos y legalizaciones', description: 'Ejecución de proyectos y legalización de instalaciones industriales y comerciales.' },
    ],
  },
  hogar: {
    label: 'Hogar y comercio',
    items: [
      { icon: 'sun', title: 'Instalaciones fotovoltaicas', description: 'Paneles solares para autoconsumo en viviendas, comercios y naves.' },
      { icon: 'droplet', title: 'Agua caliente solar', description: 'Instalaciones solares térmicas para agua caliente sanitaria (ACS).' },
      { icon: 'plug', title: 'Reformas eléctricas', description: 'Instalaciones nuevas y reformas completas, con boletín y legalización.' },
      { icon: 'snowflake', title: 'Climatización', description: 'Instalación de equipos de aire acondicionado y bomba de calor.' },
      { icon: 'wrench', title: 'Averías y mantenimiento', description: 'Localizamos y reparamos averías, y revisamos tu instalación.' },
      { icon: 'cctv', title: 'Telecomunicaciones y seguridad', description: 'Redes, cámaras de videovigilancia y control de accesos.' },
      { icon: 'flame', title: 'Protección contra incendios', description: 'Instalación y mantenimiento de sistemas de detección y alarma.' },
    ],
  },
};
