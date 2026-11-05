# Proposal

## Why

Las series del blog ya tienen antetítulo en el artículo, badge en las tarjetas y bloque de navegación entre partes, pero no existe ningún destino propio para «la serie entera». Quien lee la parte 2 no tiene un sitio al que ir para ver de qué trata la serie, qué partes hay publicadas y qué contenido está por venir. Ahora hay una serie con dos partes publicadas, así que la página ya aporta valor. La hoja de ruta de la serie está hoy repartida entre `openspec/config.yaml` y el post 2, de modo que este change hace del registro de series la fuente de verdad pública de su contenido y su orden: el post 2 conserva su texto como foto de ese momento y enlaza a la página, y `config.yaml` se queda solo con lo que no es público.

## What Changes

- Nueva página `/blog/series/<id>` por cada serie con al menos una parte publicada, con cabecera (título, descripción e imagen de la serie) y una lista única del contenido de la serie en orden de parte. Cada entrada indica si está **Publicada** (con los datos y el enlace del post) o **Prevista** (con título y resumen definidos en la serie), sin fechas, y la página avisa de que la hoja de ruta es orientativa.
- El registro de series (`src/content/series/*.yaml`) amplía su esquema: `description` obligatoria, `image` opcional con respaldo de marca y `parts` obligatoria (lista ordenada de `{ title, summary }` cuya posición es el número de parte).
- La generación del sitio falla cuando un post publicado declara una parte mayor que la longitud de `parts` de su serie.
- El antetítulo de serie del artículo **deja de ser un texto sin enlace** y pasa a enlazar a la página de la serie. Esto modifica un requisito vigente.
- El bloque de navegación de la serie añade un enlace «Ver la serie completa» a la página de la serie.
- Datos estructurados (`CollectionPage` con la serie como `CreativeWorkSeries`) y breadcrumb `Inicio > Blog > <nombre de la serie>`; `og:image` con la imagen de la serie o el respaldo de marca.
- Se rellena el yaml de la serie existente `asistente-codigo-local` con su descripción y sus nueve partes (las dos publicadas y siete previstas, derivadas de la hoja de ruta ya validada en `openspec/config.yaml`).
- La sección «Lo que falta» del post 2 añade un enlace a la página de la serie. Su texto no se reescribe y su estado de publicación no cambia.
- Al archivar, se recorta la hoja de ruta de `openspec/config.yaml` para dejar solo lo que no es público (reglas de la serie, deuda y lo que no se promete), con confirmación previa.
- **Contrato de publicación:** no cambia. `draft` sigue siendo el único que decide qué aparece; la nueva página y la lista de partes publicadas se derivan de los posts no borrador, y ningún dato de un borrador aparece en la salida pública. No se introducen `status`, `approvedBy` ni `approvedAt`.
- Fuera de alcance: filtro por serie en el listado y banda de series en `/blog`; se retoman cuando exista más de una serie.

## Capabilities

### New Capabilities

Ninguna. Los requisitos de series ya viven en la capacidad `blog` y la página de serie pertenece a ese mismo comportamiento.

### Modified Capabilities

- `blog`: se añaden los requisitos de la página de serie, del contenido del registro de series (descripción, imagen opcional y partes ordenadas), de su validación de integridad y del enlace «Ver la serie completa» en la navegación de la serie; y se modifica «Antetítulo de serie en la página de artículo» para que el antetítulo sea un enlace a la página de la serie.

## Impact

- **Código:** nueva ruta `src/pages/blog/series/[id].astro`; `src/content.config.ts` (esquema de `series`); `src/utils/series.ts` (validación de partes fuera de `parts` y combinación de partes publicadas y previstas); `src/pages/blog/[slug].astro` (antetítulo enlazado); `src/components/SeriesNav.astro` (nuevo enlace).
- **Contenido:** `src/content/series/asistente-codigo-local.yaml` con `description` y `parts`; imagen de serie opcional en `public/images/series/` (sujeta a la regla de imágenes optimizadas); `src/content/blog/harness-propio-desde-cero-el-bucle.mdx` (enlace a la página de la serie).
- **Dependencias:** ninguna nueva.
- **Compatibilidad:** una serie sin `description` o sin `parts` hace fallar el build, por lo que el yaml existente se actualiza en este mismo change. Las URL existentes no cambian.
- **Reversión:** revertir el change restaura el antetítulo sin enlace, el esquema anterior y el post 2 sin el enlace; la ruta `/blog/series/<id>` pasa a 404.
