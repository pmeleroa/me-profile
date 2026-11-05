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
La página de artículo (`/blog/[slug]`) SHALL calcular los artículos relacionados a partir de los tags que comparte con el post actual, no a partir de su `category`. Los candidatos SHALL excluir las partes de la misma serie que el post actual, y SHALL ordenarse por número de tags en común de forma descendente; en caso de empate, SHALL ordenarse por fecha de publicación más reciente primero. SHALL mostrarse como máximo 3 artículos relacionados. Cuando ningún otro post candidato comparte al menos un tag con el post actual, la sección de artículos relacionados SHALL omitirse por completo.

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

#### Scenario: Parte de la misma serie con tags en común
- **WHEN** el post actual pertenece a una serie y otra parte de esa serie comparte tags con él
- **THEN** esa parte no aparece en los relacionados, y su hueco puede ocuparlo otro post candidato

#### Scenario: Parte de otra serie con tags en común
- **WHEN** un post comparte tags con el post actual y pertenece a una serie distinta, o el post actual no pertenece a ninguna serie
- **THEN** ese post sigue siendo candidato a relacionado, con su badge de serie en la tarjeta

#### Scenario: Solo las partes de la serie comparten tags
- **WHEN** los únicos posts que comparten tags con el post actual son partes de su misma serie
- **THEN** la página de artículo no muestra la sección de artículos relacionados

### Requirement: Orden de la estructura de la página de artículo
La página de artículo (`/blog/[slug]`) SHALL presentar sus bloques en esta secuencia de lectura: breadcrumb, categoría con metadatos (fecha de publicación, tiempo de lectura estimado y botón de compartir), antetítulo de serie (solo cuando el post pertenece a una serie), título (`h1`), bajada, tags, imagen destacada, contenido completo del artículo, navegación de la serie (solo cuando se cumple su condición de visibilidad), bloque de autor, artículos relacionados y CTA final (con un botón de compartir junto al CTA principal). La categoría y los metadatos SHALL aparecer en la misma fila, con la categoría alineada a un extremo y los metadatos —incluyendo el botón de compartir— al extremo opuesto (mismo patrón que la fila de cabecera de la tarjeta de post). El antetítulo de serie SHALL ocupar su propia línea, fuera de la fila de categoría y metadatos. Los tags SHALL aparecer como bloque propio después de la bajada, antes de la imagen destacada.

#### Scenario: Post con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor, y que no pertenece a ninguna serie
- **THEN** la página muestra, en ese orden, el breadcrumb, la fila con la categoría y los metadatos (fecha, tiempo de lectura y botón de compartir) en extremos opuestos, el título, la bajada, los tags, la imagen destacada, el contenido, el autor, los relacionados y la CTA final con un segundo botón de compartir junto al CTA principal

#### Scenario: Post de una serie con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor, y que pertenece a una serie
- **THEN** la página muestra el mismo orden que un post sin serie, con el antetítulo de serie en su propia línea entre la fila de categoría y metadatos y el título

#### Scenario: Post de una serie con navegación visible
- **WHEN** se renderiza una parte de una serie con 2 o más partes publicadas
- **THEN** el bloque de navegación de la serie aparece después del contenido y antes del bloque de autor

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
La página de artículo SHALL mostrar la fecha de publicación y el tiempo de lectura estimado del artículo principal (calculado a partir del contenido del post, igual que ya se calcula para las tarjetas relacionadas), con el mismo formato de fecha y de tiempo de lectura que ya usa la tarjeta de post (`BlogCard`). La fecha de actualización del post, cuando existe, no SHALL mostrarse al visitante: queda como traza de la última modificación para los metadatos que leen buscadores y redes (ver «Datos estructurados SEO del artículo»). El bloque de metadatos SHALL mostrar solo la fecha de publicación y el tiempo de lectura, sin hueco visualmente roto, tanto si el post define fecha de actualización como si no.

