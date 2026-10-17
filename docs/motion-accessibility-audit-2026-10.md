# Auditoría de animaciones y movimiento accesible — Etapa 5D.1

Fecha: 16 de octubre de 2026. Estado: diagnóstico local, sin seguimiento ni implementación. Referencia: WCAG 2.2 A/AA; las recomendaciones AAA se identifican aparte.

## 1. Resumen y baseline

`main` limpio al comenzar, sincronizado 0/0 con `origin/main`, ambos en `217fff056a0b3422e75bd71b6c2052ffa423ca68`. Se actualizaron referencias remotas. No hay AGENTS.md local ni marker `.altasweb/standard.json`; se aplicaron las instrucciones generales suministradas y las restricciones de esta etapa, sin intentar normalización.

Runtime comprobado: Node 24.19.0 / npm 11.17.0 mediante FNM. Instalados y declarados en el lockfile: Next 16.4.1, React 18.3.1, Tailwind 3.4.19, ESLint 9.39.5, **Framer Motion 11.18.2 y Anime.js 3.2.2**. Pages Router, Webpack explícito. Producción examinada: https://oscaralcalde.vercel.app/.

La barrera principal confirmada es el Typewriter automático, indefinido y sin pausa. No existe una política propia de movimiento reducido en JS o CSS. Hay deuda de cleanup en sus temporizadores y en Anime.js. DotGrid es interactivo, no un fondo animado continuamente. Su contraste variable sigue pendiente de medición de coincidencia real entre puntos y glifos.

**Limitación esencial:** se probó realmente `no-preference` (`matches=true`, `reduce=false`). No se consiguió activar `reduce` mediante las herramientas disponibles. El navegador anuncia únicamente capacidades viewport/visibility y pageAssets/webmcp, sin emulación de medios; las APIs de control nativo están deshabilitadas. No se cambió la preferencia global de Windows ni se falsificó matchMedia. **La columna reduce de QA queda pendiente, no aprobada.** La ausencia de adaptaciones se confirma en código, pero no sustituye esa prueba.

## 2. Inventario completo

Duraciones nominales del código/librerías; no son mediciones de frames o garantías de reloj real. No se encontraron otras animaciones propias en páginas, componentes, contexto, CSS o SVG públicos examinados. No hay canvas, vídeo o animaciones SVG en la interfaz renderizada. No hay gestos Framer whileHover/whileTap/drag: el hover de proyectos usa estado React y CSS.

| Animación y ubicación | Disparador y duración | Repetición/finalidad | Comportamiento y riesgo actuales |
| --- | --- | --- | --- |
| Escritura/borrado — `src/components/util/Typewriter.jsx:17–72`, Hero | Montaje y cambio de rol. 100 ms por carácter al escribir, 50 ms al borrar | Indefinida; presentar dos perfiles profesionales | Siempre activa; sin pausa ni rama reduce. Actualizaciones del h2 y posible wrapping móvil |
| Cursor — `Typewriter.jsx:78`; keyframes pulse de Tailwind | Montaje; ciclo de 2 s, opacidad 1 → .5 → 1 | Infinita; estética de terminal | No respeta reduce y no se pausa por separado; expone también el carácter `|` al árbol accesible |
| Cambio de idioma real — `src/components/index.jsx:38–53`; `LanguageContext.jsx:343–350` | Cambio de transitionKey; fade out .3 s y fade in .3 s con mode=wait | Cada EN/ES; continuidad visual | Desmonta y monta todo el bloque Hero/About/Projects/Experience/Contact. Reinicia animaciones locales y Typewriter; header/sidebar permanecen |
| LanguageTransition — `src/components/util/LanguageTransition.jsx:3–15` | Fade .3 s de entrada/salida si se utilizara | Utilidad potencial | **No se importa ni se monta** en el proyecto actual. No confundirla con el cambio real anterior; no hace falta refactorizarla para esta tarea |
| Reveal principal — `src/components/util/Reveal.jsx:18–46` | useInView once; y=75 → 0 y opacidad 0 → 1; .5 s con delay .25 s | Una vez por instancia; entrada de contenido | Muy extendido: hero, títulos, About/Stats, proyectos, cada campo/párrafo de experiencia y Contacto. Se repite tras remount de idioma. Contenido comienza invisible |
| Barrido de Reveal — `Reveal.jsx:49–58` | left=0 → 100%, .5 s easeIn | Una vez por instancia; énfasis verde | Rectángulo que tapa temporalmente contenido. JS controla left; una regla CSS genérica de transition no basta |
| Entrada de proyecto — `src/components/projects/Project.jsx:34–52,72–77` | useInView once; y=100 → 0 y opacidad 0 → 1, .75 s | Una vez por instancia | Se combina con Reveal en sus descendientes; movimiento compuesto, sin tratamiento reduce |
| Hover de captura — `Project.jsx:82–95` | onMouseEnter/Leave: ancho 85% ↔ 90%, rotate 0 ↔ 2deg; transition-all .15 s | Cada entrada/salida del puntero; feedback | Ancho provoca trabajo de layout y rotación desplaza imagen. Captura móvil con puntero también aplica el efecto; no se probó touch físico |
| Entrada de sidebar — `src/components/nav/SideBar.jsx:51–54` | x=-70 → 0, .5 s | Montaje de navegación | Traslación no esencial, sin reduce |
| Entrada de enlaces de sidebar — `src/components/nav/SideBarLink.jsx:24–27` | x=-70 → 0, .5 s con delay .1 s | Montaje de cada enlace | Puede componerse con la traslación de su nav. Colores/opacidad/borde de selección usan transition-all .15 s |
| Modal — `src/components/projects/ProjectModal.jsx:30–72,96–99` | Cada apertura; y=100 → 0 y opacidad 0 → 1 | Entrada de tarjeta; cierre por desmontaje inmediato, sin exit animado | Sin transición explícita: Framer 11 usa spring para y (stiffness 500, damping 25, restSpeed 10), sin duración fija, y .3 s para opacidad. Foco inicial en cierre fuera de la tarjeta; gestión modal no depende de esperar la animación |
| Onda DotGrid — `src/components/hero/DotGrid.jsx:16–46` | Click; scale hasta 1.35 y regreso a 1; y=-15 y final 1 px; opacidad hasta 1 y final .5. Cada secuencia: 250+500 ms, con stagger de distancia ×100 ms | Una ejecución por click, sin loop; respuesta decorativa | Anime.js modifica transform/opacity de 500 puntos mediante selector global. No se conserva instancia ni hay cleanup/cancelación por preferencia |
| Hover de puntos — `DotGrid.jsx:56–62` | Puntero; fondo del wrapper a zinc-600, transition-colors .15 s | Feedback decorativo | Gradiente del punto cambia de zinc-700/zinc-400 a verde/blanco; no se garantiza interpolación del gradiente. Modifica luminancia |
| Selector EN/ES — `src/components/buttons/LanguageToggle.jsx:24–38` | Cada cambio; left y width del indicador, y colores/borde, .3 s | Feedback de selección | Movimiento CSS independiente de Framer; permanece aun si se usa MotionConfig |
| CTA — `src/components/buttons/OutlineButton.jsx:19–34`, `hero/Hero.jsx:53` | Hover: pseudo-elemento desde 150%/150% a 0/0, scale 2.5, 1 s. Otras propiedades .3 s; active scale .95 | Cada hover/activación; feedback | Movimiento CSS independiente. Mantener contraste y anillo interior corregidos en 5C; con reduce el feedback puede ser instantáneo |
| Scroll suave — `src/styles/globals.css:24–26`, anclas sidebar y `Hero.jsx:51` | Activar enlace o CTA; duración decidida por navegador | Cada navegación | html usa smooth incondicionalmente. El modal usa explícitamente instant al bloquear/restaurar scroll y al contener Tab: conservarlo |
| Transiciones menores — Header CV, contacto/correo, enlace modal, íconos de proyecto | Hover/focus/selección; .15 s por defecto, salvo .3 s explícitos arriba | Feedback, sin repetición automática | Principalmente color; menor riesgo vestibular. No eliminar estados ni foco al reducir movimiento. Enlaces sociales sin transition cambian color inmediatamente |

