# Tasks

## 1. README de `harness` (fuera de este repositorio)

- [ ] 1.1 En una rama de `harness`, quitar del README y de `description` en `package.json` los productos usados como referencia (Claude Code, Codex, Cursor) y reescribir el párrafo de ingeniería inversa, manteniendo las menciones técnicas (proveedor Anthropic, Messages API, `CLAUDE.md`); verificar con `grep -n -i -E 'claude code|codex|cursor|ingeniería inversa' README.md package.json` sin resultados y registrar la salida. Rollback: descartar la rama. La integración la hace el autor

## 2. Repositorio `lab-harness-local` (fuera de este repositorio)

- [ ] 2.1 Crear el directorio local `~/workspaces/personal/lab-harness-local` con historia nueva, licencia MIT, Node >= 22 y `zod`, `typescript`, `tsx`, `vitest` y `@types/node`; verificar con `npm install` y `npm run typecheck`, y registrar la salida
- [ ] 2.2 Derivar de `harness` el contrato y el adaptador (`src/providers/canonical.ts`, `src/providers/openai.ts`) sin lo que aún no existe; verificar con tests del acumulador para llamadas completas en un chunk sin `id` ni `index`, llamadas troceadas y `finish_reason: stop` con llamadas
- [ ] 2.3 Derivar `src/tools/{types,registry,read,search}.ts` con `Read` y `Glob`, y añadir el límite de workspace; verificar con tests que rechazan `../`, una ruta absoluta externa y un enlace simbólico que sale del workspace, y que un input inválido vuelve como error
- [ ] 2.4 Derivar `src/core/{loop,events}.ts`, `src/index.ts` y `src/cli.ts` con los finales `end_turn`, `max_turns`, `repeated_failure`, `empty_response`, `max_tokens` y `error`, y salida en streaming; verificar con `test/fake-provider.ts` y `test/loop.test.ts` que `npm test` cubre cada final, y que toda llamada recibe su resultado
- [ ] 2.5 Comparar con `harness` los nombres de módulos, tipos y herramientas; registrar la lista de diferencias y justificar cada una como recorte, salvo el límite de workspace
- [ ] 2.6 Añadir `examples/demo` y un README sin productos comerciales, con prerrequisitos y ejecución; verificar con `grep -n -i -E 'claude code|codex|cursor' README.md` sin resultados y siguiendo el README desde un clon limpio. Registrar la salida
- [ ] 2.7 Antes de publicar, buscar secretos y datos de la máquina de trabajo con `git log -p | grep -n -i -E 'cecabank|KM-M54|sk-[a-z0-9]|api[_-]?key=.+'` y comprobar autor y correo con `git log --format='%an <%ae>'`; registrar la salida. Si aparece algo, corregir antes de seguir
- [ ] 2.8 Pedir confirmación al autor, registrar pregunta y respuesta, crear `pmeleroa/lab-harness-local` como repositorio público, hacer push y crear el tag `parte-2` (con el credential helper de `gh` si git da 403); verificar con `git ls-remote --tags` y con un clon limpio del tag que `npm install` y `npm test` pasan. Rollback: el autor decide si archivar o borrar

## 3. Comprobación contra el modelo real

- [ ] 3.1 Ejecutar con `qwen2.5:7b` y streaming una llamada con herramientas y su resultado, a través de `lab-harness-local`; registrar los chunks recortados, la versión de Ollama y si las llamadas llegan sin `id` ni `index`, y corregir el post previsto si difiere de la documentación de `harness`. Si falla, parar y consultar al autor
- [ ] 3.2 Ejecutar el agente sobre `examples/demo` con la pregunta del post, con la ventana por defecto y con `OLLAMA_CONTEXT_LENGTH=4096` en un servidor aparte; verificar con `ollama ps` la ventana usada y que la respuesta es correcta en ambos casos. Guardar en el repositorio la salida que citará el post y volver a etiquetar `parte-2` solo si el post aún no está publicado
- [ ] 3.3 Contrastar con la documentación oficial lo que cite el post (`docs.ollama.com/api/openai-compatibility`, `docs.ollama.com/capabilities/tool-calling`, `docs.ollama.com/context-length`) y comprobar que el enlace de ripgrep y el de WSL2 responden; registrar fuentes y códigos HTTP

## 4. Post

- [ ] 4.1 Preguntar al autor por la imagen destacada y registrar la respuesta. Si la aporta, convertirla con `sharp` a WebP de 1600×900 en `public/images/blog/<slug>.webp` y verificar formato, dimensiones y peso. Si no, verificar que se muestra el placeholder de marca
- [ ] 4.2 Crear `src/content/blog/<slug>.mdx` con `category: "Guía"`, `series: { id: asistente-codigo-local, part: 2 }` y la estructura de `design.md`, incluido el diagrama sin JavaScript y el párrafo de LiteLLM; verificar con `npm run build` sin errores y registrar el número de páginas. Rollback: `git checkout`/`git clean` del fichero
- [ ] 4.3 Verificar las reglas de la serie sobre el MDX: `grep -n -i -E 'claude code|codex|cursor|copilot|privacidad|tu empresa|corporativ'` sin resultados, listas de una línea sin sublistas, comandos de Linux y referencia a WSL2; registrar la salida
- [ ] 4.4 Comprobar con `grep -F` que cada extracto de código del post existe literalmente en el tag `parte-2`, y que cada enlace al repositorio apunta a ese tag; ejecutar los comandos del post en orden desde un clon limpio y registrar la salida. Cifras: solo de ejecuciones registradas aquí o de fuentes citadas

## 5. Configuración

- [ ] 5.1 Actualizar en `openspec/config.yaml` la entrada de la serie con la hoja de ruta de `design.md` y la convergencia con `harness`, sin hardware, y añadir la entrada de trabajo futuro del post sobre LiteLLM; verificar con `grep -n 'lab-harness-local\|LiteLLM' openspec/config.yaml` y con `openspec validate add-harness-loop-post --strict`

## 6. Integración y publicación

- [ ] 6.1 Con el post en `draft: false` para QA real y `add-blog-series-nav` integrado o aplicado, verificar en `dist/` el antetítulo «Parte 2», el bloque de navegación en las partes 1 y 2 y que no se listan una a otra en relacionados; registrar el resultado
- [ ] 6.2 Verificar Q01 (sin JS, con la limitación de `.reveal` si sigue pendiente en `main`), Q02 a 360/390/768/1440px, también en bloques de código y diagrama, Q03, Q04, Q05 (Lighthouse móvil >= 90, sin regresión de más de 5 puntos), Q07 (enlaces internos y externos) y Q08; registrar el resultado de cada uno
- [ ] 6.3 Antes de archivar, preguntar al autor si confirma publicar este post y registrar aquí pregunta y respuesta literales. Con confirmación, dejar `draft: false`. Sin ella, dejar `draft: true` y registrar que no hubo confirmación; verificar con `grep -n '^draft:'` sobre el MDX

## Workflow follow-up

- Sincronizar y archivar en la misma rama antes del merge (`skip_specs: true`, sin deltas) y ejecutar `openspec validate --all --strict`.
- Integrar `add-blog-series-nav` antes de esta PR, o a la vez. El merge lo hace el autor.
- Arreglar en `harness`, antes de la parte 3, la ventana por defecto de 128.000 tokens del adaptador OpenAI.