#### Scenario: Post sin fecha de actualización
- **WHEN** un post no define fecha de actualización
- **THEN** el bloque de metadatos muestra la fecha de publicación y el tiempo de lectura, sin ningún indicador de actualización

#### Scenario: Post con fecha de actualización
- **WHEN** un post define una fecha de actualización posterior a la de publicación
- **THEN** el bloque de metadatos muestra solo la fecha de publicación y el tiempo de lectura, sin ningún texto ni fecha de actualización visible

### Requirement: Imagen destacada del artículo
Cuando el post define una imagen, la página de artículo SHALL mostrarla en proporción estable `16:9`, con un `alt` descriptivo del contenido del artículo (no genérico ni vacío). Cuando el post no define imagen, la página SHALL omitir por completo el bloque de imagen destacada, sin dejar un hueco vacío ni un placeholder.

#### Scenario: Post con imagen destacada
- **WHEN** un post define `image`
- **THEN** la página muestra la imagen en proporción 16:9 entre los metadatos y el contenido, con un `alt` descriptivo

#### Scenario: Post sin imagen destacada
- **WHEN** un post no define `image`
- **THEN** la página no muestra ningún bloque de imagen destacada, y el contenido sigue inmediatamente después de los metadatos

### Requirement: Datos estructurados SEO del artículo
La página de artículo SHALL incluir datos estructurados `BlogPosting` (con al menos título, descripción, fecha de publicación, autor y URL canónica) y datos estructurados `BreadcrumbList` alineados con el breadcrumb visible. Cuando el post define fecha de actualización, `BlogPosting` SHALL incluir `dateModified` con esa fecha. Cuando el post pertenece a una serie, `BlogPosting` SHALL incluir `isPartOf` con un objeto de tipo `CreativeWorkSeries` cuyo nombre es el nombre público de la serie. La página SHALL declarar `og:type` como `article` y las meta `article:published_time` (y `article:modified_time` cuando el post tiene fecha de actualización), en vez del `og:type` genérico usado por el resto del sitio.

#### Scenario: Datos estructurados de un post
- **WHEN** se solicita la página de un artículo
- **THEN** el HTML incluye un bloque `application/ld+json` de tipo `BlogPosting` con el título, la descripción, la fecha de publicación y el autor del post, y otro de tipo `BreadcrumbList` con los mismos niveles que el breadcrumb visible

#### Scenario: Metadatos Open Graph de tipo artículo
- **WHEN** se solicita la página de un artículo
- **THEN** el `<head>` declara `og:type` como `article` y la meta `article:published_time` con la fecha de publicación del post

#### Scenario: Fecha de actualización solo en metadatos
- **WHEN** se solicita la página de un artículo que define fecha de actualización
- **THEN** `BlogPosting` incluye `dateModified` y el `<head>` incluye `article:modified_time` con esa fecha, aunque la fecha no se muestre en la página

#### Scenario: Post de una serie en los datos estructurados
- **WHEN** se solicita la página de un artículo que pertenece a la serie «Asistente de código local»
- **THEN** `BlogPosting` incluye `isPartOf` con `@type` `CreativeWorkSeries` y `name` «Asistente de código local»

#### Scenario: Post sin serie en los datos estructurados
- **WHEN** se solicita la página de un artículo que no pertenece a ninguna serie
- **THEN** `BlogPosting` no incluye `isPartOf`

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

### Requirement: Pertenencia de un post a una serie
Un post del blog SHALL poder declarar, de forma opcional, que pertenece a una serie, indicando el identificador de la serie y su número de parte (entero positivo). Cada serie SHALL definirse una sola vez, con su nombre público, en un registro de series independiente de los posts, de modo que el nombre de la serie no se repita en el frontmatter de cada parte. La generación del sitio SHALL fallar cuando un post referencia una serie que no existe en ese registro, y cuando dos posts publicados (no borrador) de la misma serie declaran el mismo número de parte. Los posts en borrador no SHALL contar para esa comprobación de unicidad. Declarar una serie no SHALL alterar qué posts se publican: el contrato de publicación (`draft`) sigue siendo el único que decide si un post aparece en la salida pública.

