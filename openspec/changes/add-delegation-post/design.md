# Design

## Context

La motivación está en `proposal.md`, apartado Why. Las decisiones de alcance las tomó el autor el 2026-11-25, en una sesión del skill `blog-post`:

- Eje: la economía de contexto. La especialización va en segundo plano, y el paralelo y el segundo plano son beneficios finales.
- Título: «Delegar no es paralelizar: subagentes para proteger la ventana».
- El lab no incorpora nada que `harness` no tenga.
- El segundo plano de subagentes entra en el lab.
- `model:` entra en el código y en una sola línea del post (revisado el 2026-11-25: ver «Revisión del autor»).
- La comparación A/B pide delegar en el prompt, con una nota aparte del piloto sin pedirlo.
- La objeción del clearing va justo después del diagrama.

**`lab-harness-local`:** `main` en `184de48`, la parte 6 integrada, con el tag `parte-6`, versión 0.5.0. Tiene:

- `Read`, `Glob`, `Grep`, `Write`, `Edit` y `Bash`, con segundo plano (`BashOutput` y `KillShell`).
- El motor de permisos de rutas, comandos y MCP, con los modos `default`, `acceptEdits` y `bypass`. **No tiene modo `plan`**, como dijeron las partes 4 y 5 en su «Lo que falta».
- El sandbox (bwrap y seatbelt), skills, hooks y MCP stdio.
- Un `ApprovalLock` privado de cada `Agent` en `src/core/loop.ts`.
- `src/core/background.ts` con `TaskKind = "shell"` solamente.
- La configuración solo se lee de `<workspace>/.harness/settings.json`: no hay capa de usuario ni `settings.local.json`.
- La salida de línea de `src/cli.ts`, que imprime el contexto de cada turno (`ctx …/…`) y un resumen final con turnos, llamadas y tokens.

**`harness`** (`~/workspaces/personal/harness`, `master`, `4aa8262`, el mismo commit que en las partes 4 a 6). Leído el 2026-11-25:

- **Definiciones** (`src/agents/loader.ts`, 154 líneas):
  - `AgentDefinition` con `name`, `description`, `prompt`, `tools`, `model`, `mode`, `maxTurns` y `source`.
  - Tipos integrados: `explore` (`Read`, `Glob`, `Grep` y `Bash`, modo `plan`, 40 turnos) y `general` (las herramientas del principal salvo `Agent`).
  - Raíces de usuario y de proyecto, con `.claude/agents` por compatibilidad. Con el mismo nombre gana la más específica, también sobre los integrados.
  - Las herramientas desconocidas y `Agent` se descartan con aviso. `model: inherit` o sin campo usa el del principal.
  - `mcpToolAllowed`: una definición que nombra alguna MCP recibe solo esas.
- **La tool** (`src/tools/agent.ts`, 126 líneas):
  - Esquema `description`, `prompt` y `subagent_type`, más `run_in_background` solo en el principal.
  - El informe se recorta por el medio a 40.000 caracteres y se marca si el subagente se paró antes de tiempo.
  - `readOnly` cuando el modo efectivo es `plan`, y entonces corre en paralelo con otras lecturas.
  - En segundo plano solo los de solo lectura, con deduplicación por tipo y prompt («Los modelos pequeños entran en bucle relanzando el mismo subagente mientras esperan su informe»).
- **Ejecuciones** (`src/agents/runs.ts`, 41 líneas): `SubagentRun` (con `peakContext` y `reportTokens`) y un `Semaphore`.
- **Lanzamiento** (`src/index.ts`, `spawn`):
  - Máximo 4 a la vez (`MAX_CONCURRENT_SUBAGENTS`) y 50 turnos por defecto, acotados por los del principal, con 200 llamadas.
  - `ApprovalLock` compartido y `AgentRef` en cada petición de permiso.
  - Política hija con `narrowMode`.
  - Bus hijo y eventos `subagent_start` y `subagent_end`.
  - Instrucciones propias en el system prompt (`subagentInstructions`).
  - Un transcript por subagente (`JsonlSessionStore`).
