# Etapa 6C — braces: investigación y riesgo residual

Fecha: 18 de octubre de 2026. Repositorio: oalcalde21/portfolio.

## Decisión y alcance

No se identificó una remediación publicada, compatible y acotada para las cuatro rutas de braces. Se entrega **únicamente documentación**. No se modifican dependencias, lockfile, configuración, código, estilos ni controles de seguridad. No se presenta esta decisión como corrección ni aceptación permanente del riesgo.

Se conservan las correcciones de 6B: postcss-selector-parser **7.1.6** bajo Tailwind y postcss-nested, con los overrides delimitados existentes. El gate completo sigue **FAIL**: siete nombres afectados altos derivados de **un advisory**; la auditoría productiva sigue en cero.

## Baseline verificado

- main y origin/main: `61737ac0c1b342bec17ea46e3a03a357f936f4d6`, después de fetch; working tree inicialmente limpio. PR #16 y #17 constan integrados en su historial.
- Un checkout registrado; no se detectó otra tarea activa sobre este repositorio ni cambios ajenos durante la inspección. Esto es una comprobación puntual, no un bloqueo de escritura de otros procesos.
- Rama documental desde ese main: `docs/portfolio-braces-risk`.
- Node **24.19.0**, npm **11.17.0**, mediante FNM. React/React DOM **19.3.1**, Next/eslint-config-next **16.4.2**, ESLint **9.39.5**, Tailwind **3.4.19**, PostCSS **8.5.29**.
- Pages Router, Webpack explícito. `qa` ejecuta lint y build; no incluye audit. `qa:motion` requiere abrir el fixture y pulsar su botón; `qa:selectors` necesita una referencia externa válida.
- No hay workflows de GitHub versionados encontrados ni configuración Vercel versionada adicional. No se inspeccionaron permisos, límites o secretos del CI/Vercel en esta etapa. La ausencia de archivos no demuestra ausencia de controles de plataforma.

Informes previos: [6A](security-remediation-2026-10.md) y [6B](selector-parser-remediation-2026-10.md). Este documento agrega el diagnóstico posterior sin alterar sus conclusiones históricas.

## Advisory y paquetes afectados

[GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), CWE-674: recursión no acotada en patrones profundamente anidados puede agotar la pila y terminar el proceso Node. Afecta a braces **<=3.0.3**; el advisory no identifica versión corregida. El registro npm sigue publicando **3.0.3** como latest. No confundirlo con avisos anteriores corregidos por esa versión.

Severidad alta. npm informa CVSS 3.1 **7.5**; GitHub publica CVSS 4.0 **8.7**. Son métricas distintas, no dos advisories. El límite de longitud existente no acredita protección suficiente contra profundidad. No se ejecutó un exploit de agotamiento de pila en la máquina del usuario.

| Nombre / versión instalada | Origen y clasificación | fixAvailable de npm | Evaluación |
| --- | --- | --- | --- |
| braces 3.0.3 | Transitiva; advisory raíz confirmado | tailwindcss 4.3.3, major | No es un parche de braces |
| micromatch 4.0.8 | Transitiva; propagación de braces | tailwindcss 4.3.3, major | Sigue requiriendo braces ^3.0.3 |
| fast-glob 3.3.3 y 3.3.1 | Dos ubicaciones; propagación de micromatch | eslint-config-next 14.2.35, major | Downgrade fuera de alcance, no solución aceptable |
| chokidar 3.6.0 | Transitiva bajo Tailwind; propagación de braces | tailwindcss 4.3.3, major | Cambiar solo watcher no elimina las otras rutas |
| @next/eslint-plugin-next 16.4.2 | Transitiva de configuración ESLint | eslint-config-next 14.2.35, major | No sustituir por configuración antigua |
| eslint-config-next 16.4.2 | Directa de desarrollo; propagación del plugin | eslint-config-next 14.2.35, major | Mantener alineada con Next |
| tailwindcss 3.4.19 | Directa de desarrollo; tres rutas transitivas | tailwindcss 4.3.3, major | Migración mayor separada, no implementada |

