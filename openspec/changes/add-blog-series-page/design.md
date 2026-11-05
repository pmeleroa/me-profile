# Design

## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `src/content/series/*.yaml` (colección `series`, loader `glob`) solo define `title`. Los posts referencian la serie con `series: { id: reference('series'), part }`.
- `src/utils/series.ts` ya concentra la lógica de series: `seriesIdOf`, `getPublishedSeriesParts` (que exige recibir posts ya filtrados por `!data.draft`, un único punto de decisión de publicación) y `validateSeriesIntegrity`, que hoy se invoca desde `getStaticPaths` de `src/pages/blog/[slug].astro`.
- No existe ninguna ruta bajo `/blog/series/`. `/blog/[slug]` tiene un solo segmento, así que `/blog/series/<id>` no colisiona con ella.
- El sitio es estático (Astro, sin backend ni CMS), y el contrato de publicación es `draft`.

## Goals / Non-Goals

**Goals:**
- Que el registro de series sea la fuente de verdad pública del contenido y el orden de la serie, y que el estado «Publicada/Prevista» se derive de los posts, sin pasos manuales al publicar.
- Reutilizar `utils/series.ts` y el patrón de validación en build ya existente, sin dependencias nuevas.

**Non-Goals:**
- Filtro por serie o banda de series en `/blog` (se retoma con más de una serie).
- Una página índice `/blog/series`. No se genera; el breadcrumb no la enlaza.
- Cambiar tarjetas, `BlogPreview` o «Artículos relacionados».
- Reescribir la hoja de ruta que publica el post 2 («Lo que falta»): solo gana un enlace a la página de la serie (decisión 9).
- Editar `config.yaml` durante la implementación: su hoja de ruta se recorta al archivar (decisión 9).
- Corregir `.reveal` o `--color-text-muted` a nivel de sitio: siguen siendo changes propios (decisión 10).

## Decisions

### 1. El orden de `parts` es el número de parte
`series` pasa a `{ title, description, image?, parts: [{ title, summary }] }` (`parts` con mínimo 1 elemento). El número de parte de cada elemento es `índice + 1`.

- **Por qué:** el autor define el orden una sola vez y no hay números que mantener ni renumerar por elemento. Coincide con la decisión del usuario de que el orden de publicación sea el definido en la serie, sin fechas.
- **Alternativas:** (a) `parts` con `part` explícito: duplica el dato que ya está en cada post y permite incoherencias. (b) lista `upcoming` solo con lo no publicado: obliga a retirar la entrada a mano al publicar y no permite detectar la entrada obsoleta.
- **Consecuencia:** las partes publicadas también figuran en el yaml, aunque su título y resumen quedan en segundo plano porque la página usa los datos del post.

### 2. Estado derivado de los posts, no almacenado
Un helper nuevo en `utils/series.ts` (p. ej. `buildSeriesOutline(entry, publishedPosts)`) recorre `entry.data.parts` y, para cada posición N, busca entre los posts ya filtrados por `!draft` el que declara `series.part === N`: si existe, devuelve un elemento «publicado» con título, descripción y enlace del post; si no, uno «previsto» con los datos del yaml.

- **Por qué:** mantiene un único punto de decisión de publicación (el filtro `!draft` que el llamador aplica) y hace imposible que un borrador se filtre a la página, que es el contrato que el spec exige.
- **Alternativa descartada:** campo `status` en el yaml: reintroduce el contrato de publicación por otra vía y exige edición manual.

### 3. Validación en build, ampliando la existente
`validateSeriesIntegrity` añade la comprobación «parte publicada fuera de `parts`»: error con serie, número de parte y post. La existencia de la serie y la unicidad de partes no cambian. El schema zod de `series` falla por sí mismo si faltan `description`, `parts` o el título/resumen de un elemento.

- **Por qué:** es el mismo estilo de control que ya existe y falla el build antes de desplegar, en vez de producir una página incoherente.
- **Dónde se invoca:** desde `getStaticPaths` de `/blog/[slug]` (como hasta ahora) y también desde `getStaticPaths` de la página de serie, para que un build que solo generase una de las dos rutas no se salte la comprobación.

