# blog Specification

## Purpose

Define cómo los visitantes del blog descubren posts filtrando el listado por categoría y por tags, cómo navegan a esos filtros desde la página de artículo, con el estado de filtrado reflejado en la URL, y cómo se presenta cada post como tarjeta reutilizable en el listado, la portada y los artículos relacionados.

## Requirements

### Requirement: Taxonomía de categoría como tipo de post
La categoría (`category`) de un post SHALL representar su tipo de contenido, no su tema. Los valores válidos SHALL ser exactamente `Opinión`, `Análisis`, `Guía` y `Recursos`. El tema del post (por ejemplo, arquitectura, DevOps, IA generativa o liderazgo) SHALL representarse únicamente mediante `tags`, nunca mediante `category`.

#### Scenario: Valor de categoría dentro de la taxonomía de tipo
- **WHEN** un post define `category: "Guía"`
- **THEN** el post se acepta y se muestra en el sitio con `Guía` como su tipo

#### Scenario: Valor de categoría fuera de la taxonomía
- **WHEN** un post define un `category` que no es `Opinión`, `Análisis`, `Guía` ni `Recursos`
- **THEN** la validación del esquema de contenido rechaza el post en vez de publicarlo con un tipo inválido

#### Scenario: El tema de un post se obtiene de sus tags
- **WHEN** se necesita conocer el tema de un post (por ejemplo, para agruparlo o recomendarlo por afinidad temática)
- **THEN** el tema se obtiene de sus `tags`, no de su `category`

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
- **WHEN** el visitante tiene activa la categoría `Análisis` y el tag `ia-generativa`
- **THEN** el listado muestra solo los posts cuyo tipo es `Análisis` y que además incluyen el tag `ia-generativa`

#### Scenario: Combinación sin resultados
- **WHEN** la combinación de categoría y tags activos no coincide con ningún post
- **THEN** el listado se muestra vacío con un mensaje indicando que no hay resultados para esa combinación de filtros

### Requirement: Chips de tipo siempre visibles en el listado
El listado de `/blog` SHALL mostrar un chip de filtro para cada uno de los 4 tipos de la taxonomía (`Opinión`, `Análisis`, `Guía`, `Recursos`), incluso cuando no exista todavía ningún post publicado de ese tipo. Un chip sin posts SHALL mostrar un contador en `0` y SHALL permitir activarse igual que el resto.

#### Scenario: Tipo sin posts publicados se muestra igualmente
- **WHEN** ningún post publicado tiene `category: "Guía"`
- **THEN** el chip `Guía` aparece en el listado con un contador `0`

#### Scenario: Activar un chip sin posts
- **WHEN** el visitante activa un chip de un tipo sin posts publicados
- **THEN** el listado se muestra vacío con el mensaje de "sin resultados para esa combinación de filtros"

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

### Requirement: Estructura de contenido de la tarjeta de post
Toda tarjeta de post (listado de `/blog`, portada y artículos relacionados en `/blog/[slug]`) SHALL presentar, en esta secuencia de lectura: imagen destacada, categoría, metadatos (fecha de publicación, tiempo de lectura estimado), título, extracto y CTA "Leer artículo". La categoría y los metadatos SHALL aparecer en la misma fila de cabecera de la tarjeta, con la categoría alineada a un extremo y los metadatos al extremo opuesto. La tarjeta no SHALL mostrar el autor, porque el sitio tiene un único autor conocido y repetirlo en cada tarjeta no aporta información. La disposición visual concreta (apilada verticalmente, o con la imagen y el contenido lado a lado en la tarjeta destacada de escritorio) puede variar sin alterar esta secuencia de lectura.

#### Scenario: Tarjeta con todos los datos disponibles
- **WHEN** se renderiza la tarjeta de un post que tiene imagen y contenido con el que calcular el tiempo de lectura
- **THEN** la tarjeta muestra, en esa secuencia, la imagen, la fila de cabecera con la categoría y los metadatos (fecha y tiempo de lectura), el título, el extracto, y termina con el CTA "Leer artículo", sin mostrar ningún dato de autor

### Requirement: Comportamiento de la tarjeta ante datos incompletos
La tarjeta SHALL seguir siendo válida y legible cuando falte la imagen o el tiempo de lectura de un post, sin dejar huecos vacíos ni textos rotos.

#### Scenario: Post sin imagen destacada
- **WHEN** un post no define `image`
- **THEN** la tarjeta muestra un marcador de posición visual en el hueco de la imagen, con la misma proporción y las mismas dimensiones que ocuparía una imagen real en esa misma tarjeta, sin salto de altura respecto a un post con imagen