- **Permisos** (`src/policy/engine.ts`):
  - `plan` deniega todo lo que preguntaría.
  - `narrowMode` se queda con el más restrictivo.
  - El target `agent` se permite salvo una regla `Agent` o `Agent(<tipo>)`.
  - En `plan`, las MCP solo pasan si están en `mcp.readOnly`, que solo se lee de los settings de usuario o locales.
- **Segundo plano** (`src/core/background.ts`): `TaskKind` `"agent"`, `RunEndPolicy` `"wait"` y, en headless, rondas de espera (hasta 5, o 10 minutos sin aviso).
- **CLI**: `--no-agents`.
- **Evals** (`evals/tasks.ts` y `evals/results/`): `background-delegate-while-working` con `local-qwen` el 2026-10-30. La tanda `09-13-20` pasa 1 de 3 (2 y 3 subagentes lanzados cuando se esperaba 1); la tanda `09-19-04` pasa 3 de 3. El contexto máximo del principal va de 3.262 a 4.076 tokens.

**Ollama** (verificado el 2026-11-25): la FAQ oficial (`docs/faq.mdx`, publicada en docs.ollama.com/faq) dice que `OLLAMA_NUM_PARALLEL`, sin definir o a 0, deja que MLX en Metal elija y que los demás backends usen 1. `envconfig/config.go` lo confirma («0 selects the backend default»). Hay guías de terceros que dicen 4, y no se citan.

## Goals / Non-Goals

**Goals:**

- Que el ahorro de contexto sea una cifra medida con `qwen2.5:7b`, no deducida del código.
- Que el coste de delegar (tokens totales) aparezca en la misma tabla que el ahorro.
- Que el lab converja con `harness` en subagentes sin ninguna capacidad que `harness` no tenga.

**Non-Goals:**

- Evaluar en general si un modelo pequeño sabe cuándo delegar. Es una nota de piloto, no un benchmark.
- Medir el rendimiento del paralelo en local. El post cita la FAQ de Ollama y no promete velocidad.
- Debatir qué modelo concreto poner en `model:`, o medir un subagente con otro modelo.

## Decisions

**Qué entra en el lab (y nada más).** Se deriva de `harness` en `4aa8262` solo lo que necesita el post:

- **Definiciones**: `src/agents/loader.ts`, solo con la raíz de proyecto `.harness/agents`, sin capa de usuario ni `.claude/agents`, igual que las skills en la parte 6.
- **Ejecuciones**: `src/agents/runs.ts`, sin el campo `transcript`.
- **Tool**: `src/tools/agent.ts`, completo, con segundo plano y deduplicación.
- **Lanzamiento**: el `spawn` de `src/index.ts`, sin `JsonlSessionStore` ni `parentSessionId`. Con el semáforo de 4, los límites de turnos y llamadas, las instrucciones de subagente, la política hija y el bus hijo.
- **Permisos**: el modo `plan`, `narrowMode`, la política hija y el target `agent` en `src/policy/engine.ts`, más `--permission-mode plan` en la CLI.
- **Bucle**: el `ApprovalLock` pasa a compartirse con los subagentes, y la petición de permiso dice quién pregunta (`AgentRef`).
- **Eventos**: `AgentRef`, `subagent_start`, `subagent_end` y el bus hijo en `src/core/events.ts`.
- **Segundo plano**: `TaskKind` `"agent"`, `RunEndPolicy` y las rondas de espera en headless, en `src/core/background.ts` y donde termina el run.
- **CLI**: `--no-agents`, y las líneas de arranque y fin de cada subagente en la salida de línea. El fin muestra el uso y el contexto máximo que lleva `subagent_end`; el tamaño del informe sale del resultado de la tool `Agent`, porque `subagent_end` no lo lleva en `harness`. Es lo mínimo para ver y medir; el pie con el contador de subagentes es de la parte 9.
- **Fuera**: transcripts de subagentes (parte 8), `/agents`, `src/ui/agents.ts`, el contador del pie y la sección de `/context` (parte 9). Los módulos compartidos solo se tocan en lo que exige la parte 7.

