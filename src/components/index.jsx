/**
 * Main entry point for the HomePage component.
 * This file brings together all the main sections of the portfolio:
 * Hero, About, Projects, Experience, and Contact.
 * 
 * The grid layout gives us a sidebar on the left (54px wide) and the main 
 * content taking up the rest of the space. AnimatePresence handles the smooth
 * language transition when the user toggles between EN/ES.
 */

import React from "react";
// framer-motion handles the smooth fade animation when switching languages
import { AnimatePresence, motion } from "framer-motion";
import { SideBar } from "./nav/SideBar";
import { Header } from "./nav/Header";
import Hero from "./hero/Hero";
import { About } from "./about/About";
import { Projects } from "./projects/Projects";
import { Experience } from "./experience/Experience";
import { Contact } from "./contact/Contact";
import { useLanguage } from "../context/LanguageContext";

export const HomPage = () => {
  // transitionKey changes every time the language is toggled
  // this triggers the fade animation on all content
  const { transitionKey, t } = useLanguage();
  
  return (
    <div className="grid grid-cols-[54px_1fr]">
      {/* Vertical navigation sidebar - fixed width */}
      <SideBar />
      
      <main>
        {/* Sticky header with language toggle and resume button */}
        <Header />
        
        {/* This wrapper handles the language switch animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-5xl px-4 md:px-8 space-y-32 pb-24"
          >
            <Hero />
            <About />
            <Projects />
            <Experience />
            <Contact />
          </motion.div>
        </AnimatePresence>
        
        {/* Footer with copyright and credits */}
        <footer className="text-center text-zinc-500 text-sm py-4">
          {t("legalText")}
        </footer>
      </main>
    </div>
  );
};
