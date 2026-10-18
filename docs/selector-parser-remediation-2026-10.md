# Etapa 6B — Remediación controlada de postcss-selector-parser

Fecha: 18 de octubre de 2026. Baseline: `db0388c8a05c0fb585ac6aa53b9789bd1a25aa53`. Diagnóstico previo: [PR Draft #16](https://github.com/oalcalde21/portfolio/pull/16), head `5ceb0dc7593e08f2c7357dce981bcd197b71df74`, exclusivamente documental y todavía sin merge.

## Decisión

**Recomendar la integración del cambio acotado, sujeta a revisión del PR Draft.** Las dos copias consumidas del parser se resuelven a **7.1.6 exacto** mediante overrides limitados a Tailwind y su postcss-nested. No se agregan dependencias directas, ni se actualizan React, Next, Tailwind, ESLint u otros paquetes. No se modifican componentes, CSS fuente, diseño ni contenido.

La compatibilidad está acreditada para este proyecto, corpus y versiones bloqueadas, no como garantía universal de compatibilidad entre parser 6 y 7. Se conserva el riesgo de mantener un override fuera de los rangos upstream; una actualización futura de sus consumidores exige repetir las pruebas y revisar o retirar el override.

## Inspección y alternativas

- `main` y `origin/main` coincidían en db0388c después de fetch. La copia principal estaba limpia en la rama documental de 6A; quedó preservada. No se detectó otra tarea activa editando este repositorio ni cambios concurrentes.
- Se creó un worktree separado desde main y la rama `fix/portfolio-selector-parser`. Node **24.19.0**, npm **11.17.0**, Next/config-next **16.4.2**, React/DOM **19.3.1**, Tailwind **3.4.19**, postcss-nested **6.2.0**, PostCSS raíz **8.5.29**, ESLint **9.39.5**.
- Se reconstruyó el baseline con `npm ci --ignore-scripts`, auditorías y build antes de cambiar el manifest. La auditoría completa conservaba nueve afectados (siete altos/dos moderados), y la productiva cero.
- El [advisory GHSA-rj75-hqrm-r3gf / CVE-2026-104844](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) afecta parser <7.1.6; **7.1.6** es la versión corregida publicada. Es agotamiento de CPU al procesar selectores no confiables; no se identificó esa ruta de entrada pública en este portfolio.
- Se consultaron primero las releases upstream y el registro npm. `legacy-v6` permanece en **6.1.4**, sin backport corregido posterior. Tailwind `v3-lts` permanece en **3.4.19** y exige parser `^6.1.2`; postcss-nested **6.2.0** exige `^6.1.1`. No existe una solución de actualización normal dentro de esos rangos a la fecha.
- Cambiar solo postcss-nested a 7/9 no resuelve el consumidor directo de Tailwind y amplía el alcance. Actualizar PostCSS raíz no corrige un paquete distinto. Tailwind 4 queda fuera de esta etapa. No se intentó resolver braces ni migrar ESLint.
- Se revisó la [release mayor 7.0.0](https://github.com/postcss/postcss-selector-parser/releases/tag/v7.0.0): cambian las inserciones durante iteración. Tailwind usa recorridos y mutaciones de AST e importa `dist/util/unesc`; se incluyeron pruebas específicas de esos contratos y del CSS generado, no solamente una instalación aceptada por npm.

## Cambio y alcance del lockfile

```json
"overrides": {
  "tailwindcss@^3.4.1": {
    "postcss-selector-parser": "7.1.6",
    "postcss-nested@6.2.0": {
      "postcss-selector-parser": "7.1.6"
    }
  }
}
```

La clave de Tailwind coincide con el rango directo existente para respetar las restricciones de npm. El lockfile mantiene Tailwind 3.4.19; el test exige explícitamente esa versión y nested 6.2.0 para evitar extender la conclusión a consumidores nuevos sin revisión.

Resultado real de `npm ls postcss-selector-parser postcss-nested tailwindcss`:

```text
tailwindcss@3.4.19
  postcss-selector-parser@7.1.6 overridden
  postcss-nested@6.2.0 overridden
    postcss-selector-parser@7.1.6 overridden
```

Solo cambian **tres registros de paquetes del lock**: desaparece `node_modules/postcss-selector-parser@6.1.4`; aparecen dos copias idénticas 7.1.6 bajo `node_modules/tailwindcss/node_modules/` y `node_modules/postcss-nested/node_modules/`. Ambas conservan las dependencias cssesc/util-deprecate existentes. No cambian otras versiones ni registros de paquetes. La instalación pasa de 385/386 a 386/387 paquetes instalados/auditados por esta duplicación de resolución; no es un paquete funcional adicional en el frontend.

Se agrega `qa:selectors` para ejecutar `tests/security/parser-compat.cjs`. Es una comparación diferencial explícita con evidencia del baseline, no una sustitución del gate de seguridad ni un nuevo test que pase sin referencia. `qa` y las reglas de ESLint se conservan.

## Comparación de selectores y CSS

El test utiliza únicamente dependencias del lockfile. Extrae los **320 selectores únicos reales** de los CSS productivos y suma casos de responsive, hover, focus-visible, group/peer, atributos, pseudo-elementos, :is/:not/:where/:has, nesting, escapes y variantes complejas: **331 entradas únicas** tras deduplicación.

Compara para cada entrada:

1. Serialización con y sin preservación de espacios.
2. AST estructural: tipos, valores, namespaces, atributos, operadores, flags y nodos anidados, sin offsets ni formato incidental.
3. Clonación, prefijado mediante walkClasses y sustitución de nesting con nodos construidos por el parser.

También compila una fixture de Tailwind sobre los estilos reales, con @apply, nesting y variantes adicionales. Compara el árbol CSS completo conservando el orden de reglas/declaraciones, selectores, parámetros de at-rules, valores e important. Solo excluye comentarios y formato del árbol semántico; la igualdad de bytes se exige por separado.

**Resultado: cero diferencias** en los 331 casos, los árboles de CSS de producción y la fixture. Los dos CSS finales son idénticos byte a byte, incluyendo sus nombres en este worktree:

| Artefacto | Bytes | SHA-256 antes y después |
| --- | --- | --- |
| 990ba842b3f365b5.css | 22007 | `ff8fd2feaf0ed27b31deb0ae449fae629ae8a2f2f2315e9e9c4b3f5b3723a730` |
| a6fc798b75e96a95.css | 2063 | `1f2c1f3937ef1cee7a56c1dd224a0990a0d357888c3e317de8be18cbf2b1bc4c` |
| Fixture Tailwind/nesting/variantes | — | `32ee0a708c780161f88be969dc4e757537a834b25be91b369bf7556f2e27ee82` |

La comparación se repitió después de apartar el build previo y reconstruir sin `.next`; no depende solo de una caché anterior. Los nombres de archivo pueden depender del entorno/ruta del build: el antes/después se produjo en el mismo worktree y runtime.

### Incidencias del experimento, sin ocultar fallos

- El primer selector del override, `tailwindcss@3.4.19`, produjo **EOVERRIDE**, al no coincidir con el rango directo declarado `^3.4.1`. No se usó force ni se modificó la versión directa; se corrigió la clave al rango existente.
- El primer test del helper interno exigía que require(unesc) devolviera directamente una función. En 7 devuelve un objeto con default; esa aserción falló. Se inspeccionó el interop real de Tailwind: ya admite ambos formatos. El test final reproduce ese contrato y verifica el resultado de desescapar una clase. No se modificó Tailwind para acomodar el parser.
- La revisión automática bloqueó eliminar recursivamente el caché del build. Se preservó mediante un traslado a la carpeta de evidencia, verificando ambas rutas, y se ejecutó el nuevo build desde cero. No se borró trabajo ajeno.
- Una secuencia de navegador no alcanzó el estado ES esperado y buscó un botón inexistente; la activación mediante teclado y el selector con puntero desde el hero estable funcionaron. También se repitió el CTA ES una vez estabilizado el remount de idioma. No se atribuye automáticamente a un defecto de producto ni se afirma una causa no demostrada; las comprobaciones finales descritas abajo sí se ejecutaron.

## QA y auditorías

Todos los comandos npm se ejecutaron mediante FNM, Node 24.19.0 / npm 11.17.0; sin aprobar ni ejecutar lifecycle durante instalación/resolución.

| Validación | Resultado real |
| --- | --- |
| Baseline: npm ci --ignore-scripts / build | PASS; 385 instalados/386 auditados; parser 6.1.4 en ambos consumidores |
| Resolución: npm install --package-lock-only --ignore-scripts --no-audit | PASS después de corregir el alcance de la clave; ningún otro paquete actualizado |
| Candidato: npm ci --ignore-scripts | PASS; 386 instalados/387 auditados; manifest/lock consistentes |
| npm ls --all --json y explain del parser | PASS, exit 0; sin peers inválidos; ambas hojas 7.1.6, sin copia6.1.4 restante |
| npm run qa, incluyendo lint y build | PASS; repetido sobre un build sin caché. Sin warnings nuevos de lint/build |
| npm run qa:selectors -- compare <evidencia> | PASS; 331 selectores, CSS productivo y fixture idénticos en semántica y bytes |
| npm run qa:motion, procedimiento interactivo | **47/47**, exit 0; sin errores de hidratación, temporizadores ni suscripciones pendientes. Preferencia/geometría simuladas |
| Auditoría completa antes/después | **9→7 afectados**; 7 altos / 2 moderados → 7 altos / 0 moderados. Sigue **FAIL, exit 1** |
| Auditoría --omit=dev antes/después | **0→0**, PASS, exit 0 |
| git diff --check y revisión de alcance | Sin errores de whitespace; solo manifest, lock, test y este informe |

### Build productivo local y navegador

Se aplicó la skill vercel:verification al recorrido aplicable: HTML SSR → hidratación → navegación/interacción. No hay API o base de datos dentro de este flujo. Servidor local `npm start -- --hostname 127.0.0.1 --port 3116`, sin despliegue.

- **32/32** recorridos por teclado: EN/ES × cuatro secciones × 320/390/768/1440. aria-current correcto y sin overflow horizontal.
- **8/8** aperturas/cierres de modales: cuatro proyectos en desktop EN 1440 y mobile ES 320; foco inicial, Shift+Tab/Tab, Escape, restauración del disparador y overflow del documento.
- Ambos roles visibles completos del Typewriter observados en EN y ES; pausa manual conservada al cambiar idioma. El fixture controlado cubre reanudación, tiempos y cambios de preferencia.
- CTA EN/ES alcanza Contact tras estabilizar remount/scroll. Selector con teclado y puntero desde el hero estable. DotGrid normal: 500 puntos y 500 objetivos transformados tras clic.
- Fuentes loaded, imágenes de proyectos cargadas y cuatro bloques JSON-LD conservados. HTTP 200 para home y 20 recursos: PDF ES/EN, OG, robots, sitemap y recursos Next/CSS/fuente.
- No se capturaron warnings/errores de consola ni errores de hidratación en la sesión de build local. Capturas desktop/mobile conservadas fuera de Git.

### Seguridad remanente y warnings

Los dos nombres moderados postcss-selector-parser y postcss-nested dejan de aparecer en audit. Permanece **un advisory raíz**, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), propagado a siete nombres altos: braces, micromatch, fast-glob, chokidar, @next/eslint-plugin-next, eslint-config-next y tailwindcss. Son las cadenas de tooling ya diagnosticadas; no se intentaron corregir aquí. Cero productivas y cero nuevos advisories. El gate completo **no está verde** y su deuda no queda aceptada permanentemente.

Se mantiene el aviso npm de ESLint 9.39.5 EOL. La consulta de solo lectura `npm approve-scripts --allow-scripts-pending --json` conserva unrs-resolver 1.11.1 pendiente: no se aprobó. Los avisos LF/CRLF corresponden a la configuración previa; no hubo normalización masiva. React Doctor no se ejecutó ni modificó: sigue registrado su baseline de 1 error / 16 advertencias, separado de esta remediación.

## Reproducir el diferencial y límites

Usar una copia aislada en el **mismo directorio para ambos builds**, runtime estándar y el mismo código de producto. El test no inventa una referencia cuando falta baseline.json y comprueba las versiones de los consumidores.

1. Partir del commit db0388c, copiar únicamente el test de este PR a tests/security/parser-compat.cjs en esa copia; dejar manifest/lock del baseline.
2. `npm ci --ignore-scripts`, `npm run build` y `node tests/security/parser-compat.cjs record <directorio-evidencia-externo>`.
3. Aplicar solamente manifest/lock del candidato en esa copia. `npm ci --ignore-scripts`; apartar `.next` a una ubicación de evidencia propia sin borrar archivos ajenos; `npm run qa`.
4. `npm run qa:selectors -- compare <mismo-directorio-evidencia>`; revisar resultados y repetir ambas auditorías. El JSON conserva los selectores concretos, AST y árboles CSS del antes/después.
5. Para volver a verificar futuras modificaciones de Tailwind/parser, generar una referencia nueva desde el baseline correspondiente, nunca sobrescribir una comparación fallida para convertirla en éxito.

Evidencia de esta ejecución fuera de Git: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-selector-parser-6b/`: baseline.json, candidate.json, logs de instalación/build/QA/corpus, lock-record-changes.json, npm-ls-candidate.json, explain-after.json, auditorías antes/después, motion-results.json, browser-results.json, recursos HTTP y capturas. El build intermedio también se conserva allí. Solo el test y los resultados esenciales del informe se versionan.

No se ejecutó la suite completa upstream de parser ni fuzzing exhaustivo. El corpus y la fixture demuestran compatibilidad con el CSS y contratos comprobados de este proyecto; no justifican aplicar el override a otros proyectos. No se reconstruyó Linux limpio ni se ensayó Tailwind CLI en watch; se preserva esa limitación. No se declara emulación nativa de movimiento reducido, lector de pantalla real, zoom nativo o dispositivos físicos. El CSS final no cambió y las preferencias del fixture son simuladas, no aceptación nativa.

Para integrar: revisar este PR específico y sus checks; conservar las versiones exactas y el alcance del override. Repetir el diferencial si cambia el código/lock antes del merge. Retirar el override cuando un padre compatible incorpore la corrección upstream. Rollback por revert del commit mediante PR y reconstrucción con el lock previo; sin force push ni edición de node_modules. No se hizo merge ni despliegue manual.
