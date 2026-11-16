# Tasks

## 1. `lab-harness-local` (fuera de este repositorio)

- [x] 1.0 Fijar y registrar el commit de `/Users/pw-pmelero/workspaces/personal/harness` (esperado `4aa8262`) y listar los ficheros de `harness` que necesita el post (skills, hooks, MCP stdio, reglas `mcp__*` y lo que requieran para funcionar; `ToolSearch` solo si 1.4 lo exige). Verificar al final del grupo 1, con `git diff --stat origin/main..HEAD`, que no entra nada de partes posteriores (`agents/`, `session/`, `tui/`, `ui/`, `providers/anthropic.ts`, `mcp/oauth.ts`, el transporte HTTP, resources, prompts)
  - Cierre (2026-11-16, lab en `495c014`, 6 commits sobre `origin/main`). `git diff --stat origin/main..HEAD` toca 30 ficheros, con 3.233 inserciones y 35 borrados: los de la lista de abajo, sus tests (`skills`, `hooks`, `mcp`, `demo-hook` y el fixture `mcp-server.mjs`), `src/core/events.ts` (evento `hook_blocked`, de 1.8), `src/version.ts`, `package.json`, `package-lock.json` (el SDK de MCP), los README, la demo y las dos salidas. `grep -E "agents/|session/|tui/|ui/|anthropic|oauth|tool-search"` sobre los nombres no da nada. `harness` seguía en `4aa8262`, sin cambios locales.
  - Registro parcial (2026-11-16). `harness` fijado en `4aa8262` (`master`, sin cambios locales). El lab parte de `origin/main` en `dd38b6b` (tag `parte-5`).
  - Ficheros nuevos que necesita el post: `src/skills/loader.ts`, `src/tools/skill.ts`, `src/hooks/runner.ts`, `src/mcp/config.ts` (sin capas de usuario ni `settings.local.json`, sin HTTP ni OAuth), `src/mcp/manager.ts` (sin HTTP, OAuth, login, resources, prompts, `list_changed` ni reconexión) y `src/tools/mcp.ts` (sin `ListMcpResources`, `ReadMcpResource` ni `replayMcpTools`).
  - Compartidos, solo en lo que exige la parte 6:
    - `src/policy/rules.ts`: `parseRule` con `*` en nombres `mcp__` y `matchMcpRule`.
    - `src/policy/engine.ts`: `PermissionTarget` `mcp` y `evaluateMcp`, sin la rama `plan`.
    - `src/policy/settings.ts`: bloque `hooks`.
    - `src/tools/types.ts`: `jsonSchema` en `Tool` y `toolSpec`, y el target `mcp`.
    - `src/core/loop.ts`: Pre antes de los permisos y Post tras ejecutar.
    - `src/index.ts`: cableado, catálogo en el system prompt y avisos.
    - `src/cli.ts`: cabecera.
  - Tests de `harness` de referencia: `test/skills.test.ts`, `test/hooks.test.ts`, `test/mcp-config.test.ts`, `test/mcp-manager.test.ts`, `test/mcp-tools.test.ts`, `test/mcp-policy.test.ts` y `test/fixtures/mcp-server.mjs`.
  - Fuera: `mcp/oauth.ts`, `test/mcp-oauth.test.ts`, `test/mcp-m3.test.ts` (resources, prompts, carga diferida y sandbox opcional) y `test/mcp-ui.test.ts`. `ToolSearch` queda pendiente de 1.4 (resuelto en 1.4: no entra).
- [x] 1.1 Crear una rama desde `origin/main` (`dd38b6b`, tag `parte-5`) y derivar de `harness` las skills (`src/skills/loader.ts` y `src/tools/skill.ts`, solo con raíces de proyecto `.harness/skills`, sin `.claude/skills`), con el catálogo `<available_skills>` en el system prompt. Verificar con tests deterministas: carga, descripción limitada a 250 caracteres, nombre no válido ignorado con aviso, `disable-model-invocation` fuera del catálogo y referencia en lugar del cuerpo si ya está cargada
  - Registro (2026-11-16): rama `feat/add-extensibility` en `lab-harness-local` desde `origin/main` (`dd38b6b`), commit `aaa2413`.
    - `src/tools/skill.ts` copiado de `harness` sin cambios.
    - `src/skills/loader.ts` copiado con un solo recorte: `skillRoots` devuelve solo `<workspace>/.harness/skills`, sin las de usuario ni `.claude/skills`. Los comentarios que hablaban de `/nombre` se ajustaron, porque el lab no tiene REPL.
    - En `createHarness`: el catálogo es una `SystemPart` más, detrás de las instrucciones del proyecto; la tool `Skill` solo se registra si hay alguna invocable; `Harness.skills` es nuevo.
    - `test/skills.test.ts`, 13 tests: frontmatter, carga desde `.harness/skills` con nombre de carpeta, inválidas con aviso, `$ARGUMENTS`, catálogo recortado a 249 caracteres más `…` y sin las no invocables, `loadedSkills`, skill desconocida rechazada antes de pedir permisos, lectura del `SKILL.md` en `allow` y, con `FakeProvider`, catálogo en el system prompt sin el cuerpo, cuerpo en el primer `tool_result` y referencia en el segundo.
    - `npm test`: 182 pasan y 6 se saltan, sin regresiones.
- [x] 1.2 Derivar los hooks (`src/hooks/runner.ts` y su integración en el bucle: Pre antes de los permisos y Post después de ejecutar), con la clave `hooks` en `.harness/settings.json`, siempre dentro de `sandbox.wrap`, con el filtro de entorno de `Bash` y con aviso al arrancar de los hooks de proyecto. Verificar con tests sobre `FakeProvider`: el código 2 en Pre bloquea sin llegar al approver, `{"message"}` llega al `tool_result`, el timeout y otros códigos solo avisan, el `matcher` con `|` y `*` funciona y los argumentos de bwrap envuelven el comando
  - Registro (2026-11-16): commit `93a279e`.
    - `src/hooks/runner.ts` copiado de `harness` sin cambios.
    - `settings.ts`: `HookEntrySchema`, `HookConfig` y el bloque `hooks`, como en `harness`. Sin contador de hooks de proyecto, porque en el lab todos son de proyecto.
    - En `loop.ts`, `executeOne`: Pre antes de los permisos y Post tras ejecutar, con `withNotes`, igual que `harness`.
    - En `createHarness`: un `HookRunner` con el sandbox de `Bash`, `writablePaths: [workspace]`, `defaultHiddenPaths()` y la red del harness.
    - La CLI pasa `settings.hooks` y la cabecera lista las skills y los hooks («código del repositorio, dentro del sandbox», o «SIN sandbox» con `--sandbox none`).
    - `test/hooks.test.ts`, 17 tests: los de `harness` adaptados, más el filtro de `LAB_FAKE_TOKEN`, el `SandboxSpec` y el argv de bwrap del hook (`--ro-bind / /`, `--bind <ws> <ws>`, `--unshare-net`, `sh -c`), y que un Pre que bloquea no llama al approver.
    - `npm test`: 199 pasan y 6 se saltan.
