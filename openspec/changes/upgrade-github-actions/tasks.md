## 1. Rama

- [ ] 1.1 Crear la rama `chore/upgrade-github-actions` desde `main` actualizada; verificar con `git branch --show-current`.

## 2. Actualización de versiones

- [ ] 2.1 Actualizar en `.github/workflows/deploy.yml` las tres apariciones de `actions/checkout@v4` a `actions/checkout@v7.0.1` (jobs `check-commit`, `build`, `release`); verificar con `grep -n "actions/checkout@" .github/workflows/deploy.yml` que las tres quedan en `v7.0.1`.
- [ ] 2.2 Actualizar `actions/setup-node@v4` a `actions/setup-node@v7.0.0` en el job `build`; verificar con `grep -n "actions/setup-node@" .github/workflows/deploy.yml`.
- [ ] 2.3 Actualizar `actions/upload-pages-artifact@v3` a `actions/upload-pages-artifact@v5.0.0` en el job `build`; verificar con `grep -n "actions/upload-pages-artifact@" .github/workflows/deploy.yml`.
- [ ] 2.4 Actualizar `actions/deploy-pages@v4` a `actions/deploy-pages@v5.0.1` en el job `deploy`; verificar con `grep -n "actions/deploy-pages@" .github/workflows/deploy.yml`.

## 3. Validación de pipeline y entrega

- [ ] 3.1 Disparar manualmente el workflow sobre la rama (`gh workflow run deploy.yml --ref chore/upgrade-github-actions`) y confirmar con `gh run view <run-id>` que los cuatro jobs (`check-commit`, `build`, `release`, `deploy`) terminan en verde (no quedan `skipped` por el gate `check-commit`).
- [ ] 3.2 Revisar el log del job `build` y confirmar que el paso de `setup-node` sigue restaurando/guardando la caché de npm correctamente (mensaje de cache hit/save equivalente al de ejecuciones previas del workflow).
- [ ] 3.3 Revisar el log de los jobs `build` y `deploy` y confirmar que el artefacto de Pages se sube y se despliega sin errores ni advertencias nuevas respecto a ejecuciones previas del workflow.
- [ ] 3.4 Abrir el PR contra `main` con el resumen de la actualización de versiones; verificar que la descripción enlaza a este change de OpenSpec (`openspec/changes/upgrade-github-actions/`) y referencia el run manual verde de la tarea 3.1.

**Rollback**: si tras fusionar a `main` aparece una regresión en el pipeline (build, release o despliegue), revertir el commit (`git revert`) restaura las versiones de action anteriores (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`). No hay migración de datos ni backend implicado; es una medida solo temporal, ya que reintroduce el desfase de versiones que corrige este change.
