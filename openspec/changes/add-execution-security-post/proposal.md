# Proposal

## Why

La parte 4 de la serie «Asistente de código local» dejó que el harness escribiera ficheros con un tesis acotada («los permisos deciden dónde, no qué») y dejó fuera `Bash`, las reglas de comandos y el sandbox. La parte 5 cierra esa frontera: ejecutar comandos es la capacidad que anula las demás defensas, porque un comando puede escribir fuera del workspace, leer credenciales o llamar a la red sin pasar por `Write` ni `Edit`. La tesis de esta parte: **las reglas de Bash no bastan; la defensa real es aislar el proceso con un sandbox del sistema operativo.** No parte de un fallo vivido, sino de la necesidad de darle `Bash` al harness sin depender de que una lista de reglas lo prevea todo.

## What Changes

- Se publica la parte 5 de la serie, de tipo Guía, con título provisional «El sandbox es la defensa real: aislar lo que ejecuta el agente» (se cierra con el autor en el apply).
- **Alcance: un solo post, con el sandbox como foco principal.** El concepto central es el sandbox: qué es, qué garantiza (raíz de solo lectura, escritura solo en el workspace, credenciales ocultas, red opcional), cómo se construye con bubblewrap y qué no cubre. `Bash` y los procesos en segundo plano (`run_in_background`, `BashOutput`, `KillShell`) son secundarios: se presentan lo justo para tener algo que aislar, y el análisis de comandos y las reglas `Bash(...)` aparecen como el contraste (lo que no basta). Más de la mitad del post es sandbox. Si no cabe en el tamaño de la parte 4, se recorta lo secundario, no el sandbox.
- **Tesis y contraargumento.** Las reglas son comodidad (deciden cuándo preguntar) y se pueden rodear con un comando que parece inocuo; el sandbox decide qué puede pasar aunque una regla se equivoque. El contraargumento honesto es que el sandbox no ve el contenido: dentro del workspace y con red, un comando aprobado sigue pudiendo hacer daño. El post lo acota con lo que el sandbox sí garantiza (raíz de solo lectura, escritura solo en el workspace, credenciales ocultas, red opcional).
- **Linux como camino principal.** El sandbox se explica y se verifica con bubblewrap en Linux; macOS (`sandbox-exec`) entra como nota, sin variantes en los comandos del lector.
- **Código fuera de este repositorio, en `pmeleroa/lab-harness-local`:** el lab se actualiza con el contenido de la parte 5 y nada más (sandbox, `Bash`, parser de comandos, reglas `Bash(...)` y procesos en segundo plano, derivados de `harness` tal como está hoy, con demos y salidas en `examples/salidas/`, y README y documentación al día), sin adelantar contenido de partes posteriores aunque `harness` ya lo tenga, y se etiqueta `parte-5`. El tag se crea sobre `main` después de que el autor integre la PR.
- **Sin cambios en `harness`.** El lab no se adelanta a `harness`.
- **Serie:** `src/content/series/asistente-codigo-local.yaml` actualiza el título y el resumen de la parte 5.
- **Configuración:** la entrada de la serie en `openspec/config.yaml` registra el post 5 y el tag `parte-5`.
- **Fuera de alcance:**
  - El modo `plan`.
  - Red con allowlist de dominios (deuda conocida de `harness`, no se promete).
  - Los servidores MCP stdio y los hooks dentro del sandbox, que van a la parte 6.
  - Subagentes.
  - Editar los posts 2 a 4.

Contrato de publicación: no cambia. `status`, `approvedBy` y `approvedAt` no se usan en este repositorio y `draft` sigue siendo el único control. `draft: false` en el commit final solo con confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`, porque el post usa capacidades existentes de la colección `blog` y no toca `/lab/`)

## Impact

- **Contenido:**
  - `src/content/blog/<slug>.mdx`, nuevo.
  - `src/content/series/asistente-codigo-local.yaml`.
  - `public/images/blog/<slug>.webp`, si el autor aporta imagen.
- **Configuración de OpenSpec:** `openspec/config.yaml` (`rules.design`).
- **Repositorios externos:**
  - `pmeleroa/lab-harness-local`, público: nuevo tag `parte-5`. Los tags `parte-2` a `parte-4` no cambian.
  - `harness`: no se modifica.
- **Comportamiento del lab:** `Bash` aparece por primera vez; por defecto pregunta y se ejecuta dentro del sandbox. Quien siga los comandos de los posts 2 a 4 sobre sus tags no ve cambios.
- **Tamaño:** cerca de la parte 4 (~32 KB).
- Sin cambios de código ni dependencias npm en este repositorio. En el lab, el parser de Bash añade `web-tree-sitter` y `tree-sitter-bash`, justificado en `design.md`.
- **SEO:** página nueva con `isPartOf` de la serie. Las partes 1 a 4 ganan una entrada en el bloque de navegación.