#### Scenario: Tiempo de lectura no disponible
- **WHEN** no se puede calcular el tiempo de lectura de un post (por ejemplo, por no disponer del contenido del post en el contexto donde se renderiza la tarjeta)
- **THEN** la tarjeta omite ese metadato sin mostrar un valor inventado ni dejar un hueco visualmente roto

### Requirement: Estabilidad visual ante textos de longitud variable
El título y el extracto de la tarjeta SHALL truncarse de forma elegante cuando excedan un número máximo de líneas, de modo que la altura de la tarjeta no varíe entre posts con títulos o extractos de longitud distinta dentro de un mismo listado.

#### Scenario: Título largo
- **WHEN** el título de un post excede el número de líneas asignado al título dentro de la tarjeta
- **THEN** el texto se trunca de forma elegante (sin cortar a mitad de palabra ni desbordar el contenedor) y la tarjeta mantiene la misma altura que las demás tarjetas del listado

#### Scenario: Extracto largo
- **WHEN** el extracto de un post excede 1-2 líneas
- **THEN** el texto se trunca de forma elegante y la tarjeta mantiene la misma altura que las demás tarjetas del listado

### Requirement: Accesibilidad y clicabilidad de la tarjeta
La tarjeta SHALL ser navegable por teclado con un estado de foco visible, SHALL distinguir visualmente el estado de hover, y SHALL tener, como mínimo, el título y el CTA como elementos clicables que llevan al artículo completo.

#### Scenario: Navegación por teclado
- **WHEN** un visitante navega la página con el teclado y el foco llega a una tarjeta de post
- **THEN** la tarjeta muestra un indicador de foco visible (`:focus-visible`) diferenciado del estado sin foco

#### Scenario: Activación por teclado
- **WHEN** una tarjeta de post tiene el foco y el visitante pulsa Intro
- **THEN** el visitante navega al artículo completo correspondiente

#### Scenario: Imagen con texto alternativo
- **WHEN** la tarjeta muestra una imagen destacada
- **THEN** la imagen incluye un `alt` descriptivo del contenido del artículo, no genérico ni vacío

#### Scenario: Emojis decorativos en la fecha y el tiempo de lectura
- **WHEN** la tarjeta muestra la fecha o el tiempo de lectura acompañados de un emoji decorativo
- **THEN** el emoji se marca como decorativo (no forma parte del texto accesible del dato) y no interfiere con la lectura del dato por tecnología de asistencia

### Requirement: Reutilización de la tarjeta entre listados
La tarjeta de post SHALL comportarse de forma idéntica (misma estructura, mismos datos, mismo manejo de datos incompletos) cuando se usa en el listado de `/blog`, en la vista previa de portada y en los artículos relacionados de `/blog/[slug]`, recibiendo los datos del post como entrada en vez de contenido fijo en la propia tarjeta.

#### Scenario: Mismo post en dos contextos distintos
- **WHEN** un mismo post se muestra a la vez en la portada (vista previa) y en el listado de `/blog`
- **THEN** ambas tarjetas muestran la misma estructura y los mismos datos del post, sin contenido hardcodeado específico de un contexto

### Requirement: Selección de artículos relacionados por tags compartidos
La página de artículo (`/blog/[slug]`) SHALL calcular los artículos relacionados a partir de los tags que comparte con el post actual, no a partir de su `category`. Los candidatos SHALL ordenarse por número de tags en común de forma descendente; en caso de empate, SHALL ordenarse por fecha de publicación más reciente primero. SHALL mostrarse como máximo 3 artículos relacionados. Cuando ningún otro post comparte al menos un tag con el post actual, la sección de artículos relacionados SHALL omitirse por completo.

#### Scenario: Relacionados ordenados por mayor solapamiento de tags
- **WHEN** el post actual comparte 2 tags con el post A y 1 tag con el post B
- **THEN** el post A aparece antes que el post B en la lista de relacionados

#### Scenario: Empate en tags compartidos se decide por fecha más reciente
- **WHEN** el post actual comparte el mismo número de tags con el post A y con el post B
- **THEN** el post con fecha de publicación más reciente aparece primero

#### Scenario: Ningún post comparte tags
- **WHEN** ningún otro post publicado comparte al menos un tag con el post actual
- **THEN** la página de artículo no muestra la sección de artículos relacionados

#### Scenario: Más de 3 candidatos con tags en común
- **WHEN** más de 3 posts comparten al menos un tag con el post actual
- **THEN** la página muestra únicamente los 3 con mayor solapamiento (y, en empate, los más recientes)

