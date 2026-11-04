# Proposal

## Why

El post 1 de la serie «Asistente de código local» termina con un harness plano y una lista de lo que le falta, pero la serie aún no ha construido nada sobre esa base. El autor ya tiene un harness real y probado (`harness`, v1.0.0), lo que permite reenfocar la serie en la arquitectura de un agente de código y publicar decisiones contrastadas con código ejecutable, empezando por la pieza central: el bucle.

## What Changes

- Se publica la parte 2 de la serie, de tipo Guía. Su tesis es que el bucle de un agente cabe en pocas líneas y que lo que requiere diseño es cómo termina y cómo falla.
- El lector construye un agente de solo lectura: loop con streaming, contrato de inferencia con un adaptador a `/v1/chat/completions` de Ollama, herramientas `Read` y `Glob`, y finales explícitos. Provoca los fallos con un proveedor simulado.
- El post explica en una frase que el `curl` a `/api/chat` del post 1 era una aproximación y que el harness usa `/v1`. El post 1 no se edita.
- LiteLLM aparece solo como caja opcional del diagrama y en un párrafo, como gateway fuera del harness.
- Código fuera de este repositorio: se crea `pmeleroa/lab-harness-local` (público, MIT, TypeScript), con el tag `parte-2`, que evolucionará post a post hasta ser el mismo repositorio que `harness`.
- Código fuera de este repositorio: se limpia el README de `harness` y el de `lab-harness-local` para que no nombren productos comerciales como referencia.
- Configuración: la hoja de ruta de la serie en `openspec/config.yaml` pasa a ser la de arquitectura, sin hardware, y se añade como trabajo futuro un post independiente sobre LiteLLM como gateway.
- Fuera de alcance: partes 3 a 6, escritura, ejecución de comandos, permisos, gestión de contexto, MCP, cancelación controlada y el arreglo de la ventana por defecto del adaptador de `harness`.

Contrato de publicación: no cambia (`status`/`approvedBy`/`approvedAt` no se usan en este repositorio; `draft` sigue siendo el único control). `draft: false` en el commit final solo con confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`, el post usa capacidades existentes de la colección `blog`)

## Impact

- Contenido: `src/content/blog/<slug>.mdx` (nuevo) y, si el autor la aporta, `public/images/blog/<slug>.webp`.
- Configuración de OpenSpec: `openspec/config.yaml` (`rules.design`).
- Repositorios externos: `pmeleroa/lab-harness-local` (nuevo) y `harness` (solo README y descripción de `package.json`).
- Sin cambios de código ni dependencias npm en este repositorio.
- Dependencia de orden: integrar `add-blog-series-nav` antes o a la vez, porque publicar la parte 2 activa su bloque de navegación.
- SEO: página nueva con `isPartOf` de la serie; el post 1 gana el bloque de navegación por el otro change.