Son **7 nombres, 8 ubicaciones y 1 advisory raíz**. npm marca siete altos por propagación; no son siete fallos independientes. Los objetos fixAvailable describen cambios de padres propuestos por el resolvedor, no garantizan una corrección integral ni compatibilidad.

## Cadenas completas, rangos y lockfile

Verificadas con `npm explain braces --json`, `npm ls --all --json` y las entradas correspondientes del lockfile. Una única copia deduplicada `node_modules/braces` 3.0.3, marcada dev.

```text
dev-portfolio
├─ dev eslint-config-next 16.4.2 [exacta]
│  └─ @next/eslint-plugin-next 16.4.2 [exacta]
│     └─ fast-glob 3.3.1 [exacta; copia anidada bajo el plugin]
│        └─ micromatch 4.0.8 [^4.0.4]
│           └─ braces 3.0.3 [^3.0.3]
└─ dev tailwindcss 3.4.19 [^3.4.1 en raíz]
   ├─ fast-glob 3.3.3 [^3.3.2]
   │  └─ micromatch 4.0.8 [^4.0.8]
   │     └─ braces 3.0.3 [^3.0.3]
   ├─ micromatch 4.0.8 [^4.0.8]
   │  └─ braces 3.0.3 [^3.0.3]
   └─ chokidar 3.6.0 [^3.6.0; copia bajo Tailwind]
      └─ braces 3.0.3 [~3.0.2]
```

Las aristas internas que npm explain llama prod pertenecen a paquetes cuyo origen en este proyecto es **dev**. No implican dependencia productiva de la aplicación. `npm ls braces` muestra un árbol deduplicado abreviado: usar explain para no perder la cadena de ESLint.

## Ejecución real, entradas y exposición

| Ruta | Código y entrada observados | Alcance y evidencia |
| --- | --- | --- |
| Tailwind → fast-glob → micromatch → braces | fast-glob/out/managers/tasks.js expande patrones con braceExpansion=true por defecto; utils/pattern.js llama micromatch.braces con expand=true | Tailwind/lib/lib/content.js usa fast-glob para contenido. Los tres globs del proyecto son constantes versionadas, no parámetros HTTP |
| Tailwind → micromatch | content.js crea matchers para comprobar rutas demasiado amplias; micromatch.parse y braces/braceExpand pueden invocar braces | No todos los métodos de micromatch ejecutan braces; matcher no permite inferir por sí solo una llamada al walker vulnerable |
| Tailwind → chokidar | CLI/build/watching.js añade state.contentPatterns.all al watcher; chokidar/index.js getDirParts llama braces.expand cuando hay llaves | Riesgo del watcher/CLI con globs controlados por configuración. No se afirma que Next dev utilice ese watcher concreto: no se ejecutó una sesión completa de watch |
| Configuración ESLint → plugin → fast-glob | get-root-dirs.js solo llama globSync cuando settings.next.rootDir es string o array | La configuración actual no declara rootDir. Traza del lint real: una carga de braces, **cero invocaciones** observadas |

Los globs reales son:

```text
./src/pages/**/*.{js,ts,jsx,tsx,mdx}
./src/components/**/*.{js,ts,jsx,tsx,mdx}
./src/app/**/*.{js,ts,jsx,tsx,mdx}
```

Una sonda externa, sin editar paquetes ni repositorio, llamó las APIs instaladas: fast-glob con esos tres globs (**24 archivos**), getRootDirs con el patrón benigno de prueba `./{src,tests}` y Chokidar de Tailwind con `src/**/*.{js,jsx}`. Se registraron **5 invocaciones**: tres expansiones de configuración, una del rootDir de prueba y una expand del watcher. El watcher se cerró correctamente. Los dos últimos patrones son **entradas de la sonda**, no configuración real añadida al proyecto.

Método: preload CommonJS externo que cuenta cargas y llamadas conservando argumentos/resultados originales y registra el caller. La traza de next build no produjo llamadas observables; el preload no acredita cobertura exhaustiva de loaders/workers, por lo que **no demuestra que braces no se ejecute durante el build**. La ruta de contenido está respaldada por inspección y la sonda explícita, no por un supuesto conteo completo del build.

