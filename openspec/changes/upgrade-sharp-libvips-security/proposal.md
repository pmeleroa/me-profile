## Why

`sharp` está fijado en `package.json` como `^0.34.5` (devDependency). GitHub Advisory [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) reporta cuatro vulnerabilidades heredadas de `libvips` en esa versión — `CVE-2026-33327`, `CVE-2026-33328`, `CVE-2026-35590`, `CVE-2026-35591` (dos de severidad alta por CVSSv4) — en los loaders de GIF, TIFF y VIPS: desbordamientos de entero en el cálculo de dimensiones, desbordamientos de buffer en heap y lecturas fuera de límites en el decodificador EXIF, con riesgo de denegación de servicio y potencial ejecución de código al procesar imágenes no confiables. `npm audit` ya marca esta dependencia como vulnerabilidad `high` con corrección disponible. Se corrige ahora, antes de que se acumule con el resto de dependencias.

## What Changes

- Actualizar `sharp` de `^0.34.5` a `^0.35.4` en `package.json` (devDependencies), version publicada que incluye `libvips` 8.18.3 con las cuatro correcciones.
- **BREAKING (interno)**: `0.34 → 0.35` es un salto de versión "minor" de `sharp` que, según su política de versionado (`0.x`), incluye cambios incompatibles (`npm audit` lo marca como `isSemVerMajor: true`). No hay uso directo de la API de `sharp` en el código fuente del proyecto (ningún `import`/`require` de `sharp` en `src/`); el único consumidor conocido es el pipeline interno de `astro:assets`, que ya usa `sharp@0.35.4` como dependencia transitiva de `astro@7.3.1`. El riesgo de incompatibilidad de API se considera bajo, pero se valida con build real antes de fusionar.
- Verificar con `npm audit` y build real (`npm run build` + inspección de `dist/`) que la vulnerabilidad desaparece y que la generación de imágenes optimizadas no sufre regresiones.

## Capabilities

Sin cambios de comportamiento observable: el contrato público del sitio (rutas, contenido publicado, imágenes generadas) permanece idéntico. Es una actualización de una dependencia de build por motivos de seguridad, no un cambio de requisitos funcionales. No se declara ninguna capability nueva ni modificada (`skip_specs: true` en `.openspec.yaml`).

Esta propuesta no afecta a ninguna colección de contenido de blog ni a su contrato de publicación (`status`/`approvedBy`/`approvedAt`): no toca `src/content.config.ts` ni el schema de frontmatter.

## Impact

- **Dependencias**: `sharp` (`package.json`, devDependencies) y su lockfile (`package-lock.json`).
- **Código**: ninguno directamente — no hay imports de `sharp` en `src/`. Impacto indirecto en cualquier página que use `astro:assets` para optimizar imágenes (por ejemplo, imágenes referenciadas en `src/data/skills.ts` y renderizadas en `src/components/SkillsGrid.astro` / `src/pages/skills/[slug].astro`).
- **Build/CI**: `npm run build` (genera las imágenes optimizadas en `dist/`); sin cambios en `.github/workflows/deploy.yml`.
- **Seguridad**: elimina la vulnerabilidad `high` reportada por `npm audit` para `sharp`.
- **Sin impacto** en contenido publicado, en el schema de frontmatter del blog, ni en integraciones externas.
