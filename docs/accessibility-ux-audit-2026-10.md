# Auditoría de accesibilidad y UX — Etapa 5A

Fecha: 15 de octubre de 2026. Referencia: WCAG 2.2, niveles A y AA.

Estado de la Etapa 5A: diagnóstico local para revisión. No se implementaron correcciones, no se instalaron dependencias nuevas y no se crearon commits ni PR durante esa auditoría. Los resultados posteriores de la Etapa 5B se registran en la sección 11. Este informe no constituye una declaración de conformidad WCAG.

## 1. Resumen ejecutivo

El portfolio permite recorrer enlaces y botones mediante teclado, alternar EN/ES y abrir los proyectos. Los problemas de mayor impacto son el modal sin semántica ni gestión de foco, el texto animado continuo sin mecanismo de pausa y la pérdida visible de información en pantallas estrechas. El CTA principal está presente en el código pero oculto, tanto visualmente como para teclado y árbol de accesibilidad.

Se confirmaron tres combinaciones de contraste insuficiente. La estructura contiene dos landmarks main anidados y saltos de encabezado; axe los clasifica como buenas prácticas, sin que cada aviso equivalga automáticamente a un incumplimiento WCAG. Los nombres accesibles y alternativas de proyectos permanecen en inglés en modo español.

No se identificó un hallazgo de severidad crítica. Hay problemas altos que justifican una Etapa 5B acotada. No hace falta rediseñar el portfolio, migrar librerías ni añadir una dependencia para comenzar a resolverlos. Las pruebas pendientes de zoom nativo, movimiento reducido y lector de pantalla impiden afirmar cobertura integral.

## 2. Baseline y alcance

- Git inicial: main limpio, HEAD y origin/main en `155f6c135df708c225becd4843c1d84d1fdc2c98`; referencias remotas actualizadas, divergencia 0/0.
- Runtime comprobado: Node 24.19.0 y npm 11.17.0 mediante FNM.
- Next.js 16.4.1, React 18.3.1, Tailwind 3.4.19 y ESLint 9.39.5; Pages Router y Webpack explícito.
- Producción examinada: https://oscaralcalde.vercel.app/.
- Inspección: páginas, contexto EN/ES, header/sidebar, hero, proyectos/modal, contacto, experiencia, utilidades de animación y CSS/configuración.
- No existe AGENTS.md local ni marker `.altasweb/standard.json`. Se aplicaron las instrucciones generales suministradas y las restricciones específicas de esta etapa. No se intentó normalización manual.
- Herramientas existentes: ESLint CLI, eslint-plugin-jsx-a11y y axe-core 4.11.1, este último transitivo de eslint-config-next → eslint-plugin-jsx-a11y. Sin runner de accesibilidad, tests, React Doctor ni scripts de formato propios en package.json.
- Tema inspeccionado: oscuro, único tema implementado.

Severidad: alto = barrera significativa o pérdida de información/acción importante; medio = dificultad concreta o estructura confusa; bajo = mejora localizada. Complejidad relativa: S = ajuste localizado, M = coordinación entre componentes/estados, L = cambio transversal con QA amplio. No son estimaciones de horas.

## 3. Pruebas y evidencia

### Validaciones técnicas ejecutadas

| Validación | Resultado real |
| --- | --- |
| npm ci | Exit 0; 385 paquetes instalados y 386 auditados; lockfile conservado |
| npm run qa | Exit 0; lint sin errores/warnings y build correcto con Webpack |
| Rutas generadas | Pages Router: / y /404 estáticas |
| npm audit --json | Exit 1; 9 afectados: 7 altos, 2 moderados, 0 críticos |
| npm audit --omit=dev --json | Exit 0; 0 afectados |
| git diff --check y diff de manifests/lockfile | Sin errores ni cambios en package.json/package-lock.json |
| Consola capturada | Sin warnings ni errores en las pestañas de producción y QA instrumentado |

Warnings conservados: ESLint 9.39.5 sin soporte; React 18 deprecado en Next 16; script postinstall pendiente de unrs-resolver 1.11.1. No se aprobaron scripts. El gate de seguridad completo continúa fallando; la deuda no queda aceptada permanentemente.

Al comprobar el archivo nuevo con diff --no-index, Git advirtió que LF será convertido a CRLF cuando toque su copia de trabajo, según la configuración actual. No hubo errores de whitespace ni normalización de archivos existentes; no se cambió la política de finales de línea.

### Pruebas manuales ejecutadas

- Recorrido de Tab y Shift+Tab, incluida una vuelta completa por navegación, header, enlaces sociales de Sobre mí, cuatro proyectos y contacto. Sin trampas accidentales fuera del modal. Orden consistente con el DOM: sidebar → header → Sobre mí → proyectos → contacto. El hero no aporta un CTA enfocable.
- El foco global usa anillo verde; se observaron estilos de foco en enlaces y controles. El selector también conserva outline del navegador. No se certificó visibilidad del foco en cada combinación de animación, scroll y viewport.
- Enter en navegación y apertura de proyecto; Espacio y Enter en selector; Espacio en apertura y cierre del modal. Se comprobó Tab desde apertura y Shift+Tab desde cierre del modal.
- EN → ES → EN: cambia el contenido, `html.lang` y el enlace CV/resume; el botón mantiene el foco al alternar.
- Modal: foco inicial, Escape, cierre por botón, recorrido hacia fondo y restauración de foco; se inspeccionaron roles, inert y overflow.
- Viewports 320 y 390 px en producción; 640, 768 y 1440 px también inspeccionados en la copia instrumentada. Sin desplazamiento horizontal del documento, pero con recortes internos confirmados. Capturas visuales revisadas en móvil y escritorio.
- Enlaces de contacto, PDFs e íconos: inspección de destinos, nombres y atributos. No se enviaron mensajes, no se abrieron destinos externos ni se auditó el contenido interno de los PDFs.

### Auditoría automatizada

Se usó el axe-core 4.11.1 ya instalado. Un proxy temporal, enlazado únicamente a 127.0.0.1:3105 y guardado fuera del repositorio, sirvió el HTML/assets productivos con instrumentación de auditoría. No se cambió el código ni el build del producto. Se ejecutó axe.run sobre document con tags wcag2a, wcag2aa, wcag21aa, wcag22aa y best-practice. Los resultados se leyeron del DOM mediante el navegador.

| Estado observado | Reglas con hallazgos | Passes de reglas | Revisión manual pendiente |
| --- | --- | --- | --- |
| EN, 1280 px, modal cerrado, Sobre mí revelado | 5: color-contrast, heading-order, landmark-main-is-top-level, landmark-no-duplicate-main, landmark-unique | 37 | color-contrast: 1 nodo incomplete |
| EN, 1280 px, modal Plenitud Fit abierto | Las cinco anteriores + region | 38 | color-contrast: 1 nodo incomplete |
| ES, 640 y 320 px, modal cerrado | Las mismas cinco reglas del estado cerrado | 37 | color-contrast: 1 nodo incomplete |

En EN/Sobre mí hubo tres nodos color-contrast: etiqueta de idioma inactiva, saludo y footer. En el estado ES móvil registrado hubo dos nodos visibles de contraste. La visibilidad de Reveal afecta qué nodos analiza axe: la ausencia del saludo en una muestra no demuestra que haya quedado corregido. El modal abierto añadió un aviso region y un salto de encabezado adicional. Sus defectos de foco y semántica se confirmaron manualmente aunque axe no los identifique como un diálogo defectuoso: no hay rol dialog que permita esa inferencia automática.

Los recuentos son reglas y nodos de estados concretos, no porcentajes de conformidad ni una cobertura exhaustiva de todas las animaciones. El nodo incomplete de contraste no se convirtió artificialmente en aprobado.

