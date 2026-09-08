## Purpose

Define el contrato de comportamiento del espacio `/lab/<slug>`: cómo se
sirven las páginas de demo interactiva, qué navegación exponen, cómo se
migra una URL previa y cómo un post de `blog` declara la demo que le
corresponde.

## ADDED Requirements

### Requirement: Ruta de demo interactiva
El sistema SHALL servir cada demo interactiva publicada bajo la ruta
`/lab/<slug>`.

#### Scenario: Acceso a una demo publicada
- **WHEN** un visitante navega a `/lab/<slug>` de una demo existente
- **THEN** el sistema devuelve la página con el contenido interactivo de
  esa demo

### Requirement: Navegación mínima en las páginas de demo
Cada página de `/lab/<slug>` SHALL mostrar un único enlace de vuelta al
artículo de blog que la origina, y NO SHALL mostrar la navegación
principal del sitio (menú de secciones, enlaces a la home).

#### Scenario: Volver al artículo desde una demo
- **WHEN** un visitante hace clic en el enlace de vuelta de una página
  `/lab/<slug>`
- **THEN** el sistema le lleva al artículo de blog que origina esa demo

#### Scenario: Ausencia de navegación principal
- **WHEN** un visitante carga una página `/lab/<slug>`
- **THEN** la página no muestra los enlaces de navegación principal del
  sitio (menú de secciones de la home)

### Requirement: Redirección de la URL legacy de la primera demo
El sistema SHALL redirigir automáticamente la URL previa
`/gamification/test-memoria.html` a `/lab/test-memoria` mediante una
página de redirección del lado del cliente (meta-refresh), marcada como
no indexable y con un `rel=canonical` a la nueva URL — el hosting
estático de este sitio no permite emitir un código HTTP 301 real.

#### Scenario: Visitante o buscador con el enlace antiguo
- **WHEN** se solicita `/gamification/test-memoria.html`
- **THEN** el sistema sirve una página que redirige automáticamente a
  `/lab/test-memoria`, marcada `noindex` y con `canonical` apuntando a
  esa URL

### Requirement: Asociación estructurada entre un post y su demo
Un post de la colección `blog` SHALL poder declarar, de forma
estructurada en sus datos (no como un enlace suelto en el cuerpo), el
`slug` de la demo de `/lab/` que le corresponde.

#### Scenario: Post con demo declarada
- **WHEN** un post de blog declara el campo `demo` con un `slug` válido
- **THEN** el sistema puede construir un enlace a `/lab/<slug>` para esa
  demo sin depender de un enlace dentro del cuerpo del post

#### Scenario: Post sin demo asociada
- **WHEN** un post de blog no declara el campo `demo`
- **THEN** el sistema no requiere ni asume ninguna demo asociada a ese
  post
