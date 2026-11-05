# Proposal

## Why

El catálogo de skills (`src/data/skills.ts`) no refleja la experiencia profesional validada por el autor en la exploración de su trayectoria: faltan tecnologías que usó de forma relevante (observabilidad con OpenTelemetry y el stack Grafana, GitOps con ArgoCD, DevSecOps, Azure, Kafka Connect, harnesses de IA, RAG, OKF, APM), sobra un skill que el autor no reconoce como propio ("ML e IA en Google Cloud") y dos nombres no se ajustan a cómo describe su experiencia ("JIRA Tooling", "Python / ML").

Este change va primero porque el siguiente, `experience-skill-mapping`, enlazará los logros de cada etapa profesional con skills del catálogo por su slug: los slugs tienen que ser los definitivos antes de que nada los referencie.

## What Changes

- Renombrar "JIRA Tooling" → "Atlassian Tooling" (JIRA, Confluence y Bitbucket). Cambia el slug: `jira-tooling` → `atlassian-tooling`.
- Renombrar "Python / ML" → "Python". Cambia el slug: `python-ml` → `python`.
- Retirar "ML e IA en Google Cloud" (`ml-e-ia-en-google-cloud`).
- Añadir los skills que faltan, procedentes de los capítulos V (Plataforma) y VI (IA) de la trayectoria: OpenTelemetry, Grafana, Tempo, Loki, ArgoCD, Azure, DevSecOps (SAST, DAST, IaC, CNAPP), Kafka Connect, Codex, Claude, RAG, OKF (Open Knowledge Framework) y APM (Agent Package Manager). La agrupación de algunos de ellos en un único skill queda como decisión de diseño.
- Actualizar las referencias internas (`related`, etiquetas de icono explícitas) a los slugs renombrados o retirados.
- Mantener accesibles las URLs públicas de los skills renombrados o retirados: las fichas `/skills/<slug>/` están publicadas (aunque la sección de skills está desactivada en la home), así que un renombrado sin redirección rompe enlaces existentes.

Fuera de alcance (changes posteriores):

- Reescribir las fichas de detalle con evidencia de la trayectoria y la relación "se apoya en" (`experience-skill-mapping`).
- Reformular en pasado las fichas que hablan en presente de la etapa en El Corte Inglés (`positioning-refresh`).
- Reactivar la sección de skills en la home o cambiar el sistema de niveles.

No afecta a la colección de contenido del blog ni a su contrato de publicación (status/approvedBy/approvedAt).

## Capabilities

### New Capabilities

- `skills`: catálogo de skills y sus fichas de detalle públicas (`/skills/<slug>/`), incluida la estabilidad de sus URLs ante renombrados y retiradas.

### Modified Capabilities

(ninguna)

## Impact

- `src/data/skills.ts`: entradas del catálogo, `skillDetails`, mapa `explicitLabels` y referencias `related`.
- `astro.config.mjs`: redirecciones de los slugs antiguos (mismo mecanismo de `redirects` que ya usa el lab).
- `public/skills/`: posibles iconos nuevos para los skills añadidos que no tengan icono en Simple Icons.
- Páginas generadas: `/skills/<slug>/` se crean para los nuevos skills y desaparecen las de los slugs antiguos, sustituidas por redirecciones.
- Sin dependencias nuevas.
