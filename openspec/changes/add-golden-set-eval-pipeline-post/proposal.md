## Why

Quien cambia el prompt, el modelo, una skill o las herramientas de un agente sin un conjunto fijo de casos con respuesta conocida y una forma repetible de puntuarlo está iterando a ojo. ReviewBench, el benchmark abierto de code review que publicó GitHub el 5 de octubre de 2026, muestra el patrón a gran escala: un golden set validado y un pipeline de evaluación offline predijeron antes del despliegue lo que luego confirmó un A/B en producción. El blog no tiene ninguna guía que enseñe a montar ese patrón a pequeña escala, y el trabajo futuro anotado en `openspec/config.yaml` (post de Análisis sobre cómo elegir un modelo local, que exige medir "con tareas propias") necesita justo esa infraestructura.

## What Changes

- Nuevo post en la colección `blog` (categoría `Guía`): cómo montar un golden set y un pipeline de evaluación, con un caso de ejemplo deliberadamente simple. Estructura en `design.md`.
- Caso de ejemplo ficticio: un clasificador de tickets de soporte en un conjunto cerrado de categorías (`facturación`, `bug`, `acceso`, `petición`). El post declara explícitamente que los datos son inventados y que están construidos para ilustrar. No usa datos, código ni metodología de trabajo del autor ni de este repositorio.
- Golden set ficticio en JSONL, diseñado con intención (guía de etiquetado previa, dificultad por caso, desbalance controlado) y partido en `dev` y `test`.
- Pipeline en Python con solo la biblioteca estándar, contra la API local de Ollama (`/api/chat`): cargar, ejecutar y guardar el run, normalizar, puntuar y comparar con el run anterior caso a caso.
- El post habla de un *sistema bajo prueba* (prompt, modelo, skill o agente), no solo de un prompt. Una sección "Del prompt al agente" explica, sin implementarlo, qué cambia al evaluar agentes y skills.
- Las cifras que aparezcan en el post salen de ejecutar el pipeline de verdad sobre el golden set ficticio. No se publica ninguna cifra inventada.
- El post declara su origen: surge de la lectura del artículo de GitHub sobre ReviewBench, que se cita y enlaza. ReviewBench se usa como gancho y referencia, no como tema.
- El post defiende una postura del autor: en un entorno empresarial con cierto grado de madurez, evaluar con golden sets y pipelines no es opcional, es necesario. Se presenta como opinión del autor, apoyada en el ejemplo de ReviewBench y sin cifras de adopción inventadas.
- Enlace al post `ollama-primeros-pasos-asistente-de-codigo-local` como prerrequisito para tener Ollama en marcha. El post no forma parte de la serie "Asistente de código local".

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna)

Este change fija `skip_specs: true` en `.openspec.yaml`: es contenido, no cambia ningún requisito de la spec `blog` ni el schema de `src/content.config.ts`. `category: "Guía"` ya es un valor válido del enum existente.

## Impact

- **Contenido**: un `.mdx` nuevo en `src/content/blog/` (`golden-sets-y-pipelines-de-evaluacion.mdx`).
- **Código de ejemplo**: en un repositorio público aparte, `pmeleroa/lab-golden-set-eval` (MIT), con el script del pipeline, la guía de etiquetado, el golden set ficticio y los runs que cita el post. El post enlaza a un tag fijo de ese repositorio. El lector no necesita clonar este repositorio del sitio, y `me-profile` no recibe ningún fichero de código.
- **Assets**: imagen destacada `public/images/blog/golden-sets-y-pipelines-de-evaluacion.webp` (WebP, 1600×900, 148KB), aportada por el autor durante el apply.
- **Repositorios**: se crea `pmeleroa/lab-golden-set-eval` en GitHub (con OK explícito del autor antes de crearlo).
- **Dependencias**: ninguna nueva en el proyecto. El lector necesita Python 3 y Ollama.
- **Contrato de publicación** (`status`/`approvedBy`/`approvedAt`): no aplica. Esos campos no existen en el schema actual de la colección `blog` y esta propuesta no los introduce.
