import { Html, Head, Main, NextScript } from "next/document";

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NNMLJS6C');`;

const gtmNoscript = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNMLJS6C" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        {/* End Google Tag Manager */}

        {/* Primary Meta Tags */}
        <meta
          name="title"
          content="Oscar Alcalde - Portfolio | Senior IT Support & Automation | Uruguay"
        />
        <meta
          name="description"
          content="Oscar Alcalde - Portfolio profesional. Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance con 15+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune. Montevideo, Uruguay."
        />
        <meta
          name="keywords"
          content="Oscar Alcalde, Oscar Alcalde portfolio, Oscar Alcalde Uruguay, Frontend Developer Uruguay, Help Desk Analyst Uruguay, React Developer Montevideo, IT Support Specialist Uruguay, Oscar Developer, oscaralcalde.vercel.app"
        />
        <meta name="author" content="Oscar Alcalde" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="F8cAZEW4clSCYruTPwoAiio1bgyV31n4S6fSWxBncVI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oscaralcalde.vercel.app/" />
        <meta
          property="og:title"
          content="Oscar Alcalde - Portfolio | Senior IT Support & Automation | Uruguay"
        />
        <meta
          property="og:description"
          content="Portfolio profesional de Oscar Alcalde. Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance. Especializado en React, JavaScript, Tailwind. Montevideo, Uruguay."
        />
        <meta property="og:image" content="https://oscaralcalde.vercel.app/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="669" />
        <meta property="og:image:alt" content="Oscar Alcalde — Senior IT Support & Web Developer" />
        <meta property="og:locale" content="es_UY" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:site_name" content="Oscar Alcalde Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@oalcalde21" />
        <meta name="twitter:url" content="https://oscaralcalde.vercel.app/" />
        <meta
          name="twitter:title"
          content="Oscar Alcalde - Portfolio | Senior IT Support & Automation | Uruguay"
        />
        <meta
          name="twitter:description"
          content="Portfolio profesional de Oscar Alcalde. Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance. Montevideo, Uruguay."
        />
        <meta name="twitter:image" content="https://oscaralcalde.vercel.app/og-image.jpg" />
        <meta name="twitter:image:alt" content="Oscar Alcalde — Senior IT Support & Web Developer" />
        <meta name="twitter:creator" content="@oalcalde21" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://oscaralcalde.vercel.app/" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://oscaralcalde.vercel.app/#person",
              name: "Oscar Alcalde",
              givenName: "Oscar",
              familyName: "Alcalde",
              url: "https://oscaralcalde.vercel.app",
              image: "https://oscaralcalde.vercel.app/og-image.jpg",
              jobTitle: "Senior IT Support | Endpoint Management | IT Automation | Technical Leadership",
              description:
                "Oscar Alcalde - Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance con 15+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune. Montevideo, Uruguay.",
              knowsAbout: [
                "Frontend Development",
                "React",
                "JavaScript",
                "Vite",
                "Next.js",
                "Tailwind CSS",
                "IT Support",
                "Help Desk",
                "ServiceNow",
                "Microsoft Intune",
                "Windows Administration",
                "HTML",
                "CSS",
              ],
              alumniOf: {
                "@type": "Organization",
                name: "Universidad ORT Uruguay (estudios cursados, 2009–2010)",
              },
              sameAs: [
                "https://www.linkedin.com/in/oscar-alcalde/",
                "https://github.com/oalcalde21",
                "https://twitter.com/oalcalde21",
                "https://www.instagram.com/oalcalde21/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "oalcalde211@gmail.com",
                contactType: "professional",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Montevideo",
                addressRegion: "Montevideo",
                addressCountry: {
                  "@type": "Country",
                  name: "Uruguay",
                },
              },
              nationality: {
                "@type": "Country",
                name: "Uruguayan",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />

        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://oscaralcalde.vercel.app/#website",
              name: "Oscar Alcalde Portfolio",
              url: "https://oscaralcalde.vercel.app",
              description:
                "Portfolio profesional de Oscar Alcalde - Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance en Uruguay",
              inLanguage: ["es-UY", "en-US"],
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://oscaralcalde.vercel.app/#webpage",
              },
              author: {
                "@id": "https://oscaralcalde.vercel.app/#person",
              },
              about: {
                "@id": "https://oscaralcalde.vercel.app/#person",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />

        {/* Structured Data - WebPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://oscaralcalde.vercel.app/#webpage",
              url: "https://oscaralcalde.vercel.app",
              name: "Oscar Alcalde - Portfolio | Senior IT Support & Automation | Uruguay",
              description:
                "Portfolio profesional de Oscar Alcalde. Profesional senior de IT, gestión de endpoints, automatización y desarrollo web freelance con 15+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune.",
              isPartOf: {
                "@id": "https://oscaralcalde.vercel.app/#website",
              },
              author: {
                "@id": "https://oscaralcalde.vercel.app/#person",
              },
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://oscaralcalde.vercel.app",
                  },
                ],
              },
              mainEntity: {
                "@id": "https://oscaralcalde.vercel.app/#person",
              },
              inLanguage: "es-UY",
            }).replace(/</g, "\\u003c"),
          }}
        />

        {/* Structured Data - ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "AltasWeb — Oscar Alcalde",
              description:
                "Desarrollo web frontend especializado en React, Next.js y Tailwind. Servicios de desarrollo web enfocado en conversión.",
              url: "https://altasweb.uy",
              areaServed: {
                "@type": "Country",
                name: "Uruguay",
              },
              knowsAbout: [
                "Frontend Development",
                "React",
                "Next.js",
                "Tailwind CSS",
                "Web Development",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </Head>
      <body id="root" className="bg-zinc-900 text-zinc-50">
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{ __html: gtmNoscript }} />
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
