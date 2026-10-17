/**
 * Hero section - the first thing visitors see when they land on the page.
 * 
 * Contains:
 * - Big name with a green accent
 * - Typewriter animation showing roles (IT Support / Frontend Developer)
 * - Short tagline/description
 * - Contact button that scrolls down to the contact section
 * 
 * The decorative dot grid is in the background for visual interest.
 */

import Reveal from "../util/Reveal";
import DotGrid from "./DotGrid";
import { OutlineButton } from "../buttons/OutlineButton";
import { useLanguage } from "../../context/LanguageContext";
import { Typewriter } from "../util/Typewriter";
import { AiOutlinePause, AiOutlineCaretRight } from "react-icons/ai";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const Hero = ({ isTypewriterPaused, onToggleTypewriter }) => {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const animationLabel = reducedMotion === true
    ? t("typewriterReduced")
    : t(isTypewriterPaused ? "typewriterResume" : "typewriterPause");
  return (
    <section className="text-slat-100 overflow-hidden py-24 md:py-32" aria-label={t("heroLabel")}>
      <div className="relative">
        {/* Content layer - z-10 keeps it above the dot grid */}
        <div className="pointer-events-none relative z-10">
          <div className="relative w-fit max-w-full">
            {/* One reading surface; its feather stays outside every text box. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 bg-zinc-900/80"
              style={{
                maskImage: "linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent), linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 24px), transparent)",
                maskComposite: "intersect",
              }}
            />
            {/* Main heading: "Hi, I'm Oscar." */}
            <Reveal>
              <h1 className="pointer-events-auto text-4xl sm:text-6xl font-black text-zinc-100 md:text-8xl">
                {t("heroTitle")}{t("heroName")}<span className="text-green-400">.</span>
              </h1>
            </Reveal>
          
            {/* Typewriter effect: cycles through roles */}
            <Reveal>
              <h2 id="hero-roles" className="pointer-events-auto my-2 text-xl sm:text-2xl text-zinc-300 md:my-4 md:text-4xl">
                <Typewriter isPaused={isTypewriterPaused} reducedMotion={reducedMotion} />
              </h2>
            </Reveal>
          
            {/* Short description */}
            <Reveal>
              <p className="pointer-events-auto leading-relaxed md:leading-relaxed max-w-xl text-sm text-zinc-300 md:text-base">
                {t("heroDescription")}
              </p>
            </Reveal>
          
          </div>

          {/* Contact button - scrolls to contact section */}
          <Reveal>
            <div className="flex items-center gap-2">
              <OutlineButton
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView();
                }}
                className="pointer-events-auto before:bg-green-600 hover:text-zinc-950 hover:border-green-600 mt-4 bg-green-400 text-zinc-950 border-green-400 md:mt-6 focus-visible:ring-inset focus-visible:ring-zinc-950 focus-visible:ring-offset-0"
              >
                {t("contactBtn")}
              </OutlineButton>
              <button
                type="button"
                aria-label={animationLabel}
                title={animationLabel}
                aria-controls="hero-roles"
                aria-disabled={reducedMotion !== false}
                onClick={() => {
                  if (reducedMotion === false) onToggleTypewriter();
                }}
                className="pointer-events-auto mt-4 md:mt-6 flex size-8 shrink-0 items-center justify-center rounded-md border border-zinc-500 bg-zinc-900 text-zinc-300 hover:text-green-400 focus-visible:ring-inset focus-visible:ring-offset-0 aria-disabled:cursor-default aria-disabled:hover:text-zinc-300"
              >
                {isTypewriterPaused ? <AiOutlineCaretRight aria-hidden="true" /> : <AiOutlinePause aria-hidden="true" />}
              </button>
            </div>
          </Reveal>
        </div>
        
        {/* Background decorative dot grid */}
        <DotGrid />
      </div>
    </section>
  );
};

export default Hero;