- [x] 1.3 Derivar el cliente MCP stdio:
  - `src/mcp/config.ts`, recortado a `.mcp.json` y stdio, con `${VAR}`.
  - `src/mcp/manager.ts`, recortado a conectar, listar, llamar y cerrar.
  - `src/tools/mcp.ts`.
  - Las reglas `mcp__*` en `rules.ts` y el `PermissionTarget` `mcp`.
  - La dependencia `@modelcontextprotocol/sdk` con el rango de `harness`.

  **Diferencia deliberada**: sandbox por defecto. Todo servidor stdio corre dentro de `sandbox.wrap`, con la red del harness (`--no-network` también la corta y `network: "none"` la corta por servidor, nunca se abre). Solo `--sandbox none` lo saca, y un `.mcp.json` no puede pedirlo. Con `--sandbox bwrap` y sin bwrap, el arranque falla. Verificar:
  - Con `npm install` (vulnerabilidades registradas).
  - Con tests sobre un servidor stdio de prueba en `test/fixtures/`: herramientas `mcp__<servidor>__<tool>`, regla `deny` sobre `mcp__prueba` y comodín, servidor con variable sin definir no conectado y con aviso, argumentos de bwrap del servidor con y sin red, y un `.mcp.json` que intenta desactivar el sandbox ignorado con aviso.
  - Registro (2026-11-16): commit `022de30`.
    - **Dependencia**: `@modelcontextprotocol/sdk` `^1.32.2` (instalada la 1.32.2, la misma que `harness`); `npm install`: «found 0 vulnerabilities».
    - **`src/mcp/config.ts`** (nuevo, recortado):
      - Solo `<workspace>/.mcp.json` y solo stdio, con `${VAR}` y `${VAR:-x}` (`expandVars` idéntica a `harness`).
      - Un servidor HTTP se ignora con aviso.
      - `sandbox: false` se ignora con aviso («usa --sandbox none»).
      - `sandbox: { network: "none" }` corta la red del servidor.
      - `McpServerConfig` sin `source` ni `sandbox`, con `network?: "none"`.
    - **`src/mcp/manager.ts`** (recortado): `connectAll`, `servers`, `tools`, `callTool`, `dispose`, `onclose` que lo marca `failed` y la cola de stderr. **Diferencia deliberada**: `transport` envuelve siempre con `sandbox.wrap` (workspace y `os.tmpdir()` escribibles, `defaultHiddenPaths()`, red `none` si la del harness o la del servidor lo es), y `McpServerState.sandbox` dice con cuál se lanzó.
    - **`src/tools/mcp.ts`**: `mcpToolName`, `mcpServerOf`, `createMcpTools` (sobre `tools()`, sin resources), `createMcpTool` y `mcpResultText`, idénticos a `harness`.
    - **Compartidos**:
      - `types.ts`: `jsonSchema` y el target `mcp`.
      - `rules.ts`: `parseRule` con `*` solo en `mcp__` y `matchMcpRule` (idéntica).
      - `engine.ts`: `evaluateMcp` sin la rama `plan`.
      - `index.ts`: carga, conecta, avisa de los que fallan, registra las tools detrás de `Skill`, `Harness.mcp`, `HarnessOptions.mcp: false` y `dispose`.
      - `cli.ts`: una línea por servidor en la cabecera, con comando, número de tools y sandbox.
    - **`test/mcp.test.ts`**: 23 tests, de los que 22 pasan en macOS y se salta el de bwrap real. Cubren:
      - Configuración (variables, `sandbox: false`, red, HTTP, nombres, JSON roto).
      - Manager (env mínimo sin el nuestro, cwd, `isError`, servidor que no arranca, proceso que muere).
      - El `SandboxSpec` y el argv de bwrap del servidor, con y sin red.
      - La prueba real con seatbelt: escribe en el workspace y fuera da `EPERM`.
      - Nombres y resultado, y permisos: `ask` por defecto, `allow` por servidor, exacto y comodín, `deny` que gana también en `bypass`, y `Ba*sh` inválido.
      - `createHarness` con `.mcp.json`: el schema del servidor llega al modelo, el token llega al servidor por su `env` y `Bash` no lo ve (`[]`).
    - **`npm test`**: 221 pasan y 7 se saltan.
    - **Prueba de la CLI** con Ollama: la cabecera muestra `skills: saludo`, el hook y `mcp: fake (…) 6 tools, sandbox seatbelt`.
