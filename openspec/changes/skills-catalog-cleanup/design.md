# Design

## Context

- El catálogo vive en `src/data/skills.ts`. Las tarjetas (`SkillsGrid.astro`) y las fichas (`src/pages/skills/[slug].astro`) se generan a partir de él. El slug se deriva del nombre (`getSkillSlug`), así que **renombrar un skill cambia su URL**.
- Las fichas `/skills/<slug>/` están en producción y responden 200 (comprobado sobre `https://pablomeleroalonso.me/skills/jira-tooling/`). El listado `/skills/` no se genera porque `sections.skills = false`, y la home no enlaza a las fichas. Aun así, cualquier enlace externo o indexado a un slug antiguo se rompería.
- El sitio ya redirige una URL heredada con la opción `redirects` de `astro.config.mjs` (`/gamification/test-memoria.html` → `/lab/test-memoria`). En build estático, Astro genera una página con meta-refresh, `rel=canonical` y `noindex`, que es justo el comportamiento que pide la spec.
- `level` es obligatorio en el tipo `Skill` (`1 | 2 | 3 | 4 | 5`) y se pinta con `levelLabels[skill.level]` en la tarjeta y en la ficha. El autor ha decidido no fijar todavía el nivel de los skills nuevos.
- Los iconos externos salen de `cdn.simpleicons.org`. Disponibilidad comprobada el 2026-10-15: `opentelemetry`, `grafana`, `argo`, `claude`, `atlassian` y `apachekafka` responden 200; `microsoftazure` y `openai` responden 404.

## Goals / Non-Goals

**Goals:**

- Que el catálogo contenga exactamente la lista acordada en la proposal, con los slugs definitivos sobre los que se apoyará `experience-skill-mapping`.
- Que ninguna URL de skill publicada antes del change deje de resolver.
- Añadir skills sin nivel sin inventar uno y sin que se rompa la maquetación.

**Non-Goals:**

- Escribir `skillDetails` a medida para los skills nuevos. Usarán el texto por defecto de su categoría hasta `experience-skill-mapping`.
- Revisar el nivel de los skills existentes o el sistema de niveles en sí.
- Generar el listado `/skills/` o cambiar `sections.ts`.

## Decisions

### D1. Skills nuevos y su agrupación

Agrupación aprobada por el autor: los harnesses de IA van separados, siguiendo el precedente de "GitHub Copilot", y el stack Grafana se agrupa en un único skill.

| Nombre | Slug | Categoría | Icono | Tagline |
|---|---|---|---|---|
| OpenTelemetry | `opentelemetry` | tecnologia | `simpleIcon('opentelemetry')` | Instrumentación estándar de logs, métricas y trazas |
| Grafana Stack | `grafana-stack` | tecnologia | `simpleIcon('grafana')` | Grafana, Tempo y Loki: visualización, trazas y logs sobre plataformas de contenedores |
| ArgoCD | `argocd` | tecnologia | `simpleIcon('argo')` | Despliegue declarativo GitOps sobre Kubernetes/OpenShift |
| Azure | `azure` | tecnologia | genérico (`skills/categories/tecnologia.svg`) | Servicios cloud dentro de estrategias híbridas y multicloud |
| Kafka Connect | `kafka-connect` | tecnologia | `simpleIcon('apachekafka')` | Replicación y sincronización de datos vía Kafka |
| DevSecOps | `devsecops` | procesos | genérico (`skills/categories/procesos.svg`) | Seguridad integrada en el SDLC: SAST, DAST, IaC y CNAPP |
| Claude | `claude` | ia | `simpleIcon('claude')` | Harness y modelos de Anthropic aplicados al desarrollo |
| Codex | `codex` | ia | genérico (`skills/categories/ia.svg`) | Harness de OpenAI para desarrollo asistido por agentes |
| RAG | `rag` | ia | genérico | Recuperación de contexto para respuestas fundamentadas |
| OKF | `okf` | ia | genérico | Open Knowledge Framework: organización del conocimiento para consumo por agentes |
| APM | `apm` | ia | genérico | Agent Package Manager: distribución y versionado de skills, prompts y agentes |

Notas:

