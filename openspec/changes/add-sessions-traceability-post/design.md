# Design

## Context

La motivación está en `proposal.md`, apartado Why. El autor tomó las decisiones de alcance el 2026-11-26, en una sesión del skill `blog-post`:

- Las evals y el replay salen de la serie y pasan a una serie propia de evaluación. La parte 8 se queda con retomar el trabajo y la trazabilidad.
- Tesis: «todo se guarda, no todo se restaura». Título provisional: «Guardar no es restaurar: retomar el trabajo y saber qué hizo el agente».
- El registro `approval` se hace directamente en el lab.
- La regla de la serie cambia: el lab puede adelantarse a `harness` y, al acabar la serie, será la primera versión GA del harness.
- Para listar y leer sesiones se usa `jq`, sin subcomando nuevo.
- El diseño del registro `approval`, aceptado tal como se propuso: todas las decisiones, origen estructurado, subagentes en su propio transcript, y el caso del paralelo corregido.
- La evidencia y la cifra.
- Las sesiones viven fuera del workspace. El autor lo decidió en este change, al ver el problema de protección.

**`lab-harness-local`:** `origin/main` está en `f4b7241`, que es el tag `parte-7`. Versión 0.6.0. Lo que hay que saber de él para esta parte:

- **No guarda nada.** Cada `npm run dev -- "<pregunta>"` es un proceso con una sola pregunta. No hay REPL, ni `src/session/`, ni flags de sesión.
- **El motor ya calcula cada decisión con su motivo.** `PolicyEngine.evaluate` (`src/policy/engine.ts`) devuelve `{ kind: "allow" | "deny" | "ask", reason }`. El motivo es texto libre, por ejemplo `rule Edit(src/**)`, `bypass mode (…)`, `plan mode: …`, `acceptEdits: write inside workspace` o `read inside workspace`.
- **El bucle ya emite la decisión** (`src/core/loop.ts`, unas líneas 449 a 475). Emite `permission_decision` con `decision`, `source: "policy" | "user"` y `reason`, y emite `hook_blocked` cuando un PreToolUse bloquea. Esos eventos van al bus y se pierden. Además, se pierde detalle:
  - con `source: "user"` no se distingue «una vez» de «siempre» y no se guarda el motivo del «no»;
  - **una llamada en paralelo que cubre un «siempre» recién concedido** (la reevaluación dentro de `approvalLock`) se da por `allow_once` del usuario, con el motivo de la pregunta original.
- **Cómo se corta un run.** Con terminal, `readline` captura Ctrl+C y hace `process.exit(130)` (`src/cli.ts`, unas líneas 271 a 276). Si había una pregunta de permiso pendiente, el `tool_use` queda sin `tool_result`. Sin terminal, `SIGINT` aborta el run y el bucle escribe el resultado `INTERRUPTED`.
- **Búsqueda y sandbox.** Grep y Glob usan `rg --hidden --glob=!.git` y respetan `.gitignore`. El sandbox (`src/policy/sandbox/index.ts`) monta `/` en solo lectura. Las únicas rutas escribibles son las `writablePaths` (el workspace), y `defaultHiddenPaths()` tapa una lista fija de credenciales del `HOME`: con `tmpfs` en bwrap y con `deny` en seatbelt.
- **Estimador de tokens.** `estimateText` y `estimateMessages` (`src/context/manager.ts`) son la estimación por caracteres que usa el lab para el clearing.
- **`examples/demo`** es la tienda de las partes 4 a 6. No tiene `package.json` y sus tests usan `vitest`. Su `.harness/settings.json` deniega `Read(**/.env*)`, `Edit(**/.env*)` y `Edit(.harness/**)`, y tiene un hook PreToolUse sobre Bash (`check-commit.mjs`).

**`harness`** (`~/workspaces/personal/harness`, `master`, `762730a`). Leído el 2026-11-26:

