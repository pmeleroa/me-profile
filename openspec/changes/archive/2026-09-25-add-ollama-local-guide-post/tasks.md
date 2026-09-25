## 1. Redacción del artículo

- [x] 1.1 Escribir `src/content/blog/ollama-en-local-cuando-los-llms-publicos-estan-bloqueados.mdx` con frontmatter (`title`, `description`, `publishDate: 2026-09-11`, `category: "Guía"`, `tags: ["ollama", "llm-local", "seguridad", "herramientas-dev"]`, `draft: false`, sin `image` ni `demo`) y el cuerpo del artículo siguiendo la estructura de 6 bloques de `design.md` (contexto/límite, instalación Mac, instalación Linux, elección de modelo, verificación de red, aviso de seguridad + cierre). `draft: false` mantenido en esta fase de `apply` para poder probar el post real; el consentimiento explícito de publicación se resuelve en la tarea 3.1. Verificación: `npm run build` sin errores, 64 páginas generadas (antes 63).
- [x] 1.2 Contrastado contra la documentación oficial de Ollama en GitHub (`docs/linux.mdx` del repo `ollama/ollama`, obtenido vía `raw.githubusercontent.com/ollama/ollama/main/docs/linux.mdx`): el script `curl -fsSL https://ollama.com/install.sh | sh` y los paquetes manuales `ollama-linux-amd64.tar.zst`/`ollama-linux-arm64.tar.zst` extraídos con `sudo tar x -C /usr` coinciden textualmente con lo publicado en el post; la documentación no exige una distro concreta. `ollama serve` para arrancar el servicio, también confirmado en la misma fuente.
- [x] 1.3 Confirmado contra la documentación oficial de Ollama en GitHub (`docs/faq.mdx`, mismo repositorio, obtenido vía `raw.githubusercontent.com`): (a) cita textual "Ollama runs locally. We don't see your prompts or data when you run locally." confirma la ausencia de telemetría en inferencia local — incluida tal cual en el post; (b) la sección "How can I expose Ollama on my network?" confirma el bind por defecto ("Ollama binds 127.0.0.1 port 11434 by default") y explica cómo exponerlo (`OLLAMA_HOST`) y cómo protegerlo con un proxy, sin describir en ningún punto un mecanismo de autenticación propio — el post se redactó con esa formulación exacta ("no lleva ningún mecanismo de autenticación propio", en vez de afirmar una ausencia total no verificable por silencio documental). Ajuste adicional encontrado: la auto-actualización solo aplica a macOS/Windows según la FAQ, no a Linux — no se incluyó ninguna mención de desactivar auto-actualización en el post para evitar una afirmación no aplicable a ambos sistemas operativos cubiertos.
- [x] 1.4 Verificado en la máquina Mac real de la sesión: `qwen2.5-coder:7b` ya estaba descargado (`ollama list`); ejecutado `ollama run qwen2.5-coder:7b` con un prompt largo en segundo plano y, en paralelo, `lsof -i -P | grep ollama`. Salida real observada:
  ```
  Ollama     1077 pw-pmelero    5u  IPv4 ... TCP localhost:49272 (LISTEN)
  ollama     1128 pw-pmelero    3u  IPv4 ... TCP localhost:11434 (LISTEN)
  ollama     1128 pw-pmelero    8u  IPv4 ... TCP localhost:11434->localhost:63997 (ESTABLISHED)
  ollama     1128 pw-pmelero   10u  IPv4 ... TCP localhost:64015->localhost:63998 (ESTABLISHED)
  ollama    23713 pw-pmelero    4u  IPv4 ... TCP localhost:63997->localhost:11434 (ESTABLISHED)
  ```
  Todas las conexiones son `localhost`↔`localhost`; ninguna IP externa. Confirma el comportamiento descrito en el post.
- [x] 1.5 Relectura completa del post confirmada: el bloque de encuadre ("Si en tu empresa la política de seguridad...") abre el artículo antes de cualquier comando de instalación, distingue explícitamente "hecho técnico verificable" de "aprobación de tu empresa", y el cierre ("Lo que queda fuera de esta guía") retoma el mismo límite sin contradecirlo en ningún bloque intermedio.

## 2. Calidad transversal

