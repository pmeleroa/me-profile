## Why

El listado de blog (`/blog`) solo permite filtrar por `category`, un campo que hoy no discrimina contenido (los 3 posts publicados comparten la misma categoría) y que el autor prevé rediseñar más adelante. El campo `tags`, ya presente en el esquema de contenido y en cada post, es el que realmente diferencia los artículos, pero hoy no es navegable: se muestra como texto estático en la página de artículo y no se usa para filtrar el listado.

## What Changes

- Se añade un filtro por tags en `/blog`, independiente del filtro de categoría existente (que no se modifica).
- El filtro de tags admite selección múltiple con lógica OR entre los tags activos, combinada en AND con la categoría activa si la hay.
- El estado de ambos filtros (categoría y tags) pasa a reflejarse en la URL mediante query params, sustituyendo el comportamiento actual puramente en memoria del filtro de categoría.
- El filtro de tags se presenta en un panel colapsable ("Filtrar por tags"), cerrado por defecto, que se auto-expande al llegar con tags activos en la URL y muestra el número de tags activos cuando está cerrado.
- Los tags mostrados en la página de artículo (`/blog/[slug]`) dejan de ser texto estático y pasan a ser enlaces a `/blog` con ese tag ya filtrado.
- Sin cambios en `BlogCard`, en el esquema de contenido (`content.config.ts`), en los colores/semántica de categoría, ni en la lógica de "artículos relacionados".
- Esta propuesta no cambia el contrato de publicación de la colección de blog (`draft`/`status`/`approvedBy`/`approvedAt`): no toca campos de aprobación ni el criterio de qué posts se publican.

## Capabilities

### New Capabilities
- `blog`: listado de posts del blog, filtrado combinado por categoría y tags con estado en la URL, y navegación a tags desde la página de artículo. No existe hoy un `specs/blog/spec.md`; este change lo crea.

### Modified Capabilities
(ninguna — no hay delta sobre `specs/lab/spec.md` ni otra capability existente)

## Impact

- **Código afectado**: `src/pages/blog/index.astro` (UI de filtros, lectura/escritura de query params, lógica de combinación de filtros), `src/pages/blog/[slug].astro` (tags como enlaces).
- **Sin cambios**: `src/content.config.ts`, `src/components/BlogCard.astro`, `src/components/BlogPreview.astro`.
- **Sin dependencias nuevas**: se implementa con el stack existente (Astro + script cliente vanilla, `URLSearchParams`), sin backend ni librería adicional.
- **Compatibilidad**: `/blog` sin query params se comporta igual que hoy (todos los posts visibles, panel de tags colapsado).
