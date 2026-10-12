# Etapa 3: parches de seguridad compatibles

Validación del 12 de octubre de 2026, desde `main` en `e7cc272`, limpio y sincronizado con origin. Runtime: Node 24.19.0 y npm 11.17.0. Rama: `fix/portfolio-compatible-security-patches`.

## Alcance y resolución

Se actualizó únicamente PostCSS entre las dependencias directas. npm resolvió las transitivas dentro de los rangos existentes, sin overrides ni dependencias directas artificiales. Se utilizaron `npm install --save-dev postcss@8.5.29 --package-lock-only --ignore-scripts` y `npm update nanoid source-map-js picomatch minimatch brace-expansion js-yaml postcss-selector-parser --package-lock-only --ignore-scripts --no-audit`.

| Paquete | Antes | Después | Rango del consumidor |
| --- | --- | --- | --- |
| PostCSS raíz | 8.5.8 | 8.5.29 | raíz ^8 → ^8.5.29; Tailwind ^8.4.47 |
| nanoid | 3.3.11 | 3.3.20 | Next/PostCSS interno ^3.3.6; PostCSS nuevo ^3.3.19 |
| source-map-js | 1.2.1 | 1.2.2 | PostCSS interno ^1.0.2; PostCSS nuevo ^1.2.2 |
| picomatch | 2.3.1 / 4.0.3 | 2.3.2 / 4.0.7 | micromatch ^2.3.1; tinyglobby ^4.0.3 |
| brace-expansion | 1.1.12 / 2.0.2 | 1.1.21 / 2.1.7 | minimatch ^1.1.7 / ^2.0.1 / ^2.0.2 |
| js-yaml | 4.1.1 | 4.3.2 | ESLint/eslintrc ^4.1.0 |
| postcss-selector-parser | 6.1.2 | 6.1.4 | Tailwind ^6.1.2; postcss-nested ^6.1.1 |

Son siete nombres de paquetes y diez registros de versiones actualizados (brace-expansion tiene dos copias de major 2). Los 410 registros del lockfile se mantienen: ninguno agregado ni eliminado. npm también corrigió la clasificación `devOptional` a `dev` de is-glob e is-extglob, sin cambiar sus versiones, e incorporó metadatos de funding de js-yaml. `npm ci` conservó el lockfile sincronizado.

Next y eslint-config-next siguen en 14.2.1; React/React DOM en 18.3.1; Tailwind en 3.4.19. No cambian aplicación, estilos, contenido, imágenes, configuración de Next/Tailwind/PostCSS ni infraestructura.

## Baseline y auditorías

Los recuentos son paquetes afectados, incluyendo propagación transitiva; no son el número de avisos ni una prueba de explotabilidad.

| Auditoría | Antes | Después | Resultado |
| --- | --- | --- | --- |
| Completa | 20: 1 moderado, 18 altos, 1 crítico | 16: 2 moderados, 13 altos, 1 crítico | exit 1 |
| Sin desarrollo | 4: 3 altos, 1 crítico | 2: 1 alto, 1 crítico | exit 1 |
| Solo en el árbol completo | 16 | 14 | Deuda de desarrollo/build |

Dejan de figurar brace-expansion, js-yaml, nanoid, picomatch y source-map-js. PostCSS raíz queda corregido, pero el nombre PostCSS permanece por la copia interna de Next. Postcss-nested ahora figura por propagación del aviso moderado del parser que ya existía en 6.1.2; no se introdujo ese defecto. El recuento moderado aumenta de uno a dos mientras el total y los altos disminuyen; no aparecen altas o críticas nuevas.

Baseline completo: @next/eslint-plugin-next, @typescript-eslint/parser, @typescript-eslint/typescript-estree, brace-expansion, braces, chokidar, eslint-config-next, fast-glob, glob, globby, js-yaml, micromatch, minimatch, nanoid, next, picomatch, postcss, postcss-selector-parser, source-map-js y tailwindcss. Baseline sin desarrollo: next, postcss, nanoid y source-map-js.

### Riesgos residuales individuales

