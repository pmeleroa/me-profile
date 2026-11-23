# Design

## Context

La motivación está en `proposal.md`, apartado Why. Las decisiones de alcance las tomó el autor el 2026-11-16, en una sesión del skill `blog-post`:

- Un solo post.
- El foco son las capacidades: skills/saber, hooks/garantizar y MCP/alcanzar.
- Un ejemplo único con la convención de commits.
- `github-mcp-server` en stdio, con un párrafo para el remoto.
- Sandbox por defecto para stdio.
- OAuth fuera de la serie.
- El contexto en un resumen final.

**`lab-harness-local`:** `main` en `dd38b6b`, la parte 5 integrada, con el tag `parte-5`. Tiene:

- `Read`, `Glob`, `Grep`, `Write`, `Edit` y `Bash`, con segundo plano.
- El motor de permisos de rutas y comandos.
- El sandbox (bwrap y seatbelt).
- El approver de línea.

La configuración solo se lee de `<workspace>/.harness/settings.json`: no hay capa de usuario. `Bash` filtra del entorno las variables que acaban en `API_KEY`, `_TOKEN`, `_SECRET`, `PASSWORD` o `PASSWD`. `--no-network` corta la red, y desde la configuración solo se puede cortar, nunca abrir. No hay skills, hooks ni MCP. Dependencias: `zod`, `web-tree-sitter` y `tree-sitter-bash`.

**`harness`** (`~/workspaces/personal/harness`, `master`, `4aa8262`, el mismo commit que en las partes 4 y 5). Leído el 2026-11-16:

- **Skills** (`src/skills/loader.ts`, 157 líneas; `src/tools/skill.ts`):
  - **Carga**: una carpeta con `SKILL.md` (frontmatter `name` y `description`). Raíces de usuario y de proyecto (`.harness/skills`, más `.claude/skills` por compatibilidad); con el mismo nombre, gana la de proyecto.
  - **Catálogo**: va al system prompt como `<available_skills>`, con la descripción limitada a 250 caracteres.
  - **Herramienta `Skill`**: devuelve el cuerpo, o una referencia si ya está cargada. Su `permissionTarget` es una lectura del `SKILL.md`. Con `disable-model-invocation`, la skill no entra en el catálogo.
- **Hooks** (`src/hooks/runner.ts`, 150 líneas; `src/core/loop.ts:476-538`):
  - **Eventos**: `PreToolUse` y `PostToolUse`, con un `matcher` por nombre de herramienta (`|` y `*`).
  - **Ejecución**: el comando corre con `sh -c` **dentro de `sandbox.wrap`**, con el JSON de la llamada por stdin, `HARNESS_EVENT`, `HARNESS_TOOL` y `HARNESS_FILE_PATH`, y el mismo filtro de entorno que `Bash`. Timeout de 10 s y salida limitada a 8.000 caracteres.
  - **Código de salida**: 2 bloquea en Pre o avisa en Post, con el stderr como motivo. Cualquier otro fallo o un timeout solo deja un aviso.
  - **Mensaje al modelo**: `{"message": …}` en stdout se añade al `tool_result`.
  - **Orden**: Pre corre **antes de los permisos**, así que un bloqueo no llega a preguntar al usuario.
  - **Configuración**: en `settings.json` (`hooks.PreToolUse` y `hooks.PostToolUse`). Los de proyecto se avisan al cargarlos.
- **MCP** (`src/mcp/config.ts` 186, `manager.ts` 372, `oauth.ts` 172; `src/tools/mcp.ts`, `tool-search.ts`):
  - **Configuración**: capas de usuario, `.mcp.json`, `settings.local.json` y `--mcp-config`. Expansión `${VAR}` y `${VAR:-x}`, y un servidor con variables sin definir no se conecta.
  - **Transportes**: stdio y HTTP. HTTP lleva OAuth por defecto si no hay cabecera `Authorization`.
  - **Sandbox**: stdio entra en él **solo con `sandbox: true`**, y con red `host` salvo `network: "none"`. Si se pide y no hay sandbox disponible, el servidor no arranca.
  - **Herramientas**: se nombran `mcp__<servidor>__<tool>`, con reglas `mcp__<servidor>` y comodines `mcp__<servidor>__get_*`.
  - **Carga diferida**: en `auto`, los schemas se difieren detrás de `ToolSearch` si superan el 10 % de la ventana (`src/index.ts:453`).
  - **También tiene**: resources, prompts, `list_changed`, reconexión, subagentes, transcripciones y `/mcp`.
  - **Evals**: con servidores reales (`filesystem` y `git`) y modelo local en `evals/results/`. No hay evals de skills.
