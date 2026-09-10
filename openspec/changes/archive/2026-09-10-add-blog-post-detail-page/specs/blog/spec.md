## ADDED Requirements

### Requirement: Orden de la estructura de la página de artículo
La página de artículo (`/blog/[slug]`) SHALL presentar sus bloques en esta secuencia de lectura: breadcrumb, categoría con metadatos (fecha de publicación y tiempo de lectura estimado), título (`h1`), bajada, tags, imagen destacada, contenido completo del artículo, bloque de autor, artículos relacionados y CTA final. La categoría y los metadatos SHALL aparecer en la misma fila, con la categoría alineada a un extremo y los metadatos al extremo opuesto (mismo patrón que la fila de cabecera de la tarjeta de post). Los tags SHALL aparecer como bloque propio después de la bajada, antes de la imagen destacada.

#### Scenario: Post con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor
- **THEN** la página muestra, en ese orden, el breadcrumb, la fila con la categoría y los metadatos (fecha y tiempo de lectura) en extremos opuestos, el título, la bajada, los tags, la imagen destacada, el contenido, el autor, los relacionados y la CTA final

### Requirement: Breadcrumb contextual en la página de artículo
La página de artículo SHALL mostrar una navegación de breadcrumb semántica (`nav` con lista ordenada) con los niveles Inicio, Blog y la categoría del post, sin incluir el título del post. Los tres niveles SHALL ser enlaces. El enlace de la categoría SHALL llevar al listado de `/blog` filtrado por esa categoría.

#### Scenario: Navegación por el breadcrumb
- **WHEN** un visitante hace click en el nivel "Blog" del breadcrumb de un artículo
- **THEN** navega al listado de `/blog` sin ningún filtro activo

#### Scenario: Click en la categoría del breadcrumb
- **WHEN** un visitante hace click en el nivel de categoría del breadcrumb (por ejemplo, "Arquitectura")
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
Todos los enlaces y botones interactivos de la página de artículo (breadcrumb, tags, enlaces del bloque de autor, y CTA final) SHALL distinguir visualmente un estado `:hover` y un estado `:focus-visible`, de forma que la navegación por teclado deje siempre un indicador de foco visible.

#### Scenario: Navegación por teclado por los tags del artículo
- **WHEN** un visitante navega la página con el teclado y el foco llega a uno de los tags del artículo
- **THEN** el tag muestra un indicador de foco visible (`:focus-visible`), diferenciado del estado sin foco

#### Scenario: Navegación por teclado por la CTA final
- **WHEN** el foco llega al botón de la CTA final mediante teclado
- **THEN** el botón muestra un indicador de foco visible, diferenciado del estado sin foco
