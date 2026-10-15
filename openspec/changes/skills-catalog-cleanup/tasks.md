# Tasks

Rollback de todo el change: `git revert <commit>` del commit de implementación (o `git checkout main -- src/data/skills.ts src/components/SkillsGrid.astro src/pages/skills/[slug].astro astro.config.mjs` antes de mergear). Restaura slugs antiguos y elimina las redirecciones; nada externo depende aún de los slugs nuevos.

## 1. Nivel opcional (D5)

- [x] 1.1 Cambiar el tipo `Skill` a `level?: 1 | 2 | 3 | 4 | 5` en `src/data/skills.ts`; verificar con `npx astro check` sin errores nuevos de tipo (registrar el comando y el resultado).
  - Evidencia: `npx astro check` → 9 errors / 0 warnings / 23 hints, igual que la línea base previa al cambio (9 errores preexistentes en `[slug].astro`, `related` posiblemente `undefined` tras `filter(Boolean)`); sin errores nuevos.
- [x] 1.2 Renderizar la etiqueta de nivel en `SkillsGrid.astro` solo si `skill.level` está definido; verificar en `dist/` (tras `npm run build`) que una tarjeta con nivel conserva su `skill-level-label` y que, con un skill temporal sin nivel, la tarjeta no contiene `skill-level-label` (registrar el `grep` y su salida).
  - Evidencia: build con fixture temporal no versionado (skill "Temp Sin Nivel" sin `level` + `sections.skills = true`), `npm run build` exit 0; en `dist/skills/index.html` la tarjeta `temp-sin-nivel` no contiene `skill-level-label` (False) y la de `prometheus` sí (True). Fixture revertido.
- [x] 1.3 En `src/pages/skills/[slug].astro`, renderizar el nivel solo si está definido y omitir el contenedor `skill-hero-meta` cuando no haya ni nivel ni `featured`; verificar en `dist/skills/<slug>/index.html` de un skill sin nivel que no hay etiqueta de nivel ni `skill-hero-meta` vacío.
  - Evidencia: mismo build; `dist/skills/temp-sin-nivel/index.html` sin `skill-hero-meta`; `dist/skills/prometheus/index.html` con `skill-hero-meta` y "Experto".
- [x] 1.4 Verificar Q02 con un skill sin nivel: el grid y la ficha a 360, 390, 768 y 1440 px no tienen scroll horizontal y la fila superior de la tarjeta mantiene la alineación con sus vecinas (registrar cómo se comprobó).
  - Evidencia: `astro preview` + Chrome headless (`--dump-dom`) cargando `/skills/`, `/skills/temp-sin-nivel/` y `/skills/prometheus/` en iframes de 360/390/768/1440 px: `scrollWidth == clientWidth` en las 12 combinaciones (sin scroll horizontal); altura de `.skill-card-top` 36 px con y sin nivel en los 4 anchos.

## 2. Renombrados y retirada (D2, D3)

- [x] 2.1 Renombrar "JIRA Tooling" → "Atlassian Tooling": icono `simpleIcon('atlassian')`, tagline de D2, clave en `explicitLabels` (`AT`) y `related` de `itsm-itil` a `atlassian-tooling`; verificar que existe `dist/skills/atlassian-tooling/index.html` y que la ficha de ITSM / ITIL enlaza a `/skills/atlassian-tooling/`.
  - Evidencia: `npm run build` exit 0; existe `dist/skills/atlassian-tooling/index.html`; `grep -o 'href="/skills/[a-z-]*"' dist/skills/itsm-itil/index.html` → mejora-continua, atlassian-tooling, automatizacion-operativa.
- [x] 2.2 Renombrar "Python / ML" → "Python" con el tagline de D2 y su clave en `explicitLabels`; verificar que existe `dist/skills/python/index.html` y que no se genera una ficha propia en `dist/skills/python-ml/` (salvo la página de redirección de la sección 3).
  - Evidencia: existe `dist/skills/python/index.html` (1 `skill-hero`); `dist/skills/python-ml/index.html` es solo la redirección (0 `skill-hero`).
- [x] 2.3 Retirar "ML e IA en Google Cloud" del array y de `explicitLabels`; verificar con `grep -rn "ML e IA en Google Cloud\|ml-e-ia-en-google-cloud" src` que solo queda (si acaso) la redirección en `astro.config.mjs`.
  - Evidencia: `grep -rn "ML e IA en Google Cloud\|ml-e-ia-en-google-cloud" src astro.config.mjs` → solo `astro.config.mjs:12` (redirección). Nota: `public/skills/gcp.svg` queda sin referencias; no se borra en este change (fuera de alcance).

## 3. Redirecciones (D4)

