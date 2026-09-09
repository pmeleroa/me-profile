## Context

Ver proposal.md - Why. El listado de `/blog` (`src/pages/blog/index.astro`) filtra hoy solo por `category` mediante un script cliente que alterna `display:none` sobre `data-category`, sin estado en la URL. El campo `tags` ya existe en el esquema (`content.config.ts`) y en cada post, pero solo se pinta como texto estático en `src/pages/blog/[slug].astro`. No hay backend: todo el filtrado es estático (build-time) + interacción cliente (runtime), sin librería de estado ni router adicional.

## Goals / Non-Goals

**Goals:**
- Filtrar `/blog` por tags (multi-select, OR) combinado en AND con la categoría activa.
- Reflejar el estado de ambos filtros en la URL (compartible, sobrevive a recarga).
- Exponer los tags del artículo como navegación hacia el listado filtrado.
- Mantener el hero de `/blog` visualmente ligero por defecto (panel colapsable).

**Non-Goals:**
- No se rediseña ni elimina el concepto de `category` (alcance de un change futuro).
- No se añade búsqueda de texto libre, paginación ni ordenación distinta a la actual.
- No se muestran tags en `BlogCard` ni en el listado de tarjetas.
- No se persiste el filtro en `localStorage` ni en ningún almacenamiento fuera de la URL.

## Decisions

**1. Filtro de tags aditivo, category intacto.**
Se implementa como una capability nueva (`blog`) sin tocar el comportamiento, colores ni semántica de `category`. Alternativa descartada: sustituir `category` por `tags` en este mismo change — se rechazó porque el criterio final de categorización aún no está decidido por el autor, y mezclar ambos alcances habría acoplado esta entrega a esa decisión pendiente.

**2. Selección múltiple de tags con OR, combinada en AND con categoría.**
Un post puede tener varios tags, así que restringir a selección única (como category) sería artificialmente limitante. Se eligió OR entre tags (más tags activos = más resultados, natural para explorar) en vez de AND estricto entre tags (con el volumen actual de posts, un AND estricto vacía el listado con facilidad). La combinación entre el eje `category` y el eje `tags` sí es AND, porque son dimensiones independientes (patrón estándar de filtros facetados).

**3. Estado de filtros en la URL vía query params, para category y tags.**
Se sustituye el patrón actual "solo en memoria" por query params (p. ej. `?category=Arquitectura&tags=sdd,arquitectura`) leídos y escritos desde el mismo script cliente, usando `URLSearchParams` y `history.replaceState`/`pushState`. Alternativa descartada: mantener category en memoria y solo tags en la URL — se rechazó por inconsistencia (dos mecanismos de estado distintos para dos filtros que conviven en la misma UI) y porque el usuario pidió explícitamente extenderlo a ambos.

**Push perezoso por sesión de edición de tags, no por click.** Cada click de categoría sigue haciendo `pushState` (es una decisión de un solo paso). Para tags, hacer `pushState` en cada click generaba una entrada de historial por tag marcado: seleccionar 3 tags obligaba a pulsar "atrás" 3 veces para salir del filtro. Se corrigió con un modelo de "sesión": el primer tag que se marca tras abrir el panel hace `pushState` (preservando intacto el estado anterior a abrir el panel); los tags siguientes marcados en esa misma apertura hacen `replaceState` sobre esa misma entrada. Abrir y cerrar el panel sin tocar ningún tag no toca el historial. Resultado: un solo "atrás" deshace toda la selección de tags de una sesión, y una categoría cambiada aparte sigue siendo un paso de "atrás" independiente. Se descartó un primer intento que hacía `replaceState` en todos los clicks de tags sin excepción: al no haber ningún `pushState` de por medio, ese approach sobrescribía la propia entrada previa a abrir el panel, dejando nada a lo que volver con "atrás".

**4. Control desplegable para tags, a la derecha del filtro de categoría, con cierre automático.**
De las opciones visuales evaluadas (fila secundaria siempre visible, panel colapsable, dropdown único, barra fuera del hero) se partió del panel colapsable. Tras probarlo en local, se refinó a un patrón de dropdown/combobox: el control "Filtrar por tags" se coloca en la misma fila que el filtro de categoría, inmediatamente a su derecha (en vez de en una fila propia debajo), y su panel se posiciona de forma flotante (`position: absolute`) anclado al control, cerrado por defecto. El hero se mantiene tan ligero como hoy por defecto, y el panel solo aparece cuando el visitante interactúa.