## 4. Problemas de accesibilidad confirmados

### A01 — Modal sin semántica, aislamiento ni ciclo de foco

- Ubicación: `src/components/projects/ProjectModal.jsx:27–74`; disparadores en `src/components/projects/Project.jsx:74–124`. Afecta al componente compartido de todos los proyectos; interacción comprobada con Plenitud Fit.
- Estado/severidad: confirmado, **alto**. WCAG relacionado: 4.1.2 Nombre, función, valor y 2.4.3 Orden del foco. Escape y el ciclo de Tab corresponden al patrón de diálogo APG; no se etiqueta la falta de Escape por sí sola como fallo independiente de 2.1.1.
- Evidencia reproducible: enfocar “View details for Plenitud Fit” y pulsar Enter. Aparece el overlay, pero activeElement sigue siendo el disparador y hay cero elementos dialog/[role=dialog]. Tab pasa a “Visit Plenitud Fit website” del fondo. Desde el cierre, Shift+Tab llega a “Write me on WhatsApp” del documento. No hay inert ni aria-hidden aplicado al fondo. Escape deja el modal abierto. Cerrar con Enter/Espacio elimina el modal y deja activeElement en BODY, sin devolverlo al disparador.
- Impacto: desorientación, interacción accidental con contenido visualmente tapado y dificultad para descubrir/cerrar el contenido con teclado o tecnologías de asistencia. El árbol accesible mantiene el fondo y añade contenido sin anunciar un diálogo nombrado. No se realizó una sesión real con lector de pantalla.
- Scroll: body pasa a overflow-y:hidden y el overlay tiene scroll propio; al cerrar se fuerza scroll, en vez de restaurar el valor anterior. El efecto no tiene cleanup. El bloqueo visual básico existe, pero no reemplaza el aislamiento de interacción; sus escrituras globales se ejecutan desde cada instancia de proyecto.
- Corrección recomendada: evaluar primero `<dialog>` nativo con showModal, título asociado, foco inicial apropiado, cierre cancel/Escape y restauración explícita del disparador. Mantener aspecto, contenido y animación donde sea compatible. Si se conserva el portal actual, implementar el patrón completo: nombre/rol, foco inicial, contención, fondo inerte y cleanup/restauración. Añadir solo aria-modal no resuelve el problema. No se justifica aún una dependencia nueva.
- Riesgo de regresión: medio; portal, top layer, animaciones, backdrop y scroll requieren QA móvil. Complejidad M. Elegir la implementación mediante una prueba local autorizada antes de extenderla a todos los proyectos.

### A02 — Escritura y cursor automáticos sin pausa

- Ubicación: `src/components/util/Typewriter.jsx:42–78`, usado por `src/components/hero/Hero.jsx:35–37`.
- Estado/severidad: confirmado, **alto**. WCAG 2.2.2 Pausar, detener, ocultar (A).
- Evidencia: el h2 alterna escritura/borrado de los dos roles durante la sesión; el cursor tiene `pulse 2s ... infinite`. No hay control de pausa ni alternativa estable de ambos roles. El movimiento/actualización continúa mucho más de cinco segundos junto con el resto del contenido.
- Impacto: distracción, dificultad de lectura y texto de encabezado parcial si se consulta mientras se escribe. No se afirmó que un lector anuncie cada carácter: no hay aria-live ni prueba con lector real.
- Corrección recomendada: exponer ambos roles de forma estable a tecnologías de asistencia; ocultar de su árbol la duplicación decorativa animada. Para el comportamiento por defecto, aportar pausa/detención o finalizar la animación y dejar la información completa. Para reduce, mostrar texto estable y desactivar el cursor. Atender reduce por sí solo no resuelve la ausencia de pausa para los demás usuarios.
- Riesgo: medio, por cambio de temporización observable y texto accesible; requiere autorización específica. Complejidad M. No se propone redacción nueva de los roles.

### A03 — Correo truncado en móvil/reflow

- Ubicación: `src/components/contact/Contact.jsx:45–49`, wrapper `src/components/util/Reveal.jsx:34` y layout de `src/components/index.jsx:45`.
- Estado/severidad: confirmado, **alto**. WCAG 1.4.10 Reflow (AA).
- Evidencia: a 320 px, abrir Contact. El wrapper del correo dispone de 155 px y necesita aproximadamente 229 px; el texto llega hasta x≈330.55 mientras el wrapper termina en x=257 y oculta overflow. La captura muestra la dirección incompleta. A 390 px dispone de 225 px, todavía por debajo del contenido. El documento no tiene overflow horizontal: el contenido se corta internamente.
- Impacto: no se puede leer/copiar visualmente la dirección completa; afecta a baja visión y a quienes necesitan verla antes de activar mailto. El nombre accesible y href siguen completos.
- Corrección recomendada: permitir quiebres seguros del correo o un layout que lo contenga sin recorte; revisar min-width/espaciado y el wrapper de animación de ese elemento. No quitar overflow global de Reveal indiscriminadamente. Mantener dirección, colores y destino.
- Riesgo: bajo/medio; cambios de altura y foco en contacto. Complejidad S.

### A04 — Selector de idioma recortado a 320 px

- Ubicación: `src/components/nav/Header.jsx:16–28`, `src/components/buttons/LanguageToggle.jsx:23–46`.
- Estado/severidad: confirmado, **medio**. WCAG 1.4.10 Reflow (AA), por pérdida de información visible.
- Evidencia: con EN activo a 320 px, el selector declarado w-16 se contrae hasta ≈39.34 px. Sus etiquetas se extienden fuera del botón y overflow-hidden las corta. A 390 px vuelve a 64 px. El CV conserva shrink-0, pero el selector puede encogerse.
- Impacto: opciones EN/ES menos reconocibles y acción ambigua en el ancho mínimo. El botón conserva nombre accesible y activación por teclado; no se trata de ausencia de nombre.
- Corrección recomendada: reservar ancho suficiente para el selector y ajustar distribución del header en el ancho mínimo, conservando sus controles. No ocultar una opción ni reducir texto como solución automática.
- Riesgo: medio por distribución del header a 320 px; requiere revisión visual explícita. Complejidad S.

### A05 — Contraste insuficiente en tres elementos

- Ubicación: `src/components/about/About.jsx:37`, `src/components/buttons/LanguageToggle.jsx:41–47`, `src/components/index.jsx:56`.
- Estado/severidad: confirmado, **medio**. WCAG 1.4.3 Contraste mínimo (AA).

| Elemento | Colores medidos | Ratio | Umbral |
| --- | --- | --- | --- |
| Saludo Hi!/H, 24 px negrita | blanco #ffffff sobre verde #4ade80 | 1.74:1 | 3:1, texto grande |
| Idioma no seleccionado, 12 px negrita | #71717a sobre #27272a | 3.08:1 | 4.5:1 |
| Footer, 14 px | #71717a sobre #18181b | ≈3.66:1, axe; cálculo ≈3.67 | 4.5:1 |

- Evidencia: resultados axe contrastados con colores computados. La opción de idioma no seleccionada no es un control deshabilitado. No se aplica esa excepción.
- Impacto: texto difícil de percibir con baja visión o pantallas de menor contraste.
- Corrección recomendada: modificar únicamente las combinaciones insuficientes, conservando identidad verde/oscura; por ejemplo, texto oscuro sobre el verde existente y un neutral legible para etiquetas/footer. Verificar hover/focus/active y ambos idiomas antes de elegir valores. No cambiar la paleta global sin necesidad.
- Controles/foco: el verde #4ade80 sobre fondo #18181b da ≈10.17:1; texto principal #d4d4d8 sobre ese fondo ≈11.99:1. La navegación al 50 % de opacidad da aproximadamente 5.18:1 en reposo: no se marcó como fallo. No se certificaron todos los píxeles del header translúcido sobre cualquier fondo.
- Riesgo: bajo, pero son ajustes visuales que requieren aprobación. Complejidad S.

