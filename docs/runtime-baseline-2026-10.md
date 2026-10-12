# Runtime y baseline reproducible — etapa 1

## Alcance y punto de partida

Revisión del 12 de octubre de 2026. Antes de modificar archivos se confirmó `main` limpio en `b58ed9b4aba3024e95ed74f4d9f3cf58879dc972`; `origin/main` y la referencia consultada directamente en GitHub coincidían. Se creó `chore/portfolio-runtime-baseline` desde ese commit.

Esta etapa fija el runtime y documenta el estado existente. No actualiza dependencias, elimina Sass, cambia código de producto, aplica el normalizador AltasWeb, modifica infraestructura ni despliega. No constituye una aplicación completa del Repository Standard: continúan faltando el marker, las instrucciones locales, las skills y el entorno Codex versionados.

## Contrato de runtime

- `.node-version`: Node 24.19.0.
- `packageManager`: npm@11.17.0.
- `engines.node`: >=24.19.0 <25.
- `engines.npm`: >=11.17.0 <12.

Las versiones exactas son las de referencia para reproducir este baseline. Los rangos de engines siguen el estándar AltasWeb y permiten versiones posteriores dentro del mismo major; no reemplazan la selección del runtime ni garantizan por sí solos que npm rechace un entorno distinto.

Node 24.19.0 con npm 11.17.0 ya estaba instalado mediante FNM. Las validaciones se ejecutaron con `fnm exec --using 24.19.0 npm.cmd ...` en Windows; no se instalaron herramientas globales ni se cambió el runtime predeterminado de FNM. El comando `npm` sin extensión no pudo ser lanzado directamente por `fnm exec` en Windows; `npm.cmd` resolvió esa particularidad sin modificar el entorno.

Para trabajar normalmente desde la raíz:

```powershell
fnm use
node --version
npm --version
npm ci
npm run lint
npm run build
npm audit --json
npm audit --omit=dev
```

Verificar Node 24.19.0 y npm 11.17.0 antes de instalar. Si el runtime no está disponible, detenerse e informar antes de instalar o modificar herramientas globales. El build de Inter mediante `next/font/google` requiere acceso a Google Fonts.

## Consistencia de dependencias

El lockfile usa formato v3 y sus dependencias directas y de desarrollo coinciden con `package.json`. El único cambio del lockfile es `packages[""].engines`, para reflejar el contrato de la raíz. Se comparó el JSON completo contra `b58ed9b` excluyendo únicamente ese campo: todos los registros de dependencias, versiones, URLs e integridades permanecen idénticos.

| Paquete | Versión bloqueada conservada |
| --- | --- |
| Next.js / eslint-config-next | 14.2.1 / 14.2.1 |
| React / React DOM | 18.3.1 / 18.3.1 |
| Tailwind CSS / tailwind-merge | 3.4.19 / 2.6.1 |
| Framer Motion / Anime.js | 11.18.2 / 3.2.2 |
| Sass | 1.98.0 |
| PostCSS raíz / interno de Next | 8.5.8 / 8.4.31 |
| ESLint | 8.57.1 |
| Vercel Analytics / React Icons | 2.0.1 / 5.6.0 |

Se confirmó diff vacío contra `b58ed9b` para `src`, `public`, Next, Tailwind, PostCSS, jsconfig y ESLint. La configuración continúa usando Next.js Pages Router en la raíz, Tailwind 3 y el diseño oscuro existente.

## Validaciones y resultados

| Validación | Resultado |
| --- | --- |
| `npm ci` con Node 24.19.0 / npm 11.17.0 | Exit 0; 386 paquetes instalados y 387 auditados |
| `npm run lint` | Exit 0; sin warnings ni errores de ESLint |
| `npm run build` | Exit 0; compilación y generación de páginas estáticas correctas |
| `npm audit --json` | Exit 1; 21 paquetes afectados: 1 moderado, 19 altos y 1 crítico |
| `npm audit --omit=dev --json` | Exit 1; 6 paquetes afectados: 5 altos y 1 crítico |
| Comparación del lockfile contra la base | Sin cambios de dependencias |
| `git diff --check` | Sin errores de whitespace |

