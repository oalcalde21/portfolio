/**
 * _app.jsx - Next.js app wrapper
 * 
 * This file wraps every page in the app. We're using it to:
 * 1. Import global styles
 * 2. Provide the LanguageContext to the entire app
 * 
 * The LanguageProvider makes the bilingual functionality available
 * to all components without having to pass props everywhere.
 */

import "@/styles/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  return (
    // LanguageProvider wraps everything so all components can use t() and toggleLanguage
    <LanguageProvider>
      <Component {...pageProps} />
      <Analytics />
    </LanguageProvider>
  );
}
