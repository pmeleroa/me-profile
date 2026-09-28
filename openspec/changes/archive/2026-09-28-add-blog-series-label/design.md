## Context

La colección `blog` se define en `src/content.config.ts` con Content Layer API (`glob` sobre `src/content/blog/**/*.mdx`) y un schema zod. No existe ninguna otra colección. `src/pages/blog/[slug].astro` genera cada página de artículo desde `getStaticPaths`, filtrando borradores con `getCollection('blog', ({ data }) => !data.draft)`, y calcula ahí el JSON-LD (`BlogPosting`, `BreadcrumbList`) y las props de `Layout.astro` (`publishedTime`, `modifiedTime` → `article:*_time`).

La cabecera del artículo ya tiene tres tipos de píldora (categoría con borde en su color, tiempo de lectura con fondo gris, tags en mono) y la categoría «Análisis» usa el mismo cian que `--color-accent`. `--color-text-muted` (#6b6b90 sobre #08080f, 3.93:1) no cumple AA y está registrado como deuda en `openspec/config.yaml`.

Ver proposal.md - Why / What Changes para la motivación y el alcance, y `specs/blog/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**
- Un modelo de datos de series que sirva sin migraciones para A2, el badge en tarjetas y `/blog/series/<id>` cuando lleguen.
- Errores de datos de serie (id inexistente, parte repetida) detectados en build, no en producción.
- Un antetítulo que no se confunda con la categoría ni con los tags, ni parezca clicable.

**Non-Goals:**
- No se crea componente propio para el antetítulo: hoy tiene un solo consumidor. El badge de las tarjetas comparte lenguaje visual pero no marcado (va superpuesto a una imagen y necesita fondo opaco), así que tampoco justifica un componente compartido; se extraerá cuando A2 lo necesite.
- No se añade `url` al `CreativeWorkSeries` del JSON-LD, porque aún no existe página de la serie.
- No se corrige `--color-text-muted` (tiene su propio change pendiente); solo se evita usarlo en lo nuevo.

## Decisions

**1. Colección `series` con un archivo YAML por serie, referenciada desde `blog`.**
`src/content/series/<id>.yaml` con loader `glob` (`**/*.yaml`) y schema `{ title: string }`; el id es el nombre del archivo, igual que el slug de los posts. En `blog`: `series: z.object({ id: reference('series'), part: z.number().int().positive() }).optional()`. Alternativa descartada: `src/data/series.ts` con `z.enum` sobre sus claves, en la línea de `blogCategories.ts`. Es más ligero, pero una futura página `/blog/series/<id>` o una descripción por serie obligarían a rehacerlo como colección. Alternativa descartada: `seriesTitle` repetido en el frontmatter de cada parte, porque duplica el nombre y permite que dos partes lo escriban distinto.

**2. `part` explícito, con unicidad comprobada en build.**
El número de parte no se deriva del orden de publicación: así «Parte 2» no cambia si una parte se publica fuera de orden o si un borrador pasa a publicado. zod valida entradas de una en una y no puede comparar posts entre sí, así que la unicidad se comprueba en una función de `src/utils/series.ts` que recibe los posts publicados, agrupa por serie y lanza un `Error` con serie, parte e ids implicados si hay duplicados. Esa misma función resuelve cada referencia con `getEntry` y lanza un error si la serie no existe, como segunda barrera independiente del comportamiento de `reference()` (ver Risks). Se invoca desde `getStaticPaths` de `[slug].astro`, que ya recorre los posts publicados, de modo que un error rompe `npm run build`.

**3. Antetítulo en línea dentro de `[slug].astro`.**
Marcado: un `<p class="article-series">` antes del `h1`, con `<span class="article-series-badge"><span aria-hidden="true">📚</span> Serie</span>`, el nombre y «· Parte N». El separador `·` va con `aria-hidden` para que el lector de pantalla no lo lea. Entra con la misma clase `reveal reveal-delay-2` que el `h1`, para que aparezcan juntos, sin añadir un escalón de animación nuevo.

**4. Estilo del badge «B1»: fondo suave, esquinas pequeñas, sin borde.**
Badge: `background: var(--color-accent-glow)`, `color: var(--color-accent)`, `border-radius: var(--r-sm)`, texto en mayúsculas de 0.68rem con `letter-spacing: 0.08em` (el mismo lenguaje tipográfico que la categoría). Nombre de la serie en `--color-text`, peso 600; «Parte N» en `--color-accent`. Se eligió sobre una maqueta con los tokens reales en escritorio y a 360px. Alternativas descartadas: píldora con relleno (sería la cuarta píldora de la cabecera y, con «Análisis», dos píldoras cian seguidas) y píldora solo con borde (idéntica a la categoría «Análisis» y con aspecto de filtro clicable). Sin estados `:hover` ni `cursor: pointer`, porque no es un enlace. Emoji 📚 elegido por ser genérico para cualquier serie y no repetir los de la cabecera (📅 ⏱️ 🔗).

**5. `isPartOf` sin `url`.**
`isPartOf: { '@type': 'CreativeWorkSeries', name: <title de la serie> }` solo cuando el post tiene serie. La `url` se añadirá con la página de la serie; hasta entonces no hay URL canónica a la que apuntar.

**6. `updatedDate` deja de pintarse pero sigue en metadatos.**
Se retira el `<span class="article-updated">` de la fila de metadatos, su regla CSS y la variable `formattedUpdatedDate`. Se mantiene `modifiedTimeISO`, que alimenta `dateModified` y `article:modified_time`. Hoy ningún post define `updatedDate`, así que no hay cambio visible en posts existentes salvo el post 1, que es el primero que lo usa. Alternativa descartada: un campo nuevo que nunca se renderiza (duplicaría la traza de git sin que la vieran los buscadores).

**7. Ajuste de redacción del post 1.**
Propuesta (el autor la confirma en apply, antes de commitear):
- Descripción: «Primera guía de la serie Asistente de código local: instalar Ollama desde una terminal Linux (…)», con el resto de la frase sin cambios.
- Primer párrafo: «Esta guía es la primera de la serie *Asistente de código local*, cuyo objetivo es construir, pieza a pieza, un asistente de código a medida que funcione en local. (…)», con el resto del párrafo sin cambios.
`updatedDate` se fija a la fecha del commit que hace el ajuste. `draft` sigue en `false`: el post ya está publicado y este change no toca su contrato de publicación.

**8. Badge de serie en las tarjetas: prop booleana y fondo opaco sobre la imagen.**
`BlogCard` recibe `inSeries?: boolean` (por defecto `false`) y, si es `true`, pinta dentro de `.blog-card-media` un `<span class="blog-card-series"><span aria-hidden="true">📚</span> Serie</span>` con `position: absolute` en la esquina superior izquierda (`0.75rem`). Los tres consumidores pasan `inSeries={!!post.data.series}`; la tarjeta no necesita el nombre ni la parte, así que no resuelve la referencia con `getEntry`. Estilo: mismo texto que B1 (acento, mayúsculas, `letter-spacing: 0.08em`, `--r-sm`), pero con fondo opaco `color-mix(in srgb, var(--color-bg) 82%, var(--color-accent))` y borde `--color-border-2`. El `--color-accent-glow` de B1 es translúcido y sobre una imagen el contraste dependería de la imagen; con el fondo opaco el contraste calculado del texto es ≈ 6.8:1. Se muestra también en «Artículos relacionados», porque es el mismo componente y así la tarjeta es igual en todas partes. El enlace de la tarjeta lleva `aria-label` con el título, así que el badge no se anuncia en lectores de pantalla; es el mismo comportamiento que ya tienen la categoría y los metadatos de la tarjeta. Alternativas descartadas: badge en la fila de cabecera junto a la categoría (compite con la categoría y la fecha, y en móvil la fila se parte) y el badge B1 translúcido tal cual (ilegible sobre imágenes claras).

## Risks / Trade-offs

- [`reference()` podría no hacer fallar el build ante un id inexistente en la versión de Astro del proyecto] → La función de la decisión 2 comprueba cada referencia con `getEntry` y lanza un error propio; la tarea de verificación lo prueba con un fixture temporal.
- [La comprobación de unicidad solo corre al generar `/blog/[slug]`; si `sections.blog` estuviera desactivado no se ejecutaría] → Aceptado: con el blog desactivado ninguna página de serie se publica, así que no hay nada incoherente que mostrar.
- [El emoji se dibuja distinto según el sistema operativo] → Es decorativo y queda fuera del árbol de accesibilidad; el texto «Serie» lleva el significado.
- [Con un nombre de serie largo, el antetítulo ocupa dos líneas a 360px] → Aceptado y comprobado en la maqueta: el badge no se parte (`white-space: nowrap`) y el resto fluye con `flex-wrap`.
- [Cambiar la descripción del post 1 altera su meta description y lo que muestran buscadores y redes en caché] → Cambio mínimo de redacción; `dateModified` informa a los buscadores de la modificación.

## Migration Plan

- Datos: se crea `src/content/series/asistente-codigo-local.yaml` y el post 1 declara `series: { id: asistente-codigo-local, part: 1 }`. Ningún otro post necesita cambios, porque `series` es opcional.
- Configuración: en `openspec/config.yaml`, la entrada de trabajo futuro de series pasa a describir solo A2 (change `add-blog-series-nav`, con la exclusión de las partes de la serie en «Artículos relacionados»), y la entrada de deuda de `--color-text-muted` actualiza su recuento de reglas tras retirar `.article-updated` (el número exacto se toma con `grep` en apply).
- Rollback: `git revert` de los commits del change. Revertir el commit de contenido devuelve la redacción y el frontmatter anteriores del post 1; revertir el de código retira la colección y el antetítulo. No hay datos externos que migrar.