La salida del build conserva `/` estática, 66.2 kB de página y 153 kB de JS inicial, igual al baseline documentado previamente para JS inicial. Esta equivalencia no constituye una medición de Core Web Vitals ni una comparación binaria del bundle. En esta ejecución no apareció el warning de Browserslist registrado en la auditoría anterior.

### Advertencias de instalación

`npm ci` informó deprecaciones de `inflight@1.0.6`, `@humanwhocodes/config-array@0.13.0`, `@humanwhocodes/object-schema@2.0.3`, `rimraf@3.0.2`, `glob@7.2.3`, `glob@10.3.10`, `eslint@8.57.1` y `next@14.2.1`. Las advertencias de Next y glob incluyen riesgos de seguridad. No se actualizaron estos paquetes ni se ejecutó audit fix.

npm 11.17.0 también informó scripts de instalación no cubiertos por `allowScripts` para `@parcel/watcher@2.5.6` y `unrs-resolver@1.11.1`. No se aprobaron ni se modificó la política de ejecución. Instalación, lint y build terminaron correctamente con esa política. No se afirma que esos scripts hayan sido ejecutados ni que se hayan validado todos los modos de watcher o todas las plataformas.

### Baseline de seguridad

Los recuentos de ambas auditorías coinciden con el diagnóstico anterior. En el árbol sin desarrollo aparecen `next`, `postcss`, `immutable`, `nanoid`, `picomatch` y `source-map-js`. Los recuentos corresponden a paquetes afectados, incluyendo propagación de vulnerabilidades transitivas; no implican que todas sean explotables mediante la interfaz actual.

El gate de seguridad sigue fallando y no se convierte en éxito por tratarse de deuda previa. La actualización de Next y las demás dependencias pertenece a una etapa posterior y requiere autorización.

## Baseline funcional del build de producción

Se sirvió el build localmente en `127.0.0.1:3100` mediante `npm start`, sin exposición externa ni despliegue.

- Cambio EN → ES → EN: contenido, atributo `lang` y enlace `/cv.pdf` o `/resume.pdf` correctos.
- Navegación a Contacto: URL `/#contact` correcta.
- Proyecto Plenitud Fit: apertura del modal, contenido y cierre mediante su botón correctos.
- Enlace del CV: navegación por teclado y anillo de foco visible confirmados.
- Anchos 320, 390, 768 y 1440 px: sin overflow horizontal. Inspección visual adicional en móvil de 390 px y escritorio de 1440 px.
- Consola capturada durante el smoke test: sin errores ni warnings.
- `/`: HTTP 200, un título, cuatro schemas JSON-LD, canonical y OG con `oscaralcalde.vercel.app`.
- Encabezados HTTP comprobados: `X-Frame-Options: DENY` y `X-Content-Type-Options: nosniff`.
- `/cv.pdf`: HTTP 200, application/pdf, 292571 bytes.
- `/resume.pdf`: HTTP 200, application/pdf, 294091 bytes.
- `/og-image.jpg`: HTTP 200, image/jpeg, 132830 bytes.
- `/robots.txt` y `/sitemap.xml`: HTTP 200 y MIME correcto.
- SHA-256 de las respuestas de los cinco archivos públicos coincide con el archivo local correspondiente.

No se ejecutó una comparación visual automatizada, una auditoría completa de accesibilidad, medición de rendimiento, prueba exhaustiva de animaciones ni validación del despliegue de Vercel. No hay scripts de formato, tests o React Doctor y no se añadieron herramientas.

## Diferencias y pendientes

La diferencia respecto de la base es el contrato reproducible de runtime y su documentación; las dependencias, el producto y los resultados de seguridad se conservan. Persisten el CTA del hero oculto, la falta de gestión completa de foco/Escape en el modal y la revisión de movimiento reducido. Esos pendientes están documentados en [la auditoría de contenido](cv-audit-2026-10.md) y quedan fuera de esta etapa.

Tras revisar esta etapa, Oscar autorizó crear el commit, publicar la rama y abrir un PR Draft hacia main, manteniendo los fallos de ambas auditorías como deuda de seguridad explícita. Las vulnerabilidades son preexistentes y no fueron introducidas por este cambio. Esta autorización no acepta permanentemente el riesgo ni declara seguro el proyecto: su corrección requiere las siguientes etapas autorizadas. No se hace merge, se despliega, se aprueban scripts de instalación ni se inicia otra etapa.
