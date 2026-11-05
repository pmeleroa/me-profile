# Design

## Context

Ver `proposal.md` - Why. Definido en entrevista con el autor mediante el skill `blog-post`.

`harness` (`~/workspaces/personal/harness`, rama principal `master`, sin remoto) ya tiene la gestión de contexto: `src/context/manager.ts` (tope por resultado, limpieza y compaction), `src/context/builder.ts` (system prompt y memoria), y `/compact` y `/context` en el REPL. `lab-harness-local` no tiene nada de esto: su CLI hace un solo `agent.run(prompt)` y termina, `maxTokens` es 4.096 y no se le puede indicar la ventana.

**Hechos comprobados el 2026-11-05** con Ollama 0.40.14 y `qwen2.5:7b`, por `/v1/chat/completions`:

| Conversación | Tokens estimados | `prompt_tokens` | HTTP / `finish_reason` | Clave de la tarea |
|---|---|---|---|---|
| Control pequeño | ~400 | 590 | 200 / `stop` | Correcta |
| 40 resultados de herramienta, ventana 32.768 | ~83.000 | 30.401 | 200 / `stop` | Inventada: copió otra clave |
| Igual, segunda ejecución | ~83.000 | 30.564 | 200 / `stop` | «NO VISIBLE» |

Son dos ejecuciones con relleno artificial con muchos dígitos. Las claves del system prompt y del último mensaje sobrevivieron en ambas. `/api/ps` devolvió `context_length: 32768`.

El harness del lab sobre su propio repositorio, con un servidor de 4.096: una ejecución válida leyó 1 de los 4 ficheros pedidos, terminó en `end_turn`, listó 7 de los 9 motivos de fin de run y el log del servidor marcó `truncated = 1` en la última petición. No está confirmado qué mide esa marca, ni que el recorte causara que no leyera los demás. Otra ejecución no es válida: `rg` no estaba en el `PATH`.

**Leído en el código, sin ejecutar:**

- `src/providers/openai.ts:249` declara 128.000 si no se configura otra cosa, y `docs/REFERENCE.md` dice 200k. `/v1/models` de Ollama no informa de la ventana.
- `contextTokens()` se calibra con el `prompt_tokens` del último turno, así que un dato recortado hace creer al harness que hay sitio.
- `available` es `Math.max(1, ventana - maxTokens)`: con una ventana igual o menor que `maxTokens` queda en 1 token.
- `compact()` envía el historial al mismo servidor y sustituye la conversación, pero no el system prompt.

## Goals / Non-Goals

**Goals:**

- Que el lector vea en menos de un minuto cómo se pierde la tarea con un HTTP 200, antes de que exista código de contexto.
- Que el harness no presente como normal un run cuya conversación ha recortado el servidor.
- Que los tres escalones se apliquen contra una ventana que sea real, y que el lector los vea actuar.
- Mantener la convergencia: mismos módulos y nombres en `harness` y en el lab.

**Non-Goals:**

- REPL y comandos `/compact` y `/context` en el lab: van a «Interfaz e integración».
- Descubrir la ventana con `/api/ps`: es propia de Ollama, solo informa de modelos cargados y rompe la idea del post 2 de que el adaptador solo necesita una URL.
- Tokenizador local, recomendar un modelo o justificar la ejecución en local.
- Nombrar productos comerciales como referencia. En el lab solo se lee `AGENTS.md`.
- Afirmar calidad o rendimiento sin medición propia o fuente citada.

## Decisions

**Tesis y contraargumento.** El mejor argumento en contra es que esto es una rareza de Ollama que se arregla con `--context-window`. Se responde así: configurarlo a mano deja al harness sin señal si la cifra está mal, y la detección da esa señal sin depender de ningún servidor concreto. Si una sección no aporta a la tesis, sale del post.

**Primero `harness`, después el lab.** Igual que en la parte 2: el código se escribe y se prueba en `harness` y se deriva recortando. Alternativa descartada: escribirlo primero en el lab, porque obligaría a reescribirlo al converger.

