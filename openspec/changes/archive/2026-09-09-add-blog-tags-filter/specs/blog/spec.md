## Purpose

Define cómo los visitantes del blog descubren posts filtrando el listado por categoría y por tags, y cómo navegan a esos filtros desde la página de artículo, con el estado de filtrado reflejado en la URL.

## ADDED Requirements

### Requirement: Filtrado del listado de blog por tags
El listado de `/blog` SHALL permitir seleccionar uno o varios tags a la vez. Cuando hay tags seleccionados, el sistema SHALL mostrar únicamente los posts que tengan al menos uno de los tags activos (lógica OR entre tags).

#### Scenario: Ningún tag seleccionado
- **WHEN** el visitante no ha activado ningún tag
- **THEN** el listado muestra todos los posts (sujeto al filtro de categoría, si lo hay)

#### Scenario: Un tag seleccionado
- **WHEN** el visitante activa el tag `sdd`
- **THEN** el listado muestra solo los posts que incluyen `sdd` entre sus tags

#### Scenario: Varios tags seleccionados
- **WHEN** el visitante activa los tags `sdd` y `memoria`
- **THEN** el listado muestra los posts que tienen `sdd`, los que tienen `memoria`, y los que tienen ambos

### Requirement: Combinación del filtro de categoría con el filtro de tags
Cuando hay una categoría activa y uno o varios tags activos simultáneamente, el sistema SHALL mostrar solo los posts que cumplen ambas condiciones a la vez (categoría activa Y al menos uno de los tags activos).

#### Scenario: Categoría y tags activos a la vez
- **WHEN** el visitante tiene activa la categoría `IA Generativa` y el tag `arquitectura`
- **THEN** el listado muestra solo los posts cuya categoría es `IA Generativa` y que además incluyen el tag `arquitectura`

#### Scenario: Combinación sin resultados
- **WHEN** la combinación de categoría y tags activos no coincide con ningún post
- **THEN** el listado se muestra vacío con un mensaje indicando que no hay resultados para esa combinación de filtros

### Requirement: Estado de los filtros reflejado en la URL
El estado de los filtros de categoría y de tags activos en `/blog` SHALL reflejarse en la URL mediante query params, de forma que la URL resultante sea compartible y, al abrirla, reproduzca el mismo estado de filtrado.

#### Scenario: Compartir una URL filtrada
- **WHEN** un visitante activa una combinación de categoría y tags y copia la URL resultante
- **THEN** abrir esa URL en otra sesión muestra el listado con la misma categoría y los mismos tags activos

#### Scenario: Recargar la página con filtros activos
- **WHEN** un visitante recarga `/blog` teniendo filtros activos reflejados en la URL
- **THEN** los filtros siguen activos tras la recarga, en vez de reiniciarse

#### Scenario: Acceso sin query params
- **WHEN** un visitante entra en `/blog` sin ningún query param de filtrado
- **THEN** el listado se comporta igual que hoy: todos los posts visibles y ningún filtro activo

#### Scenario: Varios tags marcados en una misma apertura del panel se deshacen de una vez
- **WHEN** un visitante abre el panel de tags y marca varios tags seguidos, y a continuación pulsa "atrás" en el navegador una sola vez
- **THEN** el listado vuelve al estado que había antes de abrir el panel (sin ninguno de esos tags activos), en vez de deshacer los tags uno a uno

#### Scenario: Un cambio de categoría posterior a una selección de tags es un paso de "atrás" independiente
- **WHEN** un visitante selecciona uno o varios tags y a continuación cambia la categoría activa
- **THEN** pulsar "atrás" una vez deshace solo el cambio de categoría (los tags seleccionados se mantienen), y pulsar "atrás" de nuevo deshace la selección de tags

### Requirement: Panel colapsable del filtro de tags
El filtro de tags SHALL presentarse como un control desplegable situado a la derecha del filtro de categoría, en la misma fila, cerrado por defecto. El control para abrirlo SHALL indicar el número de tags activos cuando el panel está cerrado y hay al menos un tag seleccionado. El panel SHALL cerrarse automáticamente en cuanto el visitante interactúa fuera de su contexto (fuera del control y su panel), sin requerir una acción explícita de cierre por parte del visitante.

#### Scenario: Estado inicial sin tags activos
- **WHEN** un visitante entra en `/blog` sin tags activos en la URL
- **THEN** el panel de tags se muestra colapsado, a la derecha del filtro de categoría, y su control no indica ningún conteo

#### Scenario: Apertura manual del panel
- **WHEN** un visitante hace click en el control del panel de tags
- **THEN** el panel se expande y muestra los tags disponibles para seleccionar

#### Scenario: Llegada con tags activos en la URL
- **WHEN** un visitante abre `/blog` con uno o varios tags activos en la URL (por ejemplo, tras venir de un enlace de artículo, o pegando directamente una URL filtrada)
- **THEN** el listado aparece ya filtrado por esos tags, pero el panel de tags permanece colapsado; el control indica el conteo de tags activos y, si se abre, esos tags aparecen ya marcados

#### Scenario: Conteo en el control cuando está cerrado
- **WHEN** hay tags activos y el panel está colapsado
- **THEN** el control del panel muestra el número de tags actualmente activos

#### Scenario: Cierre automático al interactuar fuera del panel
- **WHEN** el panel de tags está expandido y el visitante hace click en cualquier punto fuera del control y su panel (incluyendo otro filtro, como una categoría)
- **THEN** el panel se colapsa automáticamente, sin que el visitante tenga que cerrarlo explícitamente

#### Scenario: Cierre con la tecla Escape
- **WHEN** el panel de tags está expandido y el visitante pulsa la tecla Escape
- **THEN** el panel se colapsa y el foco vuelve al control que lo abre

#### Scenario: Seleccionar un tag no cierra el panel
- **WHEN** el panel de tags está expandido y el visitante hace click en uno de los tags disponibles
- **THEN** el panel permanece expandido, permitiendo seleccionar más tags a continuación

### Requirement: Navegación a tags desde la página de artículo
Cada tag mostrado en la página de artículo (`/blog/[slug]`) SHALL ser un enlace que lleva al listado de `/blog` con ese tag ya activo como único filtro de tags.

#### Scenario: Click en un tag del artículo
- **WHEN** un visitante hace click en el tag `sdd` mostrado en un artículo
- **THEN** navega a `/blog` con el tag `sdd` ya activo como filtro (listado filtrado y control con el conteo), sin que el panel de tags se abra automáticamente
