# Tasks

## 1. Medición previa (sin cambiar código)

- [ ] 1.1 Repetir contra un servidor de 4.096 la ejecución del harness del lab sobre su propio repositorio, con `rg` en el `PATH`, y contrastar qué mide `truncated` en el log del servidor; registrar versión de Ollama, salidas y fuente. Si el comportamiento no coincide con `design.md`, parar y consultar al autor
- [ ] 1.2 Medir las dos señales de detección (proporción entre `prompt_tokens` y estimación, y crecimiento entre turnos) con código, prosa en español y JSON, con y sin recorte y con desbordamientos grandes y pequeños; registrar la tabla y decidir umbral y señal. Si no hay un margen claro, registrar que la detección baja a `warning` y ajustar `design.md` antes de seguir
- [ ] 1.3 Contrastar con la documentación oficial lo que citará el post (`docs.ollama.com/context-length`, `docs.ollama.com/api/openai-compatibility`) y comprobar que `/v1/models` sigue sin informar de la ventana; registrar fuentes, códigos HTTP y respuesta

## 2. `harness` (fuera de este repositorio)

- [ ] 2.1 Crear una rama desde `master`, base confirmada por el autor el 2026-11-05. Verificar con `git status` y `npm test` en verde antes de cambiar nada. Rollback: descartar la rama
- [ ] 2.2 Sustituir los 128.000 de `src/providers/openai.ts` por 4.096 con aviso al arrancar sin ventana conocida, y corregir los 200k de `docs/REFERENCE.md`; verificar con un test que configuración y catálogo tienen prioridad sobre el valor por defecto
- [ ] 2.3 Aplicar la reserva `min(maxTokens, 25 % de la ventana)` a `available` y al `max_tokens` enviado, y actualizar la entrada de `maxTokens` en `docs/REFERENCE.md`; verificar con tests de ventanas de 4.096, 16.000 y 32.768 que el espacio útil no queda en 1 token y que los tests que fijan 20.000 y 4.000 no cambian
- [ ] 2.4 Añadir la opción de recorte simulado a `test/fake-provider.ts` y la detección con la señal de la tarea 1.2 en `src/core/loop.ts`, con el final `context_overflow` en `src/core/events.ts` y `src/ui/footer.ts` (o `warning`, según 1.2); verificar con tests que un run recortado no acaba en `end_turn`, que un run sin recorte no lo dispara y que la historia sigue en `messages`
- [ ] 2.5 Hacer que un turno recortado no actualice `measured` y que `/context` no reescale con ese dato; verificar con tests de `contextTokens()` y de `/context`
- [ ] 2.6 Hacer que `compact()` lance un error si su propia petición sale recortada, sin sustituir la conversación; verificar con un test que la historia queda intacta y se emite `warning`
- [ ] 2.7 Comprobar el efecto sobre el replay; verificar con `test/replay.test.ts` y documentar en `docs/REFERENCE.md` qué pasa con sesiones grabadas sin ventana configurada. Registrar `npm test` y `npm run typecheck`. La integración en `master` la hace el autor

## 3. `lab-harness-local` (fuera de este repositorio)

- [ ] 3.1 Crear una rama desde `main` y derivar de `harness` `src/context/manager.ts`, sin lo que aún no existe (imágenes, thinking), con su integración en `src/core/loop.ts`, la reserva, la detección y la protección de `compact()`; verificar con tests derivados sobre `test/fake-provider.ts`, incluido un test por escalón y otro por el final de la tarea 1.2
- [ ] 3.2 Añadir `--context-window` a `src/cli.ts` y `src/index.ts`, con la línea de contexto por turno y los eventos `context` y `warning`; verificar ejecutando `examples/demo` contra el servidor de 4.096 y comprobando que no compacta en cada turno. Registrar la salida
- [ ] 3.3 Crear `examples/desbordar.ts`, con conversación fija generada con semilla y texto realista; verificar ejecutándolo varias veces contra el servidor de 4.096 que devuelve HTTP 200 y un `prompt_tokens` estable, y registrar respuestas y tiempos
- [ ] 3.4 Cargar `AGENTS.md` de la raíz del workspace en el system prompt; verificar con un test que su contenido sigue en la petición tras compactar y con otro que el run funciona sin el fichero
- [ ] 3.5 Comparar con `harness` nombres de módulos, tipos y finales; registrar la lista de diferencias y justificar cada una como recorte. Actualizar el README, y verificar con `grep -n -i -E 'claude code|codex|cursor' README.md` sin resultados y siguiendo el README desde un clon limpio
- [ ] 3.6 Ejecutar el harness sobre el propio repositorio con `--context-window 4096` hasta ver los escalones actuando, guardar la salida en `examples/salidas` y actualizar su README; registrar cuántas ejecuciones se hicieron y cuántas mostraron cada escalón, sin presentar ninguna como garantía
- [ ] 3.7 Buscar secretos y datos de la máquina con `git log -p main..HEAD | grep -n -i -E 'KM-M54|/Users/|sk-[a-z0-9]|api[_-]?key=.+'` y comprobar autor con `git log --format='%an <%ae>'`; registrar la salida. Si aparece algo, corregir antes de seguir
- [ ] 3.8 Pedir confirmación al autor, registrar pregunta y respuesta literales, hacer push de la rama y abrir la PR (con el credential helper de `gh` si git da 403). Tras el merge, que hace el autor, crear el tag `parte-3` sobre `main`; verificar con `git ls-remote --tags` y con un clon limpio del tag que `npm install` y `npm test` pasan y que `parte-2` no se ha movido. Rollback: decide el autor

