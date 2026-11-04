# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
