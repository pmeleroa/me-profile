## Why

El único workflow de CI/CD, [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml), fija cuatro GitHub Actions en versiones desactualizadas: `actions/checkout@v4` (última: `v7.0.1`), `actions/setup-node@v4` (última: `v7.0.0`), `actions/upload-pages-artifact@v3` (última: `v5.0.0`) y `actions/deploy-pages@v4` (última: `v5.0.1`). Mantener actions desactualizadas implica perder parches de seguridad y correcciones ya publicados por `actions/*`, y acumula más saltos de versión (y más riesgo) cuanto más se posponga. Se corrige ahora, con el mismo criterio que ya se aplicó a la actualización de `sharp` y de Astro en este repositorio.

## What Changes

- Actualizar en `.github/workflows/deploy.yml`:
  - `actions/checkout@v4` → `@v7.0.1` (usado en los jobs `check-commit`, `build` y `release`).
  - `actions/setup-node@v4` → `@v7.0.0` (job `build`).
  - `actions/upload-pages-artifact@v3` → `@v5.0.0` (job `build`).
  - `actions/deploy-pages@v4` → `@v5.0.1` (job `deploy`).
- No se añade ninguna action nueva ni se modifica la lógica del pipeline (jobs, gates, permisos, triggers): es una actualización de versión de las mismas cuatro actions ya en uso.
- No hay cambios **BREAKING** de cara al pipeline: se revisaron los changelogs de cada salto de major y ninguno afecta a este workflow (detalle en `design.md`).

## Capabilities

Sin cambios de comportamiento observable: el resultado del pipeline (build, release, despliegue en GitHub Pages) permanece idéntico. Es una actualización de las herramientas de CI/CD, no un cambio de requisitos funcionales. No se declara ninguna capability nueva ni modificada (`skip_specs: true` en `.openspec.yaml`).

Esta propuesta no afecta a ninguna colección de contenido de blog ni a su contrato de publicación (`status`/`approvedBy`/`approvedAt`): no toca `src/content.config.ts` ni el schema de frontmatter.

## Impact

- **CI/CD**: `.github/workflows/deploy.yml` (jobs `check-commit`, `build`, `release`, `deploy`).
- **Código de la aplicación**: ninguno.
- **Dependencias de producción**: ninguna — solo versiones de GitHub Actions usadas en CI.
- **Seguridad**: se adoptan las versiones mantenidas actualmente por `actions/*`, con las correcciones y parches publicados desde las versiones fijadas hoy.
- **Sin impacto** en contenido publicado, en el schema de frontmatter del blog, ni en integraciones externas (Google Analytics vía Partytown, etc.).
