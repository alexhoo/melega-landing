# Landing page de Melega: diseño

Fecha: 2026-10-16
Fuentes (copiadas al repo): `docs/source/LOGO.pdf` (logo nuevo) y `docs/source/CURRICULUM MELEGA S.L..pdf` (dossier de empresa). El dossier es antiguo: su mapa es de 2015 y cita OHSAS 18001, norma retirada en 2021. Hay que tratar sus datos como algo que el cliente debe confirmar (ver §9).

## 1. Intención y por qué

Melega S.L. (Montajes Eléctricos Gaditanos) es una empresa de instalaciones eléctricas fundada en 2007 en El Puerto de Santa María (Cádiz). Su web actual "es horrible" y se va a sustituir por una landing page de una sola página, desplegada en Vercel y servida después desde el dominio actual del cliente.

**El objetivo de la página es que el visitante llame por teléfono.** Todo el contenido sirve para generar confianza ("estos saben lo que hacen") y llevar a esa acción.

**Público, a partes iguales:**
- Empresas e industria (astilleros, depuradoras, naves industriales, constructoras), que buscan solvencia técnica.
- Comercios y particulares (fotovoltaica, reformas eléctricas, climatización, averías), que buscan cercanía y confianza.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Que el teléfono se vea desde el primer momento y se pueda llamar con un toque en móvil.
- Que los dos públicos encuentren "sus" servicios sin leer una lista técnica.
- Que transmita la solvencia real de la empresa: clientes de primer nivel, certificaciones ISO, autorizaciones, más de 30 años de oficio.
- Que cargue rápido y posicione en búsquedas locales (p. ej., "electricista El Puerto de Santa María", "instalaciones eléctricas Cádiz").

**No-objetivos (por ahora)**
- WhatsApp: pendiente de que el cliente confirme si lo atiende. Dejarlo fácil de añadir más adelante.
- Formulario de contacto, blog, multi-idioma, CMS, área de clientes.
- Fotos reales: aún no las hay. Se usan imágenes de recurso o placeholders.

**Anti-objetivos (fracaso aunque "funcione")**
- Que parezca una plantilla genérica de electricista.
- Que el teléfono quede escondido o compita con otras acciones.
- Publicar datos dudosos como si fueran ciertos (ver §6, plantilla).
- Copiar sin más la estructura del dossier (listas de 17 actividades y 40 clientes, organigrama).

## 3. Restricciones técnicas (decididas por el usuario)

- **Astro, última versión** (7.4.0 a fecha de hoy) como framework.
- **React** mediante `@astrojs/react`, solo para las piezas interactivas (islas).
- **Tailwind CSS, última versión** (4.3.x) mediante `@tailwindcss/vite`. Tokens de marca en `@theme` dentro del CSS, sin `tailwind.config.js`.
- **Despliegue en Vercel**. Después se conecta el dominio del cliente, que lo facilitará más adelante.
- **Node:** Astro 7.4 requiere Node ≥ 22.22.0. La máquina local tiene Node 20.17.0, así que hay que actualizar Node antes de crear el proyecto (y fijar la versión en Vercel/`engines`).
- Pulido visual con la skill `better-ui` (instalada en `.claude/skills/better-ui`): radios concéntricos, presión a escala 0.96, transiciones con propiedades nombradas, movimiento solo con `prefers-reduced-motion: no-preference`, hover solo en dispositivos con hover.

## 4. Dirección visual (decidida por el usuario: opción A, "industrial y con energía")

