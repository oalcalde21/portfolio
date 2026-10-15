# Portfolio - Oscar Alcalde

## Runtime de desarrollo / Development runtime

- Node.js **24.19.0** (`.node-version`).
- npm **11.17.0** (`packageManager`).
- `engines` admite Node `>=24.19.0 <25` y npm `>=11.17.0 <12`; para reproducir el baseline, usar las versiones exactas anteriores.
- Con FNM, ejecutar `fnm use` desde la raíz y verificar `node --version` y `npm --version` antes de `npm ci`. No actualizar npm globalmente como parte de la instalación del proyecto.
- With FNM, run `fnm use` at the repository root, verify both versions, then run `npm ci` using the committed lockfile.

Ver [baseline técnico y funcional](docs/runtime-baseline-2026-10.md) para las validaciones, warnings y vulnerabilidades existentes. Este cambio conserva Next.js, React, Tailwind y la arquitectura actual; no constituye una aplicación completa del Repository Standard AltasWeb.

## English

### Next.js 16 migration in progress

The current migration branch uses Webpack explicitly and runs ESLint through its CLI. Run `npm run qa` to execute lint before the production build. The two initial lint findings have been resolved and browser smoke QA completed; see [the migration report](docs/next16-migration-2026-10.md) for results, limitations and residual security findings. The migration remains pending review and is not approved for deployment.

### What is this?

This is Oscar's personal portfolio website. It showcases his senior IT support, endpoint management, automation and technical coordination experience, alongside freelance web and product development at AltasWeb.

### Key Features

- **Bilingual Support (EN/ES)**: The entire site switches between English and Spanish with a smooth fade animation
- **Interactive Elements**:
  - Clickable dot grid in the hero section that creates ripple animations
  - Typewriter effect cycling through career roles
  - Cards that animate in when scrolling into view
- **Responsive Design**: Looks good on mobile, tablet, and desktop
- **Dark Theme**: Professional dark color scheme with green accents

### Sections

1. **Hero** - Introduction with name, animated role titles, and contact button
2. **About** - Oscar's background, IT operations and development skills, training, education and languages
3. **Projects** - Showcases real projects with screenshots, descriptions, and links
4. **Experience** - Work history with detailed descriptions and technology tags
5. **Contact** - Links to LinkedIn, GitHub, and email
6. **Footer** - Copyright and credits

### Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Anime.js
- **Icons**: React Icons
- **Language**: JavaScript (JSX)

### How to Run

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

### Project Structure

```
src/
├── components/           # React components
│   ├── about/          # About section (text + skills)
│   ├── buttons/        # Reusable buttons (toggle, outline)
│   ├── contact/        # Contact section
│   ├── experience/     # Work experience section
│   ├── hero/          # Hero section with animations
│   ├── nav/            # Header and sidebar navigation
│   ├── projects/       # Projects showcase
│   └── util/           # Shared utilities (Reveal, Chip, etc.)
├── context/
│   └── LanguageContext.jsx  # All translations and language logic
├── pages/              # Next.js pages
└── styles/             # Global styles
```

### How Bilingual Support Works

The `LanguageContext.jsx` file contains all text in both English and Spanish. Each key exists in both languages, and the `t("key")` function returns the text in whichever language is currently selected.

To change text:

1. Find the translation key in `LanguageContext.jsx`
2. Update either the `EN` or `ES` section

### Customization Tips

- **Add a new project**: Edit `src/components/projects/Projects.jsx` and add to the `projects` array
- **Add work experience**: Edit `src/components/experience/Experience.jsx` and add to the `experience` array
- **Change colors**: Edit `tailwind.config.js` - look for `green: { 400: '#04cd04' }`
- **Add translations**: Add keys to both `EN` and `ES` sections in `LanguageContext.jsx`

---

## Español

### Qué es esto?

Este es el portfolio personal de Oscar. Muestra su experiencia senior en soporte IT, gestión de endpoints, automatización y coordinación técnica, junto con desarrollo web y de productos freelance en AltasWeb.

### Características Principales

- **Soporte Bilingüe (EN/ES)**: Todo el sitio cambia entre inglés y español con una animación suave
- **Elementos Interactivos**:
  - Cuadrícula de puntos en la sección hero que crea animaciones tipo ola
  - Efecto de máquina de escribir rotando entre títulos de carrera
  - Tarjetas que se animan al aparecer en pantalla
- **Diseño Responsivo**: Se ve bien en móvil, tablet y escritorio
- **Tema Oscuro**: Esquema de colores profesional con acentos verdes

### Secciones

