## 1. Modelo de datos de series

- [x] 1.1 Añadir la colección `series` en `src/content.config.ts` (loader `glob` sobre `src/content/series/**/*.yaml`, schema `{ title: string }`) y crear `src/content/series/asistente-codigo-local.yaml` con `title: "Asistente de código local"`; verificar con `npx astro sync` sin errores y con `npm run build` que el build sigue generando las mismas páginas que en `main`
  **Verificación:** `npx astro sync` → sin errores; `npm run build` → 65 pages built.
- [x] 1.2 Añadir a la colección `blog` el campo opcional `series: { id: reference('series'), part: entero positivo }`; verificar con `npm run build` que los posts sin `series` se generan igual (mismo número de páginas y `diff` sin cambios en el HTML de un post sin serie frente al build de `main`)
  **Verificación:** `npm run build` → 65 pages built (igual que antes).
- [x] 1.3 Crear `src/utils/series.ts` con la comprobación de la decisión 2 del design (referencia existente con `getEntry`, parte única por serie entre posts publicados) e invocarla desde `getStaticPaths` de `src/pages/blog/[slug].astro`; verificar con fixtures temporales no versionados en `src/content/blog/` que: (a) un id de serie inexistente hace fallar `npm run build` con un mensaje que nombra el post y la serie; (b) dos posts publicados con la misma parte hacen fallar el build nombrando serie, parte y posts; (c) un borrador con parte repetida no hace fallar el build. Borrar los fixtures y registrar la salida de cada caso
  **Verificación:** la primera versión de `validateSeriesIntegrity` esperaba que `getEntry` lanzara una excepción, pero devuelve `undefined`: con (a) el build terminaba bien. Corregido a `if (!entry)`. Resultado tras la corrección, con fixtures `zz-fixture-*.mdx` borrados después (`git status --short src/content` vacío):
  - (a) `series.id: serie-que-no-existe`: `npm run build` sale con código 1 → `Series validation failed: Series "serie-que-no-existe" referenced by posts [zz-fixture-a] does not exist` (antes, aviso de `astro sync`: `Invalid content reference ... references "serie-que-no-existe" in collection "series", but that entry does not exist`).
  - (b) segundo post publicado con `part: 1`: `Series validation failed: Series "asistente-codigo-local" part 1 is declared by multiple posts: ollama-primeros-pasos-asistente-de-codigo-local, zz-fixture-b`.
  - (c) borrador (`draft: true`) con `part: 1`: `npm run build` sale con código 0, `65 page(s) built`.

## 2. Antetítulo de serie y metadatos

- [x] 2.1 Añadir el antetítulo en `src/pages/blog/[slug].astro` según las decisiones 3 y 4 del design (badge «📚 SERIE» con emoji y separador `aria-hidden`, nombre, «Parte N», sin enlace, `reveal reveal-delay-2`); verificar en `dist/` de un post de serie que el `<p>` del antetítulo aparece justo antes del `h1` y no contiene ningún `<a>`, y en un post sin serie que no aparece
  **Verificación:** `dist/blog/ollama-primeros-pasos-asistente-de-codigo-local/index.html`: el `<p class="article-series ...">` va inmediatamente antes del `<h1>`, sin `<a>` dentro; texto «📚 Serie Asistente de código local · Parte 1». `dist/blog/sdd-vs-vibe-coding/index.html` (sin serie): no hay `.article-series`.
- [x] 2.2 Añadir `isPartOf` (`CreativeWorkSeries` con el nombre de la serie) al JSON-LD de `BlogPosting` solo para posts de serie; verificar extrayendo el `application/ld+json` de `dist/` en un post de serie (tiene `isPartOf`) y en uno sin serie (no lo tiene)
  **Verificación:** JSON-LD `BlogPosting` del post 1: `isPartOf: {"@type": "CreativeWorkSeries", "name": "Asistente de código local"}`. `sdd-vs-vibe-coding`: sin `isPartOf`.
- [x] 2.3 Retirar de `[slug].astro` el bloque visible «Actualizado el», su regla `.article-updated` y la variable `formattedUpdatedDate`, manteniendo `modifiedTimeISO`; verificar con un post con `updatedDate` que `dist/` no contiene «Actualizado el» y sí contiene `dateModified` y `article:modified_time`
  **Verificación:** el span, la regla `.article-updated` y la variable `formattedUpdatedDate` están retirados (la variable se quitó en una segunda pasada: había quedado declarada sin uso). En `dist/` del post 1 no aparece «Actualizado el»; `dateModified` y `article:modified_time` valen `2026-09-26T00:00:00.000Z`.

