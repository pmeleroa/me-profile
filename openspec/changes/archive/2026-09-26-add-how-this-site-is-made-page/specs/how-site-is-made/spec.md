## Purpose

Define el contrato de la página `/como-se-hace`: explica al visitante cómo se genera el contenido de este sitio con IA, siempre consensuado con el autor, y da contenido a la declaración del footer.

## ADDED Requirements

### Requirement: Ruta y alcance de la página
El sistema SHALL servir en `/como-se-hace` una página estática titulada "Cómo se hace este sitio", con la cabecera y el footer globales del sitio. La página MUST limitarse a describir cómo se produce el contenido de este sitio. MUST NOT describir cómo trabaja el autor fuera de él ni presentarse como una recomendación general.

#### Scenario: Acceso a la página
- **WHEN** un visitante navega a `/como-se-hace`
- **THEN** el sistema devuelve la página "Cómo se hace este sitio" con la cabecera y el footer globales

#### Scenario: La página no está en la navegación de la cabecera
- **WHEN** un visitante carga cualquier página pública
- **THEN** la navegación de la cabecera no contiene un enlace a `/como-se-hace`

### Requirement: Flujo de generación del contenido
La página SHALL describir el flujo con el que se genera el contenido del sitio en cuatro fases, en este orden: debate, acuerdo, construcción y publicación. Para cada fase MUST indicar qué hace la IA y qué decide el autor. La página MUST dejar explícito que:
- el contenido se consensúa con el autor mediante un debate con la IA antes de construirse;
- ningún contenido se publica sin el consentimiento explícito del autor;
- la integración final en la rama principal la hace siempre el autor.

#### Scenario: Fases y reparto de decisiones
- **WHEN** un visitante lee la página
- **THEN** encuentra las cuatro fases (debate, acuerdo, construcción y publicación) en ese orden, y en cada una lo que hace la IA y lo que decide el autor

#### Scenario: Consentimiento de publicación
- **WHEN** un visitante lee la fase de publicación
- **THEN** la página indica que la IA pide al autor su consentimiento para publicar, que la respuesta queda registrada y que el autor hace la integración final

### Requirement: Esquema de arquitectura de la solución
La página SHALL incluir, antes de la descripción del flujo por fases, un esquema de arquitectura de la solución. El esquema MUST mostrar al autor, los agentes de IA (Claude Code y Codex), el repositorio público de GitHub con `openspec/` y `src/`, GitHub Actions, GitHub Pages y el visitante, y las relaciones entre ellos:
- debate y decisiones entre el autor y los agentes;
- los agentes generan artefactos, código y texto en el repositorio;
- el autor revisa, aprueba e integra;
- la integración en la rama principal lanza el build y el despliegue;
- el visitante recibe el HTML estático.

El esquema MUST tener un nombre accesible y una descripción en texto de sus componentes y relaciones (por ejemplo, `<title>` y `<desc>` del SVG) presentes en el HTML servido, y MUST leerse a 360px de ancho sin scroll horizontal.

#### Scenario: Componentes del esquema
- **WHEN** un visitante carga `/como-se-hace`
- **THEN** antes de la sección del flujo ve un esquema con el autor, Claude Code y Codex, el repositorio de GitHub (`openspec/` y `src/`), GitHub Actions, GitHub Pages y el visitante, unidos por flechas que indican sus relaciones

#### Scenario: Alternativa en texto
- **WHEN** se inspecciona el HTML generado de `/como-se-hace`
- **THEN** el esquema expone un nombre accesible y una descripción que menciona al autor, Claude Code, Codex, `openspec/`, `src/`, GitHub Actions, GitHub Pages, el visitante y OpenSpec, sin depender de JavaScript

#### Scenario: Esquema en móvil
- **WHEN** un visitante carga `/como-se-hace` con un ancho de 360px
- **THEN** el esquema se muestra en una disposición vertical legible y la página no tiene scroll horizontal

### Requirement: Caso de uso: cómo nace un artículo del blog
La página SHALL incluir, después de la descripción del flujo por fases, una infografía que muestre cómo se genera un artículo del blog con OpenSpec en cuatro etapas, en este orden: idea y debate (skill `blog-post`), propuesta (`/opsx:propose`), redacción y verificación (`/opsx:apply`) y publicación (`/opsx:archive`). Para cada etapa MUST indicar la herramienta o el comando, qué hace la IA, qué decide el autor y qué resultado produce. La infografía MUST incluir también las reglas que se aplican a todos los artículos:
- ningún dato sin una fuente comprobable;
- la tesis se reta antes de escribirse;
- sin consentimiento explícito del autor no se publica.

Su texto MUST estar en el HTML servido y MUST NOT incluir cifras que no estén respaldadas por el repositorio.

#### Scenario: Etapas del artículo
- **WHEN** un visitante lee la sección del caso de uso
- **THEN** encuentra las cuatro etapas en orden, cada una con su comando, lo que hace la IA, lo que decide el autor y lo que produce

#### Scenario: Reglas editoriales
- **WHEN** un visitante lee la sección del caso de uso
- **THEN** encuentra las tres reglas que se aplican a todos los artículos

#### Scenario: Infografía en móvil
- **WHEN** un visitante carga `/como-se-hace` con un ancho de 360px
- **THEN** las etapas se muestran en vertical, legibles, y la página no tiene scroll horizontal

### Requirement: Afirmaciones verificables
La página MUST NOT usar "certificado", "certificación" ni "garantizado", ni ninguna formulación que sugiera un proceso formal de certificación o la validación de un tercero. MUST NOT incluir métricas de productividad ni cifras que no estén respaldadas por el repositorio. MUST dejar claro que la revisión la hace el autor y no un tercero. Cuando nombre herramientas de IA, MUST nombrar la herramienta (Claude Code, Codex) y MUST NOT nombrar modelos concretos ni sus versiones.

#### Scenario: Ausencia de afirmaciones no demostrables
- **WHEN** se inspecciona el HTML generado de `/como-se-hace`
- **THEN** no contiene las palabras "certificado", "certificación" ni "garantizado"

#### Scenario: Sin nombres de modelos
- **WHEN** se inspecciona el HTML generado de `/como-se-hace`
- **THEN** no contiene nombres de modelos de IA concretos, como "Opus", "Sonnet", "Haiku" o "GPT-", ni números de versión de modelo

### Requirement: Contenido esencial sin JavaScript
El contenido completo de la página SHALL estar presente en el HTML servido, sin depender de JavaScript en el cliente.

#### Scenario: Página con JavaScript desactivado
- **WHEN** un visitante carga `/como-se-hace` con JavaScript desactivado
- **THEN** ve la introducción, el esquema de arquitectura, las cuatro fases y la infografía del caso de uso de un artículo
