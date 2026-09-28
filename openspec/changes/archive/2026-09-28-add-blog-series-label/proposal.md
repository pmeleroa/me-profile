## Why

El blog ya tiene una serie en marcha (el asistente de código local con Ollama), pero solo el texto del post 1 lo dice: nada en la página de artículo indica que un post pertenece a una serie ni qué parte es. Quien llega a una parte concreta desde un buscador o un enlace compartido lee el título sin saber que forma parte de una serie. Se adelanta ahora solo la etiqueta de serie y el modelo de datos, para que el post 1 la muestre desde hoy y la segunda parte nazca ya con ella; la navegación entre partes (A2) sigue esperando a que haya 2 o más partes publicadas.

## What Changes

- Se añade una colección de contenido `series` (una entrada por serie, con su nombre público) y un campo opcional `series` en el frontmatter de la colección `blog`, con el id de la serie (referencia validada en build) y el número de parte explícito.
- El build falla si dos posts publicados de la misma serie declaran el mismo número de parte, o si un post referencia una serie que no existe.
- La página de artículo (`/blog/[slug]`) muestra, cuando el post pertenece a una serie, un antetítulo encima del `h1`: badge «📚 SERIE», nombre de la serie y «Parte N». Es texto sin enlace y no muestra el total de partes.
- Las tarjetas de post (listado de `/blog`, «Últimas ideas» en la portada y artículos relacionados) de un post de serie muestran el badge «📚 SERIE» superpuesto a la esquina superior izquierda de la imagen, con fondo opaco. Solo el badge: sin nombre de serie ni parte.
- El JSON-LD `BlogPosting` de un post de serie declara `isPartOf` con un `CreativeWorkSeries` que lleva el nombre de la serie.
- La fecha de actualización (`updatedDate`) deja de mostrarse en la página de artículo para todos los posts. Se sigue emitiendo en `dateModified` (JSON-LD) y en `article:modified_time`, para que los buscadores sepan que el post cambió.
- Contenido: se crea la serie `asistente-codigo-local` («Asistente de código local»), el post `ollama-primeros-pasos-asistente-de-codigo-local` pasa a ser su parte 1 y se ajustan en él las dos frases que describían la serie como «sobre entornos de IA locales» (descripción y primer párrafo), fijando `updatedDate`.
- Configuración: la entrada de trabajo futuro sobre series en `openspec/config.yaml` pasa a cubrir solo la navegación entre partes (A2, con la exclusión de las partes de la serie en «Artículos relacionados»), y la entrada de deuda de `--color-text-muted` actualiza su recuento de reglas.
- Fuera de alcance: bloque de navegación de la serie (A2), exclusión de partes en «Artículos relacionados», página `/blog/series/<id>` y filtro por serie en el listado.

Contrato de publicación: no cambia. El campo `draft` y su semántica siguen igual; `series` es opcional y no afecta a qué posts se publican. El post 1 ya está publicado y sigue con `draft: false`.

## Capabilities

### New Capabilities
(ninguna)

### Modified Capabilities
- `blog`: se añade un requisito de pertenencia a serie (modelo de datos y validaciones) otro de antetítulo de serie en la página de artículo y otro de badge de serie en la tarjeta de post; se modifican «Orden de la estructura de la página de artículo» (antetítulo antes del `h1`), «Bloque de metadatos del artículo» (la fecha de actualización deja de mostrarse) y «Datos estructurados SEO del artículo» (`isPartOf` para posts de serie y `dateModified`/`article:modified_time` como únicos consumidores de la fecha de actualización).

## Impact

- Código: `src/content.config.ts` (colección `series`, campo `series` en `blog`), `src/pages/blog/[slug].astro` (antetítulo, estilos del badge, `isPartOf`, retirada del bloque «Actualizado el» y de su regla `.article-updated`), `src/components/BlogCard.astro` (prop `inSeries` y badge sobre la imagen) y sus tres consumidores (`src/pages/blog/index.astro`, `src/components/BlogPreview.astro`, `src/pages/blog/[slug].astro`), validación de unicidad de parte en build.
- Contenido: `src/content/series/asistente-codigo-local.yaml` (nuevo) y `src/content/blog/ollama-primeros-pasos-asistente-de-codigo-local.mdx` (frontmatter y dos frases).
- Configuración de OpenSpec: `openspec/config.yaml` (`rules.design`, dos entradas de trabajo futuro).
- Sin dependencias npm nuevas, sin backend ni CMS: solo Content Layer API y zod, que ya usa el proyecto.
- SEO: cambian la meta description y el JSON-LD del post 1 (descripción, `dateModified`, `isPartOf`).
