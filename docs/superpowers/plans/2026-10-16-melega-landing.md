# Melega Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una landing de una sola página para Melega S.L. cuyo único objetivo es que el visitante llame al 956 547 899. Se despliega en Vercel como vista previa privada (`noindex`) para enseñársela al cliente.

**Architecture:** Sitio estático con Astro. Todo el contenido vive en módulos de datos tipados (`src/data/*`) y en una configuración única (`src/config/site.ts`), y los componentes `.astro` solo pintan. La única isla React es el conmutador de servicios. Los tests son de tres tipos: unitarios (Vitest), de componente (Testing Library + jsdom) y sobre el HTML generado en `dist/`, más un smoke test con Playwright en móvil.

**Tech Stack:** Astro 7.4.x, @astrojs/react 7.1.x + React 19, Tailwind CSS 4.3.x vía @tailwindcss/vite, @fontsource-variable/archivo, @vercel/analytics 2.x, Vitest 5, @testing-library/react, node-html-parser, @playwright/test 1.64.

**Spec:** `docs/superpowers/specs/2026-10-16-melega-landing-design.md`

## Global Constraints

- Node ≥ 22.22.0 (requisito de Astro 7.4). Fijar `"engines": { "node": ">=22.22.0" }` y `.nvmrc` con `22`.
- Todo el texto visible en español.
- Teléfono principal en todos los botones: `956 547 899` → `tel:+34956547899`. Secundario solo en "Dónde estamos" y pie: `661 606 065` → `tel:+34661606065`.
- Colores de marca: verde claro `#52AE32`, verde oscuro `#116B39`, negro del logo `#231F20`, fondo de portada `#0c2a1a`. Afinar los tres primeros con el SVG extraído en la Task 3.
- No publicar cifra de plantilla, nombres del organigrama ni logotipos de clientes (solo nombres en texto).
- OHSAS 18001 se muestra con la marca de pendiente de confirmar. Los años de trayectoria se escriben exactamente así: "más de 30 años de experiencia del equipo".
- Nada que ponga cookies: sin iframe de Google Maps, sin Google Fonts remotas, sin GA. Fuentes autoalojadas con @fontsource.
- Indexación controlada por `PUBLIC_INDEXABLE` (cualquier valor distinto de `"true"` significa `noindex`). Por defecto, `noindex`.
- Pulido según la skill `better-ui` (`.claude/skills/better-ui/SKILL.md`): pulsado `scale: 0.96` en 150ms ease-out sin escalar si está deshabilitado; nunca `transition-all`; movimiento solo bajo `motion-safe:`; hover solo en `@media (hover: hover)` (Tailwind 4 ya lo hace); radio exterior = radio interior + padding.
- Sin WhatsApp, formulario ni CMS (no-objetivos).

## Review Focus

1. **Tocar "Llamar" en móvil:** todos los `tel:` deben ser `tel:+34…` sin espacios, porque si no algunos marcadores fallan. Test en la Task 6 (`all call links use E.164`).
2. **Pantallas de 320–375 px:** sin scroll horizontal, y la barra fija de llamada no debe tapar el final del pie. Test en la Task 8.
3. **JS que no carga o tarda:** los servicios de los dos grupos deben estar en el HTML y accesibles sin hidratar. Test en la Task 4 (`both groups are server-rendered`).
4. **`prefers-reduced-motion: reduce`:** el contenido de la portada debe verse al instante, sin quedarse en opacidad 0. Test en la Task 8.
5. **Fuga de indexación de la preview:** sin `PUBLIC_INDEXABLE=true`, que salga `noindex`, que `robots.txt` bloquee y que esté la cabecera. Tests en las Tasks 2 y 6.

## File Structure

