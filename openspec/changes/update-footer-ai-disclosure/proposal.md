## Why

El footer dice hoy "Construido con Astro e impulsado con IA 🤖". Mezcla en una sola frase cómo está hecho el sitio y cómo está hecho el contenido, y no dice lo que el autor quiere transmitir: el contenido se crea con IA, pero el autor lo revisa y lo valida antes de publicarlo. Con un posicionamiento en "IA aplicada al desarrollo de software", esa transparencia forma parte del mensaje, y el flujo de trabajo actual la respalda: el consentimiento explícito del owner para publicar queda registrado en `tasks.md` (Q09).

## What Changes

- El texto del footer pasa a: `© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`
- Se separan dos afirmaciones: la del sitio ("Construido con Astro", con su enlace actual) y la del contenido ("Contenido creado con IA, revisado y validado por mí").
- Se mantiene el resalte visual de "IA" con el color de acento. Se elimina el emoji 🤖, que acompañaba al "impulsado" que desaparece.
- El texto no usa "certificado" ni ninguna palabra que sugiera un proceso formal o un tercero que dé fe, porque el flujo no lo demuestra.
- El footer es un componente compartido (`src/components/Footer.astro`), así que el cambio afecta a todas las páginas que lo incluyen.

Fuera de alcance: explicar cómo trabaja el autor con la IA dentro del flujo SDD, ya sea como post o como página propia, y enlazar esa explicación desde el footer. En la misma rama se registra como trabajo futuro en `openspec/config.yaml` (`rules.design`), en un commit `chore(openspec)` aparte, fuera de las tareas de este change.

## Capabilities

### New Capabilities
- `site-footer`: el contenido textual del footer global del sitio, incluida la declaración sobre el uso de IA en el contenido y la validación del autor.

### Modified Capabilities
(ninguna)

## Impact

- Código: `src/components/Footer.astro`, solo el párrafo `.footer-copy`. Lo usan `src/pages/index.astro`, `404.astro`, `contacto.astro`, `[section].astro`, `blog/index.astro`, `blog/[slug].astro` y `skills/[slug].astro`, sin que haya que tocarlos.
- Sin dependencias nuevas, sin JavaScript y sin cambios de estilos más allá de mantener el resalte existente.
- No toca ninguna colección de contenido ni el contrato de publicación (`draft`) del blog.
- Reversión: `git revert` del commit, sin migraciones.
