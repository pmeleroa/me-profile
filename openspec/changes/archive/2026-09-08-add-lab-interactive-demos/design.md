## Context

Ver `proposal.md` - Why. Estado actual relevante para el diseño:

- La única demo interactiva hoy (`public/gamification/test-memoria.html`)
  es un HTML standalone de 739 líneas: `<head>` propio, fuentes de Google
  Fonts propias y ~150 líneas de tokens CSS que **coinciden valor a valor**
  con los definidos en `src/styles/global.css` (mismo `--color-bg`,
  `--color-accent`, etc.) — están duplicados, no compartidos.
- `Layout.astro` no incluye `Header`/`Footer` por sí mismo; cada página
  (`index.astro`, `blog/[slug].astro`) los compone explícitamente. Omitir
  ese chrome en una página nueva no requiere ningún cambio en `Layout.astro`.
- El sitio no usa ningún framework de UI (React/Vue/etc.), solo Astro + JS
  vanilla por página. La demo actual también es JS vanilla.
- El schema de la colección `blog` (`src/content.config.ts`) no tiene hoy
  ningún campo que relacione un post con contenido externo a la prosa.

## Goals / Non-Goals

**Goals:**
- Un patrón de página reutilizable en `/lab/<slug>` para demos futuras,
  sin duplicar tokens de diseño.
- Chrome mínimo (un enlace de vuelta) que no compita con el ritmo de la
  demo.
- Migrar la demo existente a ese patrón preservando la URL indexada vía
  redirect 301.
- Una forma estructurada (no un enlace suelto en markdown) de declarar que
  un post de `blog` tiene una demo asociada.

**Non-Goals:**
- No se introduce ningún framework de UI ni librería de interactividad
  nueva: cada demo sigue siendo JS vanilla embebido en su página, igual
  que ahora.
- No se crea una página índice que liste todas las demos de `/lab/`. Con
  una sola demo no está justificada; queda como pregunta abierta si el
  número crece.
- No se impone un "design system" de componentes compartido entre demos
  más allá de los tokens de `global.css` — cada demo conserva libertad
  total de maquetación/JS propio.
- No cambia el contrato de publicación de `blog` (ver proposal.md).

## Decisions

**1. Páginas Astro en `/lab/<slug>` en vez de HTML standalone en `public/`**
Cada demo es un archivo `src/pages/lab/<slug>.astro` que envuelve su
marcado/JS bespoke con `Layout.astro` (reutilizando así `global.css`, SEO,
GA y el script de scroll-reveal ya centralizados) en vez de un `<html>`
completo aparte. Alternativa descartada: mantener HTML standalone en
`public/` — es lo que ya existe y funciona, pero perpetúa la duplicación
de tokens y no deja rastro de vuelta al sitio.

**2. Chrome mínimo: un componente `LabBackLink`, sin `Header`/`Footer`**
Se añade un componente pequeño (`src/components/LabBackLink.astro`) con un
único enlace "← Volver al artículo" apuntando al post de origen (el href
se pasa como prop desde cada página de `/lab/`, sin lookup automático:
con una sola demo, resolverlo dinámicamente sería una abstracción
prematura). No se importan `Header`/`Footer` en las páginas de `/lab/`.
Alternativa descartada: reutilizar `Header`/`Footer` completos — el `Header`
incluye enlaces a secciones (`#about`, `#projects`) que no aplican fuera
de la home, y compite por atención con una demo cuyo ritmo importa (el
test de memoria depende de timing).

**3. Namespace de rutas: `/lab/`**
Elegido por ser corto y coherente con el uso ya existente de términos
técnicos en inglés en las rutas del sitio (`/blog/`, `/skills/`).
Alternativas consideradas: `/demos/` (más literal, más largo) y
`/experimentos/` (100% español, aún más largo); ninguna aportaba ventaja
suficiente para desviarse de la convención ya establecida.

**4. Migración con redirección declarativa (no HTTP 301 real)**
`astro.config.mjs` añade:
```js
redirects: {
  '/gamification/test-memoria.html': '/lab/test-memoria',
}
```
y se retira `public/gamification/test-memoria.html` una vez migrado su
contenido a `src/pages/lab/test-memoria.astro`.

