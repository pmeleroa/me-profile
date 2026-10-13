## Context

Ver `proposal.md` - Why. El post se definió en entrevista con el autor mediante el skill `blog-post`, a partir de la lectura de "ReviewBench: an open benchmark for AI code review" (GitHub Blog, 5 de octubre de 2026, Michelle Zhou y Alejandro Carderera de Diego). De ese artículo el autor se queda con dos ideas: tener golden sets para probar tus sistemas y disponer de pipelines de evaluación. El ranking y la comparación entre herramientas no interesan.

Datos de ReviewBench contrastados en el post original y utilizables en el gancho, siempre con enlace a la fuente:
- 219 pull requests públicos de 187 repositorios en 19 lenguajes.
- Golden set en tres etapas: hallazgos candidatos (revisores humanos, commits de seguimiento, herramientas deterministas y varios LLMs frontier), deduplicación semántica y validación con una rúbrica común, con Claude Sonnet 5 como juez.
- Validación del golden set: ingenieros senior ajenos al dataset re-etiquetaron desde cero cada hallazgo; sus juicios coincidieron con ReviewBench en un 96,6%. Valida las etiquetas, no al juez.
- Métricas grounded (solo cuentan las etiquetas del golden set) frente a augmented (el juez puede dar crédito a hallazgos nuevos); el recall grounded es la métrica principal.
- Predicción frente a producción en Copilot code review: el benchmark predijo +227% de comentarios críticos y el A/B online dio +262%; el A/B dio además +13,6% de recall, +61% de volumen de comentarios y −8,0% de coste por review.
- Para entrar en el leaderboard, cada agente se ejecuta tres veces sobre los 219 PRs.

El lector objetivo es técnico (dev cómodo en terminal y con Python básico). Puede venir del post de Ollama, que es el prerrequisito para tener el servidor local en marcha.

## Goals / Non-Goals

**Goals:**
- Que el lector entienda que un golden set se diseña con intención, no se recopila.
- Que el lector salga con un pipeline de evaluación que funciona, que ha ejecutado él mismo y cuyas salidas sabe leer.
- Enseñar los errores habituales con ejemplos que salen del propio pipeline: creerse un accuracy sin baseline, sobreajustar el prompt al golden set, confundir errores de formato con errores de tarea, celebrar una mejora global que esconde regresiones.

**Non-Goals:**
- Implementar la evaluación de un agente o de una skill reales, o de code review: la sección "Del prompt al agente" lo explica de forma conceptual, sin código ni runs.
- Implementar un juez LLM o métricas augmented (se explican en "Del prompt al agente", no se implementan). Confirmado por el autor como un patrón distinto: el ejemplo tiene respuesta exacta y no hay nada que juzgar, y un juez es a su vez un sistema que necesita su propio golden set (ReviewBench mide sus etiquetas con ingenieros senior: 96,6% de acuerdo). Queda como trabajo futuro en `openspec/config.yaml` (tarea 5.3): una segunda parte, "quién evalúa al evaluador".
- Repeticiones y varianza, intervalos de confianza.
- Salida estructurada de Ollama (`format` con JSON Schema): pertenece a la hoja de ruta de la serie "Asistente de código local". Se menciona en una línea como mejora natural, sin desarrollarla.
- Integración en CI o umbrales que bloqueen un despliegue.
- Elegir o comparar modelos: es el post de Análisis anotado como trabajo futuro. Esta guía no hace afirmaciones sobre qué modelo es mejor.
- Cualquier dato, código o metodología del autor o de este repositorio.

## Decisions

**Guía con caso de ejemplo ficticio y declarado.** El autor quiere enseñar el método, no un caso suyo. Los datos son inventados y el post lo dice al presentar el caso. Las cifras sí son reales: salen de ejecutar el pipeline. Alternativas descartadas: usar el historial de commits de este repositorio como golden set (el autor no quiere datos de su código ni de su forma de trabajar) y un post de Opinión o de Análisis sobre ReviewBench (el autor prefiere una guía accionable).

