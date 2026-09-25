## 1. Texto del footer

- [ ] 1.1 Sustituir en `src/components/Footer.astro` el párrafo `.footer-copy` por `© {year} Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`, conservando el enlace del nombre a la portada, el enlace a `https://astro.build` (`target="_blank"`, `rel="noopener"`) y el resalte de "IA" con `--color-accent-light`, y eliminando "impulsado con" y el emoji 🤖. Verificar con `git diff src/components/Footer.astro` que solo cambia ese párrafo. Rollback: `git checkout -- src/components/Footer.astro` antes del commit o `git revert <sha>` después
  **Verificación:** _pendiente_

## 2. Verificación del HTML generado

- [ ] 2.1 Ejecutar `npm run build` y confirmar que termina sin errores
  **Verificación:** _pendiente_
- [ ] 2.2 Comprobar en `dist/` que el texto completo del footer está en el HTML servido (Q01) en al menos `index.html`, `404.html`, `contacto/index.html`, `blog/index.html` y un artículo de `blog/<slug>/index.html`: el texto visible normalizado de `.footer-copy` coincide con `© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`
  **Verificación:** _pendiente_
- [ ] 2.3 Comprobar en `dist/` que ninguna página contiene en el footer "certificado", "certificación", "garantizado", "impulsado con" ni 🤖 (p. ej. `grep -rl "impulsado con" dist/` → sin resultados)
  **Verificación:** _pendiente_
- [ ] 2.4 Comprobar Q07: el enlace del nombre apunta a la portada (`import.meta.env.BASE_URL`) y el de Astro a `https://astro.build` con `target="_blank"` y `rel="noopener"`
  **Verificación:** _pendiente_

## 3. Calidad transversal

- [ ] 3.1 Verificar Q02: en 360/390/768/1440px el footer no provoca scroll horizontal (`document.documentElement.scrollWidth === clientWidth`) y el texto se lee sin cortes, con captura en 360px
  **Verificación:** _pendiente_
- [ ] 3.2 Verificar Q03: el contraste de "IA" (`--color-accent-light`) y del resto del texto del footer sobre su fondo alcanza 4.5:1 (WCAG 2.2 AA). Si "IA" no lo alcanza, registrarlo como patrón preexistente, no introducido por este cambio
  **Verificación:** _pendiente_

## 4. Validación OpenSpec

- [ ] 4.1 Ejecutar `openspec validate update-footer-ai-disclosure --strict` y confirmar que el change es válido
  **Verificación:** _pendiente_
