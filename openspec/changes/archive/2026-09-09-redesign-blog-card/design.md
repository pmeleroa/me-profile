## Context

`BlogCard.astro` se usa hoy en tres puntos con datos ligeramente distintos:
- `BlogPreview.astro` (portada) y `src/pages/blog/index.astro` (listado) construyen el prop `slug` a partir de `post.id` y ya iteran sobre el resultado de `getCollection('blog', ...)`.
- `src/pages/blog/[slug].astro` reutiliza `BlogCard` para "artículos relacionados", también a partir de `getCollection('blog', ...)`.

Los tres puntos de uso tienen acceso al objeto `entry` completo devuelto por `getCollection`, no solo a `entry.data`. Con el loader `glob()` de la Content Layer API, cada `entry` incluye un campo opcional `body` con el código fuente en crudo del `.mdx` (confirmado en `node_modules/astro/dist/content/data-store.d.ts`), disponible sin llamar a `render()`. Esto permite calcular el tiempo de lectura por recuento de palabras en los tres sitios sin depender del pipeline de renderizado MDX.

Ver proposal.md - Why / What Changes para la motivación y el alcance funcional.

## Goals / Non-Goals

**Goals:**
- Una única fuente de cálculo del tiempo de lectura, reutilizada por los tres puntos de uso.
- Un componente `BlogCard` que reciba todo por props (sin `getCollection` ni acceso a colecciones dentro del propio componente), para que pueda usarse también con datos que no vengan de la colección `blog` (p.ej. datos de ejemplo).
- Mantener el sistema visual existente (tokens de `global.css`, paleta de categorías ya definida) sin introducir una paleta o escala tipográfica nueva.

**Non-Goals:**
- No se resuelve en este cambio la paginación, el orden o el filtrado del listado (ya cubierto por specs/blog existentes).
- No se añade un campo de tiempo de lectura editable manualmente en el frontmatter: es siempre calculado (ver Decisión 2).
- No se toca el diseño de la página de artículo (`/blog/[slug]`) más allá de pasar los nuevos props a `BlogCard` en la sección de relacionados.

## Decisions

### 1. Props explícitos en vez de `getCollection` dentro del componente
`BlogCard.astro` sigue siendo "tonto": recibe `title`, `description`, `publishDate`, `category`, `tags`, `slug`, `featured` (como hoy) y añade `image?`, `readingTimeMinutes?` como props opcionales ya calculados por quien lo invoca. Cada página (`BlogPreview`, `blog/index`, `blog/[slug]`) sigue siendo responsable de leer `getCollection` y pasar los datos.

Alternativa descartada: que `BlogCard` reciba el `entry` completo de la colección y calcule internamente el tiempo de lectura. Se descarta porque acopla el componente a la forma exacta del schema de contenido y dificulta reutilizarlo con datos de ejemplo o de otra fuente (contradice el requisito de "recibir los datos por props o desde una estructura de datos reutilizable").

### 2. Tiempo de lectura calculado por recuento de palabras, no almacenado
Se añade una función de utilidad (`src/utils/readingTime.ts`) que recibe el `body` en crudo del post (markdown/MDX sin procesar) y devuelve minutos estimados: `Math.max(1, Math.ceil(wordCount / 200))`, usando 200 palabras/minuto como referencia estándar de lectura en español. El recuento de palabras se hace sobre el texto quitando bloques de código (para no inflar el tiempo con código fuente) mediante una expresión regular simple, sin parsear MDX completo.

Cada página que invoca `BlogCard` llama a esta utilidad con `entry.body` antes de pasar `readingTimeMinutes` como prop. Si `entry.body` no está disponible (`undefined`), la página no pasa `readingTimeMinutes` y la tarjeta omite ese metadato (ver spec: "Tiempo de lectura no disponible").

Alternativas descartadas:
- **Campo manual `readingTime` en el frontmatter**: se descarta porque puede desincronizarse del contenido real al editar un post (dato hardcodeado que las reglas del proyecto piden evitar).
- **Librería de terceros (`reading-time`, `remark-reading-time`)**: se descarta por la regla de diseño del proyecto de justificar cualquier dependencia nueva frente al stack existente; el cálculo necesario es una división simple que no justifica una dependencia.

