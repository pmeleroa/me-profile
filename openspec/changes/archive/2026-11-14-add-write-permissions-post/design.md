# Design

## Context

La motivación está en `proposal.md`, apartado Why. El change se definió en una entrevista con el autor mediante el skill `blog-post`.

**`lab-harness-local` en el tag `parte-3`** (`8d635db`, igual en `main` local y en `origin/main`, comprobado el 2026-11-09):

- Herramientas: `Read` y `Glob`, ambas de solo lectura.
- `ToolCtx` contiene `workspace`, `signal` y `callId`. No guarda qué ficheros se han leído.
- Límite de workspace: `resolveInWorkspace` (`src/tools/types.ts`) resuelve la ruta con `realpath` y rechaza lo que queda fuera. El error vuelve al modelo como `tool_result`. Los tests cubren `../`, rutas absolutas, `~` y symlinks a fichero y a directorio. El post 2 dice expresamente que esto «no es el modelo de permisos».
- CLI de un solo disparo, sin approver.

**`harness`** (`~/workspaces/personal/harness`, rama `master`, commit `4aa8262`, sin cambios pendientes). Lo leído en el código el 2026-11-09:

- **`Write`** (`src/tools/write.ts`). Crea o sobrescribe. Para sobrescribir exige haber leído el fichero antes y crea los directorios padre.
- **`Edit`** (`src/tools/edit.ts`). Reemplazo exacto de texto. `old_string` debe aparecer una sola vez, salvo que se use `replace_all`. Si el modelo pega prefijos de número de línea, lo avisa. Devuelve el fragmento editado, numerado.
- **`FileStateCache`** (`src/tools/file-state.ts`). Implementa read-before-edit. Rechaza la escritura si `mtime` o el tamaño cambiaron desde la lectura.
- **`Grep`.** Está en `src/tools/search.ts`, junto a `Glob`, y usa ripgrep, que ya es requisito de la serie desde el post 2.
- **`PolicyEngine`** (`src/policy/engine.ts`):
  - Las reglas se evalúan en orden `deny` > `ask` > `allow`, primero las de sesión y luego las configuradas. `deny` gana incluso en `bypass`.
  - `evaluatePath`: una lectura dentro del workspace se permite y una fuera se pregunta. Una escritura fuera se pregunta. Una escritura dentro se pregunta en `default` y se permite en `acceptEdits` y `bypass`.
  - `bypass` convierte cualquier `ask` en `allow`.
  - Una regla `Edit(...)` cubre también `Write`.
- **Reglas de ruta** (`src/policy/rules.ts`): `matchPath` y `globToRegExp`.
- **Configuración** (`src/policy/settings.ts`). Se lee `~/.harness/settings.json`, después `<workspace>/.harness/settings.json` y después `settings.local.json`. La CLI admite `--permission-mode`, `--allow` y `--deny`. **No hay ningún `deny` por defecto**: `.env` y `~/.ssh` aparecen solo en `settings.example.json`.
- **`ttyApprover`** (`src/cli.ts:399`). Approver de línea con `readline`, que escribe en stderr. Muestra herramienta, ruta y motivo, y ofrece `[y]` sí, `[a]` siempre (la `suggestedRule`) y `[n]` no, «o escribe por qué». Ese texto vuelve al modelo como `feedback`. Sin TTY se usa `denyAllApprover`.
- **El prompt de aprobación no muestra el diff.** `summarize` (`src/ui/lines.ts`) se queda con `file_path`.
- **Hallazgo:** `isInside` es léxico y el motor no resuelve el `realpath` de la ruta destino. Se trata fuera de este change (ver Non-Goals).
- **Hallazgo:** nada impide que el agente escriba en `<workspace>/.harness/settings.json` y se amplíe los permisos para el siguiente run.

## Goals / Non-Goals

**Goals:**

- Que el lector vea el recorrido completo de una escritura: llamada → motor de permisos → approver → herramienta.
- Que las cuatro piezas de la tesis se vean actuar en su terminal: `deny` que gana, el perímetro, fallar cerrado y read-before-edit.
- Convergencia: mismos módulos, nombres, sintaxis de reglas y fichero de configuración que `harness`, recortando lo que el lab aún no tiene.

**Non-Goals:**

- **Cualquier cambio en `harness`.** El arreglo del `realpath` en su motor de políticas se hace después de cerrar este change. Queda registrado en `openspec/config.yaml` y no como tarea de este change.
- **Mostrar el diff en el prompt.** Adelantaría el lab a `harness`. El post lo declara en «Lo que falta».
- **El modo `plan`, reglas de Bash y MCP, `narrowMode` y `additionalDirectories`.** Son de otras partes.
- **Protección integrada de la configuración.** Se cubre con una regla, como se explica en Decisiones.
- **Afirmar calidad del modelo** sin medición propia.