- [x] 2.1 Checks de calidad ejecutados con el post en `draft: false`:
  - Q01 (contenido esencial sin JS): MDX estático renderizado por Astro; sin `<script>` propio, sin `<img>` (post sin imagen, ver `design.md`).
  - Q02 (adaptable 360/390/768/1440px sin scroll horizontal): los 9 bloques de código del post usan `.article-content pre { overflow-x: auto }`, ya existente en `src/pages/blog/[slug].astro` (línea ~478) y usado ya por otros posts — el scroll queda contenido dentro del bloque, no en la página. Sin tablas ni elementos anchos añadidos.
  - Q03 (WCAG 2.2 AA): inspección de `dist/.../index.html` confirma un único `<h1>` seguido de seis `<h2>` secuenciales sin saltos de nivel; los dos enlaces externos usan texto descriptivo ("Ollama", "ollama.com/download"), no URLs desnudas ni "click aquí".
  - Q04 (`prefers-reduced-motion`): no aplica — sin animación propia añadida por el contenido; el único movimiento (`.reveal` de cabecera) es de la plantilla compartida, sin tocar.
  - Q05 (rendimiento): sin imágenes ni dependencias nuevas; no se ejecutó Lighthouse (no instalado en el proyecto) — sin motivo estructural de regresión frente a los posts existentes con la misma plantilla.
  - Q06 (integridad de publicación): mecanismo ya verificado en el change precedente (`getStaticPaths` excluye `draft: true`); estado final de `draft` para este post se decide en la tarea 3.1.
  - Q07 (enlaces/rutas válidos): los dos enlaces externos del post (`https://ollama.com`, `https://ollama.com/download`) verificados con `curl -s -o /dev/null -w "%{http_code}"` → `200` ambos. Sin enlaces internos nuevos.
  - Q08 (sin HTML/JS arbitrario ni PII): contenido MDX de texto y bloques de código estáticos, sin HTML embebido, sin datos de usuario ni PII.
- [x] 2.2 `npm run build` ejecutado con el post en `draft: false`: 64 páginas generadas (antes 63); `dist/blog/ollama-en-local-cuando-los-llms-publicos-estan-bloqueados/index.html` existe (24.2K); el slug aparece listado en `dist/blog/index.html`.
- [x] 2.3 `openspec validate add-ollama-local-guide-post --strict` → `Change 'add-ollama-local-guide-post' is valid`, único mensaje: INFO esperado sobre `skip_specs`, sin errores.
- [x] 2.4 Rollback: el change añade únicamente un archivo nuevo (`src/content/blog/ollama-primeros-pasos-asistente-de-codigo-local.mdx`, nombre definitivo tras la tarea 4.1), sin tocar código, schema ni contenido ya publicado; el rollback es `git revert` del commit/PR o borrado del archivo, sin migración de datos. Registrado aquí para incluirlo en la descripción de la PR.

## 3. Reenfoque como guía introductoria de la serie (ver `design.md` - Decisions)

- [x] 3.1 Contrastar con la documentación oficial de la API de Ollama el formato de una petición a `POST /api/chat` con `"stream": false` (campos `model` y `messages`) y de su respuesta. Ejecutar el `curl` en la máquina Mac real con `qwen2.5-coder:7b` y registrar aquí la fuente consultada y la salida real, que es la que describe el post.
  - Fuente: `docs/api.md` del repo `ollama/ollama` (vía `raw.githubusercontent.com`), sección "Generate a chat completion" > "Chat request (No streaming)": `curl http://localhost:11434/api/chat -d '{"model": ..., "messages": [{"role": "user", "content": ...}], "stream": false}'`. La respuesta documentada incluye `model`, `created_at`, `message` (`role`, `content`), `done` y métricas de duración y tokens. El propio fichero indica que la documentación de la API se traslada a `https://docs.ollama.com/api` (comprobado: `200`, igual que `https://docs.ollama.com/api/chat`).
  - Ejecución real en el Mac (2026-09-25), con el mismo prompt que el ejemplo de `ollama run` del post. Salida con `content` recortado:
    ```json
    {
      "model": "qwen2.5-coder:7b",
      "created_at": "2026-09-25T15:21:09.361607Z",
      "message": {
        "role": "assistant",
        "content": "Claro, aquí tienes una función en Python que verifica si un número es primo: ..."
      },
      "done": true,
      "done_reason": "stop",
      "total_duration": 11676535208,
      "load_duration": 3064459917,
      "prompt_eval_count": 44,
      "prompt_eval_cached_count": 0,
      "prompt_eval_duration": 94406000,
      "eval_count": 486,
      "eval_duration": 8515290000
    }
    ```
    La salida real añade `done_reason` y `prompt_eval_cached_count` a lo documentado. El post solo explica `message.content`, `message.role` y `done`, así que no depende de esos campos extra.