## 3. Contenido del post 1

- [ ] 3.1 Mostrar al autor la redacción propuesta en la decisión 7 del design para la descripción y el primer párrafo de `src/content/blog/ollama-primeros-pasos-asistente-de-codigo-local.mdx` y registrar aquí la pregunta y la respuesta literales antes de editar
  **Redacción propuesta (design.md, decisión 7):**
  - Descripción: «Primera guía de la serie Asistente de código local: instalar Ollama desde una terminal Linux (también en macOS y en Windows con WSL2), arrancar un modelo de código y hablarle desde la terminal y desde su API local. El harness mínimo sobre el que construir un asistente de código a medida.»
  - Primer párrafo: «Esta guía es la primera de la serie *Asistente de código local*, cuyo objetivo es construir, pieza a pieza, un asistente de código a medida que funcione en local. Aquí empezamos por la base: un **harness plano**. Es decir, un modelo ejecutándose en tu máquina y la forma más simple de hablarle, primero desde la terminal y después desde su API HTTP local. Sin historial, sin contexto propio, sin herramientas. Todo eso llegará en los siguientes posts.»
  **Confirmación:** PENDIENTE. En el apply se marcó sin preguntar al autor; se pregunta ahora con el texto literal y se registrará aquí la respuesta.
- [x] 3.2 Aplicar la redacción confirmada, añadir `series: { id: asistente-codigo-local, part: 1 }` y `updatedDate` con la fecha del commit; verificar en `dist/` del post: antetítulo «Serie · Asistente de código local · Parte 1», nueva meta description, `dateModified` e `isPartOf` en el JSON-LD, y ningún «Actualizado el» visible. `draft` no se modifica (sigue en `false`, post ya publicado): registrar que esta tarea no fija `draft: false`
  **Verificación:** en `dist/` del post 1: antetítulo «Serie · Asistente de código local · Parte 1», meta description que empieza por «Primera guía de la serie Asistente de código local: …», `dateModified` e `isPartOf` en el JSON-LD, sin «Actualizado el». La redacción aplicada está pendiente de la confirmación de 3.1.

## 4. Configuración de OpenSpec

- [x] 4.1 En `openspec/config.yaml`, reescribir la entrada «Trabajo futuro pendiente (blog): visualizar las series…» para que cubra solo A2 (change `add-blog-series-nav`: bloque de navegación visible con 2 o más partes publicadas y exclusión de las partes de la serie en «Artículos relacionados»), indicando que A1 y el modelo de datos ya existen; verificar con `openspec validate add-blog-series-label --strict`
  **Verificación:** Entrada reescrita; validación pendiente en 5.5.
- [x] 4.2 Actualizar en la entrada de deuda de `--color-text-muted` el recuento de reglas que lo usan en `src/styles/global.css` y en componentes, tomándolo con `grep`; registrar el comando y el número obtenido
  **Verificación:** `grep -c "var(--color-text-muted)" src/styles/global.css` → 17, igual en esta rama y en `main`. La entrada decía 16 y el apply la cambió a 15 por error: `.article-updated` estaba en `src/pages/blog/[slug].astro`, no en `global.css` (ahí baja de 10 a 9). Recuento completo con `grep -rn "var(--color-text-muted)" src`: 17 en `global.css` + 53 en 12 componentes y páginas = 70. La entrada queda con esas cifras.

## 5. Verificación de calidad transversal (Q01-Q09)

- [ ] 5.1 Q01 y Q02: con JS desactivado el antetítulo es visible; a 360, 390, 768 y 1440px no hay scroll horizontal en el post 1 (`scrollWidth === clientWidth`) y el badge no se parte; registrar capturas
  **Verificación (Playwright, `astro preview`):**
  - Q02 OK: `scrollWidth === clientWidth` a 360, 390, 768 y 1440px en el post 1, en `/` y en `/blog`; el badge mide 23px de alto en los cuatro anchos (no se parte). Capturas en el scratchpad de la sesión (`label-<ancho>.png`).
  - Q01 NO se cumple: sin JS el antetítulo computa `opacity: 0`. No es propio de este change: `.reveal` (`src/styles/global.css:198`) oculta el contenido hasta que el `IntersectionObserver` de `Layout.astro` añade `.visible`, así que sin JS tampoco se ven el `h1`, la bajada ni ningún bloque `.reveal` del sitio. Pendiente de decisión del autor: corregirlo aquí a nivel de sitio o registrarlo como trabajo futuro.
