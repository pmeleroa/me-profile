## 1. Decisiones pendientes con el autor (ver `design.md` - Open Questions)

- [x] 1.1 Decidir el modelo: `qwen2.5-coder:7b` (el del post de Ollama) o un modelo generalista. Registrar en `design.md` la decisión y su motivo, y moverla de Open Questions a Decisions.
  - Decisión del autor (2026-10-08): "la generalista" → `qwen2.5:7b` (4.7GB, ventana de 32K según `ollama.com/library/qwen2.5`), con `qwen2.5:3b` como alternativa con menos RAM. Registrada en `design.md` - Decisions y retirada de Open Questions.
- [x] 1.2 Decidir el tamaño del golden set y de cada split (propuesta: unos 40 casos, 25 `dev` / 15 `test`). Registrar en `design.md`.
  - Decisión del autor (2026-10-08): "ok, es para un articulo, no hay que esforzarse mucho mas" → 40 casos, 25 `dev` / 15 `test`, `bug` mayoritaria (~40-45%) y 5-6 casos `ambiguo`/`trampa` en `dev`. Registrada en `design.md` - Decisions.
- [x] 1.3 Decidir dónde vive el código y el golden set que ve el lector: bloques completos en el post, ficheros descargables en `public/` o repositorio/gist aparte. Registrar en `design.md` y ajustar las tareas 4.x si cambia el supuesto actual (bloques completos en el post).
  - El autor planteó primero no publicar ni el script ni el golden set ("no me gustaría publicar el contenido del script de evaluación ni el conjunto de golden set") y después lo cambió: "incluiremos fuente y golden sets en el repo y que sean accesibles". Decisión intermedia: carpeta `ejemplos/golden-set-eval/` en la raíz de `me-profile`, enlazada desde el post en GitHub; el post no pega el script ni el set completos. Después el autor decide un repositorio aparte: "trabajaremos en un repositorio aparte, no quiero condicionar la prueba al clonado de mi repo de página de Astro", con nombre `lab-golden-set-eval`. Decisión final: `pmeleroa/lab-golden-set-eval`, público, MIT, enlazado desde el post por el tag `v1.0`. Registrada en `design.md` - Decisions; tareas 2.x, 3.x, 4.1 y 5.4 ajustadas.
- [x] 1.4 Decidir título y slug. Registrar en `design.md`.
  - Decisión del autor (2026-10-08): "el 1" → "Golden sets: cómo saber si tu prompt ha mejorado o solo lo parece", slug `golden-sets-y-pipelines-de-evaluacion`. Registrada en `design.md` - Decisions.
  - Ajuste posterior del autor: "no te centres en el prompt, extiéndelo a agentes o skills" → título "Golden sets: cómo saber si tu IA ha mejorado o solo lo parece" (respuesta: "perfecto"); slug sin cambios.
- [x] 1.5 Preguntar al autor si aporta imagen destacada. Registrar la respuesta literal en esta tarea.
  - Respuesta del autor (2026-10-08): "de momento usa el placeholder de marca. ya la incluiremos después." → el post sale sin `image`; la imagen queda para un change posterior.
  - Cambio posterior del autor durante el apply: "¿dónde tengo que dejar la imagen para el post?" y después "la he subido". La imagen entra en este change (tarea 5.5).

## 2. Golden set ficticio

Todo este bloque se ejecuta en `pmeleroa/lab-golden-set-eval` (clon local en `~/workspaces/personal/lab-golden-set-eval`), fuera de `me-profile`. Cada tarea registra aquí el commit y la salida real.

- [x] 2.0 Pedir al autor OK explícito para crear el repositorio y, con él, ejecutar `gh repo create pmeleroa/lab-golden-set-eval --public --license mit --clone` desde `~/workspaces/personal/` con la cuenta `pmeleroa`. Registrar pregunta y respuesta literales. Verificación: `gh repo view pmeleroa/lab-golden-set-eval --json visibility,licenseInfo` → `PUBLIC`, `MIT`.
  - Pregunta (2026-10-08): "¿Me das el OK para crear el repo?" (con el comando, la cuenta `pmeleroa`, visibilidad pública, MIT y clon local). Respuesta del autor: "ok".
  - Ejecutado `cd ~/workspaces/personal && gh repo create pmeleroa/lab-golden-set-eval --public --license mit --clone` → `https://github.com/pmeleroa/lab-golden-set-eval`, clonado con `LICENSE` y commit `86ddc1b Initial commit`. `gh repo view ... --json visibility,licenseInfo` → `PUBLIC`, `mit` (MIT License), rama por defecto `main`.

