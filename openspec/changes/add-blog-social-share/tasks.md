## 1. Componente ShareButton

- [ ] 1.1 Crear `src/components/ShareButton.astro` con props (`url`, `title`, `text`, `variant`) y verificar que `npm run astro check` (o equivalente de type-checking del proyecto) pasa sin errores
- [ ] 1.2 Implementar el script inline con feature-detection: `navigator.share` cuando esté disponible (invoca el selector nativo con `title`/`text`/`url`); si no, `navigator.clipboard.writeText(url)` como fallback. Verificar manualmente en un navegador de escritorio sin soporte de `navigator.share` que el fallback copia la URL y el botón muestra "Copiado ✓"
- [ ] 1.3 Añadir una región `aria-live="polite"` con id único por instancia para anunciar la confirmación de copiado, y verificar con el árbol de accesibilidad de DevTools (o un lector de pantalla) que el cambio se anuncia
- [ ] 1.4 Aplicar estilos para las variantes `meta` (pill, como `.article-reading-time`) y `cta` (botón junto al CTA principal) reutilizando tokens de diseño existentes, y verificar visualmente en 360/390/768/1440px que no hay scroll horizontal
- [ ] 1.5 Añadir estados `:hover` y `:focus-visible` consistentes con el resto de elementos interactivos del artículo, y verificar navegando con Tab que el foco llega a ambos botones con indicador visible

## 2. Integración en la página de artículo

- [ ] 2.1 Instanciar `ShareButton` (`variant="meta"`) en la fila de categoría/metadatos de la cabecera de `[slug].astro`, pasando `pageUrl`, `post.data.title` y `post.data.description`, y verificar visualmente que aparece junto a fecha/tiempo de lectura sin romper el layout de la fila
- [ ] 2.2 Instanciar `ShareButton` (`variant="cta"`) junto a la CTA final, y verificar visualmente que aparece junto al botón de CTA principal sin romper su disposición
- [ ] 2.3 Verificar por inspección de código y de la página renderizada que `BlogCard.astro` y el listado `/blog` no incluyen el botón de compartir (fuera de alcance de este cambio)

## 3. Analítica del evento de compartir

- [ ] 3.1 Disparar `gtag('event', 'share', { content_type: 'blog_post', item_id: post.id })` al completar el share nativo o el copiado, con guard si `window.gtag` no existe (entorno de desarrollo), y verificar en un build de producción local (con GA activo) que el evento se envía en la pestaña de red con esos parámetros y sin la URL completa del artículo
- [ ] 3.2 Revisar manualmente el payload del evento para confirmar que no incluye ningún dato del visitante

## 4. Especificación y validación

- [ ] 4.1 Ejecutar `openspec validate add-blog-social-share --strict` y verificar que el resultado es válido
- [ ] 4.2 Ejecutar `npm run build` e inspeccionar el HTML generado de una página de artículo en `dist/` para confirmar que el marcado de ambos botones está presente

## 5. Verificación de calidad transversal (Q01-Q09)

- [ ] 5.1 Verificar Q02 (responsive 360/390/768/1440px sin scroll horizontal) y Q03 (contraste y semántica accesible, WCAG 2.2 AA) en ambas instancias del botón
- [ ] 5.2 Verificar Q04: con `prefers-reduced-motion` activado, la confirmación de "Copiado ✓" no anima
- [ ] 5.3 Ejecutar Lighthouse (perfil móvil) sobre una página de artículo con el cambio aplicado y verificar que la puntuación de rendimiento no baja más de 5 puntos respecto al valor sin el cambio
- [ ] 5.4 Verificar Q07: breadcrumb, tags y CTA de la página de artículo siguen navegando a rutas válidas tras el cambio

## 6. Rollback

- [ ] 6.1 Documentar el mecanismo de rollback (código ya en producción): `git revert` del/los commit(s) de este cambio sobre `src/pages/blog/[slug].astro` y `src/components/ShareButton.astro`; no hay migración de datos ni de contenido que revertir
