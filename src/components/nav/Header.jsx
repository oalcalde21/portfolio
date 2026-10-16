/**
 * Header component - the sticky top bar that stays visible while scrolling.
 */

import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { LanguageToggle } from "../buttons/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const { t, language } = useLanguage();
  const cvUrl = language === "EN" ? "/resume.pdf" : "/cv.pdf";
  
  return (
    <header className="h-[72px] px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2 sticky top-0 z-20 bg-zinc-900/50 backdrop-blur-md">
      <MyLinks compact />
      <div className="flex items-center gap-1 sm:gap-3">
        <LanguageToggle />
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("resumeBtn")}
          className="sm:w-[120px] shrink-0 text-center border border-white text-white px-2 sm:px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          {t("resumeBtn")}
        </a>
      </div>
    </header>
  );
};

export const MyLinks = ({ compact = false }) => (
  <div className={`flex items-center text-lg ${compact ? "gap-1.5" : "gap-3"} sm:gap-4`}>
    <Link href="https://www.linkedin.com/in/oscar-alcalde/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-300 hover:text-green-400">
      <FaLinkedin />
    </Link>
    <Link href="https://github.com/oalcalde21" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-300 hover:text-green-400">
      <FaGithub />
    </Link>
    <Link href="https://wa.me/59894299470?text=Hola!%20llegue%20desde%20tu%20portfolio%20hasta%20vos" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-zinc-300 hover:text-green-400">
      <FaWhatsapp />
    </Link>
  </div>
);
