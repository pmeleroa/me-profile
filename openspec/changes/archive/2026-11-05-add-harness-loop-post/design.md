# Design

## Context

Ver `proposal.md` - Why. Definido en entrevista con el autor mediante el skill `blog-post`.

`harness` (`~/workspaces/cecabank/repos/harness`) es un harness de agente de código en TypeScript, v1.0.0, de unas 16.000 líneas, licencia MIT a nombre del autor, sin remoto y con `private: true`. El autor confirma que puede publicar el código. Se ha leído `src/core/loop.ts`, `src/providers/canonical.ts`, `src/providers/openai.ts`, `src/tools/` y `test/fake-provider.ts`.

Hechos comprobados el 2026-11-04 con Ollama 0.40.14 y `qwen2.5:7b`:

- Sin streaming, `/v1/chat/completions` con `tools` devuelve `finish_reason: tool_calls` y `id`, y tras un mensaje con rol `tool` el modelo responde bien.
- `/v1/models` no informa de la ventana de contexto.
- Una petición de unos 114.000 tokens estimados con ventana de 32.768 devolvió HTTP 200, `prompt_tokens` 16.386 y perdió el inicio del mensaje (una ejecución). Es material de la parte 3.

Falta comprobar la misma llamada con streaming (tarea 3.1). La documentación de `harness` afirma que las pruebas con Ollama pasan con `qwen2.5:7b`, pero esas pruebas no se han repetido aquí.

El lector objetivo es técnico y cómodo en terminal. Es la continuación del post 1.

## Goals / Non-Goals

**Goals:**
- Que el lector ejecute un harness con el que un modelo responde a una pregunta sobre un repositorio pequeño, viendo cada llamada a herramienta.
- Que provoque a voluntad los fallos del bucle, sin depender de que el modelo falle.
- Que `lab-harness-local` empiece ya con la forma de `harness`, para que evolucionar sea añadir y no reescribir.

**Non-Goals:**
- Escritura, ejecución de comandos, permisos, gestión de contexto, MCP y cancelación controlada.
- Recomendar un modelo o justificar la ejecución en local.
- Nombrar productos comerciales como referencia del asistente. Las menciones técnicas de formatos solo si el post las necesita.
- Publicar `harness` aparte.

## Decisions

**Tesis y contraargumento.** Abundan los tutoriales de «tu agente en 50 líneas». La diferencia de este post son los fallos tratados como finales explícitos, tomados de un `run()` real. Si una sección no aporta a esa tesis, sale del post.

**Mismos módulos y contratos que `harness`.** La parte 2 usa `src/core/loop.ts`, `src/core/events.ts`, `src/providers/canonical.ts`, `src/providers/openai.ts`, `src/tools/{types,registry,read,search}.ts`, `src/index.ts`, `src/cli.ts` y `test/fake-provider.ts`, con los mismos nombres de tipos: `Provider`, `ProviderEvent`, `Agent`, `RunResult`, `defineTool`. El código se deriva recortando el de `harness`, no se reescribe. Se quita lo que aún no existe (`policy`, `session`, `hooks`, `context`, `fileState`, `thinking`, imágenes). Alternativa descartada: una versión didáctica con otra forma, porque obligaría a reescribirla al converger. Coste aceptado: el código inicial lleva algo más de estructura de la que necesita un bucle aislado.

**Streaming desde el principio.** Decisión del autor: tiene sentido en un harness de CLI. `stream()` termina con exactamente un `message_end` o lanza, como en `harness`. El post explica las dos formas de llegar las llamadas: completas en un chunk sin `id` ni `index` (Ollama, según la documentación de `harness`) o troceadas (otros servidores), y por qué `ChunkAccumulator` absorbe ambas.

**`/v1/chat/completions` en vez de `/api/chat`.** Decisión del autor: lo implementado y testado en `harness` es lo correcto, y el `curl` del post 1 era una aproximación. Consecuencia para la parte 3: el contexto no se puede fijar por petición por esta vía, según la documentación de Ollama.

**Herramientas `Read` y `Glob`, con ripgrep.** Mismos nombres y esquemas que `harness`, y el `Glob` real basado en `rg`. Ripgrep pasa a ser prerrequisito, y el post enlaza a sus instrucciones oficiales en vez de dar comandos por sistema, porque difieren entre Linux y macOS. Alternativa descartada: un listado propio con Node, sin prerrequisito, porque cambiaría al converger y no estaría probado.

**Límite de workspace en las herramientas.** Esto no está en `harness`, donde lo decide la policy. Sin policy, `Read` podría leer `~/.ssh` por decisión del modelo, y en el repositorio del lector puede haber instrucciones maliciosas. `Read` y `Glob` rechazan, con error visible para el modelo, las rutas que salgan del workspace tras resolver enlaces simbólicos con `realpath`. Se reutiliza `isInside`. En la parte 4 esta comprobación pasa a la policy. El post lo explica en un párrafo y aclara que no es el modelo de permisos.

**Finales que enseña el post y finales que tiene el código.** El post trata `end_turn`, `max_turns`, `repeated_failure` y `empty_response`. El código mantiene además `max_tokens` y `error`, porque sin ellos una respuesta truncada o Ollama parado se presentarían como un final normal. Se mencionan sin desarrollarlos.

**Proveedor simulado con tests.** `test/fake-provider.ts` y `test/loop.test.ts` provocan los tres fallos de forma determinista. El lector los ejecuta con `npm test`. Un modelo real no los reproduce de forma fiable. Además, enseña para qué sirve el contrato: el loop no cambia al sustituir al modelo.

