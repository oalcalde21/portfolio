/**
 * About section - tells visitors who Oscar is and what he's about.
 * 
 * Layout:
 * - Left side: text content with paragraphs about Oscar's background
 * - Right side: skill chips showing technologies (divided into work vs hobby)
 * 
 * The first paragraph has a special green "Hi!" or "ola!" prefix.
 * Links to social profiles are shown at the bottom of the text.
 */

import { AiOutlineArrowRight } from "react-icons/ai";
import { SectionHeader } from "../util/SectionHeader";
import Reveal from "../util/Reveal";
import { MyLinks } from "../nav/Header";
import { Stats } from "./Stats";
import { useLanguage } from "../../context/LanguageContext";

export const About = () => {
  const { t, language } = useLanguage();
  
  // EN shows "Hi!" in green, ES shows just "H" 
  // (the "ola!" continues in the paragraph text)
  const hiText = language === "EN" ? "Hi!" : "H";
  
  return (
    <section id="about" className="section-wrapper" aria-labelledby="about-heading">
      <SectionHeader title={t("aboutTitle")} dir="l" id="about-heading" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        {/* Left side: text content */}
        <div className="space-y-4">
          {/* First paragraph with special "Hi!" treatment */}
          <Reveal>
            <p className="leading-relaxed text-zinc-300">
              {/* Green "Hi!" or "H" box */}
              <span className="bg-green-400 text-white py-2 px-3 rounded font-bold mr-1 float-left text-2xl">
                {hiText}
              </span>
              {/* Rest of the paragraph, without "Hi!" for EN since it's in the box */}
              {language === "EN" ? t("aboutP1").replace("Hi! ", "") : t("aboutP1")}
            </p>
          </Reveal>
          
          {/* Remaining paragraphs */}
          <Reveal>
            <p className="leading-relaxed text-zinc-300">
              {t("aboutP2")}
            </p>
          </Reveal>
          <Reveal>
            <p className="leading-relaxed text-zinc-300">
              {t("aboutP3")}
            </p>
          </Reveal>
          <Reveal>
            <p className="leading-relaxed text-zinc-300">
              {t("aboutP4")}
            </p>
          </Reveal>
          
          {/* Social links section */}
          <Reveal>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-green-400">
                <span>{t("aboutMyLinks")}</span>
                <AiOutlineArrowRight aria-hidden="true" />
              </div>
              <MyLinks />
            </div>
          </Reveal>
        </div>
        
        {/* Right side: skill chips */}
        <Stats />
      </div>
    </section>
  );
};