**La ventana sin configurar pasa a 4.096, con aviso.** Sustituye a los 128.000 en el adaptador, y la resolución sigue siendo configuración, catálogo y valor por defecto. Se elige un valor bajo porque equivocarse por abajo solo adelanta la limpieza, mientras que por arriba desactiva los escalones. Al arrancar sin ventana conocida, el harness avisa de cómo fijarla. Alternativa descartada: hacer `--context-window` obligatorio, porque rompería el comando de `examples/demo`. `/v1/models` sigue valiendo para los servidores que informan, como LiteLLM.

**La reserva de respuesta es proporcional.** La reserva efectiva es `min(maxTokens, 25 % de la ventana)` y es también el `max_tokens` enviado. Con 4.096 de ventana reserva 1.024 y con 32.768 reserva 8.192. Los tests de `harness` que fijan 20.000 y 4.000 no cambian. Las respuestas de `examples/demo` rondan los 215 tokens de salida. No se añade una opción de línea de comandos: `maxTokens` configurable sigue sin prometerse. Alternativa descartada: una opción `--max-tokens`, porque el lector tendría que acertar otro número más.

**Detección por `prompt_tokens`, con la señal elegida por medición.** Sin cambiar el contrato `Provider`. Se comparan dos señales en la tarea 1.2: la proporción entre `prompt_tokens` y la estimación sin calibrar, y si `prompt_tokens` no crece entre turnos aunque la conversación sí. La segunda no depende de los 4 caracteres por token y puede detectar desbordamientos pequeños, que la primera no ve. Los datos de hoy no bastan: el relleno daba 590 frente a ~400 en un sentido y 30.401 frente a ~83.000 en el otro, y no es texto representativo.

**Un final con nombre: `context_overflow`, condicionado a la medición.** Termina el run, con un mensaje que indica cómo fijar la ventana y código de salida 1. Continúa la idea del post 2 de que cada final tiene nombre. La historia sigue completa en `messages`. Alternativas descartadas: un aviso y seguir, porque puede acabar en `end_turn` sin la tarea; y recuperarse sola, porque compactar en desbordamiento puede resumir sin la tarea. **Condición:** si la tarea 1.2 no separa los casos con un margen claro, la detección baja a `warning` y el post lo cuenta tal cual.

**Calibración y `/context`.** Un turno detectado como recortado no actualiza `measured`. En `harness`, `/context` deja de reescalar con ese dato.

**`compact()` no se fía de una entrada recortada.** Si el uso de la petición de compaction también indica recorte, lanza un error en vez de sustituir la conversación. `manageContext` ya convierte ese error en `warning`, y el resumen malo no borra la historia.

**Script de desbordamiento.** `examples/desbordar.ts` envía por `OpenAIProvider` una conversación fija y generada con semilla, con claves en el system prompt, en la tarea y en el último mensaje, e imprime `prompt_tokens`, el final y la respuesta. Usa texto realista, no relleno de dígitos. Abre el post porque no depende de que el modelo decida leer: la entrada es siempre la misma, aunque la respuesta pueda variar. Se ejecuta contra el servidor de 4.096 que enseña el post 2. Hoy solo se ha probado con 32.768, a unos 55 segundos, así que el tiempo con 4.096 está por medir.

**Cómo se prueba cada cosa.** `FakeProvider` con una opción de recorte simulado comprueba detección, calibración, umbrales y `compact()` en `npm test`. Una ejecución real sobre el propio repositorio del lab se guarda en `examples/salidas` y se presenta como representativa, no como garantía. `examples/demo` no cambia.

**Línea de contexto en stderr, sin REPL.** La CLI imprime por turno `ctx usado/ventana (porcentaje)` e imprime los eventos `context` y `warning`. Sin ella el lector no ve lo que defiende el post. El desglose de `/context` (`src/ui/context.ts`, 363 líneas) queda para «Interfaz e integración». El lab conserva `agent.compact()` como método público para que el comando futuro sea casi inmediato.

