## Context

Ver `proposal.md` - Why. Estado actual relevante para el "cómo":

- `openspec/config.yaml` ya tiene un `rules.tasks` con 2 reglas (verificación con comando+resultado, y registro de rollback) y un `operations.apply.guidance` con 8 checks de calidad transversal (Q01–Q08), entre ellos Q06 ("integridad de publicación: draft/review nunca en salida pública"). Ambos se cargan como contexto en cada `propose`/`apply` de este repositorio.
- El precedente real (`archive/2026-09-09-add-sdd-vs-vibe-coding-post/tasks.md`) resolvió esto de forma ad-hoc: una nota de alcance libre al final del fichero ("ninguna tarea marca `draft: false`...") en vez de una tarea de checklist con su propia verificación. No hay ninguna tarea anterior que registre haber preguntado y obtenido confirmación explícita del owner para publicar un post concreto.
- El repositorio no tiene backend, CMS ni CI que valide `draft`/publicación (`sin backend ni CMS remoto` en el contexto del proyecto); todo el control es hoy humano-en-el-bucle vía revisión de PR y de `tasks.md`.
- La colección `blog` no tiene spec propia (`openspec/specs/`); el único spec existente es `lab`, no afectado por este change.

## Goals / Non-Goals

**Goals:**
- Que ningún `tasks.md` futuro pueda fijar `draft: false` en un post sin una tarea de checklist explícita que documente si hubo o no confirmación del owner para publicar ese post concreto.
- Que el resultado por defecto ante ausencia de confirmación sea `draft: true` (fail-safe), nunca `draft: false` por omisión.
- Mantener el mecanismo dentro de `openspec/config.yaml`, sin tocar código ni el schema de `blog`.

**Non-Goals:**
- No se automatiza la verificación (no hay CI que compare frontmatter contra un registro de aprobación).
- No se añade un contrato estructurado de publicación (`status`/`approvedBy`/`approvedAt`) al frontmatter; queda descartado explícitamente por decisión del owner (ver proposal.md).
- No se aplica retroactivamente a `tasks.md` ya archivados.

## Decisions

**Añadir la regla como bullet nuevo en `rules.tasks`, no como sección nueva**
`rules.tasks` ya es el punto donde el schema `spec-driven` inyecta reglas obligatorias por tarea al redactar `tasks.md` (ver `openspec instructions tasks`); añadir un bullet ahí garantiza que cualquier agente que redacte tareas de publicación de contenido lo vea como regla, igual que las 2 reglas existentes. Alternativa descartada: crear una sección nueva tipo `rules.publishing` — el schema `spec-driven` no define esa clave y añadirla sin soporte del schema no se inyectaría en `openspec instructions`, quedando como texto muerto.

**Formular el check como resultado binario obligatorio (confirmado → `draft: false` documentado / no confirmado → `draft: true` documentado), no como bloqueo de la tarea hasta obtener confirmación**
Así lo pidió el owner explícitamente ("en caso de no tenerla, marca el post como draft"): la ausencia de confirmación no debe dejar la tarea, ni el change, bloqueados indefinidamente — simplemente el post no se publica en esta pasada y la tarea se completa dejando ese hecho registrado, para que sea visible en la review de PR. Alternativa descartada: exigir confirmación obligatoria para poder cerrar la tarea — introduciría un bloqueo artificial que el owner no pidió y complicaría changes donde publicar no es aún la intención (p. ej. escribir el post en un PR en borrador).

**Duplicar la señal en `operations.apply.guidance` (nuevo check Q09) además del bullet en `rules.tasks`**
`rules.tasks` guía cómo se *redacta* la tarea en `propose`; `operations.apply.guidance` guía cómo se *ejecuta y verifica* en `apply` (son dos momentos distintos del flujo, ver `openspec/config.yaml` actual con sus dos secciones separadas). Sin la entrada en `apply.guidance`, un change cuyo `tasks.md` ya existiera antes de este change (o redactado sin seguir la regla) podría ejecutar `apply` y fijar `draft: false` sin que nada lo frene durante esa fase. Alternativa descartada: solo el bullet en `rules.tasks` — cubre la redacción pero no añade ninguna señal en el momento de ejecutar, que es cuando realmente se escribe `draft: false` en el fichero.

**La pregunta de confirmación debe ser específica del post (título/slug), no genérica**
Una confirmación genérica tipo "¿publicamos ya?" en medio de una conversación larga es ambigua y no es rastreable. La tarea de checklist debe registrar la pregunta concreta hecha y la respuesta obtenida (p. ej. "¿Confirmas publicar 'sdd-vs-vibe-coding' (draft: false)? → Sí/No"), siguiendo el mismo patrón ya usado en `tasks.md` de `add-sdd-vs-vibe-coding-post` para otras decisiones confirmadas con el usuario (tarea 3.1, Q03/Q05).

## Risks / Trade-offs

- [Riesgo] Al no ser automatizable, un agente futuro podría olvidar incluir la tarea de checklist pese a la regla en `config.yaml` → **Mitigación**: la regla se carga como `rules.tasks` en todo `openspec instructions tasks`, y `operations.apply.guidance` la refuerza como check Q09 en `apply`; además queda visible en la review de PR (la ausencia de la tarea es detectable leyendo `tasks.md`).
- [Riesgo] Una confirmación ambigua sobre el contenido ("me gusta el post") podría malinterpretarse como confirmación de publicación → **Mitigación**: la regla exige registrar la pregunta literal de publicación hecha y la respuesta, no inferir la confirmación de comentarios generales sobre calidad o contenido.
- [Riesgo] Esta regla de proceso no impide que alguien edite el `.mdx` a mano y fije `draft: false` fuera del flujo de `tasks.md` → **Mitigación**: fuera de alcance de este change (no hay CI que lo impida); igual que el resto de `operations.apply.guidance`, es un control de proceso apoyado en revisión de PR, no un control técnico.

## Migration Plan

1. Trabajar en una rama nueva (p. ej. `chore/require-post-publish-confirmation`) creada desde `main` actualizada, nunca directamente sobre `main`.
2. Editar `openspec/config.yaml`: añadir el bullet nuevo en `rules.tasks` y el check Q09 en `operations.apply.guidance` (redacción exacta se define en `tasks.md`).
3. Ejecutar `openspec validate --all --strict` para confirmar que `config.yaml` sigue siendo válido tras la edición.
4. Abrir PR contra `main` referenciando este change; no requiere despliegue (no toca `src/` ni `dist/`).

**Rollback**: cambio de un único fichero de configuración sin migración de datos ni build afectado. Revertir el commit (`git revert`) restaura el `rules.tasks`/`operations.apply.guidance` anteriores; no deja el repositorio en un estado inconsistente porque ningún `tasks.md` existente depende de la regla nueva.