- [x] 2.1 Escribir `guia-etiquetado.md`: definición de cada categoría (`facturación`, `bug`, `acceso`, `petición`) y regla de desempate cuando un ticket encaja en dos. Verificación: cada regla se puede aplicar a un ticket de ejemplo sin ambigüedad (registrar 2 ejemplos aplicados).
  - Escrito `guia-etiquetado.md` en `pmeleroa/lab-golden-set-eval`: tabla con las 4 categorías, 4 reglas (1: se etiqueta por lo que hay que hacer, no por las palabras; 2: si mezcla dos problemas, gana el que impide usar el producto ahora, con orden `acceso` > `bug` > `facturación` > `petición`; 3: lo que funciona como está diseñado es `petición`; 4: las dudas se etiquetan por el tema) y la descripción de los campos.
  - Ejemplo aplicado 1: "La página de facturas me da un error 500 cada vez que intento abrirla." → regla 1 → `bug` (hay que arreglar la página, no revisar un cobro).
  - Ejemplo aplicado 2: "No puedo entrar en mi cuenta y además me habéis cobrado dos veces este mes." → regla 2 → `acceso` (gana a `facturación` en el orden de desempate).
- [x] 2.2 Escribir `dev.jsonl` y `test.jsonl` con tickets inventados, siguiendo la guía y el tamaño de la 1.2: campos `id`, `input`, `expected`, `dificultad`, `nota`; cobertura de las 4 categorías en ambos splits, casos `ambiguo` y `trampa`, y una categoría claramente mayoritaria. Ningún dato real ni del autor. Verificación: un script de una línea con `python3` que valide que cada línea es JSON válido, que `expected` pertenece al conjunto cerrado y que los `id` son únicos entre splits; registrar la distribución por categoría y dificultad de cada split.
  - Generados `dev.jsonl` y `test.jsonl` (tickets inventados para una aplicación web de suscripción genérica; ningún dato real). Validación con `python3 -I -c` (JSON válido, `expected` en el conjunto cerrado, `dificultad` válida, `id` únicos entre splits):
    ```
    dev 25 {'bug': 11, 'facturación': 6, 'acceso': 5, 'petición': 3} {'fácil': 19, 'trampa': 3, 'ambiguo': 3}
    test 15 {'bug': 6, 'facturación': 4, 'acceso': 3, 'petición': 2} {'fácil': 11, 'trampa': 2, 'ambiguo': 2}
    OK, ids únicos: 40
    ```
    `bug` es mayoritaria: 44% en `dev`, 40% en `test`.
- [x] 2.3 Revisión manual del golden set por el autor antes de congelarlo. Registrar las etiquetas que cambien y por qué. A partir de aquí no se modifica `test.jsonl` (ver `design.md` - Risks).
  - Pregunta (2026-10-08), con la tabla de los 10 casos `ambiguo`/`trampa` y enlace a los 30 fáciles: "¿Das por bueno el golden set tal cual, o quieres cambiar alguna etiqueta, caso o regla?" Respuesta del autor: "ok". Ninguna etiqueta cambia. Golden set congelado en el commit `5c1b37b` de `pmeleroa/lab-golden-set-eval`: `test.jsonl` no se vuelve a modificar.

## 3. Pipeline de evaluación