#### Scenario: Post sin serie
- **WHEN** un post no declara serie
- **THEN** el post se publica exactamente igual que antes de este cambio, sin ningún dato de serie

#### Scenario: Post que referencia una serie inexistente
- **WHEN** un post declara un identificador de serie que no está en el registro de series
- **THEN** la generación del sitio falla con un error que identifica el post y la serie referenciada

#### Scenario: Dos partes publicadas con el mismo número
- **WHEN** dos posts publicados de la misma serie declaran el mismo número de parte
- **THEN** la generación del sitio falla con un error que identifica la serie, el número de parte y los posts implicados

#### Scenario: Borrador con número de parte repetido
- **WHEN** un post en borrador declara el mismo número de parte que un post publicado de la misma serie
- **THEN** la generación del sitio no falla y el borrador no aparece en la salida pública

### Requirement: Antetítulo de serie en la página de artículo
Cuando un post publicado pertenece a una serie, la página de artículo (`/blog/[slug]`) SHALL mostrar un antetítulo inmediatamente antes del título (`h1`) con, en este orden: un badge con el texto «Serie» (en mayúsculas), el nombre público de la serie y la indicación «Parte N», donde N es el número de parte del post. El antetítulo SHALL mostrarse aunque la serie tenga una sola parte publicada. El nombre público de la serie SHALL ser un enlace a la página de la serie (`/blog/series/<id>`); el badge y la indicación «Parte N» no SHALL ser enlaces. El enlace SHALL distinguirse del texto que lo rodea sin depender solo del color y SHALL mostrar un indicador de foco visible. El antetítulo no SHALL mostrar el número total de partes de la serie. El badge SHALL distinguirse visualmente de la categoría y de los tags del artículo, de modo que no se confunda con ninguno de ellos aunque comparta color con la categoría. Cualquier emoji o icono del badge SHALL ser decorativo y quedar oculto a tecnología de asistencia, de forma que un lector de pantalla anuncie solo «Serie», el nombre de la serie (como enlace) y la parte. Todo el texto del antetítulo SHALL tener un contraste mínimo de 4.5:1 sobre su fondo (WCAG 2.2 AA). Cuando el post no pertenece a ninguna serie, la página no SHALL mostrar el antetítulo ni dejar un hueco en su lugar. Las tarjetas de post (listado de `/blog`, portada y artículos relacionados) no SHALL mostrar el antetítulo de serie completo; en ellas la pertenencia a una serie se indica solo con el badge definido en «Badge de serie en la tarjeta de post».

#### Scenario: Post que es parte de una serie
- **WHEN** se renderiza un post publicado que declara la serie «Asistente de código local» y el número de parte 1
- **THEN** encima del título aparece el antetítulo con el badge «Serie», el texto «Asistente de código local» como enlace a `/blog/series/asistente-codigo-local` y «Parte 1», y solo el nombre de la serie es un enlace

#### Scenario: Serie con una sola parte publicada
- **WHEN** se renderiza la única parte publicada de una serie
- **THEN** la página muestra igualmente el antetítulo de serie, con el nombre de la serie enlazado a su página, sin indicar cuántas partes tendrá la serie

#### Scenario: Post fuera de cualquier serie
- **WHEN** se renderiza un post que no declara serie
- **THEN** la página no muestra antetítulo de serie y el título ocupa su posición habitual sin hueco

#### Scenario: Lectura con lector de pantalla
- **WHEN** un lector de pantalla recorre el antetítulo de un post de serie
- **THEN** anuncia «Serie», el nombre de la serie como enlace y la parte, sin anunciar el emoji decorativo

