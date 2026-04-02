/**
 * LanguageToggle - the EN/ES switch button in the header.
 * 
 * This little button toggles between English and Spanish.
 * The active language is highlighted in green, and there's a subtle
 * sliding background effect that moves between EN and ES.
 * 
 * Uses twMerge to merge Tailwind classes cleanly with any custom classes
 * passed via the className prop.
 */

import { twMerge } from "tailwind-merge";
import { useLanguage } from "../../context/LanguageContext";

export const LanguageToggle = ({ className }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === "EN" ? "Spanish" : "English"}`}
      aria-pressed={language === "EN"}
      className={twMerge(
        `relative flex items-center justify-center w-16 h-7 rounded-full
        bg-zinc-800 border border-zinc-600 text-xs font-bold
        transition-all duration-300 hover:border-green-400 hover:bg-zinc-700
        overflow-hidden`,
        className
      )}
    >
      {/* Sliding background indicator */}
      <span
        className={`absolute top-0 bottom-0 transition-all duration-300 ${
          language === "EN" 
            ? "left-0 w-[calc(50%+2px)] rounded-r-none" 
            : "left-[calc(50%+2px)] w-[calc(50%-2px)] rounded-l-none"
        } bg-green-400/20`}
      />
      {/* EN | ES text */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-center w-full">
        <span className={`pl-1 ${language === "EN" ? "text-green-400" : "text-zinc-500"}`}>
          EN
        </span>
        <span className="text-zinc-600 select-none -ml-1 -mr-1">|</span>
        <span className={`${language === "ES" ? "text-green-400" : "text-zinc-500"}`}>
          ES
        </span>
      </span>
    </button>
  );
};
