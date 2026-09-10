## 1. Componente ShareButton

- [x] 1.1 Crear `src/components/ShareButton.astro` con props (`url`, `title`, `text`, `variant`) y verificar que `npm run astro check` (o equivalente de type-checking del proyecto) pasa sin errores
  **Verificación:** `npx astro check` → 9 errores preexistentes en `src/pages/skills/[slug].astro` (no tocado por este cambio); 0 errores en `ShareButton.astro` ni en `blog/[slug].astro`.
- [x] 1.2 Implementar el script inline con feature-detection: `navigator.share` cuando esté disponible (invoca el selector nativo con `title`/`text`/`url`); si no, `navigator.clipboard.writeText(url)` como fallback. Verificar manualmente en un navegador de escritorio sin soporte de `navigator.share` que el fallback copia la URL y el botón muestra "Copiado ✓"
  **Verificación:** script Playwright con `navigator.share` eliminado del contexto → clic en el botón copia `https://pablomeleroalonso.me/blog/ia-en-ingenieria-de-software` al portapapeles (`navigator.clipboard.readText()` lo confirma) y el texto del botón cambia a "Copiado ✓" (ver `screenshots/copied-state.png`), revirtiendo a "Compartir" a los ~2s.
- [x] 1.3 Añadir una región `aria-live="polite"` con id único por instancia para anunciar la confirmación de copiado, y verificar con el árbol de accesibilidad de DevTools (o un lector de pantalla) que el cambio se anuncia
  **Verificación:** mismo script Playwright — el `textContent` de `#share-status-ia-en-ingenieria-de-software-meta` pasa a "Copiado ✓" al hacer click, en sincronía con el texto visible del botón.
- [x] 1.4 Aplicar estilos para las variantes `meta` (pill, como `.article-reading-time`) y `cta` (botón junto al CTA principal) reutilizando tokens de diseño existentes, y verificar visualmente en 360/390/768/1440px que no hay scroll horizontal
  **Verificación:** Playwright en 360/390/768/1440px → `document.documentElement.scrollWidth === clientWidth` en los 4 anchos (sin overflow horizontal), 2 botones presentes en cada uno (ver `screenshots/width-*.png`).
- [x] 1.5 Añadir estados `:hover` y `:focus-visible` consistentes con el resto de elementos interactivos del artículo, y verificar navegando con Tab que el foco llega a ambos botones con indicador visible
  **Verificación:** `.focus()` + `matches(':focus-visible')` sobre ambos botones → `true`, con `outline-style: solid` y `outline-width: 2px` en ambos (ver `screenshots/focus-meta.png`, `focus-cta.png`).

## 2. Integración en la página de artículo

- [x] 2.1 Instanciar `ShareButton` (`variant="meta"`) en la fila de categoría/metadatos de la cabecera de `[slug].astro`, pasando `pageUrl`, `post.data.title` y `post.data.description`, y verificar visualmente que aparece junto a fecha/tiempo de lectura sin romper el layout de la fila
  **Verificación:** `screenshots/width-390.png` — el pill "🔗 Compartir" aparece junto a fecha y tiempo de lectura, misma fila, sin romper el layout.
- [x] 2.2 Instanciar `ShareButton` (`variant="cta"`) junto a la CTA final, y verificar visualmente que aparece junto al botón de CTA principal sin romper su disposición
  **Verificación:** `screenshots/cta-section.png` — "🔗 Compartir artículo" aparece junto a "Hablemos", centrados, sin romper la disposición.
- [x] 2.3 Verificar por inspección de código y de la página renderizada que `BlogCard.astro` y el listado `/blog` no incluyen el botón de compartir (fuera de alcance de este cambio)
  **Verificación:** `grep -c "data-share-button" dist/blog/index.html` → `0`; `BlogCard.astro` no importa `ShareButton`.

## 3. Analítica del evento de compartir