| Paquete | Severidad | Exposición/origen | Bloqueo |
| --- | --- | --- | --- |
| next | Crítica | Dependencia productiva; múltiples avisos de RCE, DoS, SSRF, bypass y caché | Actualización de Next requiere otra etapa |
| postcss 8.4.31 | Alta | Árbol productivo de Next; procesamiento CSS/mapas durante build | Next fija exactamente 8.4.31 |
| @next/eslint-plugin-next | Alta | Desarrollo, vía glob | Plugin ligado a Next 14.2.1 |
| eslint-config-next | Alta | Desarrollo, vía plugin | Actualizar con Next |
| glob 10.3.10 | Alta | Desarrollo; inyección en CLI -c/--cmd | Plugin fija 10.3.10; corregido desde 10.5.0 |
| @typescript-eslint/parser | Alta | Desarrollo, vía typescript-estree | Actualizar cadena de tooling de Next |
| @typescript-eslint/typescript-estree | Alta | Desarrollo, vía globby y minimatch | Fija minimatch 9.0.3 |
| minimatch 9.0.3 | Alta | Desarrollo; ReDoS | Se requiere al menos 9.0.7, fuera del pin exacto |
| braces 3.0.3 | Alta | Desarrollo/build; agotamiento de stack | Sin versión corregida publicada |
| micromatch | Alta | Desarrollo/build, vía braces | Depende del parche de braces o revisión del consumidor |
| fast-glob | Alta | Desarrollo/build, vía micromatch | Misma cadena de braces |
| globby | Alta | Desarrollo, vía fast-glob | Misma cadena de braces |
| chokidar | Alta | Desarrollo/build de Tailwind, vía braces | Misma cadena de braces |
| postcss-selector-parser 6.1.4 | Moderada | Desarrollo/build; complejidad cuadrática en selectores | Fix completo 7.1.6, fuera de ^6 |
| postcss-nested | Moderada | Desarrollo/build, vía parser | Consumidor del parser ^6 |
| tailwindcss | Alta | Desarrollo/build; propagación de cadenas anteriores | Revisión separada; no migrar a v4 en esta etapa |

El parser 6.1.4 incorpora parches compatibles de profundidad/serialización, pero no corrige el aviso de selectores planos. La copia de minimatch de glob permanece en 9.0.9 y la raíz en 3.1.5, ya fuera de los rangos afectados observados. Glob 7.2.3 permanece deprecado, aunque no aparece afectado en estas auditorías.

No se evaluó mediante explotación cada aviso de Next. El portfolio usa Pages Router y páginas estáticas, pero esa arquitectura no permite declarar corregidos o inaplicables todos los avisos. Los dos paquetes del árbol productivo continúan pendientes. El gate de seguridad sigue fallando; la deuda no queda aceptada permanentemente y el proyecto no se declara seguro.

## Validaciones

- `npm ci`: exit 0, 377 instalados / 378 auditados. No se aprobaron scripts; unrs-resolver@1.11.1 continúa pendiente de allowScripts.
- `npm run lint`: exit 0, sin warnings ni errores de ESLint.
- `npm run build`: exit 0; página estática de 66.2 kB y JS inicial de 153 kB.
- Ambas auditorías JSON: exit 1, con los resultados anteriores.
- `npm ls postcss nanoid source-map-js picomatch glob minimatch brace-expansion js-yaml`: exit 0, árbol consistente.
- `git diff --check`: sin errores.
- Diff vacío de src, public y configuración de Next, Tailwind y PostCSS.

El build avisó que caniuse-lite/Browserslist está desactualizado. No se actualizó fuera del alcance. La instalación mantiene deprecaciones de inflight, paquetes @humanwhocodes, rimraf 3, glob 7/10, ESLint 8 y Next 14.2.1; no se ocultaron ni se ejecutó audit fix.

### CSS y QA funcional

Los dos CSS generados conservan nombre, tamaño y SHA-256 exactos respecto del build de baseline, anterior al cambio:

| Archivo | Bytes | SHA-256 antes y después |
| --- | --- | --- |
| 26cef7a0f06a3efe.css | 19711 | 070FD04E752C9CEEEE87D2FE3001909D1E16C184E00857C53AE475A0304FD0ED |
| da6e9b4a73108890.css | 2153 | 83B2BB797CCEACBD194BF2B9877A7A2AC805E800AA8A40952BE5C45135937CD2 |

QA ejecutado sobre build de producción local en 127.0.0.1:3100:

- EN → ES → EN, atributo lang, textos y enlaces /cv.pdf y /resume.pdf correctos.
- Navegación a Contacto y About correcta; modal Plenitud Fit abre, muestra contenido y cierra con su botón.
- Sin overflow horizontal a 320, 390, 768 y 1440 px. Inspección visual de móvil 390 px y escritorio 1440 px, conservando el tema oscuro.
- Consola capturada sin warnings ni errores.
- HTTP 200 en página, ambos PDFs, OG, robots y sitemap; MIME correcto y hashes de los cinco assets idénticos a public.
- Canonical oscaralcalde.vercel.app, un título y cuatro schemas JSON-LD. OG/Twitter conservan URL absoluta, JPEG, 1280 × 669 y texto alternativo.

No se ejecutó una comparación visual automatizada ni auditoría completa de accesibilidad/performance. Persisten los pendientes previos del modal (foco/Escape), CTA y movimiento reducido; no se modifican. No existen scripts adicionales de formato, tests o React Doctor y no se incorporaron herramientas nuevas.

## Fuentes verificadas

- [PostCSS: corrección residual en 8.5.23](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp).
- [Glob: aviso del mantenedor](https://github.com/isaacs/node-glob/security/advisories/GHSA-5j98-mcp5-4vw2).
- [Parser: fix completo en 7.1.6](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf) y [releases del mantenedor](https://github.com/postcss/postcss-selector-parser/releases).
- [Braces: sin parche publicado](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Las versiones disponibles y rangos se contrastaron con el registro npm y el lockfile real. Se prepara PR Draft para revisión; no se realiza merge, despliegue manual ni se inicia otra etapa.