- **`src/session/jsonl-store.ts`** (317 líneas):
  - `SessionRecord` con `meta` (incluye `parentSessionId`, `agentType`, `forkedFrom` y `mcp`), `subagent`, `task`, `message` (con `notice`), `usage` y `compact`;
  - `JsonlSessionStore`, que retiene el `meta` hasta el primer registro real;
  - `readRecords`, que salta las líneas truncadas;
  - `readMessages`, que reconstruye la vista desde el último `compact` y fusiona los roles seguidos;
  - `listSessions`, `resolveSession` (id o prefijo), `forkSession`, `readTasks` y `repairTranscript` (`RESUME_INTERRUPTED`);
  - `subagentsDir` en `<sessions>/<id>/agents`.
- **`src/index.ts`:**
  - `sessionsDirOf(workspace)` = `<workspace>/.harness/sessions`;
  - la resolución de `--resume`, `--continue` y `--fork-session`, con un `meta` nuevo en cada arranque que lleva el modelo de ese momento;
  - el aviso de tools MCP que faltan al retomar;
  - los registros `task` desde el bus;
  - el transcript propio de cada subagente, con `parentSessionId`.
- **Qué no se restaura** (`docs/REFERENCE.md`, «Sesiones»): el modo de permisos, las reglas «siempre» y el registro de lecturas de Edit. El modelo y la ventana tampoco: salen de los flags y de los settings del arranque.
- **`harness` no protege los transcripts.** Solo quedan fuera de git porque el `.gitignore` del propio repositorio de `harness` tiene `.harness/`. En el workspace de un usuario, el agente puede:
  - leer los transcripts con Read o Grep (`rg --hidden`), sin preguntar, porque están dentro del workspace;
  - reescribirlos con Edit, Write o Bash.

  Además, un transcript contiene lo que otra sesión leyó fuera del workspace con una aprobación de «una vez». Por tanto, leerlo desde otra sesión salta el perímetro de la parte 4.
- **El replay** (`src/session/replay.ts`) solo trata `meta`, `message`, `usage` y `compact`, y pasa por alto cualquier otro tipo de registro.

## Goals / Non-Goals

**Goals:**

- Que el lector pueda retomar una tarea en otra invocación y ver qué se restaura y qué no, en una ejecución real.
- Que, de cada llamada a una herramienta, el registro diga quién la autorizó y por qué, sin parsear texto libre.
- Que el agente no pueda reescribir su propio registro en ningún modo, ni leer el de otra sesión sin preguntar.
- Que el formato del lab siga siendo legible por el replay de `harness`, para la futura serie de evaluación.

**Non-Goals:**

- Integridad criptográfica o un registro a prueba de manipulación. El post dice que el registro es para ti, no un justificante.
- Rotar o limpiar sesiones antiguas: el registro crece sin límite, y el post lo dice.
- Una forma de ver las sesiones desde la interfaz (parte 9).

## Decisions

**Qué entra de `harness` (y nada más).** Se deriva de `harness` en `762730a` solo lo que necesita el post:

- **`src/session/jsonl-store.ts`:** completo, salvo `summarizeSession` y lo que solo usa el menú de `/resume`. `listSessions` y `resolveSession` sí entran, porque `--continue` y `--resume` los necesitan.
- **Resolución de sesión en `src/index.ts`:** `--continue`, `--resume <id o prefijo>` y `--fork-session`; el `meta` en cada arranque; el `restore` con `repairTranscript`; y el transcript de cada subagente con `parentSessionId` y el registro `subagent`.
- **Registros `task`** desde el bus (`task_start` y `task_end`).
- **La reparación del corte se escribe** (decisión del autor en el apply, el 2026-11-26). En `harness`, el `tool_result` sintético de `repairTranscript` solo vive en memoria, así que una segunda retomada, o un fork después de retomar, vuelve a leer el `tool_use` sin resultado, ya en mitad de la conversación. En el lab, al retomar, se escribe como un registro `message`. Es otra diferencia pendiente de llevar a `harness`.
- **`restoreFinished` no entra.** Las tareas restauradas son «solo para listarlas» (comentario de `src/core/background.ts` en `harness`) y el lab no tiene `/tasks`, así que no tendría efecto visible. Pasa a la parte 9.
- **CLI:** `-c`/`--continue`, `-r`/`--resume <id>` y `--fork-session`, con los mismos mensajes de error que `harness` (`--continue` y `--resume` son excluyentes; `--fork-session` sin `-c` ni `-r` se ignora con aviso). Al arrancar se imprime una línea `sesión <id>` y, al retomar, el resumen corto de `formatResumed`: el último «tú» y el último «agente».