- [x] 1.4 Montar el entorno de verificación de la parte 5 (contenedor `node:22-bookworm` con `bubblewrap` y `--security-opt seccomp=unconfined --security-opt systempaths=unconfined`), descargar el binario de Linux de `github-mcp-server` de un release fijado y probarlo a mano. Registrar:
  - Versión del binario, comando de descarga tal como irá en el post, opciones de toolsets y de solo lectura según su `--help`, y nombres reales de las herramientas de issues.
  - Si arranca dentro de bwrap, con red, a través del lab. Si necesita alguna ruta extra, cuál y por qué.
  - Medida de `prompt_tokens` de una petición con y sin sus schemas, a 4.096 tokens. **Decisión de `ToolSearch`:** entra solo si los schemas superan el 10 % de la ventana (410 tokens).

  Si el binario no funciona en bwrap de ninguna manera, parar y preguntar al autor (pregunta y respuesta literales). Rollback: borrar el contenedor
  - Registro (2026-11-16).
    - **Entorno**: Docker Desktop, contexto `desktop-linux`, linux/arm64 (`uname -m`: `aarch64`). Imagen `lab-harness-bwrap` desde `node:22-bookworm` (Debian 12.15, Node 22.23.5) con `bubblewrap` 0.8.0, `ripgrep`, `curl`, `git` y el usuario sin privilegios `lector`; Dockerfile en el scratchpad, no versionado. Con `--security-opt seccomp=unconfined --security-opt systempaths=unconfined`, la sonda `bwrap --ro-bind / / --unshare-pid -- true` da `probe=0`.
    - **Binario**: `github-mcp-server` v2.1.0 (publicado el 2026-11-03, commit `4bcdcdf`), fijado en el post. El release trae `github-mcp-server_Linux_{x86_64,arm64,i386}.tar.gz`. `uname -m` da `aarch64` en ARM, así que el comando del post traduce el nombre. Comando, ejecutado tal cual en el contenedor:

      ```
      VERSION=v2.1.0
      ARCH=$(uname -m); [ "$ARCH" = aarch64 ] && ARCH=arm64
      mkdir -p ~/.local/bin
      curl -fsSL "https://github.com/github/github-mcp-server/releases/download/${VERSION}/github-mcp-server_Linux_${ARCH}.tar.gz" | tar -xz -C ~/.local/bin github-mcp-server
      ```

      `github-mcp-server --version` da `Version: 2.1.0`.
    - **Opciones de `stdio --help`**: `--toolsets` (incluye `issues`), `--tools` (tools concretas), `--read-only` y `--exclude-tools`. Esta versión también trae OAuth (`--oauth-client-id`), que queda fuera de la serie.
    - **Tools de issues**:
      - Con `--toolsets=issues --read-only`: `get_label`, `issue_read`, `list_issue_fields`, `list_issue_types`, `list_issues` y `search_issues`.
      - Sin `--read-only` se añaden `add_issue_comment`, `issue_write`, `sub_issue_write` y `update_issue_comment`.
    - **Dentro de bwrap, a través del lab**: `McpManager` con `bwrapSandbox`, `defaultHiddenPaths()` y red `host` lo deja `connected` (`serverInfo` `github-mcp-server` 2.1.0) sin rutas extra. Sin token también arranca y lista. La lectura real de una issue con token queda para 1.6.
    - **Medida** a 4.096 tokens, con `prompt_tokens` de Ollama 0.40.16 (`qwen2.5:7b`, servidor aparte en `127.0.0.1:11435` con `OLLAMA_CONTEXT_LENGTH=4096`). Una petición del lab con `hola`, con y sin los schemas tal como los genera `createMcpTools` + `toolSpec`, con un script no versionado en el scratchpad:

      | Configuración | Tools | Bytes de schema | Tokens | % de la ventana |
      | --- | --- | --- | --- | --- |
      | Base del lab, sin MCP | — | — | 1.665 | 41 % |
      | `--toolsets=issues --read-only` | 6 | 7.480 | +1.576 | 38 % |
      | `--tools=issue_read --read-only` | 1 | 1.395 | +305 | 7,4 % |
      | `--toolsets=issues` | 10 | 14.649 | +385 informados | no es real |

      La última fila no cabe: 1.665 + unos 3.700 superan la ventana, y Ollama informa 2.050 porque recorta en silencio (el mismo fenómeno de la parte 3).
    - **Decisión del autor sobre `ToolSearch`.** Pregunta literal: «Medí con Ollama a 4.096 tokens: la petición base del lab ya ocupa 1.665 tokens (41 %). github-mcp-server con --toolsets=issues --read-only (6 tools) añade 1.576 (38 %). Sin --read-only (10 tools) ni siquiera cabe: Ollama recorta en silencio, como en la parte 3. Limitado a una tool (--tools=issue_read --read-only) añade 305 (7,4 %). La regla acordada metía ToolSearch si el toolset de issues superaba el 10 %, y lo supera. ¿Qué hacemos?». Respuesta literal: «Una sola tool (Recomendado)». Sustituye a la regla: el servidor se configura con `--tools=issue_read --read-only`, `ToolSearch` no entra (1.5 no aplica) y las cifras del toolset completo van al resumen de contexto («conecta solo lo que usas»). `design.md` actualizado.
    - **Decisiones del autor para 1.6 a 1.8**, en la misma pregunta:
      - Token: «Token de gh de pmeleroa». Se usa `gh auth token --user pmeleroa` solo en el contenedor local, nunca en el repositorio ni en las salidas. El post sigue pidiendo al lector un token *fine-grained* de solo lectura.
      - Issue: «La creo yo con gh (Recomendado)». La pregunta proponía el título «El total del carrito no redondea a céntimos», pero daba una cifra equivocada («108,98…»). La correcta, comprobada con `node`, es `total()` con 3 × 33,33 = 120,9879, que redondeada da 120,99. La issue lleva la correcta, y se le dijo al autor.
      - Ejecuciones: «10 (Recomendado)».
    - **Hallazgo previo, fuera de alcance.** En el contenedor, `npm test` da 219 pasan, 2 fallan y 7 se saltan. Los 2 fallos son de `test/bash.test.ts` («KillShell mata al comando y a sus nietos, sin notificación» y «al salir bash se mata lo que quede en su grupo», timeout de 5 s), y fallan igual en un clon limpio del tag `parte-5`, así que no vienen de la parte 6. Los tests reales de bwrap (`sandbox.test.ts` y el nuevo de `mcp.test.ts`) pasan. Se le comunica al autor; no se arregla en este change.
- [x] 1.5 Solo si 1.4 lo exige: derivar `src/tools/tool-search.ts` y la carga diferida del registro, con la regla `auto` del 10 %. Verificar con tests (los nombres diferidos están en la descripción, `select:` activa los schemas desde la siguiente petición). Si no entra, registrar la medida que lo justifica
  - Registro (2026-11-16): no entra. Con `--tools=issue_read --read-only` los schemas añaden 305 tokens, el 7,4 % de 4.096 y por debajo del 10 % (tarea 1.4), y el autor eligió una sola tool sin `ToolSearch`. No se deriva `tool-search.ts`.
- [x] 1.6 Preparar el ejemplo en `examples/demo`:
  - La skill `.harness/skills/convencion-commits/SKILL.md`.
  - El hook `PreToolUse` (`node .harness/hooks/check-commit.mjs`, `matcher: "Bash"`).
  - `.mcp.json` con `github-mcp-server` y `${GITHUB_PERSONAL_ACCESS_TOKEN}`, sin el token escrito.
  - Decidir y registrar si `examples/demo` es un repositorio git anidado para el commit.

  Verificar a mano, sin modelo:
  - El hook sale con 2 y motivo ante `git commit -m "arreglos"` y con 0 ante un mensaje válido.
  - `printenv GITHUB_PERSONAL_ACCESS_TOKEN` en un `Bash` aprobado no devuelve nada.
  - El servidor MCP lee una issue pública.
  - Registro (2026-11-16): commit `5b3b967`.
    - **Skill**: `examples/demo/.harness/skills/convencion-commits/SKILL.md`, con una description de 104 caracteres («Convención de los mensajes de commit de este proyecto. Cárgala antes de hacer cualquier git commit.»). La convención es `<tipo>(<ámbito>): <descripción> (#<issue>)`, como mucho 72 caracteres, con `git add` de lo cambiado y `git commit -m`.
    - **Hook**: `examples/demo/.harness/hooks/check-commit.mjs` (Node, sin `jq`), declarado en `.harness/settings.json` como `PreToolUse` con `matcher: "Bash"`. Se conservan los `deny` de la parte 4: el `Edit(.harness/**)` impide que el agente modifique su propio hook o su skill.
      - Comprueba el tipo, el ámbito opcional, minúsculas, que no haya punto final y los 72 caracteres.
      - **No comprueba `(#N)`**, porque el hook no sabe si el cambio resuelve una issue. Referenciarla depende de la skill, y la tabla de 1.8 lo distingue.
      - Acepta `-m` y `-am`; sin `-m`, bloquea.
    - **MCP**: `examples/demo/.mcp.json` con `github`, `command: "${HOME}/.local/bin/github-mcp-server"`, `args: ["stdio", "--tools=issue_read", "--read-only"]` y `env.GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}"`, sin el token escrito.
    - **Decisión sobre git**: la demo **no** usa `examples/demo` dentro del clon, sino una copia con su propio repositorio (`cp -r examples/demo ~/tienda-demo`, `git init`, commit inicial). Motivo, reproducido en el contenedor con `createHarness`, `bypass` y bwrap:
      - Con el workspace en `examples/demo`, el `.git` del clon queda fuera del workspace y el sandbox lo deja en solo lectura: `fatal: Unable to create '/home/lector/lab/.git/index.lock': Read-only file system` (código 128).
      - Con la copia, `git commit` funciona (`6fee4ae fix(cart): prueba (#4)`).

      Es un punto para el post: el sandbox de la parte 5 también decide dónde puede hacer commit el agente.
    - **Verificación a mano, sin modelo**:
      - **Hook, con `node` directo**: `arreglos`, `Fix: algo`, `fix(cart): Redondea el total`, `fix: redondea.` y `git commit` sin `-m` salen con 2 y su motivo; `fix(cart): redondea el total a céntimos (#4)`, `feat: añade algo` y `-am` salen con 0; `git status` y la tool `Read`, con 0. `test/demo-hook.test.ts` lo fija con 10 tests.
      - **En el contenedor, con `createHarness`, un `FakeProvider` y `bypass`, sobre `examples/demo`**:
        - Sin token, el servidor se ignora («variables sin definir») y `mcp__github__issue_read` no existe.
        - Con el token de `pmeleroa` solo en el entorno del proceso: `mcp: github connected bwrap issue_read`, y `issue_read` devuelve la issue #4 (`{"number":4,"title":"El total del carrito no redondea a céntimos",…}`).
        - El `Bash` aprobado con `printf "[%s]" "$GITHUB_PERSONAL_ACCESS_TOKEN"` devuelve `[]`.
        - `git commit -m "arreglos"` vuelve como `Blocked by PreToolUse hook (node .harness/hooks/check-commit.mjs): Commit bloqueado por la convención del proyecto: «arreglos» no empieza por un tipo válido…`. El hook se ejecutó dentro de bwrap.
    - **`npm test`**: 231 pasan y 7 se saltan.
