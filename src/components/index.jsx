/**
 * Main entry point for the HomePage component.
 * This file brings together all the main sections of the portfolio:
 * Hero, About, Projects, Experience, and Contact.
 * 
 * The grid layout gives us a sidebar on the left (54px wide) and the main 
 * content taking up the rest of the space. AnimatePresence handles the smooth
 * language transition when the user toggles between EN/ES.
 */

import React, { useEffect, useState } from "react";
// framer-motion handles the smooth fade animation when switching languages
import { AnimatePresence, motion, useAnimation, usePresence } from "framer-motion";
import { SideBar } from "./nav/SideBar";
import { Header } from "./nav/Header";
import Hero from "./hero/Hero";
import { About } from "./about/About";
import { Projects } from "./projects/Projects";
import { Experience } from "./experience/Experience";
import { Contact } from "./contact/Contact";
import { useLanguage } from "../context/LanguageContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export const HomPage = () => {
  // transitionKey changes every time the language is toggled
  // this triggers the fade animation on all content
  const { transitionKey, t } = useLanguage();
  const [isTypewriterPaused, setIsTypewriterPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  
  return (
    <div className="grid grid-cols-[54px_minmax(0,1fr)]">
      {/* Vertical navigation sidebar - fixed width */}
      <SideBar />
      
      <main id="main-content" className="min-w-0">
        {/* Sticky header with language toggle and resume button */}
        <Header />
        
        {/* This wrapper handles the language switch animation */}
        <AnimatePresence mode={reducedMotion ? "sync" : "wait"}>
          <LanguagePage key={transitionKey}>
            <Hero
              isTypewriterPaused={isTypewriterPaused}
              onToggleTypewriter={() => setIsTypewriterPaused((paused) => !paused)}
            />
            <About />
            <Projects />
            <Experience />
            <Contact />
          </LanguagePage>
        </AnimatePresence>
        
        {/* Footer with copyright and credits */}
        <footer className="text-center text-zinc-400 text-sm py-4">
          {t("legalText")}
        </footer>
      </main>
    </div>
  );
};

// An exiting page must still observe preference changes, even after its props freeze.
function LanguagePage({ children }) {
  const reducedMotion = usePrefersReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const controls = useAnimation();

  useEffect(() => {
    if (reducedMotion) {
      controls.stop();
      controls.set({ opacity: 1 });
      if (!isPresent) safeToRemove();
    } else if (isPresent) {
      controls.start({ opacity: 1 });
    }
  }, [controls, reducedMotion, isPresent, safeToRemove]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      exit={{ opacity: reducedMotion ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      onAnimationComplete={(definition) => {
        if (!isPresent && definition.opacity === 0) safeToRemove();
      }}
      className="motion-entrance mx-auto max-w-5xl px-4 md:px-8 space-y-32 pb-24"
    >
      {children}
    </motion.div>
  );
}