- [x] 3.2 Renombrar el `.mdx` a `src/content/blog/ollama-alternativa-local-cuando-tus-datos-no-pueden-salir.mdx` con `git mv` o equivalente. Mantener el `title` actual. Reescribir la `description` sin el ángulo corporativo, presentando el post como el primero de una serie sobre entornos de IA locales. Revisar si los `tags` siguen siendo adecuados (por ejemplo, `seguridad` frente a algo como `api`).
- [x] 3.3 Reescribir la intro: tesis ("No todos los casos de uso de IA necesitan consumir un LLM en la nube"), presentación de la serie (un asistente de código a medida en local, sin nombrar productos comerciales) y objetivo de este post (el harness plano). Retirar las dos viñetas "hecho técnico / nada de aprobación" y cualquier referencia a políticas de empresa.
- [x] 3.4 Ajustar la sección de modelo: quitar "sustituir, en pruebas, algo como Copilot", presentar `qwen2.5-coder` como modelo para arrancar y declarar que la elección de modelo será tema de un post futuro de la serie. Mantener el criterio `7b`/`3b` según la RAM.
- [x] 3.5 Añadir la sección de uso vía API después de `ollama run`, con el `curl` verificado en la tarea 3.1 y una explicación breve de la respuesta. Mover a esta sección el aviso del puerto 11434 (sin autenticación propia, no exponerlo sin protegerlo) y quitar "Dado el motivo por el que estás leyendo esto".
- [x] 3.6 Reducir la comprobación de red a un comando por sistema operativo (`lsof`/`ss`) y un párrafo de interpretación (todo `localhost`), sin tratamiento de "demostración".
- [x] 3.7 Reescribir el cierre: qué le falta al harness plano (historial, contexto, tools, bucle agéntico, integración) como anuncio de los siguientes posts, sin fechas ni índice cerrado. Quitar la referencia al equipo de seguridad y a Copilot.
- [x] 3.8 Repetir las comprobaciones de calidad tras la reescritura: Q01-Q08 como en la 2.1 (con atención a la jerarquía de encabezados por la sección nueva y a cualquier enlace nuevo a la documentación de la API), `npm run build` con el nuevo slug generado en `dist/blog/` y el antiguo ausente, y `openspec validate add-ollama-local-guide-post --strict`. Actualizar la nota de rollback de la 2.4 con el nombre de archivo definitivo.
  - Q01: MDX estático sin HTML ni `<script>` propio; los 4 `<script>` y las 2 `<img>` del HTML generado vienen de la plantilla compartida (mismos 4 `<script>` en `sdd-vs-vibe-coding`).
  - Q02: los bloques de código nuevos (`curl` a la API y respuesta JSON) usan el mismo `.article-content pre { overflow-x: auto }` que el resto; sin tablas ni elementos anchos.
  - Q03: el HTML generado tiene un único `<h1>` y la secuencia `h2 h2 h2 h2 h2 h3 h2 h2`. El único `<h3>` ("Un aviso sobre el puerto 11434") cuelga de "Hablarle desde la API local", sin saltos de nivel. Los enlaces usan texto descriptivo.
  - Q04/Q05/Q06/Q08: sin cambios respecto a la 2.1 (sin animación, imágenes, dependencias ni PII nuevas; `draft` se decide en la 4.1).
  - Q07: enlaces externos `https://ollama.com`, `https://ollama.com/download` y `https://docs.ollama.com/api/chat` → `200` los tres.
  - Afirmaciones nuevas contrastadas: streaming por defecto y `"stream": false` (`docs/api.md`: "Streaming can be disabled by providing `{"stream": false}`"); `ollama run` con `PROMPT` opcional (`ollama run --help`: `ollama run MODEL [PROMPT]`, y ejemplo "Run a model" sin prompt en `docs/cli.mdx`).
  - `npm run build`: 64 páginas; existe `dist/blog/ollama-alternativa-local-cuando-tus-datos-no-pueden-salir/index.html` (28.6K), enlazado 2 veces desde `dist/blog/index.html`, y no queda ninguna referencia al slug antiguo en `dist/`.
  - `openspec validate add-ollama-local-guide-post --strict` → válido (solo el INFO esperado de `skip_specs`).