**Tarea: clasificar tickets de soporte en un conjunto cerrado.** Categorías: `facturación`, `bug`, `acceso`, `petición`. Motivos: cualquier lector puede juzgar si una etiqueta es correcta, los inputs son cortos (la ventana de contexto por defecto de Ollama no interfiere) y la respuesta es exacta, así que se puntúa sin juez. El post dice de frente que esto no es un agente, sino una sola llamada a un LLM, y que el esqueleto (golden set, runner, métrica) es el mismo cuando detrás hay un bucle agéntico. Alternativas descartadas: code review (fiel a ReviewBench, pero obliga a emparejar hallazgos con un juez) y clasificar tipos de commit (inputs largos, choca con la ventana de contexto y se acerca al flujo del autor).

**Golden set: criterio primero, casos después.** La guía de etiquetado (qué es cada categoría y qué gana cuando un ticket encaja en dos) se escribe antes que los casos y se muestra en el post. Es el equivalente a la rúbrica común de ReviewBench.

**Formato: JSONL, un caso por línea.** Campos: `id`, `input`, `expected`, `dificultad` (`fácil` / `ambiguo` / `trampa`) y `nota` (por qué la respuesta es esa). La nota permite revisar el set meses después y discutir etiquetas. Alternativa descartada: CSV, porque los tickets con comas y saltos de línea lo complican.

**Distribución intencional.** Cobertura de las cuatro categorías, casos ambiguos (por ejemplo, un ticket de acceso que también menciona un cobro duplicado) y trampa, y un desbalance controlado: una categoría claramente mayoritaria para que el baseline mayoritario tenga un accuracy alto y el lector vea por qué un porcentaje suelto engaña. Tamaño decidido por el autor (tarea 1.2): 40 casos, 25 en `dev` y 15 en `test`. En cada split, una categoría mayoritaria (`bug`, en torno al 40-45%), y en `dev` 5-6 casos `ambiguo` o `trampa`. Es suficiente para un post ilustrativo: el lector puede revisar el set entero, y que cada caso de `test` pese casi 7 puntos sirve para enseñar por qué una diferencia pequeña puede ser un solo ticket. Alternativa descartada: un set mayor, que convertiría el post en un ejercicio de redactar tickets.

**Partición dev/test.** El set de `dev` se usa para iterar y mirar fallos; el de `test` no se mira y solo se ejecuta al final. El post muestra el error que evita: iterar el prompt sobre los fallos hasta sacar un 100% optimiza para esos casos, no para tickets nuevos. Decidido por el autor frente a dejarlo solo como advertencia.

**Pipeline en cinco etapas, cada una con su artefacto en disco:**
1. Cargar el split (`dev` o `test`).
2. Ejecutar el sistema bajo prueba sobre cada caso y guardar las respuestas en crudo en un fichero de run, junto con la configuración: modelo, temperatura y versión del prompt.
3. Normalizar la respuesta al conjunto cerrado. Lo que no encaja se marca como inválido y se reporta aparte: "el modelo se equivoca" y "el modelo no sigue el formato" son problemas distintos con arreglos distintos.
4. Puntuar: accuracy frente al baseline mayoritario, precisión y recall por clase, matriz de confusión y desglose por dificultad.
5. Comparar con el run anterior caso a caso: qué casos pasan de fallo a acierto y cuáles al revés.

**Código y golden set en un repositorio aparte, enlazados desde el post.** Decidido por el autor (tarea 1.3). Primero se planteó una carpeta en `me-profile`, pero el autor no quiere condicionar la prueba a clonar el repositorio del sitio Astro. Todo vive en `pmeleroa/lab-golden-set-eval` (público, licencia MIT, clonado en `~/workspaces/personal/lab-golden-set-eval`): `README.md` (prerrequisitos y cómo ejecutarlo), `LICENSE`, `guia-etiquetado.md`, `dev.jsonl`, `test.jsonl`, `eval.py` y `runs/` con los runs que cita el post. El post no pega el script ni el set completos: muestra la guía de etiquetado, 3-4 casos de ejemplo, extractos cortos de código solo donde aclaren una etapa y salidas reales del informe, y enlaza al repositorio.