Datos adicionales: DotGrid contiene 25×20 puntos y sus wrappers, es decir, 1.000 div para la decoración. En 320×900: hero de 219 px, grid de 164.25 px, contenido horizontal de 600 px; **140 círculos intersectan el rectángulo del hero**, pero siguen existiendo y siendo animados los 500. El clipping del hero evita overflow del documento (305/305 px). Esto es evidencia de trabajo potencial, no una medición de FPS, consumo o LCP.

Se calculó el stagger con la función de Anime.js instalada, sin DOM ni modificar el producto: desde índice 0, delay máximo 3061 ms y total nominal 3811 ms; desde índice 237, 1562+750=2312 ms. No significa que una pulsación anime continuamente el sitio ni que todos los puntos parpadeen a la vez.

## 3. Hallazgos clasificados

### M01 — Typewriter sin mecanismo de pausa

**Problema confirmado, alto; WCAG 2.2.2 A.** Escritura/borrado y cursor arrancan solos, se repiten junto a contenido estático y no son esenciales para usar el portfolio. No existe botón ni otra forma de detenerlos. La escritura es también información autoactualizada: para esa parte del criterio no existe la excepción de cinco segundos. El cursor continuo supera ampliamente ese tiempo. Atender reduce por sí solo no proporciona pausa a los demás usuarios.

Evidencia: h2 cambiante en el árbol accesible; se observaron fragmentos, ambos roles y borrado. Cursor calculado `2s ... infinite pulse`; la lista real de botones no contiene pausa. Corregir en primer lugar, sin eliminar la animación normal.

### M02 — Ausencia de tratamiento de movimiento reducido

**Problema confirmado de implementación/UX, medio; requisito de producto de esta auditoría.** No hay matchMedia, useReducedMotion, MotionConfig, media queries reduce ni utilities motion-reduce/motion-safe en src. Framer instalado tiene reducedMotion="never" por defecto. No inferir que cada traslación incumpla AA: desactivar animaciones de interacción corresponde específicamente a **2.3.3 AAA**, además del requisito solicitado por el usuario. El comportamiento real bajo reduce sigue sin comprobarse.

### M03 — Cleanup incompleto y temporización del Typewriter

**Deuda técnica confirmada, media; consecuencia visual de callbacks tardíos pendiente de aislamiento.** El timeout exterior de `Typewriter.jsx:49` se cancela en línea 72; el interior de línea 56 no se guarda ni cancela. Puede sobrevivir hasta unos dos segundos al cambio de efecto/desmontaje. No se afirma fuga permanente ni warning de React observado.

`roles` se recrea en cada render y figura en dependencias del efecto. Si hay renders extra mientras el texto está completo, pueden programarse callbacks interiores adicionales. El cambio EN/ES resetea estado durante render y el wrapper con key vuelve a montar el componente. Se observó un fragmento ES seguido por el reinicio vacío alrededor de esa transición; no se atribuye ese reinicio al borrado normal.

La pausa nominal tras completar un rol es **100 ms del timeout exterior + 2000 ms del interior = 2100 ms**, no exactamente 2000 desde el último carácter. La rama 1500 ms de pauseBeforeDelete nunca se utiliza para programar ese callback, porque está dentro de !isDeleting. El comentario que dice escribir más rápido que borrar contradice 100/50 ms. Una corrección futura debe conservar el ritmo normal real, no cambiarlo por accidente al simplificar timers.

### M04 — Representación accesible parcial del rol

**Problema confirmado de estructura, medio; lectura concreta con lector pendiente.** El h2 expone el texto parcial, prefijo `>` y cursor `|`; no tiene alternativa completa estable, aria-hidden en la decoración ni aria-live. No se afirma que un lector anuncie cada carácter automáticamente: esa conducta no se probó y no hay live region.

Recomendación: ambos roles existentes completos y estables en el nombre/contenido accesible del encabezado, sin duplicaciones; texto visual animado y cursor decorativos fuera del árbol accesible. No añadir aria-live para anunciar cada pulsación de timer.

### M05 — Ciclo de vida y trabajo de DotGrid

**Deuda técnica confirmada, media; impacto de rendimiento cuantitativo pendiente.** Un click real escribió estilos en los 500 puntos. Se capturó scale 1.33066, translateY -14.1161 y opacity .972378; al terminar quedaron scale 1, translateY 1px y opacity .5. Sin clicks, los puntos quedaron estáticos.

No hay ref de instancia, alcance local de targets, anime.remove ni cleanup al desmontar. Las ejecuciones conservan referencias a nodos aunque el idioma reemplace el grid; pulsaciones rápidas pueden iniciar instancias competidoras. Su duración es finita: no se presenta como fuga infinita. Cancelar al desmontar o entrar en reduce, restaurar estilos estáticos y limitar targets a la instancia son medidas localizadas. No reemplazar el grid por canvas ni optimizar cantidad de puntos sin evidencia y autorización.

### M06 — Contraste variable del hero

**Hipótesis pendiente, impacto potencial alto; WCAG 1.4.3 AA.** Ya registrada en 5C. Se confirmaron gradientes, hover y cambio de opacidad; no se completó una medición por glifos y frames. Valores de luminancia calculados de colores subyacentes, sin redondear para decidir conformidad:

| Cota de fondo | Verde #4ade80 | Descripción #d4d4d8 | Interpretación |
| --- | --- | --- | --- |
| Base #18181b | 10.167:1 | 11.99:1 aprox. | Cumple sobre la base |
| Extremo zinc-400 al .5 sobre base | 3.782:1 | 4.459:1 | Si coincide con glifos, insuficiente para texto normal |
| Extremo zinc-400 opaco durante onda | 1.471:1 | 1.734:1 | Cota desfavorable; falta localizar coincidencias reales |

El subtítulo móvil es de 20 px y peso normal: exige 4.5:1, no 3:1. El h1 grande y el subtítulo de escritorio se evalúan según tamaño/peso real. Hover llega a blanco y fondo zinc-600, pero **no se asume que el blanco pueda aparecer bajo cualquier letra**: h1/h2/p/CTA tienen pointer-events:auto y pueden interceptar el puntero. La onda disparada en un punto libre sí alcanza puntos situados detrás de esos rectángulos. Hay que verificar geometría e hit testing, además de la composición.

Procedimiento reproducible para cerrar este riesgo, sin cambiar diseño:

