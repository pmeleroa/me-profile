## Why

Los changes que añaden posts al blog (p. ej. `add-sdd-vs-vibe-coding-post`) ya siguen la práctica de crear el contenido con `draft: true` y dejar explícito en `tasks.md` que completar las tareas es implementación terminada, no contenido aprobado ni publicación realizada (ver `operations.apply.guidance` en `openspec/config.yaml`). Pero esa práctica es hoy una nota de alcance ad-hoc, redactada de nuevo en cada change, sin una tarea de checklist estándar que obligue a pedir y registrar la confirmación explícita del owner antes de pasar `draft: false`. Falta formalizar ese paso como una tarea reutilizable, para que ningún post pueda quedar publicado por completar el resto de tareas sin que el owner haya confirmado explícitamente que quiere publicarlo.

## What Changes

- Se añade una regla nueva en `rules.tasks` de `openspec/config.yaml`: todo change que incluya una tarea que fije `draft: false` en un post de `src/content/blog/` debe incluir, como tarea de checklist propia (no como nota libre), una comprobación de confirmación explícita del owner para ese post concreto, con dos resultados posibles y excluyentes:
  - Confirmación obtenida en la conversación de apply → se registra en la verificación de la tarea (quién confirma, qué se confirma) y se fija `draft: false`.
  - Confirmación no obtenida (no se pidió, se aplazó o se denegó) → el post permanece o se fija en `draft: true`, y la tarea se marca como completada dejando constancia de que no hubo confirmación (no se marca `draft: false` "por defecto").
- Se añade una entrada correspondiente en `operations.apply.guidance` recordando que, durante `apply`, fijar `draft: false` sin esa tarea de confirmación explícita incumple el checklist de calidad de publicación (junto a Q01–Q08).
- No se modifica el schema de la colección `blog` (`src/content.config.ts`): se sigue usando el campo `draft` ya existente, sin añadir `status`, `approvedBy` ni `approvedAt`. La confirmación queda registrada como texto de verificación en `tasks.md` de cada change de contenido, no como dato estructurado en el frontmatter.
- No se automatiza la comprobación (no hay backend ni CI que valide la confirmación): es un check de proceso que el agente debe ejecutar y documentar durante `apply`, igual que ya ocurre con el resto de checks de `operations.apply.guidance`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna)

Este change fija `skip_specs: true` en `.openspec.yaml`. No introduce ni modifica ninguna capability de `openspec/specs/` (la única existente, `lab`, no se ve afectada) ni cambia el contrato de publicación (`draft`/`status`/`approvedBy`/`approvedAt`) de la colección `blog`, que sigue sin tener spec propia. El cambio es puramente de proceso: formaliza en `openspec/config.yaml` (contexto/reglas/guidance para el agente) un paso de checklist que ya se aplicaba de forma informal, sin alterar ningún comportamiento observable del sitio publicado.

## Impact

- **Proceso**: `openspec/config.yaml` — nueva regla en `rules.tasks` y nueva entrada en `operations.apply.guidance`. Aplica a todo change futuro que publique o republique contenido de `src/content/blog/`.
- **Código**: ninguno. No se toca `src/content.config.ts` ni ningún `.mdx` existente.
- **Changes en curso o archivados**: sin impacto retroactivo; la regla aplica a partir de este change para los `tasks.md` que se redacten en adelante.
