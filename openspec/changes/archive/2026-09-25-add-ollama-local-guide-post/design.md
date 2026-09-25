## Context

Ver `proposal.md` - Why. Es el primer post de tipo Guía del blog y el primero de una serie sobre entornos de IA locales, cuyo hilo es construir un asistente de código a medida que funcione en local. Se definió en entrevista con el autor mediante el skill `blog-post` y se reenfocó después en una sesión de exploración (`/opsx:explore`).

La primera versión (tareas 1.x y 2.x de `tasks.md`) se redactó y verificó con la premisa "LLMs públicos bloqueados, sustituto de Copilot". El reenfoque cambia la premisa, el encuadre y el cierre, y añade una sección de uso vía API. Las partes técnicas ya escritas (instalación, modelo, `ollama run`, aviso del puerto) siguen siendo válidas y ya están contrastadas contra la documentación oficial. Tras la reescritura, el autor precisa que la guía no debe justificar la ejecución en local, lo que cambia el título y retira la comprobación de red (tareas de la sección 4).

El lector objetivo es técnico (dev cómodo en terminal): no hace falta explicar conceptos básicos de desarrollo.

## Goals / Non-Goals

**Goals:**
- Abrir con la tesis "no todos los casos de uso de IA necesitan consumir un LLM en la nube" y presentar la serie sobre entornos de IA locales.
- Dejar al lector con un harness plano funcionando: modelo local, uso desde la CLI y uso desde la API HTTP local.
- Que cada paso sea ejecutable y verificable por el lector, con comandos reales.
- Cerrar mostrando qué le falta al harness plano, para enlazar con los siguientes posts de la serie.

**Non-Goals** (son las piezas de los siguientes posts de la serie; no se crean esos changes aquí):
- Bucle de conversación e historial gestionado por el harness.
- Contexto propio (ficheros del repositorio, prompts de sistema, RAG).
- Tools (leer y editar ficheros, ejecutar comandos) y bucle agéntico.
- Integración con terminal o IDE.
- Seguridad del harness: control de acceso a la API, permisos de las herramientas, confirmación de acciones destructivas, prompt injection, secretos en el contexto, procedencia del modelo y trazabilidad. El post los resume en un único punto "Seguridad" de una frase dentro de la lista final.

Además, fuera de alcance de la serie en este post:
- El ángulo corporativo (políticas de seguridad, aprobación de herramientas).
- Justificar por qué la solución debe ejecutarse en local (privacidad, datos que no salen de la máquina), incluida cualquier comprobación de tráfico de red.

## Decisions

**Guía introductoria de una serie, no guía cerrada**: el post monta la base mínima y deja explícito lo que falta. Alternativas descartadas durante la exploración:
- Mantener la premisa de "LLMs públicos bloqueados": el objetivo de la serie no es sortear ni suplir políticas de empresa.
- Hacer de la comprobación de red el núcleo del post ("demostrar que la IA no sale del entorno"): el autor aclara que ya no es la parte clave.
- Convertirlo en un post de Opinión/Análisis sobre qué casos de uso necesitan la nube: el propósito es una guía accionable.

**Harness plano = modelo + CLI + API**: además de `ollama run`, el post incluye una llamada con `curl` a la API local. Motivo: todo lo que la serie añadirá después (historial, contexto, tools, integración) se construye sobre la API, no sobre la CLI interactiva.

**`/api/chat` y no `/api/generate`**: es el endpoint que acepta un historial de mensajes y la definición de tools, así que la llamada del post 1 es la misma que los siguientes posts irán enriqueciendo. Se usa `"stream": false` para que la respuesta llegue como un único JSON legible en terminal. El formato exacto de la petición y de la respuesta debe contrastarse con la documentación oficial de la API de Ollama antes de publicarse.

**Modelo solo para arrancar**: se mantiene `qwen2.5-coder:7b` (~4.7GB), con `qwen2.5-coder:3b` si hay menos RAM, como ayuda práctica. El post no lo presenta como la elección definitiva y declara que elegir modelo da para mucho debate y queda fuera de la guía. La elección de modelo tampoco forma parte de la hoja de ruta de la serie, por decisión del autor (tarea 5.15). Dato comprobado durante la exploración: `qwen2.5-coder` aparece con la etiqueta `tools` en la librería oficial de Ollama, así que no bloquea los posts posteriores sobre tools; no hace falta afirmarlo en este post.

**Puerto 11434 como pieza de seguridad pendiente del harness**: la falta de autenticación de la API se trata como un punto "Seguridad" en la lista final de lo que le falta al harness, junto a historial, contexto, herramientas, bucle agéntico e integración. Explica que hoy basta con el bind por defecto a `127.0.0.1` y que controlar quién usa el harness y qué puede hacer será una pieza más cuando crezca. Hechos contrastados en la tarea 1.3. Sustituye a la subsección "Un aviso sobre el puerto 11434", que explicaba cómo exponer la API (`OLLAMA_HOST`, proxy Nginx) y cerraba con "si algún día decides compartirla, no lo hagas sin protegerla", dejando abierto un tema que la guía no resolvía. En la lista final, ese tema queda como anuncio explícito de la serie. Alternativas descartadas: explicar cómo proteger la API expuesta (se sale del harness plano) y dejarla como nota suelta en la sección de API.

**Sin justificar la ejecución en local**: el propósito de la guía es explicar cómo montar el entorno, no argumentar por qué debe ser local. Se retiran las frases de privacidad de la intro ("sin que tus prompts ni tu código salgan de ella", "enteramente en local") y la sección de comprobación de red con la cita de la FAQ sobre prompts. La tesis "No todos los casos de uso de IA necesitan consumir un LLM en la nube" se mantiene: presenta el local como una opción, no como una obligación. Alternativa descartada: mantener una comprobación de red breve; sin el argumento de privacidad no tiene función en la guía. La verificación de la tarea 1.4 queda como historial.