### 3. Marcador de posición alineado con la marca del sitio
Cuando `image` no está presente, la tarjeta renderiza un `div` con el mismo hueco que ocuparía la imagen (evitando así que ninguna tarjeta cambie de altura por la presencia o ausencia de imagen dentro del mismo listado), con:
- Fondo: el mismo degradado radial que usa `.hero-bg` en `global.css` (`rgba(0,189,212,...)` + `rgba(0,153,200,...)` + `rgba(213,66,96,...)` sobre `--color-bg-2`), en vez de un color por categoría. Es intencionalmente el mismo fondo del hero para que el placeholder se lea como "la marca del sitio", no como un vacío genérico.
- Primer plano: el logo real del sitio (`public/logo.png`, el mismo `<img>` que usa `Header.astro` a 36px) centrado a 34px de alto y 0.55 de opacidad, como marca de agua discreta, con `alt=""` por ser puramente decorativo (la imagen real, cuando existe, sí lleva `alt={title}` informativo).

Versión anterior de esta decisión (primera iteración): un `linear-gradient` derivado del color de categoría, con un icono genérico de "imagen" (SVG de recorte/paisaje). Se sustituye a petición del owner: un placeholder que varía de color por categoría se lee como "falta contenido", mientras que uno que reutiliza el degradado del hero y el logo del sitio se lee como "esto es del sitio X, la imagen está pendiente" — más alineado con la identidad de marca y consistente entre todos los posts, independientemente de su categoría. La categoría ya es visible en la etiqueta de texto justo debajo, así que no se pierde esa información al quitar el tinte por categoría del fondo.

### 4. Sin autor en la tarjeta
El sitio es de un único autor conocido (Pablo Melero Alonso, ya identificado en la ficha de autor de `/blog/[slug].astro`). Mostrar el autor en cada tarjeta de listado no aporta información al visitante, así que `BlogCard` no incluye ningún prop ni metadato de autor. No se añade ningún campo nuevo a `src/content.config.ts` para esto.

Alternativa descartada (versión anterior de este diseño): campo opcional `author` en el schema con fallback a un autor por defecto en el componente. Se descarta tras revisión: en un blog de un único autor, ese dato es siempre el mismo y no cambia la decisión de lectura del visitante, así que es ruido visual innecesario en la tarjeta.

### 5. Foco accesible mediante `:focus-visible` sobre el `<a>` contenedor
Se añade `.blog-card:focus-visible` con un `outline` visible (color `--color-accent`, offset positivo) sobre el mismo `<a class="blog-card">` que ya envuelve toda la tarjeta, reutilizando que el enlace principal ya cubre título y CTA como mínimo (cumple el requisito de tarjeta clicable sin necesitar un segundo `<a>` anidado, que sería inválido en HTML).

### 6. Truncado con `-webkit-line-clamp`
Se mantiene la técnica ya usada en `.blog-card-description` (`-webkit-line-clamp: 2`) y se aplica también al título (`-webkit-line-clamp: 2` con `min-height` implícito por `line-height` fijo) para que títulos de una o dos líneas no cambien la altura del bloque de título entre tarjetas.

### 7. Layout horizontal para la tarjeta destacada en escritorio (≥769px)
Con `aspect-ratio: 16/9` a todo el ancho de la tarjeta destacada (que ocupa el ancho completo del grid, `grid-column: 1 / -1`), la imagen resultaba desproporcionadamente alta en escritorio (~570px de alto en un viewport de 1440px, frente a ~230px de contenido de texto), muy por encima de lo que ocupan las tarjetas normales a media anchura (~180px de alto) con la misma proporción. El problema es que 16:9 escala linealmente con el ancho, así que una tarjeta a ancho completo produce una imagen mucho más alta en píxeles absolutos que una tarjeta a media anchura, aunque la proporción sea la misma.