**Las sesiones viven fuera del workspace** (decisión del autor, el 2026-11-26).

- **Ruta:** `~/.harness/sessions/<clave>/`. La clave es el nombre del directorio del workspace más 8 caracteres hexadecimales del hash de su `realpath`, por ejemplo `tienda-demo-3f2a9c1b`. Se lee con `ls`, no colisiona entre dos rutas distintas con el mismo nombre y no depende de cómo se escriba la ruta. El `meta` sigue guardando la ruta absoluta en `workspace`.
- **Protección, por capas:**
  - **Escritura.** El motor añade un `deny` integrado para `Write` y `Edit` (y para las redirecciones de Bash, que el motor ya evalúa como escrituras) sobre cualquier ruta bajo `~/.harness/sessions`. Ese `deny` gana a cualquier `allow` y a `bypass`, y su motivo lo dice: `session transcripts are read-only for the agent`.
  - **Sandbox.** `~/.harness/sessions` entra en `defaultHiddenPaths()`. Bash y los servidores MCP no lo ven: es un `tmpfs` vacío en bwrap y un `deny` en seatbelt. Además, al estar fuera del workspace ya no era escribible desde Bash.
  - **Lectura con Read, Glob o Grep.** Es una lectura fuera del workspace, así que pregunta en `default` y se deniega en `plan`. No se deniega del todo: leer tus propias sesiones con permiso es legítimo. En `bypass` pasa, como todo lo demás en ese modo, y el post lo dice.
  - **Git:** fuera del repositorio, nada que ignorar.
- **Alternativas descartadas:**
  - *Dentro del workspace con protección integrada.* Habría que cerrar Read, Edit, Write, Glob, Grep, Bash y MCP uno a uno, además del orden de montajes en bwrap (el bind del workspace taparía el `tmpfs` de la subcarpeta) y de un `.gitignore` creado al vuelo.
  - *Dentro sin protección.* Choca con la tesis: el agente podría reescribir su registro.
- **Diferencia con `harness`:** la ubicación y la protección. Se registran en `openspec/config.yaml` como pendientes de llevar a `harness`, junto con el agujero de perímetro que tiene hoy.

**El registro `approval`** (diseño aceptado por el autor, el 2026-11-26).

- **Una línea por cada decisión, también las automáticas.** Sin `read inside workspace` y `acceptEdits: write inside workspace` no se puede contestar «¿por qué se ejecutó esto si yo no dije nada?». Cuesta una línea de JSON por llamada, poco al lado del `tool_result` que ya se guarda.
- **Forma:**

  ```ts
  { type: "approval", ts, toolUseId, tool,
    decision: "allow" | "deny",
    origin: "rule" | "mode" | "policy" | "user" | "hook",
    reason,                                     // el del motor, tal cual
    rule?: string, ruleSource?: "settings" | "flag" | "session" | "builtin",
    answer?: "once" | "always" | "no", feedback?: string }
  ```

- **El origen se calcula donde se decide, no a partir del texto.** `Decision` gana un campo `origin` en `engine.ts`. Cada `return` del motor lo pone:
  - `rule`, con `rule` y `ruleSource`;
  - `mode`, cuando `bypass`, `acceptEdits` o `plan` deciden;
  - `policy`, para el perímetro, la lectura dentro del workspace, «all subcommands allowed», el target `agent` y la tarea propia en segundo plano.

  Para eso, las reglas recuerdan de dónde vienen al cargarse: `settings`, `flag` (`--allow` y `--deny`), `session` (los «siempre») o `builtin` (el `deny` de los transcripts). Se descarta parsear `reason`, porque cualquier cambio de redacción rompería la traza.