- [x] 3.1 Contrastar con la documentación oficial de la API de Ollama (`docs.ollama.com/api/chat`) el formato de `POST /api/chat` con `"stream": false` y `options.temperature`. Registrar la fuente y la fecha.
  - Fuente: `https://docs.ollama.com/api/chat`, consultada el 2026-10-08. `ChatRequest`: `model` y `messages` obligatorios; `stream` booleano, por defecto `true`; `options` es un `ModelOptions` ("Runtime options that control text generation") que incluye `temperature` y `seed` ("Random seed used for reproducible outputs"); `format` admite `json` o un JSON Schema (fuera de alcance). Con `"stream": false` la respuesta 200 es `application/json` con un único `ChatResponse`: `message.role`, `message.content`, `done`, `done_reason` y métricas de tiempo y tokens. La documentación no dice cómo de fiable es la reproducibilidad con `seed` fijo, así que el post no lo promete.
  - Ajuste derivado: además de `temperature: 0`, el pipeline fija `seed` en `options` y lo guarda en la configuración del run. Registrado en `design.md`.
  - Entorno de la máquina del autor: Ollama 0.40.1, Python 3.14.7. `qwen2.5:7b` no estaba descargado; se descarga con `ollama pull qwen2.5:7b`.
- [x] 3.2 Escribir `eval.py` (Python 3, solo biblioteca estándar) con las cinco etapas de `design.md`: cargar split, ejecutar y guardar el run (respuestas crudas + modelo, temperatura y versión del prompt) en `runs/`, normalizar con inválidos aparte, puntuar (accuracy, baseline mayoritario, precisión y recall por clase, matriz de confusión, desglose por dificultad) y comparar con un run anterior caso a caso. Escribir también `README.md` con prerrequisitos (Python 3, Ollama, `ollama pull qwen2.5:7b`) y los comandos de uso. Verificación: `python3 -I eval.py --help` y una ejecución sobre `dev` que genera el fichero de run y el informe sin errores, siguiendo los comandos del README tal y como están escritos.
  - Escritos `eval.py` (subcomandos `run` y `report`; las cinco etapas marcadas con comentarios `# 1.` a `# 5.`; el run guarda la respuesta cruda y se normaliza al puntuar, de modo que `report` puede repuntuar un run sin llamar al modelo; la comparación se niega si los runs usan versiones distintas del split, por `split_sha`), `prompts/v1.txt` y `README.md` (requisitos, comandos Linux idénticos en macOS, WSL2 para Windows, enlace al post en `https://pablomeleroalonso.me/blog/golden-sets-y-pipelines-de-evaluacion/`).
  - `python3 -I eval.py --help` → muestra los subcomandos `run` y `report` sin errores.
  - Ejecución de humo con el comando del README (`python3 eval.py run --split dev --prompt prompts/v1.txt`, con `--salida` hacia el scratchpad para no versionarla): 25 casos en ~25 s, run guardado e informe sin errores. Resultado: 0/25, 25 inválidas. Las respuestas crudas muestran que el modelo suele acertar la categoría pero la envuelve en prosa (p. ej. `'Categoría: Bug\n\nDescripción del problema: ...'`): es un fallo de formato, no del script.
- [x] 3.3 Comprobar la puntuación y la comparación con un run de prueba construido a mano (respuestas conocidas, incluida una inválida y una regresión) y registrar que las métricas coinciden con el cálculo manual.
  - Dos runs construidos a mano en el scratchpad (6 casos; respuestas del actual: `bug`, `Bug.`, `facturacion`, `Creo que es acceso`, `bug`, `acceso`) y `python3 -I eval.py report actual.json --comparar anterior.json`. Cálculo manual frente a salida: accuracy 3/6 = 50% ✓; baseline `bug` 3/6 = 50% ✓; 1 inválida ✓; `bug` precisión 2/3 = 67% y recall 2/3 = 67% ✓; `facturación` 100%/100% ✓; `acceso` 0%/0% ✓; `petición` precisión `-` (nunca predicha) y recall 0% ✓; matriz de confusión ✓; por dificultad fácil 2/2, ambiguo 1/2, trampa 0/2 ✓; comparación: arreglados `A`, regresiones `D, F` ✓. La normalización acepta mayúsculas, punto final y la falta de tilde (`Bug.`, `facturacion`) y marca como inválida una frase (`Creo que es acceso`).
  - Ajuste tras la comprobación: columnas de la matriz ensanchadas para no cortar los nombres de categoría.