1. Usar el mismo commit, Inter cargada, zoom 100 %, DPR registrado, 320/390/768/1440×900, EN/ES y ambos roles completos. Registrar media preference antes de cada sesión.
2. Mapear rectángulos de texto y puntos que realmente se superponen. Distinguir rectángulo de texto y tinta de glifo; comprobar quién recibe el puntero, no forzar un hover imposible.
3. Capturar reposo, hover alcanzable y una onda desde punto libre; incluir pico de opacidad, desplazamiento y final. Capturar secuencia temporal suficiente, no solo un frame final ni un ratio promedio.
4. Tomar colores de primer plano definidos y composición de fondos efectivos (gradiente, alpha, padres y z-index). Usar capturas para localizar coincidencias; evitar medir antialiasing del borde de letras como si fuera el color de texto definido.
5. Calcular el mínimo en cada coincidencia, comparar con 4.5/3 según corresponda y guardar viewport, rol, punto, frame y ratio. Revisar también el modo estático y el foco.
6. Si falla, presentar una corrección localizada de aislamiento del texto/fondo para aprobación. No decidir ahora cambiar paleta, opacidad global o eliminar la cuadrícula.

### M07 — Compatibilidad real de useReducedMotion

**Deuda/limitación técnica confirmada, media, relevante para la propuesta.** En Framer 11.18.2, `dist/es/utils/reduced-motion/use-reduced-motion.mjs:37` usa useState(prefersReducedMotion.current) sin setter ni suscripción React. Su comentario promete actualización activa, pero el cuerpo no la implementa. El listener global cambia el valor mutable; no provoca por sí mismo un render de cada consumidor. VisualElement calcula shouldReduceMotion al montar.

El hook existe y sirve para una lectura inicial; **no aprobar cambios de preferencia en caliente basándose en él o en la documentación actual de Motion**. No actualizar la librería para resolver esta auditoría. Para una política reactiva, resulta más predecible un hook pequeño con matchMedia y suscripción/cleanup correctos, usando APIs de React 18.

### M08 — Observador de navegación tras cambio de idioma

**Deuda de UX confirmada, media; fuera de la corrección de movimiento propuesta.** `SideBar.jsx:24–46` observa secciones una sola vez; el bloque con key en index las reemplaza. Reproducción registrada: seleccionar About, cambiar EN→ES y activar CTA a Contacto sin tocar su enlace de sidebar; Contacto queda visible a y=416 mientras el enlace seleccionado sigue siendo Sobre mí. Pulsar Proyectos sí cambia la selección por el handler. No es una trampa de teclado ni un bloqueo de navegación, pero no debe darse por válida la sincronización automática del resaltado después del remount.

### Otros riesgos y mejoras

- **Hipótesis, media:** foco que cae en un descendiente aún transparente/desplazado por Reveal; probar arranque y cambios rápidos de idioma, no deducir fallo solo de initial=hidden. El foco del CTA en la muestra móvil estable sí fue visible.
- **Hipótesis, media:** wrapping del Typewriter puede cambiar altura del hero y posición vertical del grid centrado al 50 %. No se midió CLS ni se certificó toda la secuencia; incluir ambos roles completos en pruebas de reflow.
- **Pendiente, potencial alto:** destellos con ondas superpuestas/pulsaciones rápidas. El cursor tiene ciclo de 2 s y una onda aislada no es un estrobo periódico; no basta para certificar 2.3.1. Falta análisis temporal de flashes, luminancia y área; no se realizaron pruebas de estrés con exposición repetida.
- **Mejora opcional, baja:** simplificar movimiento de hover, desplazamientos y barridos cuando el usuario pide reduce, conforme a 2.3.3 AAA. Es también un requisito de producto solicitado, aunque no todo sea un fallo AA.
- **Deuda técnica, baja:** LanguageTransition sin consumidores y comentarios desactualizados; no justifican limpieza/refactor en esta etapa.

## 4. Estrategia técnica por componente

| Área | Herramienta propuesta | Normal, conservado | Reduce, objetivo aún no implementado | Riesgo/QA |
| --- | --- | --- | --- | --- |
| Preferencia | Un hook pequeño y compartible con matchMedia + useSyncExternalStore, disponible en React 18; subscribe/unsubscribe simétricos | Sin cambiar política ni timings por defecto | Lectura inicial y reacción a change en la sesión | Snapshot SSR determinista, sin window en servidor; probar hidratación y contenido visible antes de resolver preferencia |
| Typewriter | Estado local elevado solo hasta HomPage fuera del bloque con key para conservar pausa; prop vía Hero; timers cancelables | Misma escritura/borrado y ritmo; nuevo botón nativo discreto de pausa/reanudación | Ambos roles completos y estáticos, sin timers de escritura ni cursor pulsante | Pausa no debe perderse al cambiar EN/ES. Evitar estado global nuevo o persistencia en storage innecesaria |
| Texto accesible | Contenido completo estable en h2; decoración aria-hidden, sin live region por carácter | Misma apariencia animada | Mismo contenido profesional, visible estático | Evitar doble lectura; validar lector real. Cambiar idioma traduce ambos roles |
| Reveal | Rama explícita para estado final y ausencia de barrido; useInView para modo normal | Mantener y/opacity, wipe, delay y once | Contenido visible desde el inicio, sin y, delay, wipe ni dependencia de IntersectionObserver para verlo | No resolverlo solo poniendo duration=0 mientras initial sigue oculto; revisar al cambiar preferencia a mitad de entrada |
| Entradas Project/Sidebar/SideBarLink | Misma preferencia reactiva y estados finales explícitos | Valores y secuencias actuales | x/y=0 y opacity=1 desde inicio | No ocultar navegación ni controles; reducir la geometría sin perder selección/foco |
| Idioma real | Ajuste en HomPage/index, no en la utilidad sin uso | Mantener AnimatePresence/key y fade actual | Cambio directo o fade mínimo sin retrasar lectura ni volver a ocultar entradas | Conservar foco en selector y pausa. No reutilizar esta tarea para rehacer la arquitectura EN/ES |
| Modal | Rama de entrada visible sin traslación, conservando dialog y su efecto actual | Spring y fade actuales; cierre inmediato | Tarjeta final desde apertura, sin y ni espera | No tocar focus trap, Escape, fondo inerte, cleanup o scroll instant; probar apertura/cierre rápido y desmontaje |
| DotGrid | Preferencia reactiva en handler; refs locales y cleanup de Anime.js | Mantener una onda normal y su estética; evaluar por separado la superposición de clicks | Mismos puntos estáticos; no ejecutar anime ni cambiar escala/y/opacidad por hover/click | Al entrar en reduce cancelar lo activo y restaurar transform/opacity, no solo detener a medio camino. Contraste estático debe medirse también |
| CSS/scroll | Media query reduce específica para scroll y selectores afectados | Conservar smooth y feedback actual | scroll-behavior:auto; quitar desplazamiento/rotación/escala/pulse, mantener colores/foco | No usar un reset universal que rompa posiciones estáticas o pseudo-elementos. CSS no cancela timers ni Anime.js |
| Indicador idioma/CTA/captura | Reglas reduce localizadas sobre sus movimientos CSS | Mantener .3/.15/1 s y estados actuales | Cambio instantáneo de selección, fondo y feedback sin traslación/tilt/scale | Conservar contraste 5C, click y anillo interior; transformaciones estructurales de posicionamiento no se deben borrar globalmente |

**MotionConfig evaluado, no recomendado como solución única ni necesario para la primera entrega.** reducedMotion="user" puede aportar cobertura a descendientes motion, incluido el portal por contexto React; en la versión instalada se usa para propiedades posicionales (incluye left). No controla el cursor CSS, timers, Anime.js ni scroll, y siguen siendo necesarias decisiones explícitas sobre opacity/delay/barridos. Su reacción en caliente requiere validar el comportamiento real de v11, no asumir el de versiones actuales. La primera corrección puede omitir este wrapper global y evitar cambios transversales opacos.