- **Nombres cortos y slugs.** `getSkillSlug` conserva el texto entre paréntesis (por ejemplo, "OKF (Open Knowledge Framework)" daría `okf-open-knowledge-framework`). Por eso el nombre es corto (`Grafana Stack`, `OKF`, `APM`) y el detalle o la expansión de la sigla van al principio del tagline. Así los slugs quedan estables y legibles.
- **Iconos genéricos.** Siguen el patrón existente (`skills/categories/<categoria>.svg` + `explicitLabels`). Se añaden las etiquetas `AZ`, `DSO`, `CX`, `RAG`, `OKF`, `APM`.
- **Posición en el array.** Cada skill nuevo se inserta junto a sus afines (OpenTelemetry y Grafana Stack junto a Prometheus y Elastic Stack, ArgoCD junto a GitOps, Kafka Connect junto a Kafka Streams, Azure junto a Multicloud, DevSecOps junto a DevOps, y los de IA junto a GitHub Copilot). El orden del array es el orden del grid.
- **Alternativa descartada:** un skill "Harnesses de IA (Claude, Codex, Copilot)". Obligaría a retirar "GitHub Copilot", que ya está publicado, y la agrupación por tecnología concreta es la que usa el resto del catálogo.

### D2. Renombrados

| Antes | Después | Slug nuevo | Cambios asociados |
|---|---|---|---|
| JIRA Tooling | Atlassian Tooling | `atlassian-tooling` | icono `simpleIcon('atlassian')`; tagline "Plugins, integraciones por API y métricas operativas sobre JIRA, Confluence y Bitbucket"; `explicitLabels` `AT`; `related` de `itsm-itil` |
| Python / ML | Python | `python` | tagline sin ML: "Automatización, tooling y evaluación de soluciones de IA con Python"; se mantiene en la categoría `ia` (en la trayectoria aparece en el capítulo VI); `explicitLabels` |

### D3. Retirada

"ML e IA en Google Cloud" se elimina del array y de `explicitLabels`. El sustituto designado por el autor es **Google Cloud Platform** (`google-cloud-platform`). Ningún `related` explícito lo referencia hoy. El fallback por categoría lo calcula en tiempo de build, así que desaparece solo.

### D4. Redirecciones con `redirects` de Astro

Se añaden a `astro.config.mjs`:

```js
'/skills/jira-tooling': '/skills/atlassian-tooling',
'/skills/python-ml': '/skills/python',
'/skills/ml-e-ia-en-google-cloud': '/skills/google-cloud-platform',
```

- **Por qué este mecanismo:** ya es el que usa el sitio y cumple la spec (meta-refresh, `canonical`, `noindex`) sin dependencias nuevas. El hosting es estático, así que no se puede devolver un 301 real.
- **Alternativa descartada:** mantener una ficha duplicada con el slug antiguo. Generaría contenido duplicado indexable.
- La spec exige que el destino exista. Se comprueba en el build (tareas) y no con código en tiempo de ejecución, porque son tres entradas estáticas.

### D5. `level` opcional

- El tipo pasa a `level?: 1 | 2 | 3 | 4 | 5`. En el array, los skills nuevos **no declaran** `level`. Esa ausencia es la declaración explícita de "pendiente", en línea con la regla del proyecto de no inventar contenido.
- `SkillsGrid.astro` y `[slug].astro` renderizan la etiqueta de nivel solo si `skill.level` está definido. En la ficha, si no hay nivel ni `featured`, no se renderiza el contenedor `skill-hero-meta`, para no dejar un bloque vacío.
- **Alternativa descartada:** mostrar "Nivel pendiente". Publicaría un estado interno de trabajo y el lector no gana nada con ello.
- **Alternativa descartada:** asignar un nivel provisional. Contradice la regla de no inventar.

## Risks / Trade-offs

- [Los skills nuevos usan el texto genérico de su categoría en la ficha, lo que empeora el problema de las fichas genéricas (de 41 a 52)] → Se acepta temporalmente. `experience-skill-mapping` sustituye ese texto por evidencia y es el siguiente change.
- [Una tarjeta sin etiqueta de nivel puede desalinear la fila superior del grid] → Verificar en 360, 390, 768 y 1440 px (Q02) que la fila del icono mantiene la altura con y sin etiqueta.
- [Un icono de Simple Icons puede desaparecer en el futuro, como ya ha pasado con `microsoftazure` y `openai`] → Riesgo existente en todo el catálogo. Fuera de alcance.
- [El slug renombrado puede seguir referenciado fuera del sitio, por ejemplo en LinkedIn] → Cubierto por D4.

## Migration Plan

1. Cambios de datos y de tipo en `skills.ts`, renderizado condicional del nivel y redirecciones en `astro.config.mjs`, en la rama `feat/skills-catalog-cleanup`.
2. `npm run build` e inspección de `dist/`: fichas nuevas, ausencia de fichas antiguas, páginas de redirección y enlaces de "Skills relacionados".
3. **Rollback:** `git revert` del commit de implementación. Restaura los slugs antiguos y elimina las redirecciones. Ninguna fuente externa depende todavía de los slugs nuevos.