#### Scenario: Navegación con teclado
- **WHEN** un visitante recorre el antetítulo con la tecla Tab
- **THEN** el enlace al nombre de la serie muestra un indicador de foco visible y lleva a la página de la serie

#### Scenario: Antetítulo ausente en las tarjetas
- **WHEN** se renderiza la tarjeta de un post de serie en el listado de `/blog`, en la portada o en los artículos relacionados
- **THEN** la tarjeta no muestra el nombre de la serie ni «Parte N», solo el badge de serie sobre la imagen

### Requirement: Badge de serie en la tarjeta de post
Toda tarjeta de post (listado de `/blog`, portada y artículos relacionados en `/blog/[slug]`) de un post que pertenece a una serie SHALL mostrar un badge con el texto «Serie» (en mayúsculas) superpuesto a la esquina superior izquierda de la imagen destacada, o del marcador de posición cuando el post no tiene imagen. El badge SHALL ser del mismo lenguaje visual que el del antetítulo del artículo (texto en color de acento, esquinas pequeñas, emoji decorativo oculto a tecnología de asistencia) y SHALL tener un fondo opaco, de modo que su texto mantenga un contraste mínimo de 4.5:1 (WCAG 2.2 AA) sea cual sea la imagen que tiene debajo. El badge SHALL ser un enlace a la página de la serie (`/blog/series/<id>`), distinto del enlace de la tarjeta al artículo y sin anidarse en él, con foco visible y sin subrayado; se distingue del resto de la tarjeta por su forma de badge (borde y fondo propios), sin depender solo del color. El badge no SHALL mostrar el nombre de la serie ni el número de parte. Las tarjetas de posts que no pertenecen a ninguna serie no SHALL mostrar el badge. El badge no SHALL alterar las dimensiones de la tarjeta.

#### Scenario: Tarjeta de un post de serie
- **WHEN** se renderiza en el listado de `/blog` o en la sección «Últimas ideas» de la portada la tarjeta de un post que declara una serie
- **THEN** la tarjeta muestra sobre la esquina superior izquierda de la imagen el badge «Serie», con la misma altura de tarjeta que tendría sin él

#### Scenario: Tarjeta de un post sin serie
- **WHEN** se renderiza la tarjeta de un post que no declara serie
- **THEN** la tarjeta no muestra el badge de serie

#### Scenario: Badge sobre una imagen clara o recargada
- **WHEN** la imagen destacada de un post de serie tiene zonas claras o con mucho detalle bajo la esquina del badge
- **THEN** el texto del badge conserva un contraste de al menos 4.5:1, porque su fondo es opaco y no depende de la imagen

#### Scenario: Acceso a la serie desde la tarjeta
- **WHEN** un visitante activa el badge «Serie» de la tarjeta de un post de la serie «Asistente de código local»
- **THEN** navega a `/blog/series/asistente-codigo-local` y no al artículo

#### Scenario: Navegación con teclado en la tarjeta
- **WHEN** un visitante recorre con Tab una tarjeta de un post de serie
- **THEN** el enlace de la tarjeta y el badge reciben foco por separado, y el badge muestra un indicador de foco visible

### Requirement: Visibilidad del bloque de navegación de la serie
La página de artículo de un post de serie SHALL mostrar un bloque de navegación de la serie solo cuando esa serie tiene 2 o más partes publicadas. Los posts en borrador no SHALL contar para ese umbral ni aparecer en el bloque. El bloque SHALL estar disponible sin JavaScript. Cuando no se muestra, la página no SHALL dejar un hueco en su lugar.

#### Scenario: Serie con una sola parte publicada
- **WHEN** se renderiza la única parte publicada de una serie
- **THEN** la página no muestra el bloque de navegación de la serie, aunque sí muestra el antetítulo de serie

#### Scenario: Serie con dos partes publicadas
- **WHEN** se renderiza cualquiera de las partes de una serie con 2 partes publicadas
- **THEN** la página muestra el bloque de navegación de la serie

