## 1. Modelo de contenido

- [x] 1.1 Añadir el campo opcional `demo` (`slug: z.string()`, `label:
      z.string().default('Demo interactiva')`) al schema de
      `blogCollection` en `src/content.config.ts`; verificar ejecutando
      `npm run build` y comprobando que compila sin errores de
      validación de Zod.
- [x] 1.2 Declarar `demo: { slug: "test-memoria" }` en el frontmatter de
      `src/content/blog/perdidos-en-el-medio.mdx`; verificar con
      `npm run build` que el post sigue construyéndose sin errores de
      schema.

## 2. Página de demo y navegación mínima

- [x] 2.1 Crear `src/components/LabBackLink.astro` (props `href` y
      `label`); verificar en `npm run dev` que renderiza un único enlace
      de vuelta y ningún otro elemento de navegación.
- [x] 2.2 Crear `src/pages/lab/test-memoria.astro`: mover el
      marcado/CSS/JS de `public/gamification/test-memoria.html`,
      envolverlo con `Layout.astro` (sin `Header` ni `Footer`) y el
      `LabBackLink` apuntando a `/blog/perdidos-en-el-medio`; verificar
      en `npm run dev` que `/lab/test-memoria` reproduce el mismo
      comportamiento interactivo que la demo original (recuerdo de las
      15 palabras, resultado final).

## 3. Migración de la URL legacy

- [x] 3.1 Añadir el redirect declarativo
      `'/gamification/test-memoria.html': '/lab/test-memoria'` en
      `astro.config.mjs`; verificar con `npm run build` + inspección de
      `dist/` que la URL antigua sirve la página de redirección
      (meta-refresh + `canonical` a `/lab/test-memoria` + `noindex` —
      este hosting estático no puede emitir un HTTP 301 real, ver
      design.md, Decisión 4).
- [x] 3.2 Eliminar `public/gamification/test-memoria.html` una vez
      confirmada la migración; verificar que `npm run build` no genera
      ya esa ruta en `dist/`. Rollback: si algo falla tras el despliegue,
      `git revert` del commit que elimina el archivo restaura la demo
      original en `public/` sin afectar al resto del cambio.

## 4. Verificación integral

- [x] 4.1 Ejecutar `npm run build` e inspeccionar el HTML generado para
      `/lab/test-memoria`, confirmando: no incluye el `Header`/`Footer`
      del sitio, sí incluye el enlace de vuelta de `LabBackLink`, y no
      duplica un bloque de tokens de color propio (usa los de
      `global.css` vía `Layout.astro`).
- [x] 4.2 Verificar sobre el build (`npm run preview` o inspección de
      `dist/`) que el post `perdidos-en-el-medio` enlaza correctamente a
      `/lab/test-memoria` y que `/gamification/test-memoria.html` sirve
      la página de redirección hacia esa misma URL.
- [x] 4.3 Ejecutar `openspec validate add-lab-interactive-demos --strict`
      y verificar que no reporta errores.
