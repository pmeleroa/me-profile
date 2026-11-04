# Proposal

## Why

La serie «Asistente de código local» va a tener su segunda parte, pero hoy las partes no se conectan entre sí: el antetítulo indica «Parte N» como texto sin enlace y solo «Artículos relacionados» puede acercar otra parte, por tags y sin orden. Quien termina una parte no tiene forma directa de seguir leyendo. Este bloque (A2) quedó pendiente en `add-blog-series-label` hasta que hubiera 2 o más partes, y debe estar listo cuando se publique la parte 2.

## What Changes

- La página de artículo (`/blog/[slug]`) de un post de serie muestra, entre el contenido y el bloque de autor, un bloque de navegación con el índice de partes publicadas y los enlaces a la parte anterior y a la siguiente.
- El bloque aparece solo cuando la serie tiene 2 o más partes publicadas. Los borradores no se listan ni cuentan, para no anunciar partes que aún no existen.
- «Artículos relacionados» deja de incluir partes de la misma serie que el post actual, porque ya están en el bloque nuevo y ocuparían huecos de otros artículos.
- El orden de la página de artículo incorpora el bloque nuevo.
- Configuración: la entrada de trabajo futuro sobre series en `openspec/config.yaml` deja de listar A2 como pendiente y conserva solo la página `/blog/series/<id>` y el filtro en el listado.
- Fuera de alcance: página `/blog/series/<id>`, filtro por serie en el listado, enlace en el antetítulo y cambios en el JSON-LD.

Contrato de publicación: no cambia. `draft` sigue decidiendo qué posts se publican; el bloque solo lee ese resultado.

Efecto al integrarlo: ninguno visible en la navegación mientras la serie tenga una sola parte publicada. El post 1 no muestra el bloque hasta que se publique la parte 2.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `blog`: se añaden requisitos del bloque de navegación de la serie (visibilidad, índice de partes, enlaces anterior y siguiente) y se modifican «Selección de artículos relacionados por tags compartidos» (excluye partes de la misma serie) y «Orden de la estructura de la página de artículo» (incluye el bloque).

## Impact

- Código: `src/pages/blog/[slug].astro` (cálculo de partes, exclusión en relacionados y uso del bloque), `src/components/SeriesNav.astro` (nuevo) y `src/utils/series.ts` (helper de partes publicadas).
- Configuración de OpenSpec: `openspec/config.yaml` (`rules.design`, una entrada de trabajo futuro).
- Sin dependencias npm nuevas, sin JavaScript de cliente nuevo y sin cambios en el schema de contenido.
- Depende de que exista la parte 2 solo para tener efecto visible. Se puede integrar antes que `add-harness-loop-post`.