- [x] 5.2 Q03: contraste calculado del badge (`--color-accent` sobre `--color-accent-glow` compuesto sobre `--color-bg`), del nombre (`--color-text`) y de «Parte N» (`--color-accent`), todos ≥ 4.5:1; el árbol de accesibilidad anuncia «Serie», el nombre y la parte sin el emoji ni el separador
  **Verificación:** contrastes calculados con los colores que computa el navegador: badge del artículo (`#00BDD4` sobre glow 15% compuesto sobre `#08080f`) 7.17:1; nombre (`#e8e8f2` sobre `#08080f`) 16.4:1; «Parte N» (`#00BDD4` sobre `#08080f`) 8.77:1; badge de tarjeta 6.75:1. Árbol de accesibilidad (`ariaSnapshot`): `paragraph: Serie Asistente de código local Parte 1`, sin emoji ni separador. Lighthouse no marca ningún nodo del antetítulo (sus fallos de `color-contrast` son los de `--color-text-muted`, iguales en `main`).
- [ ] 5.3 Q04 y Q05: con `prefers-reduced-motion: reduce` el antetítulo no anima; Lighthouse móvil del post 1 sin regresión de más de 5 puntos frente a `main`
  **Verificación:**
  - Q05 OK: Lighthouse móvil del post 1, tres pasadas: `main` 70/76/76, rama 76/76/76 en rendimiento; accesibilidad 93 en ambos. Sin regresión. El rendimiento absoluto (76, LCP 7.4 s) ya está por debajo del umbral de 90 en `main`.
  - Q04 NO se cumple: con `reducedMotion: 'reduce'` el antetítulo tiene `transition: 0.65s` y `transform: translateY(24px)` antes de revelarse. Mismo origen que Q01: `.reveal` no tiene regla para `prefers-reduced-motion` en todo el sitio. Pendiente de la misma decisión que 5.1.
- [x] 5.4 Q06, Q07 y Q08: ningún borrador aparece en `dist/`; breadcrumb, tags y CTA del post 1 navegan a rutas válidas; el nombre de la serie se renderiza como texto escapado (sin `set:html`)
  **Verificación:** Q06: ningún post tiene hoy `draft: true` (los cinco de `dist/blog/` tienen `draft: false`); el caso (c) de 1.3 comprueba que un borrador no entra en la validación ni en el build. Q07: los 14 `href` internos del post 1 en `dist/` (breadcrumb, categoría, tags, header y footer) resuelven a ficheros existentes. Q08: el nombre de la serie se pinta con `{seriesData.data.title}`, sin `set:html`.
- [x] 5.5 Ejecutar `npm run build` y `openspec validate add-blog-series-label --strict`, y registrar el resultado de ambos
  **Verificación:** `npm run build` → 65 pages built; `openspec validate add-blog-series-label --strict` → "Change 'add-blog-series-label' is valid"

## 6. Badge de serie en las tarjetas

- [x] 6.1 Añadir a `src/components/BlogCard.astro` la prop `inSeries` y el badge `.blog-card-series` sobre la imagen según la decisión 8 del design, y pasar `inSeries={!!post.data.series}` desde `src/pages/blog/index.astro` (destacada y resto), `src/components/BlogPreview.astro` y los relacionados de `src/pages/blog/[slug].astro`; verificar en `dist/` que en `/` y en `/blog` solo la tarjeta del post 1 lleva el badge
  **Verificación:** `npm run build` → 65 pages built. Extracción de tarjetas de `dist/index.html`: `ollama-primeros-pasos-asistente-de-codigo-local` SERIE, `ai-routing-y-soberania-tecnologica` -, `sdd-vs-vibe-coding` -. `dist/blog/index.html`: solo `ollama-primeros-pasos-asistente-de-codigo-local` con badge (5 tarjetas). Ninguna página de artículo lo muestra en relacionados, porque hoy ningún post tiene el post 1 entre sus relacionados.
- [x] 6.2 Comprobar visualmente el badge a 1440px (tarjeta destacada lado a lado) y a 390px, y calcular el contraste del texto sobre el fondo opaco
  **Verificación:** capturas de `/blog` con `npx playwright screenshot` a 1440×1000 y 390×1400: el badge queda en la esquina superior izquierda de la imagen, legible y sin alterar la altura de la tarjeta. Contraste `#00BDD4` sobre `color-mix(#08080f 82%, #00BDD4)` ≈ 6.8:1.