## Decisions

**Tesis y contraargumento.** La tesis es «los permisos deciden dónde, no qué». El mejor argumento en contra es la inyección de instrucciones: un fichero del demo pide al modelo que meta algo dañino en `pricing.ts`. En `acceptEdits` se escribe sin preguntar; en `default` el prompt muestra solo `? Edit src/pricing.ts`. Ninguna pieza lo para. La respuesta no es negarlo, sino acotar la tesis: el perímetro y `deny` limitan el alcance, y el contenido se revisa con `git diff` después del run. El post presenta este argumento como escenario, no como medición. Si una sección no aporta a la tesis, sale del post.

**Derivar de `harness` sin modificarlo.** A diferencia de la parte 3, `harness` ya tiene todo lo necesario. El lab copia y recorta `write.ts`, `edit.ts`, `file-state.ts`, el `Grep` de `search.ts`, `rules.ts` (solo reglas de ruta), `engine.ts` (`evaluatePath`, reglas de sesión y modos `default`, `acceptEdits` y `bypass`), `settings.ts` (solo el bloque `permissions` de `<workspace>/.harness/settings.json`) y `ttyApprover`. Alternativa descartada: diseñar una versión propia para el lab, porque obligaría a reescribirla al converger.

**`realpath` antes de evaluar (diferencia deliberada con `harness`).**

- `permissionTarget` resuelve la ruta con `realpath` cuando existe, igual que `resolveInWorkspace` en la parte 2. El motor evalúa la ruta real.
- `resolveInWorkspace` deja de rechazar. Lo que antes era un muro pasa a ser una decisión del motor: si la ruta está fuera, se pregunta; si no hay TTY, se deniega; si una regla lo deniega, también.
- Se conservan los tests de symlinks, pero ahora comprueban la decisión (`ask` o `deny`) en vez del rechazo fijo.
- El post no menciona `harness` en este punto.
- Alternativa descartada: replicar el `isInside` léxico de `harness`, porque quitaría una protección que el post 2 promete.

**Approver: el de `harness`, con su texto.** Se deriva `ttyApprover` tal cual: herramienta, ruta y motivo, sin diff, con `[y]`, `[a]` (regla de sesión) y `[n]`, y el texto libre como motivo devuelto al modelo. Sin TTY en stdin y stderr, el approver es `denyAllApprover`. En el texto del post, «escribe por qué» se explica como denegar y corregir el rumbo del modelo.

**Configuración: el mismo fichero que `harness`, sin valores por defecto ocultos.**

- El lab lee solo el bloque `permissions` de `<workspace>/.harness/settings.json`, más `--permission-mode`, `--allow` y `--deny`.
- Como `harness`, no trae ningún `deny` implícito. El post enseña que los secretos se protegen con reglas explícitas.
- `examples/demo/.harness/settings.json` incluye `deny` para `Read(**/.env*)`, `Edit(**/.env*)` y `Edit(.harness/**)`.
- La regla `Edit(.harness/**)` evita que el agente se amplíe sus propios permisos para el siguiente run. Es la forma de cubrirlo sin cambiar `harness`, y «Lo que falta» dice que la protección no viene integrada.
- Alternativas descartadas:
  - Leer también `~/.harness/settings.json`: es un recorte para mantener el lab pequeño, y se registra como diferencia.
  - `deny` por defecto en el código: divergiría de `harness`.

**Modos.** Entran `default` y `acceptEdits`. `bypass` existe para una sola demostración: `deny` sigue ganando sobre `.env`. El post advierte que en `bypass` también se escribe fuera del workspace sin preguntar. `plan` no entra.

**`Read` registra lo que lee.** `ToolCtx` gana un `fileState` (`FileStateCache`), y `Read` registra cada lectura. Así `Edit` y `Write` sobre un fichero existente exigen haberlo leído y que no haya cambiado desde entonces. Los errores vuelven al modelo como `tool_result`, como en la parte 2.

**Demos y ejecuciones.**

- **Demo 1, escribir.** Sobre `examples/demo`, una tarea del tipo «cambia el descuento»: Grep → Read → Edit → prompt → `[y]`. Después, la misma tarea en `acceptEdits` y `git diff` para revisarla.
- **Demo 2, seguridad**, con los comandos en el propio post. El `.env` de mentira se crea con `echo` en el momento y no se versiona, para no publicar un `.env` en el repositorio. Pruebas:
  - Editar `.env` en `default` y en `bypass`.
  - Ejecutar con `< /dev/null` para comprobar que el `ask` se deniega.
  - Leer a través de un symlink creado por el lector hacia un directorio temporal propio (`/tmp/fuera`), nunca hacia `~/.ssh`.
