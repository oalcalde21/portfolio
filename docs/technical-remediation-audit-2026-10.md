# Cierre de 5E y diagnóstico de saneamiento técnico

Fecha: 17 de octubre de 2026, Uruguay (las operaciones de cierre ocurrieron el 18 de octubre en UTC). Diagnóstico sobre `10957c1105edf425c3f1006121e0c75fb28b8c68`. Este informe propone cambios; no implementa actualizaciones ni autoriza aceptar permanentemente deuda de seguridad.

## 1. Cierre de 5E

- PR [#12](https://github.com/oalcalde21/portfolio/pull/12): mergeado con método **merge**, sin squash, rebase ni force push.
- Base comprobada: `327e827bc8efe3cdfa530658f8b0daf6a35cbd00`. Head comprobado: `c6857acba46738553740a28a8177dbf2977bee9f`. Un commit, 14 archivos, sin conflictos ni cambios de dependencias/lockfile. Checks Vercel y comentarios del preview exitosos; la consulta de reglas aplicables a main devolvió `[]`.
- Commit definitivo de main: `10957c1105edf425c3f1006121e0c75fb28b8c68`, padres `327e827...` y `c6857ac...`. Árbol idéntico al head revisado. Main local y origin/main sincronizados y limpios tras cerrar la etapa. Rama `fix/portfolio-navigation-semantics` eliminada local y remotamente después del merge y QA.
- Oscar confirmó conformidad con el resultado y autorizó el cierre. **La validación nativa de movimiento reducido específica de 5E no se completó formalmente**. Se mantiene como limitación, sin declararla aprobada ni reutilizar la aceptación manual histórica de 5D.4.
- No se realizó sesión con lector de pantalla real, prueba en dispositivos físicos ni zoom nativo. No se afirma conformidad WCAG completa.

### Validaciones ejecutadas por Codex

| Comprobación | Resultado |
| --- | --- |
| `npm run qa` antes del merge | PASS: ESLint CLI y build Next/Webpack |
| `npm run qa:motion` con botón interactivo | **47/47**, exit 0; hidratación sin errores, cero temporizadores y suscripciones pendientes; preferencias y geometría controladas, no emulación nativa |
| `npm run qa` sobre main tras merge | PASS: lint y build |
| Instalación diagnóstica `npm ci --ignore-scripts` | PASS: 385 instalados / 386 auditados; ningún script ejecutado ni aprobado; hash del lockfile idéntico |
| `npm run qa` después de esa instalación | PASS: lint y build |
| `npm ls --depth=0` tras completar instalación | PASS, versiones coherentes y sin paquetes inválidos/extraneous |
| `git diff --check` | PASS |
| Auditoría completa | FAIL, exit 1: **9 afectados, 7 altos y 2 moderados** |
| Auditoría `--omit=dev` | PASS, exit 0: **0 afectados**, repetida al terminar |

Se conserva el warning de React 18 en el build y de ESLint 9 sin soporte durante npm ci. Un `npm ls` se ejecutó por error mientras npm ci todavía reconstruía node_modules: informó Next incompleto y dependencias extraneous. Fue una observación de instalación en curso, no un árbol final válido. Se esperó su terminación y se repitieron npm ls y QA correctamente. La consulta de una inexistente versión postcss-nested 6.2.1 devolvió E404; la lista publicada confirma que 6.2.0 es la última 6.x. No se instaló nada a partir de esas consultas.

### Producción automática

Vercel confirmó **READY**, source `git`, target `production`, SHA `10957c1...`, despliegue `dpl_G4VNS8JNYihcDY3LDuz8W1JcqvK1`; alias `oscaralcalde.vercel.app` asociado, sin aliasError. [Inspección del despliegue](https://vercel.com/oscaralcalde-projects/portfolio/G4VNS8JNYihcDY3LDuz8W1JcqvK1). No se hizo despliegue manual.

Pruebas sobre el dominio público actualizado:

- 32 recorridos con Enter: EN/ES × cuatro secciones × 320, 390, 768 y 1440 px. `aria-current` alcanza la sección correspondiente y no hay overflow horizontal.
- Selector EN/ES, pausa/reanudación y CTA; tras estabilizar el scroll, CTA selecciona Contact. Ambos roles visibles completos del Typewriter observados durante su ciclo, además del texto accesible estable.
- DotGrid: 500 puntos; clic normal produce transformaciones en los 500 objetivos. No se simula preferencia nativa en producción.
- Cuatro modales abiertos, foco inicial en cierre, Escape y retorno a la página. La matriz más extensa de teclado y restauración figura en el informe de accesibilidad de 5E; este cierre no pretende repetir una sesión con lector de pantalla.
- Fuentes con estado loaded y cuatro capturas de proyectos cargadas tras recorrer la página. Las imágenes lazy no estaban todas cargadas en el hero inicial; cargaron al llegar a sus secciones.
- HTTP 200 para `/`, ambos PDF, OG JPEG, robots y sitemap; otros 15 recursos estáticos referenciados por el HTML (scripts/CSS/preloads) respondieron 200.
- Canonical y OG absolutos correctos; cuatro bloques JSON-LD presentes. Sin warnings/errores de consola capturados en la sesión.
- Capturas de desktop y mobile guardadas. No se repitieron mediciones de contraste, axe ni métricas de rendimiento; no son conclusiones nuevas de esta etapa.

Evidencia local fuera de Git: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-5e-close/` (logs QA antes/después/instalación limpia, auditorías JSON, 47 resultados, matriz de navegación, Typewriter, recursos y capturas). El informe de 5E original conserva la evidencia anterior.

## 2. Stack efectivo y compatibilidad

Versiones comprobadas en manifest, lockfile, node_modules y `npm ls`; candidatas consultadas en registro npm y fuentes oficiales. Son una foto del diagnóstico y deben revalidarse antes de implementar.

| Paquete / runtime | Instalado | Evaluación / candidata |
| --- | --- | --- |
| Node / npm | 24.19.0 / 11.17.0 mediante FNM | Conservar estándar; no se actualizaron herramientas globales |
| Next.js | 16.4.1 exacto | 16.4.2 estable disponible; patch separado y alineado con config-next |
| React / React DOM | 18.3.1 / 18.3.1 (`^18`) | Migrar juntos a **19.3.1 exactos** como candidata, previa nueva autorización y QA |
| ESLint | 9.39.5 exacto | EOL; 10.13.0 estable disponible, **bloqueada por peers de tres plugins actuales** |
| eslint-config-next | 16.4.1 exacto | 16.4.2 disponible; admite ESLint >=9, pero eso no basta para validar toda la cadena con 10 |
| Framer Motion | 11.18.2 | Peers React/DOM `^18 || ^19`; no requiere actualización para probar React 19 |
| Anime.js | 3.2.2 | Sin peer React; conservar y repetir pruebas de ciclo de vida |
| Tailwind CSS | 3.4.19 | Última 3.x publicada; mantener hasta una migración específica autorizada |
| tailwind-merge | 2.6.1 | Conservar con Tailwind 3; reevaluar solo si se autoriza Tailwind 4 |
| PostCSS raíz | 8.5.29 | Sin hallazgo directo en la auditoría actual; conservar |
| @vercel/analytics | 2.0.1 | Peers React `^18 || ^19 || ^19.0.0-rc`, Next >=13; sin bloqueo declarado |
| react-icons | 5.6.0 | Peer React `*`; sin bloqueo declarado |
| styled-jsx, transitiva de Next | 5.1.6 | Peer incluye React 19; sin bloqueo declarado |

### React y Next

[Next documenta](https://nextjs.org/docs/messages/react-version) que React >=18.2 sigue soportado en Next 16, aunque deprecado; recomienda React 19 y lo requerirá en Next 17. La combinación actual no es un error de peers, pero tiene una salida de soporte anunciada. El proyecto conserva Pages Router; no necesita migrar a App Router para cambiar React.

El peer real de Next 16.4.1 y 16.4.2 admite `^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0`. React DOM 19.3.1 pide React `^19.3.1`. La [publicación oficial de React 19.3.1](https://github.com/react/react/releases/tag/v19.3.1) y el dist-tag npm confirman la candidata actual. No usar 19.3.0 por inercia ni instalar latest sin fijar la versión revisada.

No se identificó un bloqueo declarado entre las dependencias instaladas y React 19. Eso no equivale a compatibilidad funcional ya demostrada: deben probarse SSR/hidratación, StrictMode, callback refs, portal/foco, remount EN/ES, Framer Motion y limpieza de Anime.js. La búsqueda en src/tests no encontró usos de `findDOMNode`, `ReactDOM.render/hydrate`, `createFactory`, `propTypes/defaultProps`, `element.ref` o react-dom/test-utils. El proyecto es JS/JSX; no agregar paquetes de tipos como dependencias directas artificiales. Revisar los tipos transitivos solo si npm muestra un conflicto real.

La [guía React 19](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) documenta APIs retiradas, cambios en refs, hidratación y StrictMode. No aplicar codemods o refactors preventivos indiscriminados. La modificación mínima esperada es React y React DOM juntos en package.json y lockfile, más documentación y únicamente arreglos demostrados por QA.

[Next 16.4.1](https://github.com/vercel/next.js/releases/tag/v16.4.1) contiene las tres correcciones de seguridad publicadas el 14 de octubre. [16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2), publicado el 15, enumera principalmente correcciones Turbopack y documentación; sus notas no anuncian otra corrección de seguridad. La auditoría productiva actual no identifica Next afectado. No presentar el patch como solución de los nueve afectados de tooling.

### ESLint: soporte y bloqueo concreto

La [política oficial](https://eslint.org/version-support/) fija EOL de ESLint 9 el 6 de agosto de 2026. npm metadata de 9.39.5 contiene la deprecación que produce el warning: no procede de una regla fallida del proyecto. `eslint .` no emitió warnings ni errores.

| Plugin resuelto por config-next | Versión | Peer ESLint relevante | ESLint 10 |
| --- | --- | --- | --- |
| eslint-plugin-react | 7.37.5, también última publicada | hasta `^9.7` | No declarado |
| eslint-plugin-import | 2.32.0, también última publicada | hasta `^9` | No declarado |
| eslint-plugin-jsx-a11y | 6.10.2, también última publicada | hasta `^9` | No declarado |
| eslint-plugin-react-hooks | 7.1.1 | incluye `^10` | Declarado |

config-next 16.4.2 mantiene los mismos rangos de esos plugins. Actualizar solo ESLint a 10 no es una solución compatible y mantenible con el árbol publicado hoy. No usar force, legacy-peer-deps, parches de peers ni quitar plugins/reglas para silenciarlo. Cuando los padres y plugins publiquen soporte, comprobar también las APIs de reglas retiradas en la [guía ESLint 10](https://eslint.org/docs/latest/use/migrate-to-10.0.0), descubrimiento de config y parsing JSX; Node 24.19 cumple los engines de 10.13.0.

La flat config actual reutiliza core-web-vitals y contiene tres excepciones históricas: no-img-element, no-unescaped-entities y exhaustive-deps. No se ampliaron ni se presentan como causa del aviso de EOL. Su revisión merece un PR propio si se autoriza; no desactivar reglas adicionales ni reactivar todo con refactor masivo para obtener un gate artificial.

## 3. Seguridad: nueve paquetes afectados, dos avisos raíz

Estos son **nueve nombres de paquetes afectados**, no nueve CVE independientes. Todos están marcados como desarrollo en sus caminos del lockfile y se usan para lint/build/watch. Cero afectados en `npm audit --omit=dev`. Esto limita la exposición conocida del runtime, pero no elimina riesgos de cadena de suministro o de ejecutar builds sobre entradas no confiables.

| Paquete afectado | Versión instalada | Severidad / tipo | Cadena desde dependencia directa | Corrección disponible / límite |
| --- | --- | --- | --- | --- |
| braces | 3.0.3 | Alta, transitiva, aviso raíz A | Tailwind → chokidar; Tailwind/config-next → fast-glob → micromatch → braces | **Sin parche publicado**; latest 3.0.3 sigue afectado |
| micromatch | 4.0.8 | Alta, transitiva, propagada A | Tailwind → micromatch; fast-glob → micromatch | Depende de braces `^3.0.3`; no parche compatible demostrado que elimine A |
| fast-glob | 3.3.3 raíz; 3.3.1 anidado en plugin Next | Alta, transitiva, propagada A | Tailwind → fast-glob; config-next → plugin-next → fast-glob | Actualizar 3.3.1 a 3.3.3 no elimina la cadena vulnerable |
| chokidar | 3.6.0 anidado en Tailwind | Alta, transitiva, propagada A | Tailwind → chokidar → braces | Tailwind fija `^3.6.0`; salir de la cadena requiere cambio de padre/mayor o parche upstream |
| @next/eslint-plugin-next | 16.4.1 | Alta, transitiva, propagada A | config-next → plugin-next → fast-glob | 16.4.2 sigue fijando fast-glob 3.3.1; no resuelve A |
| eslint-config-next | 16.4.1 | Alta, **directa dev**, propagada A | Raíz dev → plugin-next | npm sugiere downgrade 14.2.35; no es una corrección compatible con el stack actual |
| postcss-selector-parser | 6.1.4 | Moderada, transitiva, aviso raíz B | Tailwind → parser; Tailwind → postcss-nested → parser | **7.1.6** corrige B; fuera de `^6.1.2` y `^6.1.1` de sus padres |
| postcss-nested | 6.2.0 | Moderada, transitiva, propagada B | Tailwind → postcss-nested → parser | npm fixAvailable=true no prueba parche 6.x: 6.2.0 es última 6; 7.0.2 acepta parser `^7.0.0`, fuera de Tailwind `^6.2.0` |
| tailwindcss | 3.4.19 | Alta, **directa dev**, propagada A y B | Raíz dev → cinco cadenas anteriores | npm propone **4.3.3**, migración mayor separada; no corrige por sí sola la otra cadena vía config-next |

**A — CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm:** agotamiento de pila por patrones de llaves profundamente anidados en braces <=3.0.3. Sin versión corregida a la fecha. Evidencia: [aviso](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) y [reporte en el repositorio upstream](https://github.com/micromatch/braces/issues/70). Para este portfolio el vector relevante es procesar patrones/archivos/configuración no confiables durante tooling, no un endpoint público que reciba esos patrones. No se ejecutaron pruebas de explotación.

**B — CVE-2026-104844 / GHSA-rj75-hqrm-r3gf:** complejidad cuadrática al parsear selectores, corregida en 7.1.6. El [aviso del mantenedor](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf) distingue explícitamente procesamiento síncrono de selectores no confiables en peticiones de uso de build sobre fuentes confiables. No se encontró una ruta pública de parsing arbitrario en este sitio estático. El hallazgo de auditoría y su deuda se mantienen.

Conclusión: no se demostró un patch dentro de los rangos actuales que elimine ninguno de los dos avisos raíz. Un override de parser 7 sería un cambio mayor transverso y requeriría autorización, validación semántica del CSS y preferiblemente soporte upstream. No agregar parser como dependencia directa para maquillar el árbol. No ejecutar audit fix: la sugerencia de downgrade Next config o migración Tailwind automática no preserva el alcance.

## 4. unrs-resolver y scripts de instalación

Cadena real: `eslint-config-next@16.4.1 → eslint-import-resolver-typescript@3.10.1 → unrs-resolver@1.11.1 → napi-postinstall@0.3.4`. Es resolución de imports para lint, no una nueva dependencia runtime del frontend.

Su postinstall real es `napi-postinstall unrs-resolver 1.11.1 check`. No existe un postinstall.js propio: ejecuta el binario de napi-postinstall. Se inspeccionaron package.json y lib/cli.js, index.js y helpers.js sin ejecutar el script.

El helper busca el binding opcional precompilado de la plataforma y comprueba coherencia de versión. Si existe, termina sin instalarlo de nuevo. Si falta, puede ejecutar un npm install secundario y, como fallback, descargar y extraer un archivo nativo desde el registro. Esta capacidad de red/escritura/proceso hijo justifica revisión específica; no es correcto aprobarlo solo porque lint lo usa. [Fuente upstream del helper](https://github.com/un-ts/napi-postinstall), [resolver](https://github.com/unrs/unrs-resolver).

Después de `npm ci --ignore-scripts`, el binding Windows x64 `@unrs/resolver-binding-win32-x64-msvc@1.11.1` está presente; cargar ResolverFactory funciona y lint/build pasan. El lockfile también registra bindings opcionales Linux. Mantener bloqueado el lifecycle no bloqueó el QA observado en Windows. Linux sin cache, otras arquitecturas y opcionales omitidas no fueron reconstruidos localmente; no prometer que el fallback nunca será necesario.

**Distinción de política importante:** el código instalado de npm 11.17.0 indica que los scripts no revisados todavía se ejecutan por defecto en su fase de allowScripts informativa. `npm config get ignore-scripts` devuelve false; no hay allowScripts versionado. Un aviso de script pendiente **no demuestra que haya sido bloqueado**. Este diagnóstico utilizó el flag explícito `--ignore-scripts`, sin aprobar scripts. La [documentación de approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts/) describe esta fase; futuras versiones cambian el comportamiento.

La consulta **solo lectura** `npm approve-scripts --allow-scripts-pending --json` identifica únicamente unrs-resolver 1.11.1 pendiente en esta plataforma. No se ejecutó el modo que aprueba. El comando que recomienda Vercel, `npm install-scripts ls`, no existe en el npm local 11.17.0 (EUNKNOWNCOMMAND); la documentación vigente de install-scripts apunta a otro estado de CLI. No instalar otro npm para hacer coincidir ese mensaje.

Recomendación: conservar `--ignore-scripts` en validaciones controladas hasta decidir una política reproducible. Antes de cualquier aprobación, verificar origen/integridad del paquete y binding, plataforma destino y necesidad real del fallback; si se autoriza, acotar a versión y script revisado, nunca a todos los paquetes. No aprobar ni cambiar CI en esta tarea. El warning de Vercel no permite determinar retrospectivamente si su instalación con cache ejecutó el postinstall.

## 5. Reproducibilidad y warnings

| Hallazgo | Causa comprobada | Acción propuesta, no implementada |
| --- | --- | --- |
| React 18 deprecado | Chequeo de versión de Next; warning también en Vercel | PR React/DOM 19 con QA; no silenciar logs |
| ESLint 9 deprecated en npm ci | Metadata npm y EOL oficial, no fallo de regla | Esperar cadena compatible con ESLint 10 o evaluar alternativa completa por separado; mantener deuda explícita |
| unrs-resolver pendiente | Lifecycle nativo sin revisión allowScripts | Política documentada y validación de bindings antes de decidir permiso |
| npm Unknown env config cache-dir en Vercel | Variable/config de entorno no reconocida por npm; no existe configuración versionada cache-dir en este repo | Identificar origen en integración/proveedor; no suprimir warning ni editar infraestructura a ciegas |
| LF→CRLF | core.autocrlf=true del Git global y `.gitattributes` con `* text=auto`; muestras Git index LF / working tree CRLF | PR acotado de política explícita LF y editorconfig; revisar diff, sin normalización masiva |
| Runtime CI no acreditado al patch | Local Node24.19/npm11.17; Vercel project nodeVersion=24.x, logs no muestran node/npm exactos | Registrar versiones efectivas en CI y elegir mecanismo soportado; packageManager por sí solo no es evidencia de ejecución exacta |
| QA no ejecutado automáticamente por build Vercel | Logs muestran npm run build, no npm run qa ni qa:motion | Gate independiente para lint/tests/auditorías, con revisión de protecciones autorizada; no cambiarlo aquí |

Lockfile v3; instalación limpia reproducible sin modificarlo. `.node-version`, packageManager y engines existen. Engines admite Node >=24.19.0 <25 y npm >=11.17.0 <12: es un rango, no un pin del runtime desplegado. No hay .npmrc, .editorconfig, workflows GitHub ni vercel.json en el árbol revisado. El origen exacto de cache-dir y versión npm del builder queda pendiente; no se le atribuye al usuario sin evidencia.

`qa` centraliza lint + build, `qa:motion` exige botón y navegador; no es un test automático desatendido. No existen format/format:check, React Doctor, Husky ni lint-staged versionados. Es deuda del tooling, no permiso para agregarlos ahora. Falta `.altasweb/standard.json` y AGENTS.md local; proyecto potencialmente legacy con excepciones Next Pages Router/Tailwind3 documentadas. No aplicar normalización manual del estándar ni migrar a Vite.

## 6. Plan de PR pequeños, sujeto a nueva autorización

No hay un advisory productivo nuevo que obligue a cambiar el orden. React y patch Next pueden validarse independientemente; ESLint10 y la eliminación completa de braces están bloqueados upstream. No condicionar un PR viable a resolver todos los bloqueos.

### PR A — React 19, compatibilidad runtime

- Objetivo: React y React DOM **19.3.1 exactos**, conservando Next16.4.1, Pages Router, Webpack y librerías actuales. Revalidar release/advisories al iniciar.
- Archivos: package.json, package-lock.json y registro técnico. Código solo si un defecto real exige una corrección mínima y se revisa su alcance.
- Riesgo: mayor de React; hidratación, refs/StrictMode y temporización/remount de animaciones. No hay bloqueo de peers identificado; no es garantía de ausencia de regresiones.
- Pruebas/aceptación: ci con scripts bloqueados, npm ls sin peers inválidos, lint/build, **47/47** controladas, EN/ES repetido, Typewriter/pausa, DotGrid, Reveal, sidebar, CTA, cuatro modales y foco, cuatro anchos, CSS/fuentes/SEO comparados y consola/hidratación limpias. Validación nativa de reduce específica pendiente debe ejecutarse/registrarse. Cero aumento de auditorías y productiva cero. Sin cambios de diseño ni nuevas excepciones.

### PR B — Patch Next y config alineada

- Objetivo: **next16.4.2 + eslint-config-next16.4.2 exactos**, mantener ESLint9 temporalmente por bloqueo documentado. No atribuirle eliminación de braces.
- Archivos: package.json, lockfile y registro; next.config.mjs solo si existe requisito real, manteniendo Webpack explícito.
- Riesgo bajo/moderado: dependencias internas, fuentes/build y plugin de lint. No cambiar React de nuevo en este PR.
- Pruebas/aceptación: ci, npm ls, QA, 47 casos, preview, SSR/404/SEO, hashes CSS/fonts con investigación de diferencias, responsive y auditorías sin aumento. Confirmar peers de toda la cadena, no solo config-next.

### PR C — ESLint y reglas, bloqueado antes de implementación

- Objetivo: salir de EOL a ESLint10.13.0 o estable revisada **cuando** react/import/jsx-a11y y config-next tengan soporte coherente. No forzar versiones actuales.
- Archivos: package.json, lockfile, eslint.config.mjs y documentación; cambios de código solo por errores confirmados de reglas, separados del cambio de soporte cuando sea viable.
- Dependencias: ESLint/config/plugins a través de padres compatibles; no duplicar plugins directamente solo para forzar resolución.
- Riesgo: API de reglas eliminada, parsing JSX/config, reducción accidental de cobertura. Bloqueo actual: peers de tres plugins excluyen10 incluso en sus últimas publicaciones.
- Aceptación: instalación sin force/legacy-peer-deps, mismo o mayor alcance de reglas, sin nuevas exclusiones, lint sin warnings/errores, QA y fixture. Registrar excepciones históricas y revisar su necesidad por separado; no quitarlas en bloque.

### PR D — Vulnerabilidades de tooling, dos decisiones independientes

- D1: buscar backport de parser >=7.1.6 soportado por Tailwind3/postcss-nested6. Hoy no existe en los rangos revisados. Archivos futuros: lockfile/manifest/documentación; no introducir dependencia directa artificial. Un override mayor requiere autorización propia y pruebas de corpus/CSS; no es patch compatible demostrado.
- D2: braces carece de parche. Seguir publicación upstream/cambio de padre que elimine la cadena en **ambos** consumidores Tailwind y plugin-next. Eliminar solo la de Tailwind no elimina las alertas de lint.
- Tailwind4.3.3 sería otra migración mayor con postcss/plugin, configuración CSS y tailwind-merge compatibles; no incluirla automáticamente en saneamiento de patches ni mezclarla con React. Requiere plan y autorización independientes.
- Riesgos: semántica de selectores/CSS generado, watch/globbing y regresiones visuales. Aceptación por PR: auditoría antes/después con paquetes realmente eliminados, sin advisories productivos, QA/fixture y comparación CSS/visual ENES en cuatro anchos. No declarar cero completo hasta acreditarlo.

### PR E — Reproducibilidad y warnings restantes

- E1: política de instalación/scripts documentada, reproducible y comprobada en Windows y Linux limpio. Archivos posibles: README, scripts package.json/.npmrc y CI/config Vercel únicamente con autorización del alcance. No dar permiso a unrs-resolver si los bindings opcionales bastan; si se necesita, justificar aprobación exacta. Riesgo: omitir binarios necesarios, o habilitar ejecución arbitraria por una aprobación amplia.
- E2: LF/editorconfig acotados. Archivos: .gitattributes, .editorconfig y documentación; no renormalizar todo. Aceptación: diff solo previsto, Git index LF y diff-check, QA si se tocan fuentes.
- E3: hacer reproducibles los gates existentes en CI y registrar Node/npm efectivos; investigar cache-dir del proveedor. Sin dependencias nuevas en el primer PR. La automatización de qa:motion requiere adaptar/documentar la intervención real; no fingir que ya es desatendida. Instalar formatter/doctor/hooks sería otro alcance revisado.
- Criterios: instalación desde clone sin cache, lock inmutable, scripts no aprobados sin ejecutar, lint/build/tests/auditorías visibles; no ocultar el fallo de seguridad completo ni activar una protección que solo pase omitiéndolo. Cambiar reglas GitHub/infra requiere autorización concreta, no forma parte de este diagnóstico.

## 7. Decisiones y pendientes reales

1. Autorizar o no PR A y PR B, cada uno con su alcance y versión revisada; no se iniciaron migraciones.
2. ESLint10 bloqueado por plugins; no resolver mediante force ni desactivar reglas. Mantener 9 EOL temporalmente documentado no equivale a aceptación permanente.
3. No hay parche braces; parser corregido fuera de rangos. Decidir después entre esperar soporte upstream o autorizar una migración mayor evaluada aparte.
4. Política efectiva de scripts y paridad CI/local requiere decisión explícita; no se aprobó ningún script. El warning advisory no acredita bloqueo.
5. Validación nativa de movimiento reducido específica de 5E, lector de pantalla real, zoom y dispositivos físicos pendientes. La corrección del observador de 5E sí está respaldada por 11 pruebas controladas y recorridos reales; no afirmar resueltos todos los posibles aspectos de navegación accesible.
6. Diagnóstico sin cambios de producto, diseño, infraestructura, dependencias ni lockfile. Este documento se prepara en PR documental independiente; **no se autoriza su merge ni otra etapa por esta entrega**.
