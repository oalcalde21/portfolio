# Etapa 6A — Auditoría de seguridad y plan de remediación

Fecha: **18 de octubre de 2026**, America/Montevideo. Repositorio: `oalcalde21/portfolio`. Baseline inspeccionado: `db0388c8a05c0fb585ac6aa53b9789bd1a25aa53`, posterior al merge del PR #15. Este informe es diagnóstico: no implementa 6B, no acepta permanentemente riesgos ni declara seguro todo el proyecto.

## 1. Resultado ejecutivo

- Instalación limpia con lifecycle deshabilitado, lint y build correctos. Las **47/47 pruebas controladas** existentes pasan.
- Auditoría completa: **FAIL, exit 1**, nueve nombres de paquetes afectados: siete altos, dos moderados, cero críticos. Son **dos advisories raíz**, no nueve CVE. Hay diez ubicaciones afectadas porque fast-glob está instalado dos veces.
- Auditoría `--omit=dev`: **PASS, exit 0, cero afectados**. Las diez ubicaciones afectadas tienen `dev: true` en el lockfile. Se usan para lint, generación de CSS y watch; no se identificó una ruta pública que procese patrones o selectores arbitrarios.
- No existe hoy un parche dentro de los rangos instalados que elimine esos dos avisos: braces no tiene versión corregida; el parser corregido es 7.1.6, fuera de los rangos 6.x de sus dos padres.
- Un override mayor del parser es una **alternativa de investigación**, no una solución cuya compatibilidad esté acreditada. Tailwind 4 y ESLint 10 requieren decisiones y PR separados.
- React Doctor conserva su baseline documental de un error y 16 advertencias. Sus diagnósticos no son la causa de estos dos advisories.

## 2. Estado real y reproducibilidad

Se comprobó `main` limpio antes de trabajar, se ejecutó `git fetch origin` y ambos refs coincidieron en el SHA indicado. Remoto SSH: `git@github.com:oalcalde21/portfolio.git`. Un único worktree. La lista de tareas de la aplicación no mostraba otra tarea activa sobre este repositorio; la otra tarea activa correspondía a otro proyecto. Esto no constituye un bloqueo del sistema de archivos, por lo que se repitió la inspección de Git durante el trabajo. No aparecieron cambios ajenos. Rama creada desde ese main: `docs/portfolio-security-audit`.

Se revisaron manifest, lockfile, README, configuración Next/ESLint/PostCSS/Tailwind, informes técnicos previos, fuentes y fixture de movimiento. No existen AGENTS.md local, `.npmrc` del proyecto ni marker `.altasweb/standard.json`. Se conserva la excepción existente Next/Pages Router/Tailwind 3; no se aplica una normalización manual del estándar.

| Componente | Declarado / realmente instalado | Compatibilidad y decisión |
| --- | --- | --- |
| Node / npm | `.node-version` 24.19.0 / `packageManager` npm@11.17.0; ambos verificados con FNM | Engines del proyecto `>=24.19.0 <25` y `>=11.17.0 <12`. Se usaron las versiones exactas |
| Next / eslint-config-next / plugin Next | 16.4.2 exactos | Next requiere Node >=20.9 y admite React/DOM ^19.0.0; sin bloqueo con este runtime |
| React / React DOM | 19.3.1 exactos | DOM y React alineados; sin cambios |
| ESLint | 9.39.5 exacto | Config-next exige >=9; los plugins instalados admiten 9. Línea EOL, warning previo |
| Tailwind | rango ^3.4.1; lock e instalación 3.4.19 | Última 3.x estable y tag v3-lts consultados: 3.4.19; no hay backport posterior disponible |
| PostCSS raíz | ^8.5.29 / 8.5.29 | Registro publica 8.5.30. No hay advisory de este paquete en los JSON actuales |
| PostCSS interno de Next | 8.5.23 | Distinto de la raíz; no afectado por estos avisos. No forzar su resolución |
| Framer Motion / Anime.js | 11.18.2 / 3.2.2 | Conservados; sin hallazgos en ambas auditorías |
| tailwind-merge | 2.6.1 | Conservar con Tailwind 3; evaluar 3.7.0 solo junto a una eventual migración a Tailwind 4 |

