# Proposal

## Why

La parte 5 de la serie «Asistente de código local» dejó al harness ejecutando comandos dentro de un sandbox. En su «Lo que falta» prometió que los servidores MCP y los hooks, que también ejecutan código, irían en la siguiente parte «dentro del mismo sandbox». La parte 6 es la de extensibilidad: cómo ampliar el harness sin tocar su código. La tesis es que **hay tres formas de extender el harness, y cada una le da una capacidad distinta**:

- **Skills, saber**: el agente aprende procedimientos que no traía.
- **Hooks, garantizar**: el harness ejecuta lo que no puede depender de que el modelo se acuerde.
- **MCP, alcanzar**: el agente usa herramientas que no has escrito, en otro proceso.

El post no parte de un fallo vivido. Parte de la necesidad de que el harness haga más sin cambiar su código. La división en tres verbos se presenta sin justificarla (decisión del autor): es lo más sencillo.

## What Changes

- **Se publica la parte 6 de la serie**, de tipo Guía. El título y el slug se cierran con el autor en el apply (tarea 2.1). Propuesta de partida: «Saber, garantizar, alcanzar: extender el harness sin tocar su código».
- **Alcance: un solo post con skills, hooks y MCP.** El autor no quiere reorganizar la serie. Lo que mantiene el post en el tamaño de las partes anteriores es el recorte de lo que entra en el lab, no partirlo en dos.
- **El foco son las capacidades, no el contexto.** Cada mecanismo se cuenta con el mismo orden: qué capacidad añade, cómo se implementa en el lab y un ejemplo. El efecto en el contexto de los tres va en un solo resumen al final, global y corto, enlazado con la ventana de la parte 3.
- **Un ejemplo único recorre el post**: la tarea «arregla la issue N y haz commit» sobre el lab.
  - **Skill**: la convención de commits del proyecto.
  - **Hook**: un `PreToolUse` sobre `git commit` que bloquea los mensajes que no la cumplen. Una frase reconoce que git ya tiene `commit-msg`: aquí el hook está para mostrar la capacidad, no para sustituirlo.
  - **MCP**: `github-mcp-server` en local (stdio), con un token *fine-grained* de solo lectura, trabajando con issues de `pmeleroa/lab-harness-local` a modo ilustrativo. Un párrafo cuenta el servidor remoto (HTTP): basta la URL y la cabecera, y no hay proceso que aislar.
- **En el lab, los servidores MCP stdio corren dentro del sandbox por defecto.** Solo se pueden sacar con `--sandbox none`; un repositorio no puede. Es una diferencia deliberada con `harness`, donde el sandbox de stdio es opcional (`sandbox: true`). Los hooks ya corren dentro del sandbox en `harness`, y el lab hace lo mismo. Con esto, la promesa del post 5 se cumple tal cual.
- **OAuth queda fuera de la serie.** El post dice en «Lo que falta» que, por su complejidad, OAuth tendrá un post propio, fuera de la serie.
- **Código fuera de este repositorio, en `pmeleroa/lab-harness-local`.** El lab se actualiza con el contenido de la parte 6 y nada más:
  - Skills: catálogo y herramienta `Skill`.
  - Hooks: `PreToolUse` y `PostToolUse`.
  - Cliente MCP stdio: configuración, herramientas `mcp__<servidor>__<tool>`, reglas `mcp__*` y sandbox por defecto.
  - Sin `ToolSearch`: el servidor se limita a una tool (`--tools=issue_read --read-only`), según lo medido en el apply (ver `design.md`).
  - Demos y salidas, README y documentación.
  - No se adelanta contenido de partes posteriores. Se etiqueta `parte-6` sobre `main` después de que el autor integre la PR.
- **Sin cambios en `harness`.** Las diferencias deliberadas quedan como trabajo posterior en `openspec/config.yaml`.
- **Serie:** `src/content/series/asistente-codigo-local.yaml` actualiza el título de la parte 6, y su resumen deja de decir «incluida la autenticación OAuth de los servidores remotos».
- **Configuración:** en `openspec/config.yaml`:
  - La entrada de la serie registra el post 6 y el tag `parte-6`, y el sandbox por defecto de stdio como trabajo posterior en `harness`.
  - Nueva entrada de trabajo futuro: un post independiente sobre OAuth para servidores MCP remotos.
- **Fuera de alcance:**
  - OAuth.
  - Resources y prompts de MCP.
  - Reconexión y `list_changed`.
  - El transporte HTTP en el lab (solo un párrafo en el post).
  - Subagentes (parte 7).
  - Transcripciones (parte 8).
  - `/skills` y `/mcp` de la TUI (parte 9).
  - Editar los posts 2 a 5.

Contrato de publicación: no cambia. `status`, `approvedBy` y `approvedAt` no se usan en este repositorio, y `draft` sigue siendo el único control. `draft: false` en el commit final solo con la confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`, porque el post usa capacidades existentes de la colección `blog` y no toca `/lab/`)

## Impact

- **Contenido:**
  - `src/content/blog/<slug>.mdx`, nuevo.
  - `src/content/series/asistente-codigo-local.yaml`.
  - `public/images/blog/<slug>.webp`, si el autor la aporta (tarea 2.1).
- **Configuración de OpenSpec:** `openspec/config.yaml` (`rules.design`).
- **Repositorios externos:**
  - `pmeleroa/lab-harness-local`, público:
    - Nuevo tag `parte-6`.
    - Issues ilustrativas creadas con la confirmación del autor (tarea 1.7).
    - Los tags `parte-2` a `parte-5` no cambian.
  - `harness`: no se modifica.
- **Comportamiento del lab:**
  - Aparecen skills, hooks y servidores MCP stdio. Los procesos que lanza el harness (Bash, hooks y servidores MCP) pasan todos por el sandbox.
  - Un repositorio que traiga `.mcp.json` o hooks en `.harness/settings.json` hace que se carguen al arrancar, con aviso.
  - Quien siga los comandos de los posts 2 a 5 sobre sus tags no ve cambios.
- **Dependencias:** en el lab, `@modelcontextprotocol/sdk` (justificada en `design.md`). En `me-profile`, ninguna.
- **Tamaño:** cerca de las partes 4 y 5 (~29 a 32 KB).
- **SEO:** página nueva con `isPartOf` de la serie. Las partes 1 a 5 ganan una entrada en el bloque de navegación.