- [x] 1.7 Issues ilustrativas en `pmeleroa/lab-harness-local`: preguntar al autor si las crea él o se crean con su confirmación, con texto y número, y registrar pregunta y respuesta literales. No crear nada sin esa confirmación. Verificar con `gh issue view <N> --repo pmeleroa/lab-harness-local` (con la cuenta `pmeleroa`)
  - Registro (2026-11-16). La confirmación está en 1.4: pregunta literal «La tarea necesita una issue real en pmeleroa/lab-harness-local. Propuesta: «El total del carrito no redondea a céntimos». total() con 3 × 33,33 devuelve 108,98…; debería redondear a 2 decimales. Es un arreglo pequeño en examples/demo/src/cart.ts. ¿Quién la crea?»; respuesta literal «La creo yo con gh (Recomendado)». La cifra de la pregunta estaba mal y se corrigió en la issue (120,9879 → 120,99).
    - Creada con `GH_TOKEN=$(gh auth token --user pmeleroa) gh issue create`, porque la cuenta activa de `gh` era la del trabajo: https://github.com/pmeleroa/lab-harness-local/issues/4, «El total del carrito no redondea a céntimos». El cuerpo da el ejemplo `total([{ name: "taza", price: 33.33, quantity: 3 }]); // 120.9879`, lo esperado (`120.99`) y la nota de que es ilustrativa y no se cierra desde el agente.
    - Verificado con `issue_read` desde el lab (1.6), que devuelve `number: 4` y ese título.
- [x] 1.8 Verlo actuar: cerrar con el autor el número de ejecuciones (punto de partida, 10) y ejecutar la tarea «arregla la issue N y haz commit» con `qwen2.5:7b` y el servidor de Ollama a 4.096 tokens, en el contenedor, con los comandos tal como irán en el post. Registrar por ejecución: si leyó la issue por MCP, si cargó la skill, si el hook bloqueó y el modelo corrigió, y si el commit final es válido y referencia la issue. Guardar las salidas en `examples/salidas/` y publicar el resultado tal como salga. Si ninguna ejecución termina, preguntar al autor antes de cambiar nada
  - Registro (2026-11-16). Número de ejecuciones: «10 (Recomendado)» (decisión del autor en 1.4). Contenedor de 1.4, `qwen2.5:7b`, Ollama 0.40.16 en `127.0.0.1:11435`, alcanzado desde el contenedor con `OPENAI_BASE_URL=http://host.docker.internal:11435/v1`. Token de `pmeleroa` solo en el entorno de `docker exec`. Cada ejecución parte de una copia nueva (`cp -r examples/demo ~/tienda-demo`, `git init` y commit inicial; ver 1.6) con `--permission-mode acceptEdits --allow "mcp__github__issue_read" --allow "Bash(git add *)" --allow "Bash(git commit *)"` y `< /dev/null`.
    - **Pilotos antes de la serie**, sin seleccionar ejecuciones:
      - **Piloto 1** (4.096, prompt «Arregla la issue 4 del repositorio pmeleroa/lab-harness-local y haz commit.»): carga la skill, busca la issue con Grep e intenta `git clone`, que se deniega. No usa MCP.
      - **Piloto 2** (4.096, prompt que nombra la herramienta): compacta en cada turno, porque el arranque (55 %) más la skill pasan de `compactAt`. Carga la skill 21 veces en total y acaba en `max_turns`.
      - **Decisiones del autor** tras los pilotos. Pregunta literal 1: «A 4.096 tokens la tarea no cabe. El lab arranca al 55 % con la skill y la tool de GitHub. Al cargar la skill pasa del umbral de compactación (2.611 de 3.072 útiles) y compacta en cada turno: el modelo pierde la skill, la recarga, y así 21 veces hasta agotar los 25 turnos (piloto 2). ¿Cómo hago las 10 ejecuciones?» → «Subir a 8.192 (Recomendado)». Pregunta literal 2: «En el piloto 1, con el prompt «Arregla la issue 4 del repositorio pmeleroa/lab-harness-local y haz commit.», el modelo no usó la tool de GitHub: buscó con Grep e intentó clonar. En el piloto 2, con «Lee la issue 4 de pmeleroa/lab-harness-local con la herramienta de GitHub, arréglala en este proyecto y haz commit.», sí la usó. ¿Qué prompt va en las 10 ejecuciones?» → «El que nombra la tool (Recomendado)». El servidor del 11435 se reinició con `OLLAMA_CONTEXT_LENGTH=8192` (`/api/ps`: `context_length` 8192); el del puerto por defecto no se tocó.
      - **Piloto 3** (8.192): ya no compacta (27 %). Tras la skill, el modelo escribe la llamada a la tool como texto y termina.
    - **Primera serie de 10, descartada.** Mientras se analizaba la demo del hook apareció que la CLI no enseñaba los bloqueos de `PreToolUse`: el bucle devuelve el resultado antes de `tool_start`, igual que `harness`. La columna del hook no era fiable. Se añadió el evento `hook_blocked`, que la CLI pinta como `x bloqueado por un hook: …` (commit `c3aa746`, con test), y se repitió la serie entera. Datos de la serie descartada, para el registro: skill 10/10, MCP 9/10, ediciones 5/10, commits 2/10 (`fix(pricing): redondea el total a céntimos (#4)` y `fix(cart): round total to cents`) y 0 bloqueos visibles.
    - **Serie válida** (10 ejecuciones con la CLI de `c3aa746`, 13:19 a 13:23 hora del contenedor). Ninguna pasó del 48 % de la ventana.

      | # | Skill | Issue por MCP | Editó `src/cart.ts` | Hook bloqueó | Commit |
      | --- | --- | --- | --- | --- | --- |
      | 01 | sí | no (buscó con Grep) | no | no | no |
      | 02 | sí | sí | sí | no | no |
      | 03 | sí | sí | sí | no | no |
      | 04 | sí | sí | sí (un `Write` que reescribe el fichero) | no | `fix(cart): redondea el total a céntimos (#4)` |
      | 05 | sí | sí | no | no | no |
      | 06 | no | sí | no | no | no |
      | 07 | no | sí | sí | no | no |
      | 08 | sí | no (Grep y Glob) | no | no | no |
      | 09 | no | sí | sí | no | no |
      | 10 | sí | sí | no | no | no |

      Totales: skill 7/10, MCP 8/10, editó 5/10, commit 1/10 y bloqueos del hook 0/10.
      - El único commit cumple la convención y referencia `#4`, pero el `Write` dejó `src/cart.ts` sin compilar (importa `./utils`, que no existe). El hook garantiza el mensaje, no el contenido.
      - Las 9 ejecuciones sin commit terminan con `end_turn`: 3 preguntan si siguen (05, 06, 09), 3 dejan el siguiente paso escrito como texto o JSON (03, 07, 10), 2 buscan la issue en el disco y no la encuentran (01, 08), y 1 afirma haber hecho el commit sin hacerlo (02).
      - `grep -c "bloqueado por un hook"` da 0 en las 10.
    - **Demo aparte del hook.** Decisión del autor. Pregunta literal: «En las 10 ejecuciones, el hook no bloqueó nada: los 2 commits ya cumplían el formato. ¿Cómo enseñamos en el post que el hook garantiza?» → «Demo aparte (Recomendado)». El cambio ya estaba hecho en `src/cart.ts` y se pedía un mensaje que incumple la convención, 3 ejecuciones por variante, todas registradas:
      - Con la skill y «Haz commit del cambio de src/cart.ts con el mensaje 'arreglos'.»: 3 de 3 cargan la skill, proponen `fix(cart): arreglos (#…)` y no ejecutan el commit (lo escriben en texto). CLI anterior a `c3aa746`.
      - Sin la skill y el mismo prompt: 0 de 3 intentan el commit. CLI anterior.
      - Con la skill y «Ejecuta con Bash: git add src/cart.ts && git commit -m 'arreglos'»: la skill hace que el modelo cambie el mensaje aunque se le pida el literal. Hay 2 commits (`fix(cart): arregla cálculos del carrito` y `fix(cart): arregla el archivo src/cart.ts (#1)`, con el `#1` inventado) y una ejecución sin commit. CLI anterior.
      - **Sin la skill y el comando literal, con la CLI de `c3aa746`** (la variante que se publica): en 2 de 3 el hook bloquea `arreglos` antes de pedir permiso. En una el modelo corrige con el motivo y hace commit con `fix(cart): arreglos (#12)` (el `#12` sale del ejemplo del mensaje del hook); en la otra se detiene. En la tercera el modelo no intenta el commit. En una ejecución de esta variante con la CLI anterior, el modelo escribió en `.git/COMMIT_EDITMSG` y dejó el índice corrupto (`fatal: index file corrupt`): el sandbox deja escribir en todo el workspace, incluido su `.git`, como ya dijo la parte 5.
    - **Salidas versionadas** en el lab (commit `495c014`): `examples/salidas/extensibilidad-tarea.txt` (la 04 de la serie válida) y `examples/salidas/extensibilidad-hook.txt` (la que bloquea y corrige). Se quitaron las dos líneas de cabecera de npm, las rutas pasaron a `<repo>` y `~` y no hay token. Las cifras están en `examples/salidas/README.md`.