Solución adoptada (validada con el owner mediante mockups ASCII de 3 alternativas): a partir de 769px de ancho de viewport (el mismo punto de corte en el que `blog-grid` ya pasa de 2 a 1 columna), la tarjeta destacada cambia a un layout horizontal (`flex-direction: row`): la imagen ocupa una columna fija (`flex: 0 0 42%`, sin `aspect-ratio`, con `min-height: 260px`) y el contenido ocupa el resto, con ambas columnas estirándose a la misma altura (`align-items: stretch`, comportamiento por defecto de flexbox). Por debajo de 769px, la tarjeta destacada vuelve al layout apilado vertical (igual que las tarjetas normales), evitando una columna de imagen demasiado estrecha en móvil/tablet. El resultado reduce la altura total de la tarjeta destacada de ~800px a ~330px en escritorio, sin tocar las tarjetas normales (ya bien proporcionadas).

Alternativas descartadas:
- **Cambiar solo la proporción de la imagen destacada** (p.ej. 16:9 → 21:9, o un `max-height` fijo manteniendo el layout vertical): reduce la altura pero menos (~24-55% según la opción) y no llega a un tamaño de imagen tan equilibrado frente al texto como el layout horizontal.
- **Aplicar el mismo tope a todas las tarjetas**: descartado porque las tarjetas normales ya se veían bien proporcionadas a su ancho; cambiar su relación de aspecto no resolvía ningún problema real y solo añadía inconsistencia con el marcador de posición diseñado para 16:9.

### 8. Escala tipográfica y espaciado más compactos en toda la tarjeta
Tras revisar el listado completo (imagen + header + footer en la misma pantalla), el owner observó que las tarjetas normales seguían ocupando mucho espacio, y que la escala tipográfica de la tarjeta (título 17.6px, extracto 14.4px) se sentía grande frente a la del resto del sitio (nav 15px, footer 14px). Análisis: comparado con referencias ya existentes en el sitio (`.stage-banner` 192px de alto, foto del hero 220px), la imagen a 16:9 sin tope (~281px en una tarjeta de 2 columnas) era el principal responsable del alto de la tarjeta, no la tipografía en sí — pero un ajuste conjunto de ambas cosas da una sensación de conjunto más "ligera" y coherente con el resto de la página.

Cambios aplicados a `BlogCard.astro` (afectan a las tres ubicaciones por igual, al vivir en el componente compartido):
- `.blog-card-media`: se añade `max-height: 190px` (alineado con `.stage-banner`), manteniendo `aspect-ratio: 16/9` como base.
- `.blog-card-inner`: padding `1.75rem` → `1.5rem`; gap `0.75rem` → `0.6rem`.
- Tipografía (primera pasada): título `1.1rem` → `1rem`; extracto `0.9rem` → `0.85rem`; meta `0.8rem` → `0.78rem`; CTA `0.82rem` → `0.8rem`; categoría `0.7rem` → `0.68rem`.
- Tipografía (segunda pasada, a petición del owner tras ver la primera): título → `0.92rem`; extracto → `0.8rem`; meta → `0.72rem`; CTA → `0.76rem`; categoría → `0.64rem`; título de la tarjeta destacada `clamp(1.25rem, 2.5vw, 1.75rem)` → `clamp(1.1rem, 2.2vw, 1.5rem)`; extracto de la destacada `1rem` → `0.9rem`.

Resultado medido: tarjeta normal de ~560px a ~430px de alto tras la primera pasada; la tarjeta destacada de ~800px (layout vertical original) a ~300px con el layout horizontal + esta escala. Verificado en las tres ubicaciones (listado, portada, relacionados) mediante capturas Playwright, ya que el cambio vive en el componente compartido.

Riesgo aceptado: la etiqueta de categoría a `0.64rem` (~10.2px) y el texto de metadatos a `0.72rem` (~11.5px) quedan en el extremo inferior de lo habitual para texto legible; se mantiene por ser texto corto, en mayúsculas con tracking (categoría) o secundario (metadatos), un patrón común en UI, y porque el owner validó visualmente el resultado en las capturas antes de fijarlo.