**Dependencias de `lab-harness-local`.** `zod` en ejecución (esquemas de herramientas y JSON Schema, igual que `harness`); `typescript`, `tsx`, `vitest` y `@types/node` en desarrollo. Sin SDK de proveedor: `fetch` y SSE. Sin ink, tree-sitter ni MCP hasta sus partes. No se añade nada a `me-profile`. Alternativa descartada: Python solo con biblioteca estándar, como `lab-golden-set-eval`, porque rompería la convergencia.

**Repositorio y tags.** `pmeleroa/lab-harness-local`, público y MIT, con historia propia y limpia, no el historial de `harness`: tiene 55 commits en tres días, otro orden y la identidad de otra máquina. Cada parte añade commits en `main` y un tag (`parte-2`). El post enlaza siempre al tag, como en `lab-golden-set-eval`. Autor de los commits: la cuenta personal.

**Repositorio de demostración incluido.** Un directorio `examples/demo` con unos pocos ficheros pequeños, para que la pregunta y la salida sean reproducibles. Se diseña para caber en 4.096 tokens, porque la documentación de Ollama da 4k por defecto con menos de 24 GiB de VRAM y la máquina del autor usa 32.768. Se verifica forzando `OLLAMA_CONTEXT_LENGTH=4096`. Esto no se presenta como una cuestión de hardware.

**Modelo.** `qwen2.5:7b`, declarado como el usado en los ejemplos, sin recomendarlo. Es distinto de `qwen2.5-coder:7b` del post 1, que no se ha probado con herramientas; el post lo dice en una frase y deja el modelo como parámetro (`HARNESS_MODEL`, `--model`). Las evals de `harness` con `local-qwen` no se citan, porque se desconoce el modelo tras ese alias.

**Terminal Linux.** `git clone`, `npm`, `ollama pull` y `npm test` son idénticos en Linux y macOS, así que se verifican en la máquina del autor. Windows se cubre con la referencia a WSL2. Sin excepciones en esta parte. La parte 4 tendrá que justificar la suya.

**Estructura del post.**

1. Apertura: un modelo solo genera texto, y lo demás lo hace el harness. Enlace al post 1 y frase sobre `/api/chat` y `/v1`.
2. Prerrequisitos y clonado del tag `parte-2`.
3. Arquitectura: diagrama con CLI, loop, contrato, adaptador y Ollama, con el gateway como caja opcional. Un párrafo sobre LiteLLM.
4. El contrato de inferencia y el adaptador con streaming.
5. El bucle: extracto real y ejecución con el modelo.
6. Herramientas: contrato, validación que devuelve errores al modelo y límite de workspace.
7. Cómo termina: los cuatro finales, provocando los fallos con `npm test`.
8. Lo que falta: qué carencias del post 1 resuelve esta parte, la conversación que crece hasta llenar el contexto, y una proyección orientativa, sin fechas ni títulos cerrados, de las capacidades que quedan (contexto, escritura y permisos, ejecución y seguridad, extensibilidad, delegación, sesiones y evaluación, interfaz e integración). Añadido el 2026-11-05 a petición del autor.

Diagrama en HTML y CSS estáticos dentro del MDX, como en `golden-sets-y-pipelines-de-evaluacion.mdx`, sin JavaScript ni dependencias. Listas de una línea, sin sublistas. Título y slug (definitivos desde 2026-11-05): «Un harness propio desde cero: el bucle y cómo falla» y `harness-propio-desde-cero-el-bucle`. «Propio» y no «de código» porque el harness dará soporte a todo lo que se construya sobre él, no solo a la implementación de código. Antes fueron «Un agente de código desde cero…» (`agente-de-codigo-desde-cero-el-bucle`) y «Un harness de código desde cero…» (`harness-de-codigo-desde-cero-el-bucle`).

**Hoja de ruta en `config.yaml`.** Sustituye el orden anterior por: parte 2 loop, contrato de inferencia y lectura; parte 3 contexto e historial; parte 4 editar y ejecutar, con permisos y sandbox en Linux y macOS; parte 5 MCP; parte 6 integración y sesiones. La salida estructurada se trata dentro del contrato de herramientas. Añade la convergencia con `harness` y la entrada del post independiente sobre LiteLLM, sin reabrir «varios modelos».

**Imagen destacada.** Sin decidir: se pregunta al autor durante el apply. Si la aporta, WebP de 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás, con el mismo proceso `sharp` que el post 1. Si no, placeholder de marca.

## Risks / Trade-offs

- [La llamada con streaming no se comporta como sin streaming] → Mitigación: la tarea 3.1 se ejecuta antes de redactar y su salida se registra. Si falla, se para y se consulta al autor.
- [Publicar algo que contenga secretos o datos de la máquina de trabajo] → Mitigación: repositorio con historia nueva, `.env` y `evals/results` excluidos, y búsqueda de patrones antes del primer push público.
- [La serie no llega a converger: `harness` tiene piezas sin parte asignada] → Registrado en Open Questions.
- [Los extractos del post se desincronizan del código] → Mitigación: copia literal del tag `parte-2`, comprobada con `grep -F`.
- [El lector con poca memoria se queda sin contexto en la demostración] → Mitigación: demostración verificada con 4.096 tokens; el fallo con más contexto es justo el arranque de la parte 3.
- [Un modelo responde distinto al de los ejemplos] → Aceptado: el post lo declara, y los fallos se prueban con el proveedor simulado.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El repositorio y el tag quedan publicados de forma independiente; si hay que retirarlos, el autor decide si archivarlos o borrarlos.

## Open Questions

- Piezas de `harness` sin parte asignada: subagentes, skills, hooks, procesos en segundo plano, `Grep`, replay, evals, TUI con Ink y proveedor de Anthropic. No bloquean la parte 2, pero la convergencia exige decidir antes del final si reciben partes propias o entran en un último tag sin post.