**Sin nombrar productos comerciales**: el post y la serie hablan de "un asistente de código a medida", sin tomar como referencia productos concretos.

**Título y slug**: "Ollama: primeros pasos hacia un asistente de código local" y `ollama-primeros-pasos-asistente-de-codigo-local`. Sustituyen a "Ollama: una alternativa local cuando tus datos no pueden salir de tu entorno", porque ese título era en sí una justificación de la ejecución en local, y a su slug intermedio (`ollama-alternativa-local-cuando-tus-datos-no-pueden-salir`). El actual (`ollama-en-local-cuando-los-llms-publicos-estan-bloqueados`) codifica la premisa descartada. Como el post no está publicado ni en `main`, se renombra sin coste.

**Guía centrada en una terminal Linux, con Windows vía WSL2**: el post se sigue desde una terminal Linux, y Linux y macOS la tienen de serie. Para Windows, el post solo remite a la guía de instalación de WSL2 de Microsoft (`https://learn.microsoft.com/es-es/windows/wsl/install`) y no explica cómo configurarlo. La instalación se unifica en el script oficial `curl -fsSL https://ollama.com/install.sh | sh`. Según el README oficial y el propio script, sirve para macOS (instala la app en `/Applications`, enlaza el CLI y la arranca) y para Linux. En Linux también detecta WSL2: rechaza WSL1, avisa si systemd no está activo y, con systemd, deja el servicio en marcha. El `.dmg` de macOS y la instalación manual de Linux quedan como alternativas enlazadas. Motivo: después de instalar, todos los pasos (`ollama pull`, `ollama run`, `curl`) son idénticos en los tres sistemas, y la serie usará shell y herramientas de terminal en todos sus posts. Alternativas descartadas:
- Windows nativo con PowerShell: el ejemplo oficial de la API en Windows usa `/api/generate`, así que habría que adaptarlo para `/api/chat` y nadie podría verificarlo. Además, obligaría a mantener variantes de PowerShell en cada post de la serie.
- Una sección que explique cómo configurar WSL2: fuera del propósito de la guía; basta con la referencia oficial.
- Mantener secciones separadas para Mac y Linux: duplican lo mismo cuando un único script cubre ambos.

**Imagen destacada**: el autor aporta una ilustración generada a partir de un prompt basado en el contenido: un núcleo local encendido conectado a una terminal, rodeado de cinco módulos apagados (historial, contexto, herramientas, bucle agéntico, integración) que representan los siguientes posts de la serie. No lleva texto, logos ni conexiones hacia fuera, para no reintroducir el mensaje de "los datos no salen". Se entrega en `public/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp`, en WebP a 1600×900 (16:9, coincide con `aspect-ratio: 16/9` de `.article-image`), convertido con `sharp` (ya en devDependencies) desde un PNG de 1672×941 y 1.6MB a calidad 75, con el mismo criterio que `ai-routing-y-soberania-tecnologica.webp`. Se sirve desde `public/` sin `astro:assets`, igual que las imágenes del resto de posts.

**Lista final como hoja de ruta de la serie**: la lista "Lo que le falta a este harness" recoge la hoja de ruta acordada con el autor, en orden de dependencia y sin numerar, para no fijar un índice cerrado. Cada pieza ocupa una línea que describe lo que el harness no hace hoy: ventana de contexto, historial, contexto propio, salida estructurada, herramientas, herramientas estándar (MCP), bucle agéntico, seguridad e integración. Solo entran piezas relacionadas con el harness local. "Evaluación" y "Observabilidad" se fusionaron primero en "Elección de modelo" (tarea 5.14), que después se retiró por dar para mucho debate (tarea 5.15), y "Varios modelos" se retiró por ser una evolución de arquitectura, no una pieza que falte. El debate sobre cuándo un modelo local no basta y compensa la nube no es una pieza del harness ni una guía. Además, chocaría con la regla de la serie de no justificar la ejecución en local. Por eso se retira del post y de la serie y pasa a ser un post de Opinión independiente, anotado como trabajo futuro en `openspec/config.yaml` (tarea 5.16). La ventana de contexto es la única línea con una afirmación técnica nueva: por defecto 4k tokens con menos de 24 GiB de VRAM, y al menos 64k para herramientas de código, contrastado en `docs.ollama.com/context-length` (tarea 5.13) y enlazado desde el post.

## Risks / Trade-offs

- [El ejemplo de `curl` a `/api/chat` no coincide con la API actual de Ollama o su respuesta es distinta de la que describe el post] → Mitigación: contrastarlo con la documentación oficial de la API y ejecutarlo en la máquina Mac real antes de publicar, registrando la fuente y la salida en `tasks.md`.
- [El lector toma `qwen2.5-coder` como la recomendación definitiva] → Mitigación: el post declara que es un modelo para arrancar y que elegir modelo queda fuera de la guía.
- [El post promete una serie que luego no se publica o cambia de rumbo] → Mitigación: el cierre anuncia los temas siguientes sin fechas ni un índice cerrado.
- [Los pasos no se han probado en Windows con WSL2 ni en una instalación limpia de macOS con el script] → Mitigación: la redacción se basa en el README oficial y en el código de `install.sh` (ramas de macOS, WSL2 y systemd), y se declara así en `tasks.md`, igual que se hizo con Linux en la tarea 1.2.
- [Los tamaños de modelo y requisitos de hardware se desactualizan pronto] → Aceptado: se documenta con fecha de publicación explícita.

## Open Questions

- Nombre de la serie y cómo se enlazan los posts entre sí (por ejemplo, tag común o sección en el propio post): no bloquea este post; se decide cuando exista el segundo.
