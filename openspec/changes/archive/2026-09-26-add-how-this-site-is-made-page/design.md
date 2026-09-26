## Context

Ver `proposal.md` (Why) para la motivación y `specs/how-site-is-made/spec.md` para los requisitos de la página.

Estado actual relevante:

- Las páginas de sección (`/experience`, `/skills`) se generan desde `src/pages/[section].astro` con `src/data/pageSections.ts`. La cabecera (`Header.astro`) y el footer (`Footer.astro`) leen esa misma lista para pintar su navegación.
- `/contacto` es una página suelta (`src/pages/contacto.astro`) que monta `Layout`, `Header` y `Footer` y define su contenido en un array local.
- El footer contiene hoy el texto fijado por la spec `site-footer`, y "IA" va resaltado con el color de acento.
- El repositorio `pmeleroa/me-profile` es público. Los changes archivados contienen evidencia real del flujo, por ejemplo la pregunta y la respuesta literales de un consentimiento de publicación.

## Goals / Non-Goals

**Goals:**

- Una página estática y autocontenida, sin JavaScript, que siga los patrones del sitio.
- Que los enlaces de evidencia no se rompan aunque el repositorio se reorganice.
- Que el cambio del footer se limite a añadir el enlace, sin tocar el texto visible.

**Non-Goals:**

- Generar contenido a partir de `openspec/` en tiempo de build (el "nivel 3" que se descartó en el debate).
- Añadir la página a la navegación de la cabecera o a la lista de secciones del footer.
- Corregir el contraste de `--color-text-muted`. Es un problema previo, registrado como trabajo futuro con su propio change.

## Decisions

### D1. Página suelta en `src/pages/como-se-hace.astro`, fuera de `pageSections`

Sigue el patrón de `contacto.astro`: `Layout` con `title` y `description` propios, más `Header` y `Footer`.

**Alternativa descartada:** registrarla en `pageSections.ts`. Al hacerlo aparecería automáticamente en la cabecera y en los enlaces de sección del footer, y eso contradice la decisión de enlazarla solo desde la frase del footer.

### D2. Contenido definido en la propia página

Las fases se definen como un array local en el frontmatter de la página, igual que `topics` en `contacto.astro`, y se pintan como una lista ordenada.

**Alternativa descartada:** un archivo en `src/data/`. Solo tendría un consumidor y no aporta nada frente al patrón ya usado en `/contacto`.

### D3. Estructura de la página

1. **Introducción.** Qué significa "Contenido creado con IA, revisado y validado por mí" en este sitio y qué no significa: no hay revisión de terceros ni certificación.
2. **Esquema de arquitectura** de la solución (D10), antes del flujo.
3. **El flujo, en cuatro fases**, y para cada una qué hace la IA y qué decide el autor:
   - **Debate** (explore o blog-post): la IA pregunta, contrasta con el repositorio y propone opciones con una recomendación. El autor elige, corrige o descarta.
   - **Acuerdo** (propose): la IA redacta la propuesta, el diseño, las specs y las tareas a partir de lo debatido. El autor revisa el alcance antes de construir.
   - **Construcción** (apply): la IA escribe el código o el texto y lo verifica con build, validación y checks de calidad. El autor revisa el resultado.
   - **Publicación** (archive y PR): la IA pide el consentimiento para publicar y la respuesta literal queda registrada. El autor hace siempre el merge.
4. **Cierre:** invitación a comentar o compartir otro punto de vista por `/contacto`. En línea con la introducción, el contenido se presenta como opiniones y comentarios personales, no como algo que se corrige a petición.

El texto definitivo se redacta en `apply`, debatiéndolo con el autor como cualquier otro contenido público (ver D7).

### D4. Sin enlaces de evidencia ni bloque de herramientas (retirados)

El primer borrador incluía una sección "Compruébalo en el repositorio", con tres enlaces al repositorio público fijados al SHA `8e3de004f9dd5d4441c7193ba82c0c360f050c3e`, y un bloque "Herramientas". Tras aprobar la versión con el esquema de arquitectura, el autor pidió eliminar ambas secciones. La página queda centrada en el esquema y en el reparto por fases. Las herramientas siguen visibles dentro del esquema, y el repositorio público sigue existiendo aunque la página no enlace a él.

### D5. Enlace en el footer

En `Footer.astro`, el fragmento "revisado y validado por mí" pasa a ser un `<a href={`${import.meta.env.BASE_URL}como-se-hace`}>`. El texto visible no cambia y "IA" sigue resaltada. El enlace hereda el estilo de los enlaces de `.footer-copy`, como los de "Pablo Melero Alonso" y "Astro", y se abre en la misma pestaña porque es una página interna.

### D6. Herramientas sin modelos en el esquema, y Codex según declara el autor

La página nombra herramientas, no modelos. El historial de Git ya muestra varios modelos en pocas semanas (Sonnet 5, Opus 5 y Opus 5.5), así que nombrarlos haría que la página se quedara desactualizada muy rápido.

Claude Code deja rastro verificable en el repositorio (`.claude/` y los trailers `Co-Authored-By`). Codex no deja rastro y figura porque el autor declara que lo usa. La página no presenta las herramientas del esquema como evidencia.

### D7. Aprobación del texto por el autor

La página es contenido público, pero no pertenece a la colección `blog`, así que no tiene campo `draft` y Q09 no se aplica literalmente. Aun así, `tasks.md` incluye una tarea de aprobación del texto final por el autor, con la pregunta y la respuesta literales. Sin esa aprobación, el change no se archiva. Esto aplica a la propia página el principio que la página describe.

### D8. Retirar la entrada de trabajo futuro

La entrada "explicar cómo trabaja el autor apoyándose en la IA…" de `openspec/config.yaml` (`rules.design`) se elimina en la misma rama, antes de archivar, porque este change la resuelve.