```
.nvmrc · package.json · astro.config.mjs · tsconfig.json · vitest.config.ts · playwright.config.ts · vercel.json
src/config/site.ts            # nombre, teléfonos, dirección, indexable, URL del sitio
src/lib/phone.ts              # toTelHref()
src/data/services.ts          # grupos "empresa" y "hogar"
src/data/clients.ts · projects.ts · credentials.ts · stats.ts
src/styles/global.css         # @import tailwindcss + @theme tokens + fuentes
src/assets/brand/melega-logo.svg · melega-logo-on-dark.svg · melega-bolt.svg
src/layouts/Base.astro        # <head>, Seo, analítica, barra móvil
src/components/Seo.astro · CallLink.astro · Header.astro · Hero.astro · ClientsStrip.astro
src/components/ServiceTabs.tsx · Services.astro · Stats.astro · Projects.astro
src/components/Credentials.astro · Location.astro · FinalCta.astro · Footer.astro · MobileCallBar.astro
src/pages/index.astro · aviso-legal.astro · privacidad.astro · robots.txt.ts
tests/unit/*.test.ts · tests/components/*.test.tsx · tests/build/*.test.ts · tests/e2e/*.spec.ts
```

---

### Task 1: Proyecto base (Node, git, Astro, React, Tailwind, Vitest)

**Files:**
- Create: `.nvmrc`, `.gitignore`, `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `tests/build/smoke.test.ts`, `tests/build/html.ts`

**Interfaces:**
- Produces: `Base.astro` con props `{ title: string; description: string }` y un `<slot />`. Helper `loadPage(path = "index.html"): HTMLElement` en `tests/build/html.ts` (parsea `dist/<path>` con node-html-parser). Scripts npm `dev`, `build`, `test` (vitest run), `test:build` (`astro build && vitest run tests/build`), `test:e2e`.

- [ ] **Step 1: Node y git.** Ejecuta `nvm install 22 && nvm use 22 && node -v`; tiene que salir `v22.22.x` o superior. Después ejecuta `git init` en la raíz del repo. `.gitignore` incluye `node_modules`, `dist`, `.astro`, `.vercel`, `.superpowers/`, `test-results`, `playwright-report`.
- [ ] **Step 2: Andamiaje.** Ejecuta `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict` y después `npx astro add react --yes`. Instala `tailwindcss @tailwindcss/vite @fontsource-variable/archivo` y, en desarrollo, `vitest @testing-library/react @testing-library/user-event jsdom node-html-parser @playwright/test`. Añade `@tailwindcss/vite` a `vite.plugins` en `astro.config.mjs`. Fija `engines.node`.
- [ ] **Step 3: Tokens en `global.css`.** `@import "tailwindcss";`, `@import "@fontsource-variable/archivo/wdth-italic.css";` y la versión no itálica. En `@theme` define `--color-melega-light: #52AE32`, `--color-melega-dark: #116B39`, `--color-melega-ink: #231F20`, `--color-melega-night: #0c2a1a`, `--color-melega-deep: #071c11`, `--color-melega-paper: #f4f6f1` y `--font-display: "Archivo Variable", sans-serif`.
- [ ] **Step 4: Test que falla.** `tests/build/smoke.test.ts` → `it("builds index with lang es and one h1")`: `loadPage()` tiene `html[lang="es"]` y exactamente un `h1`.
- [ ] **Step 5:** Ejecuta `npm run test:build`. Debe FALLAR (la página mínima no tiene `lang="es"` ni `h1`).
- [ ] **Step 6:** `Base.astro` con `<html lang="es">` que importa `global.css`. `index.astro` usa `Base` con un `h1` provisional.
- [ ] **Step 7:** Ejecuta `npm run test:build`. Debe PASAR.
- [ ] **Step 8: Commit.** `git add -A && git commit -m "chore: scaffold Astro + React + Tailwind project"` (incluye `docs/`).

### Task 2: Configuración del sitio, teléfonos y datos de contenido

**Files:**
- Create: `src/config/site.ts`, `src/lib/phone.ts`, `src/data/{services,clients,projects,credentials,stats}.ts`, `tests/unit/phone.test.ts`, `tests/unit/site.test.ts`, `tests/unit/data.test.ts`