**El post enlaza a un tag, no a `main`.** Cuando estén hechos los runs que cita el post, se crea el tag `v1.0` en `pmeleroa/lab-golden-set-eval` y el post enlaza a `https://github.com/pmeleroa/lab-golden-set-eval/tree/v1.0`. Así lo que lee el lector coincide siempre con las cifras publicadas, aunque el repositorio cambie después.

Alternativas descartadas: bloques completos en el post (alarga el artículo sin aportar al método); una carpeta en `me-profile` (obliga a clonar el sitio entero para probar el ejemplo); ficheros en `public/` (servir `.py` desde el sitio no aporta frente a GitHub); no publicar código ni datos (el autor lo planteó y lo descartó: sin ellos la guía no es reproducible).

**Python con solo la biblioteca estándar, contra la API local de Ollama.** `urllib` y `json` bastan para llamar a `/api/chat` con `"stream": false`, el mismo endpoint del post de Ollama. Sin dependencias, sin API keys y ejecutable en una terminal Linux. Alternativa descartada: un endpoint compatible con OpenAI configurable, que serviría a más lectores a cambio de complejidad que no aporta al método. No se añade ninguna dependencia al proyecto.

**Modelo: `qwen2.5:7b`, generalista.** Decidido por el autor (tarea 1.1). Es la versión generalista de la misma familia que `qwen2.5-coder` del post de Ollama: clasificar tickets en lenguaje natural no es una tarea de código, y usar un modelo de código invitaría a leer sus fallos como "el modelo no sirve" en vez de "así se mide". Datos de la librería oficial de Ollama (`ollama.com/library/qwen2.5`, consultada el 2026-10-08): `qwen2.5:7b` ocupa 4.7GB, es la etiqueta `latest` y tiene ventana de 32K; `qwen2.5:3b` (1.9GB) queda como alternativa con menos RAM, igual que en el post de Ollama. El post no afirma que sea el modelo adecuado: es el que se usa para ilustrar. Alternativa descartada: reutilizar `qwen2.5-coder:7b` para no obligar a otra descarga.

**Temperatura 0 y `seed` fijo, sin repeticiones.** Se fijan `temperature: 0` y `seed` en `options`, y ambos se guardan en la configuración del run. La documentación de la API describe `seed` como "Random seed used for reproducible outputs", pero no dice cómo de fiable es (tarea 3.1). El post avisa de que eso no garantiza el determinismo y cita que ReviewBench pide tres ejecuciones para su leaderboard; repetir y medir la varianza queda fuera.

**Enseñar a iterar con dos runs reales.** El post muestra al menos dos runs: un prompt inicial y una mejora, comparados caso a caso en `dev`, y al final una única ejecución en `test`. Si la mejora en `dev` no se sostiene en `test`, el post lo cuenta tal cual: es la lección de la partición. No se fuerza ningún resultado.

**Terminal Linux.** Todos los comandos (`python3 eval.py ...`, `ollama pull`) son idénticos en Linux y macOS, así que se verifican en la máquina del autor. Windows se cubre con una referencia a la guía oficial de WSL2 de Microsoft, como en el post de Ollama.

**ReviewBench como origen y gancho, no como tema.** Pedido por el autor: el post dice de forma explícita que surge de la lectura del artículo de GitHub sobre ReviewBench, con enlace. La intro usa ReviewBench para presentar las dos ideas (golden set y pipeline) y el dato de predicción frente a producción. No se comenta el ranking ni se compara con otras herramientas. Las cifras se citan con enlace al post original.

**Fuera de la serie, con enlaces.** El post no lleva `series`: la evaluación no está en la hoja de ruta del harness local. Enlaza al post de Ollama como prerrequisito. La entrada de trabajo futuro del post de elección de modelo en `openspec/config.yaml` se actualiza para indicar que podrá reutilizar este pipeline.

