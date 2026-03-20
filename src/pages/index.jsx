/**
 * Main page component - this is the entry point for the Next.js app.
 * 
 * We use the Inter font from Google Fonts for the typography.
 * The HomPage component contains all the portfolio sections.
 */

import { Inter } from "next/font/google";
import { HomPage } from "@/components";

// Load Inter font with latin character support
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // The font class is applied here so it cascades to all children
    <main className={inter.className}>
      <HomPage />
    </main>
  );
}