- **Cobertura.** Los resultados del motor (`deny`, `ask` sin TTY, `bypass`, symlinks y read-before-edit) se prueban con tests deterministas sobre `FakeProvider` en `npm test`. Las ejecuciones reales con `qwen2.5:7b` se guardan en `examples/salidas/` y se presentan como representativas, no como garantía.
- **Fallos del 7B.** Si falla el `old_string`, se cuenta tal cual en una línea, con el número de ejecuciones y sin convertirlo en el tema.

**Terminal Linux.** `ln -s`, `echo`, la redirección `< /dev/null`, `git diff` y `npm run dev` son idénticos en Linux y macOS, así que se verifican en la máquina del autor. Windows se cubre con la referencia a WSL2. Sin excepciones en esta parte.

**Sin dependencias nuevas** en `me-profile` ni en el lab. `readline` es de Node.

**Estructura del post.**

1. La necesidad: un harness que solo lee se queda corto, y la promesa del post 2.
2. Modelo mental con diagrama: llamada → motor de permisos (`deny` > `ask` > `allow`) → approver → herramienta, con el perímetro del workspace.
3. Encontrar y cambiar: `Grep`, `Write`, `Edit` y read-before-edit.
4. Permisos: reglas y `settings.json`, modos, «siempre», «escribe por qué» y fallar cerrado.
5. Demos: escribir, y después seguridad.
6. Dónde, no qué: el contraargumento y `git diff`.
7. Lo que falta y resumen. Entre lo que falta: el prompt sin diff, sin protección integrada de la configuración, el modo `plan` y Bash en la parte 5.

El diagrama se hace en JSX con estilos en línea y las variables del sitio, con `aria-label`, como en la parte 3, y se revisa a 390 y 1440 px. Listas de una línea, sin sublistas. Extractos y enlaces siempre contra el tag `parte-4`. Título: «Los permisos deciden dónde, no qué: dejar que el agente escriba».

**Tamaño.** El objetivo es unos 33 KB, como la parte 3. Si se pasa, el orden de recorte es: extractos de código largos, que pasan a enlaces al tag; después, detalle de `Grep`; y nunca las demos de seguridad ni el contraargumento. No se divide en dos posts.

**Imagen destacada.** Se pregunta al autor durante el apply. Si la aporta, se convierte con `sharp` a WebP de 1600×900 y se guarda en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás. Si no, se usa el placeholder de marca.

**Ramas.**

- En este repositorio, `feat/add-write-permissions-post`.
- En el lab, una rama desde `origin/main` (`8d635db`) y una PR que integra el autor. El tag `parte-4` se crea sobre `main` después del merge.
- Los enlaces del post dependen de ese tag, así que la PR del lab se integra antes de publicar.

## Risks / Trade-offs

- **[El lector entiende que los permisos le protegen de código malicioso]** → Mitigación: la tesis lo niega explícitamente, con una sección propia y `git diff` como revisión.
- **[`bypass` mal entendido como «seguro porque `deny` gana»]** → Mitigación: el post dice que en `bypass` todo lo que no sea `deny`, incluido escribir fuera del workspace, pasa sin preguntar.
- **[El agente se amplía sus propios permisos]** → Mitigación: `Edit(.harness/**)` en el `settings.json` del demo, explicada en el post y declarada como no integrada.
- **[El 7B no acierta el `old_string` o no llega a pedir el `Edit`]** → Aceptado: los tests deterministas cubren el motor, las ejecuciones se presentan como representativas y los fallos se cuentan.
- **[El cambio de muro a `ask` sorprende a quien venía del post 2]** → Mitigación: el post lo dice al presentar el perímetro. Los tags `parte-2` y `parte-3` no cambian.
- **[Divergencia con `harness` en `realpath`]** → Aceptado y registrado: el arreglo en `harness` es trabajo posterior.
- **[Tamaño del post]** → Mitigación: el orden de recorte de Decisiones.
- **[Extractos desincronizados del código]** → Mitigación: copia literal del tag `parte-4`, comprobada contra él.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El tag `parte-4` y el código del lab quedan publicados de forma independiente; si hay que retirarlos, decide el autor. `harness` no cambia.

## Open Questions

- Slug definitivo: se cierra con el autor antes de crear el MDX, a partir del título ya elegido.