## 4. Post

- [ ] 4.1 Cerrar con el autor título y slug, y preguntar por la imagen destacada; registrar respuestas. Si aporta imagen, convertirla con `sharp` a WebP de 1600×900 en `public/images/blog/<slug>.webp` y verificar formato, dimensiones y peso. Si no, verificar que se muestra el placeholder de marca
- [ ] 4.2 Crear `src/content/blog/<slug>.mdx` con `category: "Guía"`, `series: { id: asistente-codigo-local, part: 3 }` y la estructura de `design.md`, con `draft: false` para QA real; verificar con `npm run build` sin errores y registrar el número de páginas. Rollback: `git checkout`/`git clean` del fichero
- [ ] 4.3 Verificar las reglas de la serie sobre el MDX: `grep -n -i -E 'claude code|codex|cursor|copilot|privacidad|tu empresa|corporativ'` sin resultados, listas de una línea sin sublistas, comandos de Linux y referencia a WSL2; registrar la salida
- [ ] 4.4 Comprobar que cada extracto de código existe literalmente en el tag `parte-3` y que cada enlace al repositorio apunta a ese tag; ejecutar los comandos del post en orden desde un clon limpio y registrar la salida. Cifras: solo de ejecuciones registradas aquí o de fuentes citadas, declarando cuántas ejecuciones son

## 5. Serie y configuración

- [ ] 5.1 Actualizar `src/content/series/asistente-codigo-local.yaml`: título y resumen de la parte 3, y `/compact` y `/context` en «Interfaz e integración»; verificar con `npm run build` y en `dist/` la página de la serie y el bloque de navegación
- [ ] 5.2 Actualizar en `openspec/config.yaml` la entrada de la serie: quitar el requisito de arreglar los 128.000, aclarar la deuda de `maxTokens` (reserva proporcional, sin opción configurable), registrar `/api/ps` como pendiente sin asignar y actualizar el contexto si la tarea 1.2 cambió la decisión; verificar con `grep -n '128.000\|api/ps\|maxTokens' openspec/config.yaml` y `openspec validate add-context-window-post --strict`

## 6. Integración y publicación

- [ ] 6.1 Con el post en `draft: false` para QA real, verificar en `dist/` el antetítulo «Parte 3», el bloque de navegación en las partes 1, 2 y 3 y que no se listan entre sí en relacionados; registrar el resultado
- [ ] 6.2 Verificar Q01 (sin JS, con la limitación de `.reveal` si sigue pendiente en `main`), Q02 a 360/390/768/1440px, también en bloques de código y tablas, Q03, Q04, Q05 (Lighthouse móvil >= 90, sin regresión de más de 5 puntos, con la limitación ya registrada si sigue vigente), Q07 (enlaces internos y externos) y Q08; registrar el resultado de cada uno
- [ ] 6.3 Antes de archivar, preguntar al autor si confirma publicar este post y registrar aquí pregunta y respuesta literales. Con confirmación, dejar `draft: false`. Sin ella, dejar `draft: true` y registrar que no hubo confirmación; verificar con `grep -n '^draft:'` sobre el MDX

## Workflow follow-up

- Integrar la PR del lab y crear el tag `parte-3` antes de publicar el post, porque sus enlaces dependen de él. El merge lo hace el autor.
- Archivar el change en la misma rama antes del merge y ejecutar `openspec validate --all --strict`.
- El merge de la PR de este repositorio lo hace el autor.