#### Scenario: Segunda parte en borrador
- **WHEN** una serie tiene una parte publicada y otra en borrador
- **THEN** la parte publicada no muestra el bloque y ningún dato del borrador aparece en la salida pública

#### Scenario: Post sin serie
- **WHEN** se renderiza un post que no pertenece a ninguna serie
- **THEN** la página no muestra el bloque de navegación de la serie

#### Scenario: Navegador sin JavaScript
- **WHEN** un visitante abre con JavaScript desactivado una parte de una serie con 2 o más partes publicadas
- **THEN** el bloque y todos sus enlaces son visibles y funcionan

### Requirement: Índice de partes de la serie
El bloque de navegación SHALL mostrar el nombre de la serie y un índice con todas sus partes publicadas, en orden ascendente de número de parte. Cada entrada SHALL indicar el número de parte y el título del post. Las demás partes SHALL ser enlaces a su artículo. La parte actual SHALL distinguirse sin depender solo del color, no SHALL ser un enlace y SHALL anunciarse como la página actual a la tecnología de asistencia.

#### Scenario: Índice ordenado por número de parte
- **WHEN** se renderiza una parte de una serie con las partes 1 y 2 publicadas
- **THEN** el índice lista la parte 1 antes que la parte 2, cada una con su número y su título

#### Scenario: Parte actual en el índice
- **WHEN** un visitante lee la parte 2 de una serie con 2 partes publicadas
- **THEN** la entrada de la parte 2 no es un enlace y queda marcada como la página actual, y la entrada de la parte 1 enlaza a su artículo

#### Scenario: Numeración con huecos
- **WHEN** una serie tiene publicadas las partes 1 y 3 y la parte 2 está en borrador o no existe
- **THEN** el índice muestra «Parte 1» y «Parte 3», sin renumerar y sin mencionar la parte 2

### Requirement: Enlaces a la parte anterior y a la siguiente
El bloque de navegación SHALL ofrecer un enlace a la parte publicada inmediatamente anterior y otro a la inmediatamente siguiente, según el orden de número de parte. Cada enlace SHALL indicar su dirección y el título de la parte de destino. Cuando no exista parte anterior o siguiente publicada, ese enlace SHALL omitirse, sin dejar un control inactivo.

#### Scenario: Primera parte publicada
- **WHEN** se renderiza la primera parte publicada de una serie con 2 o más partes publicadas
- **THEN** el bloque muestra solo el enlace a la parte siguiente

#### Scenario: Parte intermedia
- **WHEN** se renderiza una parte con partes publicadas antes y después
- **THEN** el bloque muestra el enlace a la parte anterior y el enlace a la parte siguiente

#### Scenario: Última parte publicada
- **WHEN** se renderiza la última parte publicada de una serie con 2 o más partes publicadas
- **THEN** el bloque muestra solo el enlace a la parte anterior

### Requirement: Accesibilidad y adaptación del bloque de navegación de la serie
El bloque SHALL ser una región de navegación con un nombre accesible que identifique la serie, y su índice SHALL ser una lista ordenada. Sus enlaces SHALL tener foco visible y distinguirse del texto que los rodea sin depender solo del color. Su texto SHALL tener un contraste mínimo de 4.5:1. SHALL funcionar sin scroll horizontal en anchos de 360px en adelante, incluso con títulos largos.

#### Scenario: Navegación con teclado
- **WHEN** un visitante recorre el bloque con la tecla Tab
- **THEN** cada enlace muestra un indicador de foco visible

#### Scenario: Lector de pantalla
- **WHEN** un lector de pantalla llega al bloque
- **THEN** anuncia una región de navegación con el nombre de la serie y una lista ordenada de partes

#### Scenario: Título largo en móvil
- **WHEN** una parte con un título largo se muestra en un viewport de 360px
- **THEN** el título se ajusta en varias líneas y la página no genera scroll horizontal