Confirmado en build (`dist/gamification/test-memoria.html/index.html`):
como el sitio usa `output: 'static'` sin adapter y se despliega en
GitHub Pages (hosting 100% estático, sin lógica de servidor), Astro
resuelve esta opción como una página HTML de redirección del lado del
cliente, no como un HTTP 301:
```html
<meta http-equiv="refresh" content="0;url=/lab/test-memoria">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://pablomeleroalonso.me/lab/test-memoria">
```
Funciona igual para el visitante (redirección inmediata, sin depender de
JS) y el `canonical` + `noindex` evita contenido duplicado a efectos de
SEO, aunque no es idéntico a un 301 servido por el servidor.

Alternativas descartadas: (a) dejar la URL antigua como caso legacy sin
migrar — el propio Pablo prefirió consistencia inmediata frente a
arrancar `/lab/` "limpio"; (b) conseguir un 301 real añadiendo un adapter
con servidor o una capa de hosting adicional (p. ej. un Cloudflare
Worker) — se descarta por chocar con la regla del proyecto de no añadir
backend o infraestructura adicional por conveniencia, solo para resolver
un único redirect.

**5. Campo estructurado en el schema de `blog`**
En `src/content.config.ts`, añadir a `blogCollection`:
```ts
demo: z
  .object({
    slug: z.string(),                          // debe existir /lab/<slug>
    label: z.string().default('Demo interactiva'),
  })
  .optional(),
```
Se guarda el `slug` interno (no una URL completa) para que un demo
declarado en un post sea siempre same-site y la página/`BlogCard` puedan
construir el `href` como `/lab/${demo.slug}`. Alternativa descartada:
guardar una URL completa en el campo — permitiría enlazar a cualquier
sitio externo, perdiendo la garantía de que "demo" significa siempre una
página de `/lab/` de este mismo sitio, y no aporta nada que el `slug` no
resuelva ya.

## Risks / Trade-offs

- [Limitación confirmada] En GitHub Pages (hosting estático sin adapter),
  `redirects` de Astro no puede emitir un HTTP 301 real; se resuelve como
  una página de redirección del lado del cliente (meta-refresh +
  `canonical` + `noindex`) → Mitigación: aceptada como el mecanismo real
  de migración de esta URL (ver Decisión 4); confirmado con `npm run
  build` + inspección de `dist/`.
- [Riesgo] Sin página índice de `/lab/`, el descubrimiento de una demo
  depende al 100% de que el post que la origina la enlace → Mitigación:
  aceptado como Non-Goal para esta primera demo migrada; se revisa si
  aparecen más.
- [Riesgo] El campo `demo` del schema no fuerza que `demo.slug` corresponda
  a una página real de `/lab/` (Zod no puede validar contra el sistema de
  archivos) → Mitigación: con una sola demo el riesgo es bajo; si el
  patrón crece, se puede añadir una comprobación en build (fuera de
  alcance de este cambio).

## Migration Plan

1. Crear `src/pages/lab/test-memoria.astro`: mover el marcado/CSS/JS de
   `public/gamification/test-memoria.html`, envolverlo con `Layout.astro`
   y añadir `LabBackLink` apuntando a `/blog/perdidos-en-el-medio`.
2. Añadir el redirect declarativo en `astro.config.mjs`.
3. Añadir el campo `demo` opcional a `blogCollection` en
   `src/content.config.ts`.
4. Actualizar `perdidos-en-el-medio.mdx`: declarar `demo: { slug:
   "test-memoria" }` en el frontmatter y, si se decide en tasks, sustituir
   o complementar el enlace en prosa.
5. Eliminar `public/gamification/test-memoria.html`.
6. Verificar con `npm run build` + inspección de `dist/`: la URL antigua
   sirve la página de redirección (meta-refresh + `canonical` a
   `/lab/test-memoria` + `noindex`), la nueva página renderiza igual que
   la original, y el post sigue enlazando correctamente.

Rollback: cambio puramente estático (sin migraciones de datos ni estado
en runtime) — revertir el/los commit(s) de este change o `git checkout`
de los archivos afectados es suficiente.

## Open Questions

- ¿Cuándo justifica el número de demos publicadas crear una página índice
  de `/lab/`? No cambia el enfoque de este change — se puede decidir más
  adelante sin tocar lo ya especificado aquí.