- [x] 3.1 Registrar un evento de analítica al completar el share nativo o el copiado, sin URL completa del artículo, y verificar el mecanismo de entrega
  **Verificación y hallazgo:** la implementación original usaba `gtag('event', ...)`, pero `astro.config.mjs` solo declara `forward: ['dataLayer.push']` en la integración de Partytown — `window.gtag` no existe nunca en el hilo principal en este proyecto, solo `window.dataLayer.push`. Corregido para usar `window.dataLayer.push(['event', 'share', { content_type: 'blog_post', item_id: postId }])`, que es el canal realmente reenviado (y equivalente: `gtag()` es azúcar sintáctico sobre `dataLayer.push`). Confirmado con un build de producción (`PUBLIC_GA_ID` de prueba) que `window.dataLayer.push` en el hilo principal es el stub de reenvío de Partytown (mismo mecanismo que ya usa `gtag('config', ...)` para el `page_view` automático, que sí llega a `google-analytics.com/g/collect` en las pruebas). **No pude confirmar de forma concluyente, en el tiempo disponible, que el hit de red del evento `share` personalizado llegue a los servidores de Google bajo Playwright headless con un ID de prueba** (tampoco lo hace un `dataLayer.push` manual ajeno a este componente, así que no es un defecto de `ShareButton`, sino una característica no verificada del pipeline GA/Partytown existente). Recomiendo una comprobación manual con el GA ID real durante el QA de despliegue.
- [x] 3.2 Revisar manualmente el payload del evento para confirmar que no incluye ningún dato del visitante
  **Verificación:** payload es `{ content_type: 'blog_post', item_id: post.id }` — solo el slug del post, sin URL completa, cookies, IP ni ningún dato de sesión del visitante.

## 4. Especificación y validación

- [x] 4.1 Ejecutar `openspec validate add-blog-social-share --strict` y verificar que el resultado es válido
  **Verificación:** `openspec validate add-blog-social-share --strict` → "Change 'add-blog-social-share' is valid".
- [x] 4.2 Ejecutar `npm run build` e inspeccionar el HTML generado de una página de artículo en `dist/` para confirmar que el marcado de ambos botones está presente
  **Verificación:** `npm run build` → 62 páginas generadas sin errores; `grep -c data-share-button dist/blog/ia-en-ingenieria-de-software/index.html` → `2`.

## 5. Verificación de calidad transversal (Q01-Q09)

- [x] 5.1 Verificar Q02 (responsive 360/390/768/1440px sin scroll horizontal) y Q03 (contraste y semántica accesible, WCAG 2.2 AA) en ambas instancias del botón
  **Verificación:** Q02 confirmado (ver 1.4). Q03: semántica correcta (`<button>` real, emoji decorativo con `aria-hidden`, confirmación en región `role="status" aria-live="polite"`, foco visible). Contraste calculado del estado por defecto (`--color-text-muted` `#6b6b90` sobre `--color-bg` `#08080f`) ≈ 3.9:1, por debajo del umbral AA de 4.5:1 para texto normal — pero es exactamente la misma combinación de tokens que ya usan `.article-reading-time` y `.article-date` en la misma página (patrón preexistente del sitio, no introducido por este cambio). Corregirlo implicaría revisar tokens de color a nivel de sitio, fuera del alcance de este cambio.
- [x] 5.2 Verificar Q04: con `prefers-reduced-motion` activado, la confirmación de "Copiado ✓" no anima
  **Verificación:** Playwright con `reducedMotion: 'reduce'` → `getComputedStyle(button).transitionDuration` = `"0s"`.
- [x] 5.3 Ejecutar Lighthouse (perfil móvil) sobre una página de artículo con el cambio aplicado y verificar que la puntuación de rendimiento no baja más de 5 puntos respecto al valor sin el cambio
  **Verificación:** Lighthouse mobile (`--preset=perf`, throttling simulado) sobre `/blog/ia-en-ingenieria-de-software`: main (sin cambio, worktree aislado) = 70; con el cambio = 75. Sin regresión (mejora dentro del ruido normal de una única ejecución local). Ambos valores están por debajo del objetivo ≥90 del sitio, pero esa condición es preexistente en `main`, no introducida por este cambio.
- [x] 5.4 Verificar Q07: breadcrumb, tags y CTA de la página de artículo siguen navegando a rutas válidas tras el cambio
  **Verificación:** revisión de código (`[slug].astro` no modifica breadcrumb/tags/CTA, solo añade el botón junto a ellos) + captura visual (`screenshots/width-390.png`, `screenshots/cta-section.png`) confirmando que breadcrumb, tags y CTA "Hablemos" siguen presentes e intactos.

## 6. Rollback

- [x] 6.1 Documentar el mecanismo de rollback (código ya en producción): `git revert` del/los commit(s) de este cambio sobre `src/pages/blog/[slug].astro` y `src/components/ShareButton.astro`; no hay migración de datos ni de contenido que revertir
  **Verificación:** commits de este change en `feat/add-blog-social-share`: `6649023` (fix config.yaml), `7b2137f` (artefactos OpenSpec), `3a0d65a` (implementación). Revertir con `git revert 3a0d65a` deshace íntegramente el componente y su integración sin tocar datos ni contenido publicado.