**Interfaces:**
- Produces:
  - `toTelHref(display: string): string`. Quita lo que no sean dígitos y antepone `tel:+34`.
  - `SITE: { name: "Melega"; legalName: "Melega, S.L."; tagline: "Montajes Eléctricos Gaditanos"; url: string; phones: { primary: Phone; secondary: Phone }; address: { street: "C/ Doctor González de la Cotera, 10–12"; area: "Polígono Industrial Las Salinas de Levante"; city: "El Puerto de Santa María"; region: "Cádiz"; postalCode: string; mapsUrl: string }; indexable: boolean }`, donde `Phone = { display: string; href: string }`.
  - `isIndexable(value: string | undefined): boolean`, que solo devuelve `true` para `"true"`. `SITE.indexable = isIndexable(import.meta.env.PUBLIC_INDEXABLE)`. `SITE.url` sale de `import.meta.env.SITE_URL` y, si no está, de `"https://melega.vercel.app"`.
  - `services: Record<"empresa" | "hogar", { label: string; items: { title: string; description: string; icon: string }[] }>`. Etiquetas: `"Empresa e industria"` y `"Hogar y comercio"`. Los elementos son los del §5.3 de la spec.
  - `clients: string[]`, con los nombres del §5.2 de la spec.
  - `projects: { title: string; client: string; place: string; image: ImageMetadata | null }[]`: las 4 obras del §5.5. `image` es `null` hasta la Task 5.
  - `credentials: { name: string; detail: string; pendingConfirmation?: boolean }[]`, con las del §5.6. OHSAS 18001 lleva `pendingConfirmation: true`.
  - `stats: { value: string; label: string }[]` = `[{ "2007", "año de fundación" }, { "+30", "años de experiencia del equipo" }, { "1.075 m²", "de taller, oficinas y almacén" }]`, más una entrada de plantilla `{ value: "—", label: "profesionales (pendiente de confirmar)" }`.
  - El código postal no viene en el dossier: usa `"11500"` con un comentario `// TODO confirmar`.

- [ ] **Step 1: Tests que fallan.**
  - `phone.test.ts`: `toTelHref("956 547 899") === "tel:+34956547899"`; `toTelHref("661 606 065") === "tel:+34661606065"`.
  - `site.test.ts`: `isIndexable(undefined) === false`, `isIndexable("false") === false`, `isIndexable("TRUE") === false`, `isIndexable("true") === true`; `SITE.phones.primary.href === "tel:+34956547899"`.
  - `data.test.ts`: los dos grupos de servicios tienen ≥ 6 elementos; `projects.length === 4`; ningún texto de `stats` contiene `"60"` ni `"114"`; el label de los 30 años es exactamente `"años de experiencia del equipo"`; la credencial OHSAS tiene `pendingConfirmation === true`; ningún dato serializado contiene `"[nombre del organigrama]"`, `"[nombre del organigrama]"`, `"[nombre del organigrama]"` ni `"[nombre del organigrama]"`.
- [ ] **Step 2:** Ejecuta `npx vitest run tests/unit`. Debe FALLAR (los módulos no existen).
- [ ] **Step 3:** Implementa los módulos con los valores de arriba. Las descripciones de servicios son una frase corta y directa por servicio, a criterio del implementador.
- [ ] **Step 4:** Ejecuta `npx vitest run tests/unit`. Debe PASAR.
- [ ] **Step 5: Commit.** `feat: add site config, phone helper and content data`.

### Task 3: Logo, CallLink, cabecera, portada y barra de llamada móvil

**Files:**
- Create: `src/assets/brand/*.svg`, `src/components/{CallLink,Header,Hero,MobileCallBar}.astro`, `tests/build/hero.test.ts`
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `SITE`, `toTelHref`.
- Produces: `CallLink.astro` con props `{ phone?: "primary" | "secondary"; location: string; variant?: "solid" | "outline" | "bare"; class?: string }`. Pinta `<a href={SITE.phones[phone].href} data-call={location}>` con el slot o, si no hay slot, el número. Por defecto `phone = "primary"`. Los ids de sección que usan las anclas de la navegación son `servicios`, `proyectos`, `empresa` y `contacto`.

