## Why

Falta en el blog un artículo que aborde la disyuntiva SDD vs vibe coding con criterio propio en vez de la dicotomía habitual ("proceso formal" contra "improvisar con IA"). Este propio repositorio ya es evidencia real de que la decisión no es binaria: los 4 changes archivados hasta ahora aplican trazabilidad de proceso (proposal/design/tasks) de forma uniforme, pero solo uno de ellos (`add-lab-interactive-demos`) generó un delta de spec, porque solo ese cambiaba un contrato de producto observable. Ese matiz —trazabilidad de proceso y trazabilidad de requisito son decisiones independientes— es la tesis del artículo, y conviene publicarlo ahora porque nace de un caso de uso real y reciente del propio sitio, no de una reflexión abstracta.

## What Changes

- Nuevo post en la colección `blog`: comparación SDD vs vibe coding centrada en dos variables (necesidad de trazabilidad de proceso, coste de estar mal / necesidad de contrato de requisito), con evidencia extraída de los `proposal.md` de los changes archivados de este repositorio (`upgrade-astro-v7`, `upgrade-github-actions`, `upgrade-sharp-libvips-security`, `add-lab-interactive-demos`) como casos reales. Sin cifras, logros ni testimonios inventados.
- Nueva demo interactiva en `/lab/telefono-roto`: dos ramas paralelas sobre la misma secuencia de 4 decisiones de producto sobre un requisito ficticio de ejemplo (export de datos en CSV y JSON) — una rama sin el requisito original visible en ninguna ronda, otra con un contrato de una línea fijo y visible en todo momento. Al final de cada rama, el lector compara el resultado con el requisito original y ve si hubo deriva. La demo reutiliza el contrato ya definido en `specs/lab/spec.md` (ruta `/lab/<slug>`, enlace único de vuelta al post, sin navegación principal) sin extenderlo.
- El nuevo post declara el campo `demo: { slug: "telefono-roto" }` en su frontmatter, siguiendo el patrón ya usado por `perdidos-en-el-medio.mdx` / `test-memoria`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna)

Este change fija `skip_specs: true` en `.openspec.yaml`: la demo nueva es una instancia del contrato ya vigente de `/lab/` (no añade ni cambia ningún requisito de `specs/lab/spec.md`), y la colección `blog` no tiene spec propia en este repositorio — es contenido, no una capability con contrato de comportamiento.

## Impact

- **Contenido**: nuevo archivo `.mdx` en `src/content/blog/` (p. ej. `sdd-vs-vibe-coding.mdx`).
- **Código**: nueva página Astro en `src/pages/lab/telefono-roto.astro`, siguiendo el patrón de `src/pages/lab/test-memoria.astro` (página autocontenida, sin backend, reutiliza tokens de `global.css`).
- **Schema**: sin cambios en `src/content.config.ts` ni en el schema de la colección `blog`; se usa el campo `demo` ya existente, no se añade ninguno nuevo.
- **Contrato de publicación** (`status`/`approvedBy`/`approvedAt`): no aplica. Esos campos no existen en el schema actual de la colección `blog` y esta propuesta no los introduce.