### Requirement: Contenido del registro de series
Cada serie del registro de series SHALL definir, además de su nombre público, una descripción (obligatoria), una lista ordenada de partes (obligatoria) y una imagen (opcional). La descripción SHALL ser un texto breve que explique de qué trata la serie sin enumerar sus partes. Cada elemento de la lista de partes SHALL tener un título y un resumen, y su posición en la lista (empezando en 1) SHALL ser el número de parte que le corresponde, de modo que el número de parte no se escriba en cada elemento. La imagen, cuando se define, SHALL ser una ruta raíz-relativa a un archivo servido por el sitio. Ni la descripción, ni los resúmenes, ni ninguna fecha SHALL comprometer un calendario de publicación. La generación del sitio SHALL fallar cuando una serie no define descripción o lista de partes, o cuando algún elemento de la lista carece de título o de resumen.

#### Scenario: Serie con todos los campos obligatorios
- **WHEN** una serie define nombre, descripción y una lista de partes en la que cada elemento tiene título y resumen
- **THEN** la serie es válida y el número de parte de cada elemento es su posición en la lista

#### Scenario: Serie sin descripción
- **WHEN** una serie del registro no define descripción
- **THEN** la generación del sitio falla con un error que identifica la serie y el campo ausente

#### Scenario: Serie sin lista de partes
- **WHEN** una serie del registro no define lista de partes o la define vacía
- **THEN** la generación del sitio falla con un error que identifica la serie

#### Scenario: Elemento de la lista sin resumen
- **WHEN** un elemento de la lista de partes de una serie no define resumen
- **THEN** la generación del sitio falla con un error que identifica la serie y la posición del elemento

#### Scenario: Serie sin imagen
- **WHEN** una serie no define imagen
- **THEN** la serie es válida y su página usa los respaldos de marca definidos para la imagen de cabecera y para la imagen al compartir

### Requirement: Coherencia entre los posts publicados y la lista de partes de la serie
La generación del sitio SHALL fallar cuando un post publicado (no borrador) declara un número de parte mayor que el número de elementos de la lista de partes de su serie, con un error que identifique la serie, el número de parte y el post. Un post en borrador no SHALL participar en esta comprobación. Esta regla se suma a las de existencia de la serie y de unicidad del número de parte entre posts publicados.

#### Scenario: Parte publicada dentro de la lista
- **WHEN** un post publicado declara la parte 2 y la lista de partes de su serie tiene 9 elementos
- **THEN** la generación del sitio no falla por esta regla

#### Scenario: Parte publicada fuera de la lista
- **WHEN** un post publicado declara la parte 10 y la lista de partes de su serie tiene 9 elementos
- **THEN** la generación del sitio falla con un error que identifica la serie, la parte 10 y el post

#### Scenario: Borrador fuera de la lista
- **WHEN** un post en borrador declara una parte mayor que el número de elementos de la lista de su serie
- **THEN** la generación del sitio no falla por esta regla

### Requirement: Página de serie
El sitio SHALL generar una página `/blog/series/<id>` por cada serie que tenga al menos una parte publicada (no borrador). Una serie sin ninguna parte publicada no SHALL generar página, y su ruta SHALL responder como página no encontrada. La página SHALL mostrar el nombre público de la serie como `h1`, su descripción y, cuando se define, su imagen, y a continuación la lista del contenido de la serie. La página SHALL estar disponible sin JavaScript. Cuando la sección de blog del sitio está desactivada, no SHALL generarse ninguna página de serie. Declarar una serie no SHALL alterar qué posts se publican: el contrato de publicación (`draft`) sigue siendo el único que decide qué aparece, y ningún dato de un post en borrador SHALL aparecer en la página.

#### Scenario: Serie con partes publicadas
- **WHEN** se solicita `/blog/series/asistente-codigo-local` y la serie tiene partes publicadas
- **THEN** la página muestra el nombre de la serie como `h1`, su descripción y la lista del contenido de la serie

