# Cierre operativo del portfolio — 19/10/2026

## Estado: BLOQUEADO por CI requerido pendiente

No se declara CERRADO OPERATIVAMENTE. Las correcciones están preparadas y validadas localmente, pero GitHub Actions no asignó runner a los nuevos jobs `QA` durante la ventana de comprobación. No se intentó bypass, push directo a main ni modificación del workflow/ruleset. Las condiciones de merge siguen vigentes.

Main verificada: `f7f2c70d6dac9ba7faf691705c94b1266895b91c` (igual local/remota). No hay merges nuevos de esta tarea. Fecha objetivo: 19/10/2026. Esta es documentación del cierre pendiente por un bloqueante, no una nueva etapa.

## Cambios preparados

| PR | Commit | Alcance | Estado de integración |
|---|---|---|---|
| [#21](https://github.com/oalcalde21/portfolio/pull/21) | 471dd8e610dae1d03425016cf7dedc7056bafbc1 | Modal SSR/portal, pruebas y documentación | Draft, no merge hasta QA exitoso |
| [#22](https://github.com/oalcalde21/portfolio/pull/22) | f154aef155a697f139c418e11c8183229a6e27e4 | Cuatro escapes JSON-LD, pruebas adversas/HTML y documentación | Draft, independiente, no merge hasta QA exitoso |

Ambos parten del mismo main y no se solapan. Integrar primero #21; después actualizar #22 mediante merge normal de main si el check estricto exige base actualizada, esperar sus checks otra vez y revisar diff de tres archivos. No rebase/force push. La documentación final debe pasar también QA antes de integrar. No eliminar ramas hasta verificar sus merges.

## Versiones conservadas

Node 24.19.0, npm 11.17.0, Next/eslint-config-next 16.4.2, React/React DOM 19.3.1, Tailwind 3.4.19, ESLint 9.39.5 y Framer Motion 11.18.2. Pages Router y Webpack explícito. No se modificaron manifest, lockfile, dependencias, configuración de despliegue ni contenido comercial.

## Validaciones ejecutadas

- Instalación limpia: `npm ci --ignore-scripts`, exit 0; 386 paquetes instalados. Scripts pendientes no aprobados. Se conserva warning ESLint 9.39.5 fuera de soporte.
- #21: `npm run qa` (lint/build) exit 0. `npm run qa:motion` ejecutado mediante su página y botón: **58/58**, los 47 anteriores más 11 pruebas del modal; `hydrationErrors=[]`, cero timers/listeners remanentes medidos. El servidor prueba SSR abierto/cerrado sin globals. Se comprueban destino ausente/tardío, apertura, nombre, foco inicial/restauración, Tab/Shift+Tab, evento cancel de Escape, backdrop, scroll y desmontaje.
- #22: `npm run qa` exit 0. `node tests/security/jsonld.cjs` pasa: cuatro expresiones reales, cuatro cargas adversas con `</script>`, Unicode y cierre mixto; round-trip conserva valores. Los cuatro schemas del HTML productivo conservan sus hashes de datos anteriores.
- CSS productivo: mismos hashes SHA-256 que el baseline, sin cambios de estilos.
- `git diff --check` correcto en ambas ramas.
- Build local #21: cuatro modales abiertos/cerrados en navegador, Escape restaura foco; consola sin errores/warnings observados. Preview #21: EN/ES, diálogo en español, Tab, Escape/foco y consola sin errores observados.
- Layout del build #22 en iframes reales de navegador: anchos exteriores 320/390/768/1440, disponibles 305/375/753/1425 por scrollbar; scrollWidth coincide con clientWidth en las ocho muestras EN/ES. Títulos y ambos roles traducidos presentes. Es un harness local del HTML/CSS/JS productivo, no dispositivos físicos. Su consola registró dos errores de MutationObserver durante inspección instrumental del iframe; no se reproducen en la página normal/preview. No se certifica consola limpia para ese harness ni se atribuye el origen sin stack.
- GitHub #21: [run 39280057439](https://github.com/oalcalde21/portfolio/actions/runs/39280057439). GitHub #22: [run 39280563202](https://github.com/oalcalde21/portfolio/actions/runs/39280563202). API devuelve `queued`, `runner_name:null` durante la comprobación. Actions está habilitado; no hay deployments de aprobación pendientes. No se detectó una causa concreta en logs (solo Starting job); no se atribuye a permisos, facturación ni incidente global sin evidencia.
- Vercel Preview #21 `dpl_9n3tDAacz8ViypcVe8GXc3W4JTzT`: READY para 471dd8e. Check Vercel #22 exitoso; no equivale a QA requerido.

Estos resultados corresponden a las ramas separadas; el QA combinado sobre main y la producción posterior a los merges están pendientes. No se presenta una suma/proyección de resultados como ejecución del estado integrado.

## React Doctor 0.9.18

Versión exacta ejecutada temporalmente mediante npm exec --ignore-scripts, con las opciones históricas no-telemetry/no-supply-chain/scope full/no-parallel. No hay dependencia/script doctor versionado propio y no se añadió en esta tarea.

| Árbol realmente escaneado | Errores | Warnings | Exit |
|---|---:|---:|---:|
| Baseline main | 1 | 16 | 1 |
| Rama #21 (solo modal) | 0 | 16 | 0 |
| Rama #22 (solo JSON-LD) | 1 previo del modal | 12 | 1 |

Después de integrar ambos se debe ejecutar de nuevo, sin asumir el conteo combinado. Las advertencias restantes son siete recomendaciones LazyMotion (una utilidad sin consumidores encontrados), dos sobre el mismo fondo decorativo DotGrid, una transition-all, una updater de Typewriter y una identidad del value de contexto. No se demostró bug de estado en Typewriter ni ahorro de bundle; no se hicieron refactors ni PR adicionales para quitar warnings. Semántica de DotGrid y acotar CSS quedan como mantenimiento opcional, sin afirmar conformidad nueva de lector de pantalla.

## Dependabot, braces y controles

Operación autorizada del 19/10/2026: deshabilitado SOLO el preset GitHub “Dismiss low-impact alerts for development-scoped dependencies” en portfolio. Pantalla confirma Rule saved / Disabled, preset de malware conserva Disabled. GitHub reabrió automáticamente #1 tras esa operación; PATCH posterior devolvió 409 Already open y GET confirmó `state:open`, `fixed_at:null`. No se cambiaron scopes ni autenticación ante la sugerencia genérica de gh. Motivo: mantener visible la deuda, evitando interpretar auto-dismiss como corrección.

La alerta se verifica por REST; el estado de la regla se verificó en UI autenticada. No se obtuvo una API pública soportada para releer el enforcement del preset: no declarar esa comprobación API realizada. Evidencia local: dependabot-preset-disabled.png. No se habilitaron security updates (API enabled:false), version updates, auto-merge ni workflows nuevos.

`npm audit --json`: **FAIL, exit 1, siete nombres altos, un advisory raíz GHSA-vfj7-8cjw-p6xm / braces**. `npm audit --omit=dev --json`: **PASS, exit 0, cero afectados**. Repetidos en esta tarea, sin cambios frente al baseline. Braces 3.0.3 sigue llegando por micromatch/fast-glob (Tailwind y plugin ESLint Next) y chokidar (Tailwind). Riesgo residual de recursión no acotada sobre patrones en desarrollo/build; no se identificó parche compatible en el diagnóstico. Conservar globs confiables, builds sin secretos de producción y límites existentes. Reabrir remediación cuando exista parche/upstream compatible o cambie la exposición. El riesgo no queda corregido ni aceptado permanentemente y el gate completo NO se vuelve verde.

`main-quality` 25367275 permanece activo y solo main: PR obligatorio, cero aprobaciones externas, check `QA` GitHub Actions app15368, base actualizada, prohibición de force push/eliminación, bypass vacío. Merge commit permitido; squash/rebase/auto-merge deshabilitados a nivel repositorio. Dependabot Alerts activo (GET204). No modificar controles para destrabar el merge.

## Producción verificada, sin cambios de esta tarea todavía

Vercel `dpl_9LKsev2a2YfuAfNiXhsiQsBhAheu`: Production READY, SHA f7f2c70d6dac9ba7faf691705c94b1266895b91c. Dominio https://oscaralcalde.vercel.app/ HTTP200. Verificación HTTP de 23 rutas/recursos: página, JS/CSS/fuentes referenciados, PDFs, OG, favicon, robots, sitemap correctos; ruta inexistente devuelve404. Canonical y cuatro schemas presentes. No se realizó despliegue manual.

## Limitaciones y condición pendiente de cierre

No se ejecutó nueva emulación nativa de reduce, lector de pantalla real, zoom nativo ni dispositivos físicos. Movimiento reducido y parte de los eventos se prueban mediante simulación explícita; no reemplaza QA nativo. La validación manual histórica de Oscar permanece histórica. Los warnings LF/CRLF de archivos nuevos se informaron; no hubo normalización masiva. La instalación sin scripts y unrs-resolver se conservan sin aprobación adicional.

Cuando GitHub asigne runners y `QA` pase realmente: verificar nuevamente HEAD/diff/checks, integrar con merge normal en orden, ejecutar QA/pruebas/Doctor/auditorías sobre main, comprobar READY del último SHA y dominio, completar este documento con evidencia integrada mediante PR, y limpiar ramas únicamente tras verificar merges. No hace falta nueva fase ni migraciones. Si aparece vulnerabilidad productiva nueva, fallo funcional, integridad del repositorio o publicación defectuosa, mantener BLOQUEADO. La deuda braces conocida por sí sola no bloquea el cierre.