### A06 — Nombres y alternativas en inglés con la página en español

- Ubicación: `src/components/projects/Project.jsx:79,83,100`, `src/components/projects/ProjectModal.jsx:41,50`, `src/components/buttons/LanguageToggle.jsx:21`, `src/components/nav/SideBar.jsx:55` y `src/components/hero/Hero.jsx:22`.
- Estado/severidad: confirmado en DOM, **medio**. WCAG 3.1.2 Idioma de las partes (AA), para frases ordinarias en otro idioma sin identificarlo; no se aplica esta observación a nombres propios como GitHub.
- Evidencia: tras cambiar a ES, html.lang=es pero permanecen “View details for…”, “Visit … website”, “Close modal”, “Screenshot of … project”, “Switch to English”, “Main navigation” y “Hero”, sin lang propio. El contenido visible sí se traduce.
- Impacto: mezcla de idioma y pronunciación potencialmente incorrecta para lectores de pantalla. Efecto de pronunciación pendiente de validación con lector real.
- Corrección recomendada: traducir nombres funcionales y alternativas mediante el contexto existente. Mantener nombres de marca. Identificar el idioma de pasajes extranjeros conservados cuando corresponda.
- Riesgo: bajo; asegurar que los nombres sigan distinguiendo proyectos y permitan localizar controles. Complejidad S.

### A07 — Landmarks duplicados y jerarquía de encabezados

- Ubicación: `src/pages/index.jsx:18`, `src/components/index.jsx:33`, `src/components/about/Stats.jsx:24,49`, `src/components/projects/Project.jsx:98`, `src/components/projects/ProjectModal.jsx:52`; empresas en `src/components/experience/ExperienceItem.jsx:93`.
- Estado/severidad: estructura confirmada, **medio**. Relacionado con WCAG 1.3.1 Información y relaciones; los avisos específicos de axe son best-practice, no una demostración automática de fallo normativo.
- Evidencia: dos main anidados; About h2 → competencias h4; Projects h2 → proyectos h4; título del modal h4 sin jerarquía propia de diálogo. Los nombres de empresas son span, no encabezados. Axe registra heading-order y tres reglas sobre main/landmarks.
- Impacto: estructura poco clara para navegación por landmarks/encabezados y dificultad para localizar experiencias concretas.
- Corrección recomendada: conservar un solo main, header/nav/footer en una estructura clara; alinear h3 para subsecciones/proyectos y evaluar encabezados de empresas. Separar nivel semántico y tamaño visual para no rediseñar.
- Riesgo: bajo/medio: mover el wrapper de la fuente o un main puede afectar herencia y grid si se hace sin cuidado. Complejidad S/M.

## 5. Problemas de UX

### U01 — CTA principal inexistente para el visitante

- Ubicación: `src/components/buttons/OutlineButton.jsx:19–38` y `src/components/hero/Hero.jsx:49–56`.
- Estado/severidad: confirmado, **alto**; problema de descubrimiento/conversión, sin asignar automáticamente un criterio WCAG porque hay otros caminos de contacto.
- Evidencia: el botón “Contact Me” existe en DOM pero getComputedStyle devuelve display:none, rectángulo 0×0 y no aparece en Tab/árbol accesible. Los comentarios `// ... hidden ...` están dentro del template literal de clases; `hidden` se procesa como clase y twMerge elimina flex en favor de ella. No es una decisión explícita de responsive.
- Recomendación: retirar la prosa de la cadena de clases y restaurar una acción de contacto visible con semántica adecuada. Al restaurarla, comprobar contraste del texto sobre verde, foco y destino de navegación. No basta con volver visible el botón: su combinación actual clara sobre verde también requiere revisar contraste. Esto cambia la UI observada y necesita aprobación.
- Riesgo: medio, modifica la altura/acción visible del hero. Complejidad S.

### U02 — Estado del selector y navegación poco explícitos

- Ubicación: `src/components/buttons/LanguageToggle.jsx:20–22`; `src/components/nav/SideBarLink.jsx:30–46`.
- Estado/severidad: mezcla confirmada de nombre de acción cambiante y aria-pressed ligado a EN, **bajo**; comprensión con lector pendiente. La navegación marca la sección solo mediante estilos, sin aria-current. Al activar About mediante Enter el foco queda en el enlace y el Tab siguiente va a Projects, no al contenido de About.
- Recomendación: definir un patrón de idioma inequívoco (acción o selección con estado bien nombrado), exponer la sección actual y evaluar foco del destino de navegación. Mantener el control existente si se puede resolver con semántica/nombres; no es necesario añadir un menú complejo.
- WCAG: 4.1.2/2.4.3 a revisar según la solución; no se declara incumplimiento adicional por ausencia de aria-current o por mantener el foco en un enlace ancla.
- Riesgo: bajo/medio por cambio del recorrido esperado. Complejidad S.

## 6. Mejoras opcionales y comprobaciones favorables

| ID / ubicación | Estado, prioridad y recomendación | Riesgo / complejidad |
| --- | --- | --- |
| O01 Header.jsx:35–45, ProjectModal.jsx:41 | Bajo. Íconos sociales 18×18 px y cierre pequeño. Ampliar área táctil sin agrandar necesariamente el dibujo. No se declara fallo 2.5.8 por dimensión sola: en header los centros están separados 30 px en móvil y 34 px en escritorio; el cierre está aislado. Learn more está integrado en texto y dispone además de un disparador de imagen grande equivalente. Considerar áreas mayores como mejora de UX. | Bajo / S |
| O02 index.jsx y SideBar.jsx | Bajo. Añadir enlace de salto visible al recibir foco y un destino principal inequívoco. Actualmente hay enlaces de sección funcionales; no se afirmó fallo 2.4.1 únicamente por no existir un skip link. | Bajo / S |
| O03 Header.jsx, Project.jsx, Contact.jsx | Bajo. Considerar aviso conciso de nueva pestaña/PDF donde ayude a anticipar el resultado. Hay 14 enlaces target=_blank; conservan rel=noopener noreferrer. No se clasificó la apertura en nueva pestaña por sí sola como fallo AA. | Bajo / S |

Comprobaciones favorables: enlaces sociales con nombres, enlaces de contacto semánticos, botones reales para proyectos e idioma, atributos alt presentes, un h1, secciones nombradas, sin tabindex positivos encontrados, lang actualizado al alternar, PDFs por idioma y foco visible disponible. Los textos principales de 14–16 px no se califican como fallo por su tamaño aislado. Las pruebas de ampliación siguen pendientes.

## 7. Movimiento reducido y deuda técnica

### D01 — No existe política de movimiento reducido

