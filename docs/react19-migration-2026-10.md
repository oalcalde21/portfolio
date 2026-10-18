# React 19: compatibilidad, implementación y validación

Fecha: 17 de octubre de 2026, Uruguay. Rama `chore/portfolio-react-19`, base `ea7e8df61addf0e78dbc02df5a07e5b4fc99693e`.

## Cierre documental previo

PR #13 revisado: un único commit `f639809`, un archivo de diagnóstico, sin cambios inesperados; Vercel y Preview Comments exitosos, sin conflictos. Merge normal autorizado, sin squash/rebase, resultó en `ea7e8df61addf0e78dbc02df5a07e5b4fc99693e`. Main local/remoto quedaron sincronizados y limpios; rama documental eliminada local y remotamente después del merge. No se realizó despliegue manual.

## Compatibilidad investigada

Se revisaron manifest, lockfile, código real, efectos, refs, portales, hook de preferencias, pruebas existentes y diagnóstico previo. [Next recomienda React 19 para Next 16](https://nextjs.org/docs/messages/react-version); su peer instalado admite `^19.0.0`. Se verificaron el dist-tag del registro y la [release oficial 19.3.1](https://github.com/react/react/releases/tag/v19.3.1). [Guía de migración](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).

| Consumidor | Versión conservada | Revisión |
| --- | --- | --- |
| Next / eslint-config-next | 16.4.1 | Pages Router y Webpack explícito; no se actualizaron |
| Framer Motion | 11.18.2 | Peers React/DOM ^18 o ^19; entradas, AnimatePresence/remount y modales probados en navegador |
| React Icons | 5.6.0 | Peer React *; iconos y controles renderizados correctamente |
| @vercel/analytics | 2.0.1 | Peer admite React19; integración conservada, sin cambios de tracking |
| styled-jsx | 5.1.6 | Peer incluye React19; build correcto |
| Anime.js | 3.2.2 | No depende de React; callback ref de DotGrid no retorna valor; cleanup y remount comprobados |
| ESLint / hooks plugin | 9.39.5 / 7.1.1 | Sin cambios; lint aprobado. EOL de ESLint sigue documentado |

No existe React Typed ni otra librería de escritura: Typewriter es propio. No hay @types/react ni @types/react-dom en el lockfile, y las fuentes son JS/JSX: no se agregaron tipos. No se encontraron usos de APIs retiradas como findDOMNode, ReactDOM.render/hydrate, createFactory o string refs. El hook useSyncExternalStore mantiene snapshot SSR null estable; timers de Typewriter tienen cleanup. El modal usa createPortal soportado y se abre por interacción; isOpen inicia false. La compatibilidad no se concluye solo por peers: se repitieron build, hidratación controlada y flujos interactivos.

## Alcance de la actualización

- React y React DOM: **18.3.1 → 19.3.1 exactos**, conjuntamente.
- Transitiva requerida por React DOM: scheduler **0.23.2 → 0.28.0**.
- loose-envify 1.4.0 y js-tokens 4.0.0 conservan sus versiones, pero pasan a dev-only al desaparecer su uso productivo desde React/scheduler.
- No hay paquetes agregados/eliminados del lockfile ni otras versiones modificadas. Sin cambios de Next, Tailwind, ESLint, librerías de animación, componentes, estilos o contenido. No se aplicaron refactors/codemods preventivos.
- Resolución mediante npm estándar, `install --save-exact --package-lock-only --ignore-scripts --no-audit react@19.3.1 react-dom@19.3.1`; luego instalación limpia. Sin force, legacy-peer-deps, overrides ni aprobación de scripts.

La resolución inicial emitió ERESOLVE overriding peer dependency al considerar react-dom18.3.1 del árbol anterior. No se usaron flags para forzar ese warning. El lock resultante, instalación limpia y npm ls final resuelven React/DOM19.3.1 coherentes y sin peers inválidos. No se oculta el aviso inicial ni se interpreta como una incompatibilidad final demostrada.

## QA ejecutado

Runtime FNM: Node24.19.0 / npm11.17.0.

| Comando / comprobación | Resultado |
| --- | --- |
| npm ci --ignore-scripts | PASS, 385 instalados / 386 auditados; ningún script habilitado/aprobado |
| npm run qa | PASS: ESLint CLI y build Next16.4.1/Webpack; incluye lint y build requeridos |
| npm run qa:motion | PASS, ejecución real mediante botón; **47/47** (21 Typewriter, 15 DotGrid, 11 navegación), hydrationErrors=[], pendingTimers=0, listeners=0 |
| npm ls react react-dom scheduler next framer-motion react-icons eslint --all | PASS, un React/DOM19.3.1 deduplicado, sin inválidos |
| CSS y fuentes | Nueve hashes SHA-256 iguales al baseline: un CSS y ocho recursos de media; sin diferencias |
| Auditoría completa | FAIL, exit1: **9 afectados, 7 altos y 2 moderados**, sin aumento |
| Auditoría productiva | PASS, exit0: **0 afectados** |
| React Doctor completo | **FAIL, exit1**, un error y 16 warnings tanto en baseline como en React19; cero diferencias en identificadores de diagnósticos |

No existe script doctor versionado. Por solicitud expresa se ejecutó **react-doctor0.9.18 fijo** mediante npm exec en cache temporal, `--ignore-scripts`, sin agregar dependencia/scripts/config al proyecto. Se usó `--no-telemetry --no-supply-chain --scope full --no-parallel --json`: sin score remoto, crash reporting ni consulta Socket; seguridad de paquetes evaluada separadamente mediante npm audit. No se deshabilitaron reglas de código, no se cambió el umbral de errores ni se ocultaron warnings. Un score no fue solicitado ni calculado.

Comando reproducible de diagnóstico (no instala nada en package.json):

```powershell
fnm exec --using 24.19.0 npm.cmd exec --yes --ignore-scripts --package=react-doctor@0.9.18 -- react-doctor . --no-telemetry --no-supply-chain --scope full --no-parallel --json --json-out <ruta-fuera-del-repo>
```

### Hallazgos de React Doctor y clasificación

Baseline obtenido de un git archive aislado del commit base, con fuentes idénticas a main; no se modificó el repositorio para medirlo. La misma versión de Doctor examinó baseline y rama; ambos reportan 34 archivos fuente. La copia aislada no tiene una instalación independiente de node_modules: el comparativo es análisis estático del código/manifest, no prueba de runtime React18.

| Hallazgo | Cantidad | Evaluación para esta migración |
| --- | --- | --- |
| no-unguarded-browser-global-in-render-or-hook-init, ProjectModal.jsx:138 | 1 error | Preexistente. Señala document.getElementById del portal. El consumidor inicia isOpen=false y el modal retorna null antes de ese acceso; la ruta SSR actual compila y sirve correctamente. No demuestra una regresión de React19. SSR con el modal inicialmente abierto sería otra precondición no soportada por esta implementación. No se añadió guard ni supresión |
| use-lazy-motion | 7 warnings | Recomendación de bundle en importaciones existentes; no prueba una incompatibilidad y no justifica refactor en este PR |
| click-events-have-key-events / no-static-element-interactions en DotGrid | 2 warnings | Interacción decorativa existente sin teclado; requiere evaluación de semántica en alcance separado, sin agregar controles en esta migración |
| no-transition-all en Project | 1 warning | Deuda CSS previa; sin cambios de diseño ni política de movimiento |
| rerender-functional-setstate en Typewriter | 1 warning | Sugerencia de updater funcional; closure del efecto depende de frame y cancela timers. 47 casos sin regresión. No refactor preventivo |
| jsx-no-constructed-context-values | 1 warning | Recomendación de estabilidad del valor del contexto existente; sin optimización no medida |
| unsafe-json-in-html en _document | 4 warnings | JSON-LD serializado desde objetos literales versionados. No se identificó entrada arbitraria en esas expresiones; endurecimiento del serializer merece revisión aparte si el contenido pasa a ser externo. No se presenta como vulnerabilidad explotable confirmada ni se ignora el warning |

El escaneo no está verde: no se convierte exit1 en éxito mediante baseline, blocking=none o excepciones. Oscar autorizó expresamente **publicar el Draft con la limitación documentada**, sin modificar el modal ni desactivar reglas, después de conocer el error y los 16 warnings idénticos en baseline y React19. Esa autorización no acepta permanentemente la deuda ni autoriza merge.

## Verificación del build local en navegador

Servidor `npm start -- --hostname 127.0.0.1 --port 3114`, sin despliegue. HTML SSR → hidratación → interacciones comprobadas; no hay API/base de datos que migrar. Se aplicó el workflow de verificación a esos límites.

- EN/ES × 320/390/768/1440 × cuatro secciones: **32/32** recorridos por Enter con aria-current correcto y sin overflow.
- Cuatro modales en 320 y 1440: **8/8**, foco inicial de cierre, Shift+Tab al enlace final, Tab vuelve al cierre, Escape, retorno al disparador y restauración de overflow del documento. Portal/dialog/scroll sin cambios de código.
- DotGrid normal: 500 puntos y 500 objetivos con transformaciones tras clic; cambio EN/ES durante esa interacción sin error observado.
- Typewriter: ambos roles completos observados en el ciclo visible, pausa/reanudación y pausa persistente tras cambiar idioma. Los casos controlados comprueban además todos sus tiempos y preferencias simuladas.
- CTA alcanza Contact tras estabilizar scroll. Navegación por teclado funcional; sin cambios de clases ni recortes en los tamaños revisados.
- Capturas hero desktop/mobile y consola sin warnings/errores en la sesión de build local. No se declara una prueba con lector de pantalla real.
- La herramienta integrada no expone DevTools Rendering/emulación nativa de media; matchMedia nativo observado=false. Las preferencias en 47 pruebas son **simuladas**, no aceptación nativa de reduce. No se reaprovecha como propia la aceptación histórica de Oscar.

Un selector de prueba usó inicialmente Revision sin tilde en español y no encontró el botón. Se leyó el nombre real Revisión Automotriz y se completó la matriz; no fue una regresión de producto ni requirió modificarlo.

### Comprobación adicional de desarrollo

Se abrió también `next dev --webpack` con reactStrictMode=true, además del build de producción. Hidratación e interacciones EN/ES/modal funcionaron. Se observaron warnings distintos del escaneo estático: `motion() is deprecated. Use motion.create() instead.` (SideBarLink conserva `motion(Link)`), viewport meta en Head de _document (literal preexistente) y `[HMR] Invalid message` por acceso temprano a `window.next.router.components` en el cliente de desarrollo de Next. Se instaló el baseline React18 desde su lockfile en la copia aislada con --ignore-scripts y se abrió su dev server: **reproduce ambos warnings de consola y el warning viewport del servidor**. No son regresiones introducidas por React19. No son errores de hidratación reportados por React y no aparecieron en la sesión de producción local; tampoco se ocultan como consola globalmente limpia. Se conservaron ambos logs para comparar. Sin cambio de Next, API Framer ni _document para silenciarlos.

Next dev generó automáticamente un AGENTS.md no seguido que no existía en main. Tras detener el servidor se retiró únicamente ese archivo creado por esta ejecución, sin modificar next.config ni incorporar reglas autogeneradas al PR. Un intento de copiarlo desde la carpeta baseline no encontró el archivo allí; no se sobrescribió trabajo previo. El contenido y origen se verificaron antes de retirarlo.

Evidencias fuera de Git: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-react19/`: ci.log, qa.log, controlled-tests.json, doctor-baseline.json, doctor-react19.json, auditorías JSON, assets-baseline/after.json, browser-qa.json, modal.json y capturas.

## Warnings y pendientes

El build ya no emite la deprecación de React18. Se conserva npm deprecated de ESLint9.39.5 en instalación. Script de unrs-resolver sigue sin aprobar; no se afirma que un aviso allowScripts bloquee por sí mismo la ejecución. Se usó --ignore-scripts explícito. Git puede advertir LF→CRLF por configuración previa; sin normalización masiva.

La deuda de seguridad completa sigue fallando y no está aceptada permanentemente. Next/ESLint/Tailwind no se actualizaron. No se instalaron herramientas globales, no se hizo audit fix ni despliegue manual. No se autoriza merge de la rama React19. La validación nativa reduce, lector de pantalla, zoom y dispositivos físicos conservan sus limitaciones documentadas.
