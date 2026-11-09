# Proposal

## Why

El post 2 de la serie «Asistente de código local» deja dicho que la conversación crece hasta llenar el contexto y que el bucle no hace nada al respecto. Al comprobarlo contra Ollama apareció un problema más serio que decidir qué resumir: el servidor recorta la conversación y responde HTTP 200 con un final normal, sin la tarea original, así que el harness no se entera. Publicarlo ahora da a la parte 3 una tesis que no está en los textos habituales sobre compaction y encadena con la del post 2, que trata de cómo falla el bucle.

## What Changes

- Se publica la parte 3 de la serie, de tipo Guía. Su tesis: compactar es la parte fácil; lo difícil es saber que te has quedado sin sitio, porque el servidor no falla, responde 200 sin tu tarea.
- El lector provoca la pérdida con un script de desbordamiento, ve por qué el harness no se entera, le da la ventana real, detecta el recorte y aplica los tres escalones: recortar, limpiar y compactar. Una sección corta explica qué sobrevive: las instrucciones de `AGENTS.md`, que siguen disponibles aunque eso no garantice que el modelo las cumpla.
- Código fuera de este repositorio, en `harness`: la ventana por defecto deja de ser 128.000, la reserva de respuesta se ajusta a la ventana, se detecta el recorte con un final `context_overflow`, no se calibra con un dato recortado y `compact()` no sustituye la conversación por un resumen hecho sobre una entrada recortada.
- Código fuera de este repositorio, en `pmeleroa/lab-harness-local`: tag `parte-3` con la gestión de contexto, `--context-window`, una línea de contexto por turno, el script de desbordamiento y la carga de `AGENTS.md` de la raíz del workspace.
- Serie: `src/content/series/asistente-codigo-local.yaml` actualiza la parte 3 y añade los comandos `/compact` y `/context` a «Interfaz e integración».
- Configuración: las entradas de trabajo futuro de `openspec/config.yaml` reflejan lo resuelto y lo que queda pendiente.
- Fuera de alcance: REPL, comandos `/compact` y `/context` en el lab, descubrir la ventana con `/api/ps`, tokenizador local, escritura de ficheros y ejecución de comandos. El post 2 no se edita.

Contrato de publicación: no cambia (`status`/`approvedBy`/`approvedAt` no se usan en este repositorio; `draft` sigue siendo el único control). `draft: false` en el commit final solo con confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`, el post usa capacidades existentes de la colección `blog`)

## Impact

- Contenido: `src/content/blog/<slug>.mdx` (nuevo), `src/content/series/asistente-codigo-local.yaml` y, si el autor la aporta, `public/images/blog/<slug>.webp`.
- Configuración de OpenSpec: `openspec/config.yaml` (`rules.design`).
- Repositorios externos: `harness` (rama local, sin remoto) y `pmeleroa/lab-harness-local` (público, nuevo tag `parte-3`). El tag `parte-2` no cambia.
- Comportamiento de `harness`: una ejecución sin ventana configurada asume una ventana menor que hoy, y con ventanas pequeñas cambia el `max_tokens` enviado. Puede hacer divergir el replay de sesiones grabadas sin ventana configurada.
- Sin cambios de código ni dependencias npm en este repositorio.
- SEO: página nueva con `isPartOf` de la serie; las partes 1 y 2 ganan una entrada en el bloque de navegación.