## 4. Ajuste: la guía no justifica la ejecución en local (ver `design.md` - Decisions)

- [x] 4.1 Cambiar el título a "Ollama: primeros pasos hacia un asistente de código local" y renombrar el `.mdx` a `src/content/blog/ollama-primeros-pasos-asistente-de-codigo-local.mdx` (con `mv`: el archivo aún no está versionado). La `description` y los `tags` no contienen justificación de la ejecución en local y se mantienen.
- [x] 4.2 Limpiar la intro: quitar "en tu propia máquina, sin que tus prompts ni tu código salgan de ella" y cambiar "que funcione enteramente en local" por "que funcione en local". La tesis "No todos los casos de uso de IA necesitan consumir un LLM en la nube" se mantiene.
- [x] 4.3 Eliminar la sección "Comprobar que todo se queda en tu máquina" (comandos `lsof`/`ss`, interpretación y cita de la FAQ sobre prompts). Comprobado: no quedan en el post referencias a datos que no salen, `lsof` ni al título anterior.
- [x] 4.4 Repetir las comprobaciones afectadas:
  - `npm run build`: 64 páginas; existe `dist/blog/ollama-primeros-pasos-asistente-de-codigo-local/index.html` (26.6K), con `<title>` "Ollama: primeros pasos hacia un asistente de código local · Blog" y enlazado 2 veces desde `dist/blog/index.html`. No queda ninguna referencia en `dist/` a los slugs anteriores.
  - Q03: un único `<h1>` y la secuencia `h2 h2 h2 h2 h2 h3 h2`, sin saltos de nivel.
  - Q07: sin enlaces nuevos; los tres enlaces externos ya verificados en la 3.8 se mantienen.
  - Rollback (2.4) actualizado con el nombre de archivo definitivo.
  - `openspec validate add-ollama-local-guide-post --strict` → válido.

## 5. Guía centrada en una terminal Linux, con Windows vía WSL2 (ver `design.md` - Decisions)

- [x] 5.1 Contrastar el script oficial de instalación: `https://ollama.com/install.sh` (descargado el 2026-09-25) declara "This script installs Ollama on Linux and macOS". En macOS descarga `Ollama-darwin.zip`, instala en `/Applications`, enlaza `/usr/local/bin/ollama` y arranca la app. En Linux detecta WSL2 (`IS_WSL2`), rechaza WSL1, configura y arranca el servicio si systemd está activo y, si no, avisa. El README oficial (`ollama/ollama`) documenta el mismo comando en "### macOS" y "### Linux". No se ha probado en Windows con WSL2 ni en una instalación limpia de macOS con el script.
- [x] 5.2 Fusionar "Instalar Ollama en Mac" e "Instalar Ollama en Linux" en una sección "Instalar Ollama":
  - Referencia a WSL2 para Windows, solo con el enlace a `https://learn.microsoft.com/es-es/windows/wsl/install` y sin pasos de configuración.
  - El script como método principal, con lo que hace en cada sistema.
  - El `.dmg` y la instalación manual de Linux (`https://docs.ollama.com/linux#manual-install`) como alternativas enlazadas.
  - `ollama --version` para verificar y `ollama serve` solo si el servicio no ha quedado en marcha.
  - Se retiran la fórmula de Homebrew y los comandos de los paquetes manuales.
- [x] 5.3 Actualizar la `description`: de "instalar Ollama en Mac y Linux" a "instalar Ollama desde una terminal Linux (también en macOS y en Windows con WSL2)".
- [x] 5.4 Repetir las comprobaciones afectadas:
  - `npm run build`: 64 páginas.
  - Q03: un único `<h1>` y la secuencia `h2 h2 h2 h2 h3 h2`, sin saltos de nivel.
  - Q07: los enlaces externos del post (`learn.microsoft.com/es-es/windows/wsl/install`, `ollama.com/download`, `docs.ollama.com/linux#manual-install`, con el ancla `manual-install` comprobada en el HTML, `ollama.com` y `docs.ollama.com/api/chat`) → `200` todos.
  - `openspec validate add-ollama-local-guide-post --strict` → válido.
