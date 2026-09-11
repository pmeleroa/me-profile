## MODIFIED Requirements

### Requirement: Orden de la estructura de la página de artículo
La página de artículo (`/blog/[slug]`) SHALL presentar sus bloques en esta secuencia de lectura: breadcrumb, categoría con metadatos (fecha de publicación, tiempo de lectura estimado y botón de compartir), título (`h1`), bajada, tags, imagen destacada, contenido completo del artículo, bloque de autor, artículos relacionados y CTA final (con un botón de compartir junto al CTA principal). La categoría y los metadatos SHALL aparecer en la misma fila, con la categoría alineada a un extremo y los metadatos —incluyendo el botón de compartir— al extremo opuesto (mismo patrón que la fila de cabecera de la tarjeta de post). Los tags SHALL aparecer como bloque propio después de la bajada, antes de la imagen destacada.

#### Scenario: Post con todos los datos disponibles
- **WHEN** se renderiza un post que tiene categoría, tags, bajada, fecha, imagen y autor
- **THEN** la página muestra, en ese orden, el breadcrumb, la fila con la categoría y los metadatos (fecha, tiempo de lectura y botón de compartir) en extremos opuestos, el título, la bajada, los tags, la imagen destacada, el contenido, el autor, los relacionados y la CTA final con un segundo botón de compartir junto al CTA principal

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

## ADDED Requirements

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