- [x] 3.1 Añadir a `redirects` de `astro.config.mjs` las tres entradas de D4; verificar tras `npm run build` que `dist/skills/jira-tooling/index.html`, `dist/skills/python-ml/index.html` y `dist/skills/ml-e-ia-en-google-cloud/index.html` contienen meta-refresh, `noindex` y `rel="canonical"` hacia `/skills/atlassian-tooling`, `/skills/python` y `/skills/google-cloud-platform` respectivamente (registrar el `grep`).
  - Evidencia: en `dist/skills/{jira-tooling,python-ml,ml-e-ia-en-google-cloud}/index.html`: `http-equiv="refresh" content="0;url=/skills/<destino>"`, `name="robots" content="noindex"` y `rel="canonical" href="https://pablomeleroalonso.me/skills/<destino>"` con destinos atlassian-tooling, python y google-cloud-platform.
- [x] 3.2 Verificar que cada destino de redirección existe como ficha: `ls dist/skills/atlassian-tooling dist/skills/python dist/skills/google-cloud-platform`.
  - Evidencia: `ls -d dist/skills/atlassian-tooling dist/skills/python dist/skills/google-cloud-platform` → los tres existen.

## 4. Skills nuevos (D1)

- [x] 4.1 Añadir los 11 skills de D1 (nombre, categoría, icono, tagline; **sin `level`**) en las posiciones indicadas en D1, y las etiquetas de `explicitLabels` para los de icono genérico (`AZ`, `DSO`, `CX`, `RAG`, `OKF`, `APM`); verificar que existen `dist/skills/{opentelemetry,grafana-stack,argocd,azure,kafka-connect,devsecops,claude,codex,rag,okf,apm}/index.html`.
  - Evidencia: build exit 0; existen `dist/skills/{opentelemetry,grafana-stack,argocd,azure,kafka-connect,devsecops,claude,codex,rag,okf,apm}/index.html` (11/11). Etiquetas `AZ`, `DSO`, `CX`, `RAG`, `OKF`, `APM` añadidas a `explicitLabels`.
- [x] 4.2 Verificar que los iconos externos de los skills nuevos responden 200 (`curl -s -o /dev/null -w "%{http_code}"` sobre `opentelemetry`, `grafana`, `argo`, `claude`, `atlassian`, `apachekafka` en `cdn.simpleicons.org`) y que los de icono genérico muestran su etiqueta en la tarjeta.
  - Evidencia: `curl` a `cdn.simpleicons.org` → opentelemetry 200, grafana 200, argo 200, claude 200, atlassian 200, apachekafka 200. Con grid habilitado temporalmente (`sections.skills = true`, revertido), las tarjetas de azure/devsecops/codex/rag/okf/apm muestran su etiqueta (`>AZ<`, `>DSO<`, `>CX<`, `>RAG<`, `>OKF<`, `>APM<` → True).
- [x] 4.3 Verificar que ningún skill nuevo muestra etiqueta de nivel en tarjeta ni ficha (`grep` sobre las fichas generadas) y que todos los skills existentes la conservan.
  - Evidencia: las 11 fichas nuevas tienen 0 apariciones de Básico/Intermedio/Avanzado/Experto/Maestro; grid: 63 tarjetas, 52 con `skill-level-label` (= 63 − 11 nuevas); fichas: 52 con nivel en `skill-hero-meta`.

## 5. Integración

- [x] 5.1 Verificar integridad de enlaces entre fichas (Q07): extraer de `dist/skills/*/index.html` todos los `href` a `/skills/<slug>/` y comprobar que cada slug tiene su `dist/skills/<slug>/index.html` con ficha real (no redirección); registrar el script y su salida.
  - Evidencia: script Python sobre `dist/skills/*/index.html` del build de producción: todos los `href="/skills/<slug>"` de las fichas reales apuntan a una ficha real → lista de enlaces rotos vacía. Hallazgo preexistente fuera de alcance: el enlace "← Skills" de las 63 fichas apunta a `/skills`, que no se genera con `sections.skills = false` (404 en producción).
- [x] 5.2 Verificar que el número de fichas generadas es 63 (53 − 1 retirado + 11 nuevos) más las 3 páginas de redirección.
  - Evidencia: build de producción → 66 directorios en `dist/skills/`: 63 fichas reales (contienen `skill-hero`) + 3 redirecciones (`http-equiv="refresh"`).
- [x] 5.3 Ejecutar `openspec validate skills-catalog-cleanup --strict` y registrar el resultado.
  - Evidencia: `openspec validate skills-catalog-cleanup --strict` → "Change 'skills-catalog-cleanup' is valid".
- [x] 5.4 Actualizar la checklist local `historia-profesional.md` (no versionado) marcando los puntos del catálogo cubiertos por este change.
  - Evidencia: `historia-profesional.md` (no versionado) con los 3 puntos del catálogo marcados como cubiertos por este change.