**Título y slug.** Decididos por el autor (tarea 1.4): "Golden sets: cómo saber si tu IA ha mejorado o solo lo parece", con slug `golden-sets-y-pipelines-de-evaluacion`. El autor eligió primero "Golden sets: cómo saber si tu prompt ha mejorado o solo lo parece"; al extender el alcance a agentes y skills, "prompt" pasa a "tu IA". Sigue el patrón "tema: tesis" del resto de posts y nombra la trampa que la guía enseña a evitar. El slug no cambia. Alternativas descartadas: "Deja de iterar a ojo: golden set y pipeline de evaluación" (rompe el patrón) y "Evaluar un LLM: golden set primero, prompt después".

**Alcance: cualquier sistema bajo prueba, no solo un prompt.** Decidido por el autor: "no te centres en el prompt, extiéndelo a agentes o skills". El post habla de un *sistema bajo prueba*: lo que cambia puede ser el prompt, el modelo, una skill o las herramientas de un agente. ReviewBench, de hecho, evalúa agentes. El ejemplo sigue siendo el clasificador, porque deja ver el esqueleto, y una sección "Del prompt al agente" traslada cada pieza (caso, respuesta esperada, puntuación, partición dev/test, comparación entre runs) a agentes y skills, de forma conceptual y sin implementarla:
- En un agente casi nunca hay una etiqueta exacta: se comprueba el resultado (tests que pasan, ficheros creados, estado final) y, a veces, la trayectoria (qué herramientas usó y qué no tocó).
- Cuando el resultado es texto libre, la puntuación necesita un juez (LLM o rúbrica), con la tensión entre métricas grounded y augmented de ReviewBench.
- En una skill hay dos preguntas con casos propios: si se activa cuando debe (y no cuando no debe) y si hace bien la tarea una vez activada.

Alternativa descartada: cambiar el ejemplo por un agente real, que obligaría a implementar un juez o comprobaciones de estado y alejaría la guía de un ejemplo simple, como pidió el autor.

**Postura: en un entorno empresarial maduro es necesario.** Pedido por el autor: el post defiende que, en un ámbito empresarial con cierto grado de madurez, montar golden sets y pipelines de evaluación es completamente necesario. Es una postura del autor y el post la presenta como tal, en primera persona, no como un hecho medido. El argumento: en cuanto varios equipos cambian prompts, modelos, skills o agentes que llegan a producción, sin evaluación cada cambio se aprueba por intuición y las regresiones se descubren en producción. Evidencia citable: ReviewBench, donde GitHub usa justo este patrón para decidir cambios de un producto en producción y comprueba que la predicción offline coincide con el A/B (+227% predicho frente a +262% real en comentarios críticos). Límite: no se citan cifras de adopción ni estudios sobre empresas sin una fuente verificable. Contraargumento que el post reconoce: para un prototipo o un uso personal el coste puede no compensar; la postura se limita a entornos con cierto grado de madurez. Esta guía no pertenece a la serie del harness local, así que su regla de no usar el ángulo corporativo no aplica.

**Un gráfico de barras en "Leer los resultados e iterar".** Pedido por el autor tras revisar el post durante el apply ("revisa el contenido del blog por si fuese interesante incluir algún tipo de gráfico"). Es el primer gráfico del blog. Muestra la accuracy de cada run (dev v1, v2 y v3, y test v3) con una marca vertical para el baseline de cada split (44% y 40%), y resume la historia de la sección de un vistazo. Decisiones:
- HTML y CSS estáticos embebidos en el MDX, no SVG: un SVG escalado encoge el texto en móvil. Sin JavaScript (Q01) ni dependencias nuevas.
- Una sola serie con el color de acento del sitio (`--color-accent`), así que no lleva leyenda: el pie explica qué es cada marca. El validador de paletas marca el acento fuera de la banda de luminosidad, pero esa comprobación es para paletas categóricas de varias series; el contraste contra el fondo pasa (≥3:1).
- Las etiquetas y los valores usan `--color-text`, nunca el color de la serie ni `--color-text-muted` (contraste por debajo de AA, ya registrado como trabajo futuro).
- Las barras son decorativas (`aria-hidden`); etiqueta y valor de cada fila son texto legible, y cada fila lleva un `title` con el detalle del run como tooltip nativo, sin JS.
- Datos: los runs del tag `v1.0`.