Otros directos verificados por `npm ls --depth=0`: @vercel/analytics 2.0.1 y react-icons 5.6.0. `npm ls --all --json` terminó con exit 0, sin peers inválidos ni extraneous. Las versiones candidatas son una foto del registro, no permiso para instalar sus tags.

Scripts disponibles: `dev` y `build` usan Webpack explícito; `start` ejecuta Next; `lint` ejecuta `eslint .`; `qa` ejecuta lint y build; `qa:motion` sirve un fixture interactivo. No hay scripts audit:prod, doctor, format ni format:check. **QA no incluye la auditoría de seguridad**: un QA verde no convierte el gate completo de seguridad en PASS.

SHA-256 de archivos preservados, idénticos antes/después de `npm ci --ignore-scripts` y al revisar el diff:

```text
package.json      F60EED37D971A783CFBB1081706F914B2FD2BA3A22EE4C7D0ED4B3815A107F9C
package-lock.json 0DA8619349D5BB0E58E1A52E13DAC6A0204CD0A49D72A884F87539504B7C44F0
```

## 3. Advisories raíz y exposición

| ID / paquete | Severidad y rango vulnerable | Corrección publicada | Exposición de este proyecto / clasificación |
| --- | --- | --- | --- |
| A: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), CVE-2026-93687, braces | Alta; <=3.0.3; instalado 3.0.3. npm informa CVSS 3.1 7.5; GitHub muestra CVSS 4.0 8.7. Se conservan las métricas de sus respectivas fuentes | Ninguna; registro y aviso siguen sin versión corregida | **Versión vulnerable confirmada, tooling, sin parche viable dentro de rangos.** Patrones profundamente anidados pueden agotar la pila. No se demostró explotación ni entrada pública alcanzable en el portfolio |
| B: [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), CVE-2026-104844, postcss-selector-parser | Moderada; <7.1.6; instalado 6.1.4; CVSS 3.1 5.9 | 7.1.6. Tag legacy-v6 sigue en 6.1.4 | **Versión vulnerable confirmada, tooling; solución disponible con major respecto del árbol actual.** Parsing de selectores no confiables puede consumir CPU. No se encontró esa entrada en runtime |

Las versiones se contrastaron con node_modules, `npm ls`, `npm explain` y lockfile. Los restantes siete nombres son metavulnerabilidades propagadas por sus dependencias, no siete vulnerabilidades independientes.

El aviso B distingue entre procesar selectores no confiables durante una petición y compilar fuentes confiables durante el build. Aquí el segundo caso describe el uso observado. La vulnerabilidad de versión sigue registrada; afirmar que existe una vía remota pública sería un **posible falso positivo de exposición**, no razón para borrar el hallazgo del inventario. En A tampoco se constató un atacante enviando patrones al tooling. Builds de contribuciones no confiables cambian esas precondiciones y deben tratarse como ejecución de código no confiable.

### Evidencia de alcance productivo

1. Los diez registros auditados del lockfile están marcados `dev: true`; solo dos padres directos los introducen: eslint-config-next y tailwindcss, ambos devDependencies.
2. `npm explain` muestra enlaces intermedios `type: prod`, porque son dependencies de cada padre. **Eso no los convierte en dependencias productivas del portfolio**: sus caminos terminan en padres raíz de desarrollo.
3. El código de aplicación no importa los nueve paquetes. PostCSS carga Tailwind desde postcss.config.mjs; el plugin Next de lint carga fast-glob en `dist/utils/get-root-dirs.js`. Tailwind usa fast-glob/micromatch en `lib/lib/content.js`, el parser en utilidades de selectores y postcss-nested en su pipeline. Su CLI incluye el watcher chokidar.
4. `src/pages` contiene _app, _document e index, sin API, getServerSideProps ni servicio que acepte CSS/patrones del usuario. El build genera `/` y `/404` estáticos. El manifest de páginas confirma index.html y 404.html.
5. Se inspeccionaron los **seis archivos *.nft.json** producidos por este build; no referencian las diez ubicaciones vulnerables. `npm audit --omit=dev` informa cero hallazgos.

