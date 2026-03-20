/**
 * Header component - the sticky top bar that stays visible while scrolling.
 */

import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { LanguageToggle } from "../buttons/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const { t, language } = useLanguage();
  const cvUrl = language === "EN" ? "/resume.pdf" : "/cv.pdf";
  
  return (
    <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-md -mx-4 px-4">
      <header className="h-[72px] flex items-center justify-end gap-3">
        <MyLinks />
        <LanguageToggle />
        <button 
          onClick={() => window.open(cvUrl)} 
          className="w-[100px] text-center border border-white text-white px-3 py-2 rounded text-xs font-medium hover:bg-white hover:text-zinc-900 transition-colors"
        >
          {t("resumeBtn")}
        </button>
      </header>
    </div>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4 mr-auto">
    <Link href="https://www.linkedin.com/in/oscar-alcalde/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400">
      <FaLinkedin />
    </Link>
    <Link href="https://github.com/oalcalde21" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-green-400">
      <FaGithub />
    </Link>
  </div>
);