Alternativas descartadas: diagrama del pipeline (redundante con las cinco secciones y la imagen de cabecera), matriz de confusión como mapa de calor (con 15-25 casos casi todas las celdas son 0 o 1) y esquema de la partición dev/test (se entiende con dos frases).

**Estructura del post:**
1. Origen y gancho: el post surge de la lectura del artículo de GitHub sobre ReviewBench (enlazado). Las dos ideas que se lleva (golden set y pipeline) y por qué importa que el benchmark predijera producción.
2. El caso de ejemplo, declarado como ficticio y deliberadamente simple: "no es un agente, pero el esqueleto es el mismo". Prerrequisitos: Python 3 y Ollama.
3. Montar el golden set: guía de etiquetado, anatomía de un caso, distribución y partición dev/test.
4. Montar el pipeline: las cinco etapas, con extractos de código y su salida real, enlazando al repositorio.
5. Leer los resultados e iterar: baseline mayoritario, matriz de confusión, comparación caso a caso entre dos runs y ejecución final en `test`.
6. Del prompt al agente: qué cambia en cada pieza al evaluar agentes y skills (resultado y trayectoria, juez LLM, activación de una skill).
7. Lo que esta guía no cubre: implementar un juez, repeticiones y varianza, salida estructurada e integración en CI.
8. Cierre con la postura del autor: en un entorno empresarial con cierto grado de madurez, esto no es opcional.

**Imagen destacada.** El autor decidió primero salir con el placeholder de marca (tarea 1.5) y después aportó la imagen durante el apply, así que entra en este change. Es una ilustración del flujo construir → probar con golden sets → certificar, con texto en inglés. Llegó como un PNG de 1672×941 y 2MB con extensión `.webp`. Se convierte con `sharp` (ya en devDependencies) a WebP real de 1600×900 (16:9, coincide con `aspect-ratio: 16/9` de `.article-image`), calidad 75, con el mismo criterio que la de Ollama, y se sirve desde `public/` sin `astro:assets`, igual que las imágenes del resto de posts.

## Risks / Trade-offs

- [El lector toma las cifras del caso ficticio como una medida de calidad del modelo] → Mitigación: el post declara que los datos son ficticios, que el set es pequeño y que el modelo se usa solo para ilustrar.
- [Con 40 casos, cada caso pesa varios puntos y las diferencias entre runs pueden ser ruido] → Mitigación: el post lo dice explícitamente y enseña a mirar casos concretos, no solo el porcentaje.
- [La mejora del prompt no se sostiene en `test`] → Aceptado: se publica tal cual, porque es la lección de la partición.
- [El modelo apenas falla y el ejemplo queda sin lección] → Mitigación: los casos ambiguos y trampa se diseñan para ser difíciles. Si aun así no hay fallos, se ajusta el golden set antes de congelarlo, nunca después de mirar los resultados de `test`, y se registra en `tasks.md`.
- [La respuesta de Ollama varía entre ejecuciones aunque la temperatura sea 0] → Mitigación: aviso en el post. Las salidas que se publican son las del run guardado en disco.
- [El formato de `/api/chat` o de `options.temperature` cambia] → Mitigación: contrastarlo con la documentación oficial de la API de Ollama antes de publicar y registrar la fuente en `tasks.md`.
- [Los extractos del post se desincronizan del código o de los runs del repositorio] → Mitigación: los extractos son copia literal del tag `v1.0` de `pmeleroa/lab-golden-set-eval` y las salidas citadas están en su `runs/`; se comprueba con `grep -F` o `diff` antes de publicar.
- [El trabajo en `pmeleroa/lab-golden-set-eval` queda fuera de las rutas de edición de este change (`me-profile`)] → Mitigación: cada tarea de esa parte registra en `tasks.md` su evidencia (commit o tag, comandos y salida real).