Conclusión: **sin evidencia de que estas copias vulnerables lleguen al bundle del cliente o a las trazas del runtime de este build**; sí participan en herramientas que pueden ejecutarse durante CI/build, incluso al preparar producción. CSS generado no equivale a enviar su compilador al navegador. La inspección de imports y trazas no es un SBOM exhaustivo de código vendorizado/minificado ni una verificación del sistema de archivos de Vercel. Cero en omit=dev no garantiza ausencia universal de vulnerabilidades o de riesgos de suministro.

## 4. Nueve paquetes y fixAvailable real

Para todos los renglones: exposición observada **tooling**, llegada al bundle/runtime **no evidenciada**, conforme a la sección anterior. Severidad es la salida real de npm, incluso en padres propagados.

| Paquete / versión | Directa o transitiva; vía | Severidad | `fixAvailable` exacto de npm | Evaluación de corrección |
| --- | --- | --- | --- | --- |
| braces 3.0.3 | Transitiva; A | Alta | tailwindcss@4.3.3, isSemVerMajor=true | No hay versión parcheada de braces. La propuesta cambia un padre, no prueba corregir todas las rutas |
| micromatch 4.0.8 | Transitiva; braces | Alta | tailwindcss@4.3.3, major=true | Última publicada 4.0.8 conserva braces ^3.0.3. Sin patch compatible que retire A |
| fast-glob 3.3.3 y 3.3.1 | Transitiva; micromatch | Alta | eslint-config-next@14.2.35, major=true | 3.3.1 usa micromatch ^4.0.4; 3.3.3 usa ^4.0.8. Ambas resuelven 4.0.8. Unificar a 3.3.3 no elimina A |
| chokidar 3.6.0 | Transitiva; braces | Alta | tailwindcss@4.3.3, major=true | Su padre fija ^3.6.0; reemplazar por 4+ sale de rango y cambia soporte de globs |
| @next/eslint-plugin-next 16.4.2 | Transitiva; fast-glob | Alta | eslint-config-next@14.2.35, major=true | Fija fast-glob 3.3.1 exacto. Sin release estable posterior de config-next consultada que elimine esta ruta |
| eslint-config-next 16.4.2 | **Directa dev**; plugin-next | Alta | eslint-config-next@14.2.35, major=true | Downgrade mayor sugerido por npm; no es un patch compatible para el stack 16 |
| postcss-selector-parser 6.1.4 | Transitiva; B | Moderada | tailwindcss@4.3.3, major=true | 7.1.6 parcheado, fuera de ^6.1.2 y ^6.1.1 de sus padres |
| postcss-nested 6.2.0 | Transitiva; parser | Moderada | **true** | No identifica versión ni garantiza patch en rango. 6.2.0 sigue siendo última 6.x; 7.0.2 permite parser ^7.0.0, fuera de Tailwind ^6.2.0 |
| tailwindcss 3.4.19 | **Directa dev**; chokidar, fast-glob, micromatch, nested, parser | Alta | tailwindcss@4.3.3, major=true | Migración mayor disponible; no corrige por sí sola la ruta de lint vía config-next |

No confundir `fixAvailable=true` con una actualización segura aplicable, ni `isSemVerMajor` con el tamaño de un parche de la hoja. El downgrade de config-next y la migración Tailwind son propuestas automáticas del resolvedor; no fueron ejecutadas ni validadas aquí.

### Cadenas completas desde la raíz

Las flechas indican el rango declarado por el padre. Todas están confirmadas por explain y lock; comparten hojas deduplicadas:

```text
portfolio [dev: eslint-config-next 16.4.2]
  → @next/eslint-plugin-next 16.4.2 (exacto)
  → fast-glob 3.3.1 (exacto)
  → micromatch 4.0.8 (^4.0.4)
  → braces 3.0.3 (^3.0.3)                                      [A1]

portfolio [dev: tailwindcss ^3.4.1 → 3.4.19]
  → fast-glob 3.3.3 (^3.3.2)
  → micromatch 4.0.8 (^4.0.8)
  → braces 3.0.3 (^3.0.3)                                      [A2]

portfolio → tailwindcss 3.4.19 [dev]
  → micromatch 4.0.8 (^4.0.8)
  → braces 3.0.3 (^3.0.3)                                      [A3]

portfolio → tailwindcss 3.4.19 [dev]
  → chokidar 3.6.0 (^3.6.0)
  → braces 3.0.3 (~3.0.2)                                      [A4]

portfolio → tailwindcss 3.4.19 [dev]
  → postcss-selector-parser 6.1.4 (^6.1.2)                      [B1]

portfolio → tailwindcss 3.4.19 [dev]
  → postcss-nested 6.2.0 (^6.2.0)
  → postcss-selector-parser 6.1.4 (^6.1.1)                      [B2]
```