### 4. Ruta `src/pages/blog/series/[id].astro`
`getStaticPaths` devuelve `[]` si `sections.blog` está desactivado, igual que `/blog/[slug]`. Si no, calcula los ids de serie a partir de los posts publicados (`!draft`) y genera una página por cada uno; una serie sin partes publicadas no genera ruta y da 404.

- **Alternativa:** generar una página por cada entrada del registro. Descartada: una serie solo con borradores publicaría una página vacía y expondría su existencia.
- **Breadcrumb:** `Inicio > Blog > <nombre de la serie>`, empezando por «Inicio» como el breadcrumb del artículo. No se incluye «Series» porque no existe `/blog/series`, y un tramo sin destino sería un enlace muerto o un elemento incompleto en `BreadcrumbList`.

### 5. Enlaces desde el post
- **Antetítulo** (`[slug].astro`): solo el nombre de la serie es un enlace a `/blog/series/<id>`; el badge «Serie» y «Parte N» siguen siendo texto. Se mantienen los estilos de foco visible y subrayado ya usados en `SeriesNav` para cumplir «distinguirse sin depender solo del color».
- **`SeriesNav`**: nuevo enlace «Ver la serie completa» dentro del bloque existente, que recibe el `id` de la serie como prop nueva. No cambia la regla de visibilidad (2 o más partes publicadas).

### 6. Imagen de la serie y respaldos
`image` es opcional en el schema. Se sirve como ruta raíz-relativa desde `public/images/series/<id>.webp`, igual que las imágenes de los posts, sin pasar por `astro:assets`.

- **Justificación de servir desde `public/`:** la URL debe ser estable y absoluta para `og:image`, y el patrón ya es el del blog; no hay transformaciones por contexto que justifiquen la pipeline de imágenes.
- **Formato (regla del proyecto):** WebP, 1200x630 (su mayor contexto de uso es `og:image`; en cabecera se muestra a un tamaño menor), con un peso en el orden de las imágenes actuales del blog (50-250 KB). Si se aporta un archivo en otro formato, se convierte antes de commitearlo.
- **Respaldos:** cabecera con el placeholder de marca (`logo.png`) como el de `BlogCard`; `og:image` con `/og-image.png`, el valor por defecto de `Layout`. Así la serie actual es válida aunque la imagen se aporte después.
- **Alt:** la imagen acompaña al nombre de la serie, que es texto visible, por lo que se renderiza con `alt=""`.

### 7. Dependencias y contenido técnico
Sin dependencias nuevas: Astro, colecciones de contenido y los componentes existentes. No se añade contenido técnico con comandos de terminal, por lo que la regla de Linux/macOS/WSL2 no aplica a este change.

### 8. Contenido inicial del yaml
`asistente-codigo-local.yaml` se rellena literalmente con estos textos, aprobados por el autor. Los títulos y resúmenes de las partes 3 a 9 proceden únicamente de la hoja de ruta ya validada en `openspec/config.yaml`; las partes 1 y 2 repiten el título del post y un resumen breve basado en su descripción.

**`description`:** «Guías prácticas para montar y entender un asistente de código que corre en tu propia máquina, con modelos locales.»

| Parte | `title` | `summary` |
|---|---|---|
| 1 | Ollama: primeros pasos hacia un asistente de código local | Instalar Ollama, arrancar un modelo de código y hablarle desde la terminal y desde su API local. |
| 2 | Un harness propio desde cero: el bucle y cómo falla | Un harness de solo lectura para entender qué ofrece a los agentes y cómo falla su bucle. |
| 3 | Contexto | Qué pasa cuando la conversación llena la ventana: historial, recorte, limpieza, compaction e instrucciones del proyecto. |
| 4 | Escritura y permisos | Las herramientas de escritura y búsqueda (Write, Edit, Grep) y el sistema de permisos que las controla. |
| 5 | Ejecución y seguridad | Ejecutar comandos (Bash), procesos en segundo plano y aislar la ejecución con un sandbox en Linux y macOS. |
| 6 | Extensibilidad | Skills, hooks y servidores MCP, incluida la autenticación OAuth de los servidores remotos. |
| 7 | Delegación | Subagentes: delegar parte del trabajo en otros agentes. |
| 8 | Sesiones y evaluación | Transcripciones, retomar sesiones, replay, registro de lo que hace el agente y evals. |
| 9 | Interfaz e integración | Una TUI y un modo sin interfaz para usar el harness desde scripts y CI. |