- [x] 3.4 Run 1 sobre `dev` con el prompt inicial y el modelo de la 1.1. Guardar el run y registrar aquí la salida real del informe.
  - `python3 eval.py run --split dev --prompt prompts/v1.txt` → `runs/dev-v1.json`. Prompt v1: "Eres un asistente del equipo de soporte. Clasifica el ticket del cliente en una de estas categorías: facturación, bug, acceso, petición." Salida real:
    ```
    Modelo: qwen2.5:7b | prompt: v1.txt (96a29518) | split: dev (fb45641d)
    Accuracy:           0/25 = 0%
    Baseline ('bug' siempre): 11/25 = 44%
    Respuestas inválidas: 25
    ```
    Todas las respuestas son prosa en torno a la categoría (p. ej. `Categoría: Bug\n\nDescripción del problema: ...`): fallo de formato, no de clasificación.
  - Dato de determinismo: frente a la ejecución de humo de la 3.2 (misma configuración, `temperature: 0`, `seed: 42`), 24 de 25 respuestas crudas son idénticas.
- [x] 3.5 Iterar el prompt mirando los fallos de `dev` y hacer el run 2. Registrar la comparación caso a caso (arreglos y regresiones) con la salida real.
  - Run 2, `prompts/v2.txt` (v1 + "Responde únicamente con el nombre de la categoría, en minúsculas y sin ningún otro texto."), con `--comparar runs/dev-v1.json` → `runs/dev-v2.json`: accuracy 22/25 = 88% (baseline 44%), 0 inválidas; fácil 19/19, ambiguo 2/3, trampa 1/3. Arreglados 22, regresiones 0. Fallos: `dev-09` (trampa, `bug` → `facturación`), `dev-11` (ambiguo, `bug` → `facturación`), `dev-24` (trampa, `petición` → `bug`).
  - Run 3, `prompts/v3.txt` (definiciones de categoría y reglas 1-3 de `guia-etiquetado.md`, sin referencias a casos concretos), con `--comparar runs/dev-v2.json` → `runs/dev-v3.json`: accuracy 25/25 = 100%, 0 inválidas; ambiguo 3/3, trampa 3/3. Arreglados `dev-09, dev-11, dev-24`; regresiones 0.
  - Prompt final para `test`: v3.
- [x] 3.6 Ejecutar una única vez sobre `test` con el prompt final. Registrar la salida real sin repetir la ejecución ni retocar nada después.
  - Ejecutado una sola vez: `python3 eval.py run --split test --prompt prompts/v3.txt` → `runs/test-v3.json`. Salida real:
    ```
    Modelo: qwen2.5:7b | prompt: v3.txt (954b777a) | split: test (9e3eb496)
    Accuracy:           14/15 = 93%
    Baseline ('bug' siempre): 6/15 = 40%
    Respuestas inválidas: 0

    Por clase        precisión  recall
      facturación         100%     75%
      bug                 100%    100%
      acceso              100%    100%
      petición             67%    100%

    Por dificultad
      fácil    10/11
      ambiguo  2/2
      trampa   2/2
    ```
    Único fallo: `test-07` (fácil, "Quiero pasar del plan mensual al anual, ¿cómo lo hago?"), `facturación` → `petición`. El 100% de `dev` no se sostiene en `test`; cada caso de `test` pesa 6,7 puntos. No se repite la ejecución ni se modifica nada.
- [x] 3.7 Si el modelo apenas falla en `dev` antes de la 3.6, ajustar los casos de `dev` (nunca `test`) y registrar el motivo (ver `design.md` - Risks).
  - No aplica: con v2 el modelo falla 3 de 25 casos en `dev`, todos `ambiguo` o `trampa`, así que el golden set tiene dónde fallar sin ajustes. No se modificó ningún caso.
