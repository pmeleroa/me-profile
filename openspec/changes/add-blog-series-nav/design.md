# Design

## Context

Ver `proposal.md` - Why. `add-blog-series-label` dejó el modelo de datos (`series: { id, part }` en `blog`, colección `series`, `validateSeriesIntegrity`) y el antetítulo. `src/pages/blog/[slug].astro` ya carga los posts publicados en `allPosts` y resuelve el id de la serie con `typeof post.data.series.id === 'string' ? … : ….id`, la misma expresión que repite `src/utils/series.ts`.

El proyecto no tiene runner de tests: la verificación es `npm run build`, inspección de `dist/` y fixtures temporales no versionados.

## Goals / Non-Goals

**Goals:**
- Que quien termina una parte pueda seguir leyendo, y ver cuántas partes hay publicadas.
- Que el bloque se pueda integrar antes que la parte 2 sin efecto en la navegación.

**Non-Goals:**
- Página `/blog/series/<id>`, filtro por serie y enlace en el antetítulo.
- Mostrar partes futuras o el total previsto de la serie.
- Arreglar el token `--color-text-muted` o la animación `.reveal`, que ya tienen su propia entrada de trabajo futuro.

## Decisions

**Bloque después del contenido y antes del autor.** Es el punto donde el lector decide qué leer a continuación. Alternativas descartadas: en la cabecera (empuja el contenido y quien llega busca el artículo, no el índice) y duplicarlo arriba y abajo (más código para el mismo destino; el antetítulo ya sitúa al lector).

**Componente nuevo `src/components/SeriesNav.astro`.** Recibe el título de la serie, las partes y el id del post actual, y calcula anterior y siguiente. Sigue el patrón de `BlogCard` y `ShareButton` y evita añadir más estilos a una página de casi 700 líneas. Sin dependencias nuevas.

**Helper en `src/utils/series.ts`.** Una función `seriesIdOf(post)` sustituye la expresión duplicada, y otra `getPublishedSeriesParts(posts, seriesId)` devuelve las partes en orden ascendente. Recibe `allPosts`, ya filtrado por `!data.draft`, de modo que el contrato de publicación tiene un único punto de decisión. No añade lecturas de colección.

**Umbral dentro de la página, no del componente.** `[slug].astro` solo renderiza `SeriesNav` con 2 o más partes. Así el componente no tiene que representar un estado vacío.

**Sin renumerar partes.** Anterior y siguiente se calculan por posición entre las partes publicadas, y el texto muestra el número declarado. Un hueco (parte 2 en borrador) no se oculta cambiando el número de la parte 3. Se admite porque el build ya garantiza que no hay dos partes publicadas con el mismo número.

**Exclusión en relacionados solo para la misma serie.** Una parte de otra serie sigue siendo un artículo relacionado legítimo. La exclusión aplica aunque el bloque no se muestre: con una sola parte publicada no hay nada que excluir, así que no cambia el resultado actual. El filtro va antes del corte a 3, para que los huecos los ocupen otros posts.

**Sin `.reveal`.** Con JavaScript desactivado, `.reveal` deja el contenido en `opacity: 0`, y la navegación es contenido esencial (Q01). El bloque se renderiza siempre visible y tampoco necesita ninguna regla de movimiento (Q04), igual que `.article-body`.

**Contraste con `--color-text` y `--color-accent`.** No se usa `--color-text-muted` en texto, porque da 3.93:1 sobre `--color-bg` (deuda ya registrada). Los enlaces se subrayan, como los del cuerpo del artículo, para no depender solo del color. La parte actual se marca con `aria-current="page"` y un texto visible, «Estás aquí».

**Marcado semántico.** `<nav aria-label="Serie: {título}">` con `<ol>` para el índice. Las direcciones se escriben con texto («Parte anterior», «Parte siguiente»), y cualquier flecha es decorativa con `aria-hidden`.

## Risks / Trade-offs

- [Parte 2 mal integrada: con fixtures el bloque funciona, pero el contenido real lo rompe] → Mitigación: `add-harness-loop-post` comprueba el bloque en su propia QA con la parte 2 real.
- [Quitar partes de relacionados vacía esa sección en un post con pocos candidatos] → Aceptado: la sección ya se omite sin candidatos, y las otras partes están en el bloque.
- [Las clases `.reveal` de otros bloques se pierden al cambiar el marcado] → Mitigación: no se toca el marcado existente salvo el filtro de relacionados y la inserción del bloque; se compara el HTML de un post sin serie con el de `main`.

## Migration Plan

Sin migración de contenido: no cambia el schema ni el frontmatter. Rollback: `git revert` del commit de la PR; el resultado vuelve al antetítulo actual sin navegación.