- [x] 5.5 Actualizar `publishDate` de `2026-09-11` (fecha del primer borrador, tarea 1.1) a `2026-09-25`, a petición del autor. Verificación: `npm run build` → 64 páginas; el HTML del post muestra `datetime="2026-09-25T00:00:00.000Z"`.
- [x] 5.6 Añadir la imagen destacada que aporta el autor:
  - Conversión con `sharp` de un PNG de 1672×941 y 1.6MB a `public/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp`, a 1600×900 (`fit: cover`) y WebP calidad 75. Resultado: 56.6KB, dentro del rango del resto de posts (50-250KB); revisada visualmente, sin artefactos.
  - Frontmatter: `image: "/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp"`.
  - Verificación: `npm run build` genera 64 páginas. El HTML del post incluye `<img src="/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp" ... class="article-image" loading="eager">` y `og:image` apunta a `https://pablomeleroalonso.me/images/blog/ollama-primeros-pasos-asistente-de-codigo-local.webp`. El archivo existe en `dist/images/blog/`, y el servidor de desarrollo lo sirve con `200`.
  - El `alt` es el título del post, que genera la plantilla compartida.
- [x] 5.7 Sustituir la subsección "Un aviso sobre el puerto 11434" por una nota breve y cerrada al final de la sección de API. Se retiran `OLLAMA_HOST`, el proxy Nginx y el cierre "si algún día decides compartirla, no lo hagas sin protegerla", que dejaba un tema pendiente. Se mantienen solo los hechos contrastados en la tarea 1.3: sin autenticación propia y bind por defecto a `127.0.0.1`. Verificación: `npm run build` genera 64 páginas. El HTML del post tiene un único `<h1>` y la secuencia `h2 h2 h2 h2 h2`, sin el `<h3>` retirado. La nota con `127.0.0.1` aparece una vez, y no quedan en el post referencias a `OLLAMA_HOST`, Nginx ni "protegerla".
- [x] 5.8 Pasar el tema del puerto 11434 a la lista "Lo que le falta a este harness", como punto **Seguridad**: la API no lleva autenticación propia, hoy basta con el bind por defecto a `127.0.0.1`, y controlar quién usa el harness y qué puede hacer será una pieza más cuando crezca. Se retira la nota suelta de la sección de API que había añadido la 5.7. Verificación: `npm run build` genera 64 páginas. El HTML del post tiene un `<h1>` y cinco `<h2>`, incluye `<strong>Seguridad</strong>` en la lista final, y "Una nota sobre esta API" ya no aparece.
- [x] 5.9 Acortar el punto **Seguridad** a una línea, en línea con el resto de la lista y a petición del autor: "la API no tiene autenticación; nada controla quién la usa ni qué puede hacer". Verificación: `npm run build` genera 64 páginas.
- [x] 5.10 Ampliar el punto **Seguridad**, a petición del autor, con siete subtemas de una línea cada uno, en el mismo registro que el resto de la lista: acceso (API sin autenticación), permisos de las herramientas, confirmación de acciones destructivas, prompt injection, secretos en el contexto, procedencia del modelo y trazabilidad. Son temas futuros de la serie, sin afirmaciones técnicas nuevas sobre Ollama más allá de la ya contrastada en la tarea 1.3 (API sin autenticación propia). Verificación: `npm run build` genera 64 páginas. El HTML renderiza el punto "Seguridad" con una `<ul>` anidada de 7 `<li>`, con la jerarquía de listas correcta.
- [x] 5.11 Aplanar la lista final, a petición del autor, para mantener la línea de Historial, Contexto propio, Herramientas, Bucle agéntico e Integración. Se elimina el punto "Seguridad" con sublista, y sus siete temas pasan a ser puntos propios de la lista principal. Cada uno describe en una línea lo que el harness no hace hoy, sin recomendaciones: Acceso, Permisos, Confirmación, Prompt injection, Secretos, Procedencia del modelo y Trazabilidad. Verificación: `npm run build` genera 64 páginas. La lista final se renderiza como una sola `<ul>` de 12 `<li>`, sin listas anidadas.
- [x] 5.12 Reducir los siete puntos de seguridad a uno solo de una frase, a petición del autor: "**Seguridad**: no hay autenticación, permisos, confirmaciones ni registro de lo que hace, ni protección frente a prompt injection o fugas de secretos." Verificación: `npm run build` genera 64 páginas y la lista final se renderiza con 6 `<li>`, sin listas anidadas.
- [x] 5.13 Plasmar la hoja de ruta de la serie en la lista final, a petición del autor: 12 piezas de una línea, en orden de dependencia y sin numerar, y una frase final sobre el cierre de la serie (cuándo un modelo local no basta).
  - Afirmación nueva contrastada: `docs/context-length.mdx` del repo `ollama/ollama` (vía `raw.githubusercontent.com`) indica "< 24 GiB VRAM: 4k context" y "Tasks which require large context like web search, agents, and coding tools should be set to at least 64000 tokens". Enlace `https://docs.ollama.com/context-length` → `200`.
  - Verificación: `npm run build` genera 64 páginas. La lista final se renderiza como una sola `<ul>` de 12 `<li>` sin anidar, y el enlace a `docs.ollama.com/context-length` aparece en el HTML.