- [ ] **Step 1: Extraer el logo.** Ejecuta `brew install poppler` y luego `pdftocairo -svg docs/source/LOGO.pdf /tmp/melega-logo.svg`. Recorta el `viewBox` al contenido, borra el fondo blanco y deja tres archivos: `melega-logo.svg` (el original), `melega-logo-on-dark.svg` (logotipo en `#ffffff` y tramo inferior del rayo en `#52AE32` con un 70 % de opacidad o en un tono claro equivalente) y `melega-bolt.svg` (solo el rayo). Muestrea los colores reales del SVG y, si difieren, actualiza los tokens de la Task 1.
- [ ] **Step 2: Test que falla.** `hero.test.ts`:
  - `it("header shows primary phone link")`: `header a[href="tel:+34956547899"]` existe.
  - `it("hero has h1 and primary call CTA")`: hay un `#inicio h1` y un `#inicio a[data-call="hero"][href="tel:+34956547899"]`.
  - `it("nav anchors point to sections")`: los `href` de `header nav a` son exactamente `#servicios`, `#proyectos`, `#empresa` y `#contacto`.
  - `it("mobile call bar present")`: hay un `a[data-call="mobile-bar"][href="tel:+34956547899"]` y su contenedor lleva la clase `md:hidden`.
  - `it("logo has alt text")`: el logo de la cabecera tiene `alt="Melega"` o `aria-label="Melega"`.
- [ ] **Step 3:** Ejecuta `npm run test:build`. Debe FALLAR.
- [ ] **Step 4: Implementar** siguiendo la opción A de `.superpowers/brainstorm/*/content/direccion-visual.html`:
  - Portada `#inicio` sobre `bg-melega-night`.
  - Titular en `font-display` cursiva, ancho ~115 % y en mayúsculas, con las palabras clave en `text-melega-light`.
  - Subtítulo que nombre "industria, comercios y hogares".
  - Botón principal sólido "Llámanos · 956 547 899" e imagen de recurso a la derecha (en móvil, debajo).
  - Cabecera fija con fondo translúcido y número visible.
  - `MobileCallBar` fija abajo, solo por debajo de `md`, con texto "Llamar ahora". Añade `pb-20 md:pb-0` al `body` para que no tape el pie.
  - Entrada escalonada de la portada (título → texto → acciones, 100ms, opacidad + 4px de blur + 12px de translateY, 300ms ease-out) solo con `motion-safe:`. El estado oculto va en el `from` de los keyframes con `animation-fill-mode: both`, nunca en la regla base.
- [ ] **Step 5:** Ejecuta `npm run test:build`. Debe PASAR.
- [ ] **Step 6: Commit.** `feat: add logo, header, hero and mobile call bar`.

### Task 4: Isla de servicios (conmutador Empresa / Hogar)

**Files:**
- Create: `src/components/ServiceTabs.tsx`, `src/components/Services.astro`, `tests/components/ServiceTabs.test.tsx`, `tests/build/services.test.ts`
- Modify: `src/pages/index.astro`, `vitest.config.ts` (entorno `jsdom` para `tests/components/**`)

**Interfaces:**
- Consumes: `services` (Task 2).
- Produces: `ServiceTabs({ groups: typeof services; defaultGroup?: "empresa" | "hogar" })`. `Services.astro` lo monta como `<ServiceTabs client:visible groups={services} />` dentro de `<section id="servicios">`.