El control muestra el conteo de tags activos cuando está cerrado, y — a diferencia del primer borrador — el panel ya no requiere que el visitante lo cierre explícitamente: se colapsa automáticamente en cuanto se interactúa fuera de su contexto (click fuera, incluida la selección de otro filtro) o se pulsa Escape, siguiendo el patrón estándar de un menú desplegable. Seleccionar un tag dentro del propio panel no lo cierra, para permitir marcar varios tags seguidos.

**Sin auto-expansión al llegar con tags en la URL.** El primer borrador expandía el panel automáticamente al aterrizar en una URL con tags activos (deep-link desde un artículo, o URL pegada directamente), para que el filtro activo no quedara "oculto". Tras probarlo, se decidió lo contrario: el panel arranca siempre colapsado, tanto en la carga inicial como al navegar con atrás/adelante, independientemente de si hay tags activos en la URL. El listado ya sale filtrado y el control ya indica el conteo (p. ej. "Filtrar por tags (1)"), que es señal suficiente de que hay un filtro aplicado; abrir el desplegable automáticamente al cargar la página resultaba intrusivo, sobre todo viniendo de un click en un tag del artículo. El usuario decide si quiere ver o tocar la selección abriendo el panel manualmente.

**Nota de implementación (stacking context):** posicionar el panel como `position: absolute` con `z-index` dentro de un ancestro animado por la clase `.reveal` del sitio (que aplica `transform: translateY(...)`, incluso en su valor final `translateY(0)`) crea un *stacking context* local: cualquier `transform` distinto de `none` aísla el `z-index` de sus descendientes del resto de la página, aunque el valor final sea visualmente una identidad. Sin ese aislamiento, el contenido normal del listado de posts (que llega después en el DOM) se pinta por encima del panel pese a su `z-index` explícito. Se resolvió dando a la sección `.blog-header` su propio `position: relative; z-index: 1`, elevando todo su subárbol (incluido el panel) por encima de `.blog-content` como bloque, en vez de depender del `z-index` local del panel.

**5. Tags del artículo como enlaces a `/blog?tags=<tag>`.**
Cambio mínimo en `[slug].astro`: cada `<span class="article-tag">` pasa a `<a>` apuntando al listado con ese tag activo. Reutiliza el mismo query param que gobierna el panel colapsable, sin introducir un mecanismo de navegación distinto.

**6. Implementación 100% client-side con el stack existente.**
Sin dependencias nuevas: `URLSearchParams` y `history` API (nativas del navegador), mismo patrón de script inline que ya usa `index.astro` hoy para category. No se introduce backend, CMS ni tracker adicional (cumple la regla de diseño del proyecto).

## Risks / Trade-offs

- [Combinación categoría+tags sin resultados, dado el volumen actual de posts] → Mitigación: mensaje explícito de "sin resultados" en el listado (cubierto en la spec), en vez de un grid vacío sin explicación.
- [El panel colapsable de tags no tiene búsqueda ni paginación; si el número de tags crece mucho podría volverse largo] → Mitigación: fuera de alcance de este change; el panel colapsable ya evita el coste visual permanente, y una mejora de UI para volúmenes grandes de tags se abordaría como change posterior si llega a ser un problema real.
- [Sincronización entre el estado de la URL y el DOM al navegar con atrás/adelante del navegador] → Mitigación: escuchar `popstate` además del click de los chips, para re-renderizar el estado de los filtros a partir de la URL vigente.
- [Tags con caracteres no triviales en la URL (espacios, tildes, mayúsculas)] → Mitigación: los tags ya se definen en el frontmatter como slugs simples (kebab-case, sin espacios ni tildes); se reutiliza ese mismo valor como query param, codificado por `URLSearchParams` de forma estándar.

## Migration Plan

Sin migración de datos ni de contenido: no cambia `content.config.ts` ni el frontmatter de los posts existentes, que ya incluyen `tags`. Despliegue como parte del build estático habitual (`npm run build`); rollback simple vía `git revert` del commit/PR, sin estado persistente que limpiar.

## Open Questions

- Orden de los tags dentro del panel (alfabético vs. por frecuencia de uso): no afecta a las specs ni al criterio de filtrado (OR/AND) ya definido; se puede decidir durante la implementación sin reabrir esta propuesta.