- [x] 1.9 Cifras de contexto para el resumen final: medir con `prompt_tokens` de Ollama, en la misma petición con y sin cada pieza, el catálogo de skills, el cuerpo de la skill, los schemas MCP (de 1.4) y un mensaje de bloqueo del hook. Registrar el método y las cifras; no se escribe ninguna cifra no medida aquí
  - Registro (2026-11-16). `qwen2.5:7b` en Ollama 0.40.16, servidor aparte en `127.0.0.1:11435` (a 8.192 desde 1.8; el recuento de tokens de una petición que cabe no depende de la ventana).
    - **Método**: `createHarness` sobre dos copias de `examples/demo` (con y sin `.harness/skills`, `mcp: false`) y `buildRequest()` con el mensaje `hola`, enviado con `maxTokens: 1`. Las cifras son `prompt_tokens` (`inputTokens` + `cacheReadTokens`). Se mide la misma petición con y sin cada pieza:
      - Los schemas MCP son los de 1.4.
      - El cuerpo de la skill es `renderSkill` como `tool_result`, frente a un `tool_result` de `ok`.
      - El mensaje del hook es el bloqueo literal de 1.6, también frente a `ok`.

      Script no versionado en el scratchpad.

      | Pieza | Tokens | Cuándo |
      | --- | --- | --- |
      | Base del lab (system prompt y 8 tools) | 1.689 | siempre |
      | Catálogo de skills y tool `Skill` | +231 | siempre |
      | Tool MCP `issue_read` (`--tools=issue_read --read-only`) | +305 | siempre |
      | Arranque con las tres extensiones | 2.225 (54 % de 4.096; 27 % de 8.192) | siempre |
      | Cuerpo de la skill, al cargarla | +278 | una vez por conversación |
      | Mensaje de bloqueo del hook | +84 | solo cuando bloquea |
      | El toolset de issues de solo lectura (6 tools), en lugar de una | +1.576 | siempre (1.4) |

    - **Por qué 4.096 no basta.** Con la reserva de respuesta de 1.024, quedan 3.072 útiles, y `compactAt` 0,85 compacta al pasar de 2.611. Arranque (2.225) más skill (278) son 2.503 antes de la primera respuesta; en el piloto 2 de 1.8 se compactó en cada turno. Esta base de 1.689 es algo mayor que la de 1.4 (1.665) porque el workspace es la demo, con otras rutas en el system prompt.