- Ubicación: Typewriter.jsx, Reveal.jsx, Project.jsx, DotGrid.jsx, SideBar.jsx/SideBarLink.jsx, index.jsx y globals.css:24–26. LanguageTransition.jsx también declara fade, pero no tiene consumidores en el árbol actual; el fade EN/ES efectivo está en index.jsx.
- Estado: ausencia de manejo confirmada por código; respuesta bajo preferencia reduce no probada dinámicamente. Prioridad **media**, complejidad M, riesgo medio por inicialización/visibilidad del contenido. WCAG 2.3.3 Animación de las interacciones es AAA, no requisito AA; no se presenta su ausencia como incumplimiento AA automático. A02 sí tiene implicación A independiente.
- Inventario: escritura 100 ms/borrado 50 ms y cursor infinito; fade EN/ES 0.3 s con remount de secciones; Reveal y wipe 0.5 s con desplazamiento de 75 px; proyectos 0.75 s/100 px; entrada lateral 0.5 s; modal con desplazamiento inicial de 100 px; DotGrid Anime.js escala/traslada puntos con stagger; scroll-behavior:smooth global y transiciones hover.
- Recomendación: una política compartida que deje contenido visible sin traslaciones/wipes para reduce; idioma instantáneo o transición breve sin movimiento; scroll auto; DotGrid estático sin ola; títulos estables y sin cursor. Framer Motion y CSS necesitan tratamiento coordinado; Anime.js necesita su propia decisión antes de disparar. No eliminar información ni dejar opacity:0 cuando se omite una animación.
- DotGrid es decorativo, no aporta datos/acciones de producto. No se recomienda convertir 500 puntos en tab stops para imitar su efecto de puntero; mantenerlo fuera del recorrido y explicitar su carácter decorativo si procede.

### Otra deuda detectada

- Typewriter.jsx:56 crea un segundo timeout de pausa que no se cancela en el cleanup del timeout exterior. Confirmado por inspección; efecto observable adverso no demostrado. Prioridad baja/media, complejidad S, riesgo medio si se cambian tiempos. Abordarlo junto con A02, sin refactor general.
- Reveal usa overflow-hidden también alrededor de enlaces. Puede recortar parte del anillo de foco y produce el recorte de A03. El anillo no se eliminó globalmente; falta una matriz exhaustiva de clipping/foco bajo todas las animaciones. Prioridad media como validación de 5B, no afirmar fallo 2.4.11 sin comprobar ocultamiento completo.
- Sin gate reproducible propio de accesibilidad; axe existe solo transitivamente. Si se incorpora un gate futuro, versionar herramienta/configuración y distinguir reglas WCAG de best-practice, con baseline explícito. No se instaló nada ahora.
- README aún dice “migration in progress”, pendiente de revisión/despliegue y conserva instrucciones de dominio placeholder ya superadas. Informe de migración también describe su fase previa al cierre. Deuda documental confirmada, baja, complejidad S. No se corrigió fuera del informe autorizado.
- Persisten nueve afectados de desarrollo/build y la ausencia del marker AltasWeb. Son deudas separadas, no argumentos para modificar dependencias o aplicar una migración estructural durante accesibilidad.

## 8. Limitaciones y verificaciones pendientes

1. No se ejecutó NVDA, JAWS ni VoiceOver. Se inspeccionaron DOM/árbol accesible y teclado; no se declaró pronunciación real, anuncios o modo de exploración probado.
2. El navegador expone viewport, pero no una capacidad fiable de zoom nativo ni emulación de prefers-reduced-motion. La preferencia observada fue reduce=false. No se alteró el sistema operativo. La inspección de código demuestra falta de manejo, no sustituye una prueba con reduce=true.
3. No se probaron zoom real al 200 % y 400 % ni ampliación solo de texto. Los anchos de 640 y 320 CSS px ayudan a evaluar reflow equivalente en espacio disponible a 1280/2 y 1280/4, pero no equivalen a ejecutar zoom ni certifican 1.4.4. A03/A04 ya aparecen sin zoom.
4. No se ejecutó matriz de todos los navegadores/dispositivos físicos, alto contraste/forced-colors, personalización de espaciado de texto 1.4.12 ni tecnologías de entrada alternativas.
5. Axe cubrió los estados descritos. Elementos ocultos por animación y contenido de PDFs/destinos externos no tienen cobertura integral. Un nodo de contraste quedó incomplete. No se hizo evaluación de flashes a partir de vídeo; no se observó un patrón que justifique afirmar un fallo de 2.3.1.
6. Se inspeccionaron clases hover/active y foco, pero no una matriz visual exhaustiva de todos los hover/active. La captura de consola sin errores no acredita conformidad accesible.
7. El proxy temporal únicamente añadió axe y salida oculta de diagnóstico; las pruebas manuales principales se hicieron también sobre producción sin instrumentación. No se guardaron capturas ni resultados JSON como artefactos versionados: las medidas, estados y pasos reproducibles quedan registrados en este informe.

## 9. Plan incremental propuesto

| Orden | Cambio pequeño propuesto | Criterios de aceptación |
| --- | --- | --- |
| 1 | Modal compartido accesible, sin nueva dependencia si dialog nativo satisface compatibilidad | Nombre/rol correctos; foco inicial dentro; Tab/Shift+Tab contenidos; Escape/botón/backdrop coherentes; retorno al disparador; fondo inerte; scroll interno y restauración/cleanup; lector de pantalla y móvil |
| 2 | Reflow de contacto y selector | Correo y EN/ES completos a 320/390 px; sin clipping ni overflow; foco visible; zoom real 200/400 %; EN y ES |
| 3 | Contraste localizado y recuperación del CTA, previa aprobación visual | Ratios AA según tamaño; CTA visible y enfocable, destino claro; identidad y contenido conservados; revisar altura hero y contacto |
| 4 | Política de movimiento y Typewriter | Preferencia reduce real respetada; texto equivalente estable; pausa/detención para comportamiento normal; sin contenido invisible ni timers pendientes; sin pérdida de información |
| 5 | Semántica/localización | Un main; jerarquía coherente sin alterar tamaños; nombres accesibles en idioma correcto; selector con patrón claro; enlaces y metadatos conservados |
| 6 | Repetición de QA y documentación | npm ci/qa; axe por idioma y estado; teclado/lector; zoom/reflow; consola; auditorías sin aumento; diff pequeño sin dependencias o assets inesperados |

## 10. Alcance recomendado de Etapa 5B

Autorizar primero un bloque acotado de **modal accesible + correos/selector sin recortes**, con traducción de los nombres del modal que se toquen. Incluye únicamente componentes directamente implicados, preservando las capturas, textos, destinos y apariencia general; los ajustes de layout necesarios para recuperar información deben revisarse en 320/390/768/1440 px.

El bloque siguiente puede cubrir contraste/CTA y movimiento, pero requiere autorización explícita: recuperar un CTA oculto cambia la UI observada y pausar/simplificar Typewriter cambia su comportamiento. La elección final entre dialog nativo y reparación del portal debe validarse con una prueba pequeña; no se presupone instalar una librería. La normalización de Tailwind, React, dependencias y generador queda fuera.

Antes de declarar cerrada 5B: completar lector de pantalla, zoom nativo y preferencia reduce en un navegador que los permita. Si esas herramientas siguen sin estar disponibles, mantener la limitación documentada y no declarar conformidad WCAG completa.

## Referencias

