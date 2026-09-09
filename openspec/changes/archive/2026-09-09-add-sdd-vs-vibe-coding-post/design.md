## Context

Ver `proposal.md` - Why. El patrón "post + demo interactiva en `/lab/<slug>`" ya existe y está validado (`perdidos-en-el-medio.mdx` + `src/pages/lab/test-memoria.astro`): una página Astro autocontenida, sin backend, que reutiliza los tokens de `global.css`, con navegación mínima (un único enlace de vuelta al post) según `specs/lab/spec.md`. Este change añade una segunda demo sobre ese mismo patrón, no lo extiende.

## Goals / Non-Goals

**Goals:**
- Que el lector experimente en primera persona, antes de leer la explicación, cómo un requisito deriva silenciosamente cuando nadie tiene un contrato visible al que volver — el mismo recurso narrativo que ya usa `perdidos-en-el-medio.mdx` (vivir el fenómeno, luego explicarlo).
- Que la comparación SDD/vibe coding del artículo se apoye en evidencia real y trazable de este propio repositorio (los 4 `proposal.md` archivados), no en afirmaciones genéricas.
- Separar con claridad en el texto qué es evidencia real (los 4 changes del repo) y qué es un ejemplo ilustrativo ficticio (el requisito de export CSV/JSON de la demo), para no mezclar ambos registros.

**Non-Goals:**
- No se implementa backend, persistencia entre sesiones ni cuenta de usuario: el estado del juego vive solo en memoria del cliente durante la visita, igual que `test-memoria`.
- No se ejecuta código real ni se simula un editor: las "rondas" son elecciones de opción múltiple sobre texto/pseudo-código, no un sandbox de ejecución.
- No se generaliza el mecanismo de doble rama a un componente reutilizable para futuras demos; si un tercer lab necesita algo similar, se evalúa entonces.

## Decisions

**Ruta y slug**: `/lab/telefono-roto`, página nueva en `src/pages/lab/telefono-roto.astro`, siguiendo exactamente el esqueleto de `test-memoria.astro` (misma cabecera de vuelta al post, mismos tokens de `global.css`, sin navegación principal). Alternativa descartada: anidar la demo bajo una ruta propia fuera de `/lab/` — se descarta porque el contrato de `specs/lab/spec.md` ya cubre este caso sin cambios.

**Sin dependencia nueva**: la mecánica (mostrar ronda, capturar elección, avanzar estado, revelar comparación final) se implementa con JS vanilla embebido en la página Astro, igual que `test-memoria.astro`. No se justifica ninguna librería de estado/UI adicional para una interacción de 4 rondas x 2 ramas.

**Mecánica del juego — dos ramas paralelas, mismo guion de decisiones**:
- Requisito de partida (mostrado una sola vez, al inicio de cada rama): "el botón de exportar debe permitir CSV y JSON".
- 4 rondas por rama, cada una con un mensaje corto tipo "petición del ronda" y 2-3 opciones de elección múltiple. El contenido de las rondas es idéntico entre ramas; lo único que cambia es si el contrato de una línea permanece visible en pantalla durante todas las rondas (rama "con contrato") o no aparece tras la ronda inicial (rama "sin contrato").
- En la rama "con contrato", las opciones que violarían el contrato se marcan visualmente como tal en el momento de elegir (no se ocultan: el punto es que el contrato visible cambia la decisión, no que sea imposible equivocarse).
- Al final de cada rama, pantalla de resultado: qué formatos exporta el estado final vs. el requisito original, con acierto/fallo explícito.
- Alternativa descartada: una sola rama con un toggle "mostrar/ocultar contrato" activado por el jugador. Se descarta porque diluye el efecto — el punto es que la ausencia de contrato no se nota como ausencia mientras ocurre, igual que en el test de memoria nadie nota el hueco hasta que lo mide.

**Contenido de las rondas es responsabilidad de `tasks.md`**: el guion exacto de las 4 rondas (textos, opciones, cuál es la "tentadora") se escribe como parte de la implementación, no en este documento — ver Open Questions.

## Risks / Trade-offs

- [Las opciones "malas" de cada ronda resultan obviamente malas y el juego pierde el efecto sorpresa] → Mitigación: cada opción que causa deriva debe ser la elección razonable en el momento (optimizar, simplificar, entregar rápido), nunca una opción marcada como descuidada; validar leyendo el guion completo antes de publicar, no solo ronda a ronda.
- [El ejemplo ficticio (export CSV/JSON) se confunde con los casos reales del repo usados en la comparación] → Mitigación: el artículo distingue explícitamente "esto pasó en este repo" (los 4 proposal.md) de "esto es un ejemplo de juguete para la demo", en textos separados.
- [Construir 2 ramas x 4 rondas es más contenido que el lab anterior de una sola pasada] → Aceptado: es el coste ya identificado y asumido para conseguir el efecto experiencial (ver proposal.md).
- [La demo no transmite el punto sin haber leído antes el artículo, o viceversa] → Mitigación: seguir el orden ya probado en `perdidos-en-el-medio.mdx` (se enlaza la demo al principio del post, antes de la explicación), no como anexo al final.

## Open Questions

- Texto final de las 4 rondas (mensajes, opciones, copy de la pantalla de resultado): se resuelve al escribir la implementación (tasks.md), sin que afecte a la estructura de dos ramas ni al contrato de `/lab/` ya decidido aquí.
- Título definitivo del post: se resuelve al redactar el artículo; no cambia el slug de la demo (`telefono-roto`) ni la estructura de capabilities de este change.