- **`user`:** cuando el motor pregunta y respondes. Lleva `answer` y, si dijiste que no con texto, `feedback`.
- **El caso del paralelo:** la reevaluación dentro de `approvalLock` que pasa por una regla de sesión se registra como `rule` con `ruleSource: "session"`. Antes salía como `user` y `once`.
- **`hook`:** un PreToolUse que bloquea deja `decision: "deny"` y `origin: "hook"`, con el mensaje del hook en `reason`. No hay decisión del motor, porque el hook va antes.
- **Sin `approval`:** una llamada sin decisión (input inválido, tool desconocida o un corte durante la pregunta) no deja registro. Por tanto, un `tool_use` con `tool_result` y sin `approval` es un error del harness, y lo cubre un test.
- **Dónde va:** en el mismo JSONL, entre el mensaje del asistente con el `tool_use` y el mensaje con los `tool_result`, que es el orden en que pasa. `readMessages` pasa por alto todo lo que no es `message`, así que retomar no cambia. El replay de `harness` también lo pasa por alto.
- **Subagentes:** sus decisiones van a su propio transcript, en `agents/`. La consulta `jq` de «quién aprobó» lee el principal y su `agents/`.
- **Diferencia con `harness`:** se registra en `openspec/config.yaml` como pendiente. Es también la base del modo exec del replay de la serie de evaluación.

**Formato compatible con `harness`.** El lab escribe los mismos tipos y campos que `harness`, `meta.mcp` y `message.notice` incluidos, aunque en el lab solo los use el replay. Añade dos cosas:

- el tipo `approval`;
- el campo opcional `meta.contextWindow`, la ventana del arranque, que `harness` apunta en su «To do» del replay. También sirve para la cuarta ausencia del post.

Así, el replay de la serie de evaluación puede leer transcripts del lab sin conversión. Alternativa descartada: quitar `notice` y `meta.mcp` por ser solo del replay. Ahorra muy poco y rompería esa compatibilidad.

**El aviso de tools MCP que faltan al retomar entra en el código.** Son unas pocas líneas de `harness`, y sin él una sesión retomada llama a tools que ya no existen sin que nadie avise. El post lo menciona como mucho en una frase de «Retomar». Si el autor no lo quiere, sale en la revisión del change (tarea 1.0).

**`jq` en lugar de un subcomando** (decisión del autor). Tres consultas cortas y con nombre, escritas en el post y en el README del lab:

- **«Qué ficheros tocó»:** los `tool_use` de `Write` y `Edit`, con su ruta.
- **«Qué comandos lanzó»:** los `tool_use` de `Bash`, con el comando, y los `task` con su exit code.
- **«Quién aprobó cada acción»:** los `approval` del principal y de `agents/`, con tool, decisión, origen y regla o respuesta. Por defecto filtra `origin == "policy"`, y se enseña cómo quitar el filtro.

Más una línea para listar sesiones: `ls -t` sobre la carpeta de la clave, y el primer prompt de cada una con `jq`. Ninguna consulta pasa de una línea legible. Si alguna no cabe, se parte en dos con una variable de shell, no en un script.

**Evidencia.**