1. **Hero** - Introducción con nombre, títulos animados y botón de contacto
2. **About** - Trayectoria de Oscar, competencias de operaciones IT y desarrollo, formación, educación e idiomas
3. **Projects** - Muestra proyectos reales con capturas, descripciones y enlaces
4. **Experience** - Historial laboral con descripciones detalladas y etiquetas de tecnología
5. **Contact** - Enlaces a LinkedIn, GitHub y email
6. **Footer** - Copyright y créditos

### Stack Tecnológico

- **Framework**: Next.js 16
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion, Anime.js
- **Iconos**: React Icons
- **Lenguaje**: JavaScript (JSX)

### Cómo Ejecutar

```bash
# Instalar dependencias
npm ci

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar servidor de producción
npm start
```

### Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── about/          # Sección About (texto + habilidades)
│   ├── buttons/        # Botones reutilizables (toggle, outline)
│   ├── contact/        # Sección de contacto
│   ├── experience/     # Sección de experiencia laboral
│   ├── hero/           # Sección hero con animaciones
│   ├── nav/            # Header y navegación lateral
│   ├── projects/       # Exhibición de proyectos
│   └── util/           # Utilidades compartidas (Reveal, Chip, etc.)
├── context/
│   └── LanguageContext.jsx  # Todas las traducciones y lógica de idioma
├── pages/              # Páginas de Next.js
└── styles/             # Estilos globales
```

### Cómo Funciona el Soporte Bilingüe

El archivo `LanguageContext.jsx` contiene todo el texto en inglés y español. Cada clave existe en ambos idiomas, y la función `t("clave")` devuelve el texto en el idioma actualmente seleccionado.

Para cambiar texto:

1. Encuentra la clave de traducción en `LanguageContext.jsx`
2. Actualiza la sección `EN` o `ES`

### Tips de Personalización

- **Agregar un proyecto**: Edita `src/components/projects/Projects.jsx` y añade al arreglo `projects`
- **Agregar experiencia laboral**: Edita `src/components/experience/Experience.jsx` y añade al arreglo `experience`
- **Cambiar colores**: Edita `tailwind.config.js` - busca `green: { 400: '#04cd04' }`
- **Agregar traducciones**: Añade claves a ambas secciones `EN` y `ES` en `LanguageContext.jsx`

---

## SEO (Search Engine Optimization)

This portfolio includes several SEO improvements to help it rank when searching for "Oscar Alcalde".

### What's Included

1. **Meta Tags** (`src/pages/_document.jsx`)
   - Title, description, and keywords optimized for IT Support + Frontend Development
   - Open Graph tags for social media sharing (LinkedIn, Facebook)
   - Twitter Card tags for rich Twitter previews

2. **Structured Data / Schema.org** (`src/pages/_document.jsx`)
   - Person schema with name, job title, location, and social links
   - WebSite schema for search engines

3. **Sitemap** (`public/sitemap.xml`)
   - Helps search engines discover and index the site
   - Update `lastmod` date when content changes significantly

4. **Robots.txt** (`public/robots.txt`)
   - Tells search engines how to crawl the site
   - Points to sitemap location

5. **Security Headers** (`next.config.mjs`)
   - X-Frame-Options, X-Content-Type-Options, etc.

### Important: Update These for Production

1. **Replace the placeholder URL** in these files:
   - `src/pages/_document.jsx` - Change `https://oscar.alcalde.vercel.app` to your actual domain
   - `public/robots.txt` - Same
   - `public/sitemap.xml` - Same

2. **Social sharing image**:
   - `public/og-image.jpg` contains the supplied portrait artwork (1280x669px).
   - Open Graph, Twitter and Person schema reference its absolute production URL.
   - When replacing it, update the image dimensions and alternative text in `src/pages/_document.jsx`.

3. **Submit to Google Search Console**:
   - Go to https://search.google.com/search-console
   - Add your domain
   - Submit the sitemap at `/sitemap.xml`

4. **Submit to Bing Webmaster Tools**:
   - Go to https://www.bing.com/webmasters
   - Helps Bing index your site

### SEO Tips for the Future

- Keep the `lastmod` date in sitemap.xml updated
- Add new projects to the sitemap as you create them
- When adding new sections, maintain the semantic HTML structure (h1, h2, h3)
- Use descriptive alt text for any images you add

---

## Auditoría de contenido

Ver [auditoría de octubre de 2026](docs/cv-audit-2026-10.md) para las fuentes, cambios, validaciones y deuda detectada. Los PDFs públicos corresponden a los CV actualizados en ambos idiomas.

**Credits**: Template inspired by [hover.dev](https://hover.dev)
