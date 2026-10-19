# Portfolio — cierre operativo — 19/10/2026

## Resultado y trazabilidad

Correcciones funcionales integradas y verificadas, sin nuevos bloqueantes conocidos. El bloqueo anterior de asignación de runners quedó resuelto; QA de GitHub ejecutó realmente las revisiones aprobadas. No se usaron bypass, force push, auto-merge ni despliegues manuales.

- SHA funcional de main: **194d4668942febde04acddfe07d305bdbebd98c0**, con modal y JSON-LD.
- Cierre documental: [PR #23](https://github.com/oalcalde21/portfolio/pull/23), sin cambios de aplicación. El SHA final de main que incluye este mismo documento es su `merge_commit_sha`, verificable en [la API del PR #23](https://api.github.com/repos/oalcalde21/portfolio/pulls/23). Se identifica así para no insertar dentro de un commit su propio hash aún inexistente. El informe final de entrega registra ese SHA y el despliegue correspondiente después del merge.

| PR | Implementación original | Merge normal verificado |
|---|---|---|
| [#21 — Modal SSR](https://github.com/oalcalde21/portfolio/pull/21) | 471dd8e610dae1d03425016cf7dedc7056bafbc1 | 9c531ce9fb187204e1a0e50a8ffe727b22da6d69 |
| [#22 — JSON-LD](https://github.com/oalcalde21/portfolio/pull/22) | f154aef155a697f139c418e11c8183229a6e27e4 | 194d4668942febde04acddfe07d305bdbebd98c0 |
| [#23 — Cierre](https://github.com/oalcalde21/portfolio/pull/23) | Documento actualizado tras integrar #21/#22 | Metadatos canónicos del PR, arriba |

#22 incorporó main mediante merge normal (`1cc7641759db94fb00b8452eb9f64dd3d0fcd8a5`) antes de repetir checks y merge. #23 incorpora main también con merge normal. No se reescribió historial. Diff de #22: solo cuatro escapes, prueba JSON-LD y documento; #23: solo este documento.

## Versiones y alcance

Node 24.19.0 / npm 11.17.0; Next y eslint-config-next 16.4.2; React/React DOM 19.3.1; Tailwind 3.4.19; ESLint 9.39.5; Framer Motion 11.18.2. Pages Router y Webpack explícito conservados. No se modificaron dependencias, lockfile, configuración remota de seguridad en esta reanudación, textos, estilos ni funcionalidades.

El modal ahora tiene snapshot SSR nulo y resolución del portal después de hidratación. Recupera destino tardío mediante suscripción desconectable; animación/foco/scroll esperan al destino. Las cuatro serializaciones JSON-LD escapan `<`, conservando datos y SEO. No se implementaron LazyMotion, cambios de Typewriter, contexto, semántica de DotGrid ni otras mejoras opcionales.

## QA y evidencia ejecutada

| Validación | Resultado verificable |
|---|---|
| QA remoto #21 | SUCCESS, GitHub Actions app15368; [run 39280057439](https://github.com/oalcalde21/portfolio/actions/runs/39280057439) |
| QA remoto #22 actualizado con main | SUCCESS, [run 39298013721](https://github.com/oalcalde21/portfolio/actions/runs/39298013721); Vercel Preview READY para 1cc7641 |
| QA local combinado | `npm run qa`: lint y build exit0; `/` y `/404` prerenderizados |
| Pruebas controladas | `npm run qa:motion`, pulsando Run controlled tests: **58/58** (47 previas + 11 modal), exit0; hydrationErrors=[], pendingTimers=0, listeners=0 |
| SSR/modal | Cerrado y abierto inicialmente sin globals; hidratación, destino ausente/tardío, foco, Tab/Shift+Tab, cancel de Escape, backdrop, scroll y desmontaje correctos en fixture |
| JSON-LD | `node tests/security/jsonld.cjs`: 4 expresiones reales + 4 cargas adversas `</script>`/Unicode + 4 schemas HTML; round-trip y hashes de datos iguales al baseline |
| React Doctor combinado 0.9.18 | **0 errores / 12 advertencias, exit0**, frente a 1/16 inicial |
| Auditoría completa | **FAIL, exit1, siete afectados altos**, un advisory raíz de braces |
| Auditoría productiva | **PASS, exit0, cero afectados** |
| Diff y estilos | `git diff --check` correcto; manifest/lockfile sin cambios; hashes CSS conservados en la preparación |

Instalación limpia `npm ci --ignore-scripts` validada en preparación (386 paquetes) y en QA remoto. El procedimiento final repite instalación sin scripts y QA en main después del merge documental; no se permite aprobar scripts pendientes. El check QA de #23 debe pasar antes de integrar y su run queda enlazado en el propio PR. Las comprobaciones posteriores al merge documental se registran en la entrega final, sin asumir su ejecución de antemano.

Evidencias JSON/logs locales de esta reanudación: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-final-close-2026-10-19/`; preparación: `portfolio-final-2026-10-19/`. No contienen credenciales. Los enlaces GitHub anteriores y los tests versionados conservan la evidencia reproducible aunque esas carpetas locales no estén disponibles en otra máquina.

## Producción y comprobaciones de navegador

Producción funcional verificada en Vercel **READY**, `dpl_8KmXTmfJBWZJY8GJ9KvYWLi8T8bC`, SHA **194d4668942febde04acddfe07d305bdbebd98c0**. Dominio https://oscaralcalde.vercel.app/ HTTP200. Prueba HTTP: 23 rutas/recursos, sin resultados inesperados; página, fuentes/JS/CSS referenciados, PDFs, OG, favicon, robots y sitemap200; ruta inexistente404; canonical y cuatro schemas presentes.

En navegador de producción se verificaron EN/ES, pausa persistente al cambiar idioma, cuatro modales en español, Tab y Escape con restauración al disparador. Consola sin errores/warnings observados en la sesión normal. El despliegue documental posterior conserva el mismo árbol de aplicación y debe verificarse READY para su propio SHA antes de declarar el cierre en la entrega.

Responsive de la preparación: ocho muestras EN/ES en iframes reales de navegador con anchos exteriores 320/390/768/1440 (área disponible 305/375/753/1425 por scrollbar), scrollWidth=clientWidth, títulos y roles completos. Es un harness local del build, no dispositivos físicos. Su inspección instrumental produjo dos errores de MutationObserver no reproducidos en página normal/preview; no se declara consola limpia de ese harness ni se atribuye su origen sin stack.

## Seguridad y controles conservados

Dependabot Alerts activo. Alerta #1 **open**, fixed_at=null, GHSA-vfj7-8cjw-p6xm (braces3.0.3). El preset “Dismiss low-impact alerts for development-scoped dependencies” fue deshabilitado exclusivamente para portfolio en la sesión autorizada previa; GitHub reabrió automáticamente #1. Su enforcement se verificó en UI autenticada; estado de alerta por API. No se afirma una lectura de API pública de la regla no disponible. Actualizaciones automáticas y auto-merge permanecen deshabilitados. No hay cambios operativos en esta reanudación.

Un advisory raíz, siete nombres propagados altos: braces, micromatch, fast-glob, chokidar, @next/eslint-plugin-next, eslint-config-next y tailwindcss. Braces llega por globs/watchers de Tailwind y ESLint Next. Riesgo residual de agotamiento de pila en desarrollo/build al procesar patrones profundamente anidados; no se identificó parche compatible en el diagnóstico. Auditoría productiva cero no es garantía universal de seguridad. El gate completo mantiene su fallo real, visible y no requerido; no se considera corregido ni aceptado permanentemente.

`main-quality`25367275: activo solo en main; PR obligatorio, cero aprobaciones externas, QA app15368 requerido y base actualizada; force push/eliminación bloqueados y bypass vacío. No se altera para integrar. Conservar globs confiables, builds sin secretos productivos y límites de ejecución actuales.

## Deuda no bloqueante y límites

- 12 recomendaciones Doctor: siete LazyMotion (una utilidad sin consumidores encontrados), dos sobre el mismo fondo decorativo DotGrid, una transition-all de imagen, una updater de Typewriter y una identidad de contexto. No hay bug de estado ni ahorro de bundle demostrado que justifique refactors para obtener cero warnings.
- ESLint9.39.5 fuera de soporte, unrs-resolver/scripts pendientes sin aprobar y avisos LF/CRLF; sin normalización masiva ni actualización de tooling.
- No se ejecutó nueva emulación nativa de reduce, lector de pantalla real, zoom nativo ni dispositivos físicos. La suite controla media y algunos eventos; no equivale a validación nativa. Las validaciones manuales históricas de Oscar permanecen históricas.
- No se declara conformidad WCAG total ni perfección técnica. Estas deudas no generan nuevas fases obligatorias.

## Condiciones para reabrir mantenimiento

Parche/upstream compatible de braces; aparición de una vulnerabilidad productiva o cambio real de exposición; regresión funcional, de accesibilidad o de publicación; fin de compatibilidad de runtime/servicios que afecte operación. La revisión futura del riesgo no habilita actualizaciones automáticas, overrides incompatibles ni migraciones sin autorización.

El cierre final requiere QA obligatorio exitoso, producción READY del SHA final, auditoría productiva cero, main sincronizada/limpia y ramas integradas eliminadas. La entrega registra esas verificaciones después de integrar #23. No queda trabajo funcional planificado adicional.