- **Desarrollo/build/CI:** biblioteca vulnerable instalada y ruta ejecutable confirmada. Con los globs actuales de una sola profundidad no se observó fallo. El riesgo aumenta si se aceptan patrones/configuración de origen no confiable. Un contribuidor que modifica configuración ejecutable ya dispone de una superficie más amplia de ejecución en build; aislar ese build sigue siendo necesario.
- **Visitante de producción:** no se encontró ruta desde URL, formulario o contenido remoto a estas APIs en src. `npm ls braces --omit=dev --all` queda vacío (exit 1 por árbol vacío), audit productivo devuelve cero, y las cuatro trazas de páginas `.nft.json` no referencian braces/Tailwind/fast-glob. No se encontraron imports de esos paquetes en src/tests. El build genera `/` y `/404` estáticas. No se identifica exposición HTTP de este advisory en el código inspeccionado.
- **Límite:** esto no es una prueba universal de ausencia en cualquier bundle, ni auditoría de los servidores de Vercel. El build de producción sí puede usar tooling dev aunque el runtime no lo incluya. Cero audit productivo no vuelve seguro el proceso de compilación.

La vulnerabilidad de la dependencia es **confirmada**; la exposición remota del visitante no está identificada. No se etiqueta como falso positivo ni se reduce artificialmente su severidad.

## Alternativas evaluadas, en orden

| Alternativa | Comprobación | Decisión / riesgo |
| --- | --- | --- |
| A. Parche de braces | Advisory, issue upstream y registro npm: latest 3.0.3, sin release corregida | Bloqueo real. No existe versión candidata para un override seguro |
| A. Actualización compatible de padres | micromatch latest 4.0.8; fast-glob latest 3.3.3; Tailwind v3-lts 3.4.19; config/plugin Next latest 16.4.2 | Las versiones compatibles vigentes retienen las cadenas. Fast-glob 3.3.1 → 3.3.3 bajo el plugin tampoco elimina braces y además saldría del pin exacto |
| B. Chokidar 4.0.3 o 5.0.0 | Metadatos publicados y guía upstream; 4 elimina globs; 5 es ESM y requiere Node >=20.19 | Node 24 admite el requisito de motor, pero no restaura el contrato de globs del consumidor. No es reemplazo transparente ni corrección de las otras tres rutas |
| B. Sustituir micromatch/fast-glob por picomatch, glob nativo u otro paquete | Inspección de contratos: expansión, globSync, matcher y parse; consumidores transitivos no controlados por la aplicación | Un alias/override no garantiza equivalencia. Exigiría adaptación de padres o fork, pruebas de watch/plataformas y nueva responsabilidad de mantenimiento; no se implementa |
| B. Tailwind 4.3.3 | Salida de audit y registro | Migración mayor expresamente excluida. Aunque retire rutas de Tailwind, no debe suponerse que arregle la ruta independiente de ESLint |
| B. Downgrade config-next 14.2.35 / canary / ESLint 10 | Revisión del fixAvailable y del alcance autorizado | Descartados. El downgrade desalinearía el tooling de Next 16; no se ensayan prereleases ni otra migración mayor para limpiar audit |
| C. Mitigación de entradas y aislamiento | Globs constantes actuales y ausencia de entrada HTTP confirmados; controles de CI pendientes de verificar | Recomendación operativa de abajo; limita exposición, no elimina paquete/advisory |
| D. Override de braces | Sin versión publicada corregida | Descartado. No inventar 3.0.4/otra versión ni sustituir por una API distinta para obtener verde |
| E. Riesgo residual documentado | Baseline reproducible y QA conservados | Opción elegida para 6C; reabrir con disparadores concretos |

No se instalaron candidatos, ni se afirma que estas alternativas descartadas hayan pasado suites de compatibilidad. Las pruebas ejecutadas son del **baseline** y sondas benignas de las APIs existentes. No había candidato seguro que justificara un experimento de actualización en worktree.

El README actual de Chokidar también describe v6, pero el registro consultado aún etiqueta 5.0.0 como latest. No se toma documentación de una línea posterior como evidencia de una release instalable y corregida para este proyecto.

## Mitigaciones propuestas y condiciones de reapertura