- **Entorno:** el contenedor de verificación de las partes 5 a 7 (`node:22-bookworm` con `bubblewrap` y `jq`, las mismas opciones de seguridad), con Ollama, `qwen2.5:7b` y `OLLAMA_CONTEXT_LENGTH=8192`. La versión de Ollama se registra en la tarea.
- **Workspace:** una copia de `examples/demo` con su propio git, como en la parte 6 (`cp -r examples/demo ~/tienda-demo`). Las salidas publicadas salen de rutas neutras del contenedor.
- **Demo principal: una sesión en cuatro invocaciones**, en modo `default`. Cada una es una ejecución real, sin repetir para elegir, y el post lo dice. Eran tres, con el `explore` dentro del cambio. El autor la pasó a cuatro en el apply (2026-11-26), tras siete pilotos con `qwen2.5:7b`: con el `explore` y el cambio en la misma invocación, el principal metía la tarea entera en el prompt del subagente o escribía las llamadas como JSON en el texto (0 de 5 hicieron el cambio). El `explore` solo salía en una invocación propia.
  0. **Primera invocación: solo el `explore`**, con el prompt literal de la parte 7 y «después responde con su resumen». Deja el transcript del subagente en `agents/`.
  1. **Segunda invocación,** con `--continue`: un cambio en la tienda que toque código y tests y acabe en commit. En el camino:
     - apruebas un Edit «una vez»;
     - das «siempre» a un comando Bash que pregunte;
     - rechazas algo escribiendo el motivo;
     - **cortas con Ctrl+C en una pregunta de permiso**. Con terminal, `readline` sale con 130 sin escribir el `tool_result`, que es el caso que repara `repairTranscript`. Que el corte deja el `tool_use` sin `tool_result` se comprueba en el JSONL antes de retomar (tarea 1.6), porque un corte por `SIGINT` sin terminal escribe `INTERRUPTED` y no ejercita la reparación. El corte es provocado y el post lo dice.

     La tarea 1.6 elige qué comando pide el «siempre» y comprueba que corre dentro del sandbox. Puede ser los tests con `vitest` si funcionan sin red, u otro comando que pregunte.
  2. **Tercera invocación:** `--continue "sigue…"`. Se verifica en la salida y en el JSONL:
     - la reparación;
     - el Edit que exige releer;
     - el comando del «siempre», que vuelve a preguntar;
     - un `meta` nuevo.
  3. **Cuarta invocación:** `--continue --fork-session` con una alternativa. Se verifica que la original no cambia (mismo número de líneas) y que la copia lleva `forkedFrom`. El fork copia la conversación, no el disco: si la alternativa edita, edita los mismos ficheros, y el post lo dice.
- **Demo de compactación:** una ejecución aparte con `--context-window 4096`, como en el README. Enseña con `jq` que los mensajes anteriores al registro `compact` siguen en el fichero.
- **Consultas `jq`** sobre la sesión de la demo principal y su `agents/`, con su salida publicada.
- **La cifra** (decisión del autor), solo de esa sesión:
  - **el fichero:** registros totales (principal más `agents/`), bytes y tokens estimados con `estimateText`;
  - **lo que carga retomar:** los mensajes que devuelve `readMessages`, sus tokens estimados con `estimateMessages` y los tokens de entrada reales de la primera petición tras retomar, del `usage` de Ollama.

  Las estimaciones se declaran como tales. No se afirma nada fuera de esa sesión.
- **Tests deterministas** con `FakeProvider`, para que `npm test` no dependa de Ollama:
  - cada origen deja su `approval`: regla de settings, de flag y de sesión; `bypass`, `acceptEdits` y `plan`; el perímetro; `user` con «una vez», «siempre» y «no» con motivo; y `hook`;
  - el caso del paralelo;
  - que todo `tool_use` con decisión deja un `approval`;
  - que `readMessages` pasa por alto `approval` y `task`;
  - la reparación del corte;
  - `--continue` y `--resume` por prefijo, y `--fork-session`;
  - la clave del workspace;
  - el `deny` integrado de escritura en `bypass`, y que la ruta está entre las ocultas del sandbox;
  - el transcript de un subagente con `parentSessionId` y su `approval` en `agents/`.
- **Si una demo no enseña lo que tiene que enseñar** (por ejemplo, el modelo no relee porque no intenta editar), se registra tal cual. Se pregunta al autor antes de repetirla o de cambiar el prompt.

**Estructura del post.**

1. **Apertura,** sin encabezado. Un escenario ilustrativo, declarado como tal: una tarea que no cabe en una sesión, un «sigue con lo de ayer» que no sabe nada y un `git diff` con un cambio que no sabes quién pidió ni si aprobaste. Después la tesis en negrita y el enlace a la parte 7.
2. **Prerrequisitos y clonado:** lo de la parte 7 más `jq`, la referencia a WSL2 y `git clone --branch parte-8`.
3. **Cada pregunta empieza de cero:** las dos necesidades, y por qué git no basta.
4. **Un fichero, dos lecturas:** el modelo mental y el diagrama.
5. **El transcript:**
   - JSONL al que solo se añade, que no existe hasta el primer mensaje y que salta la línea truncada;
   - la compactación añade un registro y no borra nada;
   - los transcripts de los subagentes;
   - los registros `task`.