#### Scenario: Serie con una sola parte publicada
- **WHEN** se solicita la página de una serie con una única parte publicada
- **THEN** la página existe y muestra esa parte como publicada

#### Scenario: Serie sin ninguna parte publicada
- **WHEN** todas las partes de una serie son borradores o no existen posts de esa serie
- **THEN** no se genera `/blog/series/<id>` y la ruta responde como página no encontrada

#### Scenario: Sección de blog desactivada
- **WHEN** la sección de blog del sitio está desactivada
- **THEN** no se genera ninguna página de serie, aunque existan series con partes publicadas

#### Scenario: Navegador sin JavaScript
- **WHEN** un visitante abre la página de una serie con JavaScript desactivado
- **THEN** el contenido de la página y todos sus enlaces son visibles y funcionan

### Requirement: Lista del contenido de la serie con su estado de publicación
La página de serie SHALL mostrar una única lista ordenada por número de parte, con un elemento por cada posición de la lista de partes de la serie, tanto si la parte está publicada como si no. Cada elemento SHALL indicar su número de parte y su estado de publicación con un texto visible, sin depender solo del color: «Publicada» cuando existe un post publicado (no borrador) con ese número de parte en la serie, y «Prevista» en caso contrario. Un elemento publicado SHALL mostrar el título y la descripción del propio post, y su título SHALL ser un enlace al artículo. Un elemento previsto SHALL mostrar el título y el resumen definidos en la serie, SHALL NOT ser un enlace y SHALL NOT mostrar fecha alguna. Cuando existe un post publicado para una parte, los datos del post SHALL prevalecer sobre los del registro de series. Un post en borrador SHALL tratarse como si no existiera: su parte aparece como «Prevista» y con los datos de la serie. Cuando la serie tiene al menos una parte prevista, la página SHALL incluir una nota visible que indique que la hoja de ruta es orientativa y que el orden y el reparto de las partes previstas pueden cambiar, sin compromiso de fechas. Cuando todas las partes están publicadas, la página no SHALL mostrar esa nota.

#### Scenario: Parte publicada
- **WHEN** existe un post publicado que declara la parte 2 de la serie
- **THEN** el elemento de la parte 2 muestra «Publicada», el título y la descripción del post, y su título enlaza al artículo

#### Scenario: Parte prevista
- **WHEN** no existe ningún post publicado que declare la parte 3 de la serie
- **THEN** el elemento de la parte 3 muestra «Prevista», el título y el resumen definidos en la serie, sin enlace y sin fecha

#### Scenario: Parte cuyo post está en borrador
- **WHEN** el único post que declara la parte 3 de la serie es un borrador
- **THEN** el elemento de la parte 3 se muestra como «Prevista» con los datos de la serie, y ni el título ni la descripción del borrador aparecen en la salida pública

#### Scenario: Post que sustituye a una parte prevista
- **WHEN** se publica el post de la parte 3 sin modificar la lista de partes de la serie
- **THEN** el elemento de la parte 3 pasa a mostrarse como «Publicada» con los datos del post

#### Scenario: Estado sin depender del color
- **WHEN** un lector consulta la lista con un lector de pantalla
- **THEN** cada elemento anuncia su número de parte y su estado, «Publicada» o «Prevista», como texto

#### Scenario: Nota de hoja de ruta orientativa
- **WHEN** se renderiza la página de una serie con al menos una parte prevista
- **THEN** la página muestra la nota de que la hoja de ruta es orientativa y de que no hay fechas comprometidas

#### Scenario: Serie con todas sus partes publicadas
- **WHEN** se renderiza la página de una serie en la que todas las partes están publicadas
- **THEN** la página no muestra la nota de hoja de ruta orientativa

