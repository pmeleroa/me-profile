## Context

Ver `proposal.md` - Why. Post de opinión puro, sin demo interactiva en `/lab/`: la tesis se sostiene con evidencia textual (artículo de GitHub Blog sobre Project HydraFusion) y un precedente verificable (cambio de facturación de GitHub Copilot a "AI Credits" en junio de 2026), no con una experiencia que el lector deba vivir para entenderla — a diferencia de `perdidos-en-el-medio.mdx` o `sdd-vs-vibe-coding.mdx`.

## Goals / Non-Goals

**Goals:**
- Sostener la tesis (AI routing gana en madurez baja/media, pero traslada la política de selección de proveedor a un único orquestador) con evidencia verificable: la cita textual del artículo original y el precedente de "AI Credits", no con afirmaciones genéricas sobre "los proveedores de IA".
- Encuadrar el argumento como alerta de categoría (AI routing en general), no como crítica a GitHub en particular — el texto debe dejar explícito que HydraFusion es el caso de estudio más visible ahora mismo, no el objetivo del artículo.
- Introducir el término "soberanía tecnológica organizacional" con una definición propia y acotada (control de un equipo/empresa sobre las reglas de su propio stack de IA), distinguiéndolo explícitamente de la lectura geopolítica del mismo término ("sovereign AI") para no confundir al lector con un debate distinto.
- Cerrar de forma descriptiva: sin recomendación, sin checklist de mitigación, sin "lo que GitHub debería hacer". El lector decide su propio umbral.

**Non-Goals:**
- No se evalúan técnicamente otras herramientas de AI routing (Copilot Workspace, Cursor, otros orquestadores) ni se comparan entre sí — HydraFusion es el único caso de estudio, por ser el ejemplo con evidencia pública y reciente disponible.
- No se afirma ni se insinúa que HydraFusion vaya a cambiar de precios o de política de modelos; el precedente de "AI Credits" se usa solo como ilustración de patrón de comportamiento del mismo proveedor, nunca como predicción.
- No se prescribe una solución (p. ej. "exigid controles de pool a vuestro proveedor") — coherente con la postura descriptiva acordada.

## Decisions

**Estructura en 6 bloques** (gancho, qué es HydraFusion, la alerta, el paralelismo de "AI Credits", soberanía tecnológica organizacional, cierre descriptivo) — ya validada en conversación con el autor. Alternativa descartada: estructura clásica de crítica (tesis → contraargumentos → refutación); se descarta porque el tono acordado es de alerta/reflexión, no de debate adversarial.

**Fuentes primarias citadas explícitamente en el texto**: el artículo original de GitHub Blog (con la cita textual sobre el model pool) y al menos una de las coberturas del cambio a "AI Credits" (wwwhatsnew.com o blog.donweb.com), enlazadas como fuente, no parafraseadas sin atribución. Alternativa descartada: citar solo la fuente secundaria en español (laecuaciondigital.com) sin volver al original; se descarta porque ya se verificó el original y coincide, y citar la fuente primaria da más autoridad al argumento.

**Con campo `image` en el frontmatter**: el autor aportó una imagen real (ilustración de la hidra de HydraFusion, cabezas de proveedores encadenadas a GitHub Copilot, un guerrero enfrentándola), en `public/images/blog/ai-routing-y-soberania-tecnologica.webp`, formato WebP y dimensiones 1600×900 (16:9, coincide con `aspect-ratio: 16/9` de `.article-image` en `src/pages/blog/[slug].astro`) ya correctas desde el origen. El archivo original pesaba 523KB, muy por encima de las 50-116KB de los 3 posts existentes; se recomprimió con `sharp` (ya en devDependencies del proyecto) a calidad WebP 75, quedando en 246.7KB (-53%), verificado visualmente sin artefactos apreciables. Sigue siendo más pesada que el resto de posts por la complejidad real de la ilustración (mucho detalle/textura), no por falta de optimización — documentado como riesgo de rendimiento conocido en `tasks.md` (2.5), sin medición Lighthouse precisa por no tener la herramienta instalada en el proyecto. Decisión anterior descartada: no incluir imagen y depender del placeholder de marca — se revirtió porque el autor sí aportó un asset real. Nota: `Layout.astro` declara `og:image:width=1200`/`height=630` de forma fija en las meta tags aunque el archivo real sea 1600×900 — inconsistencia preexistente en los 3 posts ya publicados, fuera del alcance de este change.

**Tags propuestos**: `ia`, `orquestación-multi-modelo` (o `ai-routing`), `gobernanza`. Se fijan en `tasks.md` al redactar, no aquí, porque no cambian la estructura del post.

## Risks / Trade-offs

- [El lector interpreta el post como un ataque a GitHub pese al encuadre de categoría] → Mitigación: la sección 3 ("la alerta") debe abrir explícitamente reconociendo el valor real de HydraFusion para equipos poco maduros, antes de introducir el riesgo, y cerrar recordando que el problema es de categoría.
- [El precedente de "AI Credits" se lee como causa-efecto con HydraFusion, sobrecargando el argumento] → Mitigación: introducir el paralelismo con lenguaje explícito de patrón ("esto no prueba que X vaya a pasar con HydraFusion; muestra que el mismo actor ya ha cambiado reglas unilateralmente antes"), tal como se acordó con el autor.
- [El término "soberanía" se lee en su sentido geopolítico y desvía la lectura] → Mitigación: definir el término la primera vez que aparece, acotándolo explícitamente al nivel organizacional antes de usarlo el resto del post.
- [Los benchmarks citados (TerminalBench, DeepSWE, CheckpointBench) quedan desactualizados o cuestionados tras la publicación] → Aceptado: el propio artículo original ya reconoce que dependen de la configuración evaluada; el post debe recoger esa misma cautela en vez de presentar las cifras como verdad absoluta.

## Open Questions

- Título definitivo del post y slug exacto del archivo `.mdx`: se resuelven al redactar en `tasks.md`, sin que afecten a la estructura en 6 bloques ni a las fuentes citadas ya decididas aquí.
