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
        <title>Oscar Alcalde</title>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        {/* End Google Tag Manager */}

        {/* Primary Meta Tags */}
        <meta
          name="title"
          content="Oscar Alcalde - Help Desk & Frontend Developer | Uruguay"
        />
        <meta
          name="description"
          content="Portfolio of Oscar Alcalde - IT Help Desk Sr. Analyst with 13+ years experience changing now to Frontend Development. Specializing in React, JavaScript, and modern web technologies."
        />
        <meta
          name="keywords"
          content="Oscar Alcalde, Help Desk, Helpdesk, Frontend, Frontend Developer, IT Support, IT Specialist, React, JavaScript, Uruguay, Montevideo, ServiceNow, Intune, Web Developer, RCI Latin America"
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
        <meta property="og:url" content="https://oscaralcalde.dev/" />
        <meta
          property="og:title"
          content="Oscar Alcalde - Help Desk & Frontend Developer | Uruguay"
        />
        <meta
          property="og:description"
          content="IT Help Desk Sr. Analyst with 13+ years experience changing now to Frontend Development. View my projects and experience."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://oscaralcalde.dev/" />
        <meta
          name="twitter:title"
          content="Oscar Alcalde - Help Desk & Frontend Developer | Uruguay"
        />
        <meta
          name="twitter:description"
          content="IT Help Desk Sr. Analyst with 13+ years experience changing now to Frontend Development."
        />
        <meta name="twitter:image" content="/og-image.png" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://oscaralcalde.dev/" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Oscar Alcalde",
              url: "https://oscaralcalde.dev",
              sameAs: [
                "https://www.linkedin.com/in/oscar-alcalde/",
                "https://github.com/oalcalde21",
              ],
              jobTitle: "Sr. Help Desk Support Analyst",
              worksFor: {
                "@type": "Organization",
                name: "RCI Latinoamérica",
              },
              description:
                "IT Help Desk Sr. Analyst with 13+ years of experience, changing now to Frontend Development with skills in React, JavaScript, and modern web technologies.",
              knowsAbout: [
                "IT Support",
                "Help Desk",
                "ServiceNow",
                "Intune",
                "Frontend Development",
                "React",
                "JavaScript",
                "HTML",
                "CSS",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Montevideo",
                addressCountry: "UY",
              },
            }),
          }}
        />

        {/* Structured Data - Portfolio Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Oscar Alcalde Portfolio",
              url: "https://oscaralcalde.dev",
              description:
                "Personal portfolio of Oscar Alcalde - IT Professional changing now to Frontend Development",
              author: {
                "@type": "Person",
                name: "Oscar Alcalde",
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