6. **Retomar:**
   - `--continue` y `--resume`;
   - la reparación del corte;
   - `--fork-session`;
   - el ejemplo de la segunda y la tercera invocación.
7. **Lo que no se restaura, a propósito.** La bisagra del post. Las cuatro ausencias (modo, «siempre», registro de lecturas, y modelo y ventana) y el contraargumento de la fricción, con su respuesta.
8. **Quién decidió cada acción:** el registro `approval`, sus orígenes, el caso del paralelo, y que es algo que el lab tiene antes que `harness`.
9. **Leer lo que pasó:** las consultas `jq`, la demo de compactación y la cifra.
10. **Lo que cuesta guardarlo todo:**
    - el transcript contiene todo lo leído, incluido lo leído fuera del workspace;
    - por eso vive fuera del workspace y el agente no puede escribirlo, con lo que dejaría de verse si estuviera dentro;
    - crece sin límite;
    - no está protegido contra manipulación: es para ti.
11. **Lo que falta y lo esencial.** En «Lo que falta»:
    - el replay y las evals, en una serie propia;
    - `/resume`, `/sessions`, `/fork n`, `/tasks` y `restoreFinished`, en la parte 9;
    - borrar o rotar sesiones;
    - que `harness` aún no tiene `approval` ni la ubicación protegida.

**Diagrama.** Va en JSX con estilos en línea, las variables del sitio y `aria-label`, como en las partes 3 a 7, y se revisa a 390 y 1440 px.

- **Contenido:** la secuencia de registros de una sesión (`meta`, `message`, `approval`, `compact`, `subagent` → `agents/`, `task`, otro `meta`) con dos lecturas encima. «Retomar» cubre desde el último `compact`, solo los `message`. «Trazabilidad» cubre todo.
- **Resaltado:** lo que solo ve la segunda lectura.
- **Datos:** si lleva cifras, son las de la demo principal.

**Reglas de la serie:**

- listas de una línea por punto, sin sublistas;
- comandos para Linux con la referencia a WSL2;
- ni productos comerciales, ni ángulo corporativo, ni justificar la ejecución en local;
- extractos y enlaces siempre contra el tag `parte-8`.

«Trazabilidad» se usa en el sentido de saber qué hiciste, nunca en el de auditoría o cumplimiento.

**Tamaño y orden de recorte.** El objetivo son ~29 a 32 KB, como las partes 4 a 7. Si se pasa, se recorta en este orden:

1. Los extractos largos pasan a enlaces al tag.
2. La demo de compactación queda en una frase con enlace a su salida.
3. El detalle de `--fork-session`.

Nunca se recortan las cuatro ausencias, el registro `approval`, las tres consultas ni la cifra.

**Imagen destacada.** Se pregunta al autor en el apply. Si la aporta, se convierte con `sharp` a WebP 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás, porque es también el `og:image`. Si no, se usa el placeholder de marca.

**Serie y configuración** (grupo 3 de `tasks.md`):

- **El yaml de la serie:** el título y el resumen de la parte 8 dejan de nombrar evals y replay. El resumen de la parte 9 suma `/resume`, `/sessions`, `/fork n`, `/tasks` y `restoreFinished`.
- **`openspec/config.yaml`, entrada de la serie:**
  - el post 8, su change y el tag `parte-8`;
  - la frase de convergencia: el lab puede adelantarse a `harness` y, al acabar la serie, será su primera versión GA;
  - las diferencias del lab pendientes de llevar a `harness`: `approval`, `meta.contextWindow`, la ubicación de las sesiones y su protección, y el agujero de perímetro que tiene hoy `harness`;
  - `restoreFinished` y `/tasks` pasan a la parte 9;
  - el «replay ejecutando las herramientas» pasa a la serie de evaluación.
