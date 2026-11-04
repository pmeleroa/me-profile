# Tasks

## 1. Datos de la serie

- [x] 1.1 Añadir `seriesIdOf` y `getPublishedSeriesParts` a `src/utils/series.ts` y usar `seriesIdOf` en `validateSeriesIntegrity` y en `src/pages/blog/[slug].astro`; verificar con `npm run build` que se genera el mismo número de páginas que en `main` y registrar la salida. Rollback: `git checkout -- src/utils/series.ts src/pages/blog/[slug].astro`

## 2. Artículos relacionados

- [x] 2.1 Excluir de `related`, antes del corte a 3, las partes de la misma serie que el post actual; verificar con un fixture temporal no versionado (`src/content/blog/zz-fixture-parte-2.mdx`, `part: 2`, con tags del post 1) que en `dist/` esa parte no aparece en los relacionados del post 1, y que el post 1 sigue sin perder candidatos de otros posts. Registrar la salida. El fixture no es un post real, no se commitea y se borra al terminar la sección 3

## 3. Bloque de navegación

- [x] 3.1 Crear `src/components/SeriesNav.astro` con el índice, la parte actual y los enlaces anterior y siguiente, e insertarlo en `[slug].astro` entre el contenido y el autor solo con 2 o más partes publicadas; verificar en `dist/` con el fixture de la tarea 2.1 los escenarios de «Visibilidad», «Índice» y «Enlaces»: primera parte, última parte y parte intermedia (añadiendo un fixture `part: 3`). Registrar la salida. Rollback: `git checkout -- src/pages/blog/[slug].astro` y `git clean -f src/components/SeriesNav.astro`
- [x] 3.2 Verificar los casos de borde con fixtures: una parte en borrador no aparece en `dist/` ni activa el bloque; una numeración 1 y 3 no se renumera; un post sin serie no muestra el bloque. Registrar la salida de `grep` sobre `dist/`
- [x] 3.3 Verificar Q01 con JavaScript desactivado (el bloque es visible y sus enlaces funcionan), Q02 a 360/390/768/1440px con un título largo y sin scroll horizontal, Q03 (`nav` con nombre accesible, `ol`, `aria-current="page"`, foco visible, subrayado y contraste de 4.5:1 calculado para cada color usado) y Q04 (sin transiciones en el bloque). Registrar el resultado de cada comprobación
- [x] 3.4 Borrar los fixtures y verificar con `git status --short src/content` (vacío) y con `npm run build` que sin ellos el post 1 no muestra el bloque y que no hay `aria-label="Serie:` en su HTML de `dist/`. Comparar con `diff` el HTML de un post sin serie con el build de `main` y registrar las diferencias

## 4. Configuración

- [x] 4.1 Actualizar en `openspec/config.yaml` la entrada de trabajo futuro sobre series para que A2 deje de figurar como pendiente, y conservar la página `/blog/series/<id>` y el filtro; verificar con `grep -n 'add-blog-series-nav' openspec/config.yaml` y con `openspec validate add-blog-series-nav --strict` sin errores

## 5. Integración

- [x] 5.1 Verificar Q05 (Lighthouse móvil >= 90 y sin regresión de más de 5 puntos frente a `main`) y Q07 (todos los enlaces del bloque resuelven a páginas de `dist/`) con fixtures temporales, y borrarlos después. Registrar las puntuaciones y el resultado
  - Resultado (local, `astro preview`, 3 pasadas por caso): main 75/75/75; post 1 con bloque 75/75/75; parte 3 con título largo 75/75/75. Sin regresión; Q07: 10 enlaces del bloque, 0 rotos. El umbral absoluto ≥90 no se cumple, pero tampoco en `main` (LCP ~8 s preexistente): aceptado por el autor y registrado como trabajo futuro en `openspec/config.yaml`.

## Workflow follow-up

- Comprobar el bloque con la parte 2 real en la QA de `add-harness-loop-post`.
- Sincronizar los deltas y archivar en la misma rama antes del merge, y ejecutar `openspec validate --all --strict`.
- El merge lo hace el autor.
