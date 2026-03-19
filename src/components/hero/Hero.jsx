import Reveal from "../util/Reveal";
import DotGrid from "./DotGrid";
import { OutlineButton } from "../buttons/OutlineButton";
import { useLanguage } from "../../context/LanguageContext";
import { Typewriter } from "../util/Typewriter";

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-slat-100 overflow-hidden py-24 md:py-32">
      <div className="relative">
        <div className="pointer-events-none relative z-10">
          <Reveal>
            <h1 className="pointer-events-auto text-4xl sm:text-6xl font-black text-zinc-100 md:text-8xl">
              {t("heroTitle")}{t("heroName")}<span className="text-green-400">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <h2 className="pointer-events-auto my-2 text-xl sm:text-2xl text-zinc-300 md:my-4 md:text-4xl">
              <Typewriter />
            </h2>
          </Reveal>
          <Reveal>
            <p className="pointer-events-auto leading-relaxed md:leading-relaxed max-w-xl text-sm text-zinc-300 md:text-base">
              {t("heroDescription")}
            </p>
          </Reveal>
          <Reveal>
            <OutlineButton
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView();
              }}
              className="pointer-events-auto before:bg-green-600 hover:text-white hover:border-green-600 mt-4 bg-green-400 text-zinc-100 border-green-400 md:mt-6"
            >
              {t("contactBtn")}
            </OutlineButton>
          </Reveal>
        </div>
        <DotGrid />
      </div>
    </section>
  );
};

export default Hero;
