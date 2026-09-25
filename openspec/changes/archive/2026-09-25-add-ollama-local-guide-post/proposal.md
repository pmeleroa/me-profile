## Why

El blog no tiene ningún post de tipo Guía: los existentes son Opinión/Análisis. Este post abre una **serie de guías sobre entornos de IA locales**, cuyo hilo conductor es construir paso a paso un asistente de código a medida que funcione en local. La tesis de partida: **no todos los casos de uso de IA necesitan consumir un LLM en la nube**.

El primer paso de la serie es tener un **harness plano**: un modelo local ejecutándose con Ollama y una forma mínima de hablarle, tanto desde la CLI (`ollama run`) como desde la API HTTP local (`/api/chat`), que es sobre lo que se construirán los siguientes posts. Sin bucle de conversación, contexto propio, tools ni integración: esas piezas son los posts siguientes de la serie.

La primera versión del post (ya redactada y verificada) partía de la premisa "tu empresa bloquea los LLMs públicos y necesitas un sustituto de Copilot". El autor reenfoca el post como guía introductoria de la serie. El ángulo corporativo (política de seguridad, aprobación) sale del post. Además, el propósito de la guía no es justificar una solución que tenga que ejecutarse en local: el post explica cómo montar el entorno, no por qué debería ser local. Por eso se cambia el título y se retira la sección que comprobaba que los datos no salen de la máquina.

## What Changes

- Nuevo post en la colección `blog` (categoría `Guía`), con el título "Ollama: primeros pasos hacia un asistente de código local" y esta estructura:
  1. Intro: no todos los casos de uso de IA necesitan la nube; presentación de la serie sobre entornos de IA locales; este post monta el harness plano.
  2. Instalación de Ollama desde una terminal Linux con el script oficial (`install.sh`), válido para Linux, WSL2 y macOS. Para Windows, solo una referencia a la guía de instalación de WSL2 de Microsoft, sin explicar cómo configurarlo.
  3. Modelo para arrancar: `qwen2.5-coder` (tamaño `7b` o `3b` según la RAM). La elección de modelo queda fuera de la guía y de la hoja de ruta de la serie: da para mucho debate.
  4. Uso desde la CLI con `ollama run`.
  5. Uso desde la API HTTP local: `curl` a `/api/chat` con `"stream": false`, como base del harness.
  6. Cierre: qué le falta al harness plano, como hoja de ruta de la serie en una lista de una línea por pieza (ventana de contexto, historial, contexto propio, salida estructurada, herramientas, MCP, bucle agéntico, seguridad, integración), y una frase final que remite a los siguientes posts de la serie.
- Se retira el marco anterior: "sustituto de Copilot", "LLMs públicos bloqueados" y la distinción entre hecho técnico y aprobación de la empresa.
- El post no nombra productos comerciales como referencia del asistente que construye la serie.
- Sin argumentos que justifiquen la ejecución en local (privacidad, datos que no salen de la máquina) ni comprobación de red.
- Nuevo slug alineado con el título: `ollama-primeros-pasos-asistente-de-codigo-local`. El post aún no está publicado ni en `main`, así que el cambio de slug no rompe enlaces.
- Imagen destacada propia en `public/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp` (WebP, 1600×900).
- Sin demo interactiva en `/lab/`: el post contiene instrucciones que el lector ejecuta en su propia terminal.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna)

Este change fija `skip_specs: true` en `.openspec.yaml`: la colección `blog` no tiene spec propia en este repositorio (es contenido, no una capability con contrato de comportamiento) y este post no introduce ni modifica ningún campo del schema de `src/content.config.ts`.

## Impact

- **Contenido**: un único `.mdx` nuevo en `src/content/blog/`, renombrado desde el borrador actual (`ollama-en-local-cuando-los-llms-publicos-estan-bloqueados.mdx`) a `ollama-primeros-pasos-asistente-de-codigo-local.mdx`.
- **Assets**: una imagen nueva, `public/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp` (56.6KB).
- **Código**: ninguno. No se añade página en `/lab/`.
- **Schema**: sin cambios en `src/content.config.ts` ni en el schema de la colección `blog`; `category: "Guía"` ya es un valor válido del enum existente.
- **Contrato de publicación** (`status`/`approvedBy`/`approvedAt`): no aplica. Esos campos no existen en el schema actual de la colección `blog` y esta propuesta no los introduce.
