import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Oscar Alcalde - IT Support Specialist & Frontend Developer" />
        <meta name="description" content="Portfolio of Oscar Alcalde - IT Support Sr. Analyst with 13+ years experience transitioning to Frontend Development. Specializing in React, JavaScript, and modern web technologies." />
        <meta name="keywords" content="Oscar Alcalde, IT Support, Frontend Developer, React, JavaScript, Uruguay, Montevideo, Help Desk, ServiceNow, Intune, Web Developer" />
        <meta name="author" content="Oscar Alcalde" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook - For social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oscaralcalde.dev/" />
        <meta property="og:title" content="Oscar Alcalde - IT Support Specialist & Frontend Developer" />
        <meta property="og:description" content="IT Support Sr. Analyst with 13+ years experience transitioning to Frontend Development. View my projects and experience." />
        <meta property="og:image" content="/og-image.svg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://oscaralcalde.dev/" />
        <meta name="twitter:title" content="Oscar Alcalde - IT Support Specialist & Frontend Developer" />
        <meta name="twitter:description" content="IT Support Sr. Analyst with 13+ years experience transitioning to Frontend Development." />
        <meta name="twitter:image" content="/og-image.svg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://oscaralcalde.dev/" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Oscar Alcalde",
              "url": "https://oscaralcalde.dev",
              "sameAs": [
                "https://www.linkedin.com/in/oscar-alcalde/",
                "https://github.com/oalcalde21"
              ],
              "jobTitle": "Sr. Help Desk Support Analyst",
              "worksFor": {
                "@type": "Organization",
                "name": "RCI Latinoamérica"
              },
              "description": "IT Support Sr. Analyst with 13+ years of experience, transitioning to Frontend Development with skills in React, JavaScript, and modern web technologies.",
              "knowsAbout": ["IT Support", "ServiceNow", "Intune", "Frontend Development", "React", "JavaScript", "HTML", "CSS"],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Montevideo",
                "addressCountry": "UY"
              }
            })
          }}
        />
        
        {/* Structured Data - Portfolio Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Oscar Alonso Portfolio",
              "url": "https://oscaralcalde.dev",
              "description": "Personal portfolio of Oscar Alcalde - IT Professional transitioning to Frontend Development",
              "author": {
                "@type": "Person",
                "name": "Oscar Alcalde"
              }
            })
          }}
        />
      </Head>
      <body id="root" className="bg-zinc-900 text-zinc-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
