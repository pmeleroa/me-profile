## MODIFIED Requirements

### Requirement: Combinación del filtro de categoría con el filtro de tags
Cuando hay una categoría activa y uno o varios tags activos simultáneamente, el sistema SHALL mostrar solo los posts que cumplen ambas condiciones a la vez (categoría activa Y al menos uno de los tags activos).

#### Scenario: Categoría y tags activos a la vez
- **WHEN** el visitante tiene activa la categoría `Análisis` y el tag `ia-generativa`
- **THEN** el listado muestra solo los posts cuyo tipo es `Análisis` y que además incluyen el tag `ia-generativa`

#### Scenario: Combinación sin resultados
- **WHEN** la combinación de categoría y tags activos no coincide con ningún post
- **THEN** el listado se muestra vacío con un mensaje indicando que no hay resultados para esa combinación de filtros

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

## ADDED Requirements

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

### Requirement: Chips de tipo siempre visibles en el listado
El listado de `/blog` SHALL mostrar un chip de filtro para cada uno de los 4 tipos de la taxonomía (`Opinión`, `Análisis`, `Guía`, `Recursos`), incluso cuando no exista todavía ningún post publicado de ese tipo. Un chip sin posts SHALL mostrar un contador en `0` y SHALL permitir activarse igual que el resto.

#### Scenario: Tipo sin posts publicados se muestra igualmente
- **WHEN** ningún post publicado tiene `category: "Guía"`
- **THEN** el chip `Guía` aparece en el listado con un contador `0`

#### Scenario: Activar un chip sin posts
- **WHEN** el visitante activa un chip de un tipo sin posts publicados
- **THEN** el listado se muestra vacío con el mensaje de "sin resultados para esa combinación de filtros"

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
