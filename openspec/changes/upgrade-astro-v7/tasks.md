## 1. Dependencias

- [x] 1.1 Actualizar `astro` a `7.3.1` en `package.json` y verificar con `npm install` que se resuelve sin conflictos de peer dependencies.
- [x] 1.2 Actualizar `@astrojs/mdx` a la versión compatible (peer `astro ^7.2.6`) y `@astrojs/partytown` a `2.1.7`; verificar con `npm ls astro @astrojs/mdx @astrojs/partytown` que las versiones instaladas son las esperadas y no hay warnings de peer dependency.

## 2. Migración de colecciones de contenido

- [x] 2.1 Crear `src/content.config.ts` con la colección `blog` usando `loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' })` y el mismo schema Zod (`title`, `description`, `publishDate`, `updatedDate`, `category`, `tags`, `image`, `draft`); eliminar `src/content/config.ts`. Verificar con `npx astro sync` que no reporta errores de tipos generados.
- [x] 2.2 Sustituir `entry.slug` por `entry.id` en [src/pages/index.astro](../../../src/pages/index.astro), [src/pages/blog/index.astro](../../../src/pages/blog/index.astro), [src/pages/blog/[slug].astro](../../../src/pages/blog/[slug].astro) y [src/components/BlogPreview.astro](../../../src/components/BlogPreview.astro); verificar con `npm run build` que no quedan referencias a `.slug` sobre entradas de la colección (`grep -rn "\.slug" src/pages/blog src/components/BlogPreview.astro src/pages/index.astro` debe devolver solo el nombre del parámetro de ruta, no accesos a datos).
- [x] 2.3 Sustituir `const { Content } = await post.render()` por `const { Content } = await render(post)` (importando `render` desde `astro:content`) en [src/pages/blog/[slug].astro](../../../src/pages/blog/[slug].astro); verificar visitando `/blog/<slug-de-un-post>` en `npm run dev` y comprobando que el contenido del artículo se renderiza igual que antes.
- [x] 2.4 Confirmar que `src/components/Footer.astro` y `src/components/Header.astro` (que usan `.slug` sobre `sections`/navegación, no sobre la colección `blog`) no requieren cambios; verificar leyendo `src/data/sections` y comprobando que ese `.slug` no proviene de `astro:content`.

## 3. Node y CI

- [x] 3.1 Añadir `"engines": { "node": ">=22.12.0" }` a `package.json`; verificar con `node -v` en el entorno local (`v22.23.2`) que cumple el rango.
- [x] 3.2 Cambiar `node-version: 20` a `node-version: 24` en [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml); verificar leyendo el diff del workflow y confirmando que es el único `node-version` del archivo.

## 4. Verificación de build y contenido

- [x] 4.1 Ejecutar `npm run build` completo y registrar el resultado (éxito/fallo y cualquier error del compilador Rust por HTML mal formado); corregir cualquier etiqueta sin cerrar que aparezca como error de compilación.
- [x] 4.2 Inspeccionar `dist/` generado: comparar el HTML de `dist/blog/ia-en-ingenieria-de-software/index.html` y `dist/blog/perdidos-en-el-medio/index.html` contra el comportamiento actual en producción (estructura de encabezados, listas, bloques de código), para detectar diferencias introducidas por el cambio de procesador Markdown por defecto (Sateri); registrar el resultado observado.
- [x] 4.3 Verificar manualmente en `npm run dev` las rutas `/`, `/blog`, `/blog/<slug>` (los dos posts existentes) y la sección "Artículos relacionados", confirmando que no hay regresiones visuales ni de navegación.

## 5. Validación de pipeline y entrega

- [x] 5.1 Confirmar que todo el trabajo se realiza sobre la rama `chore/upgrade-astro-v7` (no sobre `main`); verificar con `git branch --show-current`.
- [x] 5.2 Disparar manualmente el workflow de deploy sobre la rama con `gh workflow run deploy.yml --ref chore/upgrade-astro-v7`. **Hallazgo**: el job `check-commit` del workflow salta `build`/`release`/`deploy` cuando el último commit empieza por `chore`/`docs` (ver [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml)); el HEAD de la rama (`docs: add CLAUDE.md...`) activó ese gate, por lo que `npm ci`/`npm run build` no se ejecutaron en este run (`gh run view 34155793262`, job `build` = skipped). Se acepta como evidencia de 5.2 la verificación local ya registrada en 4.1 (`npm run build` en Node 22.23.2 local); queda pendiente como riesgo no cubierto: el mismo gate podría saltar el deploy real tras el squash merge a `main` si el mensaje de squash empieza por `chore`/`docs`, sin haberse validado `npm ci`/`npm run build` bajo Node 24 en el runner de CI.
- [ ] 5.3 Abrir el PR contra `main` con el resumen del upgrade; verificar que la descripción enlaza a este change de OpenSpec (`openspec/changes/upgrade-astro-v7/`).

**Rollback**: si tras fusionar a `main` aparece una regresión, revertir el commit de merge con `git revert -m 1 <hash-del-merge>` (o `git revert` del commit único si no se usó merge commit). No hay migración de datos ni de backend, por lo que restaura íntegramente el estado anterior (`astro@5.18.0`, colecciones legacy, Node 20 en CI).