- [ ] **Step 1: Tests que fallan.**
  - `ServiceTabs.test.tsx`:
    - `it("shows empresa by default")`: el tab "Empresa e industria" tiene `aria-selected="true"` y se ve "Media y baja tensión".
    - `it("switches to hogar on click")`: tras hacer clic en "Hogar y comercio" se ve "Instalaciones fotovoltaicas" y el panel de empresa tiene `hidden`.
    - `it("arrow keys move between tabs")`: con el foco en el primer tab, `{ArrowRight}` selecciona y enfoca "Hogar y comercio".
  - `services.test.ts` (sobre el build): `it("both groups are server-rendered")`. El HTML de `#servicios` contiene un título de cada grupo, de modo que sin JS se puede leer todo. El panel inactivo se pinta con `hidden`, no se omite.
- [ ] **Step 2:** Ejecuta `npx vitest run tests/components` y `npm run test:build`. Deben FALLAR.
- [ ] **Step 3:** Implementa el patrón de pestañas WAI-ARIA (`role="tablist"`, `tab`, `tabpanel`, roving tabindex, flechas Izq/Der, Inicio/Fin). El cambio de pestaña es instantáneo: interacción de alta frecuencia, sin animación según better-ui (como mucho un fundido de `opacity` de 150ms). Las tarjetas van en rejilla de 1/2/3 columnas e iconos de una sola librería (p. ej. `lucide-react`) con `currentColor`.
- [ ] **Step 4:** Ejecuta los mismos comandos. Deben PASAR.
- [ ] **Step 5: Commit.** `feat: add services section with empresa/hogar tabs`.

### Task 5: Resto de secciones (clientes, cifras, proyectos, garantías, ubicación, llamada final, pie)

**Files:**
- Create: `src/components/{ClientsStrip,Stats,Projects,Credentials,Location,FinalCta,Footer}.astro`, `src/assets/stock/*` (4 imágenes de proyecto + portada + mapa estático), `tests/build/sections.test.ts`
- Modify: `src/pages/index.astro`, `src/data/projects.ts` (`image`)

**Interfaces:**
- Consumes: `clients`, `stats`, `projects`, `credentials`, `SITE`, `CallLink`.

- [ ] **Step 1: Imágenes.** Descarga fotos de recurso libres de derechos (Unsplash o Pexels, de temática eléctrica, industrial, naval y solar) a `src/assets/stock/`, cada una en su propia carpeta de descarga. Anota la fuente y el autor en `src/assets/stock/CREDITS.md`. Para el mapa, una captura estática de OpenStreetMap con su atribución. Todas se sirven con `<Image>` de `astro:assets`.
- [ ] **Step 2: Test que falla.** `sections.test.ts`:
  - `it("section order matches spec")`: los ids de `main > section` siguen el orden `inicio, clientes, servicios, empresa, proyectos, garantias, contacto, llamar`. "Empresa" es el bloque de cifras.
  - `it("clients are text, not logos")`: `#clientes` contiene "NAVANTIA" o "Navantia" y no tiene `img`.
  - `it("no staff count published")`: el texto de `#empresa` no casa con `/\b(60|100|114)\b/`.
  - `it("experience copy")`: `#empresa` contiene "años de experiencia del equipo".
  - `it("four projects")`: `#proyectos article` tiene longitud 4.
  - `it("ohsas flagged")`: el elemento de OHSAS en `#garantias` tiene `data-pending`.
  - `it("location has both phones and no google iframe")`: `#contacto` tiene `a[href="tel:+34956547899"]` y `a[href="tel:+34661606065"]`, y el documento no tiene ningún `iframe`.
  - `it("final cta calls primary")`: hay un `#llamar a[data-call="final"][href="tel:+34956547899"]`.
  - `it("every img has alt")`: todas las `img` tienen el atributo `alt`.
  - `it("no org-chart names")`: el texto del documento no contiene "[nombre del organigrama]" ni "[nombre del organigrama]".
