# Tasks

El proyecto no tiene framework de tests: la verificación se hace con `npm run build`, `npx astro check` e inspección del HTML generado en `dist/`. Los casos de fallo de build se comprueban de forma temporal y se revierten antes de commitear.

## 1. Esquema y contenido de la serie

- [ ] 1.1 Ampliar la colección `series` en `src/content.config.ts` con `description` (obligatoria), `image` (opcional) y `parts` (obligatoria, mínimo 1, elementos `{ title, summary }`). Verificar con `npx astro check` sin errores de tipos.
- [ ] 1.2 Rellenar `src/content/series/asistente-codigo-local.yaml` copiando literalmente la descripción y los nueve elementos de `parts` de la decisión 8 de `design.md`. Verificar que `npm run build` termina sin errores.
- [ ] 1.3 Comprobar los fallos del esquema: quitar temporalmente `description`, dejar `parts` vacía y quitar un `summary`, y verificar que el build falla con un error que identifica la serie en cada caso. Revertir los cambios temporales y confirmar con `git diff` que el yaml queda como en 1.2.

## 2. Lógica de series y validación

- [ ] 2.1 Añadir a `src/utils/series.ts` el helper que combina `parts` con los posts publicados (estado «Publicada» con datos del post, o «Prevista» con datos de la serie, ignorando borradores). Verificar con un build temporal que pasa una serie con un borrador en una parte y esa parte sale como «Prevista».
- [ ] 2.2 Ampliar `validateSeriesIntegrity` para fallar cuando un post publicado declara una parte mayor que la longitud de `parts`, con serie, parte y post en el mensaje. Verificar declarando temporalmente `part: 10` en un post publicado (el build falla con el mensaje esperado) y, en un borrador, que no falla. Revertir lo temporal.

## 3. Página de serie

- [ ] 3.1 Crear `src/pages/blog/series/[id].astro` con `getStaticPaths` a partir de los posts publicados (`[]` si `sections.blog` está desactivado), cabecera (`h1`, descripción, imagen o placeholder de marca), lista ordenada con estado, nota de hoja de ruta orientativa solo si hay alguna parte prevista, breadcrumb `Inicio > Blog > <serie>` y estilos accesibles, sin `.reveal` ni `--color-text-muted`. Verificar que `dist/blog/series/asistente-codigo-local/index.html` existe y contiene las dos partes como «Publicada» y las siete restantes como «Prevista», sin enlaces ni fechas en las previstas, y que el breadcrumb tiene los tres niveles.
- [ ] 3.2 Añadir metadatos y datos estructurados: `description`/`og:description`, `og:image` (imagen de la serie o `/og-image.png`), `CollectionPage` con `CreativeWorkSeries` y `BreadcrumbList` (Inicio, Blog y nombre de la serie). Verificar inspeccionando el `<head>` y el JSON-LD de la página generada.
- [ ] 3.3 Verificar que una serie sin partes publicadas no genera ruta: marcar temporalmente ambos posts como `draft: true` y comprobar que no existe `dist/blog/series/asistente-codigo-local/`. Fijar también `sections.blog` temporalmente a `false` y comprobar que no existe `dist/blog/series/`. Revertir ambos y confirmarlo con `git diff`.
- [ ] 3.4 Verificar la página sin JavaScript, el foco visible por teclado, el contraste de 4.5:1 y la ausencia de scroll horizontal a 360px con un título largo, en `npm run preview`. Comprobar con `grep` que `src/pages/blog/series/[id].astro` no contiene `reveal` ni `--color-text-muted`. Anotar el resultado real en la PR.

## 4. Enlaces desde el post

- [ ] 4.1 Convertir el nombre de la serie del antetítulo de `src/pages/blog/[slug].astro` en un enlace a `/blog/series/<id>`, dejando el badge y «Parte N» como texto, con foco visible y subrayado. Verificar en el HTML generado de ambas partes que solo el nombre es un `<a>` y que apunta a la ruta correcta. Rollback: `git revert` del commit.
- [ ] 4.2 Añadir a `src/components/SeriesNav.astro` el enlace «Ver la serie completa» (recibiendo el id de la serie desde `[slug].astro`) sin cambiar la regla de visibilidad. Verificar que aparece en las dos partes y que, con una sola parte publicada (temporal), el bloque no se muestra. Revertir lo temporal. Rollback: `git revert` del commit.
- [ ] 4.3 Verificar que las tarjetas no ganan el antetítulo: el HTML de `dist/blog/index.html` y `dist/index.html` no contiene `article-series` ni «Parte N». El nombre de la serie sí puede aparecer, porque forma parte de las descripciones de los posts.
- [ ] 4.4 Añadir al final de la introducción de «Lo que falta», en `src/content/blog/harness-propio-desde-cero-el-bucle.mdx`, el texto de la decisión 9 de `design.md`, sin tocar `draft` ni `updatedDate`. Verificar que el HTML generado del post contiene el enlace, que `dist/blog/series/asistente-codigo-local/index.html` existe y, con `git diff`, que solo cambia esa frase. Rollback: `git revert` del commit.

## 5. Imagen de la serie

- [ ] 5.1 Documentar en el yaml o en la PR que la imagen real de la serie está pendiente de que el autor la aporte (WebP, 1200x630, `public/images/series/asistente-codigo-local.webp`), y verificar que mientras tanto la cabecera usa el placeholder de marca y `og:image` es `/og-image.png`.
- [ ] 5.2 Cuando el autor aporte el archivo: comprobar formato, dimensiones y peso, añadir `image: "/images/series/asistente-codigo-local.webp"` al yaml y verificar que la cabecera y `og:image` la usan. Si no se aporta en este change, dejar la tarea sin marcar y declararlo como pendiente en la PR.

## 6. Integración

- [ ] 6.1 Ejecutar `npm run build` y `npx astro check` completos sin errores ni avisos nuevos, y `openspec validate add-blog-series-page --strict`. Esta última puede terminar con código 1 solo si la salida contiene únicamente avisos de requisitos de más de 500 caracteres, como ya ocurre con las specs principales; cualquier error u otro tipo de aviso se corrige. Comprobarlo con `--json` (todos los `issues` con `level: WARNING` y ese mensaje). Registrar las salidas reales en la PR.
- [ ] 6.2 Comprobar la correspondencia entre cada requisito del delta spec y su escenario con la verificación realizada en los grupos 1 a 5, y anotar en la PR cualquier escenario sin verificar.

## Workflow follow-up

- Abrir la PR en borrador desde `feat/add-blog-series-page` con el trailer `OpenSpec-Change: add-blog-series-page`.
- Al archivar, sincronizar el delta con `openspec/specs/blog/spec.md` y ejecutar `openspec validate --all --strict`.
- Al archivar, anotar en `openspec/config.yaml` (trabajo futuro, blog): la página de serie ya está implementada, y quedan pendientes el filtro por serie y la banda de series en `/blog` para cuando haya más de una serie. Recortar además la hoja de ruta de la serie, que pasa a vivir en `src/content/series/asistente-codigo-local.yaml`, dejando solo lo que no es público (reglas de la serie, deuda y lo que no se promete). Se pide confirmación antes de editar la configuración.
