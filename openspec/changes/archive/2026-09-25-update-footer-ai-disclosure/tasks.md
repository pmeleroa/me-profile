## 1. Texto del footer

- [x] 1.1 Sustituir en `src/components/Footer.astro` el párrafo `.footer-copy` por `© {year} Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`, conservando el enlace del nombre a la portada, el enlace a `https://astro.build` (`target="_blank"`, `rel="noopener"`) y el resalte de "IA" con `--color-accent-light`, y eliminando "impulsado con" y el emoji 🤖. Verificar con `git diff src/components/Footer.astro` que solo cambia ese párrafo. Rollback: `git checkout -- src/components/Footer.astro` antes del commit o `git revert <sha>` después
  **Verificación:** `git diff src/components/Footer.astro` → 1 archivo, +2/−1, solo dentro de `.footer-copy`: se sustituye `e impulsado con <strong …>IA</strong> 🤖.` por `. Contenido creado con <strong …>IA</strong>, revisado y validado por mí.`. Se conservan el enlace del nombre, el de Astro y el `style` del resalte.

## 2. Verificación del HTML generado

- [x] 2.1 Ejecutar `npm run build` y confirmar que termina sin errores
  **Verificación:** `npm run build` → `64 page(s) built`, `Complete!`, sin errores.
- [x] 2.2 Comprobar en `dist/` que el texto completo del footer está en el HTML servido (Q01) en al menos `index.html`, `404.html`, `contacto/index.html`, `blog/index.html` y un artículo de `blog/<slug>/index.html`: el texto visible normalizado de `.footer-copy` coincide con `© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`
  **Verificación:** script Node (scratchpad) que extrae `.footer-copy` de `dist/`, quita etiquetas y normaliza espacios → `OK` en `index.html`, `404.html`, `contacto/index.html`, `blog/index.html` y `blog/ai-routing-y-soberania-tecnologica/index.html`. Ampliado a las 62 páginas con footer: 62 OK, 0 FAIL. Las 4 páginas de `dist/` sin footer (`lab/telefono-roto`, `lab/test-memoria`, `gamification/test-memoria.html` y su `index.html`) no incluyen `Footer.astro` tampoco en `origin/main`: es preexistente y queda fuera de alcance.
- [x] 2.3 Comprobar en `dist/` que ninguna página contiene en el footer "certificado", "certificación", "garantizado", "impulsado con" ni 🤖 (p. ej. `grep -rl "impulsado con" dist/` → sin resultados)
  **Verificación:** la comprobación de texto exacto de 2.2 en las 62 páginas descarta "certificado", "certificación", "garantizado", "impulsado con" y 🤖 dentro del footer. `grep -rlE 'impulsado con|certificad|certificaci|garantizad|🤖' dist --include='*.html'` → 1 archivo, `contacto/index.html`, por un 🤖 en `<span class="topic-icon">` del cuerpo de la página, no del footer.
- [x] 2.4 Comprobar Q07: el enlace del nombre apunta a la portada (`import.meta.env.BASE_URL`) y el de Astro a `https://astro.build` con `target="_blank"` y `rel="noopener"`
  **Verificación:** el mismo script lista los enlaces de `.footer-copy` en las 5 páginas: `href="/"` y `href="https://astro.build" target="_blank" rel="noopener"`.

## 3. Calidad transversal

- [x] 3.1 Verificar Q02: en 360/390/768/1440px el footer no provoca scroll horizontal (`document.documentElement.scrollWidth === clientWidth`) y el texto se lee sin cortes, con captura en 360px
  **Verificación:** Playwright 1.63 (instalado en el scratchpad, no en el proyecto) contra `astro preview`, en `/` y `/blog/` → `scrollWidth === clientWidth` en 360/390/768/1440px y `.footer-copy` sin desbordamiento. Captura a 360px: el texto ocupa 3 líneas, sin cortes.
- [x] 3.2 Verificar Q03: el contraste de "IA" (`--color-accent-light`) y del resto del texto del footer sobre su fondo alcanza 4.5:1 (WCAG 2.2 AA). Si "IA" o el texto base no lo alcanzan con tokens que este cambio no modifica, registrarlo como patrón preexistente, no introducido por este cambio, y anotarlo como trabajo futuro
  **Verificación:** medido con Playwright sobre el fondo `rgb(8, 8, 15)` (`--color-bg`), a 14px: "IA" (`--color-accent-light`) 10.43:1 ✓; enlaces 8.77:1 ✓; texto base (`--color-text-muted` `#6b6b90`) **3.93:1 ✗**, por debajo de 4.5:1. El cambio no toca colores (el diff solo cambia el texto) y en `origin/main` el footer usa el mismo token, así que el fallo es preexistente. El owner decidió registrarlo como preexistente (opción 1) y no corregirlo en este change: el token se usa en 16 reglas de `src/styles/global.css`. Queda anotado como trabajo futuro del sitio en `openspec/config.yaml` (`rules.design`).

## 4. Validación OpenSpec

- [x] 4.1 Ejecutar `openspec validate update-footer-ai-disclosure --strict` y confirmar que el change es válido
  **Verificación:** `openspec validate update-footer-ai-disclosure --strict` → `Change 'update-footer-ai-disclosure' is valid`.