- **Dependencia**: `@modelcontextprotocol/sdk` `^1.32.2`.

**`github-mcp-server`**, por búsqueda externa el 2026-11-16 y pendiente de confirmar en el apply:

- El servidor remoto no admite Dynamic Client Registration ([issue #1404](https://github.com/github/github-mcp-server/issues/1404)). Es el motivo de que OAuth salga de la serie.
- Hay un binario local (stdio) que recibe el token por entorno.

## Goals / Non-Goals

**Goals:**

- Que el lector vea las tres capacidades actuando sobre una misma tarea, con ejecuciones reales de `qwen2.5:7b`.
- Que todo proceso que lanza el harness (`Bash`, hooks y servidores MCP stdio) pase por el mismo sandbox. Así se cumple la promesa del post 5.
- Que el efecto en el contexto de los tres mecanismos sean cifras medidas, no deducidas del código.

**Non-Goals:**

- Paridad de MCP con `harness`.
- Un transporte HTTP ejecutable en el lab.
- Evaluar en general si un modelo pequeño usa bien las skills: es una tabla de una tarea, no un benchmark.

## Decisions

**Orden y foco del post.** Cada mecanismo sigue el mismo esquema: capacidad, implementación en el lab y ejemplo. El contexto no se trata dentro de cada sección: va en una sola sección final, corta y global, que enlaza con la ventana de 4.096 tokens de la parte 3. Alternativa descartada: el contexto de cada mecanismo dentro de su sección, porque el lector vería el precio antes de saber qué compra con él y el contexto volvería a parecer el tema (decisión del autor). Los tres verbos se presentan sin justificar la división. Como mucho, una frase en hooks dice que ahí no decide el modelo.

**Ejemplo único: «arregla la issue N y haz commit».** Sobre el workspace de demo del lab (`examples/demo`, el mismo de la parte 5; que sea un repositorio git anidado o no se decide en la tarea 1.6):

- **Skill de proyecto** `.harness/skills/convencion-commits/SKILL.md`: la convención (tipo, ámbito opcional y descripción, como Conventional Commits, que es la que usa `harness`) y la referencia a la issue (`(#N)`).
- **Hook** `PreToolUse` con `matcher: "Bash"`: un script de Node (`node .harness/hooks/check-commit.mjs`, sin `jq`) lee el JSON de stdin. Si el comando es un `git commit -m …` cuyo mensaje no cumple la convención, sale con 2 y explica el motivo por stderr. Si no, sale con 0. Una frase del post reconoce que git ya tiene `commit-msg`. Alternativa descartada: un hook `PostToolUse` que pasa el formateador tras cada `Edit`, que git no ve. Se descarta porque el autor prefiere que el hook garantice lo mismo que enseña la skill, para mostrar la relación entre saber y garantizar.
- **MCP**: `github-mcp-server` en stdio, declarado en `examples/demo/.mcp.json` con el token por `${GITHUB_PERSONAL_ACCESS_TOKEN}`. Se limita a una sola tool, `issue_read`, con `--tools=issue_read --read-only` (opciones confirmadas y medidas en la tarea 1.4). El token es *fine-grained* y de solo lectura sobre repositorios públicos: el lector no puede escribir en el repositorio del autor, y el agente tampoco.

**Qué entra en el lab (y nada más).** Se deriva de `harness` en `4aa8262` solo lo que necesita el post:

- **Skills**: `skills/loader.ts` y `tools/skill.ts`, solo con raíces de proyecto (`.harness/skills`). El lab no tiene capa de usuario. La compatibilidad con `.claude/skills` sale, para no nombrar otro producto en el lab.
- **Hooks**: `runner.ts` y su integración en el bucle, con el mismo orden que `harness` (Pre antes de los permisos).
- **MCP stdio**:
  - `config.ts`, recortado a `.mcp.json` y stdio, con expansión `${VAR}`.
  - `manager.ts`, recortado a conectar, listar herramientas, llamar y cerrar.
  - `tools/mcp.ts`.
  - Reglas `mcp__*` en `rules.ts` y el `PermissionTarget` `mcp` en el motor.
- **`ToolSearch`**: no entra. La regla inicial (entrar si los schemas del toolset de issues superaban el 10 % de 4.096) se midió en la tarea 1.4. El toolset de issues de solo lectura añade 1.576 tokens (38 %), y una sola tool (`--tools=issue_read --read-only`) añade 305 (7,4 %). El autor eligió una sola tool sin `ToolSearch` (decisión literal en la tarea 1.4). Las cifras del toolset completo van al resumen de contexto, como lección: conecta solo lo que usas.
- **Fuera**: OAuth, HTTP, resources, prompts, `list_changed`, reconexión, subagentes, transcripciones y `/skills`, `/mcp` y `/context`. Los módulos compartidos (`index.ts`, `cli.ts`, `loop.ts`, `engine.ts`, `rules.ts`, `settings.ts`, `tools/types.ts`) solo se tocan en lo que exige la parte 6.

Alternativa descartada: portar MCP completo, porque solo eso fueron tres hitos en `harness`, y el lab solo avanza con lo que el post cuenta.

**Diferencia deliberada: sandbox por defecto para MCP stdio.** En el lab, todo servidor stdio corre dentro de `sandbox.wrap`:

- **Escritura**: en el workspace y el temporal.
- **Ocultas**: las rutas de credenciales de la parte 5.
- **Red**: la del harness. Con `--no-network` tampoco tiene red, y un servidor puede declarar `network: "none"` para cortarla. Nunca puede abrirla.
- **Salida del sandbox**: solo `--sandbox none` lo saca, y saca a la vez a `Bash` y a los hooks. Un `.mcp.json` no puede pedir correr sin sandbox.
- **Sin sandbox disponible**: con `--sandbox bwrap` falla al arrancar (como en la parte 5). Con `auto`, cae a `none` con el mismo aviso de la cabecera.

Motivo: en `harness`, un `.mcp.json` de un repositorio ajeno lanza un proceso sin aislar con solo no pedir `sandbox: true`, y eso contradice lo que dijo la parte 5 («un repositorio no puede apagar el sandbox»). Alternativa descartada: seguir a `harness` y matizar la promesa en el post. Queda como trabajo posterior en `harness` (`openspec/config.yaml`).

Lo mismo vale para los hooks: los de proyecto corren siempre en el sandbox, como ya hace `harness`, y se avisan al arrancar.

**Credenciales.** El token llega al servidor MCP solo por el `env` de su configuración. Se verifica que `Bash` y los hooks no lo ven: el filtro `_TOKEN`, comprobado con `printenv` dentro de un `Bash` aprobado.

**Avisos al arrancar.** La cabecera de la CLI lista:

- Las skills cargadas.
- Los hooks del proyecto, con aviso de que son código del repositorio.
- Los servidores MCP: nombre, número de herramientas y si están dentro del sandbox.

Es la versión del lab del resumen de arranque de `harness`.

**Dependencia nueva en el lab: `@modelcontextprotocol/sdk`** (el mismo rango que `harness`). Justificación: el protocolo (inicialización, `tools/list` y `tools/call` sobre JSON-RPC por stdio) con su transporte y su validación no se reescribe a mano en un lab que debe converger con `harness`. Alternativa descartada: un cliente JSON-RPC propio, porque habría que reescribirlo al converger y el post no trata el protocolo por dentro. Sin dependencias nuevas en `me-profile`.

**Linux como camino principal y verificación.**

- **Comandos del lector**: el binario de `github-mcp-server` se descarga del release para Linux. El nombre del fichero cambia con la arquitectura y el sistema, así que el post da el comando de Linux (con una variable para la arquitectura si hace falta). **Excepción justificada a la regla de Linux:** en macOS el comando es distinto (otro fichero del release). El post no da la variante de macOS; como mucho, una nota que remite a la página de releases.
- **Docker no sirve aquí**: el post explica en una frase por qué no se lanza el servidor con `docker run`. El contenedor lo arranca el daemon de Docker, fuera de bubblewrap, así que el sandbox no aislaría nada.
- **Verificación de la variante Linux**: en el contenedor de la parte 5 (`node:22-bookworm` con `bubblewrap`, `--security-opt seccomp=unconfined --security-opt systempaths=unconfined`), con el binario de Linux de la arquitectura del contenedor. Las demos se ejecutan ahí y las salidas de `examples/salidas/` provienen de esa ejecución.
- **Windows**: referencia a WSL2, sin variantes.

**Evidencia: la tarea completa repetida.** `qwen2.5:7b`, con el servidor de Ollama a **8.192** tokens, ejecuta varias veces la misma tarea. A 4.096, como en la parte 5, la tarea no cabe: el arranque con las tres extensiones (2.225 tokens) más la skill pasan del umbral de compactación, y se compacta en cada turno. El autor decidió subir a 8.192 solo en esta parte (tarea 1.8), y el post lo cuenta en el resumen de contexto. El prompt nombra la herramienta («Lee la issue 4 de pmeleroa/lab-harness-local con la herramienta de GitHub, arréglala en este proyecto y haz commit.»), también por decisión del autor tras un piloto en el que el modelo no la usó. Como en la serie el hook no llegó a bloquear, hay una demo aparte del hook, declarada como tal: sin la skill y con el commit pedido literalmente. El número de ejecuciones se cierra en la tarea 1.8, con 10 como punto de partida. Una tabla recoge por ejecución:

- ¿Leyó la issue por MCP?
- ¿Cargó la skill antes del commit?
- ¿El hook bloqueó algún commit, y el modelo corrigió con el motivo?
- ¿El commit final cumple la convención y referencia la issue?

Se publica el resultado tal como salga, sin seleccionar ejecuciones. Hipótesis, sin afirmarla: si el modelo no carga la skill, el hook lo para. Los resultados del cargador de skills, del hook, de la configuración MCP y de los argumentos del sandbox se cubren con tests deterministas (`FakeProvider` y un servidor MCP stdio de prueba, como `evals/fixtures/mcp-inventory.mjs` de `harness`), para que `npm test` no dependa de GitHub.

**Cifras de contexto (resumen final).** Se miden con el `prompt_tokens` que devuelve Ollama en la misma petición, con y sin cada pieza:

- El catálogo de skills.
- El cuerpo de la skill cargada.
- Los schemas de las herramientas MCP.
- El mensaje de bloqueo del hook.

Solo se escriben cifras medidas, declarando cómo se midieron. El resumen las pone frente a la ventana de 4.096 de la parte 3, en pocas líneas.

**Estructura del post.**

1. Prerrequisitos y clonado: lo de la parte 5, el binario de `github-mcp-server`, un token *fine-grained* de solo lectura, la referencia a WSL2 y `git clone --branch parte-6`.
2. La necesidad: lo que el harness de la parte 5 no puede hacer sin tocar su código, presentada con la tarea del ejemplo.
3. Diagrama: dónde se engancha cada mecanismo en el bucle (catálogo en el system prompt, `Skill` como herramienta, Pre y Post alrededor de los permisos y de la ejecución, herramientas MCP en el registro y el proceso en el sandbox).
4. Skills, saber: capacidad, implementación y la skill de la convención.
5. Hooks, garantizar: capacidad, implementación, el hook sobre `git commit`, el sandbox y la frase sobre `commit-msg`.
6. MCP, alcanzar: capacidad, implementación en stdio, sandbox por defecto y por qué no `docker run`, y el párrafo del servidor remoto.
7. Verlo actuar: la tabla de ejecuciones.
8. Lo que cuesta en contexto: el resumen global y corto.
9. El harness como producto: lo que suman los tres, con la tarea entera.
10. Lo que falta (OAuth en un post propio fuera de la serie, resources y prompts, HTTP en el lab, reconexión, una sola tarea medida con un modelo pequeño) y lo esencial.

El diagrama va en JSX con estilos en línea y las variables del sitio, con `aria-label`, como en las partes 3 a 5, y se revisa a 390 y 1440 px. Listas de una línea por punto, sin sublistas. Extractos y enlaces siempre contra el tag `parte-6`.

**Tamaño y orden de recorte.** El objetivo son ~29 a 32 KB, como las partes 4 y 5. Si se pasa, se recorta en este orden:

1. Los extractos largos pasan a enlaces al tag.
2. El detalle de la configuración MCP.
3. El detalle del cargador de skills.

Nunca se recortan la tabla de ejecuciones, el sandbox de hooks y MCP ni el resumen de contexto.

**Imagen destacada.** Se pregunta al autor en el apply. Si la aporta, se convierte con `sharp` a WebP 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás. Si no, placeholder de marca.

**Ramas y tag.**

- **En este repositorio**: `feat/add-extensibility-post`.
- **En el lab**: una rama desde `origin/main` (`dd38b6b`) con la parte 6 completa (código, tests, README y documentación) y una PR que integra el autor. El tag `parte-6` se crea sobre `main` tras ese merge. Los tags `parte-2` a `parte-5` no se tocan.

## Risks / Trade-offs

- **[`github-mcp-server` no funciona dentro de bwrap]** (DNS, certificados o ficheros de configuración en `$HOME`) → Mitigación: probarlo primero a mano en el contenedor (tarea 1.4). Si necesita una ruta concreta, se añade a lo legible o escribible con su motivo. Si no funciona de ninguna manera, se para y se pregunta al autor antes de cambiar el ejemplo.
- **[Las opciones del binario no son las supuestas]** (toolsets, solo lectura, nombre de las herramientas de issues) → Mitigación: confirmarlas con `--help` y la documentación del release elegido, y fijar la versión del binario en el post.
- **[Los schemas de issues no caben bien en 4.096 tokens]** → **Se materializó** (tarea 1.4): el toolset de issues ocupa el 38 % de la ventana, y sin `--read-only` no cabe. Resuelto con una sola tool (decisión del autor). Si aun así no cabe la tarea, se pregunta al autor.
- **[El modelo pequeño no usa MCP ni la skill, o no termina la tarea]** → Aceptado: se publica la tabla tal como salga. El post no afirma que el modelo use bien las skills. Si ninguna ejecución termina, se pregunta al autor antes de cambiar el modelo o la tarea.
- **[El hook es frágil]** (solo mira `git commit -m`; `-F`, un editor o un heredoc se le escapan) → Aceptado y contado en una frase: es un lab. El modelo no abre editores, y con eso basta para mostrar la capacidad.
- **[Issues públicas en el repositorio del autor]** → Las crea el autor, o se crean con su confirmación literal (tarea 1.7). Son ilustrativas y no se cierran desde el agente, porque el token es de solo lectura.
- **[El lector expone su token]** → El post usa un token *fine-grained* de solo lectura, por variable de entorno, nunca escrito en `.mcp.json`. Se verifica que `Bash` y los hooks no lo ven.
- **[Un repositorio ajeno trae hooks o `.mcp.json`]** → Mitigación: aviso al arrancar y sandbox por defecto. El post lo dice.
- **[Diferencias lab/harness]** → Se listan y justifican al final del grupo 1, como en las partes 4 y 5.
- **[Tamaño del post]** → Mitigación: orden de recorte de Decisiones.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El tag `parte-6`, el código del lab y las issues ilustrativas quedan publicados de forma independiente; si hay que retirarlos, decide el autor. `harness` no cambia.

## Open Questions

- **Slug y título** (tarea 2.1). Propuesta: «Saber, garantizar, alcanzar: extender el harness sin tocar su código».
- **Número de ejecuciones de la tabla** (tarea 1.8). Punto de partida: 10.
