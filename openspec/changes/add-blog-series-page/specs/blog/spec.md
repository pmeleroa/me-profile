## ADDED Requirements

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
La página de serie SHALL incluir un breadcrumb visible `Inicio > Blog > <nombre de la serie>` (donde «Inicio» enlaza a `/`, «Blog» enlaza a `/blog` y el nombre de la serie es el elemento actual, sin enlace) y datos estructurados `BreadcrumbList` alineados con él, y datos estructurados `CollectionPage` cuyo contenido principal sea un `CreativeWorkSeries` con el nombre y la descripción de la serie. Las meta `description` y `og:description` SHALL usar la descripción de la serie. Cuando la serie define imagen, la cabecera de la página SHALL mostrarla y la meta `og:image` SHALL apuntar a ella; cuando no la define, la cabecera SHALL mostrar el marcador de posición de marca que usa la tarjeta de post sin imagen, y `og:image` SHALL usar la imagen por defecto del sitio. La imagen de la serie SHALL entregarse en un formato comprimido moderno (WebP o AVIF) y con dimensiones acordes a su mayor contexto de uso, que es `og:image` (1200x630).

#### Scenario: Serie con imagen
- **WHEN** se renderiza la página de una serie que define imagen
- **THEN** la cabecera muestra esa imagen y `og:image` apunta a ella

#### Scenario: Serie sin imagen
- **WHEN** se renderiza la página de una serie que no define imagen
- **THEN** la cabecera muestra el marcador de posición de marca y `og:image` es la imagen por defecto del sitio

#### Scenario: Datos estructurados de la serie
- **WHEN** se solicita la página de la serie «Asistente de código local»
- **THEN** los datos estructurados incluyen una `CollectionPage` cuyo contenido principal es un `CreativeWorkSeries` con ese nombre y su descripción, y un `BreadcrumbList` con Inicio, Blog y el nombre de la serie

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

## MODIFIED Requirements

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
