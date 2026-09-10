## Context

Ver proposal.md - Why. `category` es un `z.enum` en `src/content.config.ts`, usado hoy en cuatro sitios: chips de filtro y su lista de valores (`blog/index.astro`), badge de color (`BlogCard.astro`), badge de color y breadcrumb (`[slug].astro`), y selección de relacionados por igualdad de `category` (`[slug].astro`). El mapa color/etiqueta por categoría está duplicado literalmente en `BlogCard.astro` y `[slug].astro`.

## Goals / Non-Goals

- Goal: un único punto de verdad para tipo→color→etiqueta, consumido por los tres ficheros que hoy lo duplican.
- Goal: la reclasificación de los 3 posts existentes no rompe el build (`astro check` / `npm run build`) ni deja ningún post con `category` inválido.
- Non-goal: no se introduce un campo `topic` nuevo ni se cambia la forma de `tags` (decidido en discovery: el tema vive solo en `tags`, sin campo adicional).
- Non-goal: no se cambia la disposición de los filtros en `/blog` (categoría sigue en chips primarios, tags en panel secundario) — solo cambia qué representa cada eje.

## Decisions

### Módulo compartido para tipo, color y etiqueta
Se crea `src/data/blogCategories.ts` exportando algo con esta forma:

```ts
export const BLOG_CATEGORIES = ['Opinión', 'Análisis', 'Guía', 'Recursos'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export const categoryColors: Record<BlogCategory, string> = {
  'Opinión':  '#F6AD55',
  'Análisis': 'var(--color-accent)',
  'Guía':     'var(--color-logo-green)',
  'Recursos': 'var(--color-logo-yellow)',
};
```

`BlogCard.astro`, `[slug].astro` y `blog/index.astro` importan de aquí en vez de mantener su copia local. Alternativa descartada: dejar los tres mapas duplicados como están hoy — ya es la causa de que el mapa de `[slug].astro` y el de `BlogCard.astro` tengan que revisarse a mano en paralelo cada vez que cambia la taxonomía; ya que este cambio reescribe los cuatro valores en los tres sitios, es el momento natural de unificarlo.

`category` en el schema de contenido (`src/content.config.ts`) sigue siendo un `z.enum([...])` con los 4 valores literales (zod no infiere bien un enum a partir de un array `as const` externo de forma directa en todas las versiones); `BLOG_CATEGORIES` es la fuente de verdad para la UI (chips, colores), y sus valores deben mantenerse manualmente en sync con el enum del schema. Alternativa descartada: derivar el enum del schema desde `BLOG_CATEGORIES` con `z.enum(BLOG_CATEGORIES)` — es viable y más DRY, pero acopla `content.config.ts` (evaluado por el loader de Astro) a un módulo de `src/data/`; se deja como posible mejora futura fuera del alcance de este cambio, no como decisión tomada aquí.

### Chips de tipo siempre visibles
`blog/index.astro` filtraba los chips de categoría a los que tenían al menos un post (`count > 0`), heredado del comportamiento de la taxonomía anterior. Con solo 4 tipos posibles y la intención de que el visitante pueda descubrir la taxonomía completa desde el primer momento (aunque `Guía` y `Recursos` no tengan contenido todavía), se elimina ese filtrado: los 4 chips de `BLOG_CATEGORIES` se muestran siempre, con su contador (que puede ser `0`). Activar un chip sin posts reutiliza el mensaje de "sin resultados" ya existente para combinaciones de filtros vacías, sin necesitar un estado nuevo.

### Relacionados por tags compartidos
Sustituye el filtro `p.data.category === post.data.category` por: calcular la intersección de `tags` con el post actual para cada candidato, descartar los que no comparten ninguno, ordenar por `(nº tags compartidos desc, publishDate desc)`, y tomar los 3 primeros. Si la lista resultante está vacía, no se renderiza la sección de relacionados (mismo patrón que otros bloques opcionales de la página, como el bloque de autor ausente).

### Colores
Se reutilizan variables de marca ya definidas en `global.css` (`--color-accent`, `--color-logo-green`, `--color-logo-yellow`) para 3 de los 4 tipos, evitando introducir hex sueltos nuevos como los que ya existían para valores de la taxonomía anterior (`#A78BFA`, no definido como variable). Opinión mantiene su naranja actual (`#F6AD55`), que tampoco está como variable en `global.css`; no se formaliza como variable CSS en este cambio por no ser parte del alcance decidido (colores de categoría), se deja tal cual estaba.

**Ajuste encontrado durante la implementación (tarea 3.1):** `BlogCard.astro` y `[slug].astro` construían el borde translúcido del badge concatenando una cadena de opacidad hex (`${color}33`), lo que solo es válido con literales hex. Con `var(--color-accent)` etc. para Análisis/Guía/Recursos, `${color}33` produce un valor de color inválido (comprobado visualmente: el borde no se renderiza). Ambos ficheros sustituyen esa concatenación por `color-mix(in srgb, ${color} 20%, transparent)`, que resuelve correctamente tanto con literales hex (Opinión) como con `var()` (Análisis, Guía, Recursos), sin cambiar el valor de ningún color en `blogCategories.ts`.

## Risks / Trade-offs

- [Riesgo] Contenido futuro podría copiar el patrón antiguo (usar `category` para temas) por costumbre → Mitigación: el nuevo requirement de specs ("Taxonomía de categoría como tipo de post") deja explícito que el tema vive solo en `tags`; el enum de 4 valores en el schema ya rechaza en build cualquier valor de tema colado en `category`.
- [Riesgo] Al no haber fallback de "más recientes" cuando no hay tags en común, un post con tags muy específicos y sin pares puede quedarse sin sección de relacionados → Aceptado explícitamente en discovery: se prefiere ocultar la sección antes que mostrar contenido no relacionado solo por rellenar el hueco.

## Migration Plan

1. Actualizar `src/content.config.ts`: `category` pasa a `z.enum(['Opinión', 'Análisis', 'Guía', 'Recursos'])`.
2. Crear `src/data/blogCategories.ts` con la taxonomía y los colores.
3. Actualizar `category` en los 3 `.mdx` existentes a su nuevo valor (ver proposal.md - What Changes). Sin cambios en `tags` ni en `draft`.
4. Actualizar `BlogCard.astro`, `[slug].astro` y `blog/index.astro` para consumir `src/data/blogCategories.ts` en vez de sus mapas/listas locales.
5. Cambiar la lógica de relacionados en `[slug].astro` de "mismo category" a "tags compartidos" según la Decisión anterior.
6. `npm run build` para verificar que el schema valida los 3 posts migrados y que las páginas de `/blog` y `/blog/[slug]` generan sin error.
7. Ajustes de UI decididos durante la implementación (ver Decisions): los chips de tipo pasan a mostrarse siempre, incluidos los tipos sin posts; se actualiza el subtítulo de la cabecera de `/blog` para reflejar el nuevo eje de tipo junto al de tema.

Rollback: revertir el commit (o los commits) de este cambio con `git revert`; no hay migración de datos externa ni estado persistente fuera del repositorio.

## Open Questions

Ninguna: todas las decisiones de alcance (dónde vive el tema, disposición de la UI, algoritmo de relacionados, colores, y clasificación de los 3 posts existentes) se cerraron en discovery antes de escribir este documento.
