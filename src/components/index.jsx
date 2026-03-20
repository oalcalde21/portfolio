import React from "react";
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
  const { transitionKey, t } = useLanguage();
  
  return (
    <div className="grid grid-cols-[54px_1fr]">
      <SideBar />
      <main>
        <Header />
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
        <footer className="text-center text-zinc-500 text-sm py-4">
          {t("legalText")}
        </footer>
      </main>
    </div>
  );
};