Quedan fuera el proveedor de Anthropic, los gateways y «varios modelos», que `config.yaml` marca como sin parte asignada o fuera de la serie.

### 9. El registro de series es la fuente de verdad pública
La hoja de ruta existe hoy en `config.yaml` y en el post 2, y este change añade el yaml de la serie. El reparto de responsabilidades queda así:

- **`series/*.yaml`:** fuente del contenido y el orden de la serie. Cualquier cambio en la hoja de ruta se hace aquí.
- **Post 2, «Lo que falta»:** conserva su texto como foto de ese momento y, al final de la introducción de la sección, añade: «La hoja de ruta actualizada está en la [página de la serie](/blog/series/asistente-codigo-local).». No se tocan `draft` ni `updatedDate`, porque un enlace no cambia el contenido de la guía.
- **`config.yaml`:** al archivar, se recorta para dejar solo lo que no es público (reglas de la serie, deuda y lo que no se promete), con confirmación previa.

- **Por qué:** si «Ejecución y seguridad» se divide en dos posts, solo hay que actualizar un sitio, y quien lee el post 2 llega a la versión vigente.
- **Alternativa descartada:** mantener las tres copias. Es más barata ahora, pero se irían desalineando.

### 10. La página de serie no usa `.reveal` ni `--color-text-muted`
La cabecera de `/blog`, el patrón más cercano, usa ambos. Copiarlo incumpliría dos requisitos de la página:

- **`.reveal`** deja el contenido en `opacity: 0` hasta que JavaScript añade `.visible`, lo que incumple el escenario «Navegador sin JavaScript». La página aparece sin animación de entrada.
- **`--color-text-muted`** da 3.93:1 sobre `--color-bg`, por debajo del 4.5:1 exigido. El texto secundario usa un token que cumpla ese contraste, comprobado en la tarea 3.4.

- **Alternativa descartada:** corregir ambos a nivel de sitio en este change. Ya están registrados como trabajo futuro propio y ampliarían mucho el alcance.
- **Límite conocido:** el antetítulo enlazado y el resto de la cabecera del artículo mantienen `.reveal`, así que sin JavaScript siguen invisibles. Es un problema previo que este change no empeora, y el escenario sin JavaScript de la página de serie no lo cubre.

## Risks / Trade-offs

- **[Las partes previstas pueden cambiar de número]** (p. ej. «Ejecución y seguridad» puede dividirse en dos posts) → La nota visible de hoja de ruta orientativa lo declara; renumerar es reordenar el yaml en un solo sitio. Las posiciones de partes ya publicadas no se mueven nunca porque las fija el `series.part` del post.
- **[Duplicación inocua de partes publicadas en el yaml]** → El post prevalece; el dato del yaml solo es respaldo. Si divergen, la página muestra el del post.
- **[Falta de una parte en `parts` bloquea publicar un post]** → Es intencionado: obliga a mantener el yaml como definición completa. El mensaje de error nombra serie, parte y post.
- **[Descripción y resúmenes son contenido nuevo]** → Los aprueba el autor y no prometen partes, temas cerrados ni fechas; lo no validado queda fuera, según las reglas del proyecto.
- **[Un post con slug `series`]** → No colisiona con `/blog/series/<id>` (distinta profundidad) y no hay índice `/blog/series`.
- **[Serie con una sola parte publicada]** → La página existe pero es breve; se acepta porque el antetítulo ya enlaza a ella desde la primera parte y evita estados intermedios.

## Migration Plan

1. Actualizar el schema de `series` y el yaml existente en el mismo commit, para que el build no quede roto entre medias.
2. Añadir la ruta, el helper y la validación.
3. Enlazar desde el antetítulo, `SeriesNav` y la sección «Lo que falta» del post 2.
4. Verificar con `npm run build` y `openspec validate add-blog-series-page --strict`.
5. Reversión: revertir el change restaura el esquema anterior, el antetítulo sin enlace y el post 2 sin el enlace; `/blog/series/<id>` pasa a 404. No hay migración de datos.

## Open Questions

- La imagen real de la serie queda pendiente de que el autor la aporte; mientras tanto se usan los respaldos de marca, y añadirla después es solo un archivo y una línea en el yaml.
