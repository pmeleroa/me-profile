## Context

`src/pages/blog/[slug].astro` ya calcula `pageUrl` (URL canónica absoluta), `post.data.title` y `post.data.description` para el JSON-LD y las meta Open Graph/Twitter en `Layout.astro`. El sitio es Astro estático sin backend, sin frameworks de UI (React/Vue) y sin más JavaScript cliente que scripts `<script>` inline puntuales (ver `Header.astro` para el toggle del menú móvil, que sigue el mismo patrón: markup siempre presente, botón inerte si JS no carga). La única analítica existente es Google Analytics vía `gtag`, cargado con Partytown y activo solo en producción (`Layout.astro`).

Ver proposal.md - Why / What Changes para la motivación y el alcance.

## Goals / Non-Goals

**Goals:**
- Un único componente reutilizable que renderice el botón de compartir, instanciado dos veces en `[slug].astro` (cabecera y CTA final).
- Cero dependencias nuevas: solo Web Share API, Clipboard API y el `gtag` ya cargado.
- Comportamiento accesible por teclado y con lector de pantalla equivalente al resto de elementos interactivos del artículo.

**Non-Goals:**
- No se implementan botones específicos por red social (LinkedIn, X, etc.) — decisión ya tomada en la exploración previa a favor de Web Share API + fallback.
- No se añade el botón a `BlogCard.astro` ni al listado `/blog`.
- No se persiste ni se expone un contador de veces compartido (solo el evento agregado en GA).

## Decisions

**1. Web Share API con fallback a portapapeles, sin librería.**
`navigator.share({ title, text, url })` cuando `typeof navigator.share === 'function'`; si no, `navigator.clipboard.writeText(url)`. Alternativa descartada: widget de terceros (AddThis/ShareThis) o SDKs de redes concretas — añadirían JS externo y tracking de terceros, en contra de mantener el stack actual (única analítica: GA propio) y sin justificación de negocio para asumir ese coste.

**2. Componente único `src/components/ShareButton.astro`, instanciado dos veces.**
Recibe `url`, `title`, `text` (descripción del post) y una prop de variante (`"meta"` | `"cta"`) que solo cambia la clase CSS aplicada, para reutilizar el mismo marcado y el mismo script en cabecera y en la CTA final sin duplicar lógica. Alternativa descartada: dos bloques de markup/script independientes en `[slug].astro` — más código duplicado sin beneficio, dado que el comportamiento es idéntico en ambos puntos.

**3. Progresive enhancement igual que el resto del sitio: el botón siempre está en el markup, no hay `<noscript>`.**
Coherente con el patrón ya existente del toggle de menú en `Header.astro`: si JS no carga, el botón es inerte. No se justifica un fallback sin JS (como un `mailto:` o un enlace `tel:`) porque el propio sitio ya depende de JS para otras interacciones equivalentes y el share es una mejora progresiva, no contenido esencial (Q01 aplica a contenido, no a estas interacciones).

**4. Feedback de "copiado" con texto, no con icono ni animación dependiente de movimiento.**
El texto del botón cambia temporalmente (p. ej. "Copiado ✓") durante ~2 s y ese cambio se envuelve en una región `aria-live="polite"` para que se anuncie a lectores de pantalla. Sin transición/animación cuando `prefers-reduced-motion: reduce` está activo (Q04). Alternativa descartada: un *toast* flotante — más complejidad de posicionamiento/z-index para un beneficio marginal frente a cambiar el propio texto del botón.

**5. Evento `dataLayer.push(['event', 'share', { content_type: 'blog_post', item_id: post.id }])` disparado tras completar el share o el copiado.**
Usa el `item_id` (slug del post), no la URL completa ni el título, para evitar cualquier dato identificable más allá del propio contenido público (Q08). `astro.config.mjs` configura Partytown con `forward: ['dataLayer.push']` — no reenvía `gtag` en sí — así que `window.gtag` nunca existe en el hilo principal en este proyecto; se usa `dataLayer.push` directamente, que es exactamente lo que `gtag()` hace internamente (azúcar sintáctico sobre el mismo array) y es el canal que sí está reenviado. Se dispara solo cuando `window.dataLayer` es un array (mismo guard implícito que ya aplica el resto del sitio al cargar GA solo en producción vía Partytown); en desarrollo o si Partytown no ha inicializado el reenvío todavía, la llamada se omite sin error.

## Risks / Trade-offs

- [El navegador no soporta `navigator.share` ni `navigator.clipboard` (contextos no seguros / navegadores muy antiguos)] → El botón queda inerte al pulsarlo; mismo riesgo ya aceptado hoy por el toggle de menú de `Header.astro`. No se añade detección adicional ni mensaje de error porque el propio corpus del sitio no lo hace para casos equivalentes.
- [`navigator.clipboard.writeText` requiere contexto seguro (HTTPS)] → El sitio ya se sirve por HTTPS en producción; sin impacto práctico.
- [Doble instancia del botón podría generar dos anuncios `aria-live` simultáneos si un visitante interactúa con ambos casi a la vez] → Cada instancia tiene su propia región `aria-live` con id único (ligada al slug + variante), por lo que los anuncios no se pisan entre sí.
- [El evento `gtag('event', 'share', ...)` se pierde si el visitante navega fuera antes de que Partytown haya procesado la llamada] → Riesgo aceptado: es analítica agregada, no un flujo crítico; ya existe el mismo margen de pérdida para el resto de eventos de `gtag`.

## Migration Plan

No aplica migración de datos ni de esquema. Despliegue como cualquier otro cambio de UI: build + revisión visual (ver checklist Q01-Q09 de `operations.apply.guidance`). Rollback mediante `git revert` del commit correspondiente, sin pasos adicionales porque no se toca contenido publicado ni configuración de terceros.