### Requirement: Metadatos, imagen y datos estructurados de la página de serie
La página de serie SHALL incluir un breadcrumb visible `Inicio > Blog > Series > <nombre de la serie>` (donde «Inicio» enlaza a `/`, «Blog» enlaza a `/blog`, «Series» es texto sin enlace y el nombre de la serie es el elemento actual, sin enlace) y datos estructurados `BreadcrumbList` alineados con él, y datos estructurados `CollectionPage` cuyo contenido principal sea un `CreativeWorkSeries` con el nombre y la descripción de la serie. Las meta `description` y `og:description` SHALL usar la descripción de la serie. Cuando la serie define imagen, la cabecera de la página SHALL mostrarla y la meta `og:image` SHALL apuntar a ella; cuando no la define, la cabecera SHALL mostrar el marcador de posición de marca que usa la tarjeta de post sin imagen, y `og:image` SHALL usar la imagen por defecto del sitio. La imagen de la serie SHALL entregarse en un formato comprimido moderno (WebP o AVIF) y con proporción 2:1 (1774x887), mostrada completa a ancho completo en la cabecera.

#### Scenario: Serie con imagen
- **WHEN** se renderiza la página de una serie que define imagen
- **THEN** la cabecera muestra esa imagen y `og:image` apunta a ella

#### Scenario: Serie sin imagen
- **WHEN** se renderiza la página de una serie que no define imagen
- **THEN** la cabecera muestra el marcador de posición de marca y `og:image` es la imagen por defecto del sitio

#### Scenario: Datos estructurados de la serie
- **WHEN** se solicita la página de la serie «Asistente de código local»
- **THEN** los datos estructurados incluyen una `CollectionPage` cuyo contenido principal es un `CreativeWorkSeries` con ese nombre y su descripción, y un `BreadcrumbList` con Inicio, Blog, Series y el nombre de la serie

### Requirement: Accesibilidad y adaptación de la página de serie
La página de serie SHALL usar una jerarquía de encabezados coherente con un único `h1`, y la lista del contenido SHALL ser una lista ordenada. Sus enlaces SHALL tener foco visible y distinguirse del texto que los rodea sin depender solo del color. Su texto SHALL tener un contraste mínimo de 4.5:1 (WCAG 2.2 AA). SHALL funcionar sin scroll horizontal en anchos de 360px en adelante, incluso con títulos largos. Si la imagen de la serie acompaña al nombre de la serie, que ya es texto visible, SHALL tratarse como decorativa para tecnología de asistencia.

#### Scenario: Navegación con teclado
- **WHEN** un visitante recorre la página de serie con la tecla Tab
- **THEN** cada enlace muestra un indicador de foco visible

#### Scenario: Lector de pantalla
- **WHEN** un lector de pantalla recorre la lista del contenido de la serie
- **THEN** la anuncia como una lista ordenada con una entrada por parte, cada una con su estado

#### Scenario: Título largo en móvil
- **WHEN** una parte con un título largo se muestra en un viewport de 360px
- **THEN** el título se ajusta en varias líneas y la página no genera scroll horizontal

### Requirement: Enlace a la página de serie desde el bloque de navegación
El bloque de navegación de la serie SHALL incluir un enlace con el texto «Ver la serie completa» que apunte a la página de la serie. El enlace SHALL estar disponible siempre que el bloque se muestre y SHALL respetar los mismos criterios de foco visible, distinción sin depender solo del color y contraste que el resto de enlaces del bloque. El enlace no SHALL alterar la regla de visibilidad del bloque: con una sola parte publicada, el bloque sigue sin mostrarse.

#### Scenario: Bloque visible
- **WHEN** se renderiza una parte de una serie con 2 o más partes publicadas
- **THEN** el bloque muestra el enlace «Ver la serie completa» y este apunta a `/blog/series/<id>` de la serie

#### Scenario: Serie con una sola parte publicada
- **WHEN** se renderiza la única parte publicada de una serie
- **THEN** el bloque de navegación no se muestra y, por tanto, tampoco el enlace «Ver la serie completa»
