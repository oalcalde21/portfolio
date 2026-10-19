# Corrección final de SSR del modal — 19/10/2026

`ProjectModal` resuelve el contenedor del portal mediante `useSyncExternalStore`, con snapshot servidor nulo. SSR y la primera hidratación coinciden incluso con `isOpen=true`. Los efectos de animación, foco y scroll esperan al contenedor. Un MutationObserver, activo solamente mientras está abierto y desconectado al cerrar/desmontar, permite recuperarse de la ausencia temporal del destino sin polling. Se conservan el diálogo nativo, sus estilos, eventos y contenido.

Validación local: Node 24.19.0/npm 11.17.0; `npm ci --ignore-scripts`, `npm run qa` y `git diff --check` correctos. SSR cerrado y abierto sin globals probado por el servidor de `qa:motion`; 58/58 pruebas controladas (47 previas + 11 del modal) pasan, con cero errores de hidratación. Cubren destino tardío, foco inicial/restauración, Tab/Shift+Tab, evento cancel de Escape, backdrop, scroll, preferencia simulada y desmontaje. Se usan React, MutationObserver y dialog reales; media queries y parte de los eventos son controlados. No equivalen a lector de pantalla ni emulación nativa de reduce.

React Doctor 0.9.18: antes 1 error/16 advertencias; después 0 errores/16 advertencias, exit 0. No se desactivaron reglas. Sin cambios de dependencias, lockfile, diseño o datos. Persiste el warning de ESLint 9.39.5 EOL durante instalación.

Seguridad: braces continúa como riesgo de tooling (un advisory, siete nombres altos, cero productivos en el último audit); este cambio no lo corrige. El cierre consolidado registra las auditorías finales y los checks/producción posteriores al merge.