**Instrucciones del proyecto, en corto.** El lab lee solo `AGENTS.md` de la raíz del workspace y lo añade al system prompt. Sin la jerarquía de `harness`. Encaja con la tesis porque responde dónde poner lo que no se puede perder, y porque cada línea se envía en cada petición. El post dice que la instrucción sigue disponible, no que se vaya a cumplir. Que sobreviva a una compactación está leído en el código y se verifica con un test.

**Terminal Linux.** Los comandos son idénticos a los del post 2 en Linux y macOS, así que se verifican en la máquina del autor. Windows se cubre con la referencia a WSL2. Sin excepciones en esta parte.

**Sin dependencias nuevas** en `me-profile`, `harness` ni el lab.

**Estructura del post.**

1. Apertura: el script de desbordamiento y el 200 sin la tarea.
2. Por qué el harness no se entera: ventana declarada, `/v1/models` sin dato y calibración engañosa.
3. Conocer la ventana: `--context-window` y la reserva de respuesta.
4. Detectar el recorte: la señal medida y `context_overflow`, con tests sobre `FakeProvider`.
5. Los tres escalones: recortar, limpiar y compactar, con la línea de contexto y una ejecución real.
6. Lo que sobrevive: `AGENTS.md`.
7. Lo que falta: resumen y enlace a la página de la serie.

Listas de una línea, sin sublistas. Enlaces y extractos siempre contra el tag `parte-3`. Título provisional: «Contexto: cuando el servidor responde 200 y tu tarea ya no está».

**Imagen destacada.** Se pregunta al autor durante el apply. Si la aporta, WebP de 1600×900 en `public/images/blog/<slug>.webp`, servida desde `public/` como las demás y convertida con `sharp` antes de commitear. Si no, placeholder de marca.

**Ramas.** `feat/add-context-window-post` en este repositorio. En `harness`, una rama desde `master`. En el lab, una rama y PR que integra el autor, con el tag `parte-3` sobre `main` después del merge. Los enlaces del post dependen de ese tag, así que la PR del lab se integra antes de publicar.

## Risks / Trade-offs

- [Falsos positivos que matan un run correcto] → Mitigación: medir con código y texto reales antes de fijar el umbral, y bajar a `warning` si no hay margen claro.
- [Desbordamientos pequeños sin detectar] → Mitigación: medir también la señal de crecimiento entre turnos. Si aun así no se ven, el post declara el límite.
- [Una ventana por defecto de 4.096 compacta de más en servidores con más ventana] → Aceptado: el aviso indica cómo fijarla, y el catálogo la resuelve donde hay dato.
- [El replay de sesiones grabadas sin ventana configurada diverge] → Mitigación: comprobar `test/replay.test.ts` y documentarlo. Grabar la ventana en el transcript sigue pendiente en `docs/REFERENCE.md`.
- [La reserva proporcional recorta respuestas largas en ventanas pequeñas] → Aceptado: `max_tokens` ya es un final con nombre y el lector lo ve.
- [El modelo no reproduce la ejecución real] → Aceptado: la apertura y los tests no dependen del modelo, y la ejecución se presenta como representativa.
- [El tamaño del post] → Mitigación: `AGENTS.md` va en una sección corta y la regla de la tesis decide qué sale.
- [Los extractos se desincronizan del código] → Mitigación: copia literal del tag `parte-3`, comprobada contra él.

## Migration Plan

Rollback del post: `git revert` del commit en `me-profile`, o fijar `draft: true`. El tag `parte-3` y el código del lab quedan publicados de forma independiente; si hay que retirarlos, decide el autor. En `harness`, los cambios se revierten descartando o revirtiendo su rama.

## Open Questions

- Título y slug definitivos: se cierran con el autor antes de crear el MDX.
- Qué mide exactamente `truncated` en el log del servidor: se contrasta en la tarea 1.1. No cambia el enfoque, porque el harness no lee ese log. Solo decide si el post lo menciona.