- [ ] **Step 3:** Ejecuta `npm run test:build`. Debe FALLAR.
- [ ] **Step 4: Implementar.** Alterna bloques: clientes `melega-deep`, servicios `melega-paper`, cifras `melega-night`, proyectos blanco, garantías `melega-paper`, ubicación blanco, llamada final `melega-light` con texto `melega-night`, pie `melega-deep`.
  - Los datos pendientes se ven como tales: OHSAS con una etiqueta "pendiente de confirmar" y la plantilla con "—".
  - Las imágenes de contenido llevan contorno `outline-1 -outline-offset-1 outline-black/10` según better-ui.
  - En la ubicación, el enlace "Cómo llegar" apunta a `SITE.address.mapsUrl`.
  - El pie incluye razón social, dirección, ambos teléfonos y enlaces a `/aviso-legal` y `/privacidad`.
- [ ] **Step 5:** Ejecuta `npm run test:build`. Debe PASAR.
- [ ] **Step 6: Commit.** `feat: add clients, stats, projects, credentials, location, CTA and footer`.

### Task 6: SEO, indexación de la preview y páginas legales

**Files:**
- Create: `src/components/Seo.astro`, `src/pages/robots.txt.ts`, `src/pages/aviso-legal.astro`, `src/pages/privacidad.astro`, `vercel.json`, `tests/build/seo.test.ts`
- Modify: `src/layouts/Base.astro`, `astro.config.mjs` (`site: SITE_URL`)

**Interfaces:**
- Consumes: `SITE`.

- [ ] **Step 1: Test que falla.** `seo.test.ts`, con el build ejecutado sin `PUBLIC_INDEXABLE`:
  - `it("preview is noindex")`: hay `meta[name="robots"][content="noindex, nofollow"]` en `index.html`, `aviso-legal/index.html` y `privacidad/index.html`.
  - `it("robots.txt blocks crawling")`: `dist/robots.txt` contiene `Disallow: /`.
  - `it("vercel header")`: en `vercel.json`, `headers` contiene `X-Robots-Tag` con valor `noindex` para la fuente `/(.*)`.
  - `it("local business json-ld")`: el `script[type="application/ld+json"]` se parsea, su `@type` es `"Electrician"`, `telephone === "+34956547899"` y `address.addressLocality === "El Puerto de Santa María"`.
  - `it("title and description")`: el `title` contiene "Melega" y el `meta[name=description]` tiene ≥ 70 caracteres.
  - `it("all call links use E.164")`: todos los `a[href^="tel:"]` del documento casan con `/^tel:\+34\d{9}$/`.
  - `it("legal pages are placeholders")`: en las dos páginas legales hay un `[data-placeholder]`.
- [ ] **Step 2:** Ejecuta `npm run test:build`. Debe FALLAR.
- [ ] **Step 3: Implementar.**
  - `Seo.astro`: title, description, canonical (`SITE.url`), Open Graph (imagen de portada), `robots` según `SITE.indexable` y JSON-LD `Electrician` con dirección, teléfono, `areaServed: "Provincia de Cádiz"` y `foundingDate: "2007"`.
  - `robots.txt.ts`: devuelve `Disallow: /` si no es indexable y, si lo es, `Allow: /` más la línea `Sitemap`.
  - `vercel.json` lleva la cabecera `X-Robots-Tag: noindex` mientras sea preview. Documenta en `README.md` la lista de lanzamiento: `PUBLIC_INDEXABLE=true`, quitar la cabecera, `SITE_URL`, redirecciones 301 y los datos del §9 de la spec.
  - Páginas legales con estructura LSSI/RGPD y placeholders `[data-placeholder]` para CIF y registro.
- [ ] **Step 4:** Ejecuta `npm run test:build`. Debe PASAR. Ejecuta también `PUBLIC_INDEXABLE=true npx astro build && grep -c noindex dist/index.html`; tiene que dar `0`.
- [ ] **Step 5: Commit.** `feat: add SEO, preview noindex and legal placeholder pages`.

### Task 7: Medir las llamadas (Vercel Analytics)

**Files:**
- Create: `src/lib/track-calls.ts`, `tests/unit/track-calls.test.ts`
- Modify: `src/layouts/Base.astro`, `package.json` (`@vercel/analytics`)

**Interfaces:**
- Consumes: el atributo `data-call` de `CallLink` (Task 3).
- Produces: `installCallTracking(root: Document, track: (name: string, props: Record<string, string>) => void): void`.