- [x] 3.8 Hacer commit de `README.md`, `guia-etiquetado.md`, los dos splits, `eval.py`, los prompts y los runs que citará el post, y hacer push a `main` de `pmeleroa/lab-golden-set-eval` (si git da 403 con la cuenta de trabajo, usar el credential helper de `gh`). Verificación: `git status -sb` sin divergencia con `origin/main`.
  - Commits `5c1b37b` (guía, splits, `eval.py`, README, prompt v1) y `656bd2a` (prompts v2-v3 y runs `dev-v1`, `dev-v2`, `dev-v3`, `test-v3`). El primer push dio 403 con la cuenta de trabajo (`pablo-melero-ext_MyI`); repetido con `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin main` → `86ddc1b..656bd2a  main -> main`; `git status -sb` → `## main...origin/main`.
  - Desviación: el tag `v1.0` se crea en la tarea 4.8, después de redactar el post, para no tener que mover un tag publicado si la redacción obliga a retocar el repositorio.

## 4. Redacción del artículo

- [x] 4.1 Escribir `src/content/blog/golden-sets-y-pipelines-de-evaluacion.mdx` con frontmatter (`title`, `description`, `publishDate`, `category: "Guía"`, `tags`, `draft: false` durante el apply para poder hacer QA real, sin `series`, sin `image` inicialmente según la 1.5; añadida en la 5.5) y el cuerpo según la estructura de `design.md`. El post no pega el script ni el set completos: enlaza a `https://github.com/pmeleroa/lab-golden-set-eval/tree/v1.0` y muestra la guía de etiquetado, 3-4 casos de ejemplo, extractos cortos de código y salidas de los runs guardados en la sección 3. Verificación: cada extracto de código, caso y salida del post aparece literalmente en el tag `v1.0` de `pmeleroa/lab-golden-set-eval` (comprobado con `grep -F` o `diff`).
  - Escrito `src/content/blog/golden-sets-y-pipelines-de-evaluacion.mdx`: frontmatter con `publishDate: 2026-10-08`, `category: "Guía"`, `tags: ["ia-generativa", "evaluacion", "llm-local", "herramientas-dev"]`, `draft: false`, sin `series` ni `image`. Secciones en el orden de `design.md`.
  - Verificación con un script `python3 -I` que busca cada línea de los 13 bloques de código del post en los ficheros del repositorio y en las salidas de `eval.py report` sobre los runs guardados: todas aparecen literalmente salvo `git clone --branch v1.0 ...` y `cd lab-golden-set-eval`, que son comandos del lector (verificados en la 4.4). Recortes declarados con `...` en el bloque del run 3.
- [x] 4.2 La intro declara que el post surge de la lectura del artículo de GitHub sobre ReviewBench (con enlace), y que el caso y los datos son ficticios y las cifras salen de ejecutar el pipeline. Verificación: relectura y cita de las frases en esta tarea.
  - Origen: "Este post surge de la lectura de [ReviewBench: an open benchmark for AI code review](https://github.blog/ai-and-ml/github-copilot/reviewbench-an-open-benchmark-for-ai-code-review/), publicado por GitHub el 5 de octubre de 2026."
  - Datos ficticios: "Los tickets son **ficticios** y están construidos para ilustrar el método. Las cifras que verás en esta guía sí son reales: salen de ejecutar el pipeline con un modelo local." 
- [x] 4.3 Contrastar cada dato de ReviewBench citado en el post con el artículo original de GitHub y enlazarlo. Registrar la lista de datos y su comprobación.
  - Contrastado de nuevo con el artículo original el 2026-10-08. Datos citados y frase de apoyo:
    - 5 de octubre de 2026: fecha del artículo.
    - 219 PRs de 187 repositorios: "ReviewBench contains 219 pull requests from 187 public open source licensed repositories spanning 19 languages."
    - Rúbrica común: "Validate findings under a shared rubric."
    - LLM como juez: "We use Claude Sonnet 5 as the LLM grader, applying a consistent evaluation rubric across all submissions."
    - Grounded / augmented: "Grounded precision, recall, and F1 score use only the existing gold-set labels." / "Augmented ... also evaluate findings that do not match anything in the golden set."
    - 96,6%: senior engineers "re-label every ground-truth finding from scratch ... agreed with ReviewBench 96.6% of the time".
    - 227% frente a 262%: "it predicted a 227% increase in critical comments, compared with 262% online."
    - Tres ejecuciones: "run the full set of 219 pull requests (three rounds)", en el proceso de envío al leaderboard.
  - Correcciones aplicadas al post y a `design.md` tras el contraste: el 96,6% valida las etiquetas del golden set, no al juez; el cambio se evaluó offline antes de un A/B, no antes de un despliegue; las tres ejecuciones son un requisito del leaderboard, no una práctica general; "coincidió" pasa a "anticipó" (227% frente a 262%).
