# Proposal

## Why

La parte 6 de la serie «Asistente de código local» dejó un harness que se amplía sin tocar su código. La parte 7 es la de delegación, y la hoja de ruta la resume como «Subagentes: delegar parte del trabajo en otros agentes». El post 2 ya la anunció como «otro bucle con otras herramientas del que al principal solo vuelve un informe». La tesis, cerrada con el autor el 2026-11-25 en una sesión del skill `blog-post`, es que **delegar sirve sobre todo para proteger la ventana de contexto del principal, no para ir más rápido**. Lo que lee el subagente se queda en su propio bucle y su propia ventana, y al principal solo le vuelve el informe. Enlaza con la parte 3, donde la ventana local era el recurso escaso.

El post no parte de un fallo vivido. Parte de una necesidad corriente: una pregunta corta sobre el repositorio que obliga a leer muchos ficheros que luego no sirven.

## What Changes

- **Se publica la parte 7 de la serie**, de tipo Guía. Título decidido por el autor: «Delegar no es paralelizar: subagentes para proteger la ventana». Slug propuesto: `delegar-no-es-paralelizar`, que se cierra en la tarea 2.1.
- **Eje: la economía de contexto.** La especialización (tipos de subagente con sus propias herramientas) va en segundo plano. El paralelo y el segundo plano son beneficios que se cuentan al final, con su matiz. La sección final cierra el título: delegar no es *principalmente* paralelizar.
- **La objeción del clearing va justo después del diagrama**, como pregunta del lector: «¿y el clearing de la parte 3?». La respuesta es que el clearing actúa después y delegar actúa antes, que los dos se apilan, y que hay un caso en que la objeción gana (una exploración pequeña que cabe sobrada).
- **La evidencia es una comparación A/B medida** con `qwen2.5:7b`: la misma tarea con la tool `Agent` y con `--no-agents`, publicada tal como salga. Se registran los tokens totales (principal más subagentes) como contraargumento medido. El prompt pide delegar, y una nota aparte, declarada como piloto, cuenta lo que hizo el modelo sin pedírselo.
- **El lab converge con `harness` en subagentes.** El autor no quiere en el lab nada que `harness` no tenga, y el objetivo de la serie es que los dos acaben siendo el mismo repositorio. Entra todo el módulo de subagentes salvo lo que pertenece a partes posteriores:
  - La tool `Agent` y su contrato.
  - Los tipos integrados `explore` y `general`.
  - Las definiciones en `.harness/agents/*.md`, con `tools`, `mode`, `maxTurns` y `model`.
  - Permisos que solo restringen, un único nivel de profundidad y una sesión de Bash propia dentro del sandbox.
  - Herramientas MCP por tipo de subagente.
  - Paralelo para los de solo lectura, hasta 4.
  - Segundo plano con `run_in_background` y deduplicación (decisión del autor: entra en esta parte).
  - `--no-agents`.
- **`model:` entra en el código y en una sola línea del post** (decisión del autor). La línea remite al post fuera de la serie sobre cómo elegir modelo y no promete nada de rendimiento. Así se cumple la regla de que «varios modelos» queda fuera de la serie.
- **Código fuera de este repositorio, en `pmeleroa/lab-harness-local`.** El lab se actualiza desde `harness` con la parte 7 y nada más, con demo, salidas, README y documentación. Se etiqueta `parte-7` sobre `main` después de que el autor integre la PR.
- **Sin cambios en `harness`.**
- **Serie:** `src/content/series/asistente-codigo-local.yaml` actualiza el título y el resumen de la parte 7.
- **Configuración:** en `openspec/config.yaml`, la entrada de la serie registra el post 7, el tag `parte-7`, la convergencia del lab con `harness` en subagentes y lo que queda para las partes 8 y 9.
- **Fuera de alcance:**
  - El transcript de cada subagente (parte 8).
  - `/agents`, el contador de subagentes del pie y la sección de subagentes de `/context` (parte 9).
  - Debatir qué modelo poner en `model:`.
  - Editar los posts 2 a 6.

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
  - `pmeleroa/lab-harness-local`, público: nuevo tag `parte-7`. Los tags `parte-2` a `parte-6` no cambian.
  - `harness`: no se modifica.
- **Comportamiento del lab:**
  - Aparece la tool `Agent`. Un repositorio que traiga `.harness/agents/*.md` hace que se carguen esos tipos al arrancar, con aviso.
  - Quien siga los comandos de los posts 2 a 6 sobre sus tags no ve cambios.
- **Dependencias:** ninguna nueva, ni en el lab ni en `me-profile`.
- **Tamaño:** cerca de las partes 4 a 6 (~29 a 32 KB).
- **SEO:** página nueva con `isPartOf` de la serie. Las partes 1 a 6 ganan una entrada en el bloque de navegación.