### Requirement: Orden de la estructura de la página de artículo
La página de artículo (`/blog/[slug]`) SHALL presentar sus bloques en esta secuencia de lectura: breadcrumb, categoría con metadatos (fecha de publicación, tiempo de lectura estimado y botón de compartir), título (`h1`), bajada, tags, imagen destacada, contenido completo del artículo, bloque de autor, artículos relacionados y CTA final (con un botón de compartir junto al CTA principal). La categoría y los metadatos SHALL aparecer en la misma fila, con la categoría alineada a un extremo y los metadatos —incluyendo el botón de compartir— al extremo opuesto (mismo patrón que la fila de cabecera de la tarjeta de post). Los tags SHALL aparecer como bloque propio después de la bajada, antes de la imagen destacada.

#### Scenario: Post con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor
- **THEN** la página muestra, en ese orden, el breadcrumb, la fila con la categoría y los metadatos (fecha, tiempo de lectura y botón de compartir) en extremos opuestos, el título, la bajada, los tags, la imagen destacada, el contenido, el autor, los relacionados y la CTA final con un segundo botón de compartir junto al CTA principal

### Requirement: Breadcrumb contextual en la página de artículo
La página de artículo SHALL mostrar una navegación de breadcrumb semántica (`nav` con lista ordenada) con los niveles Inicio, Blog y la categoría del post, sin incluir el título del post. Los tres niveles SHALL ser enlaces. El enlace de la categoría SHALL llevar al listado de `/blog` filtrado por esa categoría.

#### Scenario: Navegación por el breadcrumb
- **WHEN** un visitante hace click en el nivel "Blog" del breadcrumb de un artículo
- **THEN** navega al listado de `/blog` sin ningún filtro activo

#### Scenario: Click en la categoría del breadcrumb
- **WHEN** un visitante hace click en el nivel de categoría del breadcrumb (por ejemplo, "Opinión")
- **THEN** navega a `/blog` con esa categoría ya activa como filtro

#### Scenario: El breadcrumb no incluye el título del post
- **WHEN** se renderiza el breadcrumb de un artículo
- **THEN** el último nivel visible es la categoría del post; el título del artículo no aparece como nivel del breadcrumb

### Requirement: Bloque de metadatos del artículo
La página de artículo SHALL mostrar la fecha de publicación y el tiempo de lectura estimado del artículo principal (calculado a partir del contenido del post, igual que ya se calcula para las tarjetas relacionadas), con el mismo formato de fecha y de tiempo de lectura que ya usa la tarjeta de post (`BlogCard`). Cuando el post define fecha de actualización, la página SHALL mostrar también esa fecha junto a la de publicación; cuando no la define, el bloque de metadatos SHALL mostrar solo la fecha de publicación y el tiempo de lectura, sin hueco visualmente roto.

#### Scenario: Post sin fecha de actualización
- **WHEN** un post no define fecha de actualización
- **THEN** el bloque de metadatos muestra la fecha de publicación y el tiempo de lectura, sin ningún indicador de actualización

#### Scenario: Post con fecha de actualización
- **WHEN** un post define una fecha de actualización posterior a la de publicación
- **THEN** el bloque de metadatos muestra ambas fechas, distinguiendo cuál es la de publicación y cuál la de actualización

### Requirement: Imagen destacada del artículo
Cuando el post define una imagen, la página de artículo SHALL mostrarla en proporción estable `16:9`, con un `alt` descriptivo del contenido del artículo (no genérico ni vacío). Cuando el post no define imagen, la página SHALL omitir por completo el bloque de imagen destacada, sin dejar un hueco vacío ni un placeholder.

#### Scenario: Post con imagen destacada
- **WHEN** un post define `image`
- **THEN** la página muestra la imagen en proporción 16:9 entre los metadatos y el contenido, con un `alt` descriptivo

#### Scenario: Post sin imagen destacada
- **WHEN** un post no define `image`
- **THEN** la página no muestra ningún bloque de imagen destacada, y el contenido sigue inmediatamente después de los metadatos

### Requirement: Datos estructurados SEO del artículo
La página de artículo SHALL incluir datos estructurados `BlogPosting` (con al menos título, descripción, fecha de publicación, autor y URL canónica) y datos estructurados `BreadcrumbList` alineados con el breadcrumb visible. La página SHALL declarar `og:type` como `article` y las meta `article:published_time` (y `article:modified_time` cuando el post tiene fecha de actualización), en vez del `og:type` genérico usado por el resto del sitio.

#### Scenario: Datos estructurados de un post
- **WHEN** se solicita la página de un artículo
- **THEN** el HTML incluye un bloque `application/ld+json` de tipo `BlogPosting` con el título, la descripción, la fecha de publicación y el autor del post, y otro de tipo `BreadcrumbList` con los mismos niveles que el breadcrumb visible

#### Scenario: Metadatos Open Graph de tipo artículo
- **WHEN** se solicita la página de un artículo
- **THEN** el `<head>` declara `og:type` como `article` y la meta `article:published_time` con la fecha de publicación del post

