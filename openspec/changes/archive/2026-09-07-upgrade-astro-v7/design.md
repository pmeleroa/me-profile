## Context

Ver `proposal.md` - Why. Estado actual relevante para el "cómo":

- `src/content/config.ts` define la colección `blog` como `type: 'content'` (API legacy), que Astro 6 elimina sin período de gracia salvo el flag temporal `legacy.collectionsBackwardsCompat`.
- Los consumidores de la colección (`src/pages/index.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/components/BlogPreview.astro`) leen `entry.slug` y llaman a `entry.render()`.
- El pipeline de despliegue ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) fija `node-version: 20`; Astro 7 exige Node `>=22.12.0`. El entorno local ya está en `v22.23.2`.
- El workflow de deploy solo se dispara con `push` a `main` o `workflow_dispatch` manual; no se ejecuta automáticamente en ramas.

## Goals / Non-Goals

**Goals:**
- Ejecutar el sitio sobre `astro@7.3.1` sin cambios de comportamiento observable (mismas rutas, mismo HTML de salida, mismo contenido).
- Migrar la colección `blog` a la Content Layer API (`loader: glob(...)`) de forma definitiva, sin depender de flags de compatibilidad legacy.
- Alinear la versión de Node entre entorno local y CI.

**Non-Goals:**
- No se pasa por Astro 6.x como paso intermedio (salto directo, decisión ya confirmada).
- No se cambia el schema de frontmatter del blog ni se añaden campos (`status`/`approvedBy`/`approvedAt` u otros).
- No se introduce ningún backend, CMS o tracker adicional; el stack sigue siendo Astro + colecciones de contenido + Partytown para `gtag`.
- No se rediseña la estructura de rutas (`/blog/[slug]` mantiene ese nombre de parámetro aunque el dato interno pase de `slug` a `id`).

## Decisions

**Salto directo 5 → 7.3.1 (sin pasar por 6.x)**
Las guías de migración de Astro son acumulativas y los puntos de ruptura reales para este proyecto (colecciones legacy, versión de Node) son idénticos si se hace en uno o dos saltos. Pasar por 6.x añadiría un commit/PR intermedio sin reducir el riesgo real, solo lo repartiría en el tiempo. Alternativa descartada: actualizar primero a 6.x, validar, luego a 7.x — más ceremonia sin beneficio de aislamiento de riesgo.

**Migrar a la Content Layer API en vez de usar `legacy.collectionsBackwardsCompat`**
El flag de compatibilidad es un parche temporal pensado para dar margen, no una solución final; tarde o temprano habría que hacer esta misma migración. Como el cambio real es acotado (un archivo de config + 4-5 archivos que leen `.slug`/`.render()`), se hace de una vez. Alternativa descartada: activar el flag ahora y migrar más adelante — solo pospondría trabajo ya dimensionado.

**Archivo `src/content.config.ts` con `loader: glob({ pattern: '**\/*.mdx', base: './src/content/blog' })`**
Replica el comportamiento actual (colección `blog` de archivos `.mdx`) sin cambiar el schema Zod existente. El `id` generado por el loader `glob` por defecto coincide con el `slug` que generaba la API legacy para este mismo layout de archivos, por lo que las URLs públicas no cambian.

**Renombrar `entry.slug` → `entry.id` y `entry.render()` → `render(entry)` en los puntos de consumo**
Es un cambio mecánico impuesto por la Content Layer API, no una decisión de diseño. El nombre del parámetro de ruta (`[slug].astro`, `params: { slug: ... }`) se mantiene igual porque es solo el segmento de URL, independiente del nombre del campo de datos.

**Node 24 (LTS activa) en CI, en vez de Node 22 (LTS en mantenimiento)**
Ambas versiones cumplen el mínimo de Astro 7 (`>=22.12.0`); se elige 24 por ser la LTS activa ahora mismo, maximizando el margen antes de la siguiente fecha de fin de soporte. Es una preferencia de mantenimiento, no un requisito técnico — el usuario puede preferir 22 si prioriza estabilidad probada.

**Fijar `engines.node` en `package.json`**
Se añade `"engines": { "node": ">=22.12.0" }` para que `npm install` avise si alguien intenta desarrollar con una versión de Node por debajo del mínimo real de Astro 7, sin añadir un `.nvmrc` adicional que haya que mantener sincronizado a mano.

**Actualizar `@astrojs/mdx` a la v8 y `@astrojs/partytown` a la 2.1.7**
Son las únicas versiones de estos paquetes con rango de peer-dependency compatible con `astro@7.3.1` (mdx v8 exige `astro ^7.2.6`; partytown no fija peer estricto pero se alinea a la última patch por higiene). No son dependencias nuevas, son las mismas integraciones ya usadas.

## Risks / Trade-offs

- [Riesgo] El nuevo compilador Rust de Astro ya no corrige HTML mal formado en tiempo de build (por ejemplo, etiquetas sin autocerrar) → **Mitigación**: `npm run build` completo como gate antes de abrir el PR; cualquier error de compilación se corrige en el mismo cambio.
- [Riesgo] El procesador Markdown por defecto pasa a ser Sateri y podría renderizar de forma ligeramente distinta algún caso concreto en los dos posts existentes → **Mitigación**: inspección visual manual de ambos artículos en `dist/` tras el build, comparando con el resultado actual en producción.
- [Riesgo] El workflow de deploy no se ejecuta automáticamente en ramas (`push: branches: [main]`), por lo que el bump de Node en CI no se valida hasta el merge → **Mitigación**: disparar manualmente el workflow con `gh workflow run deploy.yml --ref chore/upgrade-astro-v7` (usa `workflow_dispatch`) antes de fusionar, para confirmar que `npm ci` y `npm run build` funcionan con Node 24 en el runner real.
- [Riesgo] Un salto directo de dos majors deja menos puntos de commit intermedios para hacer bisect si algo falla ya en `main` → **Mitigación**: commits atómicos por tipo de cambio (dependencias, migración de colecciones, Node/CI) dentro de la misma rama, y build + revisión visual manual antes de fusionar.

## Migration Plan

1. Trabajar exclusivamente en la rama `chore/upgrade-astro-v7` (ya creada), nunca directamente sobre `main`.
2. Actualizar `astro`, `@astrojs/mdx` y `@astrojs/partytown` en `package.json` + `npm install`.
3. Migrar `src/content/config.ts` → `src/content.config.ts` con el loader `glob()`.
4. Actualizar los puntos de consumo (`.slug` → `.id`, `.render()` → `render()`) listados en el proposal.
5. Añadir `engines.node` a `package.json` y subir `node-version` a `24` en [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
6. Ejecutar `npm run build` e inspeccionar `dist/` (rutas del blog, HTML de los dos posts, navegación).
7. Disparar manualmente el workflow de deploy sobre la rama (`workflow_dispatch`) para validar el pipeline con Node 24 antes de fusionar.
8. Abrir PR contra `main`; fusionar solo tras build y validación manual del workflow en verde.

**Rollback**: no hay migración de datos ni backend implicado. Si algo falla tras fusionar a `main`, revertir el commit de merge (`git revert`) restaura `astro@5.18.0` y el estado anterior de las colecciones sin pasos adicionales.