- [x] 4.4 Todos los comandos son para terminal Linux, idénticos en macOS, con Windows cubierto solo con el enlace a la guía oficial de WSL2 de Microsoft. Verificación: ejecutar en la máquina del autor los comandos tal y como aparecen en el post, en un directorio limpio con los ficheros copiados del post.
  - Ejecutado en un directorio limpio del scratchpad, tal y como aparecen en el post: `ollama pull qwen2.5:7b` → `success`; `git clone --branch v1.0 https://github.com/pmeleroa/lab-golden-set-eval.git` y `cd lab-golden-set-eval` → HEAD `656bd2a`; `python3 eval.py report runs/dev-v2.json` → `Accuracy: 22/25 = 88%`; `python3 eval.py run --split dev --prompt prompts/v2.txt --comparar runs/dev-v1.json` → `Accuracy: 22/25 = 88%`, arreglados 22, regresiones 0, igual que el run publicado. Comandos idénticos en Linux y macOS; Windows remite a la guía oficial de WSL2.
- [x] 4.5 Enlazar el post de Ollama como prerrequisito y mencionar la salida estructurada (`format`) solo como mejora fuera de alcance, sin desarrollarla. Verificación: relectura.
  - Enlace interno a `/blog/ollama-primeros-pasos-asistente-de-codigo-local` en "El caso de ejemplo". `format` aparece solo en "Lo que esta guía no cubre": "Ollama puede restringir la respuesta a un JSON Schema con el campo `format` ... Lo dejo fuera a propósito, porque aquí los inválidos son parte de la lección." 
- [x] 4.6 Redactar el cierre con la postura del autor según `design.md`: en un entorno empresarial con cierto grado de madurez, evaluar con golden sets y pipelines es necesario. En primera persona, apoyada en ReviewBench, reconociendo el límite (prototipos y uso personal) y sin cifras de adopción ni estudios sin fuente. Verificación: relectura y cita del párrafo en esta tarea; toda cifra citada está en la 4.3.
  - Sección "En una empresa, no es opcional": "Para un prototipo o una herramienta personal, montar todo esto puede no compensar, y probar a mano unos cuantos casos es razonable. Pero en una empresa con cierto grado de madurez, creo que un golden set y un pipeline de evaluación son completamente necesarios." Se apoya en ReviewBench (predicción offline frente a A/B, contrastado en la 4.3); sin cifras de adopción ni estudios.
- [x] 4.7 Redactar la sección "Del prompt al agente" según `design.md` (resultado y trayectoria en agentes, juez LLM con la tensión grounded/augmented de ReviewBench, activación y ejecución en skills), sin código ni cifras propias. Verificación: relectura; toda afirmación sobre ReviewBench está contrastada en la 4.3 y no se presenta ninguna cifra sin fuente.
  - Sección "Del prompt al agente": resultado y trayectoria; juez con grounded/augmented y el 96,6% atribuido a las etiquetas (4.3); activación y ejecución en skills; más variación entre ejecuciones. Sin código ni cifras propias.

- [x] 4.8 Crear y publicar el tag `v1.0` en `pmeleroa/lab-golden-set-eval` sobre el commit final (con el push vía credential helper de `gh` si hace falta). Verificación: `curl -s -o /dev/null -w "%{http_code}" https://github.com/pmeleroa/lab-golden-set-eval/tree/v1.0` → `200`; registrar el SHA del tag.
  - `git tag -a v1.0` sobre `656bd2a` (sin cambios en el repositorio durante la redacción) y push con el credential helper de `gh` → `* [new tag] v1.0 -> v1.0`. Objeto del tag `518066a868e6d88a9787025455546112aef6c8be`, commit `656bd2ac57a9ab91e3ddadafb1cf9817375ef33e`. `curl ... https://github.com/pmeleroa/lab-golden-set-eval/tree/v1.0` → `200`.

