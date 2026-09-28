## ADDED Requirements

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
Cuando un post publicado pertenece a una serie, la página de artículo (`/blog/[slug]`) SHALL mostrar un antetítulo inmediatamente antes del título (`h1`) con, en este orden: un badge con el texto «Serie» (en mayúsculas), el nombre público de la serie y la indicación «Parte N», donde N es el número de parte del post. El antetítulo SHALL mostrarse aunque la serie tenga una sola parte publicada. El antetítulo no SHALL ser un enlace ni tener aspecto interactivo, y no SHALL mostrar el número total de partes de la serie. El badge SHALL distinguirse visualmente de la categoría y de los tags del artículo, de modo que no se confunda con ninguno de ellos aunque comparta color con la categoría. Cualquier emoji o icono del badge SHALL ser decorativo y quedar oculto a tecnología de asistencia, de forma que un lector de pantalla anuncie solo «Serie», el nombre de la serie y la parte. Todo el texto del antetítulo SHALL tener un contraste mínimo de 4.5:1 sobre su fondo (WCAG 2.2 AA). Cuando el post no pertenece a ninguna serie, la página no SHALL mostrar el antetítulo ni dejar un hueco en su lugar. Las tarjetas de post (listado de `/blog`, portada y artículos relacionados) no SHALL mostrar el antetítulo de serie completo; en ellas la pertenencia a una serie se indica solo con el badge definido en «Badge de serie en la tarjeta de post».

#### Scenario: Post que es parte de una serie
- **WHEN** se renderiza un post publicado que declara la serie «Asistente de código local» y el número de parte 1
- **THEN** encima del título aparece el antetítulo con el badge «Serie», el texto «Asistente de código local» y «Parte 1», sin ningún enlace

#### Scenario: Serie con una sola parte publicada
- **WHEN** se renderiza la única parte publicada de una serie
- **THEN** la página muestra igualmente el antetítulo de serie, sin indicar cuántas partes tendrá la serie

#### Scenario: Post fuera de cualquier serie
- **WHEN** se renderiza un post que no declara serie
- **THEN** la página no muestra antetítulo de serie y el título ocupa su posición habitual sin hueco

#### Scenario: Lectura con lector de pantalla
- **WHEN** un lector de pantalla recorre el antetítulo de un post de serie
- **THEN** anuncia «Serie», el nombre de la serie y la parte, sin anunciar el emoji decorativo

#### Scenario: Antetítulo ausente en las tarjetas
- **WHEN** se renderiza la tarjeta de un post de serie en el listado de `/blog`, en la portada o en los artículos relacionados
- **THEN** la tarjeta no muestra el nombre de la serie ni «Parte N», solo el badge de serie sobre la imagen

### Requirement: Badge de serie en la tarjeta de post
Toda tarjeta de post (listado de `/blog`, portada y artículos relacionados en `/blog/[slug]`) de un post que pertenece a una serie SHALL mostrar un badge con el texto «Serie» (en mayúsculas) superpuesto a la esquina superior izquierda de la imagen destacada, o del marcador de posición cuando el post no tiene imagen. El badge SHALL ser del mismo lenguaje visual que el del antetítulo del artículo (texto en color de acento, esquinas pequeñas, emoji decorativo oculto a tecnología de asistencia) y SHALL tener un fondo opaco, de modo que su texto mantenga un contraste mínimo de 4.5:1 (WCAG 2.2 AA) sea cual sea la imagen que tiene debajo. El badge no SHALL ser un enlace propio ni mostrar el nombre de la serie ni el número de parte. Las tarjetas de posts que no pertenecen a ninguna serie no SHALL mostrar el badge. El badge no SHALL alterar la secuencia de lectura ni las dimensiones de la tarjeta.

#### Scenario: Tarjeta de un post de serie
- **WHEN** se renderiza en el listado de `/blog` o en la sección «Últimas ideas» de la portada la tarjeta de un post que declara una serie
- **THEN** la tarjeta muestra sobre la esquina superior izquierda de la imagen el badge «Serie», con la misma altura de tarjeta que tendría sin él

#### Scenario: Tarjeta de un post sin serie
- **WHEN** se renderiza la tarjeta de un post que no declara serie
- **THEN** la tarjeta no muestra el badge de serie

#### Scenario: Badge sobre una imagen clara o recargada
- **WHEN** la imagen destacada de un post de serie tiene zonas claras o con mucho detalle bajo la esquina del badge
- **THEN** el texto del badge conserva un contraste de al menos 4.5:1, porque su fondo es opaco y no depende de la imagen

## MODIFIED Requirements

### Requirement: Orden de la estructura de la página de artículo
La página de artículo (`/blog/[slug]`) SHALL presentar sus bloques en esta secuencia de lectura: breadcrumb, categoría con metadatos (fecha de publicación, tiempo de lectura estimado y botón de compartir), antetítulo de serie (solo cuando el post pertenece a una serie), título (`h1`), bajada, tags, imagen destacada, contenido completo del artículo, bloque de autor, artículos relacionados y CTA final (con un botón de compartir junto al CTA principal). La categoría y los metadatos SHALL aparecer en la misma fila, con la categoría alineada a un extremo y los metadatos —incluyendo el botón de compartir— al extremo opuesto (mismo patrón que la fila de cabecera de la tarjeta de post). El antetítulo de serie SHALL ocupar su propia línea, fuera de la fila de categoría y metadatos. Los tags SHALL aparecer como bloque propio después de la bajada, antes de la imagen destacada.

#### Scenario: Post con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor, y que no pertenece a ninguna serie
- **THEN** la página muestra, en ese orden, el breadcrumb, la fila con la categoría y los metadatos (fecha, tiempo de lectura y botón de compartir) en extremos opuestos, el título, la bajada, los tags, la imagen destacada, el contenido, el autor, los relacionados y la CTA final con un segundo botón de compartir junto al CTA principal

#### Scenario: Post de una serie con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor, y que pertenece a una serie
- **THEN** la página muestra el mismo orden que un post sin serie, con el antetítulo de serie en su propia línea entre la fila de categoría y metadatos y el título

### Requirement: Bloque de metadatos del artículo
La página de artículo SHALL mostrar la fecha de publicación y el tiempo de lectura estimado del artículo principal (calculado a partir del contenido del post, igual que ya se calcula para las tarjetas relacionadas), con el mismo formato de fecha y de tiempo de lectura que ya usa la tarjeta de post (`BlogCard`). La fecha de actualización del post, cuando existe, no SHALL mostrarse al visitante: queda como traza de la última modificación para los metadatos que leen buscadores y redes (ver «Datos estructurados SEO del artículo»). El bloque de metadatos SHALL mostrar solo la fecha de publicación y el tiempo de lectura, sin hueco visualmente roto, tanto si el post define fecha de actualización como si no.

#### Scenario: Post sin fecha de actualización
- **WHEN** un post no define fecha de actualización
- **THEN** el bloque de metadatos muestra la fecha de publicación y el tiempo de lectura, sin ningún indicador de actualización

#### Scenario: Post con fecha de actualización
- **WHEN** un post define una fecha de actualización posterior a la de publicación
- **THEN** el bloque de metadatos muestra solo la fecha de publicación y el tiempo de lectura, sin ningún texto ni fecha de actualización visible

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
