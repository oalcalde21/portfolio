# Etapa 7A — CI reproducible y propuesta de protección de main

Baseline inspeccionado: `8fd810482dcb63312416cbf9a73835a7f94b164f`, main local/remota limpias y sincronizadas. Fecha: 18/10/2026, America/Montevideo. Rama: `chore/portfolio-ci-qa`.

## Alcance y decisiones

Se agrega `.github/workflows/qa.yml` y este documento. No se modifican aplicación, dependencias, lockfile, secretos, permisos remotos, reglas de rama o configuración Vercel. No hay merge ni despliegue manual en esta etapa.

El diagnóstico operativo local de 6C confirmó main sin protección/rulesets, Actions habilitado sin workflows, token por defecto read y sin permiso para aprobar reviews, repositorio público y propietario con admin. La API no expone el plan personal de facturación; esto no bloquea los rulesets de ramas: están disponibles para repositorios públicos incluso en GitHub Free. La cuenta con admin puede configurarlos; no se ejecuta ninguna mutación de configuración en 7A.

Vercel se inspeccionó con plan Hobby: integración Git y previews disponibles, protección de forks y Vercel Authentication activas, sin Deployment Checks configurados. Esta etapa verifica el preview del PR; no incorpora un gate de promoción Vercel ni promete que Vercel espere a Actions. Hasta activar protección, siguen siendo posibles pushes directos a main.

## Checks y ejecución

Workflow **Portfolio CI**, evento `pull_request` dirigido a main, incluidos Draft. Sin filtros de archivos, schedules, dispatch, push, pull_request_target o workflow_run. El checkout por defecto prueba el merge ref del PR; no un head arbitrario de un evento privilegiado.

| Job/check exacto | Contenido | Uso propuesto |
| --- | --- | --- |
| **QA** | Runtime exacto, instalación limpia sin scripts, lint, build productivo, npm audit --omit=dev, comprobación de archivos tracked sin cambios | Único check requerido por el ruleset propuesto |
| **Security audit (full diagnostic)** | Instalación limpia y npm audit --json; JSON completo en log, resumen con conteos y estado | Diagnóstico visible, NO requerido mientras existe la deuda documentada; termina realmente en FAIL cuando npm devuelve fallo |

El run completo puede quedar rojo aunque QA esté verde. No hay continue-on-error, `|| true` ni sustitución del código de salida del audit. El paso diagnóstico captura temporalmente el exit para imprimir el JSON/resumen y luego devuelve ese mismo exit. Errores de red/registro tampoco se transforman en PASS; si no hay conteos válidos, se informa la ausencia. Los siete afectados altos de braces siguen siendo deuda, no una excepción permanente ni una corrección.

No se automatiza `qa:motion`: necesita su procedimiento interactivo. Tampoco se convierte `qa:selectors` en un gate ficticio sin su referencia externa. React Doctor mantiene su baseline previo de un error y 16 advertencias; no se mezcla con esta tarea.

### Runtime y reproducibilidad

- Node **24.19.0**, npm **11.17.0**, ambos comprobados con igualdad exacta en cada job.
- npm se fija dentro del runner efímero con `npm install --global npm@11.17.0 --ignore-scripts`; no se actualiza el entorno global del desarrollador.
- Dependencias únicamente con `npm ci --ignore-scripts`. `NPM_CONFIG_IGNORE_SCRIPTS=true` refuerza el bloqueo de lifecycle. Los `npm run lint/build` explícitos sí se ejecutan; no existen pre/post scripts adicionales en el baseline.
- Runner `ubuntu-24.04`, sin alias ubuntu-latest. La imagen hospedada y los servicios externos reciben actualizaciones: no se presenta como una imagen inmutable o ejecución hermética. El lockfile y las acciones sí están fijados; audit depende del estado vigente del registro.
- Sin caché de paquetes ni `.next`, sin upload-artifact, sin node_modules compartido. setup-node desactiva package-manager-cache explícitamente.
- Acciones oficiales verificadas mediante tags y commits de sus releases: checkout **v7.0.1**, SHA `3d3c42e5aac5ba805825da76410c181273ba90b1`; setup-node **v7.1.0**, SHA `949feb2413d6458794dcd2491c4babbbce0c15c1`. No se usan tags flotantes en `uses`.
- Tiempo máximo: QA 15 minutos, diagnóstico 10. Concurrencia por número de PR; una actualización cancela el run anterior, evitando aceptar evidencia obsoleta.

## Permisos y código no confiable