### Requirement: Bloque de autor tolerante a datos ausentes
La página de artículo SHALL mostrar un bloque de autor (nombre, biografía breve y enlaces de contacto/perfil) a partir de un dato de autor centralizado, no de contenido fijo repetido en la página. Cuando ese dato de autor no esté disponible, la página SHALL omitir el bloque de autor por completo en vez de mostrar información parcial o rota.

#### Scenario: Autor disponible
- **WHEN** el dato de autor centralizado está disponible
- **THEN** la página muestra el bloque de autor con nombre, biografía y enlaces

#### Scenario: Autor no disponible
- **WHEN** el dato de autor centralizado no está disponible
- **THEN** la página no muestra ningún bloque de autor, sin dejar un hueco vacío ni campos en blanco

### Requirement: CTA final configurable por post
La página de artículo SHALL mostrar una CTA final cuyo texto, etiqueta del botón y destino puedan definirse por post (por ejemplo, para ofrecer suscripción, contacto o lectura recomendada según el artículo). Cuando un post no define una CTA propia, la página SHALL usar una CTA de contacto por defecto, igual a la actual.

#### Scenario: Post con CTA propia
- **WHEN** un post define texto, etiqueta y destino de CTA propios
- **THEN** la página muestra esa CTA en vez de la CTA de contacto por defecto

#### Scenario: Post sin CTA propia
- **WHEN** un post no define una CTA propia
- **THEN** la página muestra la CTA de contacto por defecto

### Requirement: Accesibilidad de foco en los elementos interactivos del artículo
Todos los enlaces y botones interactivos de la página de artículo (breadcrumb, tags, enlaces del bloque de autor, botón(es) de compartir y CTA final) SHALL distinguir visualmente un estado `:hover` y un estado `:focus-visible`, de forma que la navegación por teclado deje siempre un indicador de foco visible.

#### Scenario: Navegación por teclado por los tags del artículo
- **WHEN** un visitante navega la página con el teclado y el foco llega a uno de los tags del artículo
- **THEN** el tag muestra un indicador de foco visible (`:focus-visible`), diferenciado del estado sin foco

#### Scenario: Navegación por teclado por la CTA final
- **WHEN** el foco llega al botón de la CTA final mediante teclado
- **THEN** el botón muestra un indicador de foco visible, diferenciado del estado sin foco

#### Scenario: Navegación por teclado por el botón de compartir
- **WHEN** el foco llega a un botón de compartir (en la cabecera o en la CTA final) mediante teclado
- **THEN** el botón muestra un indicador de foco visible, diferenciado del estado sin foco

### Requirement: Compartir el artículo
La página de artículo SHALL ofrecer un botón de compartir, presente tanto en la fila de categoría/metadatos de la cabecera como junto a la CTA final, que permita al visitante compartir la URL canónica del artículo. Cuando el navegador soporta la Web Share API, el botón SHALL invocar el selector nativo de compartir del sistema con el título, la descripción y la URL canónica del artículo. Cuando no la soporta, el botón SHALL copiar la URL canónica al portapapeles y mostrar una confirmación. Este botón no SHALL aparecer en las tarjetas de post (listado de `/blog`, portada ni artículos relacionados).

#### Scenario: Compartir con Web Share API disponible
- **WHEN** un visitante pulsa el botón de compartir en un navegador con soporte para `navigator.share`
- **THEN** se abre el selector nativo de compartir del sistema con el título, la descripción y la URL canónica del artículo

#### Scenario: Compartir sin Web Share API disponible
- **WHEN** un visitante pulsa el botón de compartir en un navegador sin soporte para `navigator.share`
- **THEN** la URL canónica del artículo se copia al portapapeles y el botón muestra una confirmación textual temporal

#### Scenario: Confirmación de copiado accesible
- **WHEN** se copia la URL al portapapeles tras pulsar el botón de compartir
- **THEN** la confirmación se anuncia a tecnología de asistencia mediante una región `aria-live`, sin depender únicamente de un cambio visual

#### Scenario: El botón de compartir no aparece en las tarjetas de post
- **WHEN** se renderiza una tarjeta de post en el listado de `/blog`, en la portada o en los artículos relacionados
- **THEN** la tarjeta no muestra ningún botón de compartir

### Requirement: Registro de analítica al compartir sin datos identificables
Cuando un visitante completa una acción de compartir (vía Web Share API o vía copiado al portapapeles), el sistema SHALL registrar un evento de analítica que identifique el tipo de contenido y el artículo compartido, sin incluir la URL completa del artículo ni ningún dato del visitante.

#### Scenario: Evento de analítica al compartir
- **WHEN** se completa una acción de compartir en un artículo
- **THEN** se registra un evento de analítica con el tipo de contenido y el identificador del artículo, sin URL completa ni datos del visitante
