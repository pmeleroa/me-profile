## ADDED Requirements

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