- **Portada oscura y potente:** fondo verde muy oscuro (≈ `#0c2a1a`) y titulares grandes en cursiva pesada que recuerdan la cursiva del logotipo.
- **Colores de marca, sacados del logo:** verde claro ≈ `#52AE32` (la "chispa": botones y acentos), verde oscuro ≈ `#116B39` y negro del logotipo ≈ `#231F20`. Se pueden afinar si se extrae el vector original del PDF.
- **Ritmo:** el usuario dudó entre la opción A y la B (clara y cercana). *Decisión mía:* combinar bloques oscuros con bloques claros más abajo, para dar respiro y cercanía al público particular sin perder la fuerza de la portada.
- **Logo:** usar el logo nuevo de `LOGO.pdf` (rayo partido en verde claro y oscuro + "melega" en cursiva). El logo antiguo que aparece en el dossier queda descartado. *Decisión mía:* extraer el vector del PDF a SVG y, sobre fondo oscuro, usar una versión con el logotipo en blanco y el tramo inferior del rayo aclarado para que se lea bien.
- **Tipografía:** *queda a criterio del constructor.* En las maquetas se usó Archivo (eje de anchura + cursiva) para los titulares, y encajó.

Referencia de maqueta aprobada: `.superpowers/brainstorm/*/content/direccion-visual.html` (opción A) y `estructura.html`.

## 5. Estructura de la página (aprobada)

Una sola página, en este orden:

1. **Cabecera + portada (oscura).** Logo, navegación con anclas (Servicios · Proyectos · Empresa · Contacto) y teléfono siempre visible arriba a la derecha. Titular potente (en la maqueta, "Energía que mueve la Bahía de Cádiz"; el texto final queda a criterio del constructor), subtítulo que nombra a los dos públicos ("industria, comercios y hogares"), botón principal "Llámanos" y una imagen.
2. **Franja "Confían en nosotros".** Nombres o logos de clientes destacados: Navantia, Airbus, Dragados Offshore, IKEA, Mercadona, Universidad de Cádiz, Autoridad Portuaria Bahía de Cádiz, Diputación de Cádiz, Base Naval de Rota, FCC, OHL… Usar **nombres en texto** y no logotipos de terceros mientras el cliente no confirme que puede usarlos.
3. **Servicios por tipo de cliente.** Dos pestañas o conmutador: "Empresa e industria" / "Hogar y comercio" (isla React). *Agrupación propuesta (mía):*
   - Empresa e industria: instalaciones de media y baja tensión, centros de transformación; fabricación de cuadros eléctricos (potencia, distribución, mando y control, con marcado CE); naval y offshore (instalación y reparación en buques); automatización industrial y de edificios (autómatas, SCADA); mantenimiento preventivo y correctivo; alumbrado público con y sin telegestión; proyectos y legalizaciones.
   - Hogar y comercio: instalaciones fotovoltaicas y energías renovables; solar térmica (ACS); reformas e instalaciones eléctricas; climatización; averías y mantenimiento; telecomunicaciones, CCTV y control de accesos; detección y alarma contra incendios.
4. **Cifras.** Fundada en 2007 · "más de 30 años de experiencia del equipo" (*redacción mía*: el dossier atribuye esos años a la trayectoria previa de sus fundadores en la Bahía, no a la empresa, que tiene 19 años; ponerlo junto a "2007" sin matizar parecería un error) · plantilla (ver §6) · instalaciones (575 m² de taller y oficinas + 500 m² de almacén).
5. **Proyectos destacados (4).** *Selección mía:* centro de transformación de 2500 kVA en Dragados Offshore; línea de montaje automatizada del Airbus A350 (Puerto Real); cuadros con variadores y autómata para las grúas de Navantia Cádiz; centros de salud de San Fernando y Chipiona (este último para que el particular se reconozca). Imágenes de recurso.
6. **Garantías.** ISO 9001, ISO 14001, OHSAS 18001 (probablemente hoy ISO 45001; pendiente de confirmar, §9); instalador autorizado en BT y MT por la Junta de Andalucía; instalador-mantenedor de detección y alarma contra incendios; instalador de climatización; telecomunicaciones tipo F; entidad colaboradora de la Agencia Andaluza de la Energía.
7. **Dónde estamos.** Polígono Industrial Las Salinas de Levante, C/ Doctor González de la Cotera, 10–12, El Puerto de Santa María (Cádiz). Taller, oficinas y sala de formación. Mapa: *decisión mía*, imagen estática o mapa sin cookies con enlace "Cómo llegar" a Google Maps. Nada de iframe de Google Maps cargado de entrada, porque obligaría a poner un banner de cookies. Ámbito de actuación: toda Andalucía, sobre todo la provincia de Cádiz.
8. **Llamada final** (bloque en verde claro): "¿Hablamos de tu proyecto?" + teléfono.
9. **Pie.** Teléfono fijo y móvil, dirección, razón social, enlaces a aviso legal y privacidad.

