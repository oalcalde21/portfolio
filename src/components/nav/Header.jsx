/**
 * Header component - the sticky top bar that stays visible while scrolling.
 * 
 * Contains:
 * - Social links (LinkedIn, GitHub) on the left
 * - Language toggle and Resume button on the right
 * 
 * The CV/Resume button changes based on language:
 * - English: opens resume.pdf
 * - Spanish: opens cv.pdf
 */

import Link from "next/link";
import React from "react";
// Social media icons from react-icons
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { LanguageToggle } from "../buttons/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const { t, language } = useLanguage();
  
  // Switch CV based on current language
  const cvUrl = language === "EN" ? "/resume.pdf" : "/cv.pdf";
  
  return (
    <header className="h-[72px] px-4 flex items-center justify-between sticky top-0 z-20 bg-zinc-900/50 backdrop-blur-md">
      {/* Social links (LinkedIn, GitHub) */}
      <MyLinks />
      
      {/* Right side: language toggle + CV button */}
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <OutlineButton onClick={() => window.open(cvUrl)}>
          {t("resumeBtn")}
        </OutlineButton>
      </div>
    </header>
  );
};

// Social links component - can be reused elsewhere if needed
export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4">
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://www.linkedin.com/in/oscar-alcalde/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaLinkedin />
    </Link>
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://github.com/oalcalde21"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaGithub />
    </Link>
  </div>
);
