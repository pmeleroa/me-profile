# Proposal

## Why

Hasta la parte 3, el harness de la serie «Asistente de código local» solo lee: `Read` y `Glob`, con un límite de workspace fijo. El post 2 prometió que «los permisos de verdad, con confirmaciones y reglas, llegan cuando el harness permita escribir y ejecutar». La parte 4 cumple la mitad de esa promesa. Le da al harness lo básico para cambiar código y un sistema de permisos que lo controla, con una tesis de seguridad acotada: **los permisos deciden dónde puede escribir el agente, no qué escribe.** No parte de un fallo vivido, sino de capacidades básicas que el harness necesita.

## What Changes

- Se publica la parte 4 de la serie, de tipo Guía, con el título «Los permisos deciden dónde, no qué: dejar que el agente escriba».
- **Tesis.** `deny`, el perímetro del workspace, fallar cerrado y read-before-edit limitan dónde escribe el agente sin depender de que el usuario lea lo que aprueba. Lo que escribe se revisa tras el run con `git diff`.
- **Contraargumento.** Un fichero del repositorio con instrucciones maliciosas puede llevar al modelo a escribir algo dañino dentro del workspace, y ninguna pieza lo para. Por eso la tesis se acota a «dónde».
- **Frontera con la parte 5, «Ejecución y seguridad».** Aquí entra la seguridad del sistema de ficheros: workspace, secretos, modos y que `deny` gana. Las reglas de Bash, el parser de comandos y el sandbox quedan para la parte 5.
- **Código fuera de este repositorio, en `pmeleroa/lab-harness-local`:** tag `parte-4` con `Grep`, `Write`, `Edit`, read-before-edit, el motor de permisos, los modos `default`, `acceptEdits` y `bypass`, y el approver de línea. También dos demos sobre `examples/demo` con sus salidas en `examples/salidas/`. Todo se deriva de `harness` tal como está hoy.
- **Sin cambios en `harness`.** El lab no se adelanta a `harness`: el approver muestra herramienta y ruta, sin diff, igual que `harness`. La única diferencia es que el lab conserva la resolución de `realpath` de la parte 2, que no se elimina.
- **Serie:** `src/content/series/asistente-codigo-local.yaml` cambia el título y el resumen de la parte 4.
- **Configuración:** la entrada de la serie en `openspec/config.yaml` registra el post 4 y el tag `parte-4`, y el arreglo del `realpath` en el motor de políticas de `harness` como trabajo posterior al cierre de este change.
- **Fuera de alcance:**
  - Bash, reglas de comandos y sandbox, que van a la parte 5.
  - El modo `plan`.
  - Mostrar el diff en el prompt de aprobación.
  - Subagentes y `narrowMode`.
  - El arreglo de `realpath` en `harness`.
  - Editar los posts 2 y 3.

Contrato de publicación: no cambia. `status`, `approvedBy` y `approvedAt` no se usan en este repositorio, y `draft` sigue siendo el único control. `draft: false` en el commit final solo con confirmación del owner registrada en `tasks.md`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

(ninguna: `skip_specs: true`, porque el post usa capacidades existentes de la colección `blog` y no toca `/lab/`)

## Impact

- **Contenido:**
  - `src/content/blog/<slug>.mdx`, nuevo.
  - `src/content/series/asistente-codigo-local.yaml`.
  - `public/images/blog/<slug>.webp`, si el autor aporta imagen.
- **Configuración de OpenSpec:** `openspec/config.yaml` (`rules.design`).
- **Repositorios externos:**
  - `pmeleroa/lab-harness-local`, público: nuevo tag `parte-4`. Los tags `parte-2` y `parte-3` no cambian.
  - `harness`: no se modifica en este change.
- **Comportamiento del lab:** una lectura fuera del workspace deja de rechazarse siempre. Pasa a preguntarse, siempre tras `realpath`, y sin terminal se deniega. Quien siga los comandos del post 2 o 3 sobre sus tags no ve cambios.
- **Tamaño:** el post tiene que quedar cerca de la parte 3 (~33 KB). Si no cabe, se acorta en lugar de dividirlo.
- Sin cambios de código ni dependencias npm en este repositorio.
- **SEO:** página nueva con `isPartOf` de la serie. Las partes 1 a 3 ganan una entrada en el bloque de navegación.