- [ ] **Step 1: Test que falla** (jsdom). `it("tracks tel clicks with location")`: un documento con `<a href="tel:+34956547899" data-call="hero">`. Al hacer clic, `track` se llama una vez con `("llamada", { ubicacion: "hero" })`. `it("ignores non-tel links")`: un clic en `<a href="#servicios">` no llama a `track`.
- [ ] **Step 2:** Ejecuta `npx vitest run tests/unit/track-calls.test.ts`. Debe FALLAR.
- [ ] **Step 3:** Implementa con delegación de eventos en `document` y `closest('a[href^="tel:"]')`. En `Base.astro`, añade `<Analytics />` de `@vercel/analytics/astro` y un `<script>` que llame a `installCallTracking(document, track)` con `track` de `@vercel/analytics`. Los eventos personalizados necesitan el plan Pro de Vercel; anótalo en el README.
- [ ] **Step 4:** Ejecuta el test. Debe PASAR.
- [ ] **Step 5: Commit.** `feat: track phone call clicks with Vercel Analytics`.

### Task 8: Smoke test en navegador y pase de pulido better-ui

**Files:**
- Create: `playwright.config.ts` (`webServer: npm run build && npm run preview`, proyectos `mobile` con viewport 375×812 y `desktop` con 1280×800), `tests/e2e/landing.spec.ts`
- Modify: los componentes que señale la revisión.

- [ ] **Step 1: Tests que fallan.** `landing.spec.ts`:
  - `test("no horizontal scroll at 320 and 375")`: `document.documentElement.scrollWidth <= window.innerWidth` en los dos anchos.
  - `test("mobile call bar visible on mobile, hidden on desktop")`.
  - `test("call bar does not cover footer")`: con scroll hasta abajo, el `bottom` del último enlace del pie es ≤ al `top` de la barra.
  - `test("hero visible immediately with reduced motion")`: con `page.emulateMedia({ reducedMotion: "reduce" })`, el `getComputedStyle(h1).opacity` es `"1"` nada más cargar.
  - `test("tabs work after hydration")`: hacer clic en "Hogar y comercio" muestra "Instalaciones fotovoltaicas".
- [ ] **Step 2:** Ejecuta `npx playwright install chromium && npm run test:e2e`. Arregla todo lo que falle hasta que PASE.
- [ ] **Step 3: Revisión better-ui.** Recorre la tabla "Before you finish" de `.claude/skills/better-ui/SKILL.md` sobre `src/`. Busca con grep `transition-all`, `active:scale-9[05]`, `scale-95`, `hover:` fuera de Tailwind, `will-change` y `fill="#` en iconos. Corrige cada hallazgo y vuelve a ejecutar `npm test && npm run test:build && npm run test:e2e`; todo debe PASAR.
- [ ] **Step 4: Commit.** `test: add e2e smoke tests and apply better-ui polish`.

### Task 9: Desplegar la preview en Vercel

Requiere al usuario, porque implica iniciar sesión en Vercel.

- [ ] **Step 1:** El usuario ejecuta `! npx vercel login`.
- [ ] **Step 2:** Ejecuta `npx vercel link` (proyecto nuevo `melega-landing`, framework Astro, Node 22.x en la configuración del proyecto). No definas `PUBLIC_INDEXABLE`.
- [ ] **Step 3:** Ejecuta `npx vercel deploy --prod` para tener una URL estable que enseñar al cliente. Comprueba con `curl -sI <url> | grep -i x-robots-tag` que sale `noindex`, y con `curl -s <url> | grep -c 'tel:+34956547899'`, que tiene que dar ≥ 4.
- [ ] **Step 4:** Activa Web Analytics en el panel del proyecto. Abre la URL en el móvil y comprueba que el botón "Llamar ahora" abre el marcador.
- [ ] **Step 5: Commit** del README actualizado (`.vercel/` queda ignorado). Comparte la URL con el usuario.