### 9. Fecha y tiempo de lectura reubicados a una fila de cabecera, con emoji y badge
Último ajuste de estilo pedido por el owner: mover la fecha y el tiempo de lectura de su posición original (debajo del extracto) a una fila de cabecera junto a la categoría — categoría a un extremo, fecha y tiempo de lectura al extremo opuesto —, y darles un tratamiento visual propio: la fecha acompañada de un emoji (📅) como texto plano, y el tiempo de lectura como una badge/pill independiente (fondo `--color-surface-2`, borde `--color-border`, radio completo) con su propio emoji (⏱️).

Esto cambia la secuencia de lectura de la tarjeta respecto a la Decisión 1 original (imagen, categoría, título, extracto, metadatos, CTA): ahora es imagen, categoría + metadatos (misma fila), título, extracto, CTA. Se actualiza `specs/blog/spec.md` en consecuencia (requisito "Estructura de contenido de la tarjeta de post").

Implementación:
- Nuevo contenedor `.blog-card-header-row` (flex, `justify-content: space-between`) envolviendo la categoría (sin cambios) y un nuevo `.blog-card-header-meta` con la fecha y, si existe, el badge de tiempo de lectura.
- El emoji de cada dato se envuelve en un `<span aria-hidden="true">` seguido del texto real como nodo hermano, para que la tecnología de asistencia lea el dato (fecha o "`N` min") sin el emoji como ruido — el emoji queda excluido del nombre accesible del `<time>`/`<span>` padre sin necesitar `aria-label` adicional.
- Se elimina el separador `·` (`.blog-card-dot`) usado antes entre fecha y tiempo de lectura: ya no hace falta, el badge del tiempo de lectura se distingue visualmente por su propio fondo/borde.
- El `<time datetime={isoDate}>` semántico se mantiene (ver Decisión 5), solo cambia su posición y contenido visual (ahora incluye el emoji).

Alternativa descartada: mantener fecha y tiempo de lectura donde estaban (debajo del extracto) y solo añadir los emojis/badge ahí. Se descarta porque el owner pidió explícitamente la reubicación a la cabecera, alineada a la derecha a la altura de la categoría — un patrón habitual en tarjetas de blog (categoría + metadatos rápidos arriba, título y resumen como cuerpo principal).

## Risks / Trade-offs

- [El recuento de palabras por regex es aproximado (no distingue idioma ni cuenta imágenes/tablas como "tiempo extra" de lectura)] → Aceptable para una estimación mostrada como "~N min"; no se presenta como una medición exacta.
- [`-webkit-line-clamp` no es un estándar CSS completo aunque tiene soporte universal en navegadores actuales] → Ya es la técnica usada en el componente actual; se mantiene por consistencia y compatibilidad probada en este proyecto.
- [Añadir `readingTimeMinutes` como cálculo/paso manual en tres páginas distintas duplica una pequeña porción de lógica de invocación] → Mitigado centralizando el cálculo en `src/utils/readingTime.ts`, de forma que las páginas solo leen y pasan datos, sin lógica propia.
- [La tarjeta destacada usa dos disposiciones distintas según el ancho de viewport (horizontal ≥769px, vertical por debajo), lo que introduce una rama de layout adicional a mantener] → Mitigado usando el mismo punto de corte (769px) que ya usa `blog-grid` para pasar de 2 a 1 columna, en vez de introducir un breakpoint nuevo; `min-height: 260px` evita que la columna de imagen se vea desproporcionadamente baja con contenido corto.

## Migration Plan

- Sin cambios de esquema: no requiere migrar posts existentes ni backfill.
- Despliegue como parte normal del flujo de la rama del cambio (`npm run build` + revisión de `dist/`); sin pasos de base de datos ni feature flag, dado que es un sitio estático sin backend.
- Rollback: revertir el commit/PR restaura `BlogCard.astro` y los tres puntos de uso a su versión anterior, sin romper la validación de contenido existente.
