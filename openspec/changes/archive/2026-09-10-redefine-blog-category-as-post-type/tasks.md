## 1. Esquema y taxonomía compartida

- [x] 1.1 Crear `src/data/blogCategories.ts` con `BLOG_CATEGORIES` (`Opinión`, `Análisis`, `Guía`, `Recursos`), el tipo derivado y `categoryColors` (Opinión `#F6AD55`, Análisis `var(--color-accent)`, Guía `var(--color-logo-green)`, Recursos `var(--color-logo-yellow)`); verificar con `npx astro check` que el fichero no introduce errores de tipos. Rollback: `git checkout -- src/data/blogCategories.ts` (fichero nuevo, no toca código en producción).
- [x] 1.2 Actualizar el enum `category` en `src/content.config.ts` a `z.enum(['Opinión', 'Análisis', 'Guía', 'Recursos'])`; verificar ejecutando `npm run build` y observando que falla señalando los 3 posts existentes por tener un `category` fuera del nuevo enum (evidencia de que la validación se aplica antes de migrar el contenido). Rollback: `git checkout -- src/content.config.ts` (toca schema ya en producción).

## 2. Migración de contenido existente

- [x] 2.1 Cambiar `category` a `"Opinión"` en `src/content/blog/ia-en-ingenieria-de-software.mdx`; `tags` sin cambios. Rollback: `git checkout -- src/content/blog/ia-en-ingenieria-de-software.mdx` (post ya publicado en producción).
- [x] 2.2 Cambiar `category` a `"Análisis"` en `src/content/blog/perdidos-en-el-medio.mdx`; `tags` sin cambios. Rollback: `git checkout -- src/content/blog/perdidos-en-el-medio.mdx` (post ya publicado en producción).
- [x] 2.3 Cambiar `category` a `"Opinión"` en `src/content/blog/sdd-vs-vibe-coding.mdx`; `tags` sin cambios. Rollback: `git checkout -- src/content/blog/sdd-vs-vibe-coding.mdx` (post ya publicado en producción).
- [x] 2.4 Verificar con `npm run build` que los 3 posts migrados compilan sin error de schema y observar el resultado del comando.

## 3. Consumo del módulo compartido en la UI

- [x] 3.1 En `src/components/BlogCard.astro`, importar tipo/color desde `src/data/blogCategories.ts` y eliminar el mapa `categoryColors` local; sustituir la construcción `${color}33` del borde por `color-mix(in srgb, ${color} 20%, transparent)` (ver design.md - Colores, ajuste encontrado durante la implementación) para que funcione tanto con literales hex como con `var()`; verificar con `npm run build` y revisando visualmente `/blog` en el servidor de desarrollo (`npm run dev`) que cada tarjeta muestra el badge con el color y el borde correctos para los 4 tipos. Rollback: `git checkout -- src/components/BlogCard.astro` (componente ya en producción).
- [x] 3.2 En `src/pages/blog/[slug].astro`, importar desde `src/data/blogCategories.ts` y eliminar su mapa `categoryColors` local duplicado; aplicar el mismo ajuste `color-mix` que en 3.1 al borde del badge de tipo; verificar visualmente en la página de un artículo que el badge de tipo y el breadcrumb muestran el color, el borde y la etiqueta correctos. Rollback: `git checkout -- src/pages/blog/[slug].astro` (página ya en producción).
- [x] 3.3 En `src/pages/blog/index.astro`, sustituir la lista local `categories` por `BLOG_CATEGORIES`; los 4 chips de tipo SHALL mostrarse siempre, incluidos los que tienen 0 posts (ver design.md - Chips de tipo siempre visibles); verificar en `/blog` que los 4 chips aparecen con su contador correcto (0 para los tipos sin posts) y que activar uno sin posts muestra el mensaje de "sin resultados". Rollback: `git checkout -- src/pages/blog/index.astro` (página ya en producción).
- [x] 3.4 En `src/pages/blog/index.astro`, actualizar el subtítulo de la cabecera de "Reflexiones sobre arquitectura, plataformas, DevOps e IA." a "Opinión, análisis y guías sobre arquitectura, plataformas, DevOps e IA." (el titular "Ideas en voz alta" no cambia, ver proposal.md - What Changes); verificar visualmente en `/blog`. Rollback: `git checkout -- src/pages/blog/index.astro` (página ya en producción).

## 4. Relacionados por tags compartidos

- [x] 4.1 En `src/pages/blog/[slug].astro`, sustituir el filtro `p.data.category === post.data.category` por: calcular tags compartidos con el post actual, descartar candidatos sin solapamiento, ordenar por (nº de tags compartidos desc, `publishDate` desc), y tomar los 3 primeros. Verificar manualmente visitando los 3 posts reales (todos comparten el tag `ia-generativa`) y comprobando que aparecen como relacionados entre sí. Rollback: `git checkout -- src/pages/blog/[slug].astro` (página ya en producción).
- [x] 4.2 Verificar con fixtures temporales no versionados (varios posts de prueba con tags controlados) los tres casos límite que los 3 posts reales no permiten ejercitar: (a) ningún tag en común -> la sección de relacionados no se renderiza; (b) dos candidatos con el mismo número de tags compartidos -> se ordena por `publishDate` más reciente primero; (c) más de 3 candidatos con solapamiento -> solo se muestran los 3 con mayor coincidencia. Eliminar los posts de prueba al terminar.

## 5. Verificación de requisitos y cierre

- [x] 5.1 Verificar el escenario "Categoría y tags activos a la vez" (`specs/blog/spec.md`): en `/blog`, activar el chip `Análisis` y el tag `ia-generativa`, y comprobar que el listado muestra solo `perdidos-en-el-medio`.
- [x] 5.2 Verificar el escenario de breadcrumb: en un artículo, hacer click en el nivel de categoría del breadcrumb y comprobar que navega a `/blog` con ese tipo ya activo como filtro.
- [x] 5.3 Ejecutar `npm run build` e inspeccionar `dist/blog/` para confirmar que los 3 posts se generan con su nuevo tipo y que ningún post en `draft: true` aparece en la salida (Q06 integridad de publicación, sin cambios de contrato pero verificado por tocar el listado).
- [x] 5.4 Ejecutar `openspec validate redefine-blog-category-as-post-type --strict` y registrar el resultado. Resultado: "Change 'redefine-blog-category-as-post-type' is valid".