## 5. Calidad transversal

- [x] 5.1 Checks Q01-Q08 con el post en `draft: false`, como en el precedente `add-ollama-local-guide-post`: contenido sin JS, bloques de código y tablas sin scroll horizontal de página (360/390/768/1440px), jerarquía de encabezados y texto de enlaces, sin animación propia, sin imágenes nuevas (placeholder de marca), enlaces externos e internos con `200`, sin HTML arbitrario ni PII. Registrar cada resultado.
  - Q01: MDX de texto y bloques de código, sin `<script>` ni HTML propios; los 6 `<script>` del HTML generado son de la plantilla (los mismos 6 que en el post de Ollama).
  - Q02: sin tablas en el post; los bloques de código con líneas largas (JSONL) usan `.article-content pre { overflow-x: auto }` de `src/pages/blog/[slug].astro`, así que el scroll queda dentro del bloque, no en la página. Mismo mecanismo verificado en el precedente.
  - Q03: un único `<h1>`, después `h2`/`h3` sin saltos de nivel (El caso de ejemplo → Montar el golden set con 4 `h3` → Montar el pipeline con 5 `h3` → Leer los resultados con 4 `h3` → Del prompt al agente → Lo que esta guía no cubre → En una empresa, no es opcional). Los enlaces usan texto descriptivo, no URLs desnudas.
  - Q04: sin animación propia; solo la `.reveal` de la plantilla, sin tocar.
  - Q05: sin imágenes ni dependencias nuevas. Las 5 `<img>` del HTML son logo, avatar y las 3 tarjetas de artículos relacionados. Lighthouse no está instalado en el proyecto, igual que en el precedente.
  - Q06: el estado final de `draft` se decide en la 6.1.
  - Q07: enlaces externos con `curl -sL` → `200`: artículo de ReviewBench, `tree/v1.0`, `tree/v1.0/runs`, `blob/v1.0/eval.py`, `blob/v1.0/guia-etiquetado.md` y la guía de WSL2. El enlace interno `/blog/ollama-primeros-pasos-asistente-de-codigo-local` existe en `dist/`.
  - Q08: sin HTML embebido, sin datos de usuario ni PII; los tickets son ficticios.
- [x] 5.2 `npm run build` sin errores y con el post generado en `dist/blog/golden-sets-y-pipelines-de-evaluacion/index.html`. Registrar el número de páginas.
  - `npm run build` → `66 page(s) built`, `Complete!`. Existe `dist/blog/golden-sets-y-pipelines-de-evaluacion/index.html` (50.8K) y el slug aparece 2 veces en `dist/blog/index.html`.
- [x] 5.3 Actualizar `openspec/config.yaml` (`rules.design`): (a) en la entrada de trabajo futuro del post de elección de modelo, indicar que puede reutilizar este pipeline y `pmeleroa/lab-golden-set-eval`; (b) añadir una entrada de trabajo futuro, pedida por el autor ("añádelo como trabajo futuro, me parece buena idea"), para una segunda parte independiente: "quién evalúa al evaluador". Categoría propuesta: Guía. Usaría una tarea con salida libre (por ejemplo, el borrador de respuesta a un ticket), un juez LLM y un golden set propio del juez para medir su acuerdo con etiquetas humanas, como hace ReviewBench. El autor lo considera un patrón distinto al de este post. Sin cifras sin medición propia o fuente citada. Verificación: `openspec validate add-golden-set-eval-pipeline-post --strict` válido.
  - (a) Añadido a la entrada del post de elección de modelo: puede reutilizar el pipeline de este post (`pmeleroa/lab-golden-set-eval`, `eval.py` acepta `--modelo`) con un golden set propio de tareas de código. (b) Nueva entrada de trabajo futuro "quién evalúa al evaluador" (Guía; salida libre, juez LLM y golden set del juez; patrón distinto; sin cifras sin fuente).
  - `openspec instructions design ... --json` carga 11 reglas e incluye las dos entradas modificadas; `openspec validate add-golden-set-eval-pipeline-post --strict` → válido.
