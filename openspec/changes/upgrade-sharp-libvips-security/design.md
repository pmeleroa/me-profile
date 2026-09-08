## Context

Ver `proposal.md` - Why. Estado actual relevante para el "cómo":

- `package.json` fija `sharp` en `devDependencies` como `^0.34.5`. `npm ls sharp` muestra dos instalaciones: `sharp@0.34.5` (la nuestra, directa) y `sharp@0.35.4` anidada bajo `astro@7.3.1` (dependencia transitiva de Astro para `astro:assets`, ya en versión no vulnerable).
- `npm audit --json` confirma una única vulnerabilidad `high`, `isDirect: true`, sobre nuestra `sharp` directa, con rango afectado `<0.35.0` y `fixAvailable` en `sharp@0.35.4`.
- No hay ningún `import`/`require` de `sharp` en `src/`. El único consumidor del pipeline de imágenes es `astro:assets`, usado indirectamente en `src/components/SkillsGrid.astro` y `src/pages/skills/[slug].astro` (vía `src/data/skills.ts`).
- `sharp` sigue versionado `0.x`; según semver, un cambio de MINOR (`0.34` → `0.35`) puede incluir incompatibilidades, y así lo marca `npm audit` (`isSemVerMajor: true`). El CHANGELOG upstream de `sharp` 0.35.0 documenta la subida de `libvips` a 8.18.x como cambio principal de la serie.

## Goals / Non-Goals

**Goals:**
- Eliminar la vulnerabilidad `high` de `sharp`/`libvips` (`GHSA-f88m-g3jw-g9cj`) reportada por `npm audit`, sin cambiar el comportamiento observable del sitio.
- Dejar una única versión efectiva de `sharp` no vulnerable instalada (directa + transitiva vía Astro), evitando que conviva una copia parcheada con una vulnerable.

**Non-Goals:**
- No se audita ni se corrige ninguna otra dependencia fuera de `sharp` en este change.
- No se introduce código que use `sharp` directamente ni se cambia la forma en que el proyecto genera imágenes (sigue siendo exclusivamente vía `astro:assets`).
- No se sustituye `sharp` por otra librería de procesamiento de imágenes.

## Decisions

**Actualizar a `^0.35.4` (última versión publicada) en vez de fijar exactamente `0.35.0` (mínimo que corrige el CVE)**
`0.35.4` es la versión estable más reciente en el momento del cambio e incluye correcciones adicionales posteriores a `0.35.0` dentro de la misma serie sin incompatibilidades conocidas adicionales. Fijar el mínimo exacto (`0.35.0`) dejaría la dependencia desactualizada desde el primer commit sin ningún beneficio de estabilidad, ya que ambas opciones cruzan el mismo salto de MINOR con el mismo riesgo de incompatibilidad. Alternativa descartada: `0.35.0` exacto — mismo riesgo de breaking change, sin ganar las correcciones posteriores.

**Usar rango `^0.35.4` en `package.json` (no fijar versión exacta con `=`)**
Consistente con el estilo ya usado en el proyecto para esta misma dependencia (`^0.34.5` previamente) y con el resto de `package.json`; permite parches futuros (`0.35.x`) sin nueva intervención manual, sin cruzar otro salto de MINOR que pudiera reintroducir incompatibilidades.

**No fijar `overrides`/`resolutions` para forzar una única copia de `sharp` en el árbol**
Tras el bump, la copia directa (`0.35.4`) y la transitiva de Astro (`0.35.4`) coinciden en versión de forma natural porque ambas siguen la misma release estable más reciente en este momento; forzar una resolución única añadiría complejidad de mantenimiento (un `overrides` que vigilar y desincronizar en el futuro) sin beneficio actual. Si en el futuro Astro fija una versión distinta y `npm audit` vuelve a marcar una copia vulnerable, se reconsiderará entonces.

## Risks / Trade-offs

- [Riesgo] `0.34 → 0.35` es un salto de MINOR con posibles incompatibilidades de API/ABI en `sharp`, y el binario prebuilt de `libvips` cambia de versión mayor (8.18.x) → **Mitigación**: no hay uso directo de la API de `sharp` en `src/`, solo vía `astro:assets`; se valida con `npm run build` completo y con inspección visual de las páginas que generan imágenes optimizadas (`/skills/<slug>` y cualquier imagen renderizada por `SkillsGrid.astro`) antes de fusionar.
- [Riesgo] Los binarios prebuilt de `sharp`/`libvips` para la nueva versión podrían no estar disponibles para alguna plataforma del entorno de CI (`ubuntu-latest`, Node 24) → **Mitigación**: `npm ci` en el workflow de deploy instala desde cero en cada run; se dispara manualmente el workflow (`workflow_dispatch`) sobre la rama antes de fusionar para confirmar que la instalación y el build funcionan en el runner real, igual que se hizo en el upgrade de Astro anterior.
- [Riesgo] `npm audit` podría seguir reportando la vulnerabilidad si queda alguna copia antigua de `sharp` cacheada en `node_modules` o en el lockfile tras una actualización parcial → **Mitigación**: regenerar `package-lock.json` con `npm install` y confirmar con `npm ls sharp` que todas las instalaciones quedan en `0.35.4`, y con `npm audit` que la vulnerabilidad desaparece.

## Migration Plan

1. Trabajar exclusivamente en la rama `chore/upgrade-sharp-libvips-security` (ya creada), nunca directamente sobre `main`.
2. Actualizar `sharp` a `^0.35.4` en `package.json` (devDependencies) y ejecutar `npm install` para regenerar `package-lock.json`.
3. Verificar con `npm ls sharp` que todas las instalaciones (directa y transitiva vía Astro) quedan en `0.35.4`, y con `npm audit` que la vulnerabilidad `GHSA-f88m-g3jw-g9cj` ya no aparece.
4. Ejecutar `npm run build` completo y registrar el resultado.
5. Inspeccionar visualmente en `npm run dev` (o en `dist/` tras el build) las páginas que generan imágenes optimizadas vía `astro:assets` (`/skills/<slug>`, `SkillsGrid.astro`), confirmando que no hay regresiones.
6. Disparar manualmente el workflow de deploy sobre la rama (`gh workflow run deploy.yml --ref chore/upgrade-sharp-libvips-security`) para validar `npm ci` + `npm run build` en el runner de CI antes de fusionar.
7. Abrir PR contra `main` con referencia a este change de OpenSpec; fusionar solo tras build y validación manual en verde.

**Rollback**: no hay migración de datos ni backend implicado. Si tras fusionar a `main` aparece una regresión, revertir el commit (`git revert`) restaura `sharp@0.34.5` y el estado anterior; esto reintroduce la vulnerabilidad reportada, por lo que solo debe usarse como medida temporal mientras se investiga la causa.
