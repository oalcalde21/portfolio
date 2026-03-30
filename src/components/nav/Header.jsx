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
    <header className="h-[72px] px-4 flex items-center justify-between sticky top-0 z-20 bg-zinc-900/50 backdrop-blur-md">
      <MyLinks />
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <button 
          onClick={() => window.open(cvUrl)} 
          className="w-[120px] text-center border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-zinc-900 transition-colors"
        >
          {t("resumeBtn")}
        </button>
      </div>
    </header>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4">
    <Link href="https://www.linkedin.com/in/oscar-alcalde/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400">
      <FaLinkedin />
    </Link>
    <Link href="https://github.com/oalcalde21" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400">
      <FaGithub />
    </Link>
    <Link href="https://wa.me/59894299470" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400">
      <FaWhatsapp />
    </Link>
  </div>
);