**Confirmado actualmente:** globs pequeños, versionados, sin entrada de visitantes; lockfile y runtime fijados; instalación de esta tarea con ignore-scripts; audit continúa visible y fallando. Estas condiciones reducen exposición, no solucionan la biblioteca.

**Propuesto, sin aplicar configuración de infraestructura en 6C:**

1. Revisar cambios en tailwind.config.js, eslint settings, lockfile y scripts antes de ejecutar builds con credenciales. No aceptar globs de URLs, CMS, archivos subidos o variables de origen no confiable. No añadir rootDir dinámico si no se necesita.
2. Ejecutar contribuciones no confiables en runners/preview aislados y efímeros, con token de solo lectura, sin secretos de producción ni reutilización de procesos privilegiados. Verificar los permisos efectivos de Vercel/GitHub antes de declararlos cubiertos.
3. Establecer límites de tiempo/recursos para lint/build/watch en CI y evitar exponer el dev server. Son contención de DoS; no deben ocultar el exit de audit. ignore-scripts bloquea lifecycle de instalación, **no** la ejecución explícita de Tailwind durante build.
4. Si aparece una necesidad real de aceptar globs externos, detener ese flujo y diseñar validación de profundidad y tamaño antes de llamar al parser. Un límite de longitud aislado no basta; no se agrega un wrapper inefectivo que las transitivas puedan eludir.

Reabrir la remediación cuando ocurra cualquiera de estos hechos:

- Un release publicado de braces figura corregido en el advisory y el registro: verificar integridad/procedencia, rangos ^3.0.3 y ~3.0.2 y todas las rutas; preferir resolución upstream y solo considerar override acotado si se demuestra compatibilidad.
- Un padre estable elimina o corrige la dependencia con contratos compatibles. Verificar ambas copias de fast-glob y las rutas independientes; no resolver solo una y declarar todo corregido.
- Se autoriza por separado una migración mayor de Tailwind o un cambio del tooling Next/ESLint, con sus propios criterios visuales y de compatibilidad.
- Se incorpora entrada no confiable o se demuestra exposición nueva en CI/runtime: reevaluar prioridad antes de habilitarla, sin esperar un verde del resolvedor.

Para cualquier candidato futuro: rama aislada, instalación limpia sin scripts, lint/build/qa, 47 pruebas controladas, 331 casos del parser, diferencial semántico y SHA-256 de CSS, watch/Node 24/Linux-Vercel cuando corresponda, responsive EN/ES y modales. Audit productivo cero y ninguna vulnerabilidad nueva; el gate completo solo se declara PASS si audit realmente termina en cero. Rollback mediante revert revisado y reinstalación del lock previo, sin force push.

## Validaciones ejecutadas y resultados

