## Why

Falta en el blog un artículo que aborde la orquestación multi-modelo de IA ("AI routing") con una lectura propia en vez del entusiasmo habitual por las cifras de benchmark. GitHub acaba de publicar Project HydraFusion (orquestación entre proveedores con patrones single/cascade/critique) presentándolo como una mejora directa de calidad y coste. El propio artículo, sin embargo, confirma en una cita textual que es GitHub quien decide unilateralmente qué modelos entran en el pool de decisión ("When new models become available in GitHub Copilot, we can evaluate and incorporate them into its model pool"), sin mención de ningún control organizacional para restringir proveedores, forzar modelos locales o fijar políticas de gobierno del dato. Conviene publicarlo ahora porque el propio GitHub Copilot ya ha demostrado, con el cambio de facturación a "AI Credits" en junio de 2026 y el consiguiente "tokenpocalypse", que puede alterar unilateralmente las reglas de un producto del que los equipos dependen — un precedente concreto que ilustra el riesgo, no una hipótesis abstracta.

## What Changes

- Nuevo post en la colección `blog` (categoría `Opinión`): analiza el AI routing usando Project HydraFusion como caso de estudio, sosteniendo que resuelve un problema real para equipos con adopción de IA baja o media, pero traslada a un único proveedor la política de qué modelos/proveedores participan — un coste de soberanía tecnológica organizacional (auditoría, autonomía, reproducibilidad) que la categoría de herramientas de AI routing en su conjunto va a tener que resolver, no un ataque a GitHub en particular.
- Evidencia citada: benchmarks y cita textual del artículo original de GitHub Blog sobre Project HydraFusion; precedente del cambio de facturación de GitHub Copilot a "AI Credits" (junio 2026) y el backlash conocido como "tokenpocalypse", usado como ilustración de patrón, no como causa-efecto directo con HydraFusion.
- Cierre descriptivo, sin prescribir: no se exige ninguna acción al lector ni al proveedor; cada equipo decide su propio umbral entre conveniencia y soberanía según su madurez.
- Sin demo interactiva en `/lab/`: no aplica, es un post puramente argumentativo sin un contrato o flujo de producto que ilustrar de forma interactiva.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna)

Este change fija `skip_specs: true` en `.openspec.yaml`: la colección `blog` no tiene spec propia en este repositorio — es contenido, no una capability con contrato de comportamiento, y este post no introduce ni modifica ningún campo de schema.

## Impact

- **Contenido**: nuevo archivo `.mdx` en `src/content/blog/` (p. ej. `ai-routing-y-soberania-tecnologica.mdx`).
- **Código**: ninguno. No se añade página en `/lab/`.
- **Schema**: sin cambios en `src/content.config.ts` ni en el schema de la colección `blog`.
- **Contrato de publicación** (`status`/`approvedBy`/`approvedAt`): no aplica. Esos campos no existen en el schema actual de la colección `blog` y esta propuesta no los introduce.
