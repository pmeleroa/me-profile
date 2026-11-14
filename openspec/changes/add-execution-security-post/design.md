# Design

## Context

La motivación está en `proposal.md`, apartado Why. Las decisiones de alcance (un solo post, tesis «las reglas no bastan: el sandbox», Linux como camino principal) las tomó el autor el 2026-11-14.

**`lab-harness-local`:** tag `parte-4` (último commit antes del merge: `69759a1`). Tiene `Read`, `Glob`, `Grep`, `Write`, `Edit`, el motor de permisos de rutas, los modos `default`, `acceptEdits` y `bypass`, y el approver de línea. No tiene `Bash`, parser de comandos ni sandbox.

**`harness`** (`~/workspaces/personal/harness`, `master`). Lo leído el 2026-11-14:

- **`Bash`** (`src/tools/bash.ts`, 412 líneas). Timeout por defecto 120 s y máximo 600 s; `bash --noprofile --norc -c`; proceso `detached` para matarlo por grupo; salida truncada por el medio. `run_in_background` devuelve un id; `BashOutput` lee lo nuevo y `KillShell` lo para; sin timeout, muere al acabar la sesión. Cada comando pasa por `sandbox.wrap`.
- **Parser** (`src/policy/bash-parser.ts`). tree-sitter, no regex: descompone `git status && curl x | sh` en tres comandos, entra en `$(…)`, subshells y bucles, marca como «problema» (→ `ask`) la sintaxis no soportada, funciones, asignaciones peligrosas (`PATH`, `LD_PRELOAD`, `BASH_ENV`…) y nombres de comando dinámicos. Las redirecciones de escritura se evalúan como `Edit`.
- **Motor** (`src/policy/engine.ts`, `evaluateCommand`). `deny` gana en cualquier subcomando, incluso en `bypass`; cada subcomando necesita su permiso; hay una lista de comandos de solo lectura y otra de «opacos» (`bash`, `sh`, `env`, `xargs`, `sudo`, `timeout`, `nohup`…, intérpretes con `-c`/`-e`, `find -exec`, `git -c`) que siempre preguntan.
- **Reglas** (`src/policy/rules.ts`): `Bash`, `Bash(git status)`, `Bash(git *)`, `Bash(npm run *)`, `Bash(git * --force)`.
- **Sandbox** (`src/policy/sandbox/index.ts`). Comentario del propio código: «El sandbox es la defensa real. Las reglas de permisos son UX». Linux: `bwrap --ro-bind / /`, `--tmpfs /tmp`, credenciales ocultas (`~/.ssh`, `~/.aws`, `~/.gnupg`, `~/.kube`, `~/.npmrc`…), escritura solo en `writablePaths`, `--unshare-pid`, `--unshare-ipc`, `--new-session`, `--unshare-net` opcional. macOS: `sandbox-exec` con perfil SBPL y rutas como parámetros. `detectSandbox` comprueba con una sonda que funciona de verdad y, si no, cae a `none` con aviso.
- **Configuración** (`src/policy/settings.ts`). `sandbox.mode` y `sandbox.network`. Un repositorio no puede activar `bypass` ni desactivar el sandbox; solo los settings de usuario. Un proyecto puede cortar la red, nunca abrirla.
- **Deuda declarada de `harness`:** red con allowlist de dominios en el sandbox.

**Máquina del autor.** Es macOS (Darwin arm64), con `sandbox-exec` y Docker (`desktop-linux`), **sin `bwrap`**. Por la regla de Linux, el camino principal del post es bubblewrap, que no se puede verificar en la máquina del autor sin un contenedor Linux.

## Goals / Non-Goals

**Goals:**

- Que el lector vea el recorrido completo de un comando: llamada → parser → motor (`deny` > `ask` > `allow`) → approver → sandbox → proceso.
- Que se vea fallar una regla de verdad (un comando que parece permitido y hace otra cosa) y al sandbox contenerlo.
- Convergencia con `harness`: mismos módulos, nombres, sintaxis de reglas y fichero de configuración, recortando lo que el lab aún no necesita.

**Non-Goals:**

- **Adelantar al lab contenido de partes posteriores**, aunque exista en `harness`.
- **Cualquier cambio en `harness`.**
- **Red con allowlist**, el modo `plan`, MCP stdio/hooks en sandbox y subagentes.
- **Presentar el sandbox como protección total.** El post dice qué garantiza y qué no.
- **Afirmar rendimiento o calidad del modelo** sin medición propia.

## Decisions

