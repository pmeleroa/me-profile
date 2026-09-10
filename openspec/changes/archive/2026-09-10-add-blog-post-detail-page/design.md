## Context

`src/pages/blog/[slug].astro` ya es la página de detalle real (no hay que crearla desde cero): recibe el post vía `getStaticPaths` sobre la colección `blog` (`astro:content`, Content Layer API con `glob` + `zod`), renderiza el `Content` compilado por `render(post)`, y reutiliza `Layout.astro`, `Header.astro`, `Footer.astro` y `BlogCard.astro` (para relacionados). `Layout.astro` ya resuelve canonical y Open Graph/Twitter Card genéricos, pero con `og:type` fijo a `website` y sin mecanismo para inyectar `<head>` adicional por página. Ningún post existente define hoy `image`, así que el estado "sin imagen destacada" es hoy el caso común, no el excepcional. Ver `proposal.md` para la motivación completa de cada hueco.

## Goals / Non-Goals

**Goals:**
- Reordenar y completar `/blog/[slug]` para cubrir la estructura de 10 bloques pedida, sin romper lo que ya funciona (relacionados, autor, tags → filtro).
- Extender `Layout.astro` de forma retrocompatible para soportar `og:type: article`, meta `article:*` y JSON-LD, sin acoplarlo al dominio de blog.
- Mantener la página desacoplada de un post concreto: toda variación (imagen ausente, autor ausente, sin actualización, CTA distinta) se resuelve con datos, no con ramas de código específicas de un post.

**Non-Goals:**
- No se hace `image` obligatorio en el schema de `blog` (queda como trabajo futuro ya documentado en `openspec/config.yaml`; hacerlo requeriría un plan de migración de los posts existentes que no aplica aquí).
- No se añade autor por post (`author` en el frontmatter de cada `.mdx`): el sitio sigue siendo de un único autor conocido; la tolerancia a "sin autor" se resuelve a nivel de dato centralizado del sitio, no por post.
- No se añade mecanismo real de suscripción/newsletter: la CTA final admite texto/etiqueta/destino configurables, pero no hay backend de captura de email en este stack (Astro estático, sin backend).
- No se publica ni se añade ningún post real a `src/content/blog/`.

## Decisions

**Extender `Layout.astro` con props opcionales + slot, en vez de crear un layout nuevo para blog.**
Se añaden `type?: 'website' | 'article'` (por defecto `'website'`, así el resto de páginas no cambia), `publishedTime?: string`, `modifiedTime?: string`, y un `<slot name="head" />` justo antes de `</head>`. Alternativa considerada: un `BlogPostLayout.astro` que envuelva a `Layout`. Se descarta porque duplicaría la resolución de canonical/OG que ya vive en `Layout`, para un único punto de uso adicional; el slot nombrado es el mecanismo estándar de Astro para inyectar contenido de `<head>` sin acoplar el layout genérico al dominio de blog.

**JSON-LD (`BlogPosting` + `BreadcrumbList`) inline en `[slug].astro`, sin componente `Seo*.astro` nuevo.**
Solo hay un punto de uso hoy (la página de artículo). Extraer un componente reutilizable sería anticipar generalidad que no existe todavía; se genera el JSON-LD a partir de las mismas variables (`post.data`, `formattedDate`, categoría, breadcrumb) que ya alimentan el HTML visible, para que ambos no puedan desincronizarse.

**Autor centralizado en `src/data/author.ts`, sin campo `author` por post.**
Sigue el patrón ya existente de `src/data/about.ts`, `contact.ts`, `hero.ts` (datos del sitio, no del contenido de cada post). El bloque de autor de `[slug].astro` pasa de tener el nombre/bio/enlaces hardcodeados inline a importar este módulo; si en el futuro se necesitara autor por post, ese dato ya estaría desacoplado del componente de render. La tolerancia "sin autor" pedida se cubre así: si `author` no está definido (módulo vacío o `null`), el bloque completo se omite.

**CTA final configurable con tres campos opcionales de frontmatter (`ctaLabel`, `ctaText`, `ctaHref`).**
Alternativa considerada: una tabla de CTAs por categoría (p.ej. "Marketing" → CTA de suscripción, "DevOps" → CTA de contacto). Se descarta por ser más implícita y menos predecible que dejar que cada post declare su propia CTA cuando quiera desviarse del valor por defecto (CTA de contacto actual), que es exactamente lo pedido ("CTA final opcional: suscripción, contacto o lectura recomendada").

**El fixture de contenido de ejemplo no se versiona; usa una categoría ya existente en vez de añadir `Marketing` al enum.**
Añadir una categoría nueva a `content.config.ts` es una decisión de taxonomía real del blog (afecta al listado, los filtros y las tarjetas), no algo que deba decidir una propuesta centrada en la página de detalle. Verificar la página con `npm run build` + inspección de `dist/` no requiere que la categoría del fixture coincida literalmente con "Marketing": basta con reutilizar una de las 5 categorías existentes y mantener el resto de campos (título, bajada, fecha, tags, CTA) fieles al pedido. El fixture se crea y se descarta durante `apply`, siguiendo la guía ya existente en `openspec/config.yaml` de preferir fixtures temporales no versionados sobre contenido de prueba permanente.

**Imagen destacada del artículo: se omite por completo sin `image`, sin placeholder de marca.**
A diferencia de `BlogCard` (donde el placeholder evita que la altura de la tarjeta varíe dentro de una rejilla), la página de artículo no tiene ese problema de alineación entre elementos hermanos: omitir el bloque entero es más limpio que forzar un placeholder de marca a tamaño de imagen destacada.

## Risks / Trade-offs

- [Riesgo] Reordenar la cabecera del artículo puede desalinear las clases `reveal`/`reveal-delay-N` (animación de aparición al hacer scroll) que ya usan varios bloques → Mitigación: conservar el mismo patrón de clases al mover elementos, y verificar visualmente con `npm run dev` que la secuencia de aparición sigue el nuevo orden.
- [Riesgo] Los tres campos nuevos de frontmatter (`ctaLabel`, `ctaText`, `ctaHref`) podrían usarse de forma inconsistente en posts futuros (p.ej. solo `ctaHref` sin `ctaText`) → Mitigación: los tres son opcionales pero se resuelven como grupo — si el post no define los tres, la página usa el grupo completo por defecto (contacto), nunca una mezcla de campos propios y por defecto.
- [Riesgo] Extender `Layout.astro` (usado por todas las páginas del sitio) podría alterar sin querer el `<head>` de páginas no relacionadas con blog → Mitigación: todos los props nuevos son opcionales con el valor por defecto igual al comportamiento actual (`type: 'website'`, sin meta `article:*`, slot `head` vacío); se revisa manualmente `index.astro`, `contacto.astro`, `skills/[slug].astro` y `404.astro` tras el cambio para confirmar que su `<head>` no varía.
- [Riesgo] El JSON-LD `BreadcrumbList` puede desincronizarse del breadcrumb visible si se editan por separado → Mitigación: ambos se construyen a partir de la misma lista de niveles (Inicio, Blog, categoría) definida una sola vez en el frontmatter del componente.

## Migration Plan

Sin migración de datos: los campos nuevos del schema (`ctaLabel`, `ctaText`, `ctaHref`) son opcionales y los posts existentes siguen siendo válidos sin definirlos. El despliegue es el build/deploy estático habitual (`npm run build`); revertir es un `git revert` del commit del cambio, sin estado externo que limpiar.