- [x] 5.4 Rollback: registrar que el change solo añade un fichero nuevo (el post) y una línea en `openspec/config.yaml`; el rollback es `git revert` del commit o PR. El repositorio `pmeleroa/lab-golden-set-eval` es independiente: retirarlo no afecta al sitio, solo rompería el enlace del post.
  - Ficheros tocados en `me-profile`: `src/content/blog/golden-sets-y-pipelines-de-evaluacion.mdx` (nuevo), `openspec/config.yaml` (dos entradas de `rules.design`) `public/images/blog/golden-sets-y-pipelines-de-evaluacion.webp` (nuevo) y los artefactos del change. Rollback: `git revert` del commit o PR. Para retirar el ejemplo, `pmeleroa/lab-golden-set-eval` se archiva o se borra aparte.
- [x] 5.5 Incorporar la imagen destacada aportada por el autor: convertirla a WebP 1600×900 con `sharp` en `public/images/blog/golden-sets-y-pipelines-de-evaluacion.webp`, añadir `image` al frontmatter y repetir build y Q05/Q07. Verificación: formato y dimensiones reales del fichero, `<img>` en el HTML generado y `npm run build` sin errores.
  - El fichero subido era un PNG (`file` → `PNG image data, 1672 x 941`, 2.033.439 bytes) con extensión `.webp`. Original guardado en el scratchpad; convertido con `sharp(...).resize(1600, 900, {fit: 'cover'}).webp({quality: 75})` → `webp 1600x900 147612` bytes. `file` → `Web/P image, VP8 encoding, 1600x900`.
  - Añadido `image: "/images/blog/golden-sets-y-pipelines-de-evaluacion.webp"` al frontmatter. `npm run build` → `66 page(s) built`, sin errores; la ruta de la imagen aparece 4 veces en el HTML del post (cabecera y metadatos sociales) y 1 en la tarjeta de `dist/blog/index.html`. Q05: 148KB, en línea con el resto de imágenes del blog (51-253KB). Q07: sin enlaces nuevos.
- [x] 5.6 Añadir un gráfico de barras con la accuracy de cada run y el baseline al inicio de "Leer los resultados e iterar", según `design.md`. Pedido por el autor ("revisa el contenido del blog por si fuese interesante incluir algún tipo de gráfico"; tras la propuesta: "añádelo"). Verificación: build, render real en navegador a varios anchos y checks Q01-Q03.
  - Implementado como `<figure>` con filas en CSS grid y estilos en línea dentro del MDX. Valores: dev v1 0% (25 inválidas), dev v2 88%, dev v3 100%, test v3 93%; baseline 44% en dev y 40% en test, iguales a los runs de la 3.4-3.6.
  - `node scripts/validate_palette.js "#00BDD4" --mode dark --surface "#08080f"` (skill `dataviz`): contraste PASS (≥3:1) y croma PASS; banda de luminosidad FAIL, que solo aplica a paletas categóricas (una serie, sin identidad que distinguir).
  - `npm run build` → `66 page(s) built`. Primer render con `astro preview` y Chrome: el pie salía a tamaño de párrafo porque MDX envolvía su texto en `<p>`. Corregido poniéndolo en una sola línea; en el HTML generado queda `<figcaption style="...font-size:0.85rem...">` con 13.6px calculados.
  - Responsive con la página cargada en iframes de 360, 390 y 768 px: `scrollWidth` igual al ancho de la ventana en los tres casos, sin desbordamiento de la figura (312, 342 y 712 px). Columnas etiqueta/barra/valor de 76/124/88 px a 360 px; captura a 390 px revisada: texto legible y sin solapes.
  - Q01: HTML estático, sin JS. Q03: barras `aria-hidden`; etiquetas, valores y pie en `--color-text`.

## 6. Publicación

- [x] 6.1 Antes de archivar, preguntar al autor si confirma publicar este post. Registrar pregunta y respuesta literales. Sin confirmación explícita, fijar `draft: true`.
  - Pregunta (2026-10-08): "Sigue pendiente la 6.1, tu confirmación para publicar al archivar. [...] ¿Hago commit, push y PR?" Respuesta literal del autor: "si, con el post activo". Confirmación explícita de publicación: el post se mantiene en `draft: false`.