### D9. Presentación visual del flujo en carriles

Tras revisar el primer borrador, el autor pidió una versión más visual y eligió un diagrama en carriles frente a una línea de tiempo con iconos y un diagrama circular. Las fases se muestran como columnas conectadas por flechas, con el carril de la IA arriba (borde y etiqueta en `--color-accent`) y el del autor abajo (`--color-logo-yellow`). Entre ambos hay un `⇅` que representa el ida y vuelta del consenso, y una leyenda ("La IA propone" / "Yo decido") explica los colores.

- **En escritorio** (1024px o más), una rejilla de 4 columnas con `grid-template-rows: subgrid` alinea el título, el carril de la IA, el `⇅` y el carril del autor entre fases.
- **Por debajo de 1024px**, las fases se apilan en vertical y las flechas apuntan hacia abajo.
- **El HTML sigue ordenado por fase** (título, IA, autor), así que la lectura lineal y los lectores de pantalla recorren las fases en el orden de la spec. Las flechas, el `⇅` y la leyenda son decorativos (`aria-hidden` o pseudo-elementos). Cada carril lleva su etiqueta en texto ("La IA", "Yo"), de modo que el color no es el único indicador.
- **Sin animaciones ni JavaScript**, todo con HTML y CSS.

**Alternativas descartadas:**

- Una línea de tiempo con iconos es más narrativa, pero diluye el reparto entre IA y autor.
- Un diagrama circular en SVG es muy distintivo, pero separa el detalle de quién hace qué del gráfico.

### D10. Esquema de arquitectura de la solución

El autor aclaró que "más visual" significaba sobre todo un esquema de arquitectura de la solución, y decidió colocarlo arriba como visión de conjunto, con los carriles de D9 debajo como detalle de cada fase.

- **SVG inline** con clases propias coloreadas con los tokens del sitio: `--color-logo-yellow` para el autor, `--color-accent` para los agentes y las flechas, `--color-surface` y `--color-border` para las cajas. No es una imagen externa, así que no pasa por la pipeline de imágenes y no añade peticiones.
- **Dos variantes del mismo esquema:** una horizontal para 1024px o más, igual que los carriles, y una vertical por debajo (a 768px la horizontal dejaría las etiquetas en unos 9-10px efectivos). Se alternan con `display: none` por media query, y la oculta tampoco llega al árbol de accesibilidad. Los `id` de los marcadores de flecha son distintos en cada variante.
- **Accesibilidad:** cada SVG tiene `role="img"` con `<title>` y un `<desc>` completo con todos los componentes y relaciones. Hubo un `<details>` visible ("El esquema en texto") que se retiró a petición del autor; la descripción del SVG pasó a incluir todo su contenido.
- **OpenSpec** aparece como una nota discontinua con las cuatro fases numeradas, que enlaza visualmente con la sección del flujo.

**Alternativa descartada:** cajas en HTML y CSS. Se adaptan mejor al ancho, pero las flechas entre componentes no contiguos (autor → repositorio, repositorio → Actions) exigen posicionamiento frágil.

### D11. Infografía del caso de uso: cómo nace un artículo

El autor pidió una infografía de cómo se apoya en OpenSpec para generar los artículos, porque el resto de la página se centra en el desarrollo. El contenido sale del flujo real del repositorio:

- la skill `.claude/skills/blog-post` (modo entrevistador: tipo de post, tesis retada con contraargumento, datos verificados, sin escribir ficheros);
- `/opsx:propose` (change con la tesis y la estructura en el diseño);
- `/opsx:apply` (redacción del `.mdx`, contraste con fuentes, comandos probados, ajustes que pide el autor);
- `/opsx:archive` (consentimiento literal registrado; sin él, `draft: true`).

Las reglas editoriales resumen las de `openspec/config.yaml`: no inventar datos, tesis retada y Q09. La regla de la terminal Linux se retiró de la infografía a petición del autor.

- **HTML y CSS con iconos SVG de trazo en línea** (`aria-hidden`), no un SVG único, para que el texto sea real y se adapte al ancho. En escritorio (1024px o más), cuatro estaciones en horizontal unidas por una línea con degradado del turquesa de la IA al amarillo del autor. Por debajo, una línea de tiempo vertical.
- Cada estación repite el código de color de los carriles (La IA en turquesa, Yo en amarillo) y cierra con una pastilla "Sale" con el resultado.
- **Sin cifras.** El número de ajustes pedidos por el autor varía mucho entre changes (de 0 a 9 menciones "a petición del autor"), así que no se generaliza.

**Alternativa descartada:** un SVG como el esquema de arquitectura. Obliga a mantener dos variantes y el texto no se adapta.

## Risks / Trade-offs

- [La página se desactualiza si el flujo cambia, por ejemplo con nuevas fases o herramientas] → Describe las fases de forma genérica y nombra herramientas, no versiones.
- [Codex no es verificable en el repositorio] → La página no presenta las herramientas del esquema como evidencia (D6).
- [El enlace del footer se distingue del texto que lo rodea solo por el color] → Hereda `.footer-copy a` (`--color-accent`, 8.77:1 sobre el fondo, medido en `update-footer-ai-disclosure`), sin subrayado, igual que los enlaces actuales del footer. En `apply` se mide el contraste entre `--color-accent` y `--color-text-muted`. Si no llega a 3:1 (WCAG 1.4.1), se registra como patrón previo de los enlaces del footer, igual que el contraste de `--color-text-muted`, y no se corrige en este change.

## Migration Plan

- Despliegue con el pipeline habitual (GitHub Actions a GitHub Pages) tras el merge.
- Reversión: `git revert` de los commits del change. La página desaparece y el footer vuelve a no tener enlace. No hay datos que migrar.
