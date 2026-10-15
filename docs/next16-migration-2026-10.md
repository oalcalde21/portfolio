# Etapa 4C: migración Next.js 16 y ESLint 9 — preparada para revisión

Base: `main` limpio y sincronizado en `eb70a9d`. Rama: `fix/portfolio-next16-security`. Runtime verificado: Node 24.19.0 y npm 11.17.0. Los bloqueos iniciales de lint y acceso al navegador fueron resueltos y las validaciones de cierre están registradas al final. Se prepara commit y PR Draft para revisión, sin merge ni despliegue manual. Las secciones históricas conservan los resultados de la primera preparación para trazabilidad.

## Versiones y alcance

| Paquete | Baseline | Preparación |
| --- | --- | --- |
| Next.js | 14.2.1 | 16.4.1 exacto |
| eslint-config-next / @next/eslint-plugin-next | 14.2.1 | 16.4.1 |
| ESLint | 8.57.1 | 9.39.5 exacto |
| React / React DOM | 18.3.1 | 18.3.1 |
| Tailwind CSS | 3.4.19 | 3.4.19 |
| Framer Motion / Anime.js | 11.18.2 / 3.2.2 | sin cambios |
| Vercel Analytics | 2.0.1 | sin cambios |
| sharp | ausente | 0.35.5 transitivo de Next |

El registro npm marcaba 16.4.1 como latest y no exponía una estable posterior. Next admite React ^18.2.0 y Node >=20.9.0; eslint-config-next requiere ESLint >=9. El árbol resuelve typescript-eslint 8.71.2 y react-hooks 7.1.1 con peers compatibles. `npm ls next react react-dom tailwindcss eslint eslint-config-next sharp --depth=1` terminó con exit 0.

Se sustituyó `.eslintrc.json` por `eslint.config.mjs`, usando core-web-vitals y conservando únicamente las tres excepciones anteriores. No se agregaron ignores propios ni se deshabilitaron reglas nuevas. Se utilizan los ignores del preset oficial. Los scripts dev/build fijan `--webpack`, lint usa `eslint .` y qa ejecuta `npm run lint && npm run build`. Así, el gate se detiene si lint falla aunque el build aislado compile.

El lockfile fue resuelto mediante npm con `--package-lock-only --ignore-scripts --no-audit` y reconstruido con npm ci. Pasa de 410 a 442 registros: 88 agregados, 56 eliminados y 39 registros conservados con versión distinta. Son cambios de las cadenas requeridas por Next/ESLint; ninguna otra dependencia directa cambió de versión instalada. Aplicación, configuración Next/PostCSS/Tailwind, contenido, assets e infraestructura no fueron modificados.

## Avisos oficiales del 14 de octubre de 2026

