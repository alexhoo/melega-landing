# Melega · landing page

Landing de una sola página para Melega, S.L. (Montajes Eléctricos Gaditanos). Objetivo: que el visitante llame al 956 547 899.

- Diseño: `docs/superpowers/specs/2026-10-16-melega-landing-design.md`
- Plan: `docs/superpowers/plans/2026-10-16-melega-landing.md`

## Desarrollo

Requiere Node ≥ 22.22 (`nvm use`).

```bash
npm install
npm run dev          # http://localhost:4321
npm test             # unitarios y de componentes
npm run test:build   # build + tests sobre el HTML generado
npm run test:e2e     # Playwright (móvil y escritorio)
npm run check        # tipos
```

El contenido está en `src/data/*.ts` y los datos de contacto en `src/config/site.ts`.

## Estado: vista previa privada

Mientras `PUBLIC_INDEXABLE` no valga `true`, todas las páginas llevan `noindex`, `robots.txt` bloquea el rastreo y `vercel.json` añade `X-Robots-Tag: noindex`.

## Lista para el lanzamiento público

1. Confirmar con el cliente los datos pendientes (§9 de la spec): plantilla, vigencia de ISO 9001/14001 y OHSAS 18001 → ISO 45001, autorizaciones, permiso para nombrar clientes, CIF/registro, email, horario, código postal y WhatsApp.
2. Sustituir las fotos de `src/assets/stock/` por fotos reales.
3. En Vercel: `PUBLIC_INDEXABLE=true` y `SITE_URL=https://<dominio>`.
4. Eliminar la cabecera `X-Robots-Tag` de `vercel.json`.
5. Conectar el dominio y añadir en `vercel.json` redirecciones 301 desde las URLs indexadas de la web antigua.

## Analítica

Vercel Web Analytics (sin cookies). Cada clic en un enlace `tel:` envía el evento `llamada` con la propiedad `ubicacion` (hero, header, mobile-bar…). Los eventos personalizados requieren el plan Pro de Vercel.