- **`openspec/config.yaml`, entrada nueva de trabajo futuro: la serie de evaluación.** Lleva:
  - el replay, en modo stub y en modo exec, apoyado en `approval`;
  - las evals de `harness` (`evals/`), que tienen que llegar al lab antes del último tag;
  - la decisión pendiente de si la serie absorbe el post de golden sets ya publicado y las entradas de «quién evalúa al evaluador», SkillEvaluator y elegir modelo.

**Ramas y tag.**

- **En este repositorio:** `feat/add-sessions-traceability-post`.
- **En el lab:**
  - una rama desde `origin/main` (`f4b7241`, tag `parte-7`) con la parte 8 completa: código, tests, README, documentación y `examples/salidas`;
  - una PR que integra el autor;
  - el tag `parte-8` se crea sobre `main` tras ese merge;
  - los tags `parte-2` a `parte-7` no se tocan;
  - la versión sube a 0.7.0, como en partes anteriores.

## Risks / Trade-offs

- **[El sandbox de Bash se crea antes de que exista `~/.harness/sessions`]** → `bwrap` solo tapa las rutas ocultas que existen (`filter(existsSync)`), y la sesión de Bash puede arrancar antes del primer mensaje. Mitigación: crear el directorio raíz de sesiones al arrancar, antes de construir el sandbox. El fichero de la sesión sigue sin crearse hasta el primer mensaje. Lo cubre un test.
- **[La deny integrada no cubre una vía de escritura]** (un comando opaco de Bash, un servidor MCP) → Fuera del workspace, el sandbox ya no deja escribir. La deny integrada cubre Write, Edit y las redirecciones, y la ruta oculta tapa Bash y MCP. Con `--sandbox none`, Bash podría escribir. El post lo dice en «Lo que cuesta».
- **[La clave del workspace cambia si mueves el proyecto]** → `--continue` deja de encontrar las sesiones anteriores, aunque los ficheros siguen en `~/.harness/sessions`. Aceptado. El post lo dice en una frase y el `meta` guarda la ruta original.
- **[El modelo no hace lo que la demo necesita]** (no delega, no intenta editar tras retomar) → Se registra tal cual y se pregunta al autor antes de repetir o cambiar el prompt. Las garantías no dependen de la demo: las cubren los tests.
- **[El comando del «siempre» no corre en el sandbox]** (por ejemplo, `vitest` sin red ni `node_modules` en la copia) → La tarea 1.6 elige un comando que pregunte y funcione, y lo prueba antes de la demo.
- **[Datos privados en las salidas]** → El transcript contiene rutas absolutas y todo lo leído. Mitigación: contenedor con rutas neutras y el escaneo de la tarea 1.10.
- **[Los tests de `bash.test.ts` que ya fallan en el contenedor arm64]** → Se registran como preexistentes, como en las partes 6 y 7.
- **[Diferencias lab/harness]** → Se listan y justifican al final del grupo 1: lo que el lab adelanta (`approval`, `meta.contextWindow`, la ubicación y la protección, y la reparación escrita) y lo que no trae (`restoreFinished`, `summarizeSession` y el menú de `/resume`).
- **[Tamaño del post]** → Mitigación: el orden de recorte de Decisions.

## Migration Plan

- **Post:** `git revert` del commit en `me-profile`, o fijar `draft: true`.
- **Lab:** el tag `parte-8` y su código quedan publicados de forma independiente. Si hay que retirarlos, decide el autor.
- **Sesiones del lector:** las sesiones que el lab cree en su máquina quedan en `~/.harness/sessions`, y se borran con `rm -r`. El post lo dice.
- **`harness`:** no cambia.

## Open Questions

- **Slug** (tarea 2.1). Propuesta: `guardar-no-es-restaurar`.
- **Tags del post** (tarea 2.2). Propuesta: `harness`, `sesiones`, `trazabilidad`, `llm-local` y `ollama`.
- **La tarea concreta de la tienda y el texto del prompt de la demo principal** (tarea 1.6), dentro de lo que fija Evidencia.
- **Si el post menciona el aviso de tools MCP que faltan** (tarea 2.2): una frase o nada.
