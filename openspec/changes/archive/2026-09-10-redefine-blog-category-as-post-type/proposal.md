## Why

El campo `category` de la colección `blog` mezcla hoy dos ejes distintos (tema y formato) en un único enum (`Arquitectura`, `DevOps`, `IA Generativa`, `Liderazgo`, `Opinión`), lo que impide usar `category` como taxonomía editorial de tipo de contenido y duplica el tema, que ya vive también en `tags`. Redefinir `category` para que represente exclusivamente el tipo de post (Opinión, Análisis, Guía, Recursos), dejando el tema solo en `tags`, elimina esa ambigüedad antes de que se acumule más contenido sobre el esquema actual.

## What Changes

- El enum `category` en `src/content.config.ts` pasa de representar tema a representar tipo de post: `Opinión`, `Análisis`, `Guía`, `Recursos`. **BREAKING**: los valores anteriores (`Arquitectura`, `DevOps`, `IA Generativa`, `Liderazgo`) dejan de ser válidos como `category`.
- El tema deja de tener representación propia y pasa a vivir exclusivamente en `tags` (campo ya existente, sin cambios de forma).
- Los 3 posts publicados existentes se reclasifican: `ia-en-ingenieria-de-software.mdx` → `Opinión`, `perdidos-en-el-medio.mdx` → `Análisis`, `sdd-vs-vibe-coding.mdx` → `Opinión`. Sus `tags` no cambian, ya cubren el tema.
- La selección de "artículos relacionados" en `/blog/[slug]` deja de basarse en `category` (mismo tipo) y pasa a basarse en tags compartidos con el post actual: se ordenan por número de tags en común (descendente) y, en empate, por fecha de publicación más reciente; si ningún otro post comparte al menos un tag, la sección de relacionados se omite.
- Se definen colores de marca para los 4 tipos nuevos, reutilizando variables ya existentes en `global.css`: `--color-accent` para Análisis, `--color-logo-green` para Guía, `--color-logo-yellow` para Recursos, y manteniendo el naranja (`#F6AD55`) ya usado para Opinión.
- Se extrae a una única fuente compartida (`src/data/blogCategories.ts`) el mapa tipo→color→etiqueta, hoy duplicado en `BlogCard.astro` y `[slug].astro`, y la lista de categorías repetida en `blog/index.astro`.
- La disposición de los filtros en `/blog` no cambia: `category` sigue en los chips primarios del listado, y `tags` sigue en el panel secundario desplegable; solo cambia el vocabulario que representa cada uno (tipo vs. tema).
- Los chips de tipo en `/blog` pasan a mostrarse siempre para los 4 tipos de la taxonomía, incluidos los que aún no tienen ningún post publicado (antes se ocultaba el chip si no había posts de esa categoría).
- El subtítulo de `/blog` se actualiza de "Reflexiones sobre arquitectura, plataformas, DevOps e IA." a "Opinión, análisis y guías sobre arquitectura, plataformas, DevOps e IA.": el titular ("Ideas en voz alta") no se toca por ser neutro respecto a tipo y tema, pero el subtítulo original solo vendía el eje de tema, que ahora convive en la misma cabecera con los chips de tipo.

## Capabilities

### Modified Capabilities
- `blog`: cambia el significado y los valores válidos de `category` (de tema a tipo de post), cambia el criterio de selección de artículos relacionados (de mismo `category` a tags compartidos), y actualiza los ejemplos de categoría usados en los escenarios de filtrado combinado y de breadcrumb, que hoy referencian valores de la taxonomía anterior.

## Impact

- `src/content.config.ts`: enum `category`.
- `src/content/blog/*.mdx`: valor de `category` en los 3 posts publicados existentes.
- `src/components/BlogCard.astro`, `src/pages/blog/[slug].astro`: dejan de mantener su propio mapa local de color/etiqueta por categoría.
- `src/pages/blog/index.astro`: lista de categorías usada para generar los chips de filtro.
- Nuevo módulo `src/data/blogCategories.ts` (tipo, color y etiqueta por categoría), consumido por los tres ficheros anteriores.
- No afecta al contrato de publicación: `draft`, `status`, `approvedBy` y `approvedAt` no se tocan. Los 3 posts ya están publicados (`draft: false`) y siguen estándolo tras la reclasificación de `category`.