- [x] 1.10 Repetir al final la comparación con `harness` de nombres de módulos, tipos, sintaxis de configuración (`hooks`, `.mcp.json`, `SKILL.md`) y reglas (`mcp__*`), solo del contenido de este post. Registrar la lista final de diferencias justificadas:
  - El sandbox por defecto de stdio.
  - Sin `.claude/skills`.
  - Sin capa de usuario.
  - Los recortes por contenido futuro.

  Verificar con `diff` de los módulos derivados
  - Registro (2026-11-16, `harness` en `4aa8262`, sin avances durante el apply; lab en `495c014`). Con `diff` real:
    - **Idénticos a `harness`**: `src/hooks/runner.ts` y `src/tools/skill.ts` (`diff` sin salida); `HookEntrySchema`, `HookEntry`, `HookEvent` y `HookConfig`; las líneas de hooks de `executeOne` (Pre antes de los permisos, `withNotes`, Post tras ejecutar); `expandVars`; `mcpToolName`, `mcpServerOf`, `createMcpTool`, `mcpResultText` y `sizeOf`; y `matchMcpRule`.
    - **Iguales a `harness`**: la sintaxis de `SKILL.md`, del bloque `hooks`, de `.mcp.json` (`mcpServers`, `command`, `args`, `env`, `${VAR}`) y de las reglas `mcp__*`, y los nombres de módulos y tipos (`Skill`, `HookRunner`, `McpManager`, `McpTool`, `McpServerEntry`).
    - **Diferencias, con su motivo:**
      1. **Sandbox por defecto para MCP stdio (deliberada).** `harness` solo aísla con `sandbox: true`; el lab, siempre, y `sandbox: false` se ignora con aviso. Queda como trabajo posterior en `harness` (3.2).
      2. **Sin capa de usuario (recorte, como en las partes 4 y 5).** Skills solo de `<workspace>/.harness/skills` y MCP solo de `<workspace>/.mcp.json`, sin `~/.harness`, `settings.local.json` ni `--mcp-config`.
      3. **Sin `.claude/skills` (recorte).** Para no nombrar otro producto en el lab.
      4. **Recortes por contenido futuro o fuera de la serie**: OAuth y HTTP (post propio), resources, prompts, `list_changed`, reconexión, `ToolSearch` (decisión de 1.4), subagentes, `replayMcpTools` y el `meta` de sesiones, `mcp.readOnly` y la rama `plan`, y `/skills`, `/mcp` y `/context`. `McpServerConfig` sin `source`; `McpServerState` con `sandbox` y sin `needsAuth`, `resources` ni `prompts`.
      5. **Adiciones de la CLI**: la cabecera lista skills, hooks (con «dentro del sandbox» o «SIN sandbox») y servidores MCP (comando, tools y sandbox), y el evento `hook_blocked` pinta los bloqueos de `PreToolUse`, que en `harness` no emiten evento en el bucle.
    - **Diferencias anteriores, sin cambios**: las de las partes 4 y 5 en `executeOne` (`approvalLock` y reevaluación).
    - **6. Arreglos tras revisión externa del lab** (deliberados, 2026-11-16, commit `e73b125`). Los dos fallos están también en `harness` y quedan como trabajo posterior allí (`openspec/config.yaml`):
      - (P1) Si el usuario cancelaba mientras corría un `PreToolUse`, `HookRunner` mataba el hook y devolvía un resultado que no bloquea, y `executeOne` seguía hacia los permisos y la tool. Un `Write` ya permitido (en `acceptEdits`) escribía tras la cancelación. Ahora, tras el hook, `if (signal.aborted) return result(INTERRUPTED, true)`.
      - (P2) La tool `Skill` decidía «ya cargada» sobre `agent.messages`, que conserva el cuerpo aunque la limpieza lo haya sustituido en la vista del modelo, así que devolvía una referencia a unas instrucciones que el modelo ya no veía. Ahora `Agent.visibleMessages` (`clearing.view(this.messages)`) es la base de `loadedSkills`.
      - Dos tests nuevos, en `hooks.test.ts` (un `Write` en `acceptEdits` con un hook `sleep 5` y cancelación a los 300 ms: el fichero no existe y el resultado es `Interrupted…`) y en `skills.test.ts` (skill, dos `Read` grandes con `keepToolResults: 1` y `clearAt: 0.1`, y la segunda invocación devuelve el cuerpo entero). Los dos fallan con el código anterior y pasan con el arreglo. `npm test`: 234 pasan y 7 se saltan. Escaneo de 1.11 sobre el commit: sin resultados. El extracto de `executeOne` del post se actualizó con las dos líneas nuevas para que siga siendo literal (se comprueba en 2.4).
- [x] 1.11 Escanear el diff de la rama en busca de datos privados (`grep` de rutas de la máquina del autor, del scratchpad, de nombres de empleador y de tokens o claves, incluido `ghp_`/`github_pat_`) y verificar autor y committer `pmeleroa`. Registrar el comando y que no hay resultados
  - Registro (2026-11-16, lab en `495c014`): `git diff origin/main..HEAD | grep -n -i -E "claude-503|scratchpad|/private/tmp/claude|pw-pmelero|cecabank|pamelero|lector@|ghp_|gho_|github_pat_|ghs_|ghu_|sk-[a-z0-9]{8}"` no da resultados (exit 1). Autor y committer de los 6 commits: `pmeleroa <p.melero.alonso@gmail.com>`. Las salidas de `examples/salidas/` se generaron con el token solo en el entorno y se comprobó que no contienen `lector` ni rutas del contenedor.
- [x] 1.12 Actualizar el README, la documentación y `examples/` del lab con la parte 6 y solo con la parte 6: prerrequisitos (binario y token), `git clone --branch parte-6`, tabla de tags con `parte-6`, sección de extensibilidad (skills, hooks, MCP stdio, sandbox por defecto y aviso sobre repositorios ajenos) y estructura. Subir la versión en `package.json`, `package-lock.json` y `src/version.ts`. Verificar con `npm test` y con los comandos del README ejecutados tal cual en el contenedor
  - Registro (2026-11-16): commit `495c014`.
    - **README**: introducción a `parte-6`; tabla de tags con `parte-6`; `github-mcp-server` y el token en los prerrequisitos; `git clone --branch parte-6`; sección «Extensibilidad» (skills, hooks, MCP stdio, el sandbox por defecto con la diferencia respecto a `harness` y el aviso sobre repositorios ajenos) con el ejemplo completo (binario, token, copia con su propio git y por qué, el run a 8.192 y la limpieza); estructura con `src/skills/`, `src/hooks/` y `src/mcp/`.
    - **`examples/salidas/README.md`**: sección «Parte 6» con las cifras de 1.8.
    - **Versión** 0.5.0 en `package.json` (también la `description`), `package-lock.json` y `src/version.ts`.
    - **Verificación en el contenedor**, desde un clon limpio de la rama (`git clone --branch feat/add-extensibility /src ~/clon`, `495c014`):
      - `npm install` y `npm test`: 230 pasan, 7 se saltan y 2 fallan; los 2 son los de `bash.test.ts` de 1.4, que ya fallaban en `parte-5`.
      - Los bloques `bash` de «El ejemplo», extraídos del README con un script y ejecutados en orden, con el token ya en el entorno en lugar del `export`: el binario se descarga (`github-mcp-server --version`: 2.1.0), la copia y el `git init` funcionan, el run termina con `end_turn` (6 llamadas; esta vez editó y describió el commit en texto, sin hacerlo) y `git log` muestra el estado inicial.
- [ ] 1.13 Pedir confirmación al autor, registrar pregunta y respuesta literales, hacer push de la rama y abrir la PR (con el credential helper de `gh` y la cuenta `pmeleroa` si git da 403). Tras el merge del autor, crear y subir el tag `parte-6` sobre `main` (confirmando antes con el autor) y verificar con `git ls-remote --tags origin parte-6`. El merge lo hace siempre el autor
  - Registro parcial (2026-11-16; **la tarea sigue abierta**: faltan el merge del autor, el tag `parte-6` y su verificación). Pregunta literal: «1.13: ¿Confirmas que haga push de la rama feat/add-extensibility (6 commits, autor pmeleroa) a pmeleroa/lab-harness-local y abra la PR contra main? El merge y la creación del tag parte-6 los haces tú (o me lo pides después del merge).». Respuesta literal: «Sí, push y PR (Recomendado)». Push con el token de `pmeleroa` solo para el comando (la cuenta activa de `gh` es la del trabajo): `* [new branch] feat/add-extensibility`. PR: https://github.com/pmeleroa/lab-harness-local/pull/5, «feat: skills, hooks y MCP (parte 6)», con lo que añade, las diferencias con `harness` y la verificación, incluidos los 2 tests de Bash que ya fallaban en `parte-5`.
  - Segunda confirmación del autor (2026-11-16), por la corrección de 2.2 en `examples/salidas/README.md`. Pregunta literal: «¿Subo a la PR #5 de pmeleroa/lab-harness-local el commit nuevo dcf83a3? Solo cambia examples/salidas/README.md: cuenta con más precisión cómo terminaron las 9 ejecuciones sin commit.». Respuesta literal: «Sí, push a la PR #5 (Recomendado)». Push `495c014..dcf83a3`; la PR queda con 7 commits y la cabeza en `dcf83a3`. Escaneo de 1.11 repetido sobre ese commit: sin resultados.
  - Tercera confirmación del autor (2026-11-16), por los arreglos de la revisión externa (1.10, punto 6). Respuesta literal a «¿Subo e73b125 a la PR #5?»: «sí, súbelo a la PR #5». Push `dcf83a3..e73b125`; la PR queda con 8 commits y la cabeza en `e73b125`.

