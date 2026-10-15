# Tasks

Rollback de todo el change: `git revert <commit>` del commit de implementación (o `git checkout main -- src/data/skills.ts src/components/SkillsGrid.astro src/pages/skills/[slug].astro astro.config.mjs` antes de mergear). Restaura slugs antiguos y elimina las redirecciones; nada externo depende aún de los slugs nuevos.

## 1. Nivel opcional (D5)

- [ ] 1.1 Cambiar el tipo `Skill` a `level?: 1 | 2 | 3 | 4 | 5` en `src/data/skills.ts`; verificar con `npx astro check` sin errores nuevos de tipo (registrar el comando y el resultado).
- [ ] 1.2 Renderizar la etiqueta de nivel en `SkillsGrid.astro` solo si `skill.level` está definido; verificar en `dist/` (tras `npm run build`) que una tarjeta con nivel conserva su `skill-level-label` y que, con un skill temporal sin nivel, la tarjeta no contiene `skill-level-label` (registrar el `grep` y su salida).
- [ ] 1.3 En `src/pages/skills/[slug].astro`, renderizar el nivel solo si está definido y omitir el contenedor `skill-hero-meta` cuando no haya ni nivel ni `featured`; verificar en `dist/skills/<slug>/index.html` de un skill sin nivel que no hay etiqueta de nivel ni `skill-hero-meta` vacío.
- [ ] 1.4 Verificar Q02 con un skill sin nivel: el grid y la ficha a 360, 390, 768 y 1440 px no tienen scroll horizontal y la fila superior de la tarjeta mantiene la alineación con sus vecinas (registrar cómo se comprobó).

## 2. Renombrados y retirada (D2, D3)

- [ ] 2.1 Renombrar "JIRA Tooling" → "Atlassian Tooling": icono `simpleIcon('atlassian')`, tagline de D2, clave en `explicitLabels` (`AT`) y `related` de `itsm-itil` a `atlassian-tooling`; verificar que existe `dist/skills/atlassian-tooling/index.html` y que la ficha de ITSM / ITIL enlaza a `/skills/atlassian-tooling/`.
- [ ] 2.2 Renombrar "Python / ML" → "Python" con el tagline de D2 y su clave en `explicitLabels`; verificar que existe `dist/skills/python/index.html` y que no se genera una ficha propia en `dist/skills/python-ml/` (salvo la página de redirección de la sección 3).
- [ ] 2.3 Retirar "ML e IA en Google Cloud" del array y de `explicitLabels`; verificar con `grep -rn "ML e IA en Google Cloud\|ml-e-ia-en-google-cloud" src` que solo queda (si acaso) la redirección en `astro.config.mjs`.

## 3. Redirecciones (D4)

- [ ] 3.1 Añadir a `redirects` de `astro.config.mjs` las tres entradas de D4; verificar tras `npm run build` que `dist/skills/jira-tooling/index.html`, `dist/skills/python-ml/index.html` y `dist/skills/ml-e-ia-en-google-cloud/index.html` contienen meta-refresh, `noindex` y `rel="canonical"` hacia `/skills/atlassian-tooling`, `/skills/python` y `/skills/google-cloud-platform` respectivamente (registrar el `grep`).
- [ ] 3.2 Verificar que cada destino de redirección existe como ficha: `ls dist/skills/atlassian-tooling dist/skills/python dist/skills/google-cloud-platform`.

## 4. Skills nuevos (D1)

- [ ] 4.1 Añadir los 11 skills de D1 (nombre, categoría, icono, tagline; **sin `level`**) en las posiciones indicadas en D1, y las etiquetas de `explicitLabels` para los de icono genérico (`AZ`, `DSO`, `CX`, `RAG`, `OKF`, `APM`); verificar que existen `dist/skills/{opentelemetry,grafana-stack,argocd,azure,kafka-connect,devsecops,claude,codex,rag,okf,apm}/index.html`.
- [ ] 4.2 Verificar que los iconos externos de los skills nuevos responden 200 (`curl -s -o /dev/null -w "%{http_code}"` sobre `opentelemetry`, `grafana`, `argo`, `claude`, `atlassian`, `apachekafka` en `cdn.simpleicons.org`) y que los de icono genérico muestran su etiqueta en la tarjeta.
- [ ] 4.3 Verificar que ningún skill nuevo muestra etiqueta de nivel en tarjeta ni ficha (`grep` sobre las fichas generadas) y que todos los skills existentes la conservan.

## 5. Integración

- [ ] 5.1 Verificar integridad de enlaces entre fichas (Q07): extraer de `dist/skills/*/index.html` todos los `href` a `/skills/<slug>/` y comprobar que cada slug tiene su `dist/skills/<slug>/index.html` con ficha real (no redirección); registrar el script y su salida.
- [ ] 5.2 Verificar que el número de fichas generadas es 63 (53 − 1 retirado + 11 nuevos) más las 3 páginas de redirección.
- [ ] 5.3 Ejecutar `openspec validate skills-catalog-cleanup --strict` y registrar el resultado.
- [ ] 5.4 Actualizar la checklist local `historia-profesional.md` (no versionado) marcando los puntos del catálogo cubiertos por este change.