**Móvil:** botón "Llamar ahora" fijo en la parte inferior, siempre a un toque (`tel:`).

## 6. Contacto y datos

- **Teléfono principal (todos los botones):** 956 547 899 (fijo) → `tel:+34956547899`.
- **Teléfono secundario:** 661 606 065 (móvil) → `tel:+34661606065`. Aparece en el pie y en "Dónde estamos", no en los botones principales.
- **WhatsApp:** pendiente de confirmar (no-objetivo por ahora).
- **Plantilla: dato contradictorio en el dossier.** Dice "60 personas", pero el desglose suma 114 (5 ingenieros técnicos, 1 maestro industrial, 5 encargados, 3 administrativos, 100 operarios), y además menciona que llegó a tener 100 empleados. **No publicar una cifra concreta hasta que el cliente la confirme.** Mientras tanto, usar una formulación sin número o un placeholder visible y fácil de cambiar.
- **Horario de atención:** desconocido. Si el cliente lo facilita, mostrarlo junto al teléfono.
- No publicar nombres de personas del organigrama.

## 7. Alcance de esta entrega (decidido por el usuario)

El primer despliegue en Vercel es una **vista previa para enseñar al cliente**, no el lanzamiento público:
- Se sirve con `noindex` (meta robots + cabecera `X-Robots-Tag` y `robots.txt` que bloquee el rastreo), de modo que Google no la indexe.
- Se permiten placeholders visibles (plantilla, datos legales, horario) y fotos de recurso.
- El lanzamiento público (dominio del cliente, quitar `noindex`, redirecciones 301, datos de §9 confirmados) es una fase posterior, fuera de este plan. Dejar `noindex` controlado por una única variable o configuración para que pasar a producción sea un cambio de una línea.

## 8. Medición y dominio (decisiones mías)

- **Analítica:** Vercel Analytics (sin cookies) con un evento personalizado en cada clic a `tel:`, para medir el objetivo de la página sin banner de cookies (RGPD/LSSI). Nada de GA4 ni scripts de terceros con cookies.
- **Dominio:** aún desconocido. Astro `site` y las URLs canónicas se configuran con un valor provisional en un único sitio. En el cambio de dominio se revisan las URLs indexadas de la web antigua y se añaden redirecciones 301 en `vercel.json` hacia la nueva página o sus anclas. Ese paso es parte del lanzamiento, no de la construcción.

## 9. Datos pendientes de confirmar por el cliente

- Cifra de plantilla (§6).
- Vigencia de ISO 9001/14001, y si OHSAS 18001 es hoy ISO 45001.
- Vigencia de las autorizaciones de la Junta y del estado de entidad colaboradora de la Agencia Andaluza de la Energía.
- Permiso para nombrar a los clientes (y, si se quieren, sus logotipos).
- Datos legales (razón social completa, CIF, registro) para aviso legal y privacidad.
- Horario de atención y WhatsApp.
- Dominio actual.

## 10. Lo que queda a criterio del constructor

- Redacción final de titulares y textos (en español, tono directo y seguro, sin jerga innecesaria para el particular).
- Elección tipográfica concreta, iconografía (una sola librería) y animaciones, siguiendo `better-ui`.
- Fuente de las imágenes de recurso (o placeholders) y su optimización (`astro:assets`).
- SEO técnico: metadatos, Open Graph, datos estructurados `LocalBusiness`/`Electrician` con dirección y teléfono, sitemap.
- Contenido de aviso legal y privacidad: páginas con placeholder hasta que el cliente facilite los datos legales (CIF, etc.).
- Organización interna del proyecto Astro.
