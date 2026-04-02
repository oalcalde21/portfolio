import { Html, Head, Main, NextScript } from "next/document";

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K3K75BW3');`;

const gtmNoscript = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K3K75BW3" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <title>Oscar Alcalde</title>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        {/* End Google Tag Manager */}

        {/* Primary Meta Tags */}
        <title>
          Oscar Alcalde - Portfolio | Frontend Developer & IT Support | Uruguay
        </title>
        <meta
          name="title"
          content="Oscar Alcalde - Portfolio | Frontend Developer & IT Support | Uruguay"
        />
        <meta
          name="description"
          content="Oscar Alcalde - Portfolio profesional. Frontend Developer y Analista Sr. de Soporte IT con 13+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune. Montevideo, Uruguay."
        />
        <meta
          name="keywords"
          content="Oscar Alcalde, Oscar Alcalde portfolio, Oscar Alcalde Uruguay, Frontend Developer Uruguay, Help Desk Analyst Uruguay, React Developer Montevideo, IT Support Specialist Uruguay, Oscar Developer, oscar.alcalde.vercel.app"
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
        <meta property="og:url" content="https://oscar.alcalde.vercel.app/" />
        <meta
          property="og:title"
          content="Oscar Alcalde - Portfolio | Frontend Developer & IT Support | Uruguay"
        />
        <meta
          property="og:description"
          content="Portfolio profesional de Oscar Alcalde. Frontend Developer y Analista Sr. de Soporte IT. Especializado en React, JavaScript, Tailwind. Montevideo, Uruguay."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_UY" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:site_name" content="Oscar Alcalde Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@oalcalde21" />
        <meta name="twitter:url" content="https://oscar.alcalde.vercel.app/" />
        <meta
          name="twitter:title"
          content="Oscar Alcalde - Portfolio | Frontend Developer & IT Support | Uruguay"
        />
        <meta
          name="twitter:description"
          content="Portfolio profesional de Oscar Alcalde. Frontend Developer y Analista Sr. de Soporte IT. Montevideo, Uruguay."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:creator" content="@oalcalde21" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://oscar.alcalde.vercel.app/" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://oscar.alcalde.vercel.app/#person",
              name: "Oscar Alcalde",
              givenName: "Oscar",
              familyName: "Alcalde",
              url: "https://oscar.alcalde.vercel.app",
              image: "https://oscar.alcalde.vercel.app/og-image.png",
              jobTitle: "Frontend Developer & Sr. IT Help Desk Analyst",
              description:
                "Oscar Alcalde - Frontend Developer y Analista Sr. de Soporte IT con 13+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune. Montevideo, Uruguay.",
              knowsAbout: [
                "Frontend Development",
                "React",
                "JavaScript",
                "TypeScript",
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
              skillProficiency: [
                { skillName: "React", proficiencyLevel: "Advanced" },
                { skillName: "JavaScript", proficiencyLevel: "Advanced" },
                { skillName: "Tailwind CSS", proficiencyLevel: "Advanced" },
                { skillName: "IT Support", proficiencyLevel: "Expert" },
              ],
              worksFor: {
                "@type": "Organization",
                "@id": "https://www.rci.com/",
                name: "RCI Latinoamérica (Travel + Leisure)",
              },
              alumniOf: {
                "@type": "Organization",
                name: "Self-taught & Continuous Learning",
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
            }),
          }}
        />

        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://oscar.alcalde.vercel.app/#website",
              name: "Oscar Alcalde Portfolio",
              url: "https://oscar.alcalde.vercel.app",
              description:
                "Portfolio profesional de Oscar Alcalde - Frontend Developer y Analista Sr. de Soporte IT en Uruguay",
              inLanguage: ["es-UY", "en-US"],
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://oscar.alcalde.vercel.app/#webpage",
              },
              author: {
                "@id": "https://oscar.alcalde.vercel.app/#person",
              },
              about: {
                "@id": "https://oscar.alcalde.vercel.app/#person",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://oscar.alcalde.vercel.app/?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data - WebPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://oscar.alcalde.vercel.app/#webpage",
              url: "https://oscar.alcalde.vercel.app",
              name: "Oscar Alcalde - Portfolio | Frontend Developer & IT Support | Uruguay",
              description:
                "Portfolio profesional de Oscar Alcalde. Frontend Developer y Analista Sr. de Soporte IT con 13+ años de experiencia. Especializado en React, JavaScript, Tailwind, ServiceNow, Intune.",
              isPartOf: {
                "@id": "https://oscar.alcalde.vercel.app/#website",
              },
              author: {
                "@id": "https://oscar.alcalde.vercel.app/#person",
              },
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://oscar.alcalde.vercel.app",
                  },
                ],
              },
              mainEntity: {
                "@id": "https://oscar.alcalde.vercel.app/#person",
              },
              inLanguage: "es-UY",
            }),
          }}
        />

        {/* Structured Data - ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Oscar Alonso - Frontend Developer",
              description:
                "Desarrollo web frontend especializado en React, Next.js y Tailwind. Servicios de desarrollo web enfocado en conversión.",
              url: "https://altasweb.uy",
              areaServed: {
                "@type": "Country",
                name: "Uruguay",
              },
              priceRange: "$$",
              knowsAbout: [
                "Frontend Development",
                "React",
                "Next.js",
                "Tailwind CSS",
                "Web Development",
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
            }),
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