Para Typewriter, preferir un único scheduler cancelable o conservar ambos handles con cleanup completo. En modo normal conservar 100/50 ms y la pausa efectiva de 2100 ms; no introducir una frecuencia nueva como parte del arreglo. Pausar debe detener escritura, borrado, hold y cursor sin capturar el foco. Reanudar desde estado coherente, sin callbacks viejos. Con reduce prevalece el texto estático; al volver a normal, una pausa manual previa permanece. El botón debe tener nombre EN/ES, Enter/Espacio, foco visible y no exigir mantener hover/foco para seguir pausado. No mezclar nombre de acción cambiante y aria-pressed de significado ambiguo.

SSR y primer render necesitan diseño explícito antes de implementar: una alternativa semántica completa debe existir siempre; una preferencia inicialmente desconocida no puede dejar texto oculto indefinidamente ni producir discrepancias de hidratación. Si el modo reducido muestra ambos roles y ocupa más altura, permitir reflow sin truncar; no reservar arbitrariamente un bloque que altere el modo normal sin revisar su impacto.

## 5. Pruebas realizadas y límites

### Técnica y evidencia

| Comprobación de esta etapa | Resultado |
| --- | --- |
| Git y diff de archivos versionados | main esperado, 0/0; sin cambios de aplicación |
| Versiones instaladas | npm ls: Framer 11.18.2, Anime 3.2.2, React 18.3.1, Tailwind 3.4.19 |
| npm run lint | Exit 0, sin errores ni warnings de lint |
| npm audit --json | Exit 1: 9 afectados, 7 altos/2 moderados, 0 críticos |
| npm audit --omit=dev --json | Exit 0: 0 afectados |
| Cálculo de stagger con Anime instalado | 3811 ms máximo desde esquina, 2312 ms desde índice 237; sin ejecutar animación ni escribir código de aplicación |
| Consola en las dos sesiones productivas | Sin warnings/errores capturados |
| Instalación/build | No repetidos en 5D.1: no hay cambios de código/configuración/dependencias. El cierre 5C validó npm ci y QA sobre el mismo SHA; ese resultado no se presenta como una ejecución nueva |

No se instalaron paquetes ni herramientas, no se aprobaron scripts y no se ejecutó audit fix. La deuda de seguridad de tooling permanece explícita, sin aceptación permanente. Las pruebas de fuente/biblioteca no son sustitutos de un lector de pantalla o de una medición de rendimiento.

Artefactos fuera del repositorio: `~/.codex/visualizations/portfolio-stage5d1/`: muestras JSON del Typewriter EN/ES, geometría móvil y capturas del hero, onda y modal. Las capturas de entrada pueden mostrar deliberadamente un estado intermedio; no prueban que todo el contenido permanezca oculto. Se confirmó después el modal con opacity=1 y transform:none.

### Matriz real de pruebas

| Área | no-preference, comprobado | reduce |
| --- | --- | --- |
| Preferencia del navegador | matchMedia no-preference=true y reduce=false | No se pudo activar; pendiente |
| Typewriter/cursor | Escritura, borrado, reinicio EN/ES y pulse infinito; no existe pausa | Pendiente; código sin rama adaptativa |
| DotGrid | Click real, estilos en 500 puntos y final estático; grid móvil medido | Pendiente; código sin guard ni cleanup |
| Contenido/Reveal | Estado final visible al navegar a About; muestra DOM opacity=1/transform:none y barrido left=100% | Pendiente, no aprobado por inferencia |
| Idioma | EN→ES→EN con teclado, foco en selector, roles traducidos y remount observado | Pendiente; debe repetirse con cambio de preferencia en caliente |
| Scroll/navegación | Anclas/CTA funcionan; CSS smooth; deuda de resaltado tras idioma reproducida | Pendiente |
| Modal | EN móvil y ES escritorio; inicial en cierre, Tab/Shift+Tab al enlace, Escape y restauración del disparador/overflow | Pendiente; no alterar gestión modal al adaptar entrada |
| Hover de proyecto | Se observó ancho 90%, rotate 2deg y transición .15 s | Pendiente |
| Teclado/foco | Tab desde CV al CTA móvil, anillo visible y Enter; selector Enter/Espacio; modal contenido | Pendiente para todas las entradas sin movimiento |
| Lector de pantalla | Árbol accesible inspeccionado; no había NVDA/Narrator activo en comprobación de procesos | Sin sesión real; pendiente en ambos modos |

No se ejecutaron zoom nativo, dispositivos físicos, Safari/Firefox, medición FPS/CPU/LCP/CLS, análisis de video de destellos ni instrumentación de contadores de timers. El navegador de inspección no expone performance.now/document.getAnimations en su alcance de lectura; no se reemplazaron por cifras inventadas. No se inyectaron parches para simular preferencias ni se modificó el DOM para aprobar resultados.

## 6. Interpretación WCAG

- **2.2.2, A:** aplicable al Typewriter/cursor sin pausa; es parte del objetivo AA por incluir nivel A. El botón de pausa no debe depender de conservar el foco. La onda aislada provocada por click no se clasifica automáticamente como animación automática >5 s.
- **2.3.3, AAA:** reducir movimiento no esencial provocado por interacciones es una mejora adicional respecto de AA, y además el comportamiento solicitado por el producto. No se etiqueta su ausencia como un fallo AA genérico.
- **2.3.1, A:** depende de frecuencia, luminancia y área de flashes. No hay una certificación por observar una captura, por tener reduce o por poder detener el efecto. Falta prueba temporal de condiciones desfavorables.
- **1.4.3, AA:** depende de texto y fondo efectivos en los estados reales; no basta contrastar solo contra body ni un promedio de la animación. Las cotas anteriores son hipótesis hasta ubicar la coincidencia real.
- **Teclado y foco, A/AA:** conservar semántica de controles y visibilidad de foco; las interacciones decorativas no requieren convertir 500 puntos en controles de Tab. Las pruebas de lector reales siguen pendientes.

## 7. Implementación incremental y alcance recomendado de 5D.2

**Recomendación para autorizar primero: Typewriter accesible + preferencia reactiva + cursor/scroll, sin modificar todavía DotGrid, Reveal, entradas o modal.** Esta primera entrega es deliberadamente parcial: no permitiría declarar resuelta toda la política de movimiento del sitio.

1. Introducir únicamente el mecanismo pequeño de preferencia reactiva, con cleanup y SSR revisados; sin dependencias nuevas ni cambios de versión. Probar entrada/salida de reduce de verdad antes de aceptar su QA.
2. Corregir los handles del Typewriter, añadir pausa/reanudación y alternativa completa estable; conservar su ritmo normal. Mantener la pausa fuera del subtree con key mediante estado local de HomPage y props a Hero, sin ampliar LanguageContext para un estado ajeno al idioma. Añadir solo los nombres funcionales EN/ES del control.
3. Desactivar pulse en pausa/reduce y usar scroll auto solo bajo reduce. Documentar que el resto de las animaciones permanece pendiente y ejecutar el QA de aceptación.

Archivos previsibles de esa entrega: Typewriter, Hero, HomPage/index, traducciones de LanguageContext, globals.css, un hook pequeño de preferencia y documentación. El control de pausa es la única adición visible necesaria; su ubicación discreta y tamaño/foco se revisarán antes de implementar. Sin nuevos textos comerciales ni rediseño del hero.

Entregas posteriores que requerirán autorización separada:

- Adaptar Reveal, entradas de proyectos/sidebar, cambio de idioma real y tarjeta del modal, conservando su comportamiento normal y la gestión de foco 5B.
- Adaptar feedback CSS de indicador/CTA/captura y DotGrid estático con cleanup/targets locales. Medir contraste del hero con el procedimiento anterior antes de proponer una corrección visual.
- Resolver la deuda del observer de navegación y limpieza de código sin uso en un alcance explícito, no mezclarlas silenciosamente con pausa/temporizadores.

## 8. Criterios de aceptación y riesgos de regresión

Para 5D.2, condiciones mínimas verificables:

1. Capturas EN/ES y 320/390/768/1440 antes/después: animación normal conserva roles, colores, tiempos y navegación; solo se añade el control aprobado.
2. Pausar durante escritura, hold y borrado; esperar más de un ciclo normal y comprobar que texto y cursor no avanzan. Reanudar con Enter/Espacio sin salto de rol ni callbacks pendientes.
3. Pausa persiste al cambiar idioma; texto accesible y nombres del control están completos/traducidos. Al navegar a otra sección no se reanuda automáticamente.
4. Registrar matchMedia con reduce=true de verdad antes de cargar y durante la sesión. Texto completo estático sin cursor pulsante/timers; navegación sin smooth. Al volver a no-preference se respeta la pausa manual previa.
5. Montar/desmontar y alternar rápidamente idioma/preferencia: cero timers huérfanos; suscripciones retiradas correctamente. En una implementación futura se justifican pruebas acotadas con reloj controlado para esos estados, sin añadir ahora herramientas.
6. Validar lector real, nombre accesible del h2, ausencia de anuncios por carácter y de duplicación. Su indisponibilidad se documenta; no se sustituye por axe.
7. SSR/hidratación sin errores, sin texto perdido, recorte u overflow; revisar wrapping de ambos roles y foco al alternar modos. El cambio reduce no se considera probado usando solo viewport o una preferencia simulada por un parche.
8. npm ci, npm run qa, auditorías completas/productivas y diff check en la implementación autorizada; cero cambios en dependencias o animaciones ajenas. No aprobar scripts pendientes.

Para las entregas posteriores: estado final de todos los Reveal visible sin esperar observers en reduce; no traslaciones/barridos/rotación/escala, modal funcional con foco/scroll intactos y DotGrid sin instancias nuevas ni animación remanente al activar reduce. Comprobar también cambios de preferencia durante una animación y continuidad normal tras volver.

Riesgos principales: cancelar una pausa de hold demasiado tarde; reanudar por un remount de idioma; diferencias SSR/cliente; contenido que queda a opacity=0 al desactivar animaciones; borrado global de transform que rompe posicionamiento; modificar sin querer la pausa normal de 2100 ms; pérdida de foco al añadir control o modificar transición modal; layout móvil al mostrar ambos roles estáticos. No se proponen resets globales, nuevas librerías ni refactors generales para evitarlos.

## 9. Fuentes

Consultadas el 16 de octubre de 2026. WAI Understanding/Techniques explican la norma; no son por sí mismas resultados de pruebas del portfolio. La documentación moderna de Motion se contrastó con el código **instalado** de v11 antes de recomendar APIs.