- [x] 5.14 Quitar de la lista final lo que no se considera relacionado con un harness local, a petición del autor:
  - "Evaluación" y "Observabilidad" se fusionan en "**Elección de modelo**: `qwen2.5-coder` es solo para arrancar; no hay forma de medir si es el adecuado para tu caso ni cuánto rinde en tu hardware".
  - Se elimina "Varios modelos" (evolución de arquitectura, no pieza que falte).
  - "Integración" se mantiene.
  - La lista queda en 10 piezas. Verificación: `npm run build` genera 64 páginas y la lista final se renderiza con 10 `<li>`. La entrada de la hoja de ruta en `openspec/config.yaml` (`rules.design`) se actualiza igual: elección de modelo en lugar de evaluación y observabilidad, y "varios modelos" fuera de la serie.
- [x] 5.15 Quitar "Elección de modelo" de la lista final y de la hoja de ruta, a petición del autor, porque da para mucho debate. La lista queda en 9 piezas. En la sección de modelo, "Elegir modelo tiene suficiente miga como para dedicarle su propio post dentro de la serie" pasa a "elegir modelo da para mucho debate y queda fuera de esta guía", para no prometer un post que ya no está previsto. Verificación: `npm run build` genera 64 páginas, la lista final se renderiza con 9 `<li>` y el post ya no contiene "elección" ni "miga". La hoja de ruta de `openspec/config.yaml` también la deja fuera de la serie.
- [x] 5.16 Quitar la frase de cierre "Y, para cerrarla, la otra cara de la tesis: cuándo un modelo local no basta y sí compensa la nube", a petición del autor; el cierre queda solo con la remisión a los siguientes posts de la serie. En `openspec/config.yaml` (`rules.design`):
  - Se quita "cierre: cuándo un modelo local no basta" de la hoja de ruta de la serie.
  - Se añade una entrada de trabajo futuro para un post independiente sobre cuándo local no basta y compensa la nube, con categoría propuesta Opinión.
  - En la entrada del post de elección de modelo se fija la categoría propuesta Análisis y se quita el eje "cuándo un modelo local no basta" para no duplicarlo.
  - Verificación: `npm run build` genera 64 páginas y el HTML del post ya no contiene "compensa la nube". `openspec instructions design` muestra las entradas actualizadas.

## 6. Consentimiento de publicación (fase archive)

- [x] 6.1 En el momento de archivar este change, confirmar explícitamente con el owner si da consentimiento para publicar el post (queda en `draft: false`) o si debe quedarse sin publicar por ahora (`draft: true`). Registrar aquí la pregunta y la respuesta literal (vía `AskUserQuestion` en la sesión de archive) como evidencia.
  - Pregunta (vía `AskUserQuestion`, sesión de archive, 2026-09-25): "¿Das tu consentimiento para publicar el post "Ollama: primeros pasos hacia un asistente de código local" (se queda en draft: false) o debe quedarse sin publicar por ahora (draft: true)?"
  - Respuesta literal del owner: "Publicar (draft: false)".
  - Estado final: `draft: false` en `src/content/blog/ollama-primeros-pasos-asistente-de-codigo-local.mdx`, sin cambios.
