import { useState } from "react";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext";
import { Typewriter } from "../../src/components/util/Typewriter";
import { usePrefersReducedMotion } from "../../src/hooks/usePrefersReducedMotion";

export function MotionCase() {
  const [paused, setPaused] = useState(false);
  return (
    <LanguageProvider>
      <CaseContent paused={paused} setPaused={setPaused} />
    </LanguageProvider>
  );
}

function CaseContent({ paused, setPaused }) {
  const { toggleLanguage, transitionKey, language } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  return (
    <section data-preference={String(reducedMotion)} data-paused={paused}>
      <h2>
        <Typewriter key={transitionKey} isPaused={paused} reducedMotion={reducedMotion} />
      </h2>
      <button id="pause" onClick={() => setPaused((value) => !value)}>Pause/resume</button>
      <button id="language" onClick={toggleLanguage}>Language: {language}</button>
    </section>
  );
}