- [WCAG 2.2, norma](https://www.w3.org/TR/WCAG22/).
- [2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html).
- [2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- [1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- [Técnica C39: prefers-reduced-motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).
- [Motion: useReducedMotion](https://motion.dev/docs/react-use-reduced-motion), [MotionConfig](https://motion.dev/docs/react-motion-config).
- [React: useEffect y cleanup](https://react.dev/reference/react/useEffect), [useSyncExternalStore, suscripciones y SSR](https://react.dev/reference/react/useSyncExternalStore).
- Fuentes locales verificadas: `node_modules/framer-motion/dist/es/utils/reduced-motion/`, `context/MotionConfigContext.mjs`, `render/VisualElement.mjs`, `animation/utils/default-transitions.mjs`; `node_modules/animejs/lib/anime.es.js`; defaults de Tailwind 3.4.19.

No se modificó código, configuración, dependencias, diseño o contenido. No se creó rama, commit o PR, ni hubo merge, despliegue o implementación de 5D.2. Único archivo nuevo previsto: este informe local sin seguimiento.

## 10. Implementación acotada — Etapa 5D.2 (16/10/2026)

La sección anterior describe la auditoría 5D.1 sin modificaciones. Esta sección registra la implementación posteriormente autorizada; no reemplaza sus hallazgos históricos ni declara una política global de movimiento resuelta.

### Base y alcance

- Base verificada: main y origin/main en `217fff056a0b3422e75bd71b6c2052ffa423ca68`, sin diferencias en archivos seguidos. Se conservó el informe local sin seguimiento (33.722 bytes, SHA-256 `099f319b3c06db2248f9439210bdaacb62b6d0d97a433c92b18c82e136f4210c`); esta sección se añade al original.
- Rama: `fix/portfolio-accessible-typewriter`. Runtime FNM Node 24.19.0 / npm 11.17.0. No se modificaron dependencias ni lockfile.
- M01: control nativo de pausa/reanudación, con nombre de acción traducido y foco visible, colocado junto al CTA existente. No ocupa ancho del subtítulo. El cursor deja de pulsar al pausar.
- M03: ambos roles completos se exponen mediante texto `sr-only`; escritura y cursor quedan dentro de `aria-hidden`. No se utiliza `aria-live`, ni se anuncia cada carácter.
- M04: un único timeout cancelable por frame, sin timeout interno huérfano. Cleanup al pausar, activar reduce, cambiar idioma o desmontar. El estado de pausa pertenece a HomPage, fuera del contenido que se desmonta por idioma; no se agregó estado global.
- M02, parcial: hook con `useSyncExternalStore`, listener change y snapshot SSR determinista `null`. No se inicia escritura hasta conocer la preferencia real. CSS selecciona el texto completo estático desde el primer render bajo reduce, sin esperar JavaScript. El cursor no pulsa y el scroll pasa de smooth a auto. No hay reset global de animaciones.

### Comportamiento preservado y decisiones locales

Escritura 100 ms/carácter, borrado 50 ms/carácter y hold de 2100 ms antes de iniciar la fase de borrado. Los dos roles, colores, tipografía y cursor normales se mantienen. Pausar conserva el frame actual; reanudar programa el siguiente intervalo de esa fase (si estaba en hold, reinicia sus 2100 ms). No salta al siguiente rol. Cambiar idioma estando pausado muestra el primer rol completo traducido, sin arrancar timers ni perder la pausa. Navegar entre secciones no reanuda la animación.

Al activar reduce, CSS muestra los dos roles completos, oculta la representación animada y detiene el cursor; el hook cancela el timeout. La representación animada conserva su frame para un eventual retorno a no-preference y respeta la pausa manual. El control permanece enfocable con `aria-disabled` y explicación traducida; no cambia la pausa mientras reduce está activo. Esta lógica fue comprobada en una fixture controlada; su renderizado con preferencia nativa reduce sigue pendiente, como se detalla abajo.

### Pruebas ejecutadas y resultados

| Verificación | Resultado real |
| --- | --- |
| npm ci | Correcto, 385 paquetes instalados / 386 auditados; no se aprobaron scripts pendientes. |
| npm run qa | Lint y build de producción con Webpack correctos. |
| npm audit --json | 9 paquetes afectados: 7 altos y 2 moderados; exit 1. El gate de seguridad continúa fallando por deuda previa. |
| npm audit --omit=dev --json | 0 afectados; exit 0. No implica aceptación permanente de la deuda de tooling. |
| git diff --check | Correcto; avisos LF/CRLF descritos abajo. |
| SSR + hidratación controlada | Snapshot null determinista, roles completos, cero errores recuperables. |
| 21 pruebas con React real, StrictMode y reloj controlado | Todas correctas; cero timers y listeners al finalizar. |
| Navegador real, no-preference | matchMedia reduce=false y no-preference=true. Escritura y cursor activos al reanudar; pausa persistente durante las comprobaciones. |
| EN/ES a 320, 390, 768 y 1440 px | Capturas antes/después; sin overflow horizontal. Ambos roles accesibles completos y estables, control traducido y CTA visible. |
| Teclado | Enter pausa, Espacio reanuda; foco visible. Orden comprobado CV → CTA → pausa. |
| Navegación y CTA | CTA EN/ES llega a contacto; navegación a proyectos y cambio de idioma conservan pausa. |
| Modal de regresión | Plenitud Fit abre, Escape cierra y restaura foco al disparador; no se modificó su código. |
| Consola de la aplicación | Sin errores ni advertencias en el navegador inspeccionado. |
| Canonical y OG | Conservados, comparados entre producción base y build local. |

Incidente de ejecución: el primer lint coincidió por error con npm ci y falló al leer un archivo de node_modules que se estaba reemplazando. Se descartó como validación y se ejecutó de nuevo el QA completo después de terminar la instalación; pasó. No se ocultó el error ni se cambió configuración para evitarlo.

### Pruebas controladas reproducibles, sin dependencias nuevas

`npm run qa:motion` compila una fixture aislada con React real y los compiladores ya fijados en el lockfile (TypeScript transitivo y Webpack incluido en Next). Abrir `http://127.0.0.1:3113` y activar **Run controlled tests**. El servidor escucha solo en loopback, escribe bundle/resultados en un directorio temporal y termina con exit 0/1 tras recibir los resultados. No es un gate headless automático ni una emulación nativa de CSS. La fixture declara explícitamente SIMULATION ONLY y no se importa desde la aplicación.

Se probaron: SSR/hidratación; un listener y un timer en StrictMode; escritura 100 ms; pausa/reanudación en escritura, espera y borrado; hold 2100 ms; borrado 50 ms; segundo rol; reduce simulado antes de montar y durante escritura; retorno inverso; pausa conservada en ambas transiciones; EN/ES pausado; cambios rápidos EN/ES pausados y activos; desmontaje en todas las fases; diez montajes/desmontajes repetidos. Resultado: 21/21, hydrationErrors=[], pendingTimers=0, listeners=0.

La fixture reemplaza únicamente matchMedia y el reloj dentro de su propia página y restaura las funciones al terminar. No altera las preferencias personales del sistema, el portfolio ni la evaluación nativa de media queries. Su mantenimiento depende de los compiladores transitivos actuales: revalidar este pequeño harness cuando se actualice Next/tooling.

### CSS, fuentes y assets

Comparación HTTP del build local contra producción base, con SHA-256 y análisis de reglas usando el PostCSS ya instalado:

- CSS concatenado tal como se referencia en HTML (incluye duplicados preload/stylesheet): antes `c46b4c5f2c3695693c93c481166769ce092754d3dcbba7cba799e8b7a49c7804`, después `619c0aac687345e6c6f1954ea645b5ef29c8d2758ca77a6049e52ffac751a252`. La diferencia es esperada y fue investigada.
- Comparación de reglas: ninguna eliminada ni modificada; ocho entradas añadidas: sr-only, size-8, border-zinc-500, dos reglas Typewriter, media query reduce y dos estados aria-disabled del control. Las reglas de fuentes permanecen idénticas.
- Siete archivos WOFF2: hashes idénticos antes/después.
- cv.pdf: `bb5765aaf7655640400a421c403730460d4948ea5794394cc16bec8af4dcd851` en ambos.
- resume.pdf: `30eef0c2141bdb254a9679a3e3761b99919e88a54123e894c3a103f9e45bfd9b` en ambos.
- og-image.jpg: `37ba7aca348a1fb9b13a5eb5ffac37765744b7f9c0b8a1d12f4ff05813566d67` en ambos.

Evidencia local fuera del repositorio: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-stage5d2/`, con before/after-en/es-320/390/768/1440.jpg, controlled-tests.json, browser-qa.json, audit-full.json, audit-production.json, assets-comparison.json y css-delta.json. Las capturas son muestras de fases diferentes de una animación; no se presentan como un diff de píxeles sincronizado ni se versionan artefactos generados.

### Limitaciones y revisión requerida antes del merge

Se intentó la validación nativa consultando las capacidades disponibles del navegador y la preferencia real. Este entorno solo ofrece viewport/visibility y pageAssets/webmcp; no expone emulación de media. matchMedia reduce=false. No se cambiaron preferencias personales ni se falsificó el resultado real.

**Pendiente obligatorio:** verificar reduce=true antes de cargar y los cambios nativos no-preference→reduce→no-preference; revisar texto estático completo y wrapping EN/ES en los cuatro anchos, cursor detenido, control explicado/inactivo y scroll auto. Las pruebas controladas cubren lógica, timers, cleanup y SSR, pero no sustituyen esta revisión visual nativa. No se declara completada la cobertura de movimiento reducido. La autorización permite preparar PR Draft con esta limitación explícita, sujeto a revisión antes de cualquier merge.

No se dispuso de lector de pantalla real, zoom nativo ni dispositivos físicos; el árbol accesible estable no sustituye la prueba de anuncios con lector. No se ejecutó una nueva auditoría axe en esta etapa. No se declara conformidad WCAG integral.

Warnings/deuda conservados: soporte React 18 deprecado en Next 16; advertencia de soporte ESLint 9 de la instalación y script pendiente de unrs-resolver 1.11.1, sin aprobarlo. Git advierte conversión LF→CRLF para Typewriter/globals y archivos nuevos conforme a su configuración actual; no se hizo una normalización masiva.

M02 continúa abierto fuera de Typewriter/scroll: Reveal, transiciones de idioma, DotGrid, proyectos, sidebar y modal conservan sus animaciones previas. M05–M08 y sus riesgos de contraste/observer/cleanup siguen documentados en la auditoría. No hubo cambios en esos componentes, dependencias, contenido comercial, infraestructura ni gate de seguridad. No se implementó 5D.3; no se autorizó merge ni despliegue manual.

## 11. Cierre autorizado de 5D.2 — validación manual de Oscar

Evidencia comunicada directamente por Oscar en la autorización de cierre del PR #7 (16/10/2026), sobre la implementación `c36e4af9f154615d75600753ffd4fdbb27848d54`. **Validación manual realizada por Oscar en Brave; no ejecutada ni observada por Codex.** No se atribuyen a Codex capturas, valores instrumentados ni una sesión nativa de reduce.

Oscar confirmó las siete verificaciones pendientes: prefers-reduced-motion reduce activo; ambos roles completos y estáticos; cursor sin pulsación; control de pausa correctamente explicado; scroll auto; EN/ES y cambios de preferencia durante la sesión; persistencia de pausa manual, sin recortes ni errores observados. Esta declaración cierra el pendiente manual nativo de la sección 10 para el alcance acotado de 5D.2. No se recibieron capturas ni trazas nuevas, ni se presume una medición adicional de temporizadores desde DevTools.

Se mantiene separada la evidencia automática de Codex: las 21 pruebas controladas de React/SSR/hidratación, tiempos, cancelación de timers y listeners complementan la observación manual; no se convierten en emulación nativa. El intento previo de Computer Use se interrumpió al no poder determinar con certeza la URL de Brave y no produjo una prueba nativa aprobada.

No se realizó ni se declara prueba con lector de pantalla real. Permanecen pendientes las demás animaciones y hallazgos fuera del alcance de 5D.2, y las limitaciones de zoom nativo/dispositivos físicos. No se declara conformidad WCAG integral. No se inicia 5D.3.

La deuda de seguridad continúa explícita: nueve paquetes afectados de tooling (siete altos, dos moderados), cero productivos en el baseline validado. El gate completo continúa fallando; el cierre no deshabilita controles ni acepta permanentemente esos riesgos.

Revisión técnica de cierre por Codex: npm ci correcto (385 paquetes instalados); npm run qa correcto (lint y build Webpack); 21/21 pruebas controladas repetidas con hydrationErrors=[], pendingTimers=0 y listeners=0. Auditorías repetidas: completa 9 (7 altos, 2 moderados, exit 1), productiva 0 (exit 0). Diff revisado, lockfile y dependencias sin modificaciones; PR inicialmente en c36e4af, base 217fff0, sin conflictos, preview Vercel READY. Se añade exclusivamente este registro documental antes del merge autorizado. Persisten los warnings ya descritos de React 18, soporte ESLint 9, script no aprobado de unrs-resolver y LF/CRLF; no se ocultan ni se normalizan archivos ajenos.

## 12. Etapa 5D.3 — Reveal, entradas y transición real de idioma

### Inspección y alcance

Base verificada: main y origin/main limpios, divergencia 0/0, `c6c74b202ba2944cfb7dbe991221c94492cde897`. Rama `fix/portfolio-reduced-motion-entrances`. Versiones reales y lockfile: Node 24.19.0 / npm 11.17.0, Next 16.4.1, React 18.3.1, Framer Motion 11.18.2. Se revisaron ambos informes, el contexto de idioma, entradas y CSS antes de modificar. No se alteraron conclusiones históricas.

Reveal arranca en opacity=0/y=75, espera useInView once y combina .5 s + delay .25 s con un barrido .5 s easeIn. Project arranca en opacity=0/y=100 y dura .75 s. Sidebar y enlaces entran desde x=-70 en .5 s; los enlaces añaden .1 s. La tarjeta modal utiliza el spring/fade por defecto de Framer 11. La transición real está en HomPage, con key por idioma, fade .3 s y mode=wait. LanguageTransition no tiene consumidores y no se modificó. El estado de pausa del Typewriter ya vive fuera de ese remount.

### Implementación acotada

- **Reveal:** reutiliza usePrefersReducedMotion. Bajo reduce detiene ambos controles y fija el estado visible, sin esperar al observer. El barrido se oculta mediante una regla específica. Una ref recuerda que ya se mostró, para que volver a normal no lo oculte ni repita la entrada. useInView conserva once y los valores/duraciones/delay normales.
- **Project:** detiene la entrada y fija opacity=1/y=0 bajo reduce, sin dependencia del observer para verlo. Conserva el estado visible al volver a normal. No cambia hover, rotación, anchura de imágenes, contenido ni disparadores.
- **Sidebar/SideBarLink:** controles locales cancelables fijan x=0 bajo reduce. Se mantienen las clases de selección, opacidad de enlaces, foco y lógica del observer de navegación. No se corrige la deuda M08.
- **Idioma real:** un componente local LanguagePage mantiene la suscripción reactiva incluso durante la salida, cuando AnimatePresence conserva props anteriores. En normal mantiene fade .3 s y mode=wait; completa explícitamente su registro usePresence al terminar el exit. Bajo reduce el modo es sync, la entrada/salida no tienen duración y safeToRemove libera inmediatamente el elemento saliente. El estado de pausa permanece en HomPage. No se añade provider, MotionConfig ni abstracción global; no se modifica LanguageContext.
- **Modal:** se adapta exclusivamente la entrada de la tarjeta con controles cancelables. Reduce fija posición final/opacidad 1; normal conserva los defaults de spring y fade, sin imponer una transición nueva. Portal, dialog, Escape, backdrop, contención/restauración de foco, scroll lock y contenido permanecen sin cambios.
- **CSS de primer render:** dentro de la media query reduce se fuerzan opacity=1/transform:none únicamente en los wrappers de entrada; sidebar/enlaces solo fuerzan transform final, preservando su opacidad de selección. Se oculta únicamente el barrido. Estos overrides locales son necesarios para prevalecer sobre los estilos inline initial antes de hidratar o al cambiar preferencia a mitad de animación. No se aplican resets globales ni se borran transforms de imágenes, indicadores, CTA o DotGrid.

### QA ejecutado por Codex

| Comprobación | Resultado |
| --- | --- |
| npm ci | Correcto; 385 paquetes instalados / 386 auditados; sin aprobar scripts. |
| npm run qa | Lint y build Webpack correctos. |
| npm run qa:motion | Ejecución interactiva: abrir loopback 3113 y activar Run controlled tests. 21/21; hydrationErrors=[], pendingTimers=0, listeners=0; proceso exit 0. |
| Cobertura de qa:motion | Regresión del Typewriter/hook existentes con preferencia simulada. No cubre las nuevas entradas Framer ni prueba CSS reduce nativo. |
| npm audit --json | 9 afectados: 7 altos, 2 moderados; exit 1. Gate completo sigue fallando. |
| npm audit --omit=dev --json | 0 afectados; exit 0. |
| git diff --check | Sin errores de whitespace; avisos de conversión LF/CRLF sin normalización masiva. |
| Modo normal nativo | matchMedia reduce=false; no se alteró la preferencia del sistema. |
| Responsive normal EN/ES | 320, 390, 768 y 1440 × 900 px: sin overflow; página final opacity=1, sidebar transform:none, control de pausa completo/traducido. |
| Idioma normal | EN→ES→EN y cambios rápidos por Enter/Espacio: una sola página final; foco sigue en selector; Typewriter conserva pausa. Fade observado en curso y estado final visible. |
| Proyectos normales | Navegación por teclado a Projects; entradas observadas en estado final opacity=1/transform:none. |
| Modal normal | Cuatro proyectos abiertos/cerrados; Plenitud Fit inspeccionado a 320 y 1440 px. Tab recorre enlace/cierre y vuelve al cierre; Escape restaura disparador y overflow. |
| CTA y Typewriter | CTA activado con Enter; pausa/reanudación y estado retenido tras EN/ES; código Typewriter y hook intactos. |
| Consola / hidratación | Sin errores ni warnings capturados en el build local; hidratación controlada del Typewriter sin errores. No se declara hidratación nativa reduce probada. |

Warnings previos conservados: ESLint 9 sin soporte, React 18 deprecado en Next 16 y script pendiente unrs-resolver 1.11.1. No se aprobaron scripts, ni se deshabilitaron reglas o gates. La deuda de nueve paquetes de tooling no se considera corregida ni aceptada permanentemente.

### Comparación visual, CSS y assets

Capturas normales antes (producción c6c74b2) y después (build local), EN/ES y cuatro anchos; modal móvil/escritorio. Son muestras de estado, no un diff de píxeles sincronizado de animaciones. No se observaron cambios de diseño en la revisión realizada.

SHA-256 del CSS concatenado sin duplicados: producción `e39bb073348b2110620301b1e7b6e8b2328e0940e19945dfe8578e186a6fcebf`; local `895c904108b686e906d71ab401e178e0d1c089ab09e212980c7206f4b75f3c6c`. La comparación de reglas PostCSS muestra exclusivamente la ampliación de la media query reduce; ninguna regla normal cambia. Los siete WOFF2 conservan hashes; también cv.pdf, resume.pdf y og-image.jpg. Canonical y OG iguales al baseline. No se modificaron assets, fuentes ni dependencias.

Evidencia local: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-stage5d3/`: before-normal-en-320/390/768/1440.jpg, after-normal-en/es-320/390/768/1440.jpg, modal-normal-320/1440.jpg, normal-responsive.json, typewriter-controlled.json y css-assets.json. Las auditorías completas del cierre se guardaron temporalmente fuera del repositorio. No hay capturas nativas reduce de esta etapa; no se reutiliza la validación manual de Oscar de 5D.2 para aprobar componentes nuevos.

### Intento nativo y límite de la validación

Se intentó abrir DevTools con F12 en la pestaña local de prueba. El navegador integrado no expuso UI Rendering ni controles de emulación; sus únicas capacidades son viewport/visibility y pageAssets/webmcp. La consulta real siguió devolviendo reduce=false. No se modificaron preferencias personales, no se parcheó matchMedia en la aplicación ni se presentaron pruebas simuladas como emulación nativa.

**Pendiente antes de cualquier merge:** reduce real al cargar y cambios no-preference→reduce→no-preference, incluidos Reveal/modal en curso e idioma bajo reduce. La revisión de código, el CSS SSR y los tests existentes no permiten declarar esos casos aprobados. El PR se prepara Draft con esta limitación explícita, conforme al fallback autorizado por el usuario. No se declara conformidad WCAG integral ni una sesión con lector de pantalla real.

### Guía manual de 5D.3 para Oscar

1. Abrir el preview del PR en Brave/Chromium. DevTools → Ctrl+Shift+P → Show Rendering → Emulate CSS media feature prefers-reduced-motion → reduce. En Console ejecutar `matchMedia('(prefers-reduced-motion: reduce)').matches`; registrar true. Recargar manteniendo reduce.
2. Revisar EN y ES a 320, 390, 768 y 1440 px. Hero, About, Projects, Experience y Contact deben estar visibles inmediatamente, incluso antes de visitar cada sección: sin y/opacity de entrada ni barrido. Sidebar/enlaces en posición final; no debe haber pérdida de información, recorte ni overflow. La opacidad atenuada de enlaces no seleccionados se conserva deliberadamente.
3. Como evidencia auxiliar de DOM, registrar cantidad de `.motion-entrance` (debe ser mayor que cero), opacidad y transform calculados, y display de `.motion-reveal-wipe`. Bajo reduce todos los wrappers deben tener opacity=1 y transform=none; el barrido display=none. Revisar visualmente: los valores calculados no sustituyen comprobar foco/contenido.
4. Manteniendo reduce, cambiar EN/ES varias veces: cambio inmediato, una sola página final, foco en selector y contenido completo. Pausar el Typewriter antes de cambiar preferencia/idioma y comprobar que la pausa persiste al volver a normal. El Typewriter estático bajo reduce debe conservar ambos roles.
5. Sin recargar, pasar no-preference→reduce mientras un Reveal está entrando. Todo el contenido debe pasar al estado final inmediatamente, sin una franja verde ni reocultarse. Volver a no-preference: lo mostrado no debe volver a ocultarse ni reproducir su entrada; nuevas instancias montadas en normal conservan el comportamiento previo once.
6. Repetir la transición de preferencia durante la apertura de un modal. La tarjeta debe quedar inmóvil en posición final, sin saltos ni transparencia. Comprobar cierre inicial enfocado, Tab/Shift+Tab, Escape, botón, backdrop, scroll interno y retorno al disparador. Al volver a normal, una nueva apertura debe conservar su spring/fade previo.
7. Cambiar preferencia durante el fade de idioma, tanto entrando como saliendo: sin página invisible persistente, esperas de fade bajo reduce ni duplicados residuales. Comprobar selector enfocado, enlaces y CTA funcionales.
8. Conservar Console abierto durante recarga, cambios de preferencia, idioma y modal: registrar cualquier error de hidratación o foco. Adjuntar capturas y pasos/resultados. Dejar Rendering en No emulation al terminar; no cambiar Windows.

### Riesgos y pendientes de 5D.4

La matriz nativa anterior requiere revisión humana antes del merge; especial atención a la salida de AnimatePresence y a las animaciones que ya estaban en curso al cambiar preferencia. La gestión del foco y el resaltado automático de sidebar tras cambio de idioma son temas separados: se conserva la deuda M08, sin confundir selección incorrecta con un fallo nuevo de navegación.

DotGrid y su cleanup/contraste/onda siguen intactos. Hover de capturas, selector, CTA y transiciones CSS restantes no están adaptados aquí: quedan para 5D.4. También siguen pendientes lector real, zoom nativo, dispositivos físicos y otras deudas semánticas del informe de accesibilidad. No se actualizó ninguna dependencia, no hubo merge ni despliegue manual y no se inició 5D.4.

## 13. Cierre de 5D.3 — validación manual comunicada por Oscar

Oscar confirmó directamente, al autorizar el cierre del PR #8, que completó las ocho verificaciones manuales en Brave sobre la implementación `4895ac0def639e45b2f858f6407add223b6ebbd4`. **Esta es evidencia manual realizada por Oscar, no una prueba ejecutada ni observada por Codex.** No se adjuntaron capturas o trazas nuevas a esa declaración.

Resultados comunicados: Reveal sin desplazamiento ni barrido bajo reduce; proyectos visibles inmediatamente; sidebar/enlaces visibles desde el inicio; EN/ES sin fade ni duplicados; modal sin entrada animada, con Escape y foco correctos; cambios de preferencia durante animaciones; recuperación del comportamiento normal; Typewriter sin regresiones y consola sin errores observados. La confirmación cierra la matriz nativa pendiente de la sección 12 dentro del alcance de 5D.3; no se atribuyen a Codex mediciones nativas adicionales ni valores de instrumentación no proporcionados.

Se conserva como evidencia separada la regresión interactiva qa:motion del Typewriter/hook (21 casos); no se presenta como cobertura de las entradas Framer ni como emulación nativa de CSS. No se declara una sesión con lector de pantalla real, conformidad WCAG integral ni pruebas de zoom nativo/dispositivos físicos.

Continúan fuera del cierre DotGrid, hover/CTA/selector CSS y las demás tareas previstas para 5D.4; esa etapa no se inicia. La deuda M08 del observer y las deudas semánticas/accesibles restantes siguen registradas. Los nueve afectados de tooling y cero productivos del último diagnóstico no representan un gate completo aprobado ni aceptación permanente del riesgo.

Revalidación de cierre por Codex: head/base iniciales 4895ac0/c6c74b2 y ocho archivos esperados, sin conflictos ni cambios de dependencias/lockfile. npm ci correcto (385 instalados/386 auditados), npm run qa correcto, qa:motion repetido mediante su botón Run controlled tests (21/21, hydrationErrors=[], pendingTimers=0, listeners=0; exit 0). Auditorías repetidas: completa 9 (7 altos, 2 moderados, exit 1), productiva 0 (exit 0). git diff --check correcto. Preview inicial READY para 4895ac0. Se publica únicamente este registro documental antes del merge autorizado, sin cambios adicionales de producto. Continúan los warnings de React 18 deprecado en Next 16, soporte ESLint 9, script pendiente de unrs-resolver sin aprobar y LF/CRLF sin normalización masiva.
