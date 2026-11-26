# Proposal

## Why

La parte 7 de la serie «Asistente de código local» dejó un harness que reparte el trabajo entre subagentes. Pero cada pregunta al lab sigue empezando de cero y, al terminar, no queda nada: ni la conversación ni lo que hizo cada subagente, cosa que la parte 7 dejó pendiente en su «Lo que falta». La parte 8 cubre dos necesidades del lector: **retomar el trabajo** y **saber qué hizo el agente y por qué**. Git no cubre la segunda: dice qué cambió en disco, pero no por qué ni cómo, y las lecturas, los comandos que no cambian nada y los subagentes no dejan rastro en git. El autor cerró la tesis el 2026-11-26 en una sesión del skill `blog-post`: **«todo se guarda, no todo se restaura»**. Es un mismo fichero con dos lecturas. Retomar lee lo mínimo y la trazabilidad lo lee todo. Lo que retomar deja fuera a propósito queda registrado y a la vista.

El post no parte de un fallo vivido. Parte de dos necesidades corrientes, con un escenario ilustrativo declarado como tal.

## What Changes

- **Se publica la parte 8 de la serie**, de tipo Guía. Título provisional: «Guardar no es restaurar: retomar el trabajo y saber qué hizo el agente». El slug se cierra en la tarea 2.1.
- **Alcance reducido respecto a la hoja de ruta** (decisión del autor). El yaml de la serie anunciaba «Sesiones y evaluación: transcripciones, retomar sesiones, replay, registro de lo que hace el agente y evals». Las evals y el replay salen de la serie y pasan a una serie propia de evaluación, que se registra como trabajo futuro. La parte 8 se queda con retomar el trabajo y con la trazabilidad.
- **Las cuatro ausencias deliberadas de retomar** son la bisagra del post:
  - el modo de permisos;
  - los «siempre», que son reglas de sesión: si quieres que duren, van a `settings.json`;
  - el registro de lecturas, porque read-before-edit obliga a releer;
  - el modelo y la ventana, que salen de los flags actuales, y cada retomada añade un `meta`.
- **Nuevo en el lab, por delante de `harness`, un registro `approval`.** Guarda una línea por cada decisión de permisos, también las automáticas, con su origen: `rule`, `mode`, `policy`, `user` o `hook`. Persiste lo que el motor ya calculaba y emitía como evento.
- **Nuevo en el lab, por delante de `harness`: las sesiones viven fuera del workspace** (decisión del autor). En `harness` viven en `<workspace>/.harness/sessions`, sin protección frente al propio agente. Allí el agente podría reescribir su registro, leer sin preguntar lo que otra sesión leyó fuera del workspace y encontrar sus transcripts con Grep. En el lab viven en `~/.harness/sessions/<clave del workspace>/`. Lo protegen:
  - el perímetro del workspace y el sandbox de las partes 4 y 5;
  - una deny de escritura integrada que gana también a `bypass`;
  - la ruta añadida a las que oculta el sandbox.
- **Cambio de regla de la serie** (decisión del autor). El lab puede adelantarse a `harness`, y al acabar la serie será la primera versión GA del harness. Lo que el lab tenga y `harness` no se registra como diferencia pendiente de llevar a `harness`.
- **Código de `harness` que entra en el lab:**
  - el transcript JSONL al que solo se añade;
  - `--continue` y `--resume <id>`, con la reparación de una tool cortada;
  - `--fork-session`;
  - los transcripts de los subagentes;
  - los registros `task`.
- **El lab imprime el id de sesión al arrancar.** Para listar y leer sesiones se usa `jq`, sin subcomando nuevo (decisión del autor).
- **Evidencia:**
  - demos reales con `qwen2.5:7b` sobre una copia de `examples/demo`, una ejecución por demo, dicha así;
  - tests deterministas para las garantías;
  - una cifra medida: lo que ocupa la sesión frente a lo que carga retomar.
- **Código fuera de este repositorio, en `pmeleroa/lab-harness-local`**, con demo, salidas, README y documentación. Se etiqueta `parte-8` sobre `main` después de que el autor integre la PR.
- **Sin cambios en `harness`.** Las diferencias nuevas quedan registradas como pendientes.
- **Serie:** `src/content/series/asistente-codigo-local.yaml` cambia el título y el resumen de la parte 8, y amplía el resumen de la parte 9 con `/resume`, `/sessions`, `/fork n`, `/tasks` y `restoreFinished`.
- **Configuración:** en `openspec/config.yaml` cambian:
  - la entrada de la serie: el post 8, el tag `parte-8`, la frase de convergencia, las diferencias del lab que adelantan a `harness` y lo que pasa a la parte 9;
  - una entrada nueva de trabajo futuro para la serie de evaluación.
- **Fuera de alcance:**
  - el replay y su modo exec, y las evals (pasan a la serie de evaluación);
  - `/resume`, `/sessions`, `/fork n`, `/tasks` y `restoreFinished`, que pasan a la parte 9;
  - el aviso de tools MCP que faltan al retomar, salvo que el autor lo meta en la tarea 1.0;
  - editar los posts 2 a 7.

Contrato de publicación: no cambia. `status`, `approvedBy` y `approvedAt` no se usan en este repositorio, y `draft` sigue siendo el único control. `draft: false` en el commit final solo con la confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`. El post usa capacidades existentes de la colección `blog` y no toca `/lab/`.)

## Impact

- **Contenido:**
  - `src/content/blog/<slug>.mdx`, nuevo.
  - `src/content/series/asistente-codigo-local.yaml`.
  - `public/images/blog/<slug>.webp`, si el autor la aporta (tarea 2.1).
- **Configuración de OpenSpec:** `openspec/config.yaml` (`rules.design`).
- **Repositorios externos:**
  - `pmeleroa/lab-harness-local`, público: nuevo tag `parte-8`. Los tags `parte-2` a `parte-7` no cambian.
  - `harness`: no se modifica.
- **Comportamiento del lab:**
  - Cada ejecución crea un transcript en `~/.harness/sessions/<clave>/` desde el primer mensaje, y lo imprime al arrancar.
  - Aparecen `--continue`, `--resume` y `--fork-session`.
  - Las herramientas del agente no pueden escribir en esa ruta en ningún modo, y Bash y los servidores MCP no la ven.
  - Quien siga los comandos de los posts 2 a 7 sobre sus tags no ve cambios.
- **Dependencias:** ninguna nueva en el lab ni en `me-profile`. El post añade `jq` a los prerrequisitos del lector.
- **Privacidad:** el transcript guarda todo lo que leyó el agente. Las salidas publicadas salen de un contenedor con rutas neutras, y la tarea 1.10 escanea el diff en busca de datos privados.
- **Tamaño:** cerca de las partes 4 a 7 (~29 a 32 KB).
- **SEO:** página nueva con `isPartOf` de la serie. Las partes 1 a 7 ganan una entrada en el bloque de navegación.
