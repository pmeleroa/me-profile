## 1. Evidencia del repositorio

- [ ] 1.1 Elegir el SHA completo (40 caracteres) de un commit de `origin/main` en el que existan las tres rutas de ejemplo de design.md (D4) y comprobarlo con `git cat-file -e <sha>:<ruta>` para cada una. Abrir `tasks.md#L130` del change `add-ollama-local-guide-post` en ese SHA y confirmar que la línea 130 contiene la pregunta literal de consentimiento y la 131 la respuesta. Si algún ejemplo ya no sirve, sustituirlo y registrar el motivo aquí

## 2. Página `/como-se-hace`

- [ ] 2.1 Crear `src/pages/como-se-hace.astro` siguiendo el patrón de `contacto.astro` (`Layout` con `title` "Cómo se hace este sitio" y `description` propia, `Header` y `Footer`), sin registrarla en `src/data/pageSections.ts`, con la estructura de design.md (D3): introducción, cuatro fases con el reparto entre IA y autor, ejemplos enlazados con el SHA de 1.1 como constante, bloque de herramientas y cierre con enlace a `/contacto`. Sin `<script>` en la página. Verificar con `git diff --stat` que solo se añade ese archivo. Rollback: `git clean -f src/pages/como-se-hace.astro` antes del commit o `git revert <sha>` después
- [ ] 2.2 Añadir, si hace falta, estilos para la página reutilizando los tokens de `src/styles/global.css`, sin colores nuevos. Verificar con `git diff` que no cambian tokens existentes

## 3. Enlace en el footer

- [ ] 3.1 En `src/components/Footer.astro`, envolver "revisado y validado por mí" en `<a href={`${import.meta.env.BASE_URL}como-se-hace`}>`, sin `target`, conservando el resto del texto y el resalte de "IA" (D5). Verificar con `git diff src/components/Footer.astro` que solo cambia `.footer-copy` y que el texto visible es idéntico. Rollback: `git checkout -- src/components/Footer.astro` antes del commit o `git revert <sha>` después

## 4. Verificación del HTML generado

- [ ] 4.1 Ejecutar `npm run build` y confirmar que termina sin errores y que genera `dist/como-se-hace/index.html`
- [ ] 4.2 Comprobar Q01 en `dist/como-se-hace/index.html`: aparecen las cuatro fases en orden (debate, acuerdo, construcción y publicación), el bloque de herramientas después del flujo con Astro, GitHub Pages, OpenSpec, Claude Code y Codex, y los enlaces de ejemplo, sin etiquetas `<script>` propias de la página
- [ ] 4.3 Comprobar en `dist/como-se-hace/index.html` que no aparecen "certificado", "certificación", "garantizado" ni nombres o versiones de modelos (`grep -iE 'certificad|certificaci|garantizad|opus|sonnet|haiku|gpt-'` → sin resultados)
- [ ] 4.4 Comprobar Q07: todos los enlaces a `github.com/pmeleroa/me-profile` de la página contienen `/blob/<sha>/` o `/tree/<sha>/` con un SHA de 40 caracteres y ninguno usa `main`. Abrir cada uno y confirmar que responde 200 y muestra el contenido descrito. El enlace a `/contacto` resuelve a una página existente en `dist/`
- [ ] 4.5 Comprobar en todas las páginas de `dist/` con footer que el texto visible normalizado de `.footer-copy` sigue siendo exactamente `© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.` y que "revisado y validado por mí" enlaza a `/como-se-hace` sin `target`
- [ ] 4.6 Comprobar que la navegación de la cabecera no contiene un enlace a `/como-se-hace` en ninguna página de `dist/`

## 5. Calidad transversal

- [ ] 5.1 Verificar Q02: en `/como-se-hace` y `/`, a 360/390/768/1440px, `document.documentElement.scrollWidth === clientWidth`, con captura a 360px de la página
- [ ] 5.2 Verificar Q03 en `/como-se-hace`: jerarquía de encabezados sin saltos, enlaces con texto descriptivo, y contraste del texto de la página de al menos 4.5:1. Medir el contraste entre `--color-accent` y `--color-text-muted` para el nuevo enlace del footer (WCAG 1.4.1, 3:1). Si algo falla por tokens que este change no modifica, registrarlo como preexistente según design.md (Risks)
- [ ] 5.3 Verificar Q04: la página no introduce animaciones nuevas, o las que hereda respetan `prefers-reduced-motion`
- [ ] 5.4 Verificar Q05: Lighthouse móvil de `/como-se-hace` con rendimiento de al menos 90

## 6. Aprobación y cierre

- [ ] 6.1 Pedir al owner la aprobación del texto final de `/como-se-hace` (D7) y registrar aquí la pregunta y la respuesta literales. Sin aprobación, el change no se archiva
- [ ] 6.2 Eliminar de `openspec/config.yaml` (`rules.design`) la entrada de trabajo futuro "explicar cómo trabaja el autor apoyándose en la IA dentro del flujo SDD con OpenSpec" (D8). Verificar con `git diff openspec/config.yaml` que solo se elimina esa entrada
- [ ] 6.3 Ejecutar `openspec validate add-how-this-site-is-made-page --strict` y confirmar que el change es válido