- [WCAG 2.2, norma y criterios](https://www.w3.org/TR/WCAG22/).
- [WAI APG: patrón de diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- [WCAG 2.2: pausar, detener, ocultar](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- [WCAG 2.2: reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- [WCAG 2.2: tamaño mínimo del objetivo y excepciones](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- [Animación de interacciones, nivel AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

Las referencias APG y Understanding orientan la interpretación; se distinguen de los requisitos normativos y de los resultados de herramientas.

## 11. Etapa 5B — Modal accesible y correcciones móviles

Fecha: 15 de octubre de 2026. Rama: `fix/portfolio-accessibility-modal-mobile`. Base: `155f6c135df708c225becd4843c1d84d1fdc2c98`. Alcance autorizado: A01, A03 y A04; sin merge ni despliegue manual.

### Preparación y conservación del informe

Se confirmó main sincronizado 0/0 con origin/main y sin cambios en archivos versionados. La única excepción al árbol limpio era este informe local sin seguimiento, previsto por el usuario. Se preservó: SHA-256 inicial `37C9159DB4A92A1DA84D1D27A672486D997CB90DEE21EC23E39212CA22D1CD42`. Se conserva la auditoría original como baseline histórico y se añade esta actualización.

Se repitió la evidencia inicial en producción: correo cortado y selector comprimido a 320 px; modal sin rol de diálogo, foco retenido en el disparador y Escape sin efecto. Se guardaron capturas iniciales de 320/390 px y del modal a 390 px fuera del repositorio.

### Cambios implementados

- **A01, verificado en Chromium:** dialog nativo abierto con showModal, conservando el portal a body, la tarjeta, clases del overlay y animación de entrada `{ y:100, opacity:0 } → { y:0, opacity:1 }`. El diálogo tiene rol implícito, aria-modal y un título asociado con useId/aria-labelledby. No se alteró el nivel del encabezado.
- Foco inicial en el cierre, ciclo Tab/Shift+Tab entre controles, Escape mediante cancel y cierre por botón/backdrop. La tarjeta conserva stopPropagation. Se registra el disparador concreto, tanto imagen como Learn more, y se restaura el foco con preventScroll.
- La modalidad nativa hace inerte el fondo. Se confirmó que el árbol accesible expone únicamente el diálogo y sus descendientes; un intento de clic sobre la posición del selector del fondo llegó al backdrop y cerró el modal sin alternar el idioma.
- El efecto solo bloquea scroll mientras está abierto; conserva y restaura overflow-y, padding-right y coordenadas previas. Compensa la barra de scroll para evitar reflow del fondo, detiene un desplazamiento pendiente al abrir y mantiene desplazamiento interno al mover el foco. El cleanup cierra el dialog y restaura ese estado, también al desmontar. No se agregaron listeners globales.
- Traducciones añadidas únicamente para el cierre y la alternativa de la imagen del modal: Close modal/Cerrar modal y Project screenshot/Captura del proyecto. El título usa el nombre de proyecto ya existente y el enlace conserva Live Project/Ver Proyecto. La traducción del resto de nombres de A06 sigue pendiente.
- **A03, verificado:** el correo mantiene texto y mailto. Su contenedor tiene max-w-full, el texto permite overflow-wrap:anywhere y el ícono no se contrae. El enlace envuelve ahora su Reveal, para que el anillo de foco quede fuera del contenedor que recorta la animación. Reveal y su overflow-hidden global no se modificaron.
- **A04, verificado:** el selector usa shrink-0 y mantiene 64 px. Se redujeron únicamente padding y gaps del header móvil para alojar también los tres enlaces sociales y el CV. La altura sigue siendo 72 px; no se redujo texto ni se ocultaron controles. A partir de sm se conserva el espaciado anterior. La instancia MyLinks de Sobre mí mantiene sus gaps originales.

No se modificaron Typewriter, política global de movimiento, CTA, contrastes, jerarquía de encabezados, React, Tailwind, package.json, lockfile, fuentes, imágenes, PDFs ni configuración de infraestructura.

### Validación técnica y funcional

| Comprobación | Resultado |
| --- | --- |
| npm ci, Node 24.19.0 / npm 11.17.0 | Exit 0; 385 instalados / 386 auditados; sin aprobar scripts |
| npm run qa | Exit 0 en la implementación y después de los ajustes de scroll/foco; lint sin errores/warnings y build correcto con Webpack |
| npm audit --json | Exit 1; 9 afectados: 7 altos, 2 moderados, 0 críticos |
| npm audit --omit=dev --json | Exit 0; 0 afectados |
| git diff --check | Sin errores de whitespace; persisten avisos de conversión LF/CRLF en copia de trabajo, sin normalización masiva |
| Archivos fuera de alcance | Diff vacío en manifests/lockfile, Reveal, Typewriter, OutlineButton y globals.css |
| HTTP local del build | /, PDFs, OG, robots y sitemap: 200; ruta inexistente: 404; canonical y OG conservados, cuatro schemas |
| Consola del build en navegador | Sin warnings ni errores capturados |

Persisten los warnings de ESLint 9 sin soporte, React 18 deprecado en Next 16 y allowScripts pendiente para unrs-resolver. No se cambió ningún gate; nueve afectados de tooling siguen siendo deuda explícita, no aceptación permanente.

| Viewport, altura 900 px | Ancho del documento | Selector, ancho exterior | Correo, ancho disponible / scrollWidth |
| --- | --- | --- | --- |
| 320 px | 305 px | 64 px, ambas etiquetas dentro | 155 / 155 px, texto completo en dos líneas |
| 390 px | 375 px | 64 px, ambas etiquetas dentro | 225 / 225 px, texto completo en dos líneas |
| 768 px | 753 px | 64 px | 512 / 512 px |
| 1440 px | 1425 px | 64 px | 512 / 512 px |

La diferencia de 15 px corresponde a la barra vertical del navegador; no hay overflow horizontal. En ES a 320 px se confirmó también /cv.pdf, ambas etiquetas y el correo completo; en EN se conserva /resume.pdf. El selector respondió a Espacio y Enter.

Pruebas del modal: apertura/cierre de Plenitud Fit, CFR Estudio, Revision Automotriz y AltasWeb, restaurando el disparador de cada uno. Plenitud Fit se abrió también desde Learn more con Espacio y se cerró con Enter, restaurando ese botón. Tab y Shift+Tab permanecen dentro; Escape, cierre y backdrop funcionan; clic en la tarjeta no cierra. Se inspeccionaron móvil y escritorio: la tarjeta conserva max-width de 672 px en escritorio y no desborda el diálogo.

Prueba adicional a 320×568: el overlay tiene scroll interno (contenido mayor que 568 px). Tab permite alcanzar Live Project/Ver Proyecto y regresar al cierre. Tras la compensación de scrollbar, una secuencia registrada conservó window.scrollY=3239 antes, durante el desplazamiento interno y después de Escape; overflow y padding inline volvieron a sus valores originales vacíos. El fondo no se desplazó en esa secuencia final.

El foco del correo se comprobó mediante teclado: anillo verde de 4 px exteriores, enlace de 155 px a 320 y ancestro inmediato overflow:visible, sin recorte por Reveal. Se revisaron capturas de contacto y modal en móvil/escritorio; las diferencias observadas son el correo completo, el selector sin compresión y el indicador de foco inicial del modal. No se necesitó cambiar la animación o adoptar una dependencia de diálogos.

### Axe-core repetido y comparación contra producción

Se utilizó de nuevo axe-core 4.11.1 ya instalado, sin agregar paquetes. El proxy temporal de QA sirvió el build local de 127.0.0.1:3106 a través de 3107, con instrumentación fuera del repositorio. Se mantuvieron todos los tags y reglas del diagnóstico, y se añadieron resultados acotados al dialog sin reemplazar ni ocultar los del documento completo. Un segundo proxy hacia producción permitió contrastar hallazgos previos.

| Estado final | Resultado axe |
| --- | --- |
| EN, 1280 px, cerrado, Sobre mí revelado | Cinco reglas previas: contraste (tres nodos), encabezados y tres reglas de main/landmarks; 37 reglas aprobadas; un nodo de contraste incomplete |
| EN, 1280 px, Plenitud Fit abierto | Cero violaciones en la muestra del documento; 23 reglas aprobadas, sin incomplete en esa muestra |
| ES, 320 px, cerrado, Contacto revelado | Seis reglas: las cinco previas y link-in-text-block en dos enlaces; 37 reglas aprobadas, sin incomplete en esa muestra |
| ES, 320 px, Plenitud Fit abierto | Documento: link-in-text-block en dos enlaces de Contacto del fondo, 22 reglas aprobadas y tres nodos de contraste incomplete. Auditoría acotada al dialog: cero violaciones, 17 reglas aprobadas y color-contrast pendiente de revisión manual |
| Producción sin cambios, ES, 320 px, Contacto revelado | Las mismas seis reglas y los mismos dos enlaces de link-in-text-block: hallazgo preexistente, no introducido por esta rama |

El árbol accesible nativo y el teclado sí confirman el aislamiento del fondo. Los resultados de axe sobre document no se interpretan como una sesión de lector de pantalla ni se descartan sus hallazgos por estar detrás del diálogo. Las diferencias de reglas/nodos entre estados dependen de visibilidad, animaciones y contexto; no prueban una mejora global de contraste. Se mantienen los incomplete explícitos.

**A08 — Enlaces de Contacto diferenciados solo por color, hallazgo adicional preexistente.** Ubicación: Contact.jsx:22–40, enlaces LinkedIn y GitHub. Estado confirmado por axe y código del baseline, severidad media; WCAG 1.4.1 Uso del color (A). Reproducción: ES a 320 px, navegar a Contacto y esperar a que Reveal termine; los enlaces verdes no tienen subrayado en reposo y contrastan 1.17:1 respecto del texto que los rodea, por debajo de 3:1 para distinguirlos solo por color. El mismo resultado aparece en producción. Impacto: cuesta reconocer los destinos a quienes no distinguen esa diferencia cromática. Recomendación posterior: indicador persistente no basado solo en color, conservando identidad y verificando hover/focus. Complejidad S, riesgo visual bajo; no se corrigió porque contraste/estados globales están fuera de la autorización 5B. No hubo nuevas excepciones de ESLint/axe ni cambios de controles para silenciarlo.

### Limitaciones y deuda que continúa

No se ejecutó un lector de pantalla real: no se encontró NVDA ni una sesión activa de lector; Narrator.exe existe en Windows, pero la interfaz disponible no permite conducir/verificar su salida de forma fiable. El árbol accesible no sustituye esa prueba. Se intentó Ctrl+plus en la pestaña de QA: innerWidth, devicePixelRatio=1 y visualViewport.scale=1 no cambiaron; se restauró Ctrl+0. No se declaran probados zoom nativo 200/400 % ni la matriz Safari/Firefox/dispositivos físicos.

A02, A05, A07, U01, política de movimiento y mejoras opcionales siguen pendientes. A06 solo se resolvió en el contenido accesible del modal. Capturas y resultados JSON de QA se conservan como artefactos locales fuera del repositorio; no se agregaron imágenes generadas de pruebas al producto. El reporte no declara conformidad WCAG completa.

## 12. Etapa 5C — CTA, contraste y ajustes móviles

### Inspección previa a la implementación

Base: `90f09e119c52efb8c432124855ecfc7df8788133`, main limpio y sincronizado con origin/main. Rama: `fix/portfolio-accessibility-cta-contrast`. Se conservaron capturas de producción del hero y Contacto en 320, 390, 768 y 1440 × 900 px, fuera del repositorio, en `~/.codex/visualizations/portfolio-stage5c/`.

- U01 reproducido: comentarios escritos dentro del string de clases de OutlineButton contienen la palabra `hidden`. Tailwind/twMerge la interpretan como clase y el botón del hero tiene display:none. Único consumidor: Hero.
- A05 reproducido: saludo blanco/verde 1.74:1; idioma inactivo 3.08:1 en reposo y 2.16:1 en hover; footer 3.66:1. El selector activo también requiere ajuste en hover: verde sobre la composición del indicador al 20 % y zinc-700 da 4.05:1. Se comprobaron los colores calculados del hover real en navegador.
- Al recuperar el CTA, su texto claro sobre verde tampoco alcanza AA; se necesita texto oscuro en reposo y hover. Su foco debe quedar dentro del botón para evitar el recorte del Reveal existente.
- A08 reproducido: LinkedIn/GitHub de Contacto solo tienen subrayado al pasar el puntero.
- Recorte de Contacto reproducido únicamente a 320 px: heading clientWidth=155, scrollWidth=181. A 390/768/1440 no desborda. La causa es el ancho interior de la tarjeta y el recorte de Reveal, no overflow del documento. Se prevé ampliar solo el espacio horizontal del encabezado móvil, conservando tamaño tipográfico y padding del resto.

No se requieren dependencias ni cambios en Reveal, Typewriter, política de movimiento, modal, contenido o assets.

### Implementación y contrastes

Se retiraron cuatro líneas de prosa del string de clases de OutlineButton, sin cambiar las utilities de transición, transformaciones ni sus duraciones. El CTA conserva texto, callback y destino Contacto; ahora tiene texto zinc-950 y anillo de foco interior de 2 px, que Reveal no recorta. El saludo usa también zinc-950; footer zinc-400; el selector usa zinc-300 para el idioma inactivo y green-300 para el activo. No se modificó la paleta global.

LinkedIn y GitHub tienen subrayado persistente con separación de 2 px; conservan destinos, textos, target y rel. El wrapper exclusivo del título Contacto usa márgenes horizontales de -16 px por debajo de sm. Recupera 32 px dentro del padding existente, sin reducir la fuente ni modificar el resto de la tarjeta. Reveal global permanece intacto.

Ratios calculados con luminancia relativa sRGB de los colores computados en navegador; para el indicador se compone green-400 al 20 % sobre el fondo del selector. Hover real del selector y del CTA inspeccionado, incluidos sus pseudo-elementos. Focus conserva los mismos colores de texto/fondo.

| Elemento/estado | Antes | Después | Colores finales y umbral |
| --- | --- | --- | --- |
| Saludo, 24 px bold | 1.74:1 | 11.42:1 | #09090b / #4ade80; mínimo 3:1 |
| Idioma inactivo normal/focus | 3.08:1 | 10.08:1 | #d4d4d8 / #27272a; mínimo 4.5:1 |
| Idioma inactivo hover | 2.16:1 | 7.07:1 | #d4d4d8 / #3f3f46; mínimo 4.5:1 |
| Idioma activo normal/focus | 5.47:1 | 6.79:1 | #86efac sobre indicador compuesto; mínimo 4.5:1 |
| Idioma activo hover | 4.05:1 | 5.02:1 | #86efac sobre indicador compuesto; mínimo 4.5:1 |
| Footer, 14 px | 3.67:1 | 6.91:1 | #a1a1aa / #18181b; mínimo 4.5:1 |
| CTA normal/focus, 14 px | Oculto; combinación prevista 1.59:1 | 11.42:1 | #09090b / #4ade80; mínimo 4.5:1 |
| CTA hover | Oculto; combinación prevista 3.30:1 | 6.04:1 | #09090b / #16a34a; mínimo 4.5:1 |
| Anillo interior del CTA | No alcanzable | 11.42:1 normal; 6.04:1 hover | #09090b contra superficie verde; mínimo 3:1 |

Los enlaces de Contacto conservan verde sobre zinc-800 (8.55:1); la corrección de A08 es el indicador persistente, no un cambio de color. El foco global verde conserva 10.17:1 contra su offset zinc-900. No se alteraron bordes ni estados de navegación fuera de alcance.

### QA técnico y funcional

| Comprobación | Resultado |
| --- | --- |
| Runtime | Node 24.19.0 / npm 11.17.0, mediante FNM |
| npm ci | Exit 0; 385 instalados / 386 auditados; lockfile y manifiesto intactos; scripts pendientes sin aprobar |
| npm run qa | Exit 0; ESLint sin errores ni warnings; build Next 16.4.1 con Webpack correcto, / y /404 estáticos |
| npm audit --json | Exit 1; 9 afectados: 7 altos y 2 moderados; 0 críticos, sin variación |
| npm audit --omit=dev --json | Exit 0; 0 afectados, sin variación |
| git diff --check | Correcto; avisos previos LF/CRLF en copia local, sin normalización masiva |
| Alcance | Solo seis componentes y este informe; sin cambios en dependencias, assets, traducciones, Typewriter, Reveal, modal, navegación o estilos globales |
| HTTP | /, cv.pdf, resume.pdf, og-image.jpg, robots.txt y sitemap.xml: 200 |
| Metadatos | Canonical y todos los tags OG/Twitter iguales al HTML de producción; cuatro schemas conservados |
| Consola | Sin warnings ni errores capturados en las sesiones locales de QA |

Continúan los avisos previos de ESLint 9 sin soporte, React 18 deprecado en Next 16 y allowScripts pendiente para unrs-resolver@1.11.1. No se ejecutó audit fix, no se aprobó ningún script y no se cambió el gate de seguridad. Los nueve afectados de tooling siguen siendo deuda, sin aceptación permanente.

| Viewport × 900 | Documento/clientWidth | Título Contacto antes → después | Fuente del título | Selector |
| --- | --- | --- | --- | --- |
| 320 | 305 / 305 px | 155 px, scrollWidth 181 → 187/187 px | 36 px, intacta | 64 px |
| 390 | 375 / 375 px | 225 → 257/257 px | 36 px, intacta | 64 px |
| 768 | 753 / 753 px | 512 → 512/512 px | 48 px, intacta | 64 px |
| 1440 | 1425 / 1425 px | 512 → 512/512 px | 48 px, intacta | 64 px |

Los 15 px restantes corresponden a la barra vertical; no hay overflow horizontal. Se revisaron hero y Contacto, EN/ES, en móvil, tablet y escritorio. CTA visible de 120×38 px, con texto traducido, sin duplicados. Se comprobó Tab desde CV al CTA y foco interior visible; Enter en EN/ES y Espacio en EN desplazan a Contacto. El destino queda a aproximadamente 274 px del borde superior a 320 px y 416 px en escritorio por el límite inferior de scroll, conservando el callback original. LinkedIn y GitHub mantienen subrayado y foco verde al recorrerlos con teclado. Selector responde a Enter/Espacio y mantiene ambas opciones completas. El correo conserva la corrección 5B.

Smoke del modal: Plenitud Fit en móvil y escritorio, nombres EN/ES, foco inicial en cierre, Tab/Shift+Tab dentro del diálogo, Escape y restauración del disparador/overflow. Se abrieron y cerraron también CFR Estudio, Revisión Automotriz y AltasWeb con foco restaurado al disparador correspondiente. No se modificó la implementación del modal.

### Axe y revisión manual de incomplete

Se reutilizó axe-core 4.11.1 existente, sin instalar paquetes, con los mismos tags WCAG/best-practice de 5B. Proxy temporal fuera del repositorio: build local 3110, auditoría 3111. No se deshabilitaron reglas; resultados completos y capturas quedan como artefactos locales en `~/.codex/visualizations/portfolio-stage5c/`.

- Documento cerrado EN/ES, móvil/escritorio: ya no se reportan color-contrast en los tres elementos de A05 ni link-in-text-block en Contacto. Persisten cuatro reglas previas: heading-order, landmark-main-is-top-level, landmark-no-duplicate-main y landmark-unique. Muestras cerradas: 38 reglas aprobadas; el número de incomplete varía según visibilidad y solapamientos.
- ES, Contacto a 320 px y escritorio: muestras con cero incomplete y las cuatro reglas anteriores. No equivale a conformidad global.
- EN, Plenitud Fit abierto a 320 px: cero violaciones en documento y diálogo acotado; 17 reglas aprobadas en el diálogo. Dos párrafos de contraste incomplete por solapamiento, conservados para revisión manual.
- CTA: axe puede dejarlo incomplete por el pseudo-elemento. Se inspeccionaron texto, fondo y fill; las combinaciones estables y el relleno conservan al menos 6.04:1. Anillo interior comprobado mediante teclado y captura, sin depender de una aprobación automática.
- Modal: se inspeccionaron rectángulos, pila de elementos y ancestros de los párrafos en escritorio. Opacidad 1, sin otro elemento sobre el centro del texto y tarjeta opaca #18181b: texto #d4d4d8 alcanza 11.99:1. La revisión manual sustenta esa muestra, sin borrar los incomplete originales del modal móvil.
- Hero: h1, Typewriter y descripción pueden quedar incomplete porque se superponen a DotGrid. Se revisaron DOM, captura y código, que permanecen intactos. Sobre fondo base cumplen; la cuadrícula tiene gradientes, opacidad y estados interactivos, por lo que no se da una aprobación global. Como límite conservador con zinc-400 al 50 % sobre zinc-900, el verde puede bajar a 3.78:1 y la descripción a 4.46:1 si coinciden con píxeles claros. Es una hipótesis residual preexistente que requiere comprobar coincidencia de glifos/píxeles; no una regresión demostrada de 5C. No se alteró DotGrid, Typewriter ni movimiento para cerrar artificialmente este resultado.

### Resultado y pendientes

U01, A05 (tres combinaciones documentadas), A08 y el recorte de Contacto a 320 px quedan corregidos en el alcance comprobado. Cambios visuales localizados previstos: CTA recuperado, texto de mayor contraste, subrayado persistente y título completo. Se mantienen identidad, tamaños, contenido y tiempos de animación.

Persisten A02/movimiento, A06 parcial, A07/landmarks, mejoras opcionales y el contraste del hero sobre fondos decorativos variables pendiente de comprobación específica. No se ejecutó lector de pantalla real, zoom nativo 200/400 %, Safari/Firefox ni dispositivos físicos; las limitaciones de 5B siguen vigentes. No se declara conformidad WCAG completa ni seguridad total del proyecto. No se hizo merge ni despliegue manual.

## 13. Etapa 5E — navegación y semántica, 17 de octubre de 2026

Base verificada: main `327e827bc8efe3cdfa530658f8b0daf6a35cbd00`, limpio y sincronizado tras fetch. Rama `fix/portfolio-navigation-semantics`. Se conservan las conclusiones históricas: las etapas de movimiento posteriores a 5C están documentadas en motion-accessibility-audit-2026-10.md y PR #7–#11. Esta sección registra únicamente el nuevo alcance 5E, sin actualizar librerías ni lockfile.

### Diagnóstico previo y clasificación

| Hallazgo | Estado / evidencia | Corrección acotada |
| --- | --- | --- |
| Navegación desactualizada tras EN/ES | Defecto confirmado: SideBar observa una única colección de nodos con efecto de dependencias vacías. AnimatePresence reemplaza las secciones después del fade; el observer queda ligado a los nodos retirados. En producción, ES a 320: Contacto visible a top 273.5 px, pero Proyectos seguía marcado tras Control+End. | Seguir la posición de lectura y renovar la colección cuando cambian realmente los nodos. |
| Umbral imposible para secciones largas | Defecto confirmado: Experiencia EN mide 5266 px a 320 × 900; su máxima intersección posible es 900/5266 = 0.171, inferior al threshold 0.3 anterior. | No exigir un porcentaje de la sección completa. |
| Estado activo solo visual | Confirmado: cero aria-current en el baseline (parte de U02). | aria-current=location exclusivamente en el enlace actual; ninguno en el hero. No se añade un fallo WCAG automático por la ausencia histórica del atributo. |
| Main duplicado y saltos h2→h4 | A07 confirmado por código y DOM: dos main anidados; competencias y proyectos h4; modal h4. Avisos best-practice relacionados con 1.3.1, no equivalencia automática a incumplimiento normativo. | Wrapper de fuente div con la misma clase; un main estable; competencias/proyectos h3 y título del diálogo h2, conservando todas las clases. |
| Nombres funcionales en inglés bajo html.lang=es | A06 confirmado: navegación, hero, selector, aperturas/enlaces/alternativas de proyectos. | Nombres EN/ES mediante el contexto existente; marcas, destinos, contenido visible y gestión del modal se conservan. |
| Mover foco desde cada enlace ancla al contenido | Mejora opcional, no defecto confirmado por conservar el foco en un enlace nativo. | Sin cambio: Tab/Shift+Tab y Enter siguen operando los enlaces existentes. |
| Empresas como encabezados; patrón de acción/aria-pressed del selector | Mejoras opcionales de la auditoría anterior. No se demostró un nuevo bloqueo funcional. | Sin cambios en esta etapa; el selector solo traduce su nombre. |
| Lectura real, zoom nativo, dispositivos físicos y otros motores | Pendientes no verificados. | Mantener la limitación, sin afirmar conformidad WCAG integral. |

### Implementación y ciclo de vida

SideBar reemplaza el IntersectionObserver porcentual por un listener pasivo de scroll y un listener de resize, agrupados en un único requestAnimationFrame pendiente. Se leen cuatro rectángulos por actualización, tomando la altura real del header como línea de lectura; en los espacios entre secciones se conserva la sección precedente y, al alcanzar el fondo, se reconoce Contacto aunque sea demasiado corto para llegar al header. No hay un bucle de animación permanente ni actualización del hash durante scroll manual.

Un MutationObserver limitado al main estable detecta cambios en identidad/cantidad de las secciones. Solo al reemplazarse esa colección solicita recalcular: no depende del instante de cambio de idioma, que precede al remount con mode=wait. Se conserva el feedback inmediato del enlace y la posición actual pasa a seguir el scroll real. El cleanup desconecta el observer, retira ambos listeners y cancela el frame pendiente. No se modifica AnimatePresence, Typewriter, DotGrid, Reveal, controles de movimiento, foco/portal/Escape/scroll lock del modal ni estilos globales.

La fuente continúa heredándose desde el mismo wrapper y con la misma clase. Los cambios de nivel de encabezado mantienen las clases y el reset de Tailwind. No se agregan tabIndex positivos, controles artificiales, dependencias, exclusiones ni reglas deshabilitadas. El main único también ofrece un destino estable al seguimiento de navegación.

### Validaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Instalación limpia | `npm ci --ignore-scripts` PASS: 385 instalados / 386 auditados, Node 24.19.0 y npm 11.17.0. No se aprueban scripts pendientes. |
| Calidad | `npm run qa` PASS: lint y build Webpack, exit 0; / y /404 generados. Lint repetido tras ajustar el arnés. |
| Movimiento y navegación controlados | `npm run qa:motion` mediante Run controlled tests: **47/47**, 36 anteriores y 11 nuevos. hydrationErrors=[], pendingTimers=0, listeners=0, exit 0. |
| Cobertura nueva del arnés | Hero sin selección falsa, cuatro secciones, remount posterior al cambio de idioma, cinco remounts repetidos, una pareja de listeners y un observer propios, ambas direcciones de preferencia, final de documento y cleanup. React/DOM/MutationObserver/frames son reales; geometría, scrollY y matchMedia son controlados. No es validación nativa de medios ni navegador completo. |
| Navegación del build | 32 recorridos de enlaces por Enter: EN/ES × cuatro secciones × 320/390/768/1440 × 900. Posición y selección estabilizadas, aria-current correcto y sin overflow. |
| Scroll de teclado | Ocho recorridos adicionales: Control+End desde Proyectos después del remount selecciona Contacto; PageDown dentro de Experiencia mantiene su estado actual en los cuatro anchos. Reproducción inicial ya no falla. |
| Idioma y semántica | Seis cambios rápidos EN/ES en móvil: cuatro secciones finales, un main, cero main anidados, encabezados sin h4 intermedios y nombres/alternativas de proyectos en ES. Pausa manual conservada y rol primario completo. |
| Foco y controles | Tab desde Sobre mí a Proyectos y Shift+Tab de vuelta; anillo visible de foco calculado, Enter en enlaces y Espacio en selector. CTA lleva a Contacto, seleccionado por el seguimiento. |
| Modal | Cuatro proyectos × 320/1440: aperturas con nombres traducidos, h2 asociado al diálogo, foco en cierre, Shift+Tab al enlace, Escape y restauración de foco/overflowY; sin modificar su gestión. |
| DotGrid | 500 puntos, onda normal real con 500 targets y opacidad observada hasta 1. Casos de cancelación/reduce conservados en las 36 pruebas anteriores. |
| Consola | Sin errores/warnings capturados en la sesión del build local. SSR/hidratación del arnés sin errores. No se declara lectura real con tecnología de asistencia. |
| Seguridad | Completa: FAIL, exit 1, **9 afectados: 7 altos y 2 moderados**. Sin desarrollo: PASS, exit 0, **0 afectados**. Gate completo pendiente y deuda sin aceptación permanente. |
| Diff / CSS | `git diff --check` PASS. El CSS de utilidades varía solo por la generación automática de `.resize{resize:both}` al aparecer el nombre de evento resize: 21987→22007 bytes. Al retirar esa única regla, el texto es idéntico al CSS productivo del baseline; ningún elemento usa esa clase. No se modifican estilos ni paleta. |

Los intentos iniciales del arnés ampliado no se marcaron como PASS: Next/Link necesita constantes de entorno de su compilador, suministradas ahora solo al fixture con DefinePlugin ya disponible en Next; la simulación de media queries se limitó al query exacto del hook. Otra aserción contaba un listener resize compartido de Framer además del propio: se inspeccionó la librería y se acotó el seguimiento al callback de SideBar, sin retirar comprobaciones de cleanup del componente. Se repitió la suite completa hasta 47/47. No se modificó producto para ocultar esos fallos auxiliares ni se instalaron herramientas.

La automatización de enlaces también se ajustó al href real de Next (`/#sección`) y a una posición de lectura estabilizada, sin exigir que el rectángulo quedara exactamente en top=0 durante el scroll suave o su anclaje. Las comprobaciones contrastan geometría y estado actual, además del clic inicial.

### Evidencia, riesgos y aceptación pendiente

Artefactos fuera de Git: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-5e/`: baseline.json y baseline-contact-stale.jpg; controlled-tests.json; navigation-matrix.json; manual-scroll.json; semantics-es-after-six-toggles.json; modal-smoke.json; wave.json; console.json; css-comparison.json; qa.log; auditorías JSON y capturas EN/ES de Contacto en cuatro anchos y del hero. Son muestras de diagnóstico, no un diff sincronizado de píxeles.

La consulta nativa disponible devuelve reduce=false y las capacidades del navegador integrado no exponen emulación Rendering. **Reduce nativo de 5E: NOT RUN.** Antes del merge, en Brave activar Rendering → prefers-reduced-motion reduce, confirmar matchMedia=true y recorrer las cuatro secciones, scroll manual, EN/ES repetido y final de documento; pasar reduce→no-preference→reduce sin recargar y verificar aria-current/foco, pausa y modal. La aprobación manual de Oscar de 5D.4 es histórica y no se reutiliza como una prueba nueva de 5E.

Riesgos acotados: la política de sección actual en huecos y al final del documento queda ahora explícita; validar con lector real la utilidad de aria-current y nombres traducidos. Los nombres de empresas como headings, el patrón del selector y posibles mejoras de foco del destino siguen opcionales. Persisten lector real, zoom nativo, dispositivos físicos y deuda de seguridad. No se instala axe ni se afirma una nueva auditoría axe en esta etapa. Warnings previos: ESLint 9 sin soporte y React 18 deprecado en Next 16; no se ocultan. Se prepara PR Draft, sin merge, despliegue manual ni cambios de dependencias.