**El modo `plan` entra en esta parte.** `explore` es de modo `plan`, y el criterio de solo lectura (paralelo y segundo plano) depende de él. Las partes 4 y 5 lo listaron como pendiente, así que la parte 7 lo cierra. El post lo cuenta en dos frases en la sección de permisos: qué hace (deniega todo lo que preguntaría) y que el principal también puede arrancar en `plan`. Alternativa descartada: un `explore` sin modo `plan`, con solo una lista de herramientas de lectura. Se descarta porque separaría el lab de `harness`.

**`mcp.readOnly` no entra.** En `harness` solo se lee de los settings de usuario o locales, para que un repositorio no pueda abrirse herramientas en `plan`. El lab no tiene esa capa y no la gana en esta parte. Con la lista vacía, el lab se comporta igual que `harness` sin ella: un subagente en `plan` no recibe herramientas MCP. Las herramientas MCP por tipo sí funcionan en los tipos que no son de `plan` (`tools: mcp__github`). Alternativa descartada: leer `mcp.readOnly` del `settings.json` del proyecto. Se descarta porque abre justo el hueco que `harness` cierra. La capa de usuario y `mcp.readOnly` quedan registradas como convergencia pendiente en `openspec/config.yaml`.

**`model:` en una línea.** El campo entra tal cual y el post lo enseña en el ejemplo de definición con «sin él, el del principal». Una frase remite al post de elegir modelo, fuera de la serie, que aún no existe: se dice que queda fuera, sin enlace. No se promete nada de rendimiento, ni de lo que cuesta cargar dos modelos en el mismo Ollama.

**Revisión del autor (2026-11-25): el coste no es solo el número de tokens.** Tras la QA, el autor pidió responder a que «dividiendo» para reducir el contexto se gasta más, y abrir la opción de usar modelos más económicos según la tarea. «Lo que cuesta» explica el 57 % en lugar de solo darlo: (1) leer no se duplica, el subagente hace las lecturas por menos que el principal sin delegar y lo que se suma es el coste fijo del principal (dos peticiones con su base y el informe copiado), medido; (2) 8.448 es el mejor caso de no delegar, y el piloto que compactó costó 12.037 y 12.324 sin acabar la tarea, medido; (3) si la sesión sigue, la siguiente petición del principal sin delegar compacta, calculado desde los umbrales de la parte 3 y declarado como no medido; (4) «delegar es compactar por adelantado»; (5) el trabajo del subagente puede ir a un modelo más pequeño con `model:`, sin medir, con dos peros: que el modelo pequeño sepa hacerlo y que los dos modelos quepan a la vez en Ollama (FAQ). Sustituye a «una sola línea» para `model:`, que ahora remite a «Lo que cuesta». Se queda dentro de la regla de la serie de `openspec/config.yaml` («'Varios modelos', 'elección de modelo' y 'cuándo local no basta' quedan fuera»; nada de rendimiento sin medición o fuente): el post dice que la opción existe y sus dos límites, y que qué modelo poner y cuánto se ahorra es elegir modelo, fuera de la serie. Ni cifra de ahorro, ni velocidad, ni APIs de pago. Alternativa descartada: medir la sesión de dos turnos con un script sobre la API del lab, porque la CLI solo admite un prompt por proceso y lo que se afirma (que la siguiente petición compacta) sale del código.

**Evidencia: la comparación A/B.**

