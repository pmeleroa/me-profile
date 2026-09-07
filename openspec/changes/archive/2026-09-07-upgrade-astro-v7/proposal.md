## Why

Astro 7.3.1 está disponible y el proyecto sigue en `astro ^5.18.0`, dos versiones mayores por detrás. Cuanto más tiempo pase, más grande será el salto y mayor la superficie de cambios acumulados (colecciones de contenido, Node, integraciones) que habrá que asumir de golpe. Se hace ahora, en un único salto directo a 7.3.1, para evitar mantener el sitio sobre una major sin soporte activo.

## What Changes

- Actualizar `astro` de `^5.18.0` a `7.3.1`.
- Actualizar `@astrojs/mdx` a la versión compatible con Astro 7 (peer `astro ^7.2.6`).
- Actualizar `@astrojs/partytown` a la última versión disponible (sin peer estricto de Astro, riesgo bajo).
- **BREAKING (interno)**: migrar `src/content/config.ts` (colección `blog` con `type: 'content'`) a `src/content.config.ts` usando la Content Layer API (`loader: glob(...)`), ya que Astro 6 elimina el soporte a colecciones legacy sin período de gracia.
- **BREAKING (interno)**: sustituir todos los usos de `entry.slug` por `entry.id` y de `entry.render()` por `render(entry)` en las páginas y componentes que consumen la colección `blog`.
- Subir la versión de Node en el pipeline de despliegue ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) de `20` a `24` (LTS activa), ya que Astro 7 exige Node `>=22.12.0`. El entorno local ya cumple (`v22.23.2`).
- Verificar con build real (`npm run build` + inspección de `dist/`) que no hay regresiones por el cambio de procesador Markdown por defecto (Sateri) ni por el nuevo compilador Rust (parseo HTML más estricto).

## Capabilities

Sin cambios de comportamiento observable: el contrato público del sitio (rutas, contenido publicado, campos del frontmatter del blog, salida HTML) permanece idéntico. Es una actualización de dependencias y de la forma interna de definir/leer las colecciones de contenido, no un cambio de requisitos. No se declara ninguna capability nueva ni modificada (`skip_specs: true` en `.openspec.yaml`).

Esta propuesta no cambia el contrato de publicación del blog (`status`/`approvedBy`/`approvedAt`): esos campos no existen en el schema actual de la colección `blog` ([src/content/config.ts](src/content/config.ts)) y este cambio no los introduce; se preservan exactamente los campos existentes (`title`, `description`, `publishDate`, `updatedDate`, `category`, `tags`, `image`, `draft`).

## Impact

- **Dependencias**: `astro`, `@astrojs/mdx`, `@astrojs/partytown` (package.json).
- **Código**: [src/content/config.ts](src/content/config.ts) → `src/content.config.ts`; [src/pages/index.astro](src/pages/index.astro), [src/pages/blog/index.astro](src/pages/blog/index.astro), [src/pages/blog/[slug].astro](src/pages/blog/[slug].astro), [src/components/BlogPreview.astro](src/components/BlogPreview.astro), [src/components/Footer.astro](src/components/Footer.astro), [src/components/Header.astro](src/components/Header.astro) (estos dos últimos usan `.slug` sobre `sections`/nav, no sobre la colección — a confirmar durante la implementación si les afecta).
- **CI/CD**: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (versión de Node).
- **Sin impacto** en contenido publicado, en el schema de frontmatter del blog, ni en integraciones externas (Google Analytics vía Partytown).
- **Documentación del proyecto**: se añade `CLAUDE.md` con las convenciones de trabajo en español (es-ES). Sin relación funcional con el upgrade de Astro, pero se incluye en este change por conveniencia de commit.
