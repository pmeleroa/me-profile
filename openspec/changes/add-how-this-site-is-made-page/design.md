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

Las fases, las herramientas y los ejemplos se definen como arrays locales en el frontmatter de la página, igual que `topics` en `contacto.astro`, y se pintan con marcado semántico: una lista ordenada para las fases y enlaces normales para los ejemplos.

**Alternativa descartada:** un archivo en `src/data/`. Solo tendría un consumidor y no aporta nada frente al patrón ya usado en `/contacto`.

### D3. Estructura de la página

1. **Introducción.** Qué significa "Contenido creado con IA, revisado y validado por mí" en este sitio y qué no significa: no hay revisión de terceros ni certificación.
2. **El flujo, en cuatro fases**, y para cada una qué hace la IA y qué decide el autor:
   - **Debate** (explore o blog-post): la IA pregunta, contrasta con el repositorio y propone opciones con una recomendación. El autor elige, corrige o descarta.
   - **Acuerdo** (propose): la IA redacta la propuesta, el diseño, las specs y las tareas a partir de lo debatido. El autor revisa el alcance antes de construir.
   - **Construcción** (apply): la IA escribe el código o el texto y lo verifica con build, validación y checks de calidad. El autor revisa el resultado.
   - **Publicación** (archive y PR): la IA pide el consentimiento para publicar y la respuesta literal queda registrada. El autor hace siempre el merge.
3. **Ejemplos en el repositorio**, con enlaces fijados a un commit (D4).
4. **Herramientas**, en un bloque breve: Astro, GitHub Pages, OpenSpec, Claude Code y Codex.
5. **Cierre:** si alguien encuentra un error, puede avisar por `/contacto`.

El texto definitivo se redacta en `apply`, debatiéndolo con el autor como cualquier otro contenido público (ver D7).

### D4. Enlaces de evidencia fijados a un SHA completo

Todos los enlaces usan `https://github.com/pmeleroa/me-profile/blob/<sha>/<ruta>` o `/tree/<sha>/<ruta>`, con el SHA completo de un commit de `main` en el que existan las rutas enlazadas. El SHA se define una sola vez como constante en la página. Los anclajes de línea, como `#L130`, son estables porque el contenido está fijado.

Ejemplos previstos, sujetos a comprobarlos en `apply`:

- `openspec/changes/archive/2026-09-09-require-post-publish-confirmation/proposal.md`: la regla de consentimiento de publicación y por qué se creó.
- `openspec/changes/archive/2026-09-25-add-ollama-local-guide-post/tasks.md#L130`: la pregunta y la respuesta literales de un consentimiento real.
- `openspec/changes/archive/2026-09-25-update-footer-ai-disclosure/`: un change que dejó por escrito una decisión aplazada, que es el origen de esta página.

**Alternativa descartada:** enlazar a `main`. Es más sencillo, pero un archivado o una reorganización rompería los enlaces (Q07).

### D5. Enlace en el footer

En `Footer.astro`, el fragmento "revisado y validado por mí" pasa a ser un `<a href={`${import.meta.env.BASE_URL}como-se-hace`}>`. El texto visible no cambia y "IA" sigue resaltada. El enlace hereda el estilo de los enlaces de `.footer-copy`, como los de "Pablo Melero Alonso" y "Astro", y se abre en la misma pestaña porque es una página interna.

### D6. Herramientas sin modelos, y Codex según declara el autor

La página nombra herramientas, no modelos. El historial de Git ya muestra varios modelos en pocas semanas (Sonnet 5, Opus 5 y Opus 5.5), así que nombrarlos haría que la página se quedara desactualizada muy rápido.

Claude Code deja rastro verificable en el repositorio (`.claude/` y los trailers `Co-Authored-By`). Codex no deja rastro y figura porque el autor declara que lo usa. Por eso la página no ofrece evidencia de repositorio para las herramientas, solo para el flujo.

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

## Risks / Trade-offs

- [La página se desactualiza si el flujo cambia, por ejemplo con nuevas fases o herramientas] → Describe las fases de forma genérica y nombra herramientas, no versiones. Los enlaces fijados siguen siendo válidos aunque ya no reflejen el estado actual.
- [Codex no es verificable en el repositorio] → La página no presenta la lista de herramientas como evidencia (D6).
- [El enlace del footer se distingue del texto que lo rodea solo por el color] → Hereda `.footer-copy a` (`--color-accent`, 8.77:1 sobre el fondo, medido en `update-footer-ai-disclosure`), sin subrayado, igual que los enlaces actuales del footer. En `apply` se mide el contraste entre `--color-accent` y `--color-text-muted`. Si no llega a 3:1 (WCAG 1.4.1), se registra como patrón previo de los enlaces del footer, igual que el contraste de `--color-text-muted`, y no se corrige en este change.
- [Los anclajes de línea apuntan a una línea equivocada] → Se abren y comprueban todos en `apply`, contra el SHA elegido.

## Migration Plan

- Despliegue con el pipeline habitual (GitHub Actions a GitHub Pages) tras el merge.
- Reversión: `git revert` de los commits del change. La página desaparece y el footer vuelve a no tener enlace. No hay datos que migrar.