**Foco: el sandbox.** El post gira alrededor del concepto de sandbox; `Bash` y el segundo plano son secundarios. Reparto orientativo del texto: sandbox (qué es, qué garantiza, cómo se construye, qué no cubre, demos) más de la mitad; reglas y parser como contraste, en una sección; `Bash` y segundo plano en una sección breve, solo lo necesario para tener algo que aislar. Todo lo que no sirva al concepto de sandbox sale.

**Tesis y contraargumento.** «Las reglas no bastan; la defensa real es el sandbox». Reglas: deciden cuándo preguntar y se evaden con comandos que parecen inocuos. Sandbox: limita el daño aunque el comando esté aprobado. Contraargumento: el sandbox no entiende el contenido; dentro del workspace y con red, un comando aprobado aún puede borrar el repositorio o sacar datos por la red. Respuesta: acotar la promesa a lo que garantiza (qué se puede escribir, qué credenciales se ven, si hay red) y recordar `git diff` de la parte 4. Se presenta como escenario, no como medición.

**Regla: el lab solo avanza con el contenido del post.** El código del lab se actualiza desde `/Users/pw-pmelero/workspaces/personal/harness` únicamente en lo que necesita el contenido de este post (sandbox, `Bash`, parser, reglas `Bash(...)` y segundo plano, más lo que esas piezas requieran para funcionar). No se adelanta contenido de partes posteriores (extensibilidad, delegación, sesiones, TUI, modo `plan`, proveedor de Anthropic, etc.) aunque `harness` ya lo tenga, y no se hace una puesta al día general de módulos que el post no toca. Los módulos compartidos que cambian (p. ej. `cli.ts`, `loop.ts`, `engine.ts`, `settings.ts`, `tools/registry.ts`) se tocan solo en lo que exige la parte 5. El estado de `harness` se fija por commit al empezar el apply y se registra; las diferencias con `harness` que quedan (deliberadas o por contenido aún no publicado) se listan con su motivo. Alternativa descartada: alinear el lab entero con `harness`, porque revelaría en el tag `parte-5` contenido que pertenece a partes futuras y rompería el orden de la serie. La regla se registra también en `openspec/config.yaml`.

**Derivar de `harness` sin modificarlo.** El lab copia y recorta `bash.ts` (sin segundo plano en una primera iteración si el tamaño lo exige; ver Tamaño), `bash-parser.ts`, `evaluateCommand`, `opaqueReason`/`isReadOnly`, las reglas `Bash(...)` de `rules.ts` y `sandbox/index.ts` (bwrap y seatbelt). Alternativa descartada: un sandbox propio más simple, porque obligaría a reescribirlo al converger.

**Dependencia nueva en el lab: `web-tree-sitter` + `tree-sitter-bash`.** Justificación: `git status && curl x | sh` empieza por `git` y ejecuta tres programas; ni un prefijo de string ni una regex lo descomponen de forma fiable, y ese ejemplo es parte del argumento del post. Alternativa descartada: regex/`split` por `&&`, `|`, `;`, que el post usa como contraejemplo del enfoque ingenuo. Sin dependencias nuevas en `me-profile`.

**Un solo post.** Orden de recorte si se pasa del tamaño: extractos largos pasan a enlaces al tag; después, el detalle de los procesos en segundo plano; después, el detalle del parser; nunca las secciones y demos del sandbox ni el contraargumento. No se divide en dos.

**Linux como camino principal y verificación.**

- Los comandos del lector (`bwrap`, `ls`, `cat`, `curl`, `touch`) son los mismos en Linux y macOS, salvo el sandbox: `bwrap` (Linux) frente a `sandbox-exec` (macOS). **Excepción justificada a la regla de Linux:** el post explica el sandbox con bubblewrap y menciona `sandbox-exec` solo en una nota, sin dar comandos de macOS para el lector.
- **Verificación de la variante Linux:** en un contenedor Linux con Docker (`desktop-linux`) con `bubblewrap` instalado y los permisos que bwrap exige para crear user namespaces (p. ej. `--security-opt seccomp=unconfined` y `--cap-add SYS_ADMIN`; se registra la combinación mínima que funciona). Las demos se ejecutan ahí y las salidas de `examples/salidas/` provienen de esa ejecución. La variante macOS se verifica en la máquina del autor con `sandbox-exec`, y su salida se cita solo como nota.
- Windows: referencia a WSL2, sin variantes.
- **Aviso honesto en el post:** bwrap necesita user namespaces; en un contenedor sin ellos `detectSandbox` cae a `none` con aviso, y el post lo muestra.

**Demos (comandos tal como irán en el post, sobre `examples/demo`).**

