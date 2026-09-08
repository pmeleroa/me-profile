## Why

El formato "post + demo interactiva" (el test de memoria enlazado desde
`perdidos-en-el-medio.mdx`, servido como HTML standalone en
`public/gamification/test-memoria.html`) ya ha validado que encaja con el
posicionamiento del sitio (arquitectura + IA aplicada, audiencia técnica).
Hoy es un caso aislado sin patrón reutilizable: cada demo futura tendría
que copiar a mano ~150 líneas de tokens de diseño que ya son idénticos a
los de `global.css`, no tiene enlace de vuelta al sitio, y su relación con
el post que la origina vive solo como un enlace suelto en el markdown.
Formalizar el patrón ahora evita esa duplicación y deja un camino claro
para las próximas demos.

## What Changes

- Introducir el espacio de rutas `/lab/<slug>` para demos interactivas,
  como páginas Astro que reutilizan los tokens de `global.css` en lugar de
  duplicarlos en HTML standalone dentro de `public/`.
- Cada página de `/lab/` usa un chrome mínimo (un enlace de vuelta al
  artículo de origen), sin el `Header`/`Footer` completos del sitio, para
  no competir con el ritmo y el foco de la demo.
- Migrar el demo existente `public/gamification/test-memoria.html` a
  `/lab/test-memoria`, con una redirección declarativa (`redirects` en
  `astro.config.mjs`) desde la URL antigua — en el hosting estático de
  este sitio (GitHub Pages, sin adapter de servidor) esto se resuelve
  como una página de redirección del lado del cliente (meta-refresh +
  `canonical` + `noindex`), no como un HTTP 301 real.
- Actualizar el enlace en `src/content/blog/perdidos-en-el-medio.mdx` para
  apuntar a la nueva URL.
- Añadir un campo opcional en el schema de la colección `blog`
  (`src/content.config.ts`) para declarar de forma estructurada que un
  post tiene una demo de `/lab/` asociada, en lugar de depender de un
  enlace suelto en la prosa.
- No hay cambios **BREAKING** de cara al visitante: la URL antigua se
  mantiene accesible vía redirect.

Nota sobre el contrato de publicación: este cambio no modifica el
contrato de publicación de la colección `blog` (el único campo que
gobierna la publicación sigue siendo `draft`; no existen hoy campos
`status`/`approvedBy`/`approvedAt` en el schema). El nuevo campo es
puramente descriptivo — vincula un post con una demo — y no participa en
si el post se publica o no.

## Capabilities

### New Capabilities

- `lab`: patrón de páginas de demo interactiva bajo `/lab/<slug>` —
  reutilización de los tokens de diseño del sitio, chrome mínimo de
  navegación, asociación estructurada opcional desde un post de `blog`, y
  redirect de la URL legacy migrada.

### Modified Capabilities

(ninguna — no existe hoy un spec de `blog` que modificar; el requisito de
que un post pueda declarar una demo asociada queda cubierto dentro de la
nueva capability `lab`)

## Impact

- Código: nuevas páginas bajo `src/pages/lab/`; `astro.config.mjs`
  (redirect declarativo); `src/content.config.ts` (campo opcional de
  demo en el schema de `blog`); `src/content/blog/perdidos-en-el-medio.mdx`
  (actualizar enlace); se retira `public/gamification/test-memoria.html`
  tras la migración.
- Dependencias: ninguna nueva — sigue sin frameworks adicionales, Astro +
  JS vanilla como hasta ahora.
- Backend/CMS: sin cambios (el sitio sigue sin backend ni CMS remoto).
- SEO: la página de redirección (meta-refresh + `canonical` a la nueva
  URL + `noindex` en la antigua) consolida la señal de indexación sin
  depender de un HTTP 301, que este hosting no puede emitir.
