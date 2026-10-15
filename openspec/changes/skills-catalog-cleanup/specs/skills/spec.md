# Spec Delta

## Purpose

Catálogo público de skills del autor y sus fichas de detalle (`/skills/<slug>/`): qué skills existen, cómo se accede a cada uno y cómo se mantienen estables sus URLs cuando el catálogo evoluciona.

## ADDED Requirements

### Requirement: Ficha pública por skill del catálogo
El sistema SHALL generar una página de detalle en `/skills/<slug>/` para cada skill del catálogo, donde `<slug>` se deriva del nombre del skill en minúsculas, sin acentos, con `&` sustituido por `and` y cualquier otro carácter no alfanumérico sustituido por guiones.

#### Scenario: Skill nuevo en el catálogo
- **WHEN** se añade al catálogo un skill llamado "Kafka Connect"
- **THEN** existe la página `/skills/kafka-connect/` con el nombre, la categoría, el nivel y la descripción de ese skill

#### Scenario: Skill renombrado
- **WHEN** el skill "Python / ML" pasa a llamarse "Python"
- **THEN** existe la página `/skills/python/` y deja de existir una ficha propia en `/skills/python-ml/`

### Requirement: Nivel del skill solo cuando el autor lo ha declarado
El sistema SHALL mostrar la etiqueta de nivel (Básico, Intermedio, Avanzado, Experto o Maestro) de un skill, tanto en el catálogo como en su ficha, solo cuando el autor haya declarado ese nivel. Si un skill no tiene nivel declarado, el sistema SHALL omitir la etiqueta de nivel sin sustituirla por un valor por defecto ni inventado.

#### Scenario: Skill con nivel declarado
- **WHEN** se muestra un skill con nivel 4
- **THEN** su tarjeta en el catálogo y su ficha muestran la etiqueta "Experto"

#### Scenario: Skill sin nivel declarado
- **WHEN** se muestra un skill añadido sin nivel declarado, como "OpenTelemetry"
- **THEN** su tarjeta en el catálogo y su ficha no muestran ninguna etiqueta de nivel, y el resto del contenido (nombre, categoría, tagline, icono) se muestra igual que en un skill con nivel

### Requirement: Redirección de URLs de skills renombrados o retirados
El sistema SHALL mantener accesible la URL de cualquier ficha de skill publicada previamente cuyo slug deje de existir por renombrado o retirada, redirigiendo del lado del cliente a una ficha existente mediante una página marcada como no indexable y con `rel=canonical` a la URL de destino. Un skill renombrado SHALL redirigir a su nueva ficha; un skill retirado SHALL redirigir a la ficha del skill designado como sustituto.

#### Scenario: Enlace antiguo a un skill renombrado
- **WHEN** se solicita `/skills/jira-tooling/`
- **THEN** el sistema sirve una página que redirige automáticamente a `/skills/atlassian-tooling/`, marcada `noindex` y con `canonical` apuntando a esa URL

#### Scenario: Enlace antiguo a un skill retirado
- **WHEN** se solicita `/skills/ml-e-ia-en-google-cloud/`
- **THEN** el sistema sirve una página que redirige automáticamente a la ficha del skill sustituto, marcada `noindex` y con `canonical` apuntando a esa URL

#### Scenario: Destino de redirección válido
- **WHEN** se genera el sitio
- **THEN** cada redirección de un slug de skill apunta a una ficha de skill que existe en el catálogo

### Requirement: Integridad de los enlaces entre fichas de skills
El sistema SHALL mostrar en cada ficha únicamente enlaces a skills relacionados que existan en el catálogo, y SHALL omitir cualquier referencia a un skill inexistente en lugar de generar un enlace roto.

#### Scenario: Relación con un skill renombrado
- **WHEN** la ficha de "ITSM / ITIL" declara como relacionado el skill renombrado a "Atlassian Tooling"
- **THEN** la ficha enlaza a `/skills/atlassian-tooling/` y no a `/skills/jira-tooling/`

#### Scenario: Ninguna ficha enlaza a un slug inexistente
- **WHEN** se genera el sitio
- **THEN** ningún enlace de "Skills relacionados" de ninguna ficha apunta a un slug que no esté en el catálogo
