import { AiOutlineArrowRight } from "react-icons/ai";
import { SectionHeader } from "../util/SectionHeader";
import Reveal from "../util/Reveal";
import { MyLinks } from "../nav/Header";
import { Stats } from "./Stats";
import { useLanguage } from "../../context/LanguageContext";

export const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="section-wrapper">
      <SectionHeader title={t("aboutTitle")} dir="l" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-4">
          <Reveal>
            <p className="leading-relaxed text-zinc-300">
              <span className="bg-green-400 text-white py-2 px-3 rounded font-bold mr-1 float-left text-2xl">
                H
              </span>
              {t("aboutP1")}
            </p>
          </Reveal>
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
          <Reveal>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-green-400">
                <span>{t("aboutMyLinks")}</span>
                <AiOutlineArrowRight />
              </div>
              <MyLinks />
            </div>
          </Reveal>
        </div>
        <Stats />
      </div>
    </section>
  );
};