- **Demo 1, regla que no basta** (contraste, breve). Con `Bash(npm run *)` permitido, un script de `package.json` (creado por el lector) escribe fuera del workspace o lee una credencial de mentira (`~/.fake-ssh`, creada con `mkdir`/`echo`, nunca `~/.ssh` real). La regla lo deja pasar; se muestra el resultado sin sandbox. Los casos concretos de evasión se confirman ejecutándolos en el apply; si uno no se reproduce, no se afirma.
- **Demo 2, el sandbox lo contiene** (la demo principal). El mismo comando dentro de bwrap: escritura fuera → `Read-only file system`; credencial oculta → vacía o inexistente; red cortada con `--unshare-net` (`curl` falla); escribir en el workspace sigue funcionando.
- **Demo 3, fallar cerrado.** Sin sandbox disponible, `detectSandbox` avisa y cae a `none`; el post enseña el aviso.
- **Cobertura.** Los resultados del parser, el motor y los argumentos de `bwrap`/`sandbox-exec` se prueban con tests deterministas en `npm test`; las pruebas que ejecutan `bwrap` de verdad se saltan si no está disponible, y su resultado real se registra desde el contenedor. Las ejecuciones con `qwen2.5:7b` se guardan en `examples/salidas/` y se presentan como representativas, con el número de ejecuciones.

**Estructura del post.**

1. La necesidad: con `Bash` el agente puede saltarse `Write`/`Edit`; lo que prometió el post 4 (breve).
2. Modelo mental con diagrama, con el sandbox como protagonista: llamada → motor (`deny` > `ask` > `allow`) → approver → sandbox → proceso.
3. Contraste: las reglas y el parser (tree-sitter frente a prefijos) deciden cuándo preguntar, y la demo de evasión muestra que no bastan. Sección breve.
4. Qué es un sandbox: el concepto, qué garantiza y qué no (el cuerpo del post).
5. Construirlo con bubblewrap: raíz de solo lectura, escritura solo en el workspace, credenciales ocultas, red opcional, `--unshare-pid` y `--new-session`; y la nota de macOS.
6. Demos del sandbox: el mismo comando fuera y dentro, y qué pasa cuando no hay sandbox disponible.
7. Lo que el sandbox no hace: el contraargumento.
8. `Bash` y procesos en segundo plano, en una sección corta: se ejecutan dentro del mismo sandbox.
9. Lo que falta y resumen: red con allowlist, MCP/hooks, subagentes.

Diagrama en JSX con estilos en línea y las variables del sitio, con `aria-label`, como en las partes 3 y 4, revisado a 390 y 1440 px. Listas de una línea, sin sublistas. Extractos y enlaces siempre contra el tag `parte-5`.

**Tamaño.** Objetivo ~32 KB como la parte 4. Orden de recorte arriba.

**Imagen destacada.** Se pregunta al autor en el apply. Si la aporta, `sharp` a WebP 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás. Si no, placeholder de marca.

**Ramas y tag.** En este repositorio, `feat/add-execution-security-post`. En el lab, una rama desde `origin/main` con la parte 5 completa (código, tests, README y documentación al día) y una PR que integra el autor; el tag `parte-5` se crea sobre `main` tras ese merge, porque el tag debe apuntar al estado integrado y los enlaces del post dependen de él. Los tags `parte-2` a `parte-4` no se tocan.

## Risks / Trade-offs

- **[El lector entiende que el sandbox lo protege de todo]** → Mitigación: sección propia sobre lo que no hace y `git diff`.
- **[bwrap no funciona en el contenedor de verificación]** → Mitigación: registrar la combinación mínima de flags de Docker que funciona; si ninguna lo permite, usar una VM Linux o CI y registrar la limitación; no afirmar nada de bwrap sin ejecución propia.
- **[Una evasión de reglas no se reproduce con el 7B o con el parser actual]** → Mitigación: las demos de evasión se ejecutan a mano con el comando exacto; solo se escribe lo que se reproduce.
- **[Tamaño del post]** → Mitigación: orden de recorte de Decisiones.
- **[Dependencia tree-sitter en el lab]** → Aceptado y justificado: es el argumento del post.
- **[Extractos desincronizados del código]** → Mitigación: copia literal del tag `parte-5`, comprobada contra él.
- **[Diferencias lab/harness]** → Se listan y justifican, como en la parte 4.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El tag `parte-5` y el código del lab quedan publicados de forma independiente; si hay que retirarlos, decide el autor. `harness` no cambia.

## Open Questions

- Slug y título definitivos: se cierran con el autor antes de crear el MDX.
- Si `Bash` en segundo plano cabe en el tag `parte-5` o se deja como sección con enlace a `harness`: se decide al medir el tamaño del lab y del post.
