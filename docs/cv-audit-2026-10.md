# Auditoría del portafolio contra el CV — octubre de 2026

## Fuente y alcance

Se contrastaron los CV en español e inglés proporcionados por Oscar. Los originales se publican sin modificar en `public/cv.pdf` y `public/resume.pdf`, preservando sus URLs. Los enlaces del encabezado seleccionan el archivo según el idioma.

## Diferencias corregidas

- Perfil senior de IT con más de 15 años de experiencia; desarrollo freelance como actividad profesional, no como hobby.
- RCI finalizó en septiembre de 2026. Se distingue la promoción de enero de 2022 y se incorporan coordinación técnica, mentoría, automatización y logros cuantificados. El ahorro de 12,5 horas se identifica como estimado.
- AltasWeb activo desde enero de 2025, con AltasTrack, Bookings (en desarrollo activo) y PrimerPaso descritos dentro de los bloques existentes. No se inventaron capturas ni URLs de productos.
- Trayectoria en Johnson & Johnson y CPA Ferrere dentro de Infocorp; experiencias en Urudata / Banco Itaú y HYC Hardware.
- Competencias de endpoints, Microsoft 365, seguridad, automatización y desarrollo alineadas con el CV.
- Certificaciones, formación complementaria, estudios ORT cursados (sin afirmar graduación) e idiomas.
- Metadatos actualizados, nombre incorrecto «Oscar Alonso» corregido y afirmación de empleo actual en RCI eliminada del schema. Se quitaron niveles de competencia, horarios y acción de búsqueda sin respaldo.
- Dominio canónico, sitemap y robots alineados con `oscaralcalde.vercel.app`, indicado en ambos CV. Se quitaron alternates `?lang=` que el sitio no implementa.
- Idioma del documento sincronizado con EN/ES; enlace real al PDF con apertura segura.

## Validación ejecutada

- Node 24.19.0 y npm 11.17.0.
- `npm ci`: completado desde el lockfile, sin actualizar dependencias.
- `npm run lint`: sin warnings ni errores.
- `npm run build`: correcto; página estática con 153 kB de JS inicial. Advertencia previa de Browserslist desactualizado.
- SHA-256 de ambos PDFs idéntico al de los adjuntos originales.
- HTTP local: ambos PDFs devuelven 200, `application/pdf` y bytes idénticos a los archivos públicos. HTML con un único título, cuatro schemas JSON-LD y sin las afirmaciones obsoletas detectadas.
- QA del build de producción en escritorio (1440 px), tablet (768 px) y móvil (390 y 320 px). Cambio EN/ES y enlace correspondiente al CV verificados. Sin overflow horizontal en los anchos móviles tras los cambios aprobados.
- Navegación por teclado al enlace del CV: foco visible confirmado. Consola del navegador sin errores ni warnings capturados durante esta revisión.
- `npm audit --json`: falla el gate de seguridad por 21 vulnerabilidades previas (1 moderada, 19 altas, 1 crítica).
- `git diff --check`: sin errores de whitespace.

El repositorio no incluye scripts de formato, tests ni React Doctor; no se presentan como ejecutados. La instalación local previa estaba incompleta. El build requiere acceso a Google Fonts para Inter.

## Diseño aprobado por Oscar

- Empresa, fechas y ubicación apiladas en móvil; se mantiene la distribución horizontal desde `sm`.
- Columna principal con ancho mínimo cero y encabezado compacto para evitar overflow en pantallas pequeñas.
- Formación e idiomas separados en un bloque dentro de «Sobre mí», reutilizando colores, tipografía y animaciones existentes.

## Deuda y pendientes

El repositorio usa Next.js 14.2.1 y Tailwind 3.4.x; no tiene `.altasweb/standard.json`, `AGENTS.md`, skills locales ni entorno Codex versionado. Tratar como potencialmente legacy y evaluar el mecanismo oficial de normalización por separado. No se hizo una migración manual.

La actualización de dependencias requiere una tarea específica con revisión de compatibilidad. No ejecutar `npm audit fix --force` como solución automática.

Revisar accesibilidad previa: el CTA del hero está oculto por `OutlineButton`; el modal carece de gestión completa del foco y Escape; las animaciones de Reveal y Typewriter requieren revisar `prefers-reduced-motion`. No se modificaron en esta actualización. Estos cambios adicionales requieren aprobación de Oscar.