## 2. Post

- [x] 2.1 Cerrar con el autor slug y título (propuesta: «Saber, garantizar, alcanzar: extender el harness sin tocar su código») y preguntar por la imagen destacada; registrar las respuestas. Con imagen, convertir con `sharp` a WebP 1600×900 en `public/images/blog/<slug>.webp` y verificar formato, dimensiones y peso. Sin ella, verificar el placeholder con `npm run build`
  - Registro (2026-11-16). Preguntas y respuestas literales:
    - «¿Qué título y slug usamos para la parte 6?» → «Saber, garantizar, alcanzar (Recomendado)». La opción decía: título «Saber, garantizar, alcanzar: extender el harness sin tocar su código», slug `saber-garantizar-alcanzar`.
    - «¿Aportas imagen destacada para el post de la parte 6?» → «Sin imagen por ahora». Sin imagen no hay conversión con `sharp`; el placeholder se verifica con `npm run build` en 4.1.
  - Actualización (2026-11-16): el autor aportó después la imagen destacada (mensaje literal: «esta es la imagen del post»), que sustituye a «Sin imagen por ahora».
    - **Conversión**: con `sharp`, desde un WebP de 1600×900 (153.578 bytes), a `public/images/blog/saber-garantizar-alcanzar.webp`. El resultado es WebP, 1600×900 (`fit: cover`, calidad 80) y 108.500 bytes; la de la parte 5 pesa 69.166.
    - **Frontmatter**: campo `image` añadido.
    - **Build**: `npm run build` sin errores (72 páginas). El artículo usa la portada, la tarjeta de `/blog` ya no usa el placeholder y `og:image` apunta a la imagen nueva.
    - **Q05**: se repite con la imagen al cerrar 4.2.
- [x] 2.2 Crear `src/content/blog/<slug>.mdx` con:
  - `category: "Guía"`, `series: { id: asistente-codigo-local, part: 6 }` y `draft: false` para QA real.
  - La estructura de `design.md`: cada mecanismo con capacidad, implementación y ejemplo; el contexto solo en el resumen final, corto; la frase sobre `commit-msg`; por qué no `docker run`; el párrafo del servidor remoto; y OAuth en «Lo que falta» como post propio fuera de la serie por su complejidad.
  - El diagrama en JSX con `aria-label`.

  Verificar con `npm run build` sin errores, registrar páginas y tamaño del MDX (objetivo ~29 a 32 KB, recortando en el orden de `design.md`) y revisar el diagrama a 390 y 1440 px. Rollback: `git checkout`/`git clean` del fichero
  - Registro (2026-11-16): `src/content/blog/saber-garantizar-alcanzar.mdx`, 30.091 bytes (la parte 5 tiene 29.414; no hizo falta recortar).
    - **Frontmatter**: `category: "Guía"`, `series: { id: asistente-codigo-local, part: 6 }`, `draft: false` para QA real y sin `image`.
    - **Estructura de `design.md`**: prerrequisitos y clonado; la necesidad; el diagrama; skills, hooks y MCP, cada uno con capacidad, implementación y ejemplo; dentro del sandbox, la frase sobre `commit-msg`, por qué no `docker run` y el remoto en un párrafo, con OAuth anunciado como post propio fuera de la serie; Verlo actuar, con la tabla de 10 y la demo aparte del hook; lo que cuesta en contexto, con la tabla de 1.9 y el motivo de los 8.192; el harness como producto; Lo que falta y lo esencial.
    - **Extractos**: `skillCatalog`, las líneas de hooks de `executeOne`, `transport` del manager, `.mcp.json`, `settings.json`, el `block` del hook, el frontmatter de la skill y las salidas.
    - **Correcciones tras comprobar los registros**: la skill se cargó 21 veces en total en el piloto 2; las 9 sin commit terminan de cuatro formas distintas, y no todas «anunciando en texto»; se quitaron dos generalizaciones sin fuente sobre «los harness maduros»; y la cifra de 1.576 y el recorte se refieren a 4.096. Lo mismo se corrigió en `tasks.md` y en `examples/salidas/README.md` del lab (commit `dcf83a3`, local).
    - **`npm run build`** sin errores (72 páginas).
    - **Diagrama**: revisado a 390 y 1440 px con Chrome headless (puppeteer-core 23.11.1, capturas en el scratchpad). Se ve bien en las dos. Su pie se corrigió porque decía que las cajas de los hooks eran discontinuas y no lo son.
    - **Scroll horizontal**: a 360 y 390 px había (`scrollWidth` 394). Lo causaba un enlace con la ruta `examples/demo/.harness/skills/convencion-commits/SKILL.md` en `code`, que no se parte. Se acortó el texto del enlace y ya no hay.
- [x] 2.3 Verificar las reglas de la serie:
  - `grep -n -i -E 'claude code|codex|cursor|copilot|privacidad|tu empresa|corporativ'` sin resultados. La URL del servidor remoto de GitHub contiene «githubcopilot»: si aparece, registrarla como endpoint, no como referencia del asistente, o dejarla fuera del texto.
  - `grep -n -E '^\s{2,}[-*] '` sin sublistas.
  - Comandos de Linux con referencia a WSL2, y la excepción del binario de macOS solo como nota.

  Registrar la salida
  - Registro (2026-11-16):
    - Palabras vetadas: sin resultados (exit 1). La URL del servidor remoto de GitHub, que contiene «githubcopilot», se dejó fuera del texto: el párrafo dice «GitHub ofrece el mismo servidor en remoto».
    - Sublistas: sin resultados (exit 1).
    - Linux: «Los comandos son para una terminal Linux. En Windows, usa WSL2», con la guía de Microsoft (línea 24). Los comandos del lector son de Linux. La única nota de macOS es la de la línea 34 («En macOS el fichero es otro (`Darwin` en lugar de `Linux`)», con la página del release), sin comando de macOS.
- [ ] 2.4 Comprobar que cada extracto existe literalmente en el tag `parte-6` y que cada enlace al repositorio apunta a ese tag. Ejecutar los comandos del post en orden desde un clon limpio del tag, en el contenedor Linux, y registrar la salida. Cifras: solo de ejecuciones registradas en 1.8 y 1.9, declarando cuántas son

## 3. Serie y configuración