Ubicaciones exactas (prefijo `node_modules/`): `braces`, `micromatch`, `fast-glob`, `tailwindcss/node_modules/chokidar`, `@next/eslint-plugin-next`, `@next/eslint-plugin-next/node_modules/fast-glob`, `eslint-config-next`, `postcss-selector-parser`, `postcss-nested`, `tailwindcss`. No aparecieron otros advisories en la auditoría completa de esta fecha.

## 5. Remediaciones investigadas, viables y descartadas

| Alternativa | Evidencia / compatibilidad | Decisión |
| --- | --- | --- |
| Patch normal de braces o padres actuales | braces 3.0.3, micromatch 4.0.8 y fast-glob 3.3.3 siguen como últimas estables consultadas; config-next 16.4.2 conserva pin | **Bloqueada upstream**. Revalidar antes de un futuro PR; no inventar versión ni prometer cero |
| Backport parser 6.x o nested 6.x | Tags/listas: parser legacy-v6 6.1.4; nested última 6.x 6.2.0 | **No disponible hoy**. Es la ruta preferida si se publica y conserva APIs |
| Override acotado de parser a **7.1.6 exacto** para Tailwind y nested | Node/PostCSS no son impedimento. Sale de ambos rangos. La [release 7.0.0](https://github.com/postcss/postcss-selector-parser/releases/tag/v7.0.0) cambia semántica de inserciones durante iteración; Tailwind usa recorridos y mutaciones del AST, además de un import interno `dist/util/unesc` | **Compatibilidad no acreditada; no recomendar integrar todavía.** Solo ensayo aislado autorizado, corpus de selectores y comparación CSS/visual. No override global ni dependencia directa artificial |
| Reemplazar nested por 7.0.2 o 9.0.0 | 7.0.2 acepta parser ^7.0.0, pero no garantiza mínimo corregido sin revisar lock. 9.0.0 exige ^7.1.6 y Node ^22 / ^24 / >=26. Ambas salen del rango Tailwind ^6.2.0; 7 también cambia manejo de comentarios | No resuelve por sí solo B1 (parser directo de Tailwind). No aplicar como supuesto patch ni agregar otro plugin paralelo |
| Override chokidar 4.0.3, picomatch en lugar de braces/micromatch, o glob alternativo | Chokidar 4 elimina soporte de globs; consumidores actuales usan su API. Picomatch y fast-glob no ofrecen equivalencia contractual automática de expansión/descubrimiento | **Descartada sustitución ciega**. Cambio del padre upstream o fork mantenido sería otra decisión; no parche local de node_modules |
| PostCSS raíz 8.5.29 → 8.5.30 | Patch publicado; satisface rangos existentes, pero parser es otro paquete y ambas cadenas permanecen | No priorizar como corrección de estos CVE. Eventual mantenimiento independiente, sin atribuirle reducción de alertas |
| Tailwind **4.3.3** + @tailwindcss/postcss **4.3.3** + tailwind-merge **3.7.0** | Registro confirma paquetes. El plugin PostCSS requiere PostCSS ^8.5.16, compatible con raíz 8.5.29; oxide requiere Node >=20 y usa bindings opcionales. No hay peer que obligue a cambiar React, Next o ESLint | **Migración mayor separada**, técnicamente investigable, no implementada ni aprobada. CSS-first, utilities/preflight, detección de fuentes, merging y bindings requieren QA propio; no prometer cero por la ruta A1 restante |
| eslint-config-next 14.2.35 o ESLint 10 para retirar A1 | Downgrade de config desalinearía reglas/flat config con Next16; cambiar solo ESLint no elimina fast-glob del plugin | **Descartado como remedio directo**. No quitar reglas ni el plugin para ocultar audit |
| Actualizar ESLint a **10.13.0** | Node 24 cumple; config-next declara >=9, pero react 7.37.5, import 2.32.0 y jsx-a11y 6.10.2 solo declaran hasta ESLint 9. Son sus últimas versiones consultadas. Hooks 7.1.1 sí admite10 | **Bloqueo real de peers**. Mayor aparte cuando exista cadena compatible, sin force/legacy-peer-deps |
| Postergación temporal | No se observó entrada pública explotable; fuentes/config son versionadas, scripts de instalación deshabilitados en esta reconstrucción | Justificada mientras se evalúa una solución, **sin aceptación permanente**, supresiones ni gate verde. Revalidar antes de cada integración y ante publicación de parches o cambios de entrada |

Fuentes adicionales: [guía oficial Tailwind v3→v4](https://tailwindcss.com/docs/upgrade-guide), [compatibilidad de tailwind-merge](https://github.com/dcastil/tailwind-merge), [cambios de Chokidar](https://github.com/paulmillr/chokidar#upgrading), [overrides de npm](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides), [postcss-nested 7](https://github.com/postcss/postcss-nested/releases/tag/7.0.0). Tailwind 4 requiere Safari16.4+, Chrome111+ y Firefox128+; confirmar alcance de navegadores antes de autorizarlo. Se mantiene Pages Router/Webpack; no hay justificación de seguridad para migrar a Vite/App Router.

## 6. React Doctor, warnings y scripts pendientes

Se revisó el JSON **conservado** de React Doctor 0.9.18 de la etapa Next16.4.2 y las fuentes actuales; **no se ejecutó un nuevo escaneo de Doctor** ni se instaló la herramienta en el proyecto. Código de producto y dependencias son los del baseline documentado. Referencias: [migración React 19](react19-migration-2026-10.md), [patch Next](next1642-update-2026-10.md).

| Diagnóstico conocido | Cantidad | Relación con A/B |
| --- | --- | --- |
| Acceso a document en ProjectModal:138 | 1 error | Ninguna cadena de dependencias vulnerable involucrada. Existe retorno previo cuando isOpen=false en SSR actual. Es deuda de robustez/calidad, no arreglo de braces/parser |
| use-lazy-motion | 7 warnings | Recomendación de bundle; independiente |
| Semántica/teclado de DotGrid | 2 warnings | Accesibilidad de interacción decorativa; independiente |
| transition-all de Project | 1 warning | CSS; independiente |
| Updater de estado en Typewriter | 1 warning | Calidad de estado/cierre; independiente |
| Valor construido del contexto | 1 warning | Estabilidad de renders; independiente |
| unsafe-json-in-html en JSON-LD | 4 warnings | Potencial superficie distinta si se introdujeran datos arbitrarios. Objetos actuales literales versionados; no se confirmó XSS. Revisar serializer en PR separado, no atribuirlo a A/B |

Doctor continúa como **FAIL histórico, un error y 16 advertencias**, no PASS por baseline. No se debe mezclar su refactor con remediación de dependencias sin una relación causal demostrada.

La instalación emitió el warning deprecado de ESLint 9.39.5. La [política oficial](https://eslint.org/version-support/) confirma EOL desde 2026-08-06; no procede de un error de lint. Lint y build de esta etapa no emitieron warnings nuevos. Los warnings de desarrollo históricos motion(), viewport en _document y HMR no se volvieron a medir aquí; no se declaran resueltos.

La consulta **solo lectura** `npm approve-scripts --allow-scripts-pending --json` sigue identificando unrs-resolver@1.11.1 pendiente. Cadena: config-next 16.4.2 → eslint-import-resolver-typescript 3.10.1 → unrs-resolver 1.11.1 → napi-postinstall 0.3.4. Su lifecycle es `napi-postinstall unrs-resolver 1.11.1 check`; puede necesitar fallback de red/instalación de binding, según diagnóstico previo. No aparece en los advisories A/B ni se aprobó su ejecución. `--ignore-scripts` es la garantía usada: el aviso allowScripts no acredita bloqueo automático. Lint/build pasan en Windows con los opcionales instalados; Linux limpio y otras arquitecturas no se reconstruyeron.

Git tiene core.autocrlf=true y `.gitattributes` con `* text=auto`. Puede advertir LF→CRLF al agregar este Markdown. No se normalizaron otros archivos ni se alteró configuración para silenciar avisos.

## 7. Plan de PR pequeños, aceptación y rollback

Todos requieren nueva autorización de implementación, versiones exactas revisadas al iniciar, branch desde main actualizado, sin despliegue manual ni force push. No combinar rutas alternativas para aparentar un parche pequeño.

### 6B recomendada — Acreditar o rechazar el override acotado del parser

**Objetivo:** evaluar en copia aislada parser 7.1.6 para los dos consumidores B1/B2, preservando Tailwind 3. Es la menor intervención candidata con parche publicado, pero hoy **no es una actualización compatible certificada**. Primera decisión: autorizar expresamente este ensayo de override mayor. Si se prefiere no mantenerlo, pasar a la evaluación separada de Tailwind 4, sin sustituirlo silenciosamente.

- Archivos previstos si el ensayo demuestra seguridad técnica: package.json (override acotado a esos padres), package-lock.json, pruebas de corpus y documento de decisión. Sin agregar parser directo, sin tocar React/Next/ESLint ni componentes para acomodar fallos. El ensayo puede concluir solo con informe y sin PR de dependencias.
- Comandos futuros: resolución controlada con npm `install --package-lock-only --ignore-scripts --no-audit`, después `npm ci --ignore-scripts`, `npm ls postcss-selector-parser postcss-nested tailwindcss`, ambas auditorías, QA y fixture interactivo. Nunca audit fix.
- Pruebas: suite upstream de selectores con versión fijada, corpus real extraído de CSS/variantes, nesting/escapes/pseudo-elementos/arbitrary variants, corpus adversarial acotado en proceso aislado con timeout; comparar AST/salida y SHA-256 de CSS. Validar watch/rebuild y UI EN/ES en cuatro anchos, foco, controles y movimiento. Un hash distinto debe explicarse y revisarse, no ignorarse.
- Riesgos: cambio mayor de iteraciones/mutaciones del AST e import interno usado por Tailwind; una compilación exitosa sola no los descarta.
- Aceptación: resolver B1 y B2 a 7.1.6, peers válidos, sin diferencias CSS inexplicadas ni regresiones, cero productivas/nuevos advisories y reducción realmente medida. Con el inventario actual podría pasar de 9 a 7 nombres (retirando parser/nested), **no es resultado medido ni promesa de cero**. Registrar y mantener A.
- Rollback: no publicar el ensayo si falla; si se integrara posteriormente, revertir su commit mediante PR y reconstruir con el lock anterior. No editar node_modules ni reescribir historia.

### PR independiente — Retirar la cadena A1 de lint, cuando haya soporte upstream

- Objetivo: config-next/plugin Next con padre que retire braces o parche upstream publicado y consumible por rangos reales. **Bloqueado hoy**, sin versión candidata corregida acreditada.
- Archivos: manifest/lock y evidencia; config de lint solo si la release lo exige y se autoriza. Conservar cobertura de reglas.
- Comandos/pruebas: inspeccionar metadata y changelog exactos; resolución sin scripts; npm ls/explain, lint con mismos archivos/reglas, QA, ambas auditorías, fixture si cambia config/Next. Verificar compatibilidad de Next/config antes de actualizar alguno.
- Riesgo: nueva configuración, reglas o APIs; no reemplazar glob por intuición. Aceptación: A1 ausente o parcheada, sin downgrade de reglas ni peers inválidos, producción cero y auditoría completa con la reducción demostrada.
- Rollback: revert del PR con lock anterior y QA. Es independiente de retirar las rutas de Tailwind; completar solo uno deja la otra cadena.

### PR mayor separado — Tailwind 4, alternativa al override o salida sostenida de las rutas A2–A4/B

- Objetivo: evaluar Tailwind 4.3.3 + @tailwindcss/postcss4.3.3 + tailwind-merge 3.7.0; conservar PostCSS 8.5.29 salvo necesidad comprobada y el stack Next16/React 19/ESLint 9. No conservar un override obsoleto si el padre ya no lo usa.
- Archivos previstos: manifest/lock, postcss.config.mjs, globals.css, tailwind.config.js si procede, ajustes de utilities estrictamente requeridos y documentación. No migrar generador ni arquitectura.
- Comandos/pruebas: instalación/resolución sin scripts, QA/fixture, npm ls, auditorías, build y watch en Windows/Linux; revisar bindings opcionales antes de cualquier permiso; comparación CSS y capturas EN/ES 320/390/768/1440, contraste durante DotGrid, hover/focus/reduce, modales, fuentes y metadatos.
- Riesgos: preflight/utilities, orden/especificidad, merging, navegadores mínimos y binarios. No llamar patch a esta migración ni usar codemod con @latest.
- Aceptación: preservación visual/funcional, todas las rutas Tailwind afectadas retiradas o corregidas, cero nuevas/productivas. Con el árbol actual A1 puede mantener cinco nombres altos; **proyección**, no auditoría del candidato instalado.
- Rollback: revert del PR completo de CSS/manifest/lock, npm ci seguro y QA. Requiere autorización propia de migración mayor.

### PR mayor independiente — ESLint 10 cuando los peers lo permitan

- Objetivo: salir de EOL; no se presenta como corrección de A/B. Candidata registrada10.13.0, **bloqueada por tres plugins**. No iniciar mientras ese bloqueo persista.
- Archivos: manifest/lock, eslint.config.mjs solo si la migración lo requiere, documentación. Scripts y excepciones no deben ocultar hallazgos nuevos.
- Pruebas/comandos: matriz de peers/APIs y guía oficial, npm ls, instalación sin scripts, lint diferencial del mismo corpus, QA/fixture y auditorías.
- Aceptación: soporte declarado y efectivo de todos los plugins, cero suppressions nuevas ni degradación de cobertura. Rollback: revert de manifest/lock/config y QA.

### PR independiente de reproducibilidad; calidad aparte

- Reproducibilidad: documentar/aplicar política explícita de scripts y auditar también en Linux limpio. Posibles archivos README, scripts de package.json y CI si se autoriza; no es permiso para tocar infraestructura ahora. Comandos: ci --ignore-scripts, consulta de pendientes, carga de binding, lint/build/fixture/auditorías. Aceptación: opcionales y QA operativos sin aprobaciones amplias, fallos visibles. Rollback: revert de política/scripts, sin aprobar unrs por defecto. No atribuirle reducción de los nueve afectados.
- React Doctor: un PR propio por defecto real confirmado (por ejemplo robustez SSR del portal o serialización), con tests causales y baseline comparable. Archivos limitados al defecto y sus pruebas, sin cambios de dependencias de seguridad. No condicionar el saneamiento A/B a un refactor de los 17 diagnósticos.

Orden recomendado: ensayo 6B del parser → corrección pequeña solo si se acredita; cadena lint upstream en cuanto exista solución; Tailwind 4 como migración propia si no hay backport/override sostenible. El trabajo de reproducibilidad puede revisarse independientemente; ESLint 10 sigue bloqueado y Doctor es otra línea de calidad. Si aparece un advisory productivo, reordenar por exposición real antes de seguir este plan.

## 8. QA ejecutado, evidencia y límites

Todos los comandos npm se ejecutaron con `fnm exec --using 24.19.0 npm.cmd ...`, npm11.17.0. Se esperó la finalización de ci antes de ejecutar npm ls o QA.

| Comando / comprobación | Resultado real |
| --- | --- |
| git fetch / rev-parse / status / worktree list | Main actualizado y limpio; branch documental desde db0388c |
| npm ci --ignore-scripts | **PASS, exit 0**; 385 paquetes instalados, 386 auditados; aviso ESLint EOL y nueve vulnerabilidades visibles; lifecycle no ejecutado |
| npm ls --all --json / --depth=0 / árbol afectado | **PASS, exit 0**, coherente con lock/explain |
| npm explain braces --json y npm explain postcss-selector-parser --json | **PASS**; seis rutas descritas, hojas deduplicadas |
| npm run qa | **PASS, exit 0**; ESLint CLI y build Next16.4.2 / Webpack, sin nuevos warnings |
| npm run qa:motion + navegador y botón Run controlled tests en 3113 | **PASS, exit 0, 47/47**; simulated=true,nativeReduce=false; hydrationErrors=[], pendingTimers=0, listeners=0. Consola del fixture sin warnings/errores capturados |
| npm audit --json | **FAIL, exit 1**;9 afectados,7 altos / 2 moderados, dos advisories raíz |
| npm audit --omit=dev --json | **PASS, exit 0**,0 afectados |
| npm approve-scripts --allow-scripts-pending --json | Consulta de solo lectura: unrs-resolver 1.11.1 pendiente; no aprobación |
| Consultas npm view / registro y fuentes oficiales | Solo lectura; versiones y peers comprobados; ningún candidato instalado |
| Comparación hashes manifest/lock y diff frente a main | Sin modificaciones de esos archivos, fuentes ni configuración |
| git diff --check y revisión staged antes de commit | Sin errores de whitespace; alcance limitado a este informe |

Evidencia local fuera del repositorio: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-security-6a/`: ci.log, qa.log, motion.log, motion-results.json, captura del fixture, audit-full.json, audit-prod.json, npm-ls-all.json, explain-braces.json, explain-parser.json, lock-affected.json, registry-*.json, hashes-before/after.json y runtime-trace-hits.json (array vacío). Estos archivos son evidencia de sesión, no requisito portable para reproducir el diagnóstico; las tablas y comandos anteriores preservan sus resultados esenciales versionados.

Limitaciones y controles de interpretación:

- No se instalaron variantes candidatas ni se probó su compatibilidad efectiva. Las alternativas del plan no son resultados de QA de una implementación.
- La comprobación de trazas se limita al build Windows actual y paquetes rastreados por Next. No se inspeccionaron bins de Vercel, un CI Linux nuevo ni componentes vendorizados exhaustivamente.
- No se ejecutaron exploits, profiling adversarial ni benchmarks de los CVE. Se confirma el rango vulnerable y su ruta, no una explotación del sitio.
- Las 47 pruebas usan preferencias y geometría controladas. No se declara emulación nativa de reduce, lector de pantalla, zoom nativo, dispositivos físicos ni una nueva auditoría visual completa del portfolio. La tarea solo cambia Markdown.
- React Doctor se revisó como evidencia histórica y mediante fuentes; no se declara una ejecución nueva ni un gate verde.
- Un primer intento de consulta HTTP usó erróneamente sintaxis paquete@versión como path y devolvió404; se corrigió a /paquete/versión y se obtuvieron los metadatos descritos. No indica ausencia de esas versiones. La ausencia de hits de traza se volvió a registrar como array vacío explícito.
- Fecha de registro npm y advisories importa: antes de implementar hay que repetir ambas auditorías y verificar releases/peers. No usar las cifras de este informe como excepción permanente.

## 9. Decisiones pendientes y alcance del PR documental

La recomendación concreta para **6B** es autorizar una evaluación aislada y acotada de parser 7.1.6, con criterio de rechazo si cambia CSS o rompe contratos internos. **No autorizar todavía su integración como override seguro**. Si no se desea mantener un override mayor, decidir explícitamente una migración separada Tailwind 4 o esperar backport; hoy no existe una actualización compatible de rango acreditada que elimine estos dos avisos.

Bloqueos reales: falta de parche braces, pin de fast-glob en plugin Next, rangos6.x de ambos consumidores del parser, tres plugins sin peer ESLint 10. Decisiones adicionales: soporte mínimo de navegadores para Tailwind 4 y política de scripts/bindings en CI. La condición vulnerable se conserva documentada mientras se resuelven, sin bajar severidades ni desactivar controles.

Este PR modifica únicamente `docs/security-remediation-2026-10.md`. No actualiza dependencias, lockfile, aplicación o configuración. No hace merge ni despliegue manual y no inicia 6B. La creación de un preview automático por GitHub/Vercel no constituye aprobación para producción.