- **Repositorio de demo**: `examples/delegacion`, una tienda con planes de suscripción en 11 ficheros. La idea inicial, una pregunta de un dato cuya búsqueda obligara a leer varios ficheros, no la resolvió `qwen2.5:7b` en ningún piloto (0 de 11: no sigue los `import`), y el autor la cambió el 2026-11-25 por una tarea de lectura: leer seis ficheros nombrados (`orders`, `billing` y `shipping`, ~3.500 tokens con números de línea) y resumir en una línea qué hace cada uno. Es el caso de uso típico de delegar, y la parte 3 ya pidió a este modelo leer ficheros enteros.
- **Acierto**: `examples/comprobar-delegacion.mjs`, con la respuesta y la traza. La respuesta nombra los seis ficheros y la traza muestra que se leyeron enteros (sin `offset`, y sin `limit` o con uno que cubre el fichero), el principal o el subagente. Sin la segunda condición, un resumen inventado a partir de los nombres contaría como acierto.
- **Condiciones** (prompts literales, decisión del autor tras los pilotos): sin `Agent` (`--no-agents`), «Lee enteros con Read, sin limit ni offset, <los seis ficheros>, y resume en una línea qué hace cada uno.»; con `Agent`, «Usa un subagente explore, sin run_in_background, con este prompt: «<lo mismo>». Después responde con su resumen.». El post dice por qué el prompt del subagente va escrito y en primer plano: en los pilotos, el principal lo reescribía sin decir que leyera, y lo lanzaba en segundo plano, donde la traza no enseña sus lecturas.
- **Ventana**: se empieza en 8.192, como en la parte 6. Criterio: sin `Agent`, el principal tiene que cruzar el umbral de clearing (60 %). Si no lo cruza, la tarea no sirve para la tesis y se agranda antes de medir. Si con 8.192 no hay manera, se pregunta al autor.
- **Número de ejecuciones**: 10 por condición como punto de partida, a cerrar en la tarea 1.7.
- **Por ejecución**, desde las salidas del lab:
  - si acertó, con una comprobación determinista del dato;
  - el contexto máximo del principal;
  - los tokens de entrada y salida del principal y de los subagentes, y su suma;
  - si hubo clearing o compactación en el principal;
  - los turnos y el tiempo.
- **Piloto sin pedir delegar**: 3 ejecuciones con `Agent` disponible y el prompt de la condición sin `Agent`. Va en una nota aparte, declarada como piloto, con lo que hizo el modelo, junto a lo que enseñaron los pilotos de la tarea 1.7 (el prompt reescrito que pierde la instrucción de leer y el segundo plano elegido por el modelo).
- **Hipótesis, sin afirmarla**: sin `Agent`, el principal cruza los umbrales de la parte 3; con `Agent`, no los cruza, a cambio de más tokens totales.
- **Resultado**: se publica tal como salga, sin seleccionar ejecuciones. Si contradice la hipótesis, el post lo dice y el ángulo se revisa con el autor antes de escribir.
- **Tests deterministas** con `FakeProvider` para el cargador, la tool, los permisos (`plan`, `narrowMode`, `deny` de `Agent`), el semáforo, el segundo plano y la deduplicación, para que `npm test` no dependa de Ollama.

**El segundo plano en el post.** Una demo corta en el lab (3 ejecuciones) muestra que el principal sigue trabajando y usa el informe cuando llega. El motivo de la deduplicación (el modelo pequeño relanza el mismo subagente) se cuenta con las evals de `harness` del 2026-10-30 solo si el autor lo aprueba en la tarea 1.8. Si no, se cuenta con lo que ocurra en la demo del lab, o con el comentario del código.

**El paralelo en el post.** Una frase con la FAQ de Ollama: en Linux, sin `OLLAMA_NUM_PARALLEL`, el servidor atiende una petición a la vez, así que cuatro `explore` en paralelo esperan en cola. Sin cifras de velocidad.

**Estructura del post.**