La [release 16.4.1](https://github.com/vercel/next.js/releases/tag/v16.4.1) incluye las tres correcciones anunciadas:

| Aviso | Severidad | Fix y relación con el portfolio |
| --- | --- | --- |
| [GHSA-673q-mjm6-r5xr](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr) | Crítica | RCE en use cache devolviendo typed arrays; corregido en 16.4.1. No hay App Router ni Cache Components en este proyecto. |
| [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) | Crítica | RCE mediante imágenes SVG en optimización sobre Linux/glibc. Next 16.4.1 exige resolución corregida; sharp instalado 0.35.5 cumple el mínimo oficial. No hay consumidores next/image encontrados. |
| [GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r) | Alta | DoS en App Router/Server Actions; corregido en 16.4.1. El aviso excluye Pages Router. |

La ausencia de consumidores concretos no se usa para omitir los parches ni declarar seguro todo el proyecto.

## Baseline y auditorías

Antes de editar se ejecutaron ambas auditorías, lint y build de Next 14. Lint y build terminaron con exit 0; página estática, 66.2 kB y JS inicial 153 kB. Se guardaron JSON de auditorías, HTML, manifiesto SHA-256 y copias de CSS/fuentes fuera del repositorio, en `%TEMP%/portfolio-next16-baseline`. Las salidas posteriores están en `%TEMP%/portfolio-next16-after`. Estos archivos temporales pueden ser limpiados por el sistema; el resumen durable es este documento.

| Validación | Antes | Después |
| --- | --- | --- |
| npm ci | Baseline reconstruido en etapa anterior | exit 0; 385 instalados, 386 auditados |
| npm run lint | exit 0, sin warnings/errores | exit 1; 2 errores, 0 warnings |
| npm run build | exit 0, Next 14 | exit 0, Next 16.4.1 con Webpack, / y /404 estáticas |
| npm audit --json | exit 1; 16: 2 moderados, 13 altos, 1 crítico | exit 1; 9: 2 moderados, 7 altos, 0 críticos |
| npm audit --omit=dev --json | exit 1; 2: 1 alto y 1 crítico | exit 0; 0 afectados |
| git diff --check | correcto | correcto |

Persisten nueve paquetes afectados en desarrollo/build: braces, micromatch, fast-glob, chokidar, @next/eslint-plugin-next, eslint-config-next y tailwindcss (altos), postcss-selector-parser y postcss-nested (moderados). Los primeros propagan el aviso sin parche de braces; el parser de Tailwind continúa en major 6, mientras el fix completo está en 7.1.6. No se migró Tailwind ni se introdujeron overrides para eludir los rangos. El gate completo de seguridad sigue fallando; no hay aceptación permanente del riesgo.

## Bloqueo de lint

La regla nueva `react-hooks/set-state-in-effect` detecta:

- `src/components/util/LanguageTransition.jsx:8`: incremento de key dentro de un efecto. No se encontraron consumidores de este componente en src.
- `src/components/util/Typewriter.jsx:34`: reinicio de estado dentro del efecto de cambio de idioma. El árbol actual ya remonta el contenido mediante transitionKey al cambiar EN/ES; esa relación debe validarse al corregir el reinicio.

Ambos patrones ya estaban en la base. No son fallos de instalación ni peers. No se cambiaron componentes ni se agregaron supresiones. Un warning inicialmente introducido en el archivo de configuración por exportación anónima fue corregido asignando el array a una variable. La segunda ejecución mantiene exactamente dos errores y ningún warning.

La corrección de esos componentes requiere ampliar la autorización actual, que prohíbe modificarlos. No se declara que el gate qa pase: por su secuencia, falla en lint. El build se ejecutó por separado para diagnóstico.

## Comparación CSS, fuentes y assets

| CSS | Baseline: bytes / SHA-256 | Después: bytes / SHA-256 |
| --- | --- | --- |
| Global | 19711 / 070FD04E752C9CEEEE87D2FE3001909D1E16C184E00857C53AE475A0304FD0ED | 19706 / 8132DDD79583080E781479CBF985F7AE7672B306BB3757C04057DD316DBC98AC |
| Inter | 2153 / 83B2BB797CCEACBD194BF2B9877A7A2AC805E800AA8A40952BE5C45135937CD2 | 2063 / 1F2C1F3937EF1CEE7A56C1DD224A0990A0D357888C3E317DE8BE18CBF2B1BC4C |

Los archivos nuevos son `46a715fa3892aa54.css` y `a6fc798b75e96a95.css`. En el global se conservan las 538 declaraciones y el contenido completo coincide después de normalizar ocho valores rgba a la sintaxis rgb con alpha equivalente. No se cambiaron colores ni utilities del código fuente.

El CSS de fuentes cambia los nombres internos de familia a Inter/Inter Fallback. Los siete woff2 mantienen nombres y hashes idénticos. Las métricas del fallback cambian: ascent 90.49% → 90.44%, descent 22.56% → 22.52% y size-adjust 107.06% → 107.12%. Es un cambio real del CSS generado por next/font que requiere revisión visual, especialmente durante carga lenta de fuentes; no se asume ausencia de regresión.

Todos los archivos de public conservan sus SHA-256 respecto del baseline.

## QA HTTP realizado y QA pendiente

El build se sirvió localmente en 127.0.0.1:3100, sin despliegue. La página responde 200; una ruta inexistente responde 404. Canonical, URL OG y los cuatro schemas se conservan. Los cuatro encabezados de seguridad mantienen los valores configurados. CV, resume, OG, robots y sitemap responden 200, con MIME correcto y SHA-256 idéntico a public.

GTM sigue presente en el HTML con el mismo identificador. Analytics permanece importado en _app y conserva versión; su script no figura en el HTML SSR ni en el baseline ni después, por lo que esa ausencia no prueba regresión ni confirma ejecución. La inicialización y entrega de eventos requieren navegador.

No se completó QA de navegador en esta ejecución: el intento de apertura agotó el tiempo y la recuperación de la pestaña fue bloqueada por la política de seguridad del navegador. No se intentó sortear el bloqueo por otro navegador o mecanismo de control. Por ello quedan pendientes EN/ES interactivo, navegación/scroll, modal, animaciones, consola/hidratación, Analytics/GTM en ejecución y responsive visual en 320, 390, 768 y 1440 px. El QA de etapas anteriores no se presenta como prueba de Next 16.

## Warnings y cierre pendiente

- npm marca ESLint 9.39.5 como deprecado/no soportado. Se conserva porque el alcance autorizado exige ESLint 9; no se actualiza a 10 por iniciativa propia.
- Next advierte que React 18 está deprecado en Next 16 y se eliminará en Next 17. React 18 sigue admitido en esta versión; no se migró React.
- unrs-resolver@1.11.1 mantiene un script pendiente de allowScripts. No se aprobó ni se cambió esa política.
- No se ejecutó audit fix, merge, despliegue manual ni migración Tailwind 4.

La primera preparación se detuvo para solicitar autorización sobre los dos componentes y recuperar acceso permitido al navegador.

## Continuación autorizada: corrección de efectos

Se autorizaron exclusivamente los dos componentes identificados, sin cambiar dependencias, otros componentes, tiempos o diseño. Se inspeccionaron sus consumidores, el contexto de idioma y el remonte por transitionKey de HomPage antes de editar.

- LanguageTransition no tiene consumidores en src. Se retiraron el estado key y el efecto que lo incrementaba una vez al montar, evitando un remonte artificial. Se mantienen AnimatePresence, mode wait, opacidad inicial/entrada/salida y duración 0.3. No hay cambio observable en el portfolio, que no utiliza este componente; no se presenta como prueba de montaje aislado del componente sin consumidores.
- Typewriter mantiene el reinicio cuando cambia el texto traducido del primer rol. El ajuste ahora ocurre durante render, condicionado a que ese texto sea distinto del previamente almacenado, siguiendo el patrón de React para ajustar estado ante un cambio de entrada. Esto evita el efecto de reinicio y el render en cascada, sin depender únicamente del remonte del padre durante su salida animada.
- No se modificaron el efecto de escritura/borrado, sus callbacks, dependencias, delays ni cleanup. Siguen los valores 100/50 ms y 2000/1500 ms declarados previamente; la limpieza conserva clearTimeout. No se realizó una medición temporal automatizada ni se corrigieron otros posibles problemas previos de temporizadores fuera del alcance.
- No se agregaron excepciones de ESLint ni exclusiones. Solo esos dos archivos de producto cambiaron durante esta continuación; package.json y lockfile no se modificaron de nuevo.

Validación repetida:

| Comprobación | Resultado |
| --- | --- |
| npm run lint | exit 0, sin errores ni warnings |
| npm run build | exit 0, Next 16.4.1 con Webpack, / y /404 estáticas |
| npm audit --json | exit 1; 9 afectados: 7 altos, 2 moderados, 0 críticos |
| npm audit --omit=dev --json | exit 0; 0 afectados |
| CSS frente al build previo de Next 16 | Ambos SHA-256 idénticos, sin cambios nuevos |
| Fuentes frente al baseline Next 14 | Los siete woff2 idénticos por SHA-256 |

Las diferencias de CSS y métricas de fallback introducidas por Next 16 siguen siendo las documentadas antes. No apareció un warning nuevo de build: persiste la deprecación ya registrada de React 18.

Se recuperó acceso al navegador abriendo una pestaña HTTP nueva del build local, sin acceder a la antigua página de error con protocolo data. QA interactivo realizado: EN → ES → EN, alternancias rápidas, atributo lang, CV correspondiente, escritura de ambos roles y reinicio al cambiar idioma, apertura/contenido/cierre del modal Plenitud Fit, navegación a Contacto/About. No se observaron regresiones en el smoke test.

Se comprobaron 320, 390, 768 y 1440 px sin overflow horizontal y se inspeccionaron visualmente móvil 390 px y escritorio 1440 px, con fuentes cargadas. Consola capturada sin warnings ni errores de hidratación. Analytics y GTM aparecen como scripts en el DOM; no se verificó recepción de eventos en sus servicios. No se simuló red lenta para medir el fallback tipográfico ni se realizó comparación visual automatizada.

Esta continuación se detuvo sin commit, push ni PR, conforme a la autorización de ese momento. La autorización posterior de cierre permite preparar commit y PR Draft después de completar las verificaciones siguientes. Persiste el gate de seguridad completo fallando por los nueve paquetes de desarrollo/build; su riesgo no queda aceptado permanentemente.

## Cierre: fuentes lentas y seguridad residual

Se repitieron npm ci (exit 0, 385 instalados/386 auditados) y npm run qa (exit 0: lint sin warnings/errores y build con Webpack correcto). Persisten exclusivamente los warnings ya registrados de ESLint 9 deprecado, React 18 deprecado en Next 16 y allowScripts pendiente para unrs-resolver. No se aprobaron scripts ni se modificó el gate de seguridad. Auditoría completa exit 1: 9 afectados, 7 altos y 2 moderados; sin desarrollo exit 0: 0 afectados.

### Revisión individual de los nueve hallazgos

| Paquete y versión instalada | Padre y rango | Severidad / alcance | Corrección y decisión |
| --- | --- | --- | --- |
| braces 3.0.3 | micromatch ^3.0.3; chokidar ~3.0.2 | Alta, desarrollo/build; recursión no acotada | Última publicada 3.0.3, sin parche publicado. No hay actualización compatible disponible. |
| micromatch 4.0.8 | Tailwind ^4.0.8; fast-glob ^4.0.4 / ^4.0.8 | Alta, desarrollo/build, propagada desde braces | Última publicada 4.0.8; depende del fix de braces o reemplazo de la cadena. |
| fast-glob 3.3.1 / 3.3.3 | @next/eslint-plugin-next fija 3.3.1; Tailwind ^3.3.2 | Alta, lint/build, vía micromatch → braces | Cambiar entre estas versiones no elimina la cadena vulnerable; no se fuerza el pin del plugin. |
| chokidar 3.6.0 | Tailwind ^3.6.0 | Alta, watcher de desarrollo/build, vía braces | No hay fix en su árbol 3.x observado. Una sustitución de major requiere revisión de Tailwind y queda fuera de alcance. |
| @next/eslint-plugin-next 16.4.1 | eslint-config-next fija 16.4.1 | Alta, lint, vía fast-glob → micromatch → braces | Requiere cambio upstream de la cadena o parche de braces. |
| eslint-config-next 16.4.1 | Dependencia directa de desarrollo, exacta | Alta, lint, vía plugin | Conservar alineado con Next. La sugerencia automática de npm de volver a 14.2.35 no es un parche compatible ni resuelve el objetivo de ESLint 9. |
| postcss-selector-parser 6.1.4 | Tailwind ^6.1.2; postcss-nested ^6.1.1 | Moderada, build CSS; complejidad cuadrática | Fix completo 7.1.6; última 6.x publicada 6.1.4. Fuera de rangos compatibles. |
| postcss-nested 6.2.0 | Tailwind ^6.2.0 | Moderada, build CSS, propagada desde parser | Última 6.x publicada 6.2.0, depende de parser ^6. No hay parche compatible que cierre el hallazgo. |
| tailwindcss 3.4.19 | Dependencia directa de desarrollo, ^3.4.1 | Alta, build/watch; propagación de las dos cadenas anteriores | npm propone migración a 4.3.3; no está autorizada. Mantener y evaluar en otra etapa. |

Solo hay dos avisos raíz: [braces GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) y [selector-parser GHSA-rj75-hqrm-r3gf](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf). El resto de los nueve recuentos es propagación por dependencias. Las versiones y rangos se contrastaron con el registro npm, npm ls y el lockfile. Los flags fixAvailable del audit no se interpretaron como prueba de un parche compatible: postcss-nested sigue dependiendo de parser 6.x aun cuando npm indique fixAvailable true.

No se identificó una actualización compatible capaz de eliminar estos hallazgos sin cambios importantes adicionales. No se actualizaron dependencias durante el cierre, ni se agregaron overrides. Los hallazgos están ausentes del árbol --omit=dev; aun así afectan herramientas que procesan CSS/patrones y deben seguir tratándose como deuda de seguridad. No se declara seguro todo el proyecto ni se acepta el riesgo permanentemente.

### Prueba de fallback tipográfico

El navegador no expone throttling de red. Se utilizó un proxy HTTP temporal, enlazado exclusivamente a 127.0.0.1, que demoró 12000 ms las respuestas WOFF2 y evitó caché. Se usaron orígenes locales separados para móvil 390 × 844 y escritorio 1440 × 900. Una instrumentación temporal de PerformanceObserver en el HTML de QA registró layout-shift mediante la ventana estándar de sesiones, excluyendo entradas con interacción reciente. Ni el proxy ni esa instrumentación forman parte del repositorio o del build entregado; no se cambiaron fuentes ni estilos del producto.

En ambos tamaños se confirmó document.fonts.status loading e Inter no cargada, se inspeccionó visualmente el fallback y se midieron 27 bloques h1/p. Luego se confirmó el estado loaded y se repitieron mediciones y capturas.

| Medición | Móvil | Escritorio |
| --- | --- | --- |
| Cambio de altura de los 27 bloques medidos | 0 px | 0 px |
| H1, altura antes → después | 40 → 40 px | 96 → 96 px |
| H1, ancho antes → después | 230.19 → 240.64 px | 613.84 → 641.67 px |
| Hero, párrafo altura antes → después | 136.5 → 136.5 px | 104 → 104 px |
| Líneas del párrafo del hero | 6 → 6 | 4 → 4 |
| CLS local de la página instrumentada | 0.04851 | 0.03223 |

La distribución vertical se mantuvo y no hubo cortes ni desbordamiento visibles. El cambio de ancho intrínseco del título al sustituir Arial ajustada por Inter es observable, pero no produjo otra línea ni cambió su altura. En escritorio se mantuvo el recuento de líneas agrupadas de todos los bloques. En móvil, los rectángulos de texto inline/botones variaron por métricas de baseline, sin aumentar alturas; no se confundieron esos fragmentos con líneas nuevas del párrafo.

El CLS incluye animaciones y escritura automática del sitio; no se atribuye enteramente a fuentes ni se presenta como medición de campo/Core Web Vitals o comparación de CLS contra Next 14. En la ventana de llegada de fuentes se observaron entradas pequeñas (~0.00060 móvil y ~0.00110 escritorio), mezcladas con actividad del typewriter. Las diferencias de métricas de fallback frente al CSS de Next 14 son las documentadas antes. No se demostró una regresión visual que justifique modificar fuentes o estilos.

### QA final y revisión de alcance

Se repitió el smoke test sobre 127.0.0.1:3100 sin instrumentación: EN/ES/EN, atributo lang, enlaces CV, modal Plenitud Fit y navegación a Contacto correctos; 320, 390, 768 y 1440 px sin overflow; consola capturada sin warnings ni errores. El build conserva Pages Router y /404. Los hashes CSS siguen siendo los de Next 16 documentados, y los siete WOFF2/public conservan el baseline original.

Se revisaron el diff de configuración y ambos componentes, el alcance completo del lockfile y sus URLs de registro. Solo Next cambia entre dependencias productivas directas; React, Tailwind, animaciones, Analytics, assets y configuraciones Next/PostCSS/Tailwind se conservan. Los ocho archivos previstos son package.json, package-lock.json, reemplazo de .eslintrc.json por eslint.config.mjs, los dos componentes autorizados, README y este informe. git diff --check pasa. Los avisos locales LF/CRLF no corresponden a una normalización masiva de los archivos versionados.

Preparar commit Conventional Commits y PR Draft hacia main para revisión. No hacer merge, desplegar manualmente ni iniciar otra etapa.
