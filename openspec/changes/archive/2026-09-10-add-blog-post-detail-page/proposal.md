## Why

La página de artículo (`src/pages/blog/[slug].astro`) ya existe y cubre categoría, título, bajada, fecha, contenido, autor, relacionados y una CTA de contacto, pero no sigue el orden de lectura editorial pedido (categoría+tags antes del título, metadatos de fecha/tiempo de lectura separados de la bajada), no muestra la imagen destacada del post (`post.data.image` solo se usa hoy como `og:image`, nunca se pinta en la página), no calcula ni muestra el tiempo de lectura del artículo principal (sí se calcula para las tarjetas relacionadas), no distingue `og:type`/`article:*` ni añade datos estructurados `BlogPosting`/`BreadcrumbList` para SEO, no tiene breadcrumb, y varios enlaces (tags, autor, CTA) solo tienen `:hover`, no `:focus-visible`. Formalizar esta estructura y estos huecos evita que cada post nuevo dependa de que alguien recuerde añadir la imagen o revisar el foco a mano.

## What Changes

- Reordenar la cabecera del artículo a esta secuencia: breadcrumb → categoría con metadatos (fecha de publicación y tiempo de lectura estimado, mismo formato que `BlogCard`, alineados a la derecha de la categoría en la misma fila) → título (`h1`) → bajada → tags → imagen destacada (16:9) → contenido completo → autor → relacionados → CTA final.
- Añadir un breadcrumb contextual (`<nav aria-label="Breadcrumb">` con `<ol>`) "Inicio / Blog / {categoría}", con los tres niveles como enlaces (la categoría enlaza a `/blog?category=<categoría>`, igual que ya hacen los tags con `/blog?tags=<tag>`); el breadcrumb no incluye el título del post.
- Renderizar la imagen destacada del post (`post.data.image`) en proporción `16:9` cuando existe, con `alt` igual al título del post; cuando el post no define `image`, omitir el bloque por completo (sin hueco ni placeholder, a diferencia de `BlogCard` donde sí hace falta placeholder para no romper la altura de una rejilla).
- Calcular y mostrar el tiempo de lectura del artículo principal reutilizando `readingTime()` (ya usado para las tarjetas relacionadas, nunca para el propio artículo), junto a la fecha de publicación en el bloque de metadatos.
- Mostrar "Actualizado el {fecha}" junto a la fecha de publicación solo cuando el post define `updatedDate`; sin ese campo, el bloque de metadatos muestra solo la fecha de publicación y el tiempo de lectura, sin hueco.
- Añadir datos estructurados JSON-LD `BlogPosting` (headline, description, image, datePublished, dateModified, author, mainEntityOfPage) y `BreadcrumbList` (alineado con el breadcrumb visible) en la página de artículo.
- Extender `Layout.astro` con un prop opcional `type` (`'website' | 'article'`, por defecto `'website'`) para fijar `og:type`, props opcionales `publishedTime`/`modifiedTime` para las meta `article:published_time`/`article:modified_time`, y un `<slot name="head" />` reutilizable para inyectar JSON-LD u otras etiquetas `<head>` específicas de una página sin acoplar el layout al dominio de blog. La página de artículo pasa `type="article"` y sus fechas; el resto de páginas no cambia de comportamiento (el prop es opcional con el valor por defecto actual).
- Hacer configurable la CTA final por post con campos opcionales en el frontmatter (`ctaLabel`, `ctaText`, `ctaHref`), con fallback al texto y enlace de contacto actuales cuando el post no los define, para poder usar la misma página con una CTA de suscripción, contacto o lectura recomendada según el post (petición explícita del pedido: "CTA final opcional: suscripción, contacto o lectura recomendada").
- Añadir estados `:focus-visible` accesibles a los tags del artículo, los enlaces del bloque de autor, el breadcrumb y el botón de CTA (hoy solo tienen `:hover`).
- El bloque de autor pasa a depender de un dato de autor centralizado (`src/data/author.ts`, hoy hardcodeado en línea en `[slug].astro`) y se omite por completo si ese dato no está disponible, en vez de asumir que siempre existe.
- Contenido de ejemplo: se usa temporalmente durante la implementación (`apply`) un post `.mdx` de prueba con los datos exactos del pedido (título, bajada, fecha, tiempo de lectura, slug `como-crear-estrategia-contenidos`, CTA de suscripción) para verificar visualmente la página con `npm run build` + inspección de `dist/`, y se descarta antes de dejar la rama lista para PR — no se versiona contenido de prueba permanente en el repositorio, siguiendo la guía ya existente en `openspec/config.yaml` (`operations.apply.guidance`). Como la categoría del pedido ("Marketing") no existe en el enum actual de `content.config.ts` y añadir una categoría nueva es una decisión de taxonomía real (no de esta propuesta, centrada en la página de detalle), el fixture temporal usa una de las 5 categorías ya existentes; el resto de campos (título, bajada, fechas, tags, CTA) sí coincide con el pedido.

No es **BREAKING**: la página sigue recibiendo el post desde `getStaticPaths`/colección de contenido (ruta dinámica `[slug].astro`), sin cambiar cómo se enruta ni el schema de `content.config.ts`. Los props nuevos de `Layout.astro` son opcionales con el comportamiento actual como valor por defecto.

Esta propuesta no cambia el contrato de publicación de la colección `blog` (`draft`/aprobación de contenido): no se publica ningún post nuevo ni se fija `draft: false` en ninguno existente.

## Capabilities

### New Capabilities
(ninguna)

### Modified Capabilities
- `blog`: nuevos requisitos sobre la estructura y el orden de la página de artículo (`/blog/[slug]`), el bloque de metadatos (fecha, actualización, tiempo de lectura), la imagen destacada del artículo, el breadcrumb, los datos estructurados SEO, el bloque de autor tolerante a datos ausentes, y la CTA final configurable por post.

## Impact

- Código: `src/pages/blog/[slug].astro` (reestructuración y nuevo contenido), `src/layouts/Layout.astro` (props `type`/`publishedTime`/`modifiedTime` y slot `head`), `src/data/author.ts` (nuevo, centraliza el dato hoy hardcodeado).
- Datos: `src/content.config.ts` — nuevos campos opcionales `ctaLabel`, `ctaText`, `ctaHref` en el schema de `blog`; sin cambios en los campos existentes ni en su obligatoriedad (`image` sigue opcional).
- Contenido: ningún post real se modifica ni se publica; el contenido de ejemplo del pedido se usa solo como fixture temporal no versionado durante la verificación de `apply`.
- Sin dependencias nuevas: reutiliza `readingTime()`, `getCollection`/`render` de `astro:content` (ya usados) y JSON-LD como `<script type="application/ld+json">` inline, sin librería externa.