1. Prerrequisitos y clonado: lo de la parte 6, la referencia a WSL2 y `git clone --branch parte-7`.
2. La necesidad: una pregunta corta que obliga a leer muchos ficheros que luego no sirven.
3. El diagrama: el principal llama a `Agent`; el subagente es otro bucle (el de la parte 2) con su propia ventana y sus propias herramientas; al principal solo vuelven el prompt y el informe.
4. «¿Y el clearing de la parte 3?»: actúa después y delegar actúa antes; los dos se apilan; y el caso en que la objeción gana.
5. La tool `Agent`: el contrato, el prompt autocontenido, el informe como único retorno y la marca de informe incompleto.
6. Especialización: `explore` y `general`, las definiciones `.md`, las herramientas por tipo, incluidas las MCP, y la línea de `model:`.
7. Permisos: solo restringen, el modo `plan`, un único nivel, la sesión de Bash propia y el sandbox, y los prompts serializados que dicen quién pregunta.
8. Verlo actuar: la tabla A/B y la nota del piloto.
9. Lo que cuesta y cuándo no delegar: el informe pierde información, el subagente no ve la conversación y un `Read` o un `grep` directos son más rápidos.
10. Otros beneficios: el paralelo, con el matiz de Ollama, y el segundo plano, con su demo y la deduplicación. Cierra el título.
11. Lo que falta y lo esencial.

El diagrama va en JSX con estilos en línea y las variables del sitio, con `aria-label`, como en las partes 3 a 6, y se revisa a 390 y 1440 px. Listas de una línea por punto, sin sublistas. Extractos y enlaces siempre contra el tag `parte-7`.

**Tamaño y orden de recorte.** El objetivo son ~29 a 32 KB, como las partes 4 a 6. Si se pasa, se recorta en este orden:

1. Los extractos largos pasan a enlaces al tag.
2. El detalle del cargador de definiciones.
3. El detalle del segundo plano.

Nunca se recortan la tabla A/B, los tokens totales, la objeción del clearing ni el cuándo no delegar.

**Imagen destacada.** Se pregunta al autor en el apply. Si la aporta, se convierte con `sharp` a WebP 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás. Si no, placeholder de marca.

**Ramas y tag.**

- **En este repositorio**: `feat/add-delegation-post`.
- **En el lab**: una rama desde `origin/main` (`184de48`) con la parte 7 completa (código, tests, README y documentación) y una PR que integra el autor. El tag `parte-7` se crea sobre `main` tras ese merge. Los tags `parte-2` a `parte-6` no se tocan.

## Risks / Trade-offs

- **[Sin `Agent`, el principal no llega al clearing]** → La tarea no sirve para la tesis. Mitigación: comprobarlo en un piloto antes de las 10 ejecuciones (tarea 1.7) y agrandar la tarea.
- **[El modelo no delega aunque se le pida, o el `explore` no encuentra el dato]** → Aceptado: se publica la tabla tal como salga. Si ninguna ejecución con `Agent` acierta, se pregunta al autor antes de cambiar el modelo o la tarea.
- **[La medición contradice la hipótesis]** (el principal no ahorra, o el informe pierde el dato) → El post lo cuenta. El ángulo se revisa con el autor antes de redactar.
- **[El informe pierde el dato clave]** → Es el contraargumento del post. La comprobación determinista del acierto lo hace visible en la tabla.
- **[Subagentes en paralelo con `OLLAMA_NUM_PARALLEL=1`]** → Esperan en cola. El post lo dice con la FAQ y no promete velocidad.
- **[Subagentes en segundo plano que no terminan en headless]** → Las rondas de espera de `harness` (5, o 10 minutos sin aviso) los acotan y matan con aviso.
- **[Los tests de `bash.test.ts` que ya fallan en el contenedor arm64]** → Se registran como preexistentes, como en la parte 6.
- **[Un repositorio ajeno trae `.harness/agents/*.md`]** → Mitigación: aviso al arrancar, como las skills, y una definición solo puede restringir. El post lo dice.
- **[Diferencias lab/harness]** → Se listan y justifican al final del grupo 1, como en las partes 4 a 6: sin capa de usuario ni `.claude/agents`, sin transcripts y sin `mcp.readOnly`.
- **[Tamaño del post]** → Mitigación: el orden de recorte de Decisions.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El tag `parte-7` y el código del lab quedan publicados de forma independiente; si hay que retirarlos, decide el autor. `harness` no cambia.

## Open Questions

- **Slug** (tarea 2.1). Propuesta: `delegar-no-es-paralelizar`.
- **Número final de ejecuciones por condición** (tarea 1.7). Punto de partida: 10.