Comandos npm mediante `fnm exec --using 24.19.0 npm.cmd ...`. Evidencia local externa: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-braces-6c/` (JSON de audit/explain/árbol/registro, logs, sonda y trazas, resultados del fixture y diferencial). No se versionan node_modules, cachés ni datos del entorno.

| Comando / comprobación | Resultado real |
| --- | --- |
| npm ci --ignore-scripts | PASS, exit 0; 386 paquetes instalados / 387 auditados. Sin aprobar lifecycle |
| npm ls --all --json; npm explain braces --json | PASS, exit 0; sin peers inválidos. Cadenas y versiones consistentes con lock |
| npm run qa | PASS: lint y build; también ejecución diagnóstica con preload. Build sin caché repetido, conservando el caché previo fuera del repositorio |
| npm run qa:motion, apertura y botón en navegador | **47/47**, exit 0; simulated=true, nativeReduce=false; hydrationErrors=[], pendingTimers=0, listeners=0 |
| npm run qa:selectors -- compare directorio-evidencia | **331/331**, parser 7.1.6 en ambos consumidores; 320 selectores reales, AST/mutaciones/fixture/CSS conservados |
| npm audit --json, inicio y cierre | **FAIL, exit 1**, 7 altos, cero moderados/críticos; mismo único advisory |
| npm audit --omit=dev --json, inicio y cierre | PASS, exit 0; **0** afectados |
| npm approve-scripts --allow-scripts-pending --json | Solo lectura: unrs-resolver 1.11.1 continúa pendiente. No aprobado |
| git diff --check y revisión de alcance | Sin errores de whitespace; solo este documento |

CSS productivo reconstruido y comparado con la referencia histórica de 6B, sin sustituirla por una referencia nueva para obtener éxito:

| Archivo | Bytes | SHA-256 |
| --- | --- | --- |
| 990ba842b3f365b5.css | 22007 | ff8fd2feaf0ed27b31deb0ae449fae629ae8a2f2f2315e9e9c4b3f5b3723a730 |
| a6fc798b75e96a95.css | 2063 | 1f2c1f3937ef1cee7a56c1dd224a0990a0d357888c3e317de8be18cbf2b1bc4c |

Fixture SHA-256: `32ee0a708c780161f88be969dc4e757537a834b25be91b369bf7556f2e27ee82`. Rutas del build: `/`, `/_app`, `/404`; páginas públicas prerenderizadas.

### Warnings y limitaciones

- npm conserva el warning de ESLint 9.39.5 sin soporte. No se actualiza ni oculta. Los lint/build verificados no introducen warnings nuevos.
- core.autocrlf=true es previo; no se normalizaron archivos existentes ni el lockfile. Cualquier aviso LF/CRLF de Git no se considera una corrección de seguridad.
- React Doctor no se repitió: su baseline histórico de **1 error y 16 advertencias** continúa separado; no se atribuye a braces ni se declara resuelto.
- Las pruebas de movimiento son controladas/simuladas. No se declara emulación nativa de reduce, lector de pantalla real, zoom, dispositivos físicos ni sesión completa de Next dev/Tailwind watch.
- No se hizo una nueva matriz visual de EN/ES a 320/390/768/1440, recorrido completo de CTA/modales o comparación exhaustiva de assets: no existe candidato ni cambio de CSS/aplicación. Los 47 tests cubren el comportamiento controlado de idioma/pausa/DotGrid/navegación, no sustituyen esa matriz. La evidencia visual de 6B sigue siendo histórica.
- No se reconstruyó Linux ni se verificó un nuevo despliegue Vercel; se mantuvo Node 24 en Windows y no hubo despliegue manual. No se declara nueva aceptación de producción.
- No se ejecutaron payloads hostiles, fuzzing exhaustivo ni pruebas de saturación. La vulnerabilidad se confirma por versión/advisory y la exposición por código/sondas, no por un ataque al entorno del usuario.

## Próxima etapa recomendada

Revisar e integrar por separado este PR documental. Después, autorizar una revisión operativa acotada de los controles reales de CI/previews y un procedimiento de seguimiento del release upstream. Esa tarea debe conservar audit completo en FAIL mientras corresponda. No iniciar automáticamente Tailwind 4 o ESLint 10: son migraciones independientes y Tailwind por sí solo no acredita eliminar la cadena de ESLint.

La ausencia actual de un parche compatible es el bloqueo técnico de remediación; no impide documentar y reducir exposición. No se acepta permanentemente la deuda ni se declara seguro todo el proyecto.

## Fuentes consultadas

- [Advisory GitHub](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) y [discusión upstream abierta #70](https://github.com/micromatch/braces/issues/70), consultados el 18/10/2026.
- Registro npm, consultas de solo lectura a metadatos y versiones exactas: [braces](https://registry.npmjs.org/braces), [micromatch](https://registry.npmjs.org/micromatch), [fast-glob](https://registry.npmjs.org/fast-glob), [chokidar](https://registry.npmjs.org/chokidar), [Tailwind](https://registry.npmjs.org/tailwindcss), [eslint-config-next](https://registry.npmjs.org/eslint-config-next), [plugin Next](https://registry.npmjs.org/@next/eslint-plugin-next).
- [Guía de migración de Chokidar](https://github.com/paulmillr/chokidar#upgrading) y [opción braceExpansion de fast-glob](https://github.com/mrmlnc/fast-glob#braceexpansion).
- Código y lockfile efectivamente instalados, más comandos y evidencias detallados arriba. Ninguna consulta al registro instaló @latest ni ejecutó actualizaciones.
