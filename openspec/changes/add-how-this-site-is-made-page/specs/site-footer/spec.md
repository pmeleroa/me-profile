## MODIFIED Requirements

### Requirement: Declaración de autoría y uso de IA en el footer
El footer de todas las páginas públicas SHALL mostrar, en el siguiente
orden, el aviso de copyright con el año en curso y el nombre del autor
enlazado a la portada, la frase "Construido con Astro" con un enlace a
`https://astro.build`, y la frase "Contenido creado con IA, revisado y
validado por mí.". El fragmento "revisado y validado por mí" SHALL
enlazar a `/como-se-hace` en la misma pestaña. El texto resultante MUST ser:
`© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`

#### Scenario: Texto del footer en una página pública
- **WHEN** un visitante abre cualquier página pública que incluye el footer (portada, 404, contacto, secciones, listado del blog, artículo del blog, página de skill o `/como-se-hace`)
- **THEN** el footer muestra exactamente `© <año> Pablo Melero Alonso. Construido con Astro. Contenido creado con IA, revisado y validado por mí.`, con `<año>` igual al año de la build

#### Scenario: Enlaces del texto del footer
- **WHEN** un visitante inspecciona el texto del footer
- **THEN** "Pablo Melero Alonso" enlaza a la portada del sitio, "Astro" enlaza a `https://astro.build` y se abre en una pestaña nueva con `rel="noopener"`, y "revisado y validado por mí" enlaza a `/como-se-hace` y se abre en la misma pestaña

#### Scenario: Contenido esencial sin JavaScript
- **WHEN** un visitante carga una página con JavaScript desactivado
- **THEN** el texto completo del footer, incluido el enlace a `/como-se-hace`, está presente en el HTML servido
