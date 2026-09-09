## Why

El componente `BlogCard.astro` actual (categoría, fecha, título, extracto y CTA) no incluye imagen destacada ni autor ni tiempo de lectura, y no está pensado para tolerar contenido incompleto (sin imagen, sin autor, sin tiempo de lectura). El listado de `/blog`, la vista previa en portada (`BlogPreview.astro`) y los artículos relacionados en `/blog/[slug]` reutilizan el mismo componente, así que cualquier mejora de jerarquía visual, accesibilidad (hover/focus) y semántica (`article`, `time`) beneficia a los tres puntos de uso a la vez.

## What Changes

- Rediseñar `BlogCard.astro` para mostrar, en este orden: imagen destacada (16:9), categoría, título, extracto (1-2 líneas truncadas), metadatos (fecha, tiempo de lectura estimado) y CTA discreto "Leer artículo".
- Envolver la tarjeta en `<article>` con `<time datetime="...">` para la fecha; mantener el enlace principal (`<a>`) cubriendo, como mínimo, título y CTA.
- Añadir un marcador de posición visual (gradiente con el color de categoría) cuando el post no tiene `image`, en vez de omitir el hueco de imagen, para que la altura de la tarjeta no varíe entre posts con y sin imagen.
- No se muestra autor en la tarjeta: el sitio es de un único autor conocido (Pablo Melero Alonso, ya identificado en la ficha de autor de `/blog/[slug].astro`), así que repetirlo en cada tarjeta no aporta información y se descarta como metadato de la tarjeta.
- Calcular el tiempo de lectura a partir del recuento de palabras del cuerpo del post (sin campo manual que se pueda desincronizar del contenido real), redondeado hacia arriba, con un mínimo de 1 minuto; si el recuento no está disponible (por ejemplo, al renderizar la tarjeta en un contexto sin acceso al cuerpo del post), se omite ese metadato en vez de mostrar un valor inventado.
- Truncar título y extracto con clamps de líneas (CSS `-webkit-line-clamp`, ya usado en el componente actual) para que la altura de la tarjeta no varíe con textos de longitud distinta.
- Añadir estados `:hover` y `:focus-visible` accesibles sobre el enlace principal (el `:hover` ya existe; `:focus-visible` es nuevo).
- Actualizar los tres puntos de uso existentes (`BlogPreview.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`) para pasar los props nuevos.

No es **BREAKING**: los props actuales (`title`, `description`, `publishDate`, `category`, `tags`, `slug`, `featured`) se mantienen; el nuevo (`image`, `readingTimeMinutes`) es opcional con fallback.

Esta propuesta no cambia el contrato de publicación de la colección `blog` (`draft`/aprobación de contenido) ni añade campos nuevos al schema de contenido.

## Capabilities

### New Capabilities
(ninguna)

### Modified Capabilities
- `blog`: nuevos requisitos sobre la estructura de contenido, el comportamiento con datos incompletos (imagen/tiempo de lectura) y la accesibilidad (foco visible, tarjeta clicable) de la tarjeta de post reutilizada en listado, portada y artículos relacionados.

## Impact

- Código: `src/components/BlogCard.astro` (rediseño), `src/components/BlogPreview.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro` (paso de nuevos props).
- Datos: sin cambios en el schema de `src/content.config.ts`.
- Sin dependencias nuevas: el cálculo de tiempo de lectura se hace con recuento de palabras propio, sin librería externa.
