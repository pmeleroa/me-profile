## Why

Los lectores del blog no tienen ninguna forma de compartir un artículo salvo copiar la URL manualmente desde la barra del navegador. Dado que el posicionamiento del sitio depende de la difusión orgánica del contenido entre responsables de arquitectura e ingeniería, reducir esa fricción aumenta la probabilidad de que un artículo se comparta tras leerlo.

## What Changes

- Se añade un botón "Compartir" en dos puntos de la página de artículo (`/blog/[slug]`): en la cabecera, junto a categoría/fecha/tiempo de lectura, y al final, junto a la CTA existente.
- El botón usa la Web Share API (`navigator.share`) cuando el navegador la soporta, pasando título, descripción y URL canónica del post; delega en el selector nativo del sistema operativo (apps instaladas, WhatsApp, Telegram, redes sociales, etc.).
- Cuando `navigator.share` no está disponible, el botón cae a copiar la URL del artículo al portapapeles (`navigator.clipboard.writeText`) y muestra una confirmación textual temporal ("Copiado ✓"), anunciada a tecnología de asistencia mediante `aria-live="polite"` y sin animación cuando el visitante tiene activado `prefers-reduced-motion`.
- Al completarse cualquiera de los dos mecanismos se registra un evento de analítica (`share`) vía `gtag` (ya cargado por Partytown), con `content_type: 'blog_post'` e `item_id` (el slug del post) — sin URL completa ni ningún dato del visitante.
- No se añade ningún SDK ni script de terceros (nada de widgets tipo AddThis/ShareThis ni SDKs de redes concretas); se reutiliza el patrón de `<script>` inline ya usado en `Header.astro`.
- Alcance limitado a la página de artículo individual; no se añade a `BlogCard.astro` ni al listado `/blog`.

## Capabilities

### New Capabilities
(ninguna)

### Modified Capabilities
- `blog`: se añade un nuevo requisito de "compartir artículo" y se modifican los requisitos existentes "Orden de la estructura de la página de artículo" (para incluir el punto de compartir en la cabecera y en la CTA final) y "Accesibilidad de foco en los elementos interactivos del artículo" (para incluir el botón de compartir entre los elementos con estados `:hover`/`:focus-visible` verificados).

## Impact

- Código: `src/pages/blog/[slug].astro` (dos instancias del botón, script inline de compartir/copiar, evento `gtag`); probablemente un componente nuevo reutilizable (p. ej. `src/components/ShareButton.astro`) para no duplicar el marcado y el script entre cabecera y CTA.
- Sin dependencias npm nuevas.
- Sin cambios en `src/content.config.ts` ni en el contrato de publicación (`draft`) de la colección `blog`; reutiliza `pageUrl`, `post.data.title` y `post.data.description` que `[slug].astro` ya calcula para el JSON-LD y las meta Open Graph/Twitter.
- Analítica: nuevo evento GA `share`, activo solo en producción igual que el resto de Google Analytics en `Layout.astro`.
