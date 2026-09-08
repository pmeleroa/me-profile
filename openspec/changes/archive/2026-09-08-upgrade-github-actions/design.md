## Context

Ver `proposal.md` - Why. Estado actual relevante para el "cómo":

- `.github/workflows/deploy.yml` corre en `runs-on: ubuntu-latest` (runner hosteado por GitHub, siempre en la versión más reciente del software de runner).
- `package.json` no declara el campo `packageManager`; el cacheo de dependencias en el job `build` se hace hoy de forma explícita con `actions/setup-node@v4` + `cache: npm`.
- `public/` no contiene ningún dotfile (`find public -name ".*"` no devuelve nada), y el despliegue usa el flujo moderno basado en Actions (`upload-pages-artifact` + `deploy-pages`), que no pasa por Jekyll.
- Revisando los release notes de cada salto de major entre la versión fijada hoy y la última publicada:
  - `actions/checkout` v4 → v5: pasa a Node 24 internamente y exige runner ≥ `v2.327.1`. v5 → v7: sin cambios breaking adicionales (fixes y dependencias).
  - `actions/setup-node` v4 → v5: mismo requisito de runner/Node 24, y añade auto-caché si detecta `packageManager` en `package.json` (no aplica aquí, no existe ese campo). v5 → v7: migración interna a ESM, sin impacto para quien consume la action.
  - `actions/upload-pages-artifact` v3 → v4: deja de incluir dotfiles ocultos por defecto en el artefacto (no aplica, no hay dotfiles en `public/`). v4 → v5: actualiza `upload-artifact` interno a v7 y añade el input opcional `include-hidden-files`.
  - `actions/deploy-pages` v4 → v5: actualiza a Node 24 internamente; v5.0.0 → v5.0.1 solo añade backoff/jitter al polling del despliegue.

## Goals / Non-Goals

**Goals:**
- Dejar las cuatro actions del workflow en su última versión estable publicada, sin cambiar el comportamiento observable del pipeline (build, release, despliegue).
- Confirmar, antes de fusionar, que ningún breaking change documentado en los changelogs afecta a este workflow concreto.

**Non-Goals:**
- No se revisa ni se modifica la lógica propia del workflow (gate `check-commit`, generación de release notes, permisos, triggers).
- No se introduce ninguna action nueva ni se sustituye ninguna de las cuatro por una alternativa.
- No se fija `packageManager` en `package.json` ni se activa el auto-cacheo nuevo de `setup-node`; se mantiene el `cache: npm` explícito ya usado.

## Decisions

**Saltar directamente a la última versión publicada de cada action (v7.0.1 / v7.0.0 / v5.0.0 / v5.0.1) en vez de subir de major en major**
Ya se revisaron los release notes de todos los saltos intermedios y ninguno introduce un breaking change que afecte a este pipeline (runner hosteado siempre actualizado, sin `packageManager` en `package.json`, sin dotfiles en `public/`). Subir de major en major con una PR por salto añadiría cuatro veces más ciclos de rama/PR sin reducir el riesgo real, ya evaluado. Alternativa descartada: actualizar de major en major — mismo resultado final, más overhead de proceso sin beneficio en un cambio de bajo riesgo ya auditado.

**Fijar versión completa con patch (`@v7.0.1`, `@v5.0.0`, etc.) en vez de solo el major (`@v7`)**
Consistente con el estilo ya usado en el workflow (`actions/checkout@v4`, no `@v4.x`, pero siempre un tag concreto, no un SHA ni `@main`); fijar el patch exacto documenta en el propio diff qué versión se auditó en este change. Alternativa descartada: fijar solo el major (`@v7`) — sigue moviéndose automáticamente con futuros patches sin que quede registro de cuál se validó aquí; se puede reconsiderar en un change futuro si se decide adoptar ese estilo para todo el workflow.

## Risks / Trade-offs

- [Riesgo] `actions/checkout@v5+` y `actions/setup-node@v5+` exigen runner de Actions ≥ `v2.327.1` → **Mitigación**: el workflow usa `ubuntu-latest` (runner hosteado por GitHub), que ya cumple ese mínimo; no aplica a runners self-hosted porque este repositorio no usa ninguno.
- [Riesgo] `actions/setup-node@v5+` podría activar auto-cacheo por `packageManager` y solapar con el `cache: npm` ya configurado → **Mitigación**: `package.json` no declara `packageManager`; se confirma tras la actualización que el paso de `setup-node` sigue restaurando caché por `package-lock.json` igual que antes (mismo log de "Cache restored" en el job `build`).
- [Riesgo] `actions/upload-pages-artifact@v4+` excluye dotfiles del artefacto subido, lo que rompería un despliegue que dependiera de un `.nojekyll` u otro dotfile en `dist/` → **Mitigación**: confirmado que `public/` no contiene dotfiles y que el flujo Actions-based de Pages no requiere `.nojekyll` (no pasa por Jekyll); se verifica igualmente el contenido de `dist/` tras el build antes de fusionar.
- [Riesgo] Cambiar las cuatro actions a la vez dificulta aislar cuál introduce un fallo si el pipeline se rompe → **Mitigación**: se dispara el workflow manualmente (`workflow_dispatch`) sobre la rama del change antes de fusionar, igual que en `upgrade-astro-v7` y `upgrade-sharp-libvips-security`, para validar el pipeline completo en el runner real antes de que llegue a `main`.

## Migration Plan

1. Trabajar exclusivamente en la rama `chore/upgrade-github-actions` (creada desde `main` actualizada), nunca directamente sobre `main`.
2. Actualizar en `.github/workflows/deploy.yml` las cuatro referencias de versión: `actions/checkout@v4` → `@v7.0.1` (tres apariciones), `actions/setup-node@v4` → `@v7.0.0`, `actions/upload-pages-artifact@v3` → `@v5.0.0`, `actions/deploy-pages@v4` → `@v5.0.1`.
3. Disparar manualmente el workflow sobre la rama (`gh workflow run deploy.yml --ref chore/upgrade-github-actions`) y confirmar con `gh run view <run-id>` que los cuatro jobs (`check-commit`, `build`, `release`, `deploy`) terminan en verde, que el job `build` sigue restaurando caché de npm correctamente y que el artefacto de Pages se genera y despliega sin diferencias respecto al pipeline anterior.
4. Abrir PR contra `main` referenciando este change de OpenSpec; fusionar solo tras confirmar el run manual en verde.

**Rollback**: no hay migración de datos ni backend implicado. Si tras fusionar aparece una regresión en el pipeline, revertir el commit (`git revert`) restaura las versiones de action anteriores (`v4`/`v4`/`v3`/`v4`); es una medida solo temporal, ya que reintroduce el desfase de versiones que corrige este change.
