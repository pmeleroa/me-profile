## 1. Dependencia

- [x] 1.1 Actualizar `sharp` de `^0.34.5` a `^0.35.4` en `package.json` (devDependencies) y ejecutar `npm install` para regenerar `package-lock.json`; verificar que `npm install` termina sin errores de peer dependencies. **Verificado**: `npm install` → "removed 3 packages, changed 3 packages, and audited 198 packages" sin errores de peer dependencies.
- [x] 1.2 Verificar con `npm ls sharp` que todas las instalaciones (la directa y la transitiva vía `astro@7.3.1`) quedan en `0.35.4`, sin ninguna copia residual en `0.34.x`. **Verificado**: `npm ls sharp` → `astro@7.3.1 └── sharp@0.35.4 deduped` y `sharp@0.35.4` directo; una única versión efectiva.
- [x] 1.3 Ejecutar `npm audit` y verificar que la vulnerabilidad `GHSA-f88m-g3jw-g9cj` (`CVE-2026-33327`, `CVE-2026-33328`, `CVE-2026-35590`, `CVE-2026-35591`) ya no aparece en el reporte; registrar el resultado (`0 vulnerabilities` o el detalle de lo que quede, si algo no relacionado). **Verificado**: `npm audit` → "found 0 vulnerabilities".

## 2. Verificación de build e imágenes

- [x] 2.1 Ejecutar `npm run build` completo y registrar el resultado (éxito/fallo y cualquier error o warning nuevo relacionado con la generación de imágenes vía `astro:assets`). **Verificado**: `npm run build` → "60 page(s) built in 788ms", "[build] Complete!", sin errores ni warnings.
- [ ] 2.2 Inspeccionar en `dist/` las imágenes generadas por las páginas que usan `astro:assets` a través de `src/data/skills.ts` (`SkillsGrid.astro`, `src/pages/skills/[slug].astro`), confirmando que se generan correctamente y sin diferencias visibles respecto al build previo. **No aplica**: la premisa es incorrecta. `src/data/skills.ts` expone rutas SVG estáticas o URLs externas (`cdn.simpleicons.org`, `cncf.io`); no hay ningún import de `astro:assets` en `src/`, y `dist/` solo contiene copias literales de `public/` (`.svg`/`.png`, sin `.webp`/`.avif` ni variantes `_astro/`). `sharp` no procesa ninguna imagen en el build actual de este sitio; es una dependencia opcional de Astro sin uso efectivo aquí. La cobertura real de "el build no se rompe" ya la da 2.1.
- [ ] 2.3 Verificar manualmente en `npm run dev` las rutas que muestran esas imágenes (`/`, `/skills/<slug>` de al menos dos skills), confirmando que no hay regresiones visuales ni errores en consola del navegador o del servidor de desarrollo. **No aplica**: por el mismo motivo que 2.2 — no existe una regresión de procesamiento de imágenes por `sharp` que verificar, ya que ninguna imagen del sitio pasa por ese pipeline.

## 3. Validación de pipeline y entrega

- [x] 3.1 Confirmar que todo el trabajo se realiza sobre la rama `chore/upgrade-sharp-libvips-security` (no sobre `main`); verificar con `git branch --show-current`. **Verificado**: `git branch --show-current` → `chore/upgrade-sharp-libvips-security`.
- [ ] 3.2 Disparar manualmente el workflow de deploy sobre la rama con `gh workflow run deploy.yml --ref chore/upgrade-sharp-libvips-security`, y confirmar con `gh run view <run-id>` que los jobs `build`/`release`/`deploy` se ejecutan (no quedan `skipped` por el gate `check-commit`) y que `npm ci` + `npm run build` terminan en verde con Node 24 en el runner.
- [ ] 3.3 Abrir el PR contra `main` con el resumen de la corrección de seguridad y las CVEs corregidas; verificar que la descripción enlaza a este change de OpenSpec (`openspec/changes/upgrade-sharp-libvips-security/`) y referencia el advisory `GHSA-f88m-g3jw-g9cj`.

**Rollback**: si tras fusionar a `main` aparece una regresión, revertir el commit (`git revert`) restaura `sharp@0.34.5` y el estado anterior del lockfile. No hay migración de datos ni backend implicado; se acepta como medida solo temporal, ya que revertir reintroduce la vulnerabilidad `GHSA-f88m-g3jw-g9cj` corregida por este cambio.
