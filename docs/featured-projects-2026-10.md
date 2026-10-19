# Proyectos destacados — 19/10/2026

## Cambio

Se agregan Seguros Guerrero e Hijos y PrimerPaso, con enlaces a sus sitios, las capturas provistas por Oscar optimizadas a WebP y textos EN/ES en tarjeta/modal. El texto de PrimerPaso expresa su importancia personal sin atribuir una historia no aportada.

Orden inicial: Seguros Guerrero e Hijos, PrimerPaso, Plenitud Fit y CFR Estudio. Revisión Automotriz y AltasWeb se muestran mediante “Ver más proyectos”; “Ver menos proyectos” los vuelve a ocultar. El estado se conserva al cambiar idioma, reutilizando estado local de la página por encima del remount existente. No hay persistencia entre recargas ni estado global nuevo.

Se reutilizan Project, el modal accesible, OutlineButton y las reglas actuales de movimiento reducido. El botón tiene aria-expanded/aria-controls, permanece antes del contenido adicional y permite seguir con Tab hacia las tarjetas recién mostradas. Al contraer conserva el foco. Se ajusta únicamente la fila de título/separador/enlace para acomodar el nombre largo sin recortes móviles.

Capturas: seguros-guerrero-e-hijos.webp, 1280×750, 92.402 bytes; primerpaso.webp, 1280×758, 83.718 bytes. Conversión con Sharp ya instalado, sin agregar dependencias. React/Tailwind corroborados en los bundles públicos de ambos sitios, que respondieron HTTP200.

## Validación local

- Node24.19.0/npm11.17.0; `npm run qa`: lint y build productivo correctos.
- `npm run qa:motion`, ejecutando su botón interactivo: **58/58** regresiones existentes; cero errores de hidratación y cero timers/listeners remanentes medidos. Media queries simuladas; no se presenta como emulación nativa.
- React Doctor0.9.18: **0 errores, 12 advertencias**, mismo baseline; no reglas deshabilitadas.
- Auditoría completa: exit1, siete nombres afectados altos por el advisory conocido de braces. Productiva: exit0, cero afectados. No cambian dependencias, lockfile ni controles.
- `git diff --check` correcto; se conserva el aviso local LF/CRLF, sin normalización masiva.
- Navegador sobre build productivo: cuatro tarjetas iniciales en orden, seis al expandir, cuatro al contraer; Enter/Espacio, Tab hacia primer proyecto adicional, foco retenido, expansión conservada EN/ES. Nuevos modales comprobados en ambos idiomas con nombre, enlace correcto, Escape y restauración al disparador. Consola normal sin errores/warnings observados.
- **16 muestras responsive** en viewports reales de iframe local: 320/390/768/1440px × EN/ES × cuatro/seis tarjetas. Sin overflow horizontal ni desborde de títulos. Capturas desktop y móvil revisadas. Los iframes no equivalen a dispositivos físicos. La consola del harness registró el mismo error de MutationObserver observado en el harness histórico; no se reprodujo en la página normal y no se atribuye su origen sin stack.

Evidencia local: `C:/Users/Oscar Alcalde/.codex/visualizations/portfolio-featured-projects-2026-10/` (logs, Doctor/auditorías, motion.json, responsive.json y capturas). No se realizó lector de pantalla real ni nueva emulación nativa de reduce. No hay despliegue manual ni autorización de merge en esta tarea; se entrega PR Draft para revisión.
