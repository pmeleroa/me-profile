## Why

El footer afirma "Contenido creado con IA, revisado y validado por mí.", pero no explica qué significa eso en la práctica. El change `update-footer-ai-disclosure` dejó la frase sin enlace y registró como trabajo futuro explicar cómo se genera el contenido. Un visitante que lea el footer no tiene hoy forma de saber que el contenido nace de un debate entre la IA y el autor dentro del flujo OpenSpec, y que nada se publica sin su consentimiento explícito. El repositorio es público, así que la explicación puede apoyarse en pruebas que cualquiera puede comprobar.

## What Changes

- Nueva página estática en `/como-se-hace`, titulada "Cómo se hace este sitio". Explica cómo se genera el contenido de este sitio con IA y siempre consensuado con el autor.
- El eje de la página es el flujo OpenSpec en cuatro fases (debate, acuerdo, construcción y publicación). Cada fase indica qué hace la IA y qué decide el autor.
- La página enlaza a unos pocos ejemplos reales del repositorio público `pmeleroa/me-profile`, fijados a un commit concreto para que no se rompan si el repositorio se reorganiza.
- Incluye un bloque breve y secundario con las herramientas del sitio: Astro, GitHub Pages, OpenSpec, Claude Code y Codex. Nombra herramientas, no modelos.
- En el footer, la frase "revisado y validado por mí" pasa a enlazar a `/como-se-hace`. El resto del texto del footer no cambia.
- La página no aparece en la navegación de la cabecera. Solo se llega a ella desde el footer.
- Al archivar, se elimina de `openspec/config.yaml` (`rules.design`) la entrada de trabajo futuro que originó este change.

Fuera de alcance:

- Describir cómo trabaja el autor fuera de este sitio, por ejemplo en su empleo, o lo que recomienda en general. La página se limita a cómo se produce este sitio.
- Generar contenido de la página a partir del repositorio en tiempo de build.
- Publicar esta explicación como post del blog. La página no es un post, no tiene fecha y no forma parte de la colección `blog`.

## Capabilities

### New Capabilities
- `how-site-is-made`: la página `/como-se-hace`. Cubre su ruta, su contenido esencial (las fases del flujo con el reparto entre IA y autor, las herramientas usadas y los ejemplos enlazados) y los límites de lo que puede afirmar.

### Modified Capabilities
- `site-footer`: la frase "revisado y validado por mí" pasa a ser un enlace a `/como-se-hace`. El texto visible del footer no cambia.

## Impact

- Código: una página nueva en `src/pages/como-se-hace.astro` y un cambio en el párrafo `.footer-copy` de `src/components/Footer.astro`. La página no se registra en `src/data/pageSections.ts`, así que la cabecera y los enlaces de sección del footer no cambian.
- Sin dependencias nuevas y sin JavaScript en la página.
- Contenido público: la página afirma que el contenido se genera con IA y se consensúa con el autor. Toda afirmación debe estar respaldada por el flujo real y por los ejemplos enlazados. No se inventan métricas ni garantías, y no se usan "certificado" ni "garantizado".
- No toca ninguna colección de contenido ni el contrato de publicación del blog (`draft`; no existen `status`, `approvedBy` ni `approvedAt`).
- Proceso: `openspec/config.yaml` pierde la entrada de trabajo futuro que queda resuelta.
- Reversión: `git revert` de los commits del change, sin migraciones.