`permissions: contents: read` a nivel workflow; el resto de permisos no se solicita. No id-token, write, deployments o secrets. `persist-credentials: false` evita dejar el token de checkout en Git para los comandos de la aplicación. No se pasa GITHUB_TOKEN/NODE_AUTH_TOKEN/VERCEL_TOKEN a scripts ni se vincula un GitHub Environment con credenciales.

Los runners son hospedados/efímeros. Los PR de forks usan pull_request, cuyo token es read-only y cuyos secretos del repositorio no se suministran. El código del PR se ejecuta para lint/build: no se afirma que ignore-scripts impida toda ejecución ni que pueda probarse código arbitrario sin riesgo. No usar este workflow con runners propios privilegiados, pull_request_target o descarga de secretos.

La política remota vigente exige aprobación de first_time_contributors; no se cambió para ejecutar este PR del propietario. Endurecer esa política es una propuesta separada, no un requisito inventado para crear el workflow. Contribuciones que alteren el propio YAML deben revisarse antes de autorizar una ejecución; no se debe introducir una referencia a secretos en este flujo.

Permisos de operación: publicar archivos del workflow requiere acceso write al repositorio y, si se usa un PAT clásico, scope workflow además del acceso al repositorio. Se usa el transporte SSH ya configurado para push, sin leer/crear tokens. Configurar rulesets posteriormente requiere admin o permiso edit repository rules; está disponible al propietario. No se ampliaron scopes ni se cambió Actions.

## Validación y evidencia

La validación local usa las dependencias existentes: parser YAML js-yaml, revisión de estructura/invariantes y sintaxis Bash de los bloques shell. No se instala actionlint ni se pretende que un parser YAML valide toda la semántica de GitHub. La aceptación del workflow requiere el run real del PR y sus jobs/steps, no solo esta inspección.

Repetir localmente con Node 24.19.0/npm 11.17.0:

```text
npm ci --ignore-scripts
npm run lint
npm run build
npm audit --omit=dev
npm audit --json
git diff --check
```

Los resultados concretos y enlaces de runs se registran en el PR Draft y su entrega. El audit completo debe conservar FAIL y los conteos reales; la instalación puede advertir ESLint 9.39.5 EOL y unrs-resolver pendiente, sin aprobación. No se exige que toda la suite de checks sea verde: QA y Vercel deben pasar; el diagnóstico de seguridad debe mostrar el fallo conocido. Si aparece una regresión nueva en QA o un problema de permisos/ejecución, detener antes de proponer activación.

Validación local ejecutada para este PR: instalación limpia sin scripts (386 instalados/387 auditados), lint y build exitosos; auditoría productiva exit 0/cero afectados y completa exit 1/siete altos. El bloque Bash diagnóstico se ejecutó literalmente con el runtime estándar, generó el resumen FAIL con siete afectados y devolvió exit 1. Los nueve bloques run pasan bash -n; parseo YAML e invariantes de eventos/permisos/pins/gates correctos. La propuesta JSON se parseó sin enviarla. Manifest, lockfile, aplicación y tests conservados. No se aprobó unrs-resolver; persiste el warning de ESLint EOL.

## Propuesta exacta de protección — NO aplicada

Después de revisar e integrar el workflow y comprobar un run reciente del check, proponer un ruleset de **ramas** llamado `main-quality`, destino únicamente `refs/heads/main`. GitHub Actions identifica su app como **15368**, consultada mediante API; verificar además que el check QA del PR provenga de esa app antes de activar.

Payload propuesto para crear el ruleset (solo documentación; no se envía a GitHub):

```json
{
  "name": "main-quality",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": { "include": ["refs/heads/main"], "exclude": [] }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_approving_review_count": 0,
        "required_review_thread_resolution": true
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "required_status_checks": [
          { "context": "QA", "integration_id": 15368 }
        ],
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false
      }
    }
  ]
}
```

Resultado buscado: PR obligatorio, cero aprobaciones externas requeridas, conversaciones resueltas, QA del proveedor correcto exitoso sobre base actualizada, force push y borrado bloqueados también para el propietario sin bypass. No activar linear history, restrict updates, merge queue o firma obligatoria: introducirían requisitos ajenos o incompatibles con merge commits/flujo de una sola persona.

Conservar los ajustes remotos actuales: merge commit permitido, squash/rebase deshabilitados y auto-merge deshabilitado. No exigir **Security audit (full diagnostic)** mientras el riesgo siga explícitamente pendiente. Esto no elimina ese check ni vuelve verde el workflow. Cuando se remedie la deuda, revisar si audit completo pasa a ser requerido mediante una decisión nueva.