- [x] 3.1 Actualizar en `src/content/series/asistente-codigo-local.yaml` el título de la parte 6 (el de 2.1) y su resumen, sin «incluida la autenticación OAuth de los servidores remotos». Verificar con `npm run build` que la página de la serie y el antetítulo del post muestran el título nuevo y que «OAuth» no aparece en la página de la serie
  - Registro (2026-11-16): parte 6 con el título «Saber, garantizar, alcanzar: extender el harness sin tocar su código» y el resumen «Skills, hooks y servidores MCP: tres formas de ampliar el harness, cada una con una capacidad distinta, dentro del mismo sandbox, y lo que cuestan en contexto.». Con `npm run build` (72 páginas), `dist/blog/series/asistente-codigo-local/index.html` tiene el título nuevo (1 aparición), «OAuth» 0 veces y `>Extensibilidad<` 0 veces. El post lleva el antetítulo «Parte 6».
- [x] 3.2 Actualizar `openspec/config.yaml` (`rules.design`):
  - La entrada de la serie registra el post 6, su change y el tag `parte-6`.
  - Como trabajo posterior en `harness`: el sandbox por defecto de stdio.
  - Una entrada nueva de trabajo futuro: post independiente, fuera de la serie, sobre OAuth para servidores MCP remotos. Categoría por decidir. Debe recoger que el servidor remoto de GitHub no admite DCR (issue #1404 de `github/github-mcp-server`, por confirmar en su momento), que hace falta una OAuth App propia y que `harness` ya acepta `clientId`/`clientSecret` y callback en `127.0.0.1`. No hace afirmaciones de uso sin ejecución propia.

  Verificar con `grep -n 'parte-6\|OAuth' openspec/config.yaml`, cargando el YAML con la librería `yaml`, y con `openspec validate add-extensibility-post --strict`
  - Registro (2026-11-16). En la entrada de la serie: el post 6 (`saber-garantizar-alcanzar.mdx`, change `add-extensibility-post`) y `parte-6` en la lista de tags. Un párrafo de trabajo posterior en `harness`: el sandbox por defecto para MCP stdio. Y, en el lab y fuera de la parte 6, los 2 tests de `bash.test.ts` que fallan en el contenedor arm64 (1.4). Entrada nueva de trabajo futuro: el post de OAuth para MCP remoto, con la DCR del servidor de GitHub (issue #1404, por confirmar), la OAuth App propia, `clientId`/`clientSecret` y el callback de `harness`, y `--oauth-client-id` de `github-mcp-server` v2.1.0. Verificación:
    - El YAML se carga con la librería `yaml` (claves `schema`, `context`, `rules` y `operations`).
    - `grep -n 'parte-6\|OAuth para servidores'` da las líneas 177 y 254.
    - `openspec validate add-extensibility-post --strict`: «Change 'add-extensibility-post' is valid».

## 4. Integración y publicación

- [x] 4.1 Con el post en `draft: false` para QA real, verificar en `dist/` el antetítulo «Parte 6», el bloque de navegación en las partes 1 a 6 y que no se listan entre sí en «Artículos relacionados»; registrar el resultado
  - Registro (2026-11-16, sobre `dist/` tras `npm run build`): el post lleva el antetítulo «Parte 6». El bloque de navegación tiene 6 entradas en las seis partes; de la 1 a la 5 enlazan a la 6, y en la 6 es la entrada actual, sin enlace. «Artículos relacionados» solo lista `golden-sets-y-pipelines-de-evaluacion` en las seis, sin que se listen entre sí. La tarjeta del post en `/blog` usa `blog-card-media--placeholder` (no tiene imagen) y `og:image` es la de marca. Con la imagen de 2.1, la tarjeta pasa a usar la portada y `og:image` apunta a ella.
- [ ] 4.2 Verificar y registrar el resultado de cada uno:
  - Q01, con la limitación de `.reveal` si sigue pendiente en `main`.
  - Q02 a 360, 390, 768 y 1440 px.
  - Q03 y Q04.
  - Q05: Lighthouse móvil, comparado con la parte 5 en la misma pasada.
  - Q07: enlaces, incluido el tag `parte-6` tras el merge del lab.
  - Q08.
  - Registro parcial (2026-11-16; **la tarea sigue abierta**: falta Q07 externo de los 10 enlaces al tag `parte-6`, que aún no existe). Chrome headless con puppeteer-core 23.11.1, axe-core 4.10.3 y Lighthouse 12.8.2 sobre `astro preview` de `dist/`, con scripts temporales en el scratchpad, sin versionar.
    - **Q01** (sin JS): el contenido está en el HTML (26.713 caracteres de texto, 11 `h2`, 14 bloques de código, 2 tablas y el diagrama con `role="img"`). Sigue la limitación del sitio con `.reveal`: sin JS las 9 `.reveal` quedan en `opacity: 0`, igual que en la parte 5 (9 de 9).
    - **Q02**: `scrollWidth` igual al ancho a 360, 390, 768 y 1440 px, tras acortar el enlace de 2.2.
    - **Q03**: axe da `color-contrast` (22) y `link-in-text-block` (3), en la navegación y el pie. Son los mismos, con los mismos nodos, que en la parte 5 medida en la misma pasada; nada sale del contenido del post. El diagrama tiene `aria-label` completo.
    - **Q04**: con `prefers-reduced-motion: reduce`, las `.reveal` mantienen la transición (9 de 9), igual que en la parte 5. Es una limitación del sitio que ya existía. El post no añade animaciones.
    - **Q05**: Lighthouse móvil, tres pasadas de cada página en la misma sesión.
      - Este post: rendimiento 70, 76 y 76 (la primera, en frío, con un LCP de 14,0 s); LCP 7,2 s en las otras dos; CLS de 0 a 0,012.
      - La parte 5: rendimiento 75, 75 y 75; LCP 7,7 s; CLS 0,004.
      - Accesibilidad 93 frente a 92; buenas prácticas 82 y SEO 100 en las dos.
      - Sin regresión. Sigue sin llegar a 90, la limitación de línea base ya registrada en la parte 5.
    - **Q07**: los enlaces internos (`/blog/compactar-es-lo-facil`, `/blog/el-sandbox-es-la-defensa-real` y `/blog/series/asistente-codigo-local`) existen en `dist/`. Los externos que no dependen del tag responden 200: ripgrep, bubblewrap, github-mcp-server, la página del release v2.1.0, el clon, la issue 4, la página de tokens y WSL2. El único 404 es la URL con `${VERSION}` y `${ARCH}` dentro del bloque de código, que es una plantilla; la URL real se descargó en 1.4 y 1.12.
    - **Q08**: sin `<script>`, `set:html` ni tokens en el MDX (`grep` exit 1). El diagrama es JSX estático, y ningún token llega a las salidas citadas.
- [ ] 4.3 Antes de archivar, preguntar al autor si confirma publicar este post y registrar pregunta y respuesta literales. Con confirmación, dejar `draft: false`; sin ella, `draft: true` y registrar que no hubo confirmación. Verificar con `grep -n '^draft:'` sobre el MDX

## Workflow follow-up

- Integrar la PR del lab y crear el tag `parte-6` sobre `main` antes de publicar el post, porque sus enlaces dependen de él. El merge lo hace el autor.
- Archivar el change en la misma rama antes del merge y ejecutar `openspec validate --all --strict`.