Antes de aplicar en otra tarea autorizada: verificar nombre/app del check final, historial reciente y permisos; integrar primero este PR mediante merge normal; activar después y probar con un PR pequeño sin depender de bypass. Nunca exigir un check que aún no existe en main o que está permanentemente pending por filtros. Con strict=true, actualizar la rama con merge normal de main si queda atrasada; sin rebase/force push.

Rollback de código: revert revisado del commit del workflow, conservando historial. Si posteriormente se activa la regla, coordinar su cambio mediante autorización antes de retirar/renombrar QA para no bloquear merges. No se deja un bypass permanente como alternativa.

## Fuentes oficiales y límites

- [Rulesets y disponibilidad por visibilidad/plan](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
- [Eventos pull_request, forks y secretos](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request).
- [API de reglas y checks requeridos](https://docs.github.com/en/rest/repos/rules).
- [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) y [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0).

No se declara nuevo QA nativo de movimiento, lector de pantalla, dispositivos físicos, visual responsive ni controles de promoción de Vercel. No hay cambios de interfaz/CSS. main sigue sin reglas hasta una autorización posterior; esta etapa entrega el PR y una propuesta verificable.

## Activación autorizada y prueba posterior — 18/10/2026

La sección anterior conserva el estado histórico de la propuesta. Tras autorización, PR #19 se integró mediante merge normal en `f7f2c70d6dac9ba7faf691705c94b1266895b91c`. Lint/build sobre main pasaron; auditorías: siete altos completos (FAIL, exit 1), cero productivos. Producción automática READY para ese SHA; dominio, PDFs, OG, robots y sitemap respondieron HTTP 200. La rama integrada se eliminó después de verificarlo.

Se creó [main-quality, ID 25367275](https://github.com/oalcalde21/portfolio/rules/25367275) con el payload aprobado. Lecturas posteriores del ruleset y reglas efectivas de main confirmaron:

- enforcement active; única referencia incluida refs/heads/main; sin exclusiones.
- PR obligatorio, cero aprobaciones, sin code owners/último push aprobado ni reviewers específicos; conversaciones resueltas.
- Único check requerido **QA**, proveedor GitHub Actions **15368**, con base actualizada obligatoria.
- Bloqueo de borrado y non-fast-forward; bypass_actors vacío; current_user_can_bypass=never. branches/main indica protected=true.
- Repositorio: merge commit habilitado; squash/rebase y auto-merge deshabilitados. El diagnóstico completo se conserva fallando y no es requerido.

La API agrega defaults que no se enviaron: allowed_merge_methods admite tres métodos en el ruleset, pero la configuración del repositorio restringe el resultado efectivo a merge. También devuelve require_extra_approval_for_unattributed_changes=true; la [documentación oficial](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#additional-approval-for-unattributed-copilot-pull-requests) aclara que no tiene efecto con cero aprobaciones. No se añadió un aprobador externo ni se modificó la propuesta para evitar un bloqueo.

Este cambio exclusivamente documental es la prueba de un PR nuevo posterior a la activación. Los resultados reales de QA, Vercel y mergeabilidad se registran en su descripción; no se integra automáticamente. Pasar a Ready for Review permite verificar el estado de merge sin ejecutar la mutación de merge.

### Recuperación sin bypass

1. Consultar el ruleset 25367275, rules/branches/main, el head/base del PR y el check QA con su app/steps. Conservar el JSON antes de cualquier cambio autorizado. El payload original permanece arriba; la evidencia local de activación y el procedimiento se prepararon antes del POST.
2. Si QA falla, corregir su causa en la rama del PR y publicar sin force push. Si quedó atrasada, incorporar main mediante merge normal y repetir QA. Si GitHub/runner/registro no está disponible, esperar o reintentar la ejecución revisada; no integrar sin QA.
3. No retirar/renombrar el workflow requerido. Si fuera imprescindible cambiar nombre/proveedor, acreditar primero un check equivalente y pedir autorización explícita para una edición administrativa que mantenga PR, bloqueos y QA. No crear bypass, desactivar reglas ni hacer push directo para conseguir un merge.
4. Revertir código mediante otro PR con QA. Si no puede acreditarse un reemplazo o no hay permisos administrativos, detener integraciones y pedir intervención del propietario; no improvisar excepciones permanentes.

No se probó rechazo mediante push directo, force push ni eliminación de main: se acredita la configuración efectiva, no un intento destructivo. El nuevo PR es la comprobación positiva del flujo del propietario único. La disponibilidad actual para repositorio público está verificada por creación/lectura exitosa, sin cambios de plan.
